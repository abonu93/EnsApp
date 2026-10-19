---
tipo: ensayo
estudio: TargED
alias: ["TG1-CL-201", "TargED-201", "TGD001"]
estado_app: no está en la app
clave_app: ""
categoria: isquémico
fase: "1b/2a"
promotor: "TargED Biopharmaceuticals B.V. (CRO: Scirent Clinical Research & Science GmbH)"
registro: ["EU CT 2025-522455-26-00"]
protocolo_vigente: "Version 2.0 (Substantial Modification no. 1), 02-10-2025"
ci_vigente: "ICF v1.0, 09-07-2025, solo fase 1b (anteriore al protocollo V2.0)"
drive_carpeta: "https://drive.google.com/drive/folders/1Zfbo-jMbdezVXDNHaHj6FaEY8T8kf2pp"
fuentes: ["[[TargED — Protocolo — V2.0]]", "[[TargED — CI — v1.0]]"]
actualizado: 2026-10-19
---
# TargED

> [!summary] In breve
> Studio di fase 1b/2a del promotore olandese TargED con **TGD001**, nuovo trombolitico (urochinasi legata a un anticorpo anti-VWF) in bolo e.v. unico. Tre gruppi: dopo trombectomia con **riperfusione incompleta mTICI 2b–2c**, senza (gruppo 1) o con (gruppo 2) trombolisi precedente, entro 12 h; oppure pazienti **non candidati né a trombectomia né a trombolisi** entro 6 h (gruppo 3). La fase 1b è in aperto con escalation di dose; la fase 2a è randomizzata contro placebo in doppio cieco ([[TargED — Protocolo — V2.0]], p. 9–14, p. 31).

> [!warning] Stato
> **Foglio "Esquema ensayos"**: lo studio **non compare** (non nel foglio).
> **App**: assente da `src/lib/domain/trials-info.ts`. **Drive**: cartella "PENDIENTES ABRIR".
> Il CI v1.0 riguarda solo la fase 1b ed è approvato dal CEIm dell'Hospital Clínico Universitario de València e dall'AEMPS ([[TargED — CI — v1.0]], p. 4, p. 14). Nei documenti non c'è nessuna data di apertura del centro.

## Disegno
- **Fase 1b**: in aperto, escalation di dose con disegno **BOIN** (tossicità target 20%) e decisioni del **DSMC**; coorti di 3 (massimo 6 per livello e gruppo); espansione fino a 12 alla dose scelta. Il gruppo 2 inizia con 5 coorti di un solo partecipante da 0,2 mg ([[TargED — Protocolo — V2.0]], p. 11–13, p. 31–35).
- **Fase 2a**: randomizzata, in doppio cieco, contro placebo (salina), allocazione prevista 1:1, 24 partecipanti per coorte; minimizzazione per età, antiaggreganti, fibrillazione atriale e TIA precedente. Richiede un nuovo emendamento sostanziale (p. 14, p. 33, p. 46).
- **Numerosità**: circa 130 partecipanti, multicentrico e multiregionale (p. 10).
- **Endpoint primario**: sICH (classificazione di Heidelberg) ed eventi avversi emergenti dal trattamento (p. 9, p. 29).
- **Secondari**: aICH entro 24 h, PK, ricanalizzazione e riperfusione a 24 h, NIHSS a 24 h, 72 h e 90 giorni, mRS a 30 e 90 giorni (p. 9–10, p. 29).
- **DLT**: sICH o evento avverso grave (CTCAE ≥3) entro 24 h, probabilmente correlati (p. 11).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Gruppi 1–2: farmaco **entro 12 h** dall'esordio o LKW **e entro 1 h** dalla TC post-EVT; gruppo 2 almeno 2 h dopo la fine della trombolisi. Gruppo 3: **entro 6 h** | ([[TargED — Protocolo — V2.0]], p. 11, p. 38–39, p. 44) |
| Età | ≥18 e **<80** anni | (p. 38) |
| mRS pre | 0–2 | (p. 38) |
| NIHSS | ≥5 al basale e ancora ≥5 subito prima dell'arruolamento; esclusi coma e NIHSS >25 | (p. 38–39) |
| Imaging / ASPECTS / core | Occlusione visibile e/o lesione ischemica con ASPECTS 6–10 e "target mismatch" (non definito); esclusi ASPECTS ≤5, infarto demarcato ed emorragia. Gruppi 1–2: TC senza contrasto dopo l'EVT | (p. 38–39, p. 53–54) |
| Occlusione | Gruppi 1–2: ICA o ACM (M1 o M2) trattate con EVT, con mTICI 2b–2c finale e ≤4 passaggi. Gruppo 3: nessun vincolo di vaso | (p. 38–39) |

