# Contributing

## Branching strategy

Il progetto usa tre tipi di branch:

- **`main`** -> versione **live / produzione**. Sempre stabile, mai modificato direttamente.
- **`develop`** -> branch di **integrazione**. Qui confluiscono tutte le nuove feature/fix prima di andare in produzione.
- **`feature/...`** o **`fix/...`** -> branch temporanei per ogni singolo task, creati a partire da `develop`.

### Flusso tipico

```
main  (live)  <--- merge quando develop e' stabile e testato
  ^
develop  (integrazione)  <--- merge dei branch di lavoro tramite PR
  ^
feature/nome-task   fix/nome-bug
```

### Comandi base

```bash
# 1. Allineati a develop
git checkout develop
git pull origin develop

# 2. Crea un branch per il task
git checkout -b feature/nome-descrittivo

# 3. Lavora, committa, pusha
git add .
git commit -m "descrizione chiara"
git push -u origin feature/nome-descrittivo

# 4. Apri una Pull Request su GitHub: feature/... -> develop
# 5. Quando develop e' pronto per la release: PR develop -> main
```

### Regole

- Non pushare mai direttamente su `main`.
- Non pushare direttamente su `develop`: usa sempre una Pull Request.
- Un branch = un task (feature o fix). PR piccole e a tema unico.
- Cancella il branch dopo il merge (GitHub offre il bottone "Delete branch").

## Workflow consigliato

1. Crea un branch per task (`feature/...` o `fix/...`) **a partire da `develop`**.
2. Lavora su un solo modulo per PR quando possibile.
3. Aggiorna sempre la documentazione in `docs/` se cambi flussi o regole.
4. Testa manualmente i percorsi critici prima di chiudere.

## Comandi locali

```bash
npm run dev            # dev server con hot reload (Vite)
npm run check          # type check (svelte-check)
npm test               # unit + golden + parity tests (Vitest)
npm run test:e2e       # E2E + a11y mobile (Playwright)
npm run test:all       # check + unit + e2e (gate completo locale)
npm run build          # build prod in dist/
npm run preview        # serve dist/ a 127.0.0.1:4173
```

## CI / CD

Su ogni PR verso `develop` o `main` GitHub Actions esegue:
- type check + 211 unit test + build (job `test`)
- 18 test E2E con axe-core a11y scan (job `e2e`)

Su push a `develop` o `main`, deploy preview automatico su GitHub Pages
(workflow `pages.yml`). URL: `https://abonu93.github.io/EnsApp/`.

## Checklist PR

- [ ] Nessuna regressione nei flussi principali
- [ ] Regole di eligibility verificate con almeno un caso positivo e uno negativo
- [ ] Mapping `buildTrialsForSheet` coerente con i trial visibili in UI
- [ ] `npm run test:all` verde locale
- [ ] Docs aggiornate
- [ ] Bundle prod sotto 100 kB gz

## Linee guida codice

- Mantieni le funzioni piccole e con una responsabilita chiara.
- Se introduci nuova logica clinica, isolala in funzioni pure quando possibile.
- Evita side-effect nascosti: aggiorna lo stato in punti espliciti.
- Usa naming uniforme tra UI, state e payload (es: `sovateltide` vs label UI).

## Test manuali minimi

- Percorso ischemico con candidato EVT
- Percorso ischemico non candidato EVT
- Percorso emorragico
- Salvataggio su sheet (acuto / chronic / trial patient)
- Copia/condivisione messaggio
- Reset completo app
