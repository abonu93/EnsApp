---
tipo: ensayo
estudio: ORION
alias: [JX10002, "JX10", "Optimizing Reperfusion to Improve Outcomes and Neurologic Function", "TMS-007", "BIIB131"]
estado_app: activo
clave_app: "Orion"
categoria: isquémico
fase: "2/3"
promotor: "Corxel Pharmaceuticals, Inc."
registro: ["IND 160639", "EU CT 2024-519521-37"]
protocolo_vigente: "v2.2 (Protocol Amendment 3), 27-05-2025. In attesa: v3.1 (Amendment 6), 05-06-2026, firmata, approvazione non documentata"
ci_vigente: "Main ICF ES v1.0, 24-06-2025"
drive_carpeta: "https://drive.google.com/drive/folders/1fJShL_DSTr27x_DFsGckyRTIiS_BKJFw"
fuentes: ["[[ORION — Protocolo — v2.2]]", "[[ORION — Protocolo — v3.1]]", "[[ORION — Cambios — v3.0 a v3.1]]", "[[ORION — CI — v1.0]]"]
actualizado: 2026-10-20
---
# ORION

> [!summary] In breve
> Studio di fase 2/3, in doppio cieco, controllato con placebo, promosso da Corxel. Valuta **JX10**, un nuovo trombolitico e.v. in dose unica di 31 minuti, nell'ictus ischemico con occlusione o stenosi serrata intracranica (ICA, M1, M2, rami distali di ACM, ACA e ACP; vedi [[MeVO]]). La finestra ([[Ventana extendida]]) va da **4,5 a 6 h dal LKW senza perfusione**, o da **4,5 a 24 h con [[Mismatch de perfusión|mismatch]] in perfusione**. La Parte 1 confronta 1 mg/kg, 3 mg/kg e placebo (1:1:1); la Parte 2 la dose scelta contro placebo (1:1). La trombectomia è ammessa solo se inizia ≥1 h dopo l'inizio del farmaco ([[ORION — Protocolo — v2.2]], p. 15–17, p. 43).

> [!warning] Stato: foglio del team vs app
> **Foglio "Esquema ensayos" (fonte di verità, modificato il 2026-10-09): EN PAUSA (pendiente 2ª parte de reclutamiento).**
> App: `status: "active"` (`src/lib/domain/trials-info.ts:230`). `isTrialOpen()` nasconde solo `closed` e `paused` (`trials-info.ts:410-413`), quindi ORION resta fra gli eleggibili del riepilogo (`src/routes/Summary.svelte:32`, `:48`). Il 2026-10-19 il team ha deciso di lasciare ORION com'è ([[Estado de los estudios]]).
> I protocolli confermano la pausa:
> - **v2.2**: la Parte 2 inizia solo quando è accettata la raccomandazione dell'IDMC sulla dose, "with site notification" ([[ORION — Protocolo — v2.2]], p. 15, p. 42);
> - **v3.1**: "Enrollment of Part 2 is anticipated to begin after completion of the end of Part 1 analysis" ([[ORION — Protocolo — v3.1]], p. 24, p. 50).

