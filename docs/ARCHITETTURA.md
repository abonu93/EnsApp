# Architettura

## Panoramica

L'app usa una struttura a moduli JS caricati in sequenza da `index.html`.
Il modello resta browser-only (nessun bundler), con funzioni globali per compatibilita con gli handler inline nel markup.

## Dipendenze tra moduli

Ordine di caricamento richiesto:

1. `app-data.js`
2. `app-state.js`
3. `app-navigation.js`
4. `domain/acute-rules.js`
5. `domain/hemorrhagic-rules.js`
6. `app-eligibility.js`
7. `app-post-acute.js`
8. `app-share.js`
9. `app-trial-patient.js`
10. `app-modal-reset.js`

## Responsabilita

- **Data/config**: trial metadata, mapping per Google Sheet, link randomizzazione
- **State**: dati paziente e flag eligibility
- **Domain logic**: regole di eligibility e scoring
- **Domain test**: casi di regressione con `node:test` in `tests/domain/`
- **Presentation flow**: pagine, modal, summary, rendering dettagli trial
- **Integration**: invio payload verso Google Apps Script

## Convenzioni correnti

- Nessuna dipendenza esterna JS
- Funzioni globali per mantenere compatibilita con `onclick`
- Stato mutabile centralizzato in variabili top-level (`preData`, `eligibility`, ecc.)

## Debito tecnico residuo

- Test automatici presenti ma non ancora completi su tutti i trial
- Persistenza locale assente (state solo in memoria)
- Logica business ancora fortemente accoppiata al DOM
- Strings/UI e regole cliniche nello stesso livello
