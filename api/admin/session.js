import { hasValidSession, setPrivateResponse } from "../_security.js";
import { currentHead } from "../_github.js";

export default async function handler(req, res) {
  setPrivateResponse(res);
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Použijte GET." });
    return;
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32 || !hasValidSession(req, secret)) {
    res.status(401).json({ authenticated: false });
    return;
  }
  let baseCommitSha = null;
  try {
    baseCommitSha = await currentHead();
  } catch (error) {
    console.error("Unable to read publishing head during session check", error);
  }
  res.status(200).json({ authenticated: true, baseCommitSha });
}
