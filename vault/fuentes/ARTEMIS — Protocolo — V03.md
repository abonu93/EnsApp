---
tipo: fuente
estudio: "[[ARTEMIS]]"
documento: Protocolo
version: "V03 (Clinical Investigation Plan, Document Number AN11313, Study Code CON2501)"
fecha: 2026-02-23
idioma: inglés
paginas: 84
drive_id: "1uaF8hX20svJDtToI43R96Yl7jQDKuzvP"
drive_url: "https://drive.google.com/file/d/1uaF8hX20svJDtToI43R96Yl7jQDKuzvP/view"
lectura: parcial
actualizado: 2026-10-19
---
# ARTEMIS — Protocolo — V03

> [!info] Lettura
> **Parziale: pp. 1–80 lette per intero, p. 81 in parte, pp. 82–84 non lette.**
> - Il metodo standard (`download_file_content` + `pdftotext -layout`) **non ha funzionato**: il PDF pesa 8,7 MB e in due tentativi il server Drive ha chiuso la connessione ("message too large"). Lo stesso succede con la copia originale (`Protocolo ARTEMIS actualizado.pdf`, stessa dimensione).
> - Il testo viene da `read_file_content`: 193.057 caratteri, **troncato** a p. 81 (Appendix 4, elenco delle pubblicazioni, fermo al riferimento 63). Mancano il resto dell'Appendix 4 e, probabilmente, l'**Appendix 5 (publication policy)**, citata a p. 69. Non hanno contenuto clinico per l'eleggibilità, ma la lettura non è completa.
> - Le pagine 5, 21, 51, 68, 75 e 76 non hanno testo estraibile (solo l'intestazione). Il testo prima e dopo prosegue senza salti: probabilmente sono pagine con immagini o tabelle grafiche. Da ricontrollare sul PDF.
> - Senza layout, le tabelle arrivano appiattite: Tabella 1 (specifiche del dispositivo), Tabella 2 (calendario), Tabella 8 (relazione causale), Tabelle 9–10 (SAE ed eventi attesi). I contenuti qui sotto sono stati ricostruiti con cautela.
> - **Figure in immagine, non leggibili**: Figura 1 (dimensioni del dispositivo, p. 19), Figura 2 (varianti anatomiche di M2 ammesse, p. 29; la didascalia è leggibile), Figura 3 (flusso dei soggetti, p. 31).
> - Pagine numerate secondo il piè di pagina "Page: N of 84". L'indice (pp. 10–11) coincide con questa numerazione.

## Indice del documento
| Sezione | Pagina |
|---|---|
| Frontespizio, pagine firme (PI di centro, sponsor) | 1–4 |
| Study Synopsis (criteri p. 6–8, endpoint p. 8–9) | 6 |
| Revision history, indice, elenchi, abbreviazioni | 10–14 |
| Personnel and facilities | 15 |
| 1. Introduction; 1.1 CONDA device description (IFU p. 20–22) | 17 |
| 2. GCP statement | 22 |
| 3. Investigational plan: obiettivo ed endpoint (p. 23–25); 3.5 criteri (p. 25–26); 3.6 procedure (p. 27–33) | 23 |
| 4. Examinations and evaluations (mRS, eTICI, NIHSS, Heidelberg) | 35 |
| 5. Statistical approach | 39 |
| 6. Evaluation of adverse events | 44 |
| 7. Risk benefit analysis | 55 |
| 8. DMC and Core Laboratory | 59 |
| 9. Study conduct (consenso p. 61) | 61 |
| 10. Quality control and assurance | 66 |
| 11. Protocol amendments | 70 |
| 12. References | 71 |
| 13. Appendices (1 centri p. 73; 2 NIHSS p. 74; 3 CRF Criteria A p. 77; 4 pubblicazioni p. 78–) | 73 |

## Punti chiave
- **Titolo**: "A Prospective, Single-Arm, Multi-Center Study to Assess the Safety, Performance and Preliminary Efficacy of Mechanical Thrombectomy Using the CONDA Stent Retriever in Subjects with Acute Ischemic Stroke" (The ARTEMIS Study) (p. 1).
- **Identificativi**: Study Code CON2501; Document Number AN11313; Version 03, 23-02-2026 (p. 1). La firma dello sponsor è datata 26-02-2026 (p. 4). Registrazione prevista su clinicaltrials.gov (p. 62), ma **il numero NCT non è riportato nel documento**.
- **Storia delle versioni** (p. 10): V01 07-01-2025 (iniziale). V02 11-12-2025: cambio del Principal Investigator, chiarimenti sulla diagnosi di ICAD, farmaci concomitanti, segnalazione degli AE, termine AESI, un nuovo endpoint secondario di efficacia, aggiunta di Bellvitge come centro, sintesi preliminari dei dati. V03 23-02-2026: aumento della numerosità, refuso nella durata, raccolta del mRS, AE e difetti del dispositivo, discrepanze con il Core Lab, loghi (vedi [[ARTEMIS — Cambios — V02 a V03]]).
- **Promotore e fabbricante**: ANACONDA BIOMED, S.L. (Sant Quirze del Vallès, Barcellona). CRO e Core Lab di neuroimmagine: AVANIA CLINICAL, Barcellona. Trial Principal Investigator: Sandor Nardai, Semmelweis University, Budapest (p. 15).
- **Dispositivo**: C CONDA® (CONDA), stent retriever autoespandibile in nitinol a celle chiuse, con 3 marcatori radiopachi distali; compatibile con microcatetere di 0,021" di diametro interno e 130–160 cm di lunghezza; utilizzabile con catetere guida, catetere a palloncino (BGC), catetere di accesso distale (DAC) e catetere a imbuto ANA (p. 6, p. 18). Specifiche (Tabella 1, appiattita): vaso raccomandato 2,0–4,0 mm, stent da 4 mm di diametro e 40 mm di lunghezza utile (p. 19). **Senza marcatura CE e mai usato prima nell'uomo** (secondo il CI: [[ARTEMIS — CI — V03]], p. 2, p. 5).
- **Indicazione**: AIS da occlusione di grande vaso (LVO). Sono candidati i pazienti non eleggibili alla trombolisi o in cui la trombolisi è fallita (p. 6, p. 18).
- **Disegno**: studio pilota, prospettico, multicentrico, a braccio unico, in aperto, interventistico (p. 6, p. 23). Fino a 5 centri europei ad alto volume attivi 24/7 (p. 7). **Fino a 60 soggetti** (prima erano 50), compresa un'attrition del 10%, con arruolamento competitivo (p. 7, p. 25, p. 42).
- **Endpoint primario di performance**: successo del dispositivo, cioè raggiungere il vaso occluso, aprirsi e venire recuperato, favorendo la riperfusione (p. 8, p. 23). Il successo richiede due criteri insieme (p. 39–41):
  - Criterio A: performance tecnica valutata dall'operatore con una scala Likert 1–4 in 4 domini (navigazione, rilascio, recupero, integrità). Un punteggio di 1 o 2 in un qualunque dominio equivale a fallimento (CRF in Appendix 3, p. 77).
  - Criterio B: [[TICI|eTICI]] ≥2b50 entro 3 passaggi del dispositivo nel territorio target, senza terapia di salvataggio, valutato dal Core Lab.
- **Endpoint primario di sicurezza**: [[Hemorragia intracraneal sintomática|sICH]] secondo SITS-MOST, attribuibile al dispositivo o alla procedura, entro 24 h (−8/+12) dalla procedura, giudicata dal Core Lab e dal DMC (p. 8, p. 23).
- **Endpoint secondari**: di efficacia, mRS 0–2 a 90 giorni; eTICI ≥2c entro 3 passaggi senza salvataggio; first pass effect con eTICI ≥2c e con eTICI ≥2b67; eTICI ≥2b50 e ≥2c a fine procedura. Di sicurezza, mortalità legata all'ictus a 90 giorni; qualunque ICH a 24 h (classificazione di Heidelberg); SAE legati alla procedura o al dispositivo a 5 giorni o alla dimissione; embolizzazione in un territorio nuovo; peggioramento del NIHSS ≥4 a 24 h (p. 8–9, p. 23–24).
- **Endpoint esplorativi**: mortalità totale a 90 giorni; tutti gli AE; NIHSS a 5 giorni o alla dimissione; shift del mRS dal pre-ictus a 90 giorni; tempo puntura-riperfusione; durata della procedura; uso di terapia di salvataggio; numero di passaggi; difetti del dispositivo (p. 9, p. 24–25).
- **Statistica**: test di non inferiorità a un campione rispetto a un benchmark storico del 71% (mTICI 2b–3 entro 3 passaggi, revisione della letteratura 2012–2024 su 3381 soggetti), con margine del 15%. Il successo si dichiara se il limite inferiore dell'IC 95% di Wilson supera il 56% (p. 41). Successo atteso di CONDA 76%, α 0,05 bilaterale, potenza 80%, 45 soggetti valutabili (p. 42). Analisi primaria sulla popolazione PP (p. 42). Gli ICAD non trattabili con trombectomia sono esclusi dalla PP (p. 39).
- **Arruolamento**: con la V03 "enrollment may be temporarily capped or paused at individual sites as operationally required" fino all'approvazione dell'emendamento (p. 42). Durata stimata: 10 mesi di arruolamento, 13 mesi in totale (p. 9).
- **Selezione sequenziale**: si parte da mRS pre-ictus e NIHSS; solo con mRS pre ≤2 e NIHSS 6–25 si prosegue con lo screening completo. Per l'eleggibilità iniziale si possono usare gli esami di routine fatti prima del consenso (p. 29).
- **Finestra**: entro 24 h dall'ultima volta visto bene fino alla **puntura arteriosa** in sala angiografica (p. 25, p. 29–30).
- **Trombolisi**: alteplasa o tenecteplasa secondo le linee guida AHA/ASA o ESO, senza ritardi per lo studio. Sono eleggibili anche i pazienti fuori finestra o con controindicazioni alla trombolisi (p. 25, p. 30).
- **Procedura**: DSA (proiezioni AP e LAT) all'inizio, dopo ogni passaggio e alla fine; l'eTICI iniziale va confermato per l'eleggibilità (p. 31). Sedazione, anestesia e anticoagulazione secondo la pratica del centro (p. 31). Dispositivi di supporto (BGC, DAC, ANA) a scelta dell'operatore (p. 31–32). **Fino a 3 passaggi con CONDA**; dopo, o prima se l'operatore lo ritiene, è ammessa la terapia di salvataggio con altri dispositivi o farmaci. Cambiare cateteri di aspirazione o BGC non conta come salvataggio (p. 25, p. 32). **Non sono ammessi la tecnica a doppio stent né l'accesso carotideo diretto**; solo accesso femorale o radiale (p. 32).
- **Discrepanze di eTICI fra centro e Core Lab**: ai fini dell'arruolamento prevale la valutazione in tempo reale dello sperimentatore (p. 60).
- **Esami di laboratorio**: secondo la pratica locale. Suggeriti coagulazione (PTT, PT, INR), emocromo, glicemia e creatinina (p. 35). Test di gravidanza solo se lo richiede la normativa locale e quando è fattibile (p. 35).
- **Sicurezza**: si raccolgono tutti gli AE dalla procedura al giorno 90. Gli screen failure intra-operatori sono seguiti per 72 h o fino alla dimissione (p. 44). AESI: qualunque ICH entro 24 h, SADE, peggioramento del NIHSS ≥4 a 24 h, morte, complicanze procedurali come embolizzazione, perforazione, dissezione e vasospasmo (p. 45). SAE da segnalare entro 3 giorni (p. 53).
- **Chiusura dei centri**: possibile se il centro arruola meno di 1 soggetto ogni 10 settimane (p. 67).
- **Centri** (Appendix 1, p. 73): Vall d'Hebron (Barcellona), Semmelweis University Hospital (Budapest), Bellvitge (L'Hospitalet de Llobregat), più due centri "TBD". I recapiti personali non sono riportati qui.

