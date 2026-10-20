---
tipo: ensayo
estudio: MARRS
alias: [MARSS, "Millipede AspiRation for Revascularization in Stroke", CLIN040, Millipede]
estado_app: no está en la app
clave_app: ""            # solo colonna "MARSS" del foglio Google (sheet-payload.ts)
categoria: dispositivo
fase: "indagine clinica su dispositivo (pre-market, IDE FDA / MDR UE), braccio unico"
promotor: "Perfuze Ltd. (Irlanda) / Perfuze Inc. (USA)"
registro: []
protocolo_vigente: "CLIN040 Rev 09, 01-10-2024"
ci_vigente: "CLIN062 rev. 05 (pre-procedura) e CLIN061 rev. 05 (post-procedura), 01-10-2024"
drive_carpeta: "https://drive.google.com/drive/folders/1Wn6G4nktrDgl-8M0HF5OWXLozFG2BiPN"
fuentes: ["[[MARRS — Protocolo — Rev 09]]", "[[MARRS — CI pre-procedimiento — rev. 05]]", "[[MARRS — CI post-procedimiento — rev. 05]]"]
actualizado: 2026-10-19
---
# MARRS

> [!summary] In breve
> Studio a braccio unico, in aperto, multicentrico (USA ed Europa), promosso da Perfuze. Valuta il **Millipede System**, cateteri da aspirazione di grande calibro (088 e 070) usati con tecnica [[Aspiración directa (ADAPT)|ADAPT]] nella trombectomia di una LVO singola (ICA intracranica, M1, M2, vertebrale intracranica, basilare) entro **8 h**. Popolazione: 18–85 anni, [[NIHSS]] ≥6, [[mRS]] pre ≤1, [[ASPECTS]] 6–10 (o core ≤50 mL) nell'anteriore, pcASPECTS 8–10 nel posteriore. Endpoint primario: mTICI ≥2b entro 3 passaggi senza terapia aggiuntiva, confrontato con un performance goal ([[MARRS — Protocolo — Rev 09]], p. 8–9, p. 22–23).

> [!note] Nome nell'app
> L'app scrive **"MARSS"** (refuso). Compare solo come colonna storica del foglio Google dei pazienti (`src/lib/domain/sheet-payload.ts:9`, `:38`; `src/routes/SavedPatients.svelte:19`; `tests/domain/sheet-payload.test.ts:36`). Non esiste una voce in `trials-info.ts` né una regola in `acute-rules.ts`.

## Disegno
- **Tipo**: interventistico, in aperto, braccio unico, multicentrico, prospettico ([[MARRS — Protocolo — Rev 09]], p. 1, p. 21).
- **Numerosità**: fino a 277 soggetti arruolati (180 valutabili), fino a 30 centri, almeno il 40% negli USA, al massimo il 25% per centro ([[MARRS — Protocolo — Rev 09]], p. 21, p. 44–45).
- **Endpoint primario**: proporzione con mTICI ≥2b dopo ≤3 passaggi con il Millipede senza terapia aggiuntiva; test a una coda (alfa 0,025) contro un performance goal 8 punti sotto la media pesata della letteratura (71,7%) ([[MARRS — Protocolo — Rev 09]], p. 20, p. 44).
- **Secondari**: mRS ≤2 e mortalità a 90 (±30) giorni, sICH a 24 h, ICH secondo [[Clasificación de Heidelberg|Heidelberg]], SADE e PRSAE, embolizzazione in territorio nuovo, mTICI ≥2b e 2c/3 a fine procedura e al primo passaggio ([[MARRS — Protocolo — Rev 09]], p. 20–21).
- **Indipendenza**: NIHSS e mRS valutati da personale indipendente dall'interventista; core lab di imaging, CEC e DMC indipendenti ([[MARRS — Protocolo — Rev 09]], p. 21).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | puntura arteriosa stimata entro **8 h** da esordio/LKW | ([[MARRS — Protocolo — Rev 09]], p. 23) |
| Età | 18–85 anni | (p. 22) |
| mRS pre | ≤1 | (p. 22) |
| NIHSS | ≥6, con deficit focale disabilitante | (p. 22) |
| Imaging anteriore | ASPECTS 6–10 (TC o sorgente angio-TC) o rCBF <30% ≤50 mL; in RM DWI ≤50 mL o ASPECTS 6–10 | (p. 22–23) |
| Imaging posteriore | pcASPECTS 8–10 | (p. 23) |
| Occlusione | LVO **singola** di ICA intracranica (T o L incluse), M1, M2, vertebrale intracranica o basilare su angio-TC/RM, confermata in DSA (mTICI 0–1) e accessibile al dispositivo | (p. 22–23) |
| Trombolisi | ammessa se indicata e somministrata senza ritardi | (p. 22) |

