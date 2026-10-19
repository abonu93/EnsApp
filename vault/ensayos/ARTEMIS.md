---
tipo: ensayo
estudio: ARTEMIS
alias: [CON2501, AN11313, "CONDA stent retriever", "The ARTEMIS Study"]
estado_app: activo
clave_app: "ARTEMIS"
categoria: dispositivo
fase: "pilota (clinical development stage: Pilot)"
promotor: "ANACONDA BIOMED, S.L."
registro: ["Study Code CON2501", "Document Number AN11313"]
protocolo_vigente: "V03, 23-02-2026"
ci_vigente: "V03, 23-02-2026 (spagnolo)"
drive_carpeta: "https://drive.google.com/drive/folders/13uPUjR-9CKJRZyK6AHu3y_fzes-EX2yn"
fuentes: ["[[ARTEMIS — Protocolo — V03]]", "[[ARTEMIS — CI — V03]]", "[[ARTEMIS — Cambios — V02 a V03]]"]
actualizado: 2026-10-19
---
# ARTEMIS

> [!summary] In breve
> Studio pilota, prospettico, multicentrico, a braccio unico, in aperto. Valuta sicurezza, performance ed efficacia preliminare della trombectomia meccanica con lo [[Stent retriever|stent retriever]] sperimentale **CONDA** (Anaconda Biomed, senza marcatura CE, primo uso nell'uomo). Popolazione: AIS da occlusione singola di ICA intracranica o terminale, M1 o M2 prossimale o dominante, con [[TICI|eTICI]] 0–1, trattabile entro 24 h dall'ultima volta visto bene fino alla puntura arteriosa. Nessun braccio di confronto: il riferimento è un benchmark storico ([[ARTEMIS — Protocolo — V03]], p. 6, p. 25, p. 29, p. 41).

> [!warning] Stato: foglio del team e app non coincidono
> - **Foglio "Esquema ensayos"** (fonte di verità, modificato il 2026-10-09, ricontrollato il 2026-10-19): **reclutamiento cerrado** ([[Esquema ensayos — septiembre 2026]]).
> - **App**: `status: "active"` (`src/lib/domain/trials-info.ts:110`, commit `5b39216`). Nel working tree c'è una modifica non committata che lo porta a `"closed"` (vedi divergenza 1).
> - **Drive**: la cartella originale è in **ENSAYOS INACTIVOS** (verificato: cartella padre `ENSAYOS INACTIVOS`).
>
> Fa fede il foglio. Il protocollo V03 prevede che l'arruolamento si possa "temporarily capped or paused at individual sites" ([[ARTEMIS — Protocolo — V03]], p. 42). Non è possibile sapere dai documenti se la chiusura sia definitiva o legata al tetto di arruolamento. Va segnalata, non corretta d'ufficio.

## Disegno
- **Tipo**: pilota, prospettico, multicentrico, braccio unico, in aperto, interventistico, con dispositivo medico (MDR 2017/745, ISO 14155:2020) ([[ARTEMIS — Protocolo — V03]], p. 6, p. 22–23).
- **Numerosità**: fino a 60 soggetti, compreso il 10% di attrition (45 valutabili). Con la V03 si è passati da 50 a 60. Fino a 5 centri europei ad alto volume ([[ARTEMIS — Protocolo — V03]], p. 7, p. 42; [[ARTEMIS — Cambios — V02 a V03]], p. 1).
- **Endpoint primario di performance**: successo del dispositivo, cioè criterio A (performance tecnica con scala Likert in 4 domini, tutti ≥3) **e** criterio B ([[TICI|eTICI]] ≥2b50 entro 3 passaggi senza salvataggio, giudicato dal Core Lab). Non inferiorità rispetto al 71% storico con margine del 15%: soglia del limite inferiore dell'IC 95% al 56% ([[ARTEMIS — Protocolo — V03]], p. 39–42).
- **Endpoint primario di sicurezza**: [[Hemorragia intracraneal sintomática|sICH]] SITS-MOST attribuibile al dispositivo o alla procedura, entro 24 h (−8/+12) ([[ARTEMIS — Protocolo — V03]], p. 23).
- **Endpoint secondari**: [[mRS]] 0–2 a 90 giorni; eTICI ≥2c entro 3 passaggi; first pass effect (eTICI ≥2c e ≥2b67); eTICI ≥2b50 e ≥2c finali; mortalità legata all'ictus; ICH secondo Heidelberg a 24 h; SAE legati alla procedura; embolizzazione in un territorio nuovo; peggioramento del NIHSS ≥4 a 24 h ([[ARTEMIS — Protocolo — V03]], p. 23–24).
- **Comitati**: DMC con funzione anche di CEC; Core Lab di neuroimmagine indipendente (AVANIA CLINICAL), che è anche la CRO ([[ARTEMIS — Protocolo — V03]], p. 15, p. 59–60).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Entro 24 h dall'ultima volta visto bene (LKW) all'**inizio del trattamento = puntura arteriosa** | ([[ARTEMIS — Protocolo — V03]], p. 25, p. 29–30) |
| Età | 18–85 anni | ([[ARTEMIS — Protocolo — V03]], p. 25) |
| mRS pre | 0–2 | ([[ARTEMIS — Protocolo — V03]], p. 25, p. 29) |
| NIHSS | 6–25, basale prima della procedura | ([[ARTEMIS — Protocolo — V03]], p. 25) |
| Imaging / ASPECTS / core | [[ASPECTS]] 6–10 su TC o DWI-RM basale; se c'è valutazione automatica, core ≤50 cc su TC-perfusione o DWI-RM | ([[ARTEMIS — Protocolo — V03]], p. 25) |
| Occlusione | eTICI 0–1 confermato con angiografia o angio-TC/angio-RM, occlusione **singola** di ICA intracranica o terminale, M1 o M2 prossimale o dominante (Figura 2). Esclusi territori multipli, ICAD responsabile e lesioni in tandem che richiedono trattamento o impediscono l'accesso (valutazione in sala) | ([[ARTEMIS — Protocolo — V03]], p. 25–26, p. 29) |

## Criteri di inclusione
Testo originale (§3.5.1, [[ARTEMIS — Protocolo — V03]], p. 25):

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

Allo screening (§3.6.3): "a single occlusion of either the: • Intracranial or Terminal ICA • MCA - M1 segment • MCA - Proximal or dominant divisions of the M2 segment (Figure 2)" ([[ARTEMIS — Protocolo — V03]], p. 29).

**Sintesi**: adulto di 18–85 anni con mRS pre ≤2, NIHSS 6–25, ASPECTS 6–10 (o core ≤50 cc se misurato in automatico) e occlusione singola con eTICI 0–1 di ICA intracranica o terminale, M1 o M2 prossimale o dominante. La puntura deve avvenire entro 24 h dal LKW. La trombolisi e.v., se indicata, si fa senza ritardi; sono eleggibili anche i pazienti non candidati a trombolisi ([[ARTEMIS — Protocolo — V03]], p. 25, p. 30).

## Criteri di esclusione
Testo originale (§3.5.2, [[ARTEMIS — Protocolo — V03]], p. 25–26):

*The following exclusion criteria will be assessed pre-operatively:*

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

*The following exclusion criteria will be assessed intra-operatively:*

23. eTICI score improvement to greater than eTICI 1 after initial screening and prior to intervention. (p. 26)
24. Initially treated with a different thrombectomy device during the current study procedure. (p. 26)
25. Vessel tortuosity too difficult to allow endovascular access of the intracranial internal carotid artery (ICA) per investigator judgement. Indicators of vessel tortuosity include but are not limited to the presence of carotid loops and type 3 aortic arches. (p. 26)
26. Evidence of tandem lesions, including complete occlusion, high-grade stenosis or arterial dissection in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus. (p. 26)
27. Underlying intracranial atherosclerotic disease (ICAD) lesions responsible for the target occlusion. (p. 26)
28. Occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation). (p. 26)
29. Inability to gain arterial access. (p. 26)