## Disegno
- **Tipo**: randomizzato, multicentrico (più di 150 centri), in doppio cieco, controllato con placebo, a gruppi paralleli, fase 2/3, modellato sul NINDS ([[ORION — Protocolo — v2.2]], p. 15, p. 42).
- **Parte 1 (dose-finding)**: JX10 1 mg/kg (massimo 100 mg), 3 mg/kg (massimo 300 mg) o placebo, 1:1:1, circa 80 per braccio. **Parte 2**: dose ottimale vs placebo 1:1, circa 500 pazienti. Totale circa 740 ([[ORION — Protocolo — v2.2]], p. 15–16, p. 21, p. 52).
- **Passaggio alla Parte 2**: nella v2.2, interim a fine arruolamento della Parte 1 e raccomandazione dell'IDMC; la Parte 2 può iniziare mentre la Parte 1 completa il follow-up (p. 15–16, p. 42–43). Nella v3.1 non c'è interim: si aspetta l'analisi finale della Parte 1 e la dose la sceglie il promotore ([[ORION — Protocolo — v3.1]], p. 24, p. 50, p. 93).
- **Randomizzazione**: IRT, stratificata per vaso (M1, M2 prossimale o ICA vs altri), NIHSS (>10 vs ≤10) e tempo dall'esordio (4,5–6 vs >6–12 vs >12 h) ([[ORION — Protocolo — v2.2]], p. 51).
- **Endpoint primario**: mRS 0–1 a 90 giorni. **Sicurezza primaria**: sICH entro 36 h ([[ORION — Protocolo — v2.2]], p. 13–14).
- **Numerosità**: Parte 1, potenza >90% per OR 3,0; Parte 2, potenza 91% per OR 2,0, con mRS 0–1 del 18,4% nel placebo ([[ORION — Protocolo — v2.2]], p. 21–22).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | **4,5–6 h** dal LKW senza perfusione; **4,5–24 h** con penombra che soddisfa l'inclusione 4 (perfusione obbligatoria oltre 6 h). Conta l'ora prevista del trattamento. L'arruolamento a 16–24 h può essere limitato | ([[ORION — Protocolo — v2.2]], p. 16–17, p. 43, p. 47) |
| Età | 18–90 anni; **se >85 anni, mRS pre 0** | ([[ORION — Protocolo — v2.2]], p. 46) |
| [[mRS]] pre | <2 (cioè 0–1); <1 (cioè 0) se 86–90 anni | ([[ORION — Protocolo — v2.2]], p. 47) |
| [[NIHSS]] | **≥5** prima del trattamento; da ripetere se ≥60 min dallo screening | ([[ORION — Protocolo — v2.2]], p. 30, p. 47) |
| Imaging / core | Se si fa la perfusione (obbligatoria oltre 6 h): rapporto Tmax>6 s/core >1,2, core <70 mL, mismatch ≥10 mL. Esclusi: core >70 mL (DWI o TC-perfusione), ipodensità >1/3 dell'ACM, ipodensità fuori dalla lesione Tmax che invalida il mismatch. Ammessa l'angio-TC multifase al posto della perfusione. Nessun criterio ASPECTS | ([[ORION — Protocolo — v2.2]], p. 43–44, p. 46–47) |
| Occlusione | Occlusione completa o stenosi serrata sintomatica di ICA intracranica, M1, M2 o rami distali di ACM, ACA, ACP. La si dimostra con angio-TC/RM, perfusione (deficit focale), segno della arteria iperdensa in TC o SVS in RM. Esclusa l'occlusione in più di un territorio | ([[ORION — Protocolo — v2.2]], p. 46–47) |
| Trombolisi | **Esclusa**: trombolitico nei 90 giorni precedenti o pianificato per questo ictus | ([[ORION — Protocolo — v2.2]], p. 49) |
| Trombectomia | Esclusi i pazienti con EVT indicata e fattibile (puntura femorale) entro 1 h dall'inizio del farmaco. EVT pianificata ammessa (ICA, M1, M2 prossimale) solo ≥1 h dopo l'inizio del farmaco, e per non più del 30% dei randomizzati | ([[ORION — Protocolo — v2.2]], p. 30, p. 43, p. 48) |

## Criteri di inclusione
Testo originale (§5.1, [[ORION — Protocolo — v2.2]], p. 46–47; identico nella sinossi, p. 16–18):