## Criteri di inclusione
Testo originale (§4.7, [[MARRS — Protocolo — Rev 09]], p. 22–23):

1. Subjects aged ≥ 18 and ≤ 85 years. (p. 22)
2. Pre-stroke mRS score of ≤ 1. (p. 22)
3. Baseline NIHSS score of ≥ 6. (p. 22)
4. A new focal disabling neurologic deficit consistent with acute cerebral ischemia. (p. 22)
5. Evidence of a large vessel occlusion of the intracranial ICA (including T or L occlusions), the M1 or M2 segments of the MCA, the intracranial vertebral artery, or the basilar artery on magnetic resonance angiography (MRA) or computed tomography angiography (CTA). (p. 22)
6. Subject belongs to one of the following subgroups: a. Subject is ineligible for thrombolytic therapy, OR b. Subject is eligible for thrombolytic therapy and thrombolytic therapy was administered without delay and per current practice guidelines. (p. 22)
7. For strokes in the anterior circulation, the following imaging criteria should be met: a. Magnetic Resonance Imaging (MRI) criterion: volume of diffusion restriction visually assessed as ≤ 50 mL, or Alberta Stroke Program Early CT Score (ASPECTS) 6-10; OR b. Computed Tomography (CT) criterion: ASPECTS 6-10 on baseline CT or CTA-source images, or volume of significantly lowered relative Cerebral Blood Flow (rCBF) <30% (volume of ≤ 50 mL if CT perfusion is performed). (p. 22–23)
8. For strokes in the posterior circulation, the following imaging criterion should be met: pcASPECTS score 8 to 10 on baseline CT, CTA-source images, or Diffusion-Weighted Imaging (DWI) MRI. (p. 23)
9. The interventionalist estimates that arterial puncture can be completed within 8 hours of onset/last known well. (p. 23)
10. Informed consent obtained in accordance with the applicable country-specific regulations and as approved by the IRB/ REC. (p. 23)
11. Angiographic confirmation of a single large vessel occlusion (mTICI of 0-1) of the intracranial ICA (including T or L occlusions), the M1 or M2 segments of the MCA, the intracranial vertebral artery, or the basilar artery that is accessible to the Millipede System. (Note sui diametri: 088 in vasi >2,74 mm, 070 in vasi >2,21 mm.) (p. 23)

## Criteri di esclusione
Testo originale (§4.8, [[MARRS — Protocolo — Rev 09]], p. 23–24). Elenco completo nella nota fonte; qui i 33 criteri in forma integrale:

