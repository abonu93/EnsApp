# Roadmap Refactor

## Fase 1 - Stabilizzazione (fatta)

- Separazione di `index.html` da CSS e JS
- Split JS in moduli funzionali
- Introduzione documentazione base per lavoro team

## Fase 2 - Hardening regole cliniche

- Estrarre eligibility in funzioni pure (input -> output) - avviato
- Definire un set di casi clinici di regressione - avviato
- Ampliare la copertura test automatici (`node:test`) su tutti i trial

## Fase 3 - Layering applicativo

- Creare un layer `domain/` per regole cliniche
- Creare un layer `ui/` per rendering e binding eventi
- Ridurre dipendenza diretta dal DOM dentro la business logic

## Fase 4 - Robustezza e qualita

- Validazione input centralizzata
- Gestione errori uniforme
- Logging tecnico minimale per debug
- Migliorare naming e consistenza lessicale (IT/EN)

## Fase 5 - Evoluzione piattaforma

- Valutare passaggio a TypeScript
- Valutare build system (Vite) solo se necessario
- Introdurre CI con lint + test + check formale docs

## Priorita operativa

1. Proteggere la correttezza delle regole di eligibility
2. Evitare regressioni nei flussi clinici reali
3. Migliorare leggibilita e velocita di intervento del team
