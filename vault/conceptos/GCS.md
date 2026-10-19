---
tipo: concepto
alias: [Glasgow Coma Scale, Escala de coma de Glasgow, Glasgow]
actualizado: 2026-10-19
---
# GCS

## Definizione
Scala del livello di coscienza da 3 a 15, somma di apertura degli occhi, risposta verbale e risposta motoria. Nell'emorragia intracerebrale è un fattore prognostico indipendente insieme a volume dell'ICH, IVH, età e sede infratentoriale ([[FASTEST — Protocolo — V10.5]], p. 8). Fa parte dell'ICH score.

## Come lo usano gli studi
| Studio | Uso / soglia | Fonte |
|---|---|---|
| [[FASTEST]] | Esclusione: GCS 3–7, quindi serve GCS ≥8. Misurato solo al basale; un GCS basale <8 esclude dall'analisi per protocollo | ([[FASTEST — Protocolo — V10.5]], p. 24, p. 26, p. 28, p. 31) |

## Note
- Nell'app il GCS si inserisce nella scheda emorragica (`src/routes/PostImaging.svelte:235-236`, cursore 3–15) e alimenta il calcolo dell'ICH score (`src/lib/components/HIchCard.svelte:17-19`).
- Attenzione al verso delle soglie: "esclusione 3–7" e "≥8" sono equivalenti, ma un "GCS >7" scritto nel foglio può essere letto male.