## Criteri (testuali)

### 3.5.1 Inclusion Criteria (p. 25)
"Up to 60 subjects with LVO-AIS meeting the following study entry criteria will be enrolled." (p. 25)

Subjects meeting all inclusion criteria will be considered for enrollment.

1. Age 18 to 85 years.
2. Informed consent was obtained from subject or acceptable subject surrogate (e.g., next of kin, or legal representative).
3. New focal disabling neurologic deficit consistent with acute cerebral ischemia.
4. Baseline NIHSS obtained prior to procedure ≥ 6 points and ≤ 25 points.
5. Pre-ictal mRS score of 0, 1 or 2.
6. Treatable within 24 hours of stroke symptom onset.
   Note: Onset time is defined as the last time the patient was observed to be at their baseline neurological status.
   Note: Treatment start is defined by access puncture time.
7. If indicated, thrombolytic therapy shall be initiated following recommendations established by the AHA/ASA and/or ESO Guidelines. Subjects eligible for IV thrombolysis should receive it without delay.
8. Extended Thrombolysis in Cerebral Infarction (eTICI) Score 0 – 1, confirmed by angiography or CTA/MRA of the:
   a. Intracranial internal carotid artery (ICA)
   b. Middle cerebral artery - M1 segment
   c. Middle cerebral artery - M2 proximal or dominant segments