## Criteri di inclusione
Testo originale (§5.3, [[TargED — Protocolo — V2.0]], p. 38–39; identico nella sinossi, p. 14):

1. Age ≥18 and <80 years (p. 38)
2. Informed consent obtained from the participant or a participant representative in accordance with local legal and IECs/IRBs requirements (p. 38)
3. Functionally independent (mRS 0-2) prior to stroke onset (p. 38)
4. Diagnosis of AIS supported by neuroimaging: a visible occlusion and/or an ischemic lesion (ASPECTS 6 - 10) with target mismatch (p. 38)
5. Baseline NIHSS ≥5 and that remains ≥5 immediately before enrollment (p. 38)
6. Participants who A) meet the local EVT eligibility requirements and undergo EVT with an occlusion of the internal carotid artery (ICA), or middle cerebral artery (MCA; M1 or M2 segments), with or without pre-EVT SOC IVT, but have incomplete reperfusion of downstream vessels post-EVT (mTICI scores of 2b or 2c; Groups 1 and 2) or B) do not receive EVT or SOC IVT (Group 3). (p. 38)
7. Participants can be treated with the trial treatment (TGD001 or placebo) A) within 12 hours of AIS symptom onset or last known well for participants undergoing EVT (Groups 1 and 2) or B) within 6 hours of AIS symptom onset or last known well in participants not receiving EVT or SOC IVT treatment (Group 3) (p. 38–39)

**Sintesi**: adulto sotto gli 80 anni, mRS pre 0–2, NIHSS da 5 a 25 stabile fino all'arruolamento, ASPECTS ≥6 con occlusione o lesione e "target mismatch". Due percorsi: dopo trombectomia di ICA, M1 o M2 con riperfusione incompleta (mTICI 2b–2c) entro 12 h, oppure senza trombectomia né trombolisi entro 6 h.

## Criteri di esclusione
Testo originale (§5.4, [[TargED — Protocolo — V2.0]], p. 39–40; identico nella sinossi, p. 14–15):

1. Unable to undergo both MRI and CT imaging (p. 39)
2. Intracranial hemorrhage on pre-intervention imaging (p. 39)
3. Demarcated infarct or early ischemic changes resulting in ASPECTS ≤5 on pre-intervention imaging (p. 39)
4. Active internal bleeding (p. 39)
5. Known hereditary or acquired hemorrhagic diathesis, coagulation factor deficiency (p. 39)
6. Use of an anticoagulant, including but not limited to DOAC or warfarin, within the last 48 hours or recent oral anticoagulant therapy with INR ≥1.7. If the DOAC level is measured and found to be below the therapeutic threshold (Factor Xa inhibitor levels of less than 50 ng/ml or anti-Xa levels of less than 0.5 IU/ml), the participant can be enrolled regardless of the recency of the last dose. (p. 39)
7. Use of any medication that is known to significantly increase the bleeding risk (at the discretion of the investigator) (p. 39)
8. More than four recanalization attempts of target lesion with stent retriever or aspiration device during EVT prior to the use of the trial intervention (p. 39)
9. Coma, and/or NIHSS > 25 (p. 39)
10. Seizure(s) at stroke onset if this precludes obtaining an accurate baseline NIHSS (p. 39)
11. Severe, uncontrolled hypertension (systolic blood pressure >180 mmHg or diastolic blood pressure >110 mmHg) NOTE: If the blood pressure can be successfully reduced and maintained at an acceptable level using European Stroke Organization (ESO) guidelines recommended medication (including i.v. antihypertensive drips), the participant can be enrolled. (p. 39)
12. Baseline platelet count <100.000/µL (p. 39)
13. Baseline blood glucose <50 mg/dL (2.8 mmol/L) >400 mg/dL (22.20 mmol/L) (p. 39)
14. Impaired renal function as indicated by estimated GFR below 30 ml/min/1.73 m2 or requiring hemodialysis/peritoneal dialysis (p. 39)
15. Severe liver fibrosis or portal hypertension (p. 39)
16. Female who is pregnant, lactating, or has a positive pregnancy test at the time of admission (p. 39)
17. Evidence of active systemic infection that could have led to presumed septic embolus, suspicion of bacterial endocarditis (p. 39)
18. Surgery or trauma affecting intracranial or intraspinal areas within the last 2 months (p. 39)
19. Pre-existing severe medical, neurological, or psychiatric disease that would significantly confound the neurological or functional evaluations (investigator judgment) (p. 39)
20. History of cerebrovascular incident in the last 3 months (p. 39)
21. Intracranial neoplasm, arteriovenous malformation, or aneurysm (p. 39)
22. Other serious, advanced, or terminal illness in the last 3 months (investigator judgment) or life expectancy is less than 6 months (p. 39)
23. Known hypersensitivity to any of the trial treatments or their excipients or to drugs of similar chemical classes (p. 40)
24. Participant participating in a trial involving an investigational drug or device that would impact this trial within the last 30 days (p. 40)

