// Cloudflare Worker: proxy verso il modello AI per l'assistente di EnsApp.
// La chiave API resta qui (secret), mai nel browser.
//
// Contratto (POST JSON):
//   { messages:[{role,content}], context:[{docId,docName,chunkId,page,text}], locale }
// Risposta:
//   { answer, citations:[{docName,page,chunkId}], grounded } | { error }

import { callProvider, type ChatTurn, type ContextChunk, type Env } from "./providers";

interface RequestBody {
  messages?: ChatTurn[];
  context?: ContextChunk[];
  locale?: string;
}

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  // Se non configurato, in sviluppo si accetta qualsiasi origine.
  const allowOrigin =
    allowed.length === 0
      ? origin ?? "*"
      : origin && allowed.includes(origin)
        ? origin
        : allowed[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    let body: RequestBody;
    try {
      body = (await request.json()) as RequestBody;
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = Array.isArray(body.context) ? body.context : [];
    const locale = typeof body.locale === "string" ? body.locale : "es";

    if (messages.length === 0) {
      return json({ error: "Missing messages" }, 400, cors);
    }

    const provider = (env.PROVIDER ?? "gemini").toLowerCase();
    if (provider === "gemini" && !env.GEMINI_API_KEY) {
      return json({ error: "Server missing GEMINI_API_KEY" }, 500, cors);
    }
    if (provider === "groq" && !env.GROQ_API_KEY) {
      return json({ error: "Server missing GROQ_API_KEY" }, 500, cors);
    }

    try {
      const { answer } = await callProvider(messages, context, locale, env);
      // Citazioni v1: si rimandano gli estratti forniti come fonti consultate.
      const citations = context.map((c) => ({
        docName: c.docName,
        page: c.page,
        chunkId: c.chunkId,
      }));
      return json({ answer, citations, grounded: context.length > 0 }, 200, cors);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upstream error";
      return json({ error: message }, 502, cors);
    }
  },
};