9. Imaging criteria:
   - Alberta Stroke Program Early CT Score (ASPECTS) 6 to 10 on baseline CT or DWI-MRI.
   - If automated assessment, core volume of ≤50 cc on CTP/ DWI-MRI.

### 3.5.2 Exclusion Criteria (p. 25–26)
Subjects who meet any of the exclusion criteria will be ineligible for participation in the study. The following exclusion criteria will be assessed pre-operatively:

1. Rapid neurological improvement prior to enrollment suggesting resolution of stroke. (p. 25)
2. Subject was diagnosed with a stroke in the last 6 months. (p. 25)
3. Clinical symptoms suggestive of bilateral stroke or stroke in multiple territories. (p. 25)
4. Clinical presentation suggests subarachnoid hemorrhage. (p. 25)
5. Known hemorrhagic diathesis, coagulation factor deficiency, or oral anticoagulant therapy with antivitamin K, with INR >3.0. (p. 25)
6. Known baseline glucose of <50 mg/dL or >400 mg/dL. (p. 26)
7. Severe, sustained uncontrolled hypertension refractory to treatment (systolic blood pressure >185 mmHg or diastolic blood pressure >110 mmHg). (p. 26)
8. Serious, advanced, or terminal disease with anticipated life expectancy of less than 1 year. (p. 26)
9. Known history of severe sensitivity (more than rash) to contrast medium. (p. 26)
10. Known history of severe sensitivity to nickel, titanium metals or their alloys. (p. 26)
11. Known renal insufficiency with creatinine ≥3 mg/dL or glomerular filtration rate (GFR) <30 mL/min. (p. 26)
12. Subject requires hemodialysis or peritoneal dialysis. (p. 26)
13. Subject is a current user or has a recent history of cocaine and/or heroin use. (p. 26)
14. Known pregnancy and/or lactating female. (p. 26)
15. Subject is participating in a concurrent study involving an investigational drug or device that would impact the primary endpoint of this study. (p. 26)
16. Subject is unlikely to be available for a 90-day follow-up (e.g., no fixed home address, visitor from overseas, etc.) (p. 26)
17. CT or MRI evidence of hemorrhage (the presence of microbleeds is allowed). (p. 26)
18. CT or MRI evidence of significant mass effect with midline shift. (p. 26)
19. CT or MRI evidence of intracranial tumor (except asymptomatic meningioma of ≤ 2cm in diameter). (p. 26)
20. CT or MR evidence of cerebral vasculitis. (p. 26)
21. Suspicion of aortic dissection, presumed septic embolus, or bacterial endocarditis. (p. 26)
22. History of preexisting stent proximal to or at the occlusion site that may preclude safe deployment or recovery of the stent retriever. (p. 26)

