---
tipo: concepto
alias: [Tandem, Tándem, Tandem occlusion, Lesione tandem]
actualizado: 2026-10-19
---
# Oclusión en tándem

## Definizione
Occlusione (o stenosi severa) della carotide interna extracranica associata a un'occlusione intracranica a valle nello stesso territorio (per esempio ICA cervicale + M1). Molti trial di trombectomia la ammettono, altri la escludono perché complica la procedura (accesso, stenting carotideo, antiaggregazione) ([[VANISH — Protocolo — v1.2]], p. 10, p. 18).

## Come lo usano gli studi
| Studio | Uso / soglia | Fonte |
|---|---|---|
| [[VANISH]] | Esclusione: "CTA or MRA evidence of tandem occlusions of any cause" | ([[VANISH — Protocolo — v1.2]], p. 18) |
| [[TENACITY]] | Non nominato come tale; esclusa ogni occlusione della ICA ("Occlusion of the internal carotid artery (ICA)"), quindi anche il tandem | ([[TENACITY — Protocolo — V1.0]], p. 31) |
| [[MOSTE]] | **Ammesso**: ICA, M1 o M1-M2 "with or without cervical lesion (Tandem)". Esclusa invece la ICA cervicale prossimale **isolata**. Il tandem rientra nella stratificazione per sede; gli antiaggreganti sono ammessi se si posiziona uno stent carotideo | ([[MOSTE — Protocolo — V5]], p. 7, p. 9, p. 21, p. 24, p. 29) |
| [[WETRUST]] | Ammesso nella popolazione target: ACI distale o ACI-T "en tándem", e occlusioni con o senza occlusione/stenosi della carotide cervicale. Definizione: "un trombo en la arteria carótida interna extracraneal junto con un trombo intracraneal (arteria carótida interna)" | ([[WETRUST — Protocolo — Rev 09]], p. 67) |
| [[ARTEMIS]] | Esclusione 26, **valutata in sala**, solo se la lesione in tandem (occlusione, stenosi severa o dissezione) è "requiring treatment or preventing access to thrombus". Sinossi: ICA "extracranial or intracranial"; corpo: "extracranial or internal carotid artery" (manca "intracranial"). Vietati doppio stent e accesso carotideo. L'app non usa il campo `tandem` per ARTEMIS (`acute-rules.ts:223-237`) | ([[ARTEMIS — Protocolo — V03]], p. 7, p. 26, p. 32) |
| [[PIVOTAL]] | Esclusione di imaging 1k: "Tandem occlusions", senza altre condizioni; esclusa anche la stenosi prossimale che impedisce l'estrazione o richiede stent (1f). L'app non usa il campo `tandem` per PIVOTAL (`acute-rules.ts:160-171`) | ([[PIVOTAL — Protocolo — Rev 03]], p. 42) |
| [[ATHENA]] | Esclusione 23, **valutata in sala**: "Evidence of tandem lesions, including complete occlusion, high grade stenosis or arterial dissection in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus". Il tandem che non richiede trattamento e non impedisce l'accesso è ammesso. L'app invece scarta ogni tandem (`tandem === "no"`, `acute-rules.ts:144`): falso negativo | ([[ATHENA — Protocolo — v2.3]], p. 35) |

## Note
- Verificare se il protocollo esclude "il tandem" esplicitamente o "qualsiasi occlusione della ICA": l'effetto pratico è diverso per le occlusioni isolate della ICA.
- In EnsApp il campo `tandem` si chiede solo nella scheda EVT (`src/routes/PostImaging.svelte`); va controllato regola per regola quali studi lo usano.
