# Testing

## Automatic tests (domain rules)

Prerequisito: Node.js installato.

Comando:

```bash
npm test
```

Copertura attuale:

- `tests/domain/acute-rules.test.js`
- `tests/domain/hemorrhagic-rules.test.js`

## Strategia

- I test verificano funzioni pure (input -> output), senza DOM.
- Le regole cliniche sono in `js/domain/`.
- `app-eligibility.js` usa queste regole per calcolare l'eligibility runtime.

## Estensioni consigliate

1. Aggiungere casi limite per ogni trial.
2. Aggiungere fixture cliniche riusabili (`tests/fixtures/`).
3. Coprire regressioni note con test dedicati prima di modificare regole.
