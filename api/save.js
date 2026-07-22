/**
 * Authenticated content publication endpoint.
 *
 * The browser never receives the admin password or GitHub token. A valid,
 * server-signed HttpOnly session and same-origin request are required. The
 * client also submits the Git head it opened, so a stale editor cannot silently
 * overwrite a newer publication.
 */
import { currentHead, githubConfig, githubRequest } from "./_github.js";
import {
  ADMIN_BODY_LIMIT,
  hasValidSession,
  HttpError,
  isSameOrigin,
  readJsonBody,
  setPrivateResponse,
} from "./_security.js";
import { validateContent, validateUpload } from "./_validation.js";

const MAX_UPLOADS = 4;
const MAX_UPLOAD_BYTES = 2_900_000;

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

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32 || !hasValidSession(req, secret)) {
    res.status(401).json({ error: "Přihlášení vypršelo. Přihlaste se znovu." });
    return;
  }

  try {
    const payload = await readJsonBody(req, ADMIN_BODY_LIMIT);
    const contentResult = validateContent(payload?.content);
    if (!contentResult.ok) {
      res.status(400).json({
        error: "Obsah neprošel kontrolou. Opravte označená data nebo obnovte stránku.",
        details: contentResult.errors,
      });
      return;
    }

    const baseCommitSha = String(payload?.baseCommitSha || "");
    if (!/^[a-f0-9]{40}$/i.test(baseCommitSha)) {
      res.status(409).json({
        error: "Nelze ověřit publikovanou verzi. Obnovte administraci a zkuste to znovu.",
      });
      return;
    }

    const uploads = Array.isArray(payload?.uploads) ? payload.uploads : [];
    if (uploads.length > MAX_UPLOADS) {
      res.status(413).json({ error: `Najednou lze publikovat nejvýše ${MAX_UPLOADS} soubory.` });
      return;
    }

    const files = [
      {
        repoPath: "public/content.json",
        base64: Buffer.from(JSON.stringify(payload.content, null, 2), "utf8").toString("base64"),
      },
    ];
    let uploadBytes = 0;
    for (const upload of uploads) {
      const result = validateUpload(upload);
      if (!result.ok) {
        res.status(400).json({ error: result.error });
        return;
      }
      uploadBytes += result.bytes;
      if (uploadBytes > MAX_UPLOAD_BYTES) {
        res.status(413).json({ error: "Nahrané soubory jsou pro jednu publikaci příliš velké." });
        return;
      }
      files.push({ repoPath: result.repoPath, base64: result.base64 });
    }

    const config = githubConfig();
    const latestCommitSha = await currentHead(config);
    if (latestCommitSha !== baseCommitSha) {
      res.status(409).json({
        error:
          "Web mezitím změnil někdo jiný. Vaše úpravy zůstaly v konceptu; obnovte stránku a změny porovnejte.",
      });
      return;
    }

    const latestCommit = await githubRequest(
      config.token,
      `/repos/${config.repo}/git/commits/${latestCommitSha}`,
    );
    const treeItems = [];
    for (const file of files) {
      const blob = await githubRequest(config.token, `/repos/${config.repo}/git/blobs`, "POST", {
        content: file.base64,
        encoding: "base64",
      });
      treeItems.push({
        path: file.repoPath,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
    }

    const tree = await githubRequest(config.token, `/repos/${config.repo}/git/trees`, "POST", {
      base_tree: latestCommit.tree.sha,
      tree: treeItems,
    });
    const commit = await githubRequest(config.token, `/repos/${config.repo}/git/commits`, "POST", {
      message: `Aktualizace obsahu webu z administrace (${files.length} soubor(ů))`,
      tree: tree.sha,
      parents: [latestCommitSha],
    });
    const branchPath = config.branch
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    await githubRequest(
      config.token,
      `/repos/${config.repo}/git/refs/heads/${branchPath}`,
      "PATCH",
      { sha: commit.sha, force: false },
    );

    res.status(200).json({ ok: true, commit: commit.sha, files: files.length });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    console.error("Admin publication failed", error);
    res.status(status).json({
      error:
        status === 500
          ? "Publikaci se nepodařilo dokončit. Zkuste to později nebo kontaktujte správce."
          : error.message,
    });
  }
}