1. Age ≥ 18 and ≤ 90 years old (Age > 85 must be mRS 0 at baseline (premorbid) to be eligible). (p. 46)
2. Written informed consent by patient, his/her legally authorized representative, or independent physician where local regulation allows (in accordance with all local and national regulations or according to the local ethics committee's guidelines or by another process compliant with applicable national laws and regulations and ethics committee requirements). (p. 46)
3. Acute ischemic stroke with compatible clinical presentation and symptomatic high grade or complete occlusion of the intracranial internal carotid, M1, M2, or distal branches of the middle cerebral artery (MCA), anterior cerebral artery (ACA), or posterior cerebral artery (PCA), demonstrated by: (p. 46)
   a. Computer Tomography Angiography (CTA) or Magnetic Resonance Angiography (MRA) with high grade stenosis or occlusion of an eligible artery, or
   b. Computer Tomography or Magnetic Resonance Perfusion (CTP/MRP) with focal deficit in an eligible artery, or
   c. Non-contrast Computer Tomography (NCCT) with hyperdense artery sign in an eligible artery or Magnetic Resonance Imaging (MRI) with susceptibility vessel sign (defined as a hypointense signal exceeding the diameter of the contralateral artery at the thrombus site) in an eligible artery.
4. Radiographic evidence of salvageable tissue* is present based on: a. A mismatch ratio (perfusion lesion (Tmax > 6 seconds) volume/core estimate) > 1.2, b. Estimated core infarct volume < 70 mL, and c. Total mismatch volume ≥ 10 mL on CTP or magnetic resonance (MR) perfusion-weighted imaging (PWI)/MRI diffusion imaging. The perfusion criteria apply to all participants, including those who present within 4.5 to 6 hours of LKW, if perfusion imaging is obtained. Perfusion is mandatory for patients presenting beyond 6 hours, optional for patients < 6 hours. *The quantitative assessment of penumbra may include alternative methods (e.g., if the software uses different parameters in place of Tmax). (p. 46)
5. Presentation with intended study treatment within 4.5 to 6 hours of Last Know Well (LKW) in the absence of radiographic assessment of perfusion or within 4.5 to 24 hours of LKW with radiographic evidence of penumbra meeting criterion (4). (p. 47)
6. Pre-treatment score of NIHSS ≥ 5. (p. 47)
7. Functionally independent prior to stroke onset as evidenced by premorbid mRS < 2 (< 1 if age 86-90). (p. 47)
8. All women of childbearing potential and all men must practice contraception as described in Section 8.3.5. For women of childbearing potential, a negative pregnancy test at screening is required. […] (p. 47; testo completo in [[ORION — Protocolo — v2.2]])

**Sintesi**: adulto di 18–90 anni, autonomo prima dell'ictus (mRS 0–1; mRS 0 se ha più di 85 anni), con NIHSS ≥5 e occlusione o stenosi serrata intracranica anteriore o posteriore distale (non basilare né vertebrale). Si tratta fra 4,5 e 6 h dal LKW anche senza perfusione; fra 4,5 e 24 h solo con mismatch (rapporto >1,2, core <70 mL, mismatch ≥10 mL). Se la perfusione è fatta, i criteri valgono anche prima delle 6 h. Test di gravidanza negativo e contraccezione.

## Criteri di esclusione
Testo originale (§5.2, [[ORION — Protocolo — v2.2]], p. 47–50; sinossi p. 18–21). I 27 criteri sono riportati per esteso nella nota fonte; qui i più rilevanti per la selezione in urgenza:

1. Radiographic findings pre-randomization of any of the following: a. Large core infarction, evidenced by a core infarct volume > 70 mL, assessed on DWI or CTP; or extensive early ischemic change (hypodensity) on non-contrast CT estimated to be > 1/3 MCA territory, or significant hypodensity outside the Tmax > 6 seconds perfusion lesion that invalidates mismatch criteria, or b. Occlusion in more than 1 vascular territory confirmed on CTA/MRA, or c. Significant mass effect or clinically significant cerebral edema per Investigator's judgement, or d. Evidence of acute intracranial or extracranial hemorrhage, intracranial tumor (except small meningioma), neoplasm, or arteriovenous malformation, or e. Clinical history, past imaging, or clinical judgement suggests that the intracranial occlusion is chronic. (p. 47)
2. Non-ischemic or non-thrombotic etiology of current stroke symptoms such as suspected cerebral vasospasm, infectious source (e.g., bacterial endocarditis, septic shock), complications from acute drug abuse (e.g., cocaine intoxication). (p. 47)
3. Availability of endovascular thrombectomy (EVT) for current AIS (in whom EVT is indicated) where planned EVT would be feasible (e.g., time of femoral artery puncture), within 1 hour following the start of study drug infusion. (p. 48; la sinossi dice "following study drug infusion", p. 18)
4. Medical history or active clinically significant bleeding, lesions, or conditions (at the investigator's judgement) considered to be of significant risk for major bleeding; […] (p. 48)
5. Cerebral infarction within 90 days of screening. (p. 48)
6. Arterial dissection involving any intracranial artery or the aortic arch. (p. 48)
7. Confirmed acute coronary syndrome within 90 days of screening. (p. 48)
8. Severe hepatic impairment […] (p. 48)
9. Medical history of chronic renal failure, any condition requiring dialysis or renal replacement therapy or evidence of acute kidney injury at the time of screening, an estimated glomerular filtration rate < 60 mL/min/1.73m2. (p. 48)
10. Severe, uncontrolled hypertension (systolic blood pressure ≥ 185 mmHg or diastolic blood pressure ≥ 110 mmHg) that cannot be controlled with antihypertensive therapy. (p. 48)
11. Known bleeding diathesis (hereditary or acquired) or any significant coagulopathy. Specifically, platelet count < 100,000/μL, international normalized ratio > 1.7, aPTT > 40 seconds, or prothrombin time > 15 seconds. (p. 48)
12. Major trauma, surgery, or invasive procedures (a–e: severe head trauma ≤3 months or acute; major trauma ≤14 days; major surgery ≤14 days; intracranial/intraspinal surgery ≤90 days; dural or non-compressible arterial puncture ≤7 days). (p. 48–49)
13. Pre-existing medical, neurological, or psychiatric disease that would confound the neurological or functional evaluations of this study. (p. 49)
14. Pre-treatment blood glucose > 400 mg/dL (22.20 mmol/L) or Pre-treatment blood glucose < 50 mg/dL (2.78 mmol/L) unless it is corrected prior to study treatment administration. […] (p. 49)
15. Known hereditary or acquired abnormality of UGT1A1 metabolism or deficiency such as Gilbert's syndrome […], Crigler-Najjar syndrome […]. (p. 49)
16. Prolonged QT with QTc of > 450 ms for males and > 460 ms for females. (p. 49)
17. Life expectancy less than 6 months due to comorbid condition. (p. 49)
18. Prior thrombolytic administration within 90 days of screening or planned thrombolytic administration for the AIS. (Co-administration with any other thrombolytic agent(s) within 48 hours is prohibited). (p. 49)
19. Known or suspected use of any oral anticoagulant therapy, including but not limited to vitamin K antagonists, thrombin inhibitors, or factor Xa inhibitors, within 48 hours of screening unless blood testing confirms absence of drug substance in the system. (p. 49)
20. Use of dual anti-platelet therapy, IV aspirin, or glycoprotein IIb/IIIa inhibitors within 24 hours of screening. […] (p. 49)
21. Use of heparin or low molecular weight heparin at a therapeutic dose […]. (p. 49)
22. Use of nephrotoxic medications or agents within 7 days of screening […]. (p. 49)
23. Prior treatment with JX10, any known history of systemic hypersensitivity reaction or anaphylaxis to JX10, the excipients […]. (p. 50)
24. Participants who are pregnant or currently breastfeeding, and those intending to become pregnant during the study. (p. 50)
25. Current enrollment or a plan to enroll in another investigational device study, or interventional clinical study in which an investigational treatment or approved therapy for investigational use is administered within 90 days prior to the screening. (p. 50)
26. Substance abuse history including heavy alcohol use over the past year […], or acute intoxication […]. (p. 50)
27. Inability to comply with study requirements or other unspecified reasons […]. (p. 50)

**Sintesi**: oltre ai criteri di imaging (core >70 mL o ipodensità estesa, più territori, effetto massa, emorragia, tumore o MAV, occlusione cronica) sono esclusi:
- i pazienti con **EVT disponibile entro 1 h**;
- chi ha avuto trombolisi nei 90 giorni precedenti o ne ha una pianificata;
- chi ha preso anticoagulanti orali nelle 48 h (salvo dosaggio negativo), doppia antiaggregazione, aspirina e.v. o anti-GPIIb/IIIa nelle 24 h, o eparina a dose terapeutica;
- chi ha avuto un infarto cerebrale o una SCA nei 90 giorni;
- chi ha una dissezione intracranica o dell'arco aortico;
- chi ha **eGFR <60** o insufficienza renale (nella v3.x: <30), epatopatia grave, sindrome di Gilbert o altri deficit di UGT1A1, **QTc >450/460 ms**;
- chi ha PA ≥185/110 non controllabile, piastrine <100.000, INR >1,7, aPTT >40 s o PT >15 s, glicemia <50 o >400 mg/dL non corretta;
- donne in gravidanza o allattamento;
- chi partecipa (o parteciperà) a un altro studio con dispositivo o farmaco sperimentale.

## Intervento e procedure
- **Farmaco**: JX10 (o placebo identico), bolo e.v. del 10% in 1 minuto + 90% in 30 minuti, su linea periferica dedicata; dose a peso (il peso stimato è accettato). Va iniziato appena possibile dopo la randomizzazione. Se l'infusione si interrompe per più di 15 minuti in totale, si sospende ([[ORION — Protocolo — v2.2]], p. 29, p. 52, p. 55).
- **Trombolisi standard**: esclusa (inclusa la co-somministrazione nelle 48 h successive) ([[ORION — Protocolo — v2.2]], p. 49, p. 56).
- **Trombectomia**: vedi la tabella sopra. Le procedure di salvataggio non pianificate sono libere ([[ORION — Protocolo — v2.2]], p. 43).
- **Dopo il farmaco**: gestione come post-trombolisi; PA <180/105 mmHg per 24 h; controlli neurologici e di PA ogni 15 min per 2 h, ogni 30 min fino a 6 h, ogni ora fino a 24 h; niente antitrombotici (nemmeno profilattici) per 24 h, fino alla TC/RM di controllo; telemetria 24 h ([[ORION — Protocolo — v2.2]], p. 54, p. 56).
- **Esami prima della dose**: emocromo, coagulazione, biochimica (con eGFR), glicemia (va bene la capillare), test di gravidanza, ECG a 12 derivazioni (QTc) ([[ORION — Protocolo — v2.2]], p. 26–29, p. 62).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Screening | prima della randomizzazione | criteri, imaging multimodale, esami, ECG, NIHSS, mRS pre, consenso | ([[ORION — Protocolo — v2.2]], p. 26–28) |
| Visita 1 | dalla dose al G7 o alla dimissione (la prima delle due) | monitoraggio 0–72 h, ECG a 0/1/24 h, PK, esami a 4/24/72 h, **imaging a 24 ± 6 h**, NIHSS, mRS, Barthel | ([[ORION — Protocolo — v2.2]], p. 26–29) |
| Visita 2 | G30 (±7) | telefono o telemedicina (in presenza su richiesta) | ([[ORION — Protocolo — v2.2]], p. 28) |
| Visita 3 | G90 (±7) | **in presenza quando possibile**, poi telemedicina o telefono: mRS, Barthel, EQ-5D-5L, SIS-16 | ([[ORION — Protocolo — v2.2]], p. 28) |

## Consenso
- **Protocollo**: scritto, del paziente, del rappresentante legale o di un medico indipendente se la normativa locale lo permette; consenso a distanza (eConsent, fax, telefono) se il CEIm lo ammette; il paziente riconferma quando recupera la capacità ([[ORION — Protocolo — v2.2]], p. 46, p. 50, p. 88).
- **CI spagnolo v1.0**: firma del paziente; firma "en representación" del rappresentante legale o testimone; testimone imparziale solo se il paziente non sa o non può leggere o scrivere ([[ORION — CI — v1.0]], p. 15–18). Il consenso d'urgenza del medico indipendente non è previsto nel CI. CEIm di riferimento: Hospital Universitario de Bellvitge ([[ORION — CI — v1.0]], p. 1).
- **Lingue**: in Drive c'è solo il CI in castellano.

## Co-arruolamento
- Esclusione 25: nessun altro studio con dispositivo sperimentale, né studio interventistico con farmaco sperimentale (o approvato usato a scopo sperimentale) nei 90 giorni precedenti, né in programma ([[ORION — Protocolo — v2.2]], p. 50). Chi si arruola in un altro studio interventistico durante il follow-up va ritirato ([[ORION — Protocolo — v2.2]], p. 58).
- È quindi incompatibile con gli studi su dispositivi di trombectomia (es. [[ARTEMIS]]) nello stesso evento. Gli studi specifici non sono elencati.

## Cosa cambia con la v3.1
Fonti: [[ORION — Protocolo — v3.1]], [[ORION — Cambios — v3.0 a v3.1]]. Confronto testuale completo v2.2 → v3.1; la v3.1 include la v3.0 (04-02-2026) e la v3.01 (solo UK).

> [!warning] Stato di approvazione incerto
> La v3.1 è firmata dal promotore (6/6/2026), ma in Drive non c'è l'approvazione del CEIm o dell'AEMPS. Nella cartella condivisa è in "Pendiente aprobar" con la decisione spagnola della stessa data. Finché non è confermata, vale la v2.2.

| Area | v2.2 (vigente) | v3.1 | Effetto pratico |
|---|---|---|---|
| **Parte 2** | si apre dopo l'interim e la raccomandazione dell'IDMC; può partire mentre la Parte 1 completa il follow-up (p. 15–16, p. 42) | si apre solo **dopo l'analisi finale della Parte 1** (ultima visita a 90 giorni e blocco del database); dose scelta dal promotore; numerosità finale della Parte 2 da definire (v3.1 p. 24, p. 50, p. 93) | la pausa si allunga: per ora nessun nuovo paziente |
| **Esclusione 9, eGFR** | <60 mL/min/1,73 m² (p. 48) | **<30** mL/min/1,73 m² (v3.1 p. 28, p. 56; cambio della v3.0) | diventano eleggibili i pazienti con eGFR 30–59 |
| **Inclusione 3** | "high grade or complete occlusion" (3a: "high grade stenosis or occlusion") (p. 46) | "high grade **stenosis** or complete occlusion" (v3.1 p. 25, p. 54) | solo chiarimento: la stenosi serrata sintomatica è esplicitamente ammessa |
| Mismatch in §4.1.1 | ">10 mL" (p. 44) | "≥10 mL" (v3.1 p. 51) | allineato ai criteri (≥10) |
| Tab. 1 | mRS allo screening + mRS pre-ictus | tolto il mRS allo screening | nessuno per l'eleggibilità |
| Biomarcatori, Ca/P | obbligatori | facoltativi (biomarcatori con consenso; Ca e P "where possible") | il CI v1.0 va aggiornato |
| Statistica, IDMC | interim, IDMC per la dose | niente interim nella Parte 1; IDMC solo per la sicurezza; stime ICH E9(R1) | nessuno per la selezione |

**Invariati**: età e regola >85 anni, NIHSS ≥5, mRS <2, finestra 4,5–6 h / 4,5–24 h, criteri di perfusione, vasi ammessi (oltre a "stenosis"), esclusione 3 sulla EVT con il limite del 30%, tutte le altre esclusioni, dosi, visite e consenso.

**Per l'app** (vedi le divergenze): la v3.1 non cambia la logica di eleggibilità. Il cambio dell'eGFR non tocca l'app, che non lo controlla. La stenosi serrata non si può indicare nell'app, che chiede solo vasi occlusi: già con la v2.2 (3a) è un [NC]. La v3.1 rende più netta la divergenza sullo stato (punto 1).

## Divergenze con EnsApp
> [!done] Correzioni applicate all'app il 2026-10-20 (commit `9895f0a`, dopo il controllo incrociato)
> - ✅ incl. 4: tra 4,5 e 6 h una perfusione fatta e negativa esclude (prima contava solo oltre 6 h)
> - ✅ la risposta "controindicazioni" della scheda TENACITY non esclude più ORION quando la scheda è nascosta
> - ⚠ la domanda sul mismatch usa le soglie di TENACITY (ratio ≥1,2, >10 mL); ORION vuole ratio >1,2 e ≥10 mL: differenza solo ai valori limite
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `99d4582`)
> - ✅ 2 nuova domanda nella scheda EVT: "EVT possibile entro 1 h dall'inizio del farmaco?" (sì esclude)
> - ✅ 3 la perfusione e il core esteso sono ora nella scheda Imaging comune: anche i non candidati a EVT vengono valutati
> - ✅ 4 solo vasi del protocollo (ICA intracranica, M1, M2, rami distali ACM/ACA/ACP), un solo territorio
> - ✅ 5 oltre 6 h serve il mismatch · ✅ 6 NIHSS ≥5 · ✅ 7 mRS 0 tra 86 e 90 anni
> - ✅ 9, 10, 11 testi di trombolisi, imaging e trombectomia
> - ORION resta `active` per decisione del team (1 non toccato); restano aperti 8, 12-14
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `ac10c24`)
> - ✅ la registrazione rapida ora salva la colonna del foglio dati

