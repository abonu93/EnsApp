// ============================================================================
// EnsApp Assistant — Worker "tutto-in-uno" per la DASHBOARD Cloudflare.
//
// Questo file e' una versione autocontenuta (un solo file, JavaScript puro)
// pensata per essere COPIATA E INCOLLATA nell'editor di Cloudflare quando si
// crea un Worker dal browser (Compute > Workers & Pages > Create).
//
// La versione "vera" (TypeScript, src/index.ts + src/providers.ts) resta per
// chi deploya da terminale con wrangler. Le due fanno la stessa cosa.
//
// CONFIGURAZIONE (nella dashboard: Worker > Settings > Variables and Secrets):
//   - Secret  GEMINI_API_KEY  = la tua chiave Google Gemini   (tipo: Secret)
//   - Text    PROVIDER        = gemini
//   - Text    GEMINI_MODEL    = gemini-2.0-flash
//   - Text    ALLOWED_ORIGINS = https://abonu93.github.io      (origini CORS)
// ============================================================================

const LANG = {
  it: "italiano",
  es: "español",
  ca: "català",
  en: "English",
};

function buildSystemPrompt(locale) {
  const lang = LANG[locale] || "español";
  return [
    "Sei un assistente che risponde a domande sui protocolli di studi clinici.",
    "Rispondi ESCLUSIVAMENTE in base agli estratti (SOURCES) forniti qui sotto.",
    "Se l'informazione non è presente negli estratti, dillo chiaramente e non inventare.",
    "Quando affermi qualcosa, indica il documento e la pagina da cui proviene.",
    `Rispondi in ${lang}.`,
  ].join(" ");
}

function formatSources(context) {
  if (!context.length) return "(nessun estratto disponibile)";
  return context
    .map((c, i) => `[${i + 1}] ${c.docName} — pag. ${c.page}\n${c.text}`)
    .join("\n\n");
}

async function callGemini(messages, context, locale, env) {
  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
  const system = buildSystemPrompt(locale);
  const sources = formatSources(context);

  const contents = messages.map((m, i) => {
    const isLastUser = i === messages.length - 1 && m.role === "user";
    const text = isLastUser
      ? `SOURCES:\n${sources}\n\nDOMANDA:\n${m.content}`
      : m.content;
    return { role: m.role === "assistant" ? "model" : "user", parts: [{ text }] };
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("");
}

// Groq (API compatibile OpenAI). Free tier con limiti generosi.
async function callGroq(messages, context, locale, env) {
  const model = env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const system = buildSystemPrompt(locale);
  const sources = formatSources(context);

  const chat = [
    { role: "system", content: system },
    ...messages.map((m, i) => {
      const isLastUser = i === messages.length - 1 && m.role === "user";
      return {
        role: m.role,
        content: isLastUser ? `SOURCES:\n${sources}\n\nDOMANDA:\n${m.content}` : m.content,
      };
    }),
  ];

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model, messages: chat, temperature: 0.2 }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq ${res.status}: ${detail.slice(0, 300)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

function callProvider(messages, context, locale, env) {
  if ((env.PROVIDER || "gemini").toLowerCase() === "groq") {
    return callGroq(messages, context, locale, env);
  }
  return callGemini(messages, context, locale, env);
}

function corsHeaders(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  const allowOrigin =
    allowed.length === 0
      ? origin || "*"
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

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = Array.isArray(body.context) ? body.context : [];
    const locale = typeof body.locale === "string" ? body.locale : "es";

    if (!messages.length) return json({ error: "Missing messages" }, 400, cors);

    const provider = (env.PROVIDER || "gemini").toLowerCase();
    if (provider === "gemini" && !env.GEMINI_API_KEY)
      return json({ error: "Server missing GEMINI_API_KEY" }, 500, cors);
    if (provider === "groq" && !env.GROQ_API_KEY)
      return json({ error: "Server missing GROQ_API_KEY" }, 500, cors);

    try {
      const answer = await callProvider(messages, context, locale, env);
      const citations = context.map((c) => ({
        docName: c.docName,
        page: c.page,
        chunkId: c.chunkId,
      }));
      return json({ answer, citations, grounded: context.length > 0 }, 200, cors);
    } catch (e) {
      return json({ error: e instanceof Error ? e.message : "Upstream error" }, 502, cors);
    }
  },
};