The following exclusion criteria will be assessed intra-operatively:

23. eTICI score improvement to greater than eTICI 1 after initial screening and prior to intervention. (p. 26)
24. Initially treated with a different thrombectomy device during the current study procedure. (p. 26)
25. Vessel tortuosity too difficult to allow endovascular access of the intracranial internal carotid artery (ICA) per investigator judgement. Indicators of vessel tortuosity include but are not limited to the presence of carotid loops and type 3 aortic arches. (p. 26)
26. Evidence of tandem lesions, including complete occlusion, high-grade stenosis or arterial dissection in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus. (p. 26)
27. Underlying intracranial atherosclerotic disease (ICAD) lesions responsible for the target occlusion. (p. 26)
28. Occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation). (p. 26)
29. Inability to gain arterial access. (p. 26)

### Sede dell'occlusione allo screening (§3.6.3, p. 29)
"Subjects presenting with an AIS due to a single occlusion of either the: • Intracranial or Terminal ICA • MCA - M1 segment • MCA - Proximal or dominant divisions of the M2 segment (Figure 2)" (p. 29).
Didascalia della Figura 2: si possono trattare l'M2 "M1-like", una delle due divisioni co-dominanti, il ramo dominante (più grande per diametro e flusso) e, nelle triforcazioni, uno dei due rami dominanti più grandi o il ramo di diametro maggiore (p. 29).

