# EnsApp - Clinical Trial Assignment

Web app per assegnare pazienti con ictus (acuto / emorragico / post-acuto) ai trial clinici disponibili. Mobile-first, accessibile WCAG 2.1 AA, tri-lingua IT/EN/ES.

## Stack

- **Frontend**: Svelte 5 + Vite 6 + TypeScript strict
- **Routing**: svelte-spa-router (hash-based, deploy ovunque sia static hosting)
- **Stato**: Svelte stores con persistenza localStorage (TTL 24h, versioning)
- **i18n**: dizionari it/en/es senza dipendenze, locale persistito
- **Testing**: Vitest (unit + golden + parity) + Playwright (E2E + axe-core a11y)
- **Bundle**: ~60 kB gz (budget 100 kB)

## Avvio

```bash
npm install
npm run dev            # dev server (Vite, hot reload)
```

Apri http://localhost:5173

## Comandi

```bash
npm run check          # type check
npm test               # 211 unit + golden + parity (Vitest)
npm run test:e2e       # 18 E2E + a11y mobile (Playwright)
npm run test:all       # gate completo
npm run build          # build prod
npm run preview        # serve dist/
```

## Struttura

```
src/
  routes/              # 13 schermate SPA
  lib/
    components/        # 14 componenti atomici accessibili
    stores/            # patient, eligibility (derived), trialSelection, theme, locale
    domain/            # acute-rules, hemorrhagic-rules, trials-info, sheet-payload, vessels
    validation/        # framework + rules atomiche
    i18n/              # it/en/es
    router/            # mappa route + focus management
    a11y/              # focus trap, live region
    styles/            # tokens (light/dark), reset, global
tests/
  domain/              # unit + golden cases (regressione clinica vs legacy)
  validation/          # framework
  e2e/                 # Playwright: a11y + flussi clinici + sheet intercept
tools/
  generate-golden-cases.mjs   # rigenera fixture dal codice legacy
  screenshot.mjs              # snapshot visivi
legacy/                # codice originale (read-only, rimosso a fine Fase 4)
```

## Branch del repository

- **`main`** -> versione **live** (produzione). Sempre stabile.
- **`develop`** -> branch di **integrazione**. Qui confluiscono le modifiche prima di andare in produzione.
- **`feature/...`** / **`fix/...`** -> branch temporanei per ogni task, creati da `develop`.

Flusso completo in [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## CI / CD

Su ogni PR, GitHub Actions esegue (workflow `.github/workflows/ci.yml`):
- `npm run check` + `npm test` + `npm run build`
- `npm run test:e2e` (a11y scan WCAG 2.1 AA su 11 route + 5 test funzionali)

Push su `develop` o `main` deploya preview su GitHub Pages (`pages.yml`).

## Vincoli clinici invarianti

- Le regole di dominio in `src/lib/domain/{acute,hemorrhagic}-rules.ts` sono porting 1:1 del codice legacy. **NON** modificare la semantica senza aggiornare anche `tests/domain/fixtures/golden-cases.json` e verificare con almeno 10 casi clinici reali.
- Il payload `buildTrialsForSheet` -> Apps Script ha snapshot parity test contro il codice legacy in `tests/domain/sheet-payload.test.ts`. **NON** modificare lo shape senza coordinarsi con il backend.

## Documentazione di supporto

- [Architettura](docs/ARCHITETTURA.md)
- [Contribuzione](docs/CONTRIBUTING.md)
- [Roadmap Refactor](docs/ROADMAP_REFACTOR.md)
- [Testing](docs/TESTING.md)
