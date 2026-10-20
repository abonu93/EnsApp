---
tipo: concepto
alias: [Core, Core isquémico, Ischemic core, Core volume, "Volume del core", "Volumen central", Large core]
actualizado: 2026-10-19
---
# Volumen del core

## Definizione
Volume (in mL o cc) del tessuto cerebrale considerato già infartuato in modo irreversibile al momento dell'imaging basale. Si stima con la TC-perfusione (di solito CBF relativo <30%), con la RM-DWI o, più di recente, con software automatici sulla TC senza contrasto. Molti studi lo usano come soglia di eleggibilità al posto o accanto all'[[ASPECTS]], spesso insieme al [[Mismatch de perfusión|mismatch]] ([[DONE SYMPLE — Protocolo — v4]], p. 29–31, p. 36).

## Come lo usano gli studi
| Studio | Uso / soglia | Fonte |
|---|---|---|
| [[DONE SYMPLE]] | Inclusione: **core ≤70 cc** "por un algoritmo de aprendizaje profundo de software automatizado" su TC senza contrasto; strati 0–30 vs >30–70 cc. Nessuna perfusione richiesta. L'app non lo controlla | ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 40, p. 46) |
| [[VANISH]] | Criterio di tessuto: core ≤70 mL + mismatch (nessun criterio ASPECTS) | ([[VANISH — Protocolo — v1.2]], p. 17–18) |
| [[ORION]] | Inclusione (se si fa la perfusione, obbligatoria oltre 6 h): core <70 mL con rapporto >1,2 e mismatch ≥10 mL. Esclusione: core >70 mL su DWI o TC-perfusione | ([[ORION — Protocolo — v2.2]], p. 46–47) |
| [[TENACITY]] | Esclusione: DWI ≥70 mL o core ≥70 mL in TC-perfusione (oppure ASPECTS 0–6 o ipodensità intensa). È l'unico core chiesto dall'app (`largeCore`, scheda TENACITY) | ([[TENACITY — Protocolo — V1.0]], p. 30–31) |
| [[ARTEMIS]] | Inclusione: ASPECTS 6–10; se c'è valutazione automatica, anche core ≤50 cc su TC-perfusione o DWI-RM | ([[ARTEMIS — Protocolo — V03]], p. 25) |
| [[ATHENA]] | Inclusione 9: core ≤50 mL su TC/RM-perfusione **oppure** ASPECTS 6–10 | ([[ATHENA — Protocolo — v2.3]], p. 34) |
| [[SAIL-MeVO]] | Inclusione: ASPECTS ≥6 **e**, se disponibile il software di IA su TC senza contrasto (Methinks), **AI-ICV <10 mL**; se si fa la TC-perfusione, ipoperfusione Tmax >6 s **>30 mL**. La sinossi CEIm V1.0 chiede il core IA <10 mL senza condizioni. Studio non in app; `largeCore` (≥70 mL) non serve | ([[SAIL-MeVO — Protocolo — V2.1]], p. 21–23, p. 28; [[SAIL-MeVO — Sinopsis — V1.0]], §Población) |

## Note
- Attenzione al confine: "≤70", "<70" e "≥70 escluso" non coincidono sul valore di 70 mL esatti (ORION lo lascia non assegnato).
- La metodica conta: core su perfusione, su DWI e da software su TC senza contrasto non sono intercambiabili. DONE SYMPLE dichiara che la perfusione può sovrastimare il core ([[DONE SYMPLE — Protocolo — v4]], p. 27).
- Nell'app esiste un solo campo, `largeCore` (≥70 mL o ipodensità intensa), mostrato solo nella scheda TENACITY (`src/routes/PostImaging.svelte:106-108`, `:209-210`).
