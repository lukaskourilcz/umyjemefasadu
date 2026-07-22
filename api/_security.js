import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "uf_admin_session";
export const ADMIN_BODY_LIMIT = 4_200_000;

const rateBuckets = new Map();

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export function setPrivateResponse(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
}

export function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "");
  return forwarded.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

/** Best-effort per-instance limiter. Production docs also require a durable limiter. */
export function consumeRateLimit(key, limit, windowMs) {
  const now = Date.now();
  if (rateBuckets.size > 5_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  if (current.count > limit) return false;
  return true;
}

export function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;
  try {
    const parsed = new URL(origin);
    const forwardedProtocol = String(req.headers["x-forwarded-proto"] || "")
      .split(",")[0]
      .trim();
    const expectedProtocol = forwardedProtocol || (host.startsWith("localhost") ? "http" : "https");
    return parsed.host === host && parsed.protocol === `${expectedProtocol}:`;
  } catch {
    return false;
  }
}

export function parseCookies(req) {
  const header = String(req.headers.cookie || "");
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        if (separator < 0) return [part, ""];
        return [part.slice(0, separator), decodeURIComponent(part.slice(separator + 1))];
      }),
  );
}

function signature(secret, value) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(a, b) {
  const left = createHash("sha256").update(String(a)).digest();
  const right = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(left, right);
}

export function passwordMatches(candidate, expected) {
  return safeEqual(candidate, expected);
}

export function createSessionCookie(secret, req, maxAgeSeconds = 8 * 60 * 60) {
  const expires = Math.floor(Date.now() / 1000) + maxAgeSeconds;
  const token = `${expires}.${randomBytes(18).toString("base64url")}`;
  const value = `${token}.${signature(secret, token)}`;
  const secure =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    String(req.headers["x-forwarded-proto"] || "").split(",")[0] === "https";
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    secure ? "Secure" : "",
    `Max-Age=${maxAgeSeconds}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function clearSessionCookie(req) {
  const secure =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    String(req.headers["x-forwarded-proto"] || "").split(",")[0] === "https";
  return [
    `${SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    secure ? "Secure" : "",
    "Max-Age=0",
  ]
    .filter(Boolean)
    .join("; ");
}

export function hasValidSession(req, secret) {
  if (!secret) return false;
  const value = parseCookies(req)[SESSION_COOKIE];
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [expiresRaw, nonce, supplied] = parts;
  if (!/^\d{10}$/.test(expiresRaw) || !/^[A-Za-z0-9_-]{20,}$/.test(nonce)) {
    return false;
  }
  if (Number(expiresRaw) <= Math.floor(Date.now() / 1000)) return false;
  return safeEqual(supplied, signature(secret, `${expiresRaw}.${nonce}`));
}

export async function readJsonBody(req, maxBytes = 100_000) {
  const declared = Number(req.headers["content-length"] || 0);
  if (declared > maxBytes) throw new HttpError(413, "Požadavek je příliš velký.");

  let raw = req.body;
  if (raw == null) {
    raw = await new Promise((resolve, reject) => {
      const chunks = [];
      let size = 0;
      req.on("data", (chunk) => {
        size += chunk.length;
        if (size > maxBytes) {
          reject(new HttpError(413, "Požadavek je příliš velký."));
          req.destroy();
          return;
        }
        chunks.push(chunk);
      });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }

  if (typeof raw === "object" && !Buffer.isBuffer(raw)) {
    if (Buffer.byteLength(JSON.stringify(raw)) > maxBytes) {
      throw new HttpError(413, "Požadavek je příliš velký.");
    }
    return raw;
  }

  const text = Buffer.isBuffer(raw) ? raw.toString("utf8") : String(raw || "");
  if (Buffer.byteLength(text) > maxBytes) {
    throw new HttpError(413, "Požadavek je příliš velký.");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "Neplatný JSON.");
  }
}