> [!warning] Contraddizione — criterio 26 fra sinossi e corpo
> Sinossi: "… in the extracranial or **intracranial** internal carotid artery (ICA), requiring treatment or preventing access to thrombus." ([[ARTEMIS — Protocolo — V03]], p. 7)
> Corpo: "… in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus." ([[ARTEMIS — Protocolo — V03]], p. 26)
> Probabilmente "intracranial" è caduto per errore nel corpo, ma non si risolve d'ufficio: **domanda per il promotore**. Il criterio non esclude tutte le [[Oclusión en tándem|occlusioni in tandem]], solo quelle che richiedono trattamento o impediscono di raggiungere il trombo, e si valuta **in sala**, non allo screening.

**Sintesi**: prima della procedura si escludono il miglioramento rapido, un ictus negli ultimi 6 mesi, i quadri bilaterali o multiterritoriali, il sospetto di ESA, la diatesi emorragica o gli AVK con INR >3, la glicemia <50 o >400, la PA refrattaria >185/110, l'insufficienza renale (creatinina ≥3 o GFR <30) o la dialisi, le allergie gravi al contrasto o al nichel-titanio, la gravidanza, l'emorragia, l'effetto massa con shift, un tumore o una vasculite, il sospetto di dissezione aortica o di endocardite e uno stent nella sede dell'occlusione. **In sala** si escludono il miglioramento a eTICI >1 prima di iniziare, un altro dispositivo usato per primo, la tortuosità che impedisce l'accesso, il tandem da trattare o che ostacola l'accesso, l'ICAD responsabile, le occlusioni in più territori e l'impossibilità di accesso arterioso. Chi viene escluso in sala dopo il consenso è uno screen failure, seguito per 72 h o fino alla dimissione ([[ARTEMIS — Protocolo — V03]], p. 30, p. 44).

