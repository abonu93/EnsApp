// Cloudflare Pages Function: proxy AI servito dallo STESSO dominio dell'app
// (es. https://ensapp.pages.dev/api/chat). Same-origin: niente CORS/SSL.
// Si aggiorna automaticamente ad ogni push (collegato a GitHub).
//
// Variabili (progetto Pages > Settings > Variables and Secrets):
//   - Text    PROVIDER        = groq            (oppure "gemini")
//   - Secret  GROQ_API_KEY     = chiave Groq     (se PROVIDER=groq)
//   - Secret  GEMINI_API_KEY   = chiave Gemini   (se PROVIDER=gemini)
//   - Text    GROQ_MODEL       = llama-3.3-70b-versatile   (opzionale)
//   - Text    GEMINI_MODEL     = gemini-2.0-flash           (opzionale)
//   - Text    ALLOWED_ORIGINS  = https://abonu93.github.io,https://ensapp.pages.dev

function buildSystemPrompt() {
  return [
    "Sei un assistente esperto che aiuta un medico/ricercatore a capire i protocolli di studi clinici.",
    "Usa gli ESTRATTI (SOURCES) forniti come fonte principale e prioritaria di verità sul protocollo caricato.",
    "Rispondi in modo completo, chiaro e ragionato, sintetizzando le informazioni tra i vari estratti; non limitarti a citare, spiega.",
    "Puoi usare la tua conoscenza medica generale per spiegare termini, sigle, contesto e implicazioni, ma distingui ciò che proviene dal protocollo da ciò che è conoscenza generale.",
    "Se un dettaglio specifico non è presente negli estratti, dillo con onestà, ma cerca comunque di essere il più utile possibile.",
    "Quando riporti un dato preciso del protocollo, indica documento e pagina.",
    "MOLTO IMPORTANTE: rispondi SEMPRE nella stessa lingua usata dall'utente nella sua ultima domanda.",
  ].join(" ");
}

function formatSources(context) {
  if (!context.length) return "(nessun estratto disponibile)";
  return context
    .map((c, i) => `[${i + 1}] ${c.docName} — pag. ${c.page}\n${c.text}`)
    .join("\n\n");
}

async function callGemini(messages, context, env) {
  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
  const sources = formatSources(context);

  const contents = messages.map((m, i) => {
    const isLastUser = i === messages.length - 1 && m.role === "user";
    const text = isLastUser ? `SOURCES:\n${sources}\n\nDOMANDA:\n${m.content}` : m.content;
    return { role: m.role === "assistant" ? "model" : "user", parts: [{ text }] };
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  return parts.map((p) => p.text || "").join("");
}

async function callGroq(messages, context, env) {
  const model = env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const sources = formatSources(context);

  const chat = [
    { role: "system", content: buildSystemPrompt() },
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
    body: JSON.stringify({ model, messages: chat, temperature: 0.3, max_tokens: 2048 }),
  });

  if (!res.ok) throw new Error(`Groq ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

function callProvider(messages, context, env) {
  if ((env.PROVIDER || "gemini").toLowerCase() === "groq") {
    return callGroq(messages, context, env);
  }
  return callGemini(messages, context, env);
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
  const ctx = Array.isArray(body.context) ? body.context : [];
  if (!messages.length) return json({ error: "Missing messages" }, 400, cors);

  const provider = (env.PROVIDER || "gemini").toLowerCase();
  if (provider === "gemini" && !env.GEMINI_API_KEY)
    return json({ error: "Server missing GEMINI_API_KEY" }, 500, cors);
  if (provider === "groq" && !env.GROQ_API_KEY)
    return json({ error: "Server missing GROQ_API_KEY" }, 500, cors);

  try {
    const answer = await callProvider(messages, ctx, env);
    // Citazioni: fonti uniche per documento+pagina, al massimo 8.
    const seen = new Set();
    const citations = [];
    for (const c of ctx) {
      const key = `${c.docName}|${c.page}`;
      if (seen.has(key)) continue;
      seen.add(key);
      citations.push({ docName: c.docName, page: c.page, chunkId: c.chunkId });
      if (citations.length >= 8) break;
    }
    return json({ answer, citations, grounded: ctx.length > 0 }, 200, cors);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Upstream error" }, 502, cors);
  }
}
