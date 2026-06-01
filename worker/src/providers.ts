// Provider AI. UNICO file da toccare per cambiare modello/provider.
// Default: Google Gemini (free tier). Alternativa: Groq (Llama, free tier).

export interface ContextChunk {
  docId: string;
  docName: string;
  chunkId: string;
  page: number;
  text: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface Env {
  GEMINI_API_KEY?: string;
  GROQ_API_KEY?: string;
  PROVIDER?: string;
  GEMINI_MODEL?: string;
  GROQ_MODEL?: string;
  ALLOWED_ORIGINS?: string;
}

const LANG: Record<string, string> = {
  it: "italiano",
  es: "español",
  ca: "català",
  en: "English",
};

export function buildSystemPrompt(locale: string): string {
  const lang = LANG[locale] ?? "español";
  return [
    "Sei un assistente che risponde a domande sui protocolli di studi clinici.",
    "Rispondi ESCLUSIVAMENTE in base agli estratti (SOURCES) forniti qui sotto.",
    "Se l'informazione non è presente negli estratti, dillo chiaramente e non inventare.",
    "Quando affermi qualcosa, indica il documento e la pagina da cui proviene.",
    `Rispondi in ${lang}.`,
  ].join(" ");
}

function formatSources(context: ContextChunk[]): string {
  if (context.length === 0) return "(nessun estratto disponibile)";
  return context
    .map(
      (c, i) =>
        `[${i + 1}] ${c.docName} — pag. ${c.page}\n${c.text}`
    )
    .join("\n\n");
}

export interface ProviderResult {
  answer: string;
}

/** Chiamata a Google Gemini (generateContent). */
async function callGemini(
  messages: ChatTurn[],
  context: ContextChunk[],
  locale: string,
  env: Env
): Promise<ProviderResult> {
  const model = env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const system = buildSystemPrompt(locale);
  const sources = formatSources(context);

  // L'ultimo turno utente porta con sé le SOURCES; gli altri turni danno contesto conversazionale.
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

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const answer =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  return { answer };
}

/** Chiamata a Groq (OpenAI-compatible chat completions). */
async function callGroq(
  messages: ChatTurn[],
  context: ContextChunk[],
  locale: string,
  env: Env
): Promise<ProviderResult> {
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

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return { answer: data.choices?.[0]?.message?.content ?? "" };
}

export function callProvider(
  messages: ChatTurn[],
  context: ContextChunk[],
  locale: string,
  env: Env
): Promise<ProviderResult> {
  if ((env.PROVIDER ?? "gemini").toLowerCase() === "groq") {
    return callGroq(messages, context, locale, env);
  }
  return callGemini(messages, context, locale, env);
}
