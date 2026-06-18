import { config } from "./config";

const API = `https://api.telegram.org/bot${config.telegramToken}`;

export interface TgMessage {
  message_id: number;
  from?: { id: number; username?: string; first_name?: string };
  chat: { id: number };
  text?: string;
}

interface TgUpdate {
  update_id: number;
  message?: TgMessage;
}

/** Long-polls Telegram for new updates starting at `offset`. */
export async function getUpdates(offset: number): Promise<TgUpdate[]> {
  const res = await fetch(`${API}/getUpdates?timeout=30&offset=${offset}`, {
    // Telegram holds the request up to 30s; give the socket a little more.
    signal: AbortSignal.timeout(35_000),
  });
  const data = (await res.json()) as { ok: boolean; result: TgUpdate[]; description?: string };
  if (!data.ok) throw new Error(`getUpdates failed: ${data.description ?? "unknown error"}`);
  return data.result;
}

/** Sends a text message, splitting nothing but truncating past Telegram's 4096-char cap. */
export async function sendMessage(chatId: number, text: string): Promise<void> {
  const body = text.length > 4000 ? text.slice(0, 3990) + "\n…(truncated)" : text;
  await fetch(`${API}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: body, disable_web_page_preview: true }),
  });
}
