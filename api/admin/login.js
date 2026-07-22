import {
  createSessionCookie,
  clientIp,
  consumeRateLimit,
  HttpError,
  isSameOrigin,
  passwordMatches,
  readJsonBody,
  setPrivateResponse,
} from "../_security.js";
import { currentHead } from "../_github.js";

export default async function handler(req, res) {
  setPrivateResponse(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Použijte POST." });
    return;
  }
  if (!isSameOrigin(req)) {
    res.status(403).json({ error: "Požadavek nemá platný původ." });
    return;
  }
  if (!consumeRateLimit(`admin-login:${clientIp(req)}`, 6, 15 * 60_000)) {
    res.status(429).json({ error: "Příliš mnoho pokusů. Zkuste to později." });
    return;
  }

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!expected || !secret || secret.length < 32) {
    res.status(503).json({ error: "Administrace není na serveru nakonfigurována." });
    return;
  }

  try {
    const payload = await readJsonBody(req, 2_000);
    if (!passwordMatches(String(payload?.password || ""), expected)) {
      res.status(401).json({ error: "Nesprávné heslo." });
      return;
    }
    let baseCommitSha = null;
    try {
      baseCommitSha = await currentHead();
    } catch (error) {
      console.error("Unable to read publishing head during login", error);
    }
    res.setHeader("Set-Cookie", createSessionCookie(secret, req));
    res.status(200).json({ ok: true, baseCommitSha });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    res.status(status).json({ error: status === 500 ? "Přihlášení selhalo." : error.message });
  }
}
