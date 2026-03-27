# EnsApp - Clinical Trial Assignment

Applicazione web per supportare l'assegnazione dei pazienti agli studi clinici.

## Obiettivo della riorganizzazione

Il progetto era monolitico (`index.html` con HTML/CSS/JS nello stesso file). Ora e stato separato in moduli per facilitare manutenzione, debug e sviluppo incrementale.

## Struttura attuale

- `index.html`: solo markup e inclusione asset
- `css/app.css`: stili dell'app
- `js/app-data.js`: costanti e configurazioni (trial, link, mapping sheet)
- `js/app-state.js`: stato globale dell'app
- `js/app-navigation.js`: navigazione pagine e dettaglio criteri trial
- `js/app-eligibility.js`: logica pre/post imaging e eligibility acuta
- `js/app-post-acute.js`: logica post-acuta (Librexia)
- `js/app-share.js`: costruzione messaggi e salvataggio in sheet (flusso acuto/chronic)
- `js/app-trial-patient.js`: flusso "patient from trial"
- `js/app-modal-reset.js`: modal, reset stato e info
- `js/domain/acute-rules.js`: regole pure per eligibility ischemica
- `js/domain/hemorrhagic-rules.js`: regole pure per eligibility emorragica
- `tests/domain/*.test.js`: test automatici delle regole pure
- `docs/`: documentazione di lavoro

## Come avviare

1. Apri `index.html` nel browser.
2. Verifica i flussi principali:
   - Nuovo paziente (pre + post imaging)
   - Summary e selezione studi
   - Share/Save Google Sheet
   - Flusso post-acuto
   - Flusso da Trial

## Test automatici

Prerequisito: Node.js installato.

1. Esegui `npm test`
2. I test coprono le regole pure in `js/domain/`

## Documentazione di supporto

- [Architettura](docs/ARCHITETTURA.md)
- [Contribuzione](docs/CONTRIBUTING.md)
- [Roadmap Refactor](docs/ROADMAP_REFACTOR.md)
- [Testing](docs/TESTING.md)