## Intervento e procedure
- **Dispositivo**: C CONDA®, stent retriever in nitinol a celle chiuse, stent da 4 mm × 40 mm utili, per vasi di 2,0–4,0 mm, con microcatetere da 0,021". Si può usare con BGC, DAC e catetere ANA, a scelta dell'operatore ([[ARTEMIS — Protocolo — V03]], p. 6, p. 18–19, p. 31–32). Vedi [[Stent retriever]].
- **Passaggi**: fino a 3 con CONDA. Dopo 3 passaggi senza successo, o prima a giudizio dell'operatore, è ammessa la terapia di salvataggio con dispositivi commerciali o farmaci. Cambiare il catetere di aspirazione o il BGC non conta come salvataggio ([[ARTEMIS — Protocolo — V03]], p. 25, p. 32).
- **Divieti**: tecnica a doppio stent e accesso carotideo diretto. Accesso solo femorale o radiale ([[ARTEMIS — Protocolo — V03]], p. 32).
- **Angiografia**: DSA AP e LAT all'inizio (conferma di eTICI 0–1), dopo ogni passaggio e alla fine. Registro dei passaggi con ora e eTICI. Le serie complete vanno inviate al Core Lab ([[ARTEMIS — Protocolo — V03]], p. 31–32, p. 60). Se l'eTICI pre-trattamento del centro e del Core Lab non coincidono, per l'eleggibilità prevale la valutazione in tempo reale del centro ([[ARTEMIS — Protocolo — V03]], p. 60).
- **Anestesia e anticoagulazione**: secondo la pratica del centro ([[ARTEMIS — Protocolo — V03]], p. 31).
- **Trombolisi**: consentita e da non ritardare (alteplasa o [[Tenecteplasa|tenecteplasa]], secondo AHA/ASA o ESO). Eleggibili anche i pazienti fuori finestra o con controindicazioni ([[ARTEMIS — Protocolo — V03]], p. 25, p. 30).
- **Trombectomia**: è il trattamento in studio (braccio unico).
- **Esami prima della procedura**: secondo la pratica locale; suggeriti coagulazione, emocromo, glicemia e creatinina. Nessun esame specifico dello studio. Test di gravidanza solo se lo richiede la normativa locale ([[ARTEMIS — Protocolo — V03]], p. 35).

## Visite e follow-up
| Visita | Momento | Finestra | Contenuto principale | Fonte |
|---|---|---|---|---|
| V1 Screening/basale | entro 24 h dall'esordio | — | consenso, criteri, anamnesi, esame obiettivo (PA), mRS pre-ictus, NIHSS, TC o RM, farmaci | ([[ARTEMIS — Protocolo — V03]], p. 27) |
| V2 Procedura | G0 | — | criteri intra-operatori, angiografia ed eTICI per passaggio, AE, farmaci | ([[ARTEMIS — Protocolo — V03]], p. 27, p. 31–32) |
| V3 | 24 h | −8/+12 h | NIHSS, TC o RM senza contrasto, AE, farmaci | ([[ARTEMIS — Protocolo — V03]], p. 27, p. 32, p. 38) |
| V4 | G5 o dimissione (la prima delle due) | ±24 h | mRS (fra G5 e la dimissione, se fattibile), NIHSS, destinazione del paziente, AE, farmaci | ([[ARTEMIS — Protocolo — V03]], p. 27, p. 32) |
| V5 (fine studio) | G90 | ±14 d | mRS, AE, farmaci associati agli AE. **Preferibilmente in presenza**, per telefono se non fattibile | ([[ARTEMIS — Protocolo — V03]], p. 27, p. 33) |

