import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var ${name} (see .env.example)`);
  return v;
}

export const config = {
  telegramToken: required("TELEGRAM_BOT_TOKEN"),
  allowedUserIds: required("ALLOWED_TELEGRAM_USER_IDS")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number),
  model: process.env.CLAUDE_MODEL || "opus",
  maxBudgetUsd: Number(process.env.MAX_BUDGET_USD ?? "5"),
  maxTurns: Number(process.env.MAX_TURNS ?? "40"),
};

export type RepoMap = Record<string, string>;

/** Loads the repo-name -> absolute-local-path map from repos.json. */
export function loadRepos(): RepoMap {
  const path = resolve(process.cwd(), "repos.json");
  try {
    return JSON.parse(readFileSync(path, "utf8")) as RepoMap;
  } catch (err) {
    throw new Error(
      `Could not read repos.json at ${path}. Copy repos.example.json to repos.json and fill in your paths. (${(err as Error).message})`,
    );
  }
}
