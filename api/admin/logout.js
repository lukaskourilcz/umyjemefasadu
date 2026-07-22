import {
  clearSessionCookie,
  isSameOrigin,
  setPrivateResponse,
} from "../_security.js";

export default function handler(req, res) {
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
  res.setHeader("Set-Cookie", clearSessionCookie(req));
  res.status(200).json({ ok: true });
}