1. Known previous stroke within the past 3 months.
2. Females who are known to be pregnant or breastfeeding.
3. In the Investigator's opinion, any known comorbidity (including COVID-19) that may complicate treatment or prevent improvement or follow-up.
4. Subject currently participating in or has previously participated in another trial involving an investigational device or drug within 30 days of enrollment.
5. Known history of severe contrast allergy.
6. Pre-existing neurological or psychiatric disease that would confound the neurological or functional evaluation.
7. Life expectancy of less than 6 months prior to stroke onset.
8. Known cocaine, methamphetamine, or heroin use at time of treatment.
9. Known history of coagulation factor deficiency or oral anti-coagulant therapy with an International Normalized Ratio (INR) of more than 3.0.
10. Known history of treatment with heparin within 48 hours with a Partial Thromboplastin Time (PTT) more than two times the laboratory normal.
11. Known history of treatment with a direct thrombin inhibitor within 48 hours with a PTT more than 1.5 times the laboratory normal.
12. Known glucose level< 50 mg/dl (2.78 mmol/L) or > 400 mg/dl (22.20 mmol/L).
13. Known platelet count <50,000/µL.
14. Clinical history, past imaging or clinical judgement suggest that the intracranial occlusion is chronic.
15. For all patients, severe sustained hypertension with SBP >220 mmHg and/or DBP >120 mmHg; for patients treated with thrombolytic therapy, sustained hypertension despite treatment with SBP >185 mmHg and/or DBP > 110 mmHg.
16. Renal failure with serum creatinine ≥3 mg/dL or Glomerular Filtration Rate (GFR) <30 mL/min.
17. Ongoing seizure due to stroke.
18. Initially treated with intra-arterial thrombolytics or a different neurothrombectomy device before use of the Millipede System.
19. Clinical symptoms of bilateral stroke or stroke in multiple territories.
20. Known history of cerebral vasculitis. (p. 23)
21. Evidence of active systemic infection (e.g., septicemia). Exceptions: common cold, hepatitis B virus (HBV), hepatitis C virus (HCV).
22. Any known hemorrhagic or coagulation deficiency.
23. Evidence of current intracranial hemorrhage on imaging.
24. Significant mass effect with midline shift.
25. Known arterial condition in a proximal vessel that requires treatment or prevents access to the site of occlusion or safe recovery of the investigational device (for example, severe stenosis, complete occlusion in the cervical ICA, tandem occlusion).
26. Suspicion or evidence of aortic dissection, septic embolus, or bacterial endocarditis.
27. Evidence of dissection in the extracranial or intracranial cerebral arteries.
28. Excessive arterial tortuosity that may preclude device placement as determined by CTA/ MRA and/or conventional angiography.
29. Evidence of multiple vascular occlusions (e.g., bilateral anterior circulation, anterior/posterior circulation, concurrent occlusions in the anterior cerebral artery (ACA) and MCA, other concurrent ipsilateral occlusions in the same or different territories).
30. CT or MRI showing mass effect or intracranial tumor (apart from small meningioma, ≤ 2 cm in diameter).
31. Known cancer with metastases.
32. Known aneurysm at or near the target treatment segment.
33. Angiographic evidence of known or suspected underlying intracranial vasculopathy or atherosclerotic lesions responsible for the target occlusion. (p. 24)

**Sintesi**: oltre a emorragia, effetto massa e occlusioni multiple, esclude [[Oclusión en tándem|tandem]], stenosi o occlusione della ICA cervicale, dissezione, tortuosità eccessiva, aneurisma vicino al bersaglio, [[Ateroesclerosis intracraneal (ICAD)|ICAD]] responsabile dell'occlusione, occlusione cronica, trattamento iniziale con un altro dispositivo o trombolitico intra-arterioso. Soglie di laboratorio: INR >3 in TAO, PTT, glicemia <50 o >400, piastrine <50.000, creatinina ≥3 o GFR <30.

