import { config, loadRepos, type RepoMap } from "./config";
import { getUpdates, sendMessage, type TgMessage } from "./telegram";
import { runTask } from "./runner";

const repos: RepoMap = loadRepos();
const running = new Set<string>(); // repo names with an in-flight task

function isAuthorized(msg: TgMessage): boolean {
  const id = msg.from?.id;
  return id != null && config.allowedUserIds.includes(id);
}

const HELP = [
  "🤖 Claude task bridge",
  "",
  "/repos — list configured repos",
  "/task <repo> <instructions> — run a coding task",
  "",
  "Example:",
  "/task fasadu add a contact form to the homepage",
].join("\n");

async function handleTask(chatId: number, rest: string): Promise<void> {
  const sp = rest.indexOf(" ");
  if (sp === -1) {
    await sendMessage(chatId, "Usage: /task <repo> <instructions>");
    return;
  }
  const repoName = rest.slice(0, sp).trim();
  const instructions = rest.slice(sp + 1).trim();

  const repoPath = repos[repoName];
  if (!repoPath) {
    await sendMessage(chatId, `Unknown repo "${repoName}". Try /repos.`);
    return;
  }
  if (!instructions) {
    await sendMessage(chatId, "Please include instructions after the repo name.");
    return;
  }
  if (running.has(repoName)) {
    await sendMessage(chatId, `⏳ A task is already running for "${repoName}". Try again when it finishes.`);
    return;
  }

  running.add(repoName);
  await sendMessage(chatId, `🚀 Starting task on "${repoName}"…`);

  // Throttle progress so a chatty agent doesn't flood the chat.
  let lastSent = 0;
  const onProgress = (line: string) => {
    const now = Date.now();
    if (now - lastSent > 8_000) {
      lastSent = now;
      void sendMessage(chatId, line.slice(0, 500));
    }
  };

  try {
    const r = await runTask(repoPath, instructions, onProgress);
    const parts = [
      r.ok ? "✅ Task finished" : "⚠️ Task ended with errors",
      `Branch: ${r.branch}`,
      r.pushed ? "Pushed to origin ✔" : "Not pushed — check the daemon logs",
      r.costUsd != null ? `Cost: $${r.costUsd.toFixed(2)}` : "",
      "",
      r.summary,
    ].filter(Boolean);
    await sendMessage(chatId, parts.join("\n"));
  } catch (err) {
    await sendMessage(chatId, `❌ ${(err as Error).message}`);
  } finally {
    running.delete(repoName);
  }
}

async function handleMessage(msg: TgMessage): Promise<void> {
  const chatId = msg.chat.id;
  if (!isAuthorized(msg)) {
    console.warn(`Rejected message from unauthorized user ${msg.from?.id} (@${msg.from?.username ?? "?"})`);
    return; // stay silent to strangers
  }

  const text = (msg.text ?? "").trim();
  if (!text) return;

  if (text === "/start" || text === "/help") {
    await sendMessage(chatId, HELP);
  } else if (text === "/repos") {
    const list = Object.keys(repos).map((n) => `• ${n}`).join("\n") || "(none configured)";
    await sendMessage(chatId, `Configured repos:\n${list}`);
  } else if (text.startsWith("/task")) {
    await handleTask(chatId, text.slice("/task".length).trim());
  } else {
    await sendMessage(chatId, "Unrecognized command. Send /help.");
  }
}

async function main(): Promise<void> {
  console.log(
    `Bridge up. ${Object.keys(repos).length} repo(s), ${config.allowedUserIds.length} authorized user(s).`,
  );

  // Drain backlog so old commands aren't replayed after a restart.
  let offset = 0;
  const backlog = await getUpdates(offset).catch(() => []);
  if (backlog.length) offset = backlog[backlog.length - 1].update_id + 1;

  // Main long-poll loop. Messages are handled fire-and-forget so a long-running
  // task doesn't block polling (e.g. /repos still works while a task runs).
  while (true) {
    try {
      const updates = await getUpdates(offset);
      for (const u of updates) {
        offset = u.update_id + 1;
        if (u.message) void handleMessage(u.message);
      }
    } catch (err) {
      console.error("poll error:", (err as Error).message);
      await new Promise((r) => setTimeout(r, 2_000));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
