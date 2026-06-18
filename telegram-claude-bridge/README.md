# telegram-claude-bridge

Kick off Claude coding tasks across your local git repos from a Telegram chat.

A small Node/TypeScript daemon that runs on your laptop. It **long-polls** the
Telegram Bot API (so it works behind home NAT — no public URL or webhook), and
when you send a `/task`, it runs Claude headlessly (via the
[`@anthropic-ai/claude-agent-sdk`](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk))
against the matching repo on a fresh branch, then commits, pushes, and reports back.

```
Telegram  ──getUpdates (long-poll)──▶  daemon  ──▶  Claude Agent SDK  ──▶  your repo
   ▲                                                                          │
   └──────────────────  result + branch name  ◀──────────────────────────────┘
```

> This folder is self-contained. Lift it into its own repository — it does not
> belong to the project it currently lives in.

## Security — read first

This daemon lets a chat app run an autonomous agent against your code with
`git push`. Treat it accordingly:

- **Allow-list yourself.** Only the numeric Telegram user IDs in
  `ALLOWED_TELEGRAM_USER_IDS` are accepted; everyone else is silently ignored.
  Get your ID from [@userinfobot](https://t.me/userinfobot).
- **Rotate any leaked bot token.** If a token has ever been pasted anywhere,
  revoke it in @BotFather (`/mybots → API Token → Revoke`) and use the new one.
- **Keep secrets out of git.** `.env` and `repos.json` are git-ignored.
- The agent runs in `bypassPermissions` mode so it can run git non-interactively.
  It works on a throwaway `claude/…` branch and refuses to start on a dirty
  working tree, but you should still review every pushed branch before merging.

## Setup

Requires Node 18+ (uses the global `fetch` / `AbortSignal.timeout`).

```bash
cd telegram-claude-bridge
npm install

cp .env.example .env            # fill in token + your Telegram user id
cp repos.example.json repos.json # map repo names -> absolute local paths
```

`.env`:

| Var | Notes |
|-----|-------|
| `TELEGRAM_BOT_TOKEN` | from @BotFather |
| `ALLOWED_TELEGRAM_USER_IDS` | comma-separated numeric IDs (from @userinfobot) |
| `ANTHROPIC_API_KEY` | optional — leave empty to use your Claude subscription |
| `CLAUDE_MODEL` | optional, default `opus` |
| `MAX_BUDGET_USD` | optional per-task spend cap, default `5` |
| `MAX_TURNS` | optional per-task turn cap, default `40` |

`repos.json` — the local checkouts the bot can act on:

```json
{
  "fasadu": "/home/you/projects/umyjemefasadu",
  "blog": "/home/you/projects/blog"
}
```

## Run

```bash
npm start          # foreground
npm run dev        # auto-restart on edits
```

Then message your bot:

```
/repos
/task fasadu add a contact form to the homepage and validate the email field
```

You'll get progress pings, then a final summary with the branch name. Open the
PR from GitHub (or extend the daemon to open it for you).

### Keep it always-on

The laptop must be awake and online for the bot to respond. To keep the daemon
running in the background:

- **macOS:** a `launchd` user agent, or `pm2 start "npm start" --name claude-bridge`
- **Linux:** a `systemd --user` service, or `pm2`
- Disable App Nap / sleep, or run it on a small always-on box instead.

## Commands

| Command | Action |
|---------|--------|
| `/help` | usage |
| `/repos` | list configured repos |
| `/task <repo> <instructions>` | run a coding task on that repo |

## Extending

- **Open PRs automatically** after push (GitHub API / `gh`).
- **Queue** tasks per repo instead of rejecting when one is in flight.
- **Stream richer progress** (file diffs, tool detail) from the SDK message loop.
- **`/cancel`** to abort an in-flight task.
