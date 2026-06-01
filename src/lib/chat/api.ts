// Client del proxy serverless (Cloudflare Worker) che inoltra al modello AI.
// La chiave API vive solo lato Worker: qui non c'e' nessun segreto.
//
// L'URL del proxy si configura via VITE_PROXY_URL (build/dev); in mancanza,
// usa il default sotto (da sostituire con l'URL del Worker deployato).

import type { Locale } from "$lib/i18n";

// Proxy AI servito come Cloudflare Pages Function sullo stesso dominio dell'app
// (vedi functions/api/chat.js). Stesso dominio = niente problemi di CORS/SSL.
// Override possibile via VITE_PROXY_URL.
const DEFAULT_PROXY_URL = "https://ensapp.pages.dev/api/chat";

function proxyUrl(): string {
  return import.meta.env.VITE_PROXY_URL || DEFAULT_PROXY_URL;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ContextChunk {
  docId: string;
  docName: string;
  chunkId: string;
  page: number;
  text: string;
}

export interface Citation {
  docName: string;
  page: number;
  chunkId: string;
}

export interface AssistantRequest {
  messages: ChatTurn[];
  context: ContextChunk[];
  locale: Locale;
}

export interface AssistantResponse {
  answer: string;
  citations: Citation[];
  grounded: boolean;
}

export class AssistantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AssistantError";
  }
}

/** Invia la richiesta al proxy e normalizza la risposta. */
export async function askAssistant(req: AssistantRequest): Promise<AssistantResponse> {
  let res: Response;
  try {
    res = await fetch(proxyUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
  } catch (e) {
    throw new AssistantError(e instanceof Error ? e.message : "network");
  }

  if (!res.ok) {
    let reason = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) reason = body.error;
    } catch {
      // corpo non-JSON: tieni lo status
    }
    throw new AssistantError(reason);
  }

  const data = (await res.json()) as Partial<AssistantResponse>;
  return {
    answer: typeof data.answer === "string" ? data.answer : "",
    citations: Array.isArray(data.citations) ? data.citations : [],
    grounded: Boolean(data.grounded),
  };
}
