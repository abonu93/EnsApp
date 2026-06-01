# EnsApp Assistant — Worker proxy

Proxy serverless (Cloudflare Worker) che inoltra le richieste del chatbot al
modello AI. La chiave API resta lato server: il browser non la vede mai.

## Setup

```bash
cd worker
npm install
```

### Chiave API (segreto)

Il provider di default è **Google Gemini** (free tier). Ottieni una API key da
https://aistudio.google.com/apikey, poi:

```bash
npx wrangler secret put GEMINI_API_KEY   # produzione
```

Per lo sviluppo locale crea `worker/.dev.vars` (gitignored):

```
GEMINI_API_KEY=la-tua-chiave
```

## Sviluppo locale

```bash
npm run dev        # Worker su http://localhost:8787
```

Nel frontend (root del repo) imposta in `.env.local`:

```
VITE_PROXY_URL=http://localhost:8787
```

## Deploy

```bash
npm run deploy
```

Dopo il deploy:

1. Copia l'URL del Worker e impostalo come `VITE_PROXY_URL` nel build del
   frontend (o come default in `src/lib/chat/api.ts`).
2. In `wrangler.toml` imposta `ALLOWED_ORIGINS` con l'origine di GitHub Pages
   e `http://localhost:5173`, poi rifai il deploy.

## Cambiare modello/provider

- Default: `gemini-2.0-flash` (free tier, contesto ampio).
- Per usare **Groq** (Llama, free tier): in `wrangler.toml` `PROVIDER = "groq"`,
  imposta il secret `GROQ_API_KEY`, eventualmente `GROQ_MODEL`.
- La logica di chiamata è isolata in `src/providers.ts` — unico file da toccare.
