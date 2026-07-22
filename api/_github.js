const GITHUB_API = "https://api.github.com";

export function githubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error("GitHub publishing is not configured");
  }
  return { token, repo, branch };
}

export async function githubRequest(token, path, method = "GET", body) {
  const response = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "umyjeme-fasadu-admin",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (!response.ok) {
    console.error("GitHub API error", response.status, data?.message || "unknown");
    throw new Error(`GitHub request failed (${response.status})`);
  }
  return data;
}

export async function currentHead(config = githubConfig()) {
  const branchPath = config.branch
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const ref = await githubRequest(
    config.token,
    `/repos/${config.repo}/git/ref/heads/${branchPath}`,
  );
  return ref.object.sha;
}