## Intervento e procedure
- **Dispositivo**: Millipede 088 e 070 (uno dentro l'altro), aspirazione con pompa a −510/−710 mmHg; solo accesso femorale ([[MARRS — Protocolo — Rev 09]], p. 18–19, p. 32).
- **Strategia**: almeno 3 passaggi con il Millipede prima di qualunque terapia aggiuntiva (altro dispositivo, trombolitico intra-arterioso, stent o angioplastica intracranica); dopo, terapia aggiuntiva a discrezione ([[MARRS — Protocolo — Rev 09]], p. 33).
- **Trombolisi e.v.**: ammessa se indicata, senza ritardi (inclusione 6). PA >185/110 persistente nonostante il trattamento esclude i trombolisati (esclusione 15) ([[MARRS — Protocolo — Rev 09]], p. 22–23).
- **Trombectomia**: è l'intervento; esclusi i pazienti trattati prima con un altro dispositivo (esclusione 18).
- **Arruolamento e DSA**: il paziente è arruolato al consenso; la DSA basale verifica i criteri angiografici; chi non li soddisfa è trattato secondo pratica e seguito 24 h ([[MARRS — Protocolo — Rev 09]], p. 24, p. 32).
- **Imaging**: TC/RM e angio-TC/RM obbligatorie prima della procedura; percorsi "direct to angio" con cone-beam CT **non ammessi** ([[MARRS — Protocolo — Rev 09]], p. 31–32).

## Visite e follow-up
| Visita | Momento | Contenuto | Fonte |
|---|---|---|---|
| Screening | prima della procedura | consenso, anamnesi, PA, temperatura, peso, esami, NIHSS, mRS pre, angio-TC/RM, diametro del vaso | ([[MARRS — Protocolo — Rev 09]], p. 30–31) |
| Procedura | tempo 0 | DSA basale, trombectomia, angiogramma dopo ogni passaggio | (p. 30, p. 32–34) |
| 24 h (−8/+24) | in ricovero | NIHSS (GCS se non valutabile), TC/RM | (p. 34) |
| 7 (+7) giorni o dimissione | in ricovero | NIHSS, notti in UCI, destinazione | (p. 34–35) |
| 90 (±30) giorni | in presenza **o per telefono/video** | mRS da valutatore indipendente | (p. 30, p. 35) |

## Consenso
- **Protocollo**: consenso esteso, short form con testimone, short form abbreviato con conferma entro 48 h, **consenso remoto telefonico** del LAR con testimone, consenso elettronico, consenso verbale con testimone del soggetto capace ma che non può firmare ([[MARRS — Protocolo — Rev 09]], p. 26–27).
- **Urgenza (solo Europa)**: inclusione senza consenso preventivo secondo l'art. 68 del MDR, con consenso differito ([[MARRS — Protocolo — Rev 09]], p. 27–28; [[Consentimiento diferido]]).
- **CI locali**: modulo pre-procedura (soggetto o rappresentante, testimone imparziale) ([[MARRS — CI pre-procedimiento — rev. 05]], p. 11) e modulo post-procedura per chi è stato incluso in urgenza, con opzione di non proseguire ([[MARRS — CI post-procedimiento — rev. 05]], p. 1, p. 10–12).
- **Lingue**: solo castellano in Drive.

## Co-arruolamento
- Escluso chi partecipa o ha partecipato a un altro studio con dispositivo o farmaco nei 30 giorni precedenti (esclusione 4, [[MARRS — Protocolo — Rev 09]], p. 23).

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts` (nessuna voce MARRS/MARSS);
- `src/lib/domain/acute-rules.ts`, `acute-reasons.ts` (nessuna regola);
- `src/lib/domain/sheet-payload.ts:9`, `:38`; `src/routes/SavedPatients.svelte:19`; `tests/domain/sheet-payload.test.ts:36`.

Verificato il 2026-10-19.

> [!success] Coincide
> Lo studio è chiuso (indice Drive, [[Estado de los estudios]]) e l'app non lo propone: nessuna regola di eleggibilità, nessuna scheda nel catalogo. Non ci sono criteri da confrontare.

- [ ] **1. [TXT] Nome scritto "MARSS" invece di "MARRS".**
> Protocollo: "Millipede AspiRation for Revascularization in Stroke (MARRS)" ([[MARRS — Protocolo — Rev 09]], p. 1). App: colonna "MARSS" in `sheet-payload.ts:9`, `:38` e `SavedPatients.svelte:19`. È la chiave della colonna nel foglio Google di backend: non va corretta senza allineare il foglio (il test `sheet-payload.test.ts:36` la fissa).

- [ ] **2. [NC] Studio presente solo nel payload del foglio.**
> L'app invia e legge una colonna MARSS per ogni paziente, ma lo studio non ha scheda né regola, quindi non è selezionabile. Coerente con lo stato chiuso; la colonna serve solo per i pazienti storici.

## Problemi documentali
- **Nome del protocollo in Drive**: "sin version en el titulo — 2025-01", ma il documento è CLIN040 **Rev 09 del 01-10-2024** (copertina e piè di pagina).
- **Registro**: nessun numero NCT o CIV-ID nel protocollo.
- **Indicazioni d'uso** che parlano di pazienti "who fail intravenous thrombolytic therapy" contro l'inclusione 6b che ammette qualsiasi trombolisato ([[MARRS — Protocolo — Rev 09]], p. 7, p. 20, p. 22).
- **Stato**: non presente nel foglio [[Esquema ensayos — septiembre 2026]]; chiuso secondo l'indice Drive.

## Fonti
- [[MARRS — Protocolo — Rev 09]]
- [[MARRS — CI pre-procedimiento — rev. 05]]
- [[MARRS — CI post-procedimiento — rev. 05]]
