import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** Runs a git command in `cwd` and returns trimmed stdout. */
export async function git(cwd: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout.trim();
}

/**
 * Creates and checks out a fresh `claude/<timestamp>-<slug>` branch off the
 * current branch. Refuses to run on a dirty working tree so a task never mixes
 * with uncommitted local work. Best-effort fast-forward pull first.
 */
export async function prepareBranch(cwd: string, slug: string): Promise<string> {
  const status = await git(cwd, ["status", "--porcelain"]);
  if (status) {
    throw new Error("working tree is not clean — commit or stash your changes first");
  }

  const base = await git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  try {
    await git(cwd, ["pull", "--ff-only", "origin", base]);
  } catch {
    // offline, or no upstream — proceed from the current local state
  }

  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T-]/g, "");
  const branch = `claude/${stamp}-${slug}`.slice(0, 60);
  await git(cwd, ["checkout", "-b", branch]);
  return branch;
}

/** True if `origin/<branch>` exists locally (i.e. the push succeeded). */
export async function branchWasPushed(cwd: string, branch: string): Promise<boolean> {
  try {
    await git(cwd, ["rev-parse", "--verify", `origin/${branch}`]);
    return true;
  } catch {
    return false;
  }
}
