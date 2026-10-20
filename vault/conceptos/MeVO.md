---
tipo: concepto
alias: [Medium vessel occlusion, Oclusión de vaso mediano, Occlusione distale, DMVO, "rami distali"]
actualizado: 2026-10-19
---
# MeVO

## Definizione
Occlusione di un vaso di calibro medio o distale, oltre i grossi tronchi (ICA, M1, basilare): di solito M2 non dominante, M3, A2–A3, P2–P3. La definizione esatta (quali segmenti, M2 dominante o no) cambia da un protocollo all'altro. Gli studi DISTAL, ESCAPE-MeVO e DISCOUNT non hanno mostrato beneficio della trombectomia nelle MeVO ([[ORION — Protocolo — v2.2]], p. 33).

## Come lo usano gli studi
| Studio | Uso / soglia | Fonte |
|---|---|---|
| [[ORION]] | Inclusione: occlusione completa o stenosi serrata di ICA intracranica, M1, M2 **o rami distali di ACM, ACA o ACP** (trombolitico e.v., non EVT). Si dimostra con angio-TC/RM, perfusione, arteria iperdensa in TC o SVS in RM. EVT pianificata ammessa solo per ICA, M1 e M2 prossimale | ([[ORION — Protocolo — v2.2]], p. 43, p. 46) |
| [[NiVO]] | Inclusione: MeVO **primaria isolata** su angio-TC/RM: M2 non dominante o distale, M3–M4, A2–A3, **P1**–P3. Escluse MeVO secondaria (anche dopo LVO trattata), tandem e occlusioni in più vasi. Trombectomia con catetere iNstroke 4F. L'app non accetta la M2 non dominante (`acute-rules.ts:111-117`) | ([[NiVO — Sinopsis — v2.0]], p. 7) |
| [[SAIL-MeVO]] | Inclusione: "Isolated MeVO on CTA/MRA: non dominant M2–M3, A2–A3, P2–P3" (M4, A4–A5, P1 e P4 **non** ammessi); escluse ICA/M1 e tandem con stenosi ICA >70%. Randomizza BMT contro BMT + EVT (ADAPT, poi SAIL). Studio non in app; i codici `gt-m2`/`gt-a2`/`gt-p2` sono più ampi del protocollo e manca un codice "M2 non dominante" | ([[SAIL-MeVO — Protocolo — V2.1]], p. 28, p. 31) |

## Note
- Nelle app e nei protocolli controllare se "M2" è inteso come qualunque M2 o solo M2 prossimale/dominante, e se ACA e ACP distali sono incluse.
- In EnsApp i codici più vicini sono `gt-m2`, `a2`, `gt-a2`, `p2`, `gt-p2` (`src/lib/domain/vessels.ts`).