**Sintesi**: esclusi emorragia, ASPECTS ≤5, sanguinamento attivo o diatesi emorragica, **anticoagulanti nelle 48 h** (DOAC ammessi se il livello è sotto soglia) o INR ≥1,7, più di 4 passaggi in trombectomia, coma o NIHSS >25, PA >180/110 non controllabile, piastrine <100.000, glicemia <50 o >400 mg/dL, eGFR <30 o dialisi, epatopatia grave, gravidanza o allattamento, chirurgia o trauma cranico o spinale entro 2 mesi, **evento cerebrovascolare negli ultimi 3 mesi**, neoplasia intracranica, MAV o aneurisma, altri studi sperimentali entro 30 giorni.

## Intervento e procedure
- **Farmaco**: TGD001 in bolo e.v. manuale (≤1 mL/s) in una vena grande; dose iniziale 1,4 mg nei gruppi 1 e 3, 0,2 mg nel gruppo 2; dose ridotta del 20% sotto i 65 kg; massimo 32 mg ([[TargED — Protocolo — V2.0]], p. 12–13, p. 44–45).
- **Trombolisi**: consentita come standard prima dell'EVT (gruppo 2), ma TGD001 almeno 2 h dopo la fine dell'infusione; vietata nel gruppo 3 (p. 11, p. 38).
- **Trombectomia**: definisce i gruppi 1 e 2; TGD001 dopo l'EVT se mTICI 2b–2c e al massimo 4 passaggi (p. 38–39).
- **Concomitanti**: doppia antiaggregazione sospesa il giorno del trattamento; niente anticoagulanti per 24 h; niente altri trombolitici per 90 giorni (se servono, uscita dallo studio) (p. 47–48).
- **Esami per l'eleggibilità**: glicemia, INR, aPTT, PT, piastrine (p. 53).
- **Imaging**: stessa modalità (TC o RM) per tutto lo studio; TC post-EVT nei gruppi 1–2; controlli a 24 h e 72 h (p. 53–54).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Screening / basale | prima della dose | consenso, criteri, anamnesi, ECG, test di gravidanza, mRS pre, NIHSS, esami, PK e biomarcatori basali, imaging | ([[TargED — Protocolo — V2.0]], p. 17–18) |
| Giorno 1 | da +5 min a +8 h | segni vitali, ECG a 2 h, PK, biomarcatori, esami | (p. 17–18) |
| 24 h | ± 4 h | NIHSS, imaging (angio, perfusione, lesione), esami, PK | (p. 18, p. 54) |
| 48 h | ± 6 h | esami, biomarcatori | (p. 18) |
| 72 h o dimissione | ± 12 h | NIHSS, Barthel premorboso, imaging (facoltativo) | (p. 18–19) |
| Giorno 30 | ± 5 giorni | mRS **telefonico** | (p. 18–19) |
| Giorno 90 | ± 14 giorni | mRS **in presenza** (se possibile), NIHSS, Barthel, anticorpi anti-farmaco, eventi avversi | (p. 18–19, p. 53) |

## Consenso
- **Tipo**: scritto del paziente; se incapace, del rappresentante legale o familiare. Se nessuno è disponibile, inclusione per consenso tra investigatore e medico indipendente, o dell'investigatore per conto del paziente, secondo la legge nazionale, con consenso successivo. Consenso verbale con testimoni se il paziente non può firmare; e-consent ammesso dove permesso ([[TargED — Protocolo — V2.0]], p. 52, p. 66).
- **CI spagnolo**: firme del partecipante, del rappresentante (legale, familiare, medico indipendente, medico per conto del partecipante, altro), del testimone imparziale e dell'investigatore ([[TargED — CI — v1.0]], p. 16–19).
- **Lingue**: solo castellano in Drive.

## Co-arruolamento
- Esclusa la partecipazione negli ultimi 30 giorni a uno studio con farmaco o dispositivo sperimentale "that would impact this trial" (esclusione 24, [[TargED — Protocolo — V2.0]], p. 40). Terapie sperimentali vietate fino all'ultima visita (p. 48). Il CI chiede di non partecipare ad altri studi intervenzionali in contemporanea ([[TargED — CI — v1.0]], p. 15).