Nessuna visita a 30 giorni. Il CI riporta le stesse 5 visite ([[ARTEMIS — CI — V03]], p. 5).

## Consenso
- **Protocollo**: consenso del paziente o di un surrogato accettato dal CEIm (familiare o rappresentante legale). Se il CEIm lo approva sono ammessi il consenso a distanza per via elettronica, il consenso differito e il consenso orale. Testimone se il paziente capisce ma non può firmare. Con consenso orale o con testimone, il paziente rifirma appena possibile; se riacquista la capacità, gli si chiede di confermare ([[ARTEMIS — Protocolo — V03]], p. 28, p. 61–62).
- **CI V03 (Vall d'Hebron)**: foglio informativo e consenso del paziente più un modulo di consenso scritto del rappresentante legale, familiare o persona vicina, firmabile prima dell'intervento. Il CI dice che lo studio può essere stato spiegato prima **per telefono**, con un **consenso verbale telefonico** del rappresentante; il paziente conferma o rifiuta appena il quadro clinico lo permette ([[ARTEMIS — CI — V03]], p. 1, p. 13). Non c'è una sezione per il testimone.
- **Lingue**: solo CI in spagnolo in Drive.
- Il foglio del team riporta "scritto e orale/telefonico" ([[Esquema ensayos — septiembre 2026]]).

## Co-arruolamento
- Esclusione 15: escluso chi partecipa a uno studio con farmaco o dispositivo sperimentale "that would impact the primary endpoint of this study" ([[ARTEMIS — Protocolo — V03]], p. 26). Non è un divieto assoluto: dipende dall'effetto sull'endpoint primario (successo del dispositivo).
- Esclusione 24: escluso chi è stato trattato prima con un altro dispositivo di trombectomia nella stessa procedura ([[ARTEMIS — Protocolo — V03]], p. 26). Questo rende ARTEMIS di fatto incompatibile con altri studi di dispositivi EVT nella stessa procedura (es. ATHENA, TWIN2WIN-2): **inferenza**, da confermare con il promotore.
- Compatibilità con studi specifici: non riportata nel documento.

## Divergenze con EnsApp
Confronto con `src/lib/domain/trials-info.ts:113-127`, `src/lib/domain/acute-rules.ts:95-99` (vasi) e `:223-237` (regola), `src/lib/domain/acute-reasons.ts:121-132` e, per i campi dell'interfaccia, `src/routes/PostImaging.svelte`. Verificato il 2026-10-19 sul commit `6617a91`. Lo stato `closed` è stato committato in `7818276` (prima era una modifica non committata nel working tree).

> [!success] Coincide
> Età 18–85 (`acute-rules.ts:227-228`); mRS pre ≤2 (`:229`); NIHSS 6–25 (`:230-231`); ASPECTS >5, cioè 6–10 (`:234-235`); vasi ammessi ICA intracranica, ICA terminale, M1 e M2 prossimale o dominante, con l'M2 generico escluso (`acute-rules.ts:95-99`; coincide con p. 25 e p. 29); finestra <24 h (`:226`, vedi però il punto 3); LVO candidato a EVT (`:232`); trombolisi "Optional." e trombectomia "Yes." (`trials-info.ts:121-122`); intervento "Stent retriever CONDA." (`:124`); parametri in `trials-info.ts:118` (`< 24 h`, `18-85 y`, `0-2`, `6-25`, `6-10`); stato `closed` come il foglio (`trials-info.ts:116`, vedi il punto 10). Le etichette dei motivi (`acute-reasons.ts:124-130`) rispecchiano la regola. Tortuosità e tandem non entrano nella regola ARTEMIS: per due criteri che il protocollo valuta in sala, è coerente.

- [ ] **1. [FP] L'occlusione singola e i territori multipli non vengono controllati.**
> [!warning] Contraddizione
> Protocollo: "a single occlusion" (p. 29); esclusione 28, "Occlusions in multiple vascular territories" (p. 26); esclusione 3, quadro clinico bilaterale o multiterritoriale (p. 25) ([[ARTEMIS — Protocolo — V03]]).
> App: `vessels.artemis` (`acute-rules.ts:95-99`) è vero se **almeno uno** dei vasi ammessi è selezionato. Il numero di vasi non viene contato, a differenza di NiVO (`acute-rules.ts:194`). Con M1 + basilare il paziente risulta eleggibile.

- [ ] **2. [FP] Il core ≤50 cc in valutazione automatica non viene chiesto.**
> [!warning] Contraddizione
> Protocollo, inclusione 9: "If automated assessment, core volume of ≤50 cc on CTP/ DWI-MRI." ([[ARTEMIS — Protocolo — V03]], p. 25).
> App: solo l'ASPECTS (`acute-rules.ts:234-235`). Il campo `largeCore` esiste, ma è di TENACITY con soglia 70 mL (`acute-rules.ts:42-43`). Con ASPECTS ≥6 e core automatico fra 51 e 69 cc il paziente risulta eleggibile.

- [ ] **3. [FP] La finestra si misura fino alla puntura, non fino al momento del calcolo.**
> [!warning] Contraddizione
> Protocollo: "Treatable within 24 hours … Treatment start is defined by access puncture time" (p. 25); "within a timeframe of 24 hours from symptom onset (last time seen well) to potential access puncture" (p. 29) ([[ARTEMIS — Protocolo — V03]]).
> App: `input.ltsw < 24` (`acute-rules.ts:226`), con il LTSW al momento dell'inserimento dati. Un paziente a 23,5 h può risultare eleggibile ma essere punto oltre le 24 h. Il testo di `trials-info.ts:118` (`< 24 h`) non lo specifica.

- [ ] **4. [NC] Tandem: l'audit del team non trova conferma nel codice.** L'audit diceva che l'app "le esclude tutte". In realtà la regola ARTEMIS **non usa affatto** il campo `tandem` (`acute-rules.ts:223-237`; `acute-reasons.ts:121-132`). Il campo viene letto solo da ATHENA (`acute-rules.ts:144`, `acute-reasons.ts:44`). Neanche il codice legacy lo usa per ARTEMIS (`legacy/js/app-eligibility.js:220-229`).
> [!note] Verdetto tandem
> Protocollo: esclusione 26, valutata **in sala**, solo per le lesioni in tandem "requiring treatment or preventing access to thrombus" ([[ARTEMIS — Protocolo — V03]], p. 26; sinossi p. 7). È coerente con il divieto di doppio stent e di accesso carotideo (p. 32).
> App: non esclude nessun tandem. Non è più restrittiva, anzi è più permissiva: un paziente con tandem risulta eleggibile senza alcun avviso. Per un criterio intra-operatorio non escludere allo screening è accettabile, ma servirebbe una nota in `trials-info.ts:125` (`notes: []`), per esempio "Tandem lesion requiring treatment or preventing access excluded intra-op". L'ambiguità extracranica/intracranica (sinossi vs corpo) resta una domanda per il promotore.

- [ ] **5. [NC] L'eTICI 0–1 è approssimato con "candidato EVT".** Il protocollo chiede eTICI 0–1 confermato all'angiografia o all'angio-TC/angio-RM (inclusione 8, p. 25) e lo ricontrolla all'inizio della DSA (esclusione 23, p. 26) ([[ARTEMIS — Protocolo — V03]]). L'app usa `lvo`, derivato da "candidato a trombectomia: eleggibile" (`PostImaging.svelte:25-27`). È un'approssimazione ragionevole, non una divergenza clinica forte.

- [ ] **6. [NC] Le esclusioni cliniche e radiologiche non sono modellate** (scelta di progetto, da rendere esplicita). Mancano i criteri 1–22 (tra cui ictus negli ultimi 6 mesi, AVK con INR >3, glicemia, PA refrattaria, creatinina ≥3 o GFR <30 o dialisi, allergia al nichel-titanio, gravidanza, emorragia, tumore, vasculite, stent preesistente) e quelli intra-operatori 23–29 ([[ARTEMIS — Protocolo — V03]], p. 25–26). `trials-info.ts:125` `notes: []` non ne cita nessuno.

- [ ] **7. [TXT] Il consenso è indicato come solo scritto.**
> [!warning] Contraddizione
> Protocollo: surrogato, consenso remoto elettronico, differito, orale con il consenso del CEIm, testimone ([[ARTEMIS — Protocolo — V03]], p. 28, p. 61–62). CI V03: consenso verbale telefonico del rappresentante, poi firma ([[ARTEMIS — CI — V03]], p. 1, p. 13). Il foglio del team dice "scritto e orale/telefonico".
> App: `trials-info.ts:119` `consent: "Written."`.

- [ ] **8. [TXT] Visite sbagliate.**
> [!warning] Contraddizione
> Protocollo: screening, G0, 24 h (−8/+12), **G5 ±24 h o dimissione** (la prima delle due), **G90 ±14 d preferibilmente in presenza**. Nessuna visita a 30 giorni ([[ARTEMIS — Protocolo — V03]], p. 9, p. 27, p. 32–33).
> App: `trials-info.ts:126` `["Baseline (in-person)", "24 h (in-person)", "Discharge (in-person)", "Day 30 (phone)", "Day 90 (phone)"]`. La visita a 30 giorni non esiste, il G90 è indicato solo per telefono e il G5 manca.

- [ ] **9. [TXT] Testo dell'imaging incompleto.** `trials-info.ts:120` elenca i vasi, ma non cita l'eTICI 0–1, l'occlusione singola, la ICA terminale (ammessa a p. 29 e codificata in `acute-rules.ts:97`) né il core ≤50 cc.

- [x] **10. [FP] Stato: l'app diceva "active", il foglio "reclutamiento cerrado". ✅ risolto il 2026-10-19 (status closed).**
> [!success] Risolto
> Foglio del team: ARTEMIS "reclutamiento cerrado" ([[Esquema ensayos — septiembre 2026]]). Cartella originale in Drive in ENSAYOS INACTIVOS.
> Prima (commit `5b39216`): `status: "active"`, quindi ARTEMIS veniva proposto come eleggibile. Ora (commit `7818276`): `trials-info.ts:116` `status: "closed"`, con il commento "Reclutamento chiuso (foglio 'Esquema ensayos', set. 2026)" (`:114-115`). La regola `artemis()` continua a non guardare lo stato (`stores/eligibility.ts:54`), ma il Riepilogo filtra con `isTrialOpen()`, che esclude `"closed"` e `"paused"` (`trials-info.ts:410-413`; `routes/Summary.svelte:48`): ARTEMIS non viene più proposto. Resta da allineare il frontmatter `estado_app: activo`.

> [!note] preEvtLabs
> `trials-info.ts:123` "No." è sostanzialmente corretto: il protocollo non chiede esami specifici dello studio, solo esami della pratica locale ([[ARTEMIS — Protocolo — V03]], p. 35). Alcune esclusioni (5, 6, 11) usano però valori "known" di INR, glicemia e creatinina.

## Problemi documentali
- **Lettura del protocollo incompleta**: pp. 82–84 non lette (fine dell'Appendix 4 e probabilmente l'Appendix 5, la publication policy). Il PDF da 8,7 MB supera il limite di download del connettore Drive. Vedi [[ARTEMIS — Protocolo — V03]].
- **Criterio 26**: "intracranial" presente nella sinossi (p. 7) e assente nel corpo (p. 26). Domanda per il promotore.
- **"will be randomized"** in uno studio a braccio unico (p. 31).
- **§5.4** ancora con "up to 50 subjects" contro i 60 del resto del documento (p. 42; [[ARTEMIS — Cambios — V02 a V03]], p. 2).
- **Finestre incoerenti**: NIHSS a G5 "± 12 hours" (p. 37) contro ± 24 h; farmaci fino a "Day 90 (± 14 h)" (p. 38) contro ± 14 giorni.
- **Tre nomi diversi per eTICI** (p. 6, p. 14, p. 36).
- **Finestra della sICH**: "within 24 hours (-8/+12)" contro "22 to 36 hours" nella definizione SITS-MOST (p. 23). Vedi [[Hemorragia intracraneal sintomática]].
- **CI**: resti di revisione nel modulo del rappresentante (p. 13); manca la sezione per il testimone.
- **File nella cartella originale non copiati** nella copia ordinata (ENSAYOS INACTIVOS/ARTEMIS): `002a_ARTEMIS_Procedure_Worksheet V04.pdf` (scheda di procedura, utile per capire come si registrano in sala tandem, eTICI e passaggi), il Google Doc "Resumen visitas" e la sottocartella "Documentación" (con `ARTEMIS_VAL_STR_SM3.pdf`). **Non letti.**
- **Numero di registro** (NCT, CIV-ID EUDAMED): non riportato nei documenti.

## Fonti
- [[ARTEMIS — Protocolo — V03]]
- [[ARTEMIS — CI — V03]]
- [[ARTEMIS — Cambios — V02 a V03]]
- [[Esquema ensayos — septiembre 2026]] (stato)
