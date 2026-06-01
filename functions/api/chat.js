// Cloudflare Pages Function: proxy AI servito dallo STESSO dominio dell'app
// (es. https://ensapp.pages.dev/api/chat). Evita il sotto-dominio workers.dev
// (problemi di certificato) e, essendo same-origin, evita anche il CORS.
//
// Cloudflare Pages monta automaticamente la cartella functions/ : questo file
// risponde su /api/chat. Le variabili (chiave inclusa) si impostano nel
// progetto Pages: Settings > Variables and Secrets.
//   - Secret  GEMINI_API_KEY  = chiave Google Gemini
//   - Text    PROVIDER        = gemini
//   - Text    GEMINI_MODEL    = gemini-2.0-flash
//   - Text    ALLOWED_ORIGINS = https://abonu93.github.io,https://ensapp.pages.dev

const LANG = { it: "italiano", es: "español", ca: "català", en: "English" };

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

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsHeaders(origin, context.env) });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin");
  const cors = corsHeaders(origin, env);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, cors);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const context_ = Array.isArray(body.context) ? body.context : [];
  const locale = typeof body.locale === "string" ? body.locale : "es";

  if (!messages.length) return json({ error: "Missing messages" }, 400, cors);
  if (!env.GEMINI_API_KEY) return json({ error: "Server missing GEMINI_API_KEY" }, 500, cors);

  try {
    const answer = await callGemini(messages, context_, locale, env);
    const citations = context_.map((c) => ({
      docName: c.docName,
      page: c.page,
      chunkId: c.chunkId,
    }));
    return json({ answer, citations, grounded: context_.length > 0 }, 200, cors);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Upstream error" }, 502, cors);
  }
}
