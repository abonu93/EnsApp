// Store dei messaggi della chat, persistito in localStorage (leggero: solo testo).
// I documenti/indici pesanti stanno in IndexedDB (vedi chatDocuments.ts / idb.ts).

import { persisted } from "./persistence";
import type { Citation } from "$lib/chat/api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  ts: number;
}

const MAX_MESSAGES = 100;

function isMessage(m: unknown): m is ChatMessage {
  if (!m || typeof m !== "object") return false;
  const x = m as Record<string, unknown>;
  return (
    typeof x.id === "string" &&
    (x.role === "user" || x.role === "assistant") &&
    typeof x.content === "string" &&
    typeof x.ts === "number"
  );
}

export const chatMessages = persisted<ChatMessage[]>({
  key: "ensapp:chat:v1",
  initial: [],
  validate: (raw) => (Array.isArray(raw) && raw.every(isMessage) ? (raw as ChatMessage[]) : null),
});

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function appendMessage(msg: Omit<ChatMessage, "id" | "ts">): ChatMessage {
  const full: ChatMessage = { ...msg, id: newId(), ts: Date.now() };
  chatMessages.update((list) => [...list, full].slice(-MAX_MESSAGES));
  return full;
}

export function clearChat(): void {
  chatMessages.set([]);
}
