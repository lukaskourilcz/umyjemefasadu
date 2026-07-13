/**
 * Serverless funkce (Vercel) — uloží upravený obsah z administrace.
 *
 * Přijme z administrace (/dev) JSON:
 *   { password, content, uploads: [{ path, dataUrl }] }
 * a jedním commitem zapíše do GitHub repozitáře:
 *   - public/content.json  (texty a odkazy na obrázky)
 *   - public/media/...      (nově nahrané fotky a videa)
 * Commit spustí automatické nasazení na Vercelu, takže se změny během
 * chvíle objeví všem návštěvníkům. Žádná databáze není potřeba.
 *
 * Nastavení (Vercel → Project → Settings → Environment Variables):
 *   GITHUB_TOKEN    – Personal Access Token s právem zápisu do repa (obsah).
 *   GITHUB_REPO     – "owner/repo", např. "lukaskourilcz/umyjemefasadu".
 *   GITHUB_BRANCH   – větev, výchozí "main".
 *   ADMIN_PASSWORD  – heslo do administrace, výchozí "fasada".
 */

const GH = "https://api.github.com";

async function gh(token, path, method, body) {
  const res = await fetch(`${GH}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "umyjeme-fasadu-admin",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data && data.message ? data.message : `GitHub ${res.status}`;
    throw new Error(`GitHub API: ${msg}`);
  }
  return data;
}

function dataUrlToBase64(dataUrl) {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}

/** Bezpečná cesta uvnitř public/media (žádné ../ a jen povolené znaky). */
function safeMediaRepoPath(p) {
  const clean = String(p).replace(/^\/+/, "");
  if (!clean.startsWith("media/")) return null;
  if (clean.includes("..")) return null;
  if (!/^media\/[A-Za-z0-9._-]+$/.test(clean)) return null;
  return `public/${clean}`;
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Použijte POST." });
    return;
  }

  let payload = req.body;
  if (payload == null) {
    // Vercel tělo nepredzpracoval — přečteme ho ze streamu.
    const raw = await readRawBody(req);
    payload = raw;
  }
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      res.status(400).json({ error: "Neplatný JSON." });
      return;
    }
  }
  payload = payload || {};

  const adminPassword = process.env.ADMIN_PASSWORD || "fasada";
  if (payload.password !== adminPassword) {
    res.status(401).json({ error: "Nesprávné heslo." });
    return;
  }

  if (!payload.content || typeof payload.content !== "object") {
    res.status(400).json({ error: "Chybí obsah ke uložení." });
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    res.status(500).json({
      error:
        "Server není nastaven. Doplňte proměnné prostředí GITHUB_TOKEN a GITHUB_REPO na Vercelu.",
    });
    return;
  }

  // Sestavíme seznam souborů k zápisu.
  const files = [
    {
      repoPath: "public/content.json",
      base64: Buffer.from(
        JSON.stringify(payload.content, null, 2),
        "utf-8",
      ).toString("base64"),
    },
  ];

  const uploads = Array.isArray(payload.uploads) ? payload.uploads : [];
  for (const up of uploads) {
    if (!up || typeof up.path !== "string" || typeof up.dataUrl !== "string") {
      res.status(400).json({ error: "Neplatný nahraný soubor." });
      return;
    }
    const repoPath = safeMediaRepoPath(up.path);
    if (!repoPath) {
      res.status(400).json({ error: `Nepovolená cesta souboru: ${up.path}` });
      return;
    }
    files.push({ repoPath, base64: dataUrlToBase64(up.dataUrl) });
  }

  try {
    // 1) Aktuální stav větve
    const ref = await gh(token, `/repos/${repo}/git/ref/heads/${branch}`, "GET");
    const latestCommitSha = ref.object.sha;
    const latestCommit = await gh(
      token,
      `/repos/${repo}/git/commits/${latestCommitSha}`,
      "GET",
    );
    const baseTreeSha = latestCommit.tree.sha;

    // 2) Blob pro každý soubor
    const treeItems = [];
    for (const f of files) {
      const blob = await gh(token, `/repos/${repo}/git/blobs`, "POST", {
        content: f.base64,
        encoding: "base64",
      });
      treeItems.push({
        path: f.repoPath,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
    }

    // 3) Nový strom
    const tree = await gh(token, `/repos/${repo}/git/trees`, "POST", {
      base_tree: baseTreeSha,
      tree: treeItems,
    });

    // 4) Nový commit
    const commit = await gh(token, `/repos/${repo}/git/commits`, "POST", {
      message: `Aktualizace obsahu webu z administrace (${files.length} soubor(ů))`,
      tree: tree.sha,
      parents: [latestCommitSha],
    });

    // 5) Posun větve
    await gh(token, `/repos/${repo}/git/refs/heads/${branch}`, "PATCH", {
      sha: commit.sha,
    });

    res.status(200).json({ ok: true, commit: commit.sha, files: files.length });
  } catch (err) {
    res.status(500).json({ error: err.message || "Uložení selhalo." });
  }
}
