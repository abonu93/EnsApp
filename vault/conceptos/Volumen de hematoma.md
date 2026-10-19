---
tipo: concepto
alias: [ABC/2, Volumen ICH, ICH volume, Volume dell'ematoma, Hematoma volume]
actualizado: 2026-10-19
---
# Volumen de hematoma

## Definizione
Volume dell'emorragia intraparenchimale in mL, di solito stimato con il metodo **ABC/2**: A, B e C sono i tre diametri perpendicolari dell'ematoma in cm e il prodotto si divide per 2. In alternativa si usa un software volumetrico. È uno dei principali predittori di mortalità ed esito dopo ICH, insieme alla crescita dell'ematoma e al volume dell'IVH ([[FASTEST — Protocolo — V10.5]], p. 8).

## Come lo usano gli studi
| Studio | Uso / soglia | Fonte |
|---|---|---|
| [[FASTEST]] | Inclusione se ICH ≥2 e <60 mL. Misura locale con ABC/2 o software con marcatura FDA/CE (sperimentatore certificato); il core lab misura la crescita a 24 h. IVH a parte: esclusi un ventricolo laterale pieno per ≥2/3 o entrambi per ≥1/3 | ([[FASTEST — Protocolo — V10.5]], p. 24, p. 26–28) |

## Note
- Il volume dell'**IVH** non si somma all'ICH per la soglia di eleggibilità; si misura a parte. Endpoint come "crescita ICH+IVH" li sommano.
- Nell'app il volume si inserisce con il quadrante `HVolDial` (0–120 mL, con opzione "non disponibile") in `src/routes/PostImaging.svelte:232`.
