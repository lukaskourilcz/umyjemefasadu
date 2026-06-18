import { query } from "@anthropic-ai/claude-agent-sdk";
import { config } from "./config";
import { prepareBranch, branchWasPushed } from "./git";

export interface TaskResult {
  ok: boolean;
  branch: string;
  summary: string;
  costUsd?: number;
  pushed: boolean;
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24) || "task"
  );
}

/**
 * Prepares a branch, then runs Claude headlessly against the repo to implement
 * `instructions`, commit, and push. Streams human-readable progress via
 * `onProgress`. Uses bypassPermissions so the agent can run git non-interactively.
 */
export async function runTask(
  repoPath: string,
  instructions: string,
  onProgress: (line: string) => void,
): Promise<TaskResult> {
  const branch = await prepareBranch(repoPath, slugify(instructions));

  const prompt = [
    "You are an autonomous coding agent working inside a git repository.",
    `You are already on a fresh branch named "${branch}".`,
    "Carry out the task below. When you are done:",
    "1. Make the necessary code changes.",
    "2. Commit them with a clear, descriptive message.",
    `3. Push the branch: git push -u origin ${branch}`,
    "4. Finish with a concise summary of what you changed and why.",
    "If anything is ambiguous, choose the most reasonable interpretation and state your assumptions.",
    "",
    "TASK:",
    instructions,
  ].join("\n");

  const stream = query({
    prompt,
    options: {
      cwd: repoPath,
      model: config.model,
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
      maxTurns: config.maxTurns,
      maxBudgetUsd: config.maxBudgetUsd,
    },
  });

  let summary = "";
  let costUsd: number | undefined;
  let ok = false;

  // The SDK yields typed messages; we read a small, stable subset defensively.
  for await (const message of stream as AsyncIterable<any>) {
    if (message.type === "assistant") {
      for (const block of message.message?.content ?? []) {
        if (block.type === "text" && block.text?.trim()) {
          onProgress(block.text.trim());
        } else if (block.type === "tool_use" && block.name) {
          onProgress(`🔧 ${block.name}`);
        }
      }
    } else if (message.type === "result") {
      ok = message.subtype === "success";
      summary = message.result ?? "";
      costUsd = message.total_cost_usd;
    }
  }

  const pushed = await branchWasPushed(repoPath, branch);
  return { ok, branch, summary, costUsd, pushed };
}