Confronto della v2.2 (vigente) con:
- `src/lib/domain/trials-info.ts:229-241`;
- `src/lib/domain/acute-rules.ts:290-301` (`orion()`);
- `src/lib/domain/acute-reasons.ts:178-187` (`reasonOrion`);
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/lib/domain/vessels.ts`.

Verificato il 2026-10-19.

> [!success] Coincide
> - età 18–90 (`acute-rules.ts:294-295`);
> - mRS pre ≤1, cioè <2 (`:296`);
> - finestra 4,5–24 h inclusa (`:292-293`);
> - almeno un vaso occluso (`:298`);
> - testi su intervento (JX10 1 o 3 mg/kg vs placebo, `trials-info.ts:238`), esami pre-dose (`:237`) ed esclusioni nelle note (core >70 mL, più territori, EVT diretta o prima del farmaco, `:239`), come foglio e protocollo;
> - nessun criterio ASPECTS (`:232` "aspects: '-'").

- [ ] **1. [FP] Stato: l'app propone ORION, il foglio dice "en pausa".**
> [!warning] Contraddizione
> Foglio [[Esquema ensayos — septiembre 2026]]: "en pausa (pendiente 2ª parte de reclutamiento)". Protocollo: la Parte 2 inizia solo dopo la raccomandazione dell'IDMC e la notifica ai centri ([[ORION — Protocolo — v2.2]], p. 15, p. 42); con la v3.1, solo dopo l'analisi finale della Parte 1 ([[ORION — Protocolo — v3.1]], p. 24, p. 50).
> App: `trials-info.ts:230` `status: "active"`; `isTrialOpen()` (`:410-413`) lo lascia fra gli eleggibili (`Summary.svelte:32`, `:48`). Il team ha deciso di non cambiarlo il 2026-10-19 ([[Estado de los estudios]]): segnalato, non corretto.

- [ ] **2. [FP] La EVT disponibile entro 1 h non viene controllata, e ORION si valuta quasi solo nei candidati a EVT.**
> [!warning] Contraddizione
> Protocollo, esclusione 3: "Availability of endovascular thrombectomy (EVT) for current AIS (in whom EVT is indicated) where planned EVT would be feasible […] within 1 hour following the start of study drug infusion" (p. 48). Si arruolano solo pazienti senza accesso pronto alla EVT, non candidati, o con almeno 1 h di attesa prima della EVT; le EVT pianificate sono al massimo il 30% (p. 43) ([[ORION — Protocolo — v2.2]]).
> App: `orion()` non ha condizioni sulla EVT (`acute-rules.ts:290-301`). Il selettore dei vasi compare soprattutto con "Candidato a trombectomia (EVT)? → Eleggibile" (`PostImaging.svelte:102`, `:163-169`). In un centro con angiografia sempre disponibile, quasi tutti i candidati a EVT hanno la puntura entro 1 h e sono esclusi: falsi positivi. Il testo `trials-info.ts:239` cita l'esclusione, la regola no.

- [ ] **3. [FN] I pazienti non candidati a EVT (la popolazione principale) passano solo dalla scheda TENACITY.**
> [!warning] Contraddizione
> Protocollo: la popolazione target comprende chi "are ineligible to EVT" e i rami distali di ACM, ACA e ACP ([[ORION — Protocolo — v2.2]], p. 43, p. 46).
> App: con "Non eleggibile" a EVT, i vasi si chiedono solo nella scheda TENACITY (`PostImaging.svelte:106-108`, `:190-201`), etichettata "Occlusione su angio-TC (M1 / M2 per TENACITY)" (`src/lib/i18n/it.ts:184`) e facoltativa per l'invio (`:138`). Se non si compila, `selectedVesselCount` = 0 e ORION è falso (`acute-rules.ts:298`). Una risposta "Sì" a "Controindicazioni alla trombolisi?" nella stessa scheda esclude anche ORION (`:299`). Ci sono quindi falsi negativi nei pazienti con occlusione distale non trattabili con EVT.

- [ ] **4. [FP] Qualunque vaso va bene, anche basilare e vertebrale, e più vasi insieme.**
> [!warning] Contraddizione
> Protocollo: solo "intracranial internal carotid, M1, M2, or distal branches of the MCA, ACA, or PCA" (inclusione 3, p. 46); esclusa "Occlusion in more than 1 vascular territory" (esclusione 1b, p. 47) ([[ORION — Protocolo — v2.2]]).
> App: `selectedVesselCount(...) >= 1` (`acute-rules.ts:298`; `acute-reasons.ts:184` "almeno un vessel") accetta anche "Basilar" e "VA" (`vessels.ts:21`, `:25`) e combinazioni di più territori.

- [ ] **5. [FP] Oltre 6 h non si chiede la perfusione.**
> [!warning] Contraddizione
> Protocollo, inclusioni 4–5: "Perfusion is mandatory for patients presenting beyond 6 hours". Servono rapporto >1,2, core <70 mL e mismatch ≥10 mL; oltre 6 h serve la penombra (p. 46–47). Esclusione 1a: core >70 mL o ipodensità >1/3 ACM (p. 47) ([[ORION — Protocolo — v2.2]]).
> App: `input.ltsw >= 4.5 && input.ltsw <= 24` senza altre condizioni (`acute-rules.ts:292-293`). I campi `perfusionMismatch` e `largeCore` esistono, ma solo nella scheda TENACITY, e `orion()` non li usa. Anche il testo `trials-info.ts:232` "4.5-24 h" non cita il limite di 6 h senza perfusione (il foglio sì: "4,5-6 h / 4,5-24 h").

- [ ] **6. [FN] NIHSS 5 viene escluso.**
> [!warning] Contraddizione
> Protocollo, inclusione 6: "Pre-treatment score of NIHSS ≥ 5" ([[ORION — Protocolo — v2.2]], p. 47; foglio: "≥5").
> App: `input.nihss > 5` (`acute-rules.ts:297`; `acute-reasons.ts:183` "NIHSS > 5"; `trials-info.ts:232` "> 5").

- [ ] **7. [FP] Fra 86 e 90 anni si accetta mRS 1.**
> [!warning] Contraddizione
> Protocollo, inclusioni 1 e 7: "Age > 85 must be mRS 0"; "premorbid mRS < 2 (< 1 if age 86-90)" ([[ORION — Protocolo — v2.2]], p. 46–47).
> App: `input.premrs <= 1` per tutte le età (`acute-rules.ts:296`); `trials-info.ts:232` "mrs: '0-1'" senza la nota.

- [ ] **8. [NC] "Controindicazioni alla trombolisi" non è un criterio del protocollo.**
> [!warning] Contraddizione
> Protocollo: esclusioni specifiche, che coincidono solo in parte con le controindicazioni alla trombolisi standard. Per esempio INR >1,7, piastrine <100.000, eGFR <60, QTc, UGT1A1, infarto cerebrale nei 90 giorni ([[ORION — Protocolo — v2.2]], p. 48–49).
> App: `input.contraTpa === "no"` (`acute-rules.ts:299`; `acute-reasons.ts:185`). La domanda è solo nella scheda TENACITY (default "no", `PostImaging.svelte:43`, `:212-214`), quindi nel percorso EVT la condizione è sempre vera. Le altre esclusioni non sono modellate: anticoagulanti orali nelle 48 h (il campo `doac` esiste, per DO-IT), doppia antiaggregazione, laboratorio, eGFR, QTc, gravidanza, trombolisi nei 90 giorni.

- [ ] **9. [TXT] Il campo "thrombolytic" mescola due cose e conta l'ora dalla fine dell'infusione.**
> [!warning] Contraddizione
> Protocollo: la trombolisi standard è esclusa (esclusione 18, p. 49). L'ora prima della EVT si conta dall'**inizio** dell'infusione: "allow for an hour between start of study drug infusion and start of endovascular procedure" (p. 30); "at least one hour or more, from the beginning of the study drug administration" (p. 43); esclusione 3 "following the start of study drug infusion" (p. 48). La sinossi è ambigua: "following study drug infusion" (p. 18) ([[ORION — Protocolo — v2.2]]).
> App: `trials-info.ts:235` "Yes - administer study drug 1 h before EVT; ensure >= 1 h from end of infusion to femoral puncture." Andrebbe "No" (trombolisi esclusa); la regola dell'ora appartiene al campo trombectomia ed è più restrittiva del protocollo (fine dell'infusione, cioè circa 1 h 31 min dall'inizio). Il foglio dice "no" e "farmaco 1 h prima della TEV".

- [ ] **10. [TXT] Testo dell'imaging incompleto.**
> [!warning] Contraddizione
> Protocollo, inclusione 3: rami distali di **ACM, ACA e ACP**; anche "high grade stenosis"; prova con angio-TC/RM, perfusione, arteria iperdensa in TC o SVS in RM; perfusione obbligatoria oltre 6 h ([[ORION — Protocolo — v2.2]], p. 46).
> App: `trials-info.ts:234` "Intracranial ICA, M1/M2 MCA, distal ACA branches occlusion confirmed on CTA." Mancano i rami distali di ACM e ACP, la stenosi, le altre modalità e la perfusione. Anche il foglio omette la ACP.

- [ ] **11. [TXT] Testo della trombectomia senza i limiti del protocollo.**
> [!warning] Contraddizione
> Protocollo: EVT pianificata solo in ICA, M1 e M2 prossimale, ≥1 h dopo l'inizio del farmaco, al massimo nel 30% dei randomizzati, e solo in pazienti senza EVT disponibile subito ([[ORION — Protocolo — v2.2]], p. 43).
> App: `trials-info.ts:236` "Yes (EVT after study drug as per timing rule)."

- [ ] **12. [TXT] Consenso: il testimone imparziale non sostituisce il rappresentante.**
> [!warning] Contraddizione
> Protocollo: paziente, rappresentante legale o medico indipendente, se la normativa locale lo permette (p. 46, p. 88). CI: testimone imparziale solo se il paziente non sa o non può leggere; altrimenti firma del rappresentante legale o testimone "en representación" ([[ORION — CI — v1.0]], p. 16–18).
> App: `trials-info.ts:233` "Written (impartial witness permitted)." (come il foglio). È corretto ma incompleto: manca il rappresentante legale, che è la via abituale per un paziente con afasia o incapace.

- [ ] **13. [TXT] Visite non indicate.**
> [!warning] Contraddizione
> Protocollo: G7 o dimissione, G30 (±7) telefonico, G90 (±7) **in presenza quando possibile** ([[ORION — Protocolo — v2.2]], p. 26–28).
> App: `trials-info.ts:240` `visits: null`. Il foglio dice "30 e 90 gg telefoniche": per il G90 la telefonata è solo il ripiego.

- [ ] **14. [NC] Finestra misurata quando si usa l'app.**
> Protocollo: conta l'ora del trattamento previsto ("intended study treatment", p. 47). App: `ltsw` sono le ore trascorse al momento della valutazione (`stores/patient.ts:82-90`). Differenza di bordo: un paziente valutato a 4 h può ricevere il farmaco dopo le 4,5 h. Tenere conto anche del NIHSS da ripetere se sono passati ≥60 min (p. 30).

> [!note] Con la v3.1
> Nessuna divergenza nuova nella logica. L'eGFR <30 (invece di <60) e la stenosi serrata esplicita non sono comunque controllati dall'app ([NC]). La divergenza 1 (stato) diventa più netta, perché la Parte 2 aspetta l'analisi finale della Parte 1.

## Problemi documentali
- **Protocollo v3.1 "pendiente de aprobación"**: firmato, approvazione non documentata in Drive. Manca anche la v3.0, che introduce l'eGFR <30.
- **Esclusione 3**: ora dall'**inizio** dell'infusione nel §5.2, nel §4.1 e nella nota x; ora "following study drug infusion" nella sinossi, in entrambe le versioni ([[ORION — Protocolo — v2.2]], p. 18, p. 30, p. 43, p. 48).
- **Mismatch**: ">10 mL" nel §4.1.1 della v2.2 (p. 44) contro "≥10 mL" nei criteri; corretto nella v3.1.
- **Core di 70 mL esatti**: non assegnato (inclusione <70, esclusione >70).
- **CI v1.0** ([[ORION — CI — v1.0]]):
  - cita immagini "4 horas después de la infusión", eliminate dal protocollo già nella v2.0;
  - non prevede il consenso d'urgenza del medico indipendente;
  - presenta i biomarcatori come obbligatori (facoltativi nella v3.1);
  - descrive il placebo come "agua y sales", mentre il protocollo lo dà come liofilizzato con HCO-60.
- **Foglio del team**: "rami distali ACA" senza la ACP; G90 "telefonica" (il protocollo la vuole in presenza quando possibile).
- **Registro**: numero NCT non riportato nei documenti (solo IND ed EU CT).

## Fonti
- [[ORION — Protocolo — v2.2]] (vigente)
- [[ORION — Protocolo — v3.1]] (in attesa di approvazione)
- [[ORION — Cambios — v3.0 a v3.1]]
- [[ORION — CI — v1.0]]
- [[Esquema ensayos — septiembre 2026]] (stato)