## Proposta per EnsApp
Lo studio non è in app. Verificato il 2026-10-19 su `src/lib/domain/acute-rules.ts`, `src/routes/PreImaging.svelte`, `src/routes/PostImaging.svelte`, `src/lib/stores/patient.ts`, `src/lib/i18n/es.ts`.

**Gruppo 3 (−EVT, −IVT, entro 6 h): quasi tutti i campi esistono già**
- età ≥18 e <80 → `age` (`PreImaging.svelte:85-91`) ([[TargED — Protocolo — V2.0]], p. 38);
- mRS pre ≤2 → `premrs` (`PreImaging.svelte:98-102`) (p. 38);
- NIHSS 5–25 → `nihss` (`PreImaging.svelte:93-96`) (p. 38–39);
- entro 6 h dal LKW → `ltsw` (`PreImaging.svelte:113`), con il solito limite delle ore calcolate al momento della valutazione (p. 38–39);
- non candidato a EVT né a IVT → `candidate === "not eligible"` e `ivtCandidate === "not eligible"` (`PostImaging.svelte:156`, `:158`) (p. 38);
- anticoagulante nelle 48 h → `doac` ("DOAC (NOAC) en las 48h previas?", `es.ts:114`; `PreImaging.svelte:158`): coincide con l'esclusione 6 (p. 39), anche se il protocollo comprende il warfarin con INR ≥1,7 e ammette i DOAC con livello sotto soglia;
- lesione su imaging → `lesionConfirmed` (`PostImaging.svelte:185`) (p. 38).

Per il gruppo 3 mancano l'**ASPECTS ≥6** e il **target mismatch**. Il campo `aspects` per un non candidato a EVT compare solo nella card TENACITY, cioè oltre 4,5 h (`PostImaging.svelte:106-108`, `:205`). Il campo `perfusionMismatch` ha la definizione di TENACITY (rapporto ≥1,2 e >10 mL, `patient.ts:41`), mentre TargED non definisce il mismatch (p. 38).

**Gruppi 1–2 (dopo EVT, entro 12 h)**
- Esistono: `candidate === "eligible"` (`PostImaging.svelte:156`), `targetVessels` con ICA intracranica e terminale, M1, M2 (`:169`), `aspects` ≥6 (`:177`), `ivtCandidate` per distinguere il gruppo 1 dal gruppo 2 (`:158`), `ltsw ≤ 12`.
- Mancano: **mTICI finale 2b–2c**, **numero di passaggi ≤4**, TC post-EVT senza emorragia, intervallo ≥2 h dalla fine della trombolisi, somministrazione entro 1 h dalla TC post-EVT (p. 38–39, p. 44). Come per HYBERNIA, l'app può solo pre-selezionare: l'eleggibilità si chiude in sala.

**Campi mancanti per tutti i gruppi**: piastrine e glicemia; INR ed eGFR esistono solo nella pagina post-acuta di LIBREXIA (`PostAcute.svelte:94-96`), non nel flusso acuto; PA >180/110 non controllabile; evento cerebrovascolare negli ultimi 3 mesi; chirurgia o trauma cranico entro 2 mesi; gravidanza (p. 39).

## Problemi documentali
> [!warning] Contraddizione — CI anteriore al protocollo
> CI v1.0 del 09-07-2025 ([[TargED — CI — v1.0]], p. 1) contro protocollo V2.0 del 02-10-2025 ([[TargED — Protocolo — V2.0]], p. 1). Il CI copre solo la fase 1b.

- **CI non adattato al centro**: segnaposti per centro e PI; riferimento alla "Ley belga sobre ensayos clínicos"; rimandi a paragrafi inesistenti; diritti sui dati rinviati "por el ciego" in una fase aperta ([[TargED — CI — v1.0]], p. 1, p. 19–21).
- **"Open-label, single-blind"** per la fase 1b (p. 31) contro "open-label" altrove (p. 11, p. 47).
- **§13.4** dice che la versione non è stata modificata (p. 76), ma è l'emendamento sostanziale n. 1 (p. 1, p. 7).
- **"Target mismatch"** mai definito numericamente (p. 38, p. 53–54).
- Esclusione 13 senza "or" fra le due soglie di glicemia (p. 39); cut-off di età per la minimizzazione "TBD" (p. 46).
- Figure non leggibili: schema dello studio (p. 16), schema di escalation (p. 36), scale in appendice (p. 81–92).

## Fonti
- [[TargED — Protocolo — V2.0]]
- [[TargED — CI — v1.0]]
- [[Esquema ensayos — septiembre 2026]] (lo studio non vi compare)