> [!note] Sinossi
> La sinossi (p. 6–8) riporta gli stessi 9 criteri di inclusione e 29 di esclusione, con una differenza nel criterio 26. Vedi sotto.

## Note e anomalie
- > [!warning] Contraddizione — esclusione 26 (lesioni in tandem)
  > Sinossi: "Evidence of tandem lesions, including complete occlusion, high-grade stenosis or arterial dissection in the extracranial or **intracranial** internal carotid artery (ICA), requiring treatment or preventing access to thrombus." (p. 7)
  > Corpo, §3.5.2: "… in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus." (p. 26)
  > Nel corpo manca "intracranial". Probabilmente è un refuso, ma non lo risolviamo d'ufficio: domanda per il promotore. In entrambe le versioni il criterio si valuta **in sala** ("assessed intra-operatively") ed esclude **solo** le lesioni in tandem che "requiring treatment or preventing access to thrombus". Coerente con il divieto di doppio stent e di accesso carotideo (p. 32).
- **"Randomized" in uno studio a braccio unico**: §3.6.7 dice "Subjects who meet all inclusion and no exclusion criteria will be randomized" (p. 31). È un refuso: non esiste randomizzazione.
- **Numerosità incoerente**: §5.4 dice ancora "up to 50 subjects will be recruited" (p. 42), mentre sinossi, §3.5 e §5.5 dicono fino a 60 (p. 7, p. 25, p. 42). Il documento dei cambi conferma che il §5.4 non è stato aggiornato ([[ARTEMIS — Cambios — V02 a V03]], p. 2).
- **Finestre incoerenti**: il NIHSS a 5 giorni è indicato con "Day 5 (± 12 hours)" (p. 37), altrove con ± 24 h (p. 9, p. 27, p. 32). I farmaci concomitanti fino al "Day 90 (± 14 h)" (p. 38), contro ± 14 giorni altrove (p. 27, p. 33).
- **Nome di eTICI**: "Extended Thrombolysis in Cerebral Infarction" (p. 6, p. 25), "expanded Thrombolysis in Cerebral Infarction" (p. 14), "Expanded Treatment in Cerebral Ischemia" (p. 36). La scala è la stessa (Tabella 4, p. 36).
- **Finestra della sICH**: l'endpoint primario di sicurezza parla di sICH "within 24 hours (-8/+12)", cioè 16–36 h, ma la definizione SITS-MOST riportata subito dopo dice "on imaging, 22 to 36 hours after procedure" (p. 23).
- **Visita a 90 giorni**: "preferably … in person"; per telefono solo se non è fattibile (p. 33).
- **Consenso**: secondo §3.6.1 (p. 28) e §9.2 (p. 61–62), con il consenso del CEIm sono ammessi il consenso di un surrogato (familiare o rappresentante legale), anche a distanza per via elettronica; il consenso differito; un testimone se il paziente capisce ma non può firmare; il consenso orale. Con il consenso orale o con testimone serve un nuovo consenso del paziente appena possibile. Il §10.4 parla invece di "written Informed Consent" (p. 69).
- **ICAD**: va riconosciuto in sala (esclusione 27), ma spesso emerge solo dopo il rilascio del dispositivo; in quel caso il soggetto non è uno screen failure (nota, p. 30) e viene escluso dalla PP (p. 39).
- **Pagine senza testo estraibile**: 5, 21, 51, 68, 75, 76 (vedi il riquadro Lettura).
- **Dati personali omessi**: il documento contiene email e telefoni di sponsor e sperimentatori (p. 15, p. 73), non riportati qui.
