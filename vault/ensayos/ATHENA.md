---
tipo: ensayo
estudio: ATHENA
alias: [ANA2401, AN10153, "The ATHENA Study", "ANA Funnel Catheter"]
estado_app: activo   # aggiornato 2026-10-19
clave_app: "ATHENA"
categoria: dispositivo
fase: "non riportata nel documento (indagine clinica con dispositivo medico, MDR 2017/745 e 21 CFR 812)"
promotor: "ANACONDA BIOMED, INC. (rappresentante UE: ANACONDA BIOMED, S.L.)"
registro: ["Protocol ANA2401", "Francia IDRCB 2024-A00926-41"]
protocolo_vigente: "v2.3, 25-11-2025"
ci_vigente: "v4.0, 04-11-2025 (Hospital Vall d'Hebron), anteriore al protocollo v2.3"
drive_carpeta: "https://drive.google.com/drive/folders/10Y8ruB1z7moEGD4Vz78UivVvpeSXRa-W"
fuentes: ["[[ATHENA — Protocolo — v2.3]]", "[[ATHENA — Sinopsis — v2.3]]", "[[ATHENA — CI — v4.0]]", "[[ATHENA — Cambios — v2.11 a v2.3]]"]
actualizado: 2026-10-19
---
# ATHENA

> [!summary] In breve
> Studio prospettico, randomizzato 1:1, multicentrico (USA e fuori USA), promosso da Anaconda Biomed. Confronta la trombectomia con [[Stent retriever|stent retriever]] (Solitaire, Trevo o pRESET) portato dal catetere a imbuto **ANA Funnel Catheter**, che restringe il flusso nella ICA, con lo stesso stent retriever usato con catetere guida e catetere intermedio con o senza aspirazione (controllo). Popolazione: occlusione singola di ICA terminale, M1 o M2 dominante o prossimale, con eTICI ≤1, [[NIHSS]] 6–25, [[mRS]] pre ≤2, età 22–85 anni, [[ASPECTS]] 6–10 (o core ≤50 mL), **trattabile entro 16 h** dall'ultima volta visto bene fino alla puntura arteriosa. Endpoint primari: sICH a 24 h e [[First pass effect]] eTICI 2c–3, entrambi di non inferiorità ([[ATHENA — Protocolo — v2.3]], p. 5–8, p. 33–34).

> [!info] Stato
> - **Foglio "Esquema ensayos"** (fonte di verità, modificato di nuovo il 2026-10-19 alle 08:19; riga ATHENA invariata): **aperto** ([[Esquema ensayos — septiembre 2026]]).
> - **App**: `status: "active"` (`src/lib/domain/trials-info.ts:60`), riattivato il 2026-10-19. `isTrialOpen()` lo propone (`trials-info.ts:410-413`; `Summary.svelte:48`). Coincide.
> - **Documenti**: lo studio è stato **sospeso** per la revisione di due fratture di stent retriever nel braccio ANA; la v2.3 introduce le modifiche concordate con il DMC il 30-10-2025 per continuare ([[ATHENA — Cambios — v2.11 a v2.3]], p. 14). Nessun documento in Drive dice quando la v2.3 sia stata approvata o applicata al centro.

## Disegno
- **Tipo**: prospettico, randomizzato 1:1, a due bracci, multicentrico; fino a 40 centri ad alto volume ([[ATHENA — Protocolo — v2.3]], p. 5–6, p. 32).
- **Randomizzazione**: sistema elettronico protetto da password, **dopo** l'angiografia iniziale e la verifica dei criteri intra-operatori ([[ATHENA — Protocolo — v2.3]], p. 32, p. 38, p. 40).
- **Cieco**: non riportato nel documento per l'operatore (trattamento in aperto per natura). L'imaging è letto da un core lab indipendente (UCLA) e gli eventi sono giudicati dal DMC ([[ATHENA — Protocolo — v2.3]], p. 60).
- **Bracci**:
  - **ANA**: stent retriever portato attraverso il catetere ANA; l'imbuto si apre nella ICA (vasi di 3,5–5,0 mm, dal tratto cervicale distale al clinoideo) e si aspira con una siringa da 60 mL durante il ritiro ([[ATHENA — Protocolo — v2.3]], p. 25–27).
  - **Controllo**: stesso stent retriever, catetere guida approvato e catetere intermedio facoltativo, "with or without aspiration" ([[ATHENA — Protocolo — v2.3]], p. 41).
- **Numerosità**: 327 soggetti (139 per braccio + 15%); fino a 491 dopo l'interim ([[ATHENA — Protocolo — v2.3]], p. 6, p. 80–81).
- **Endpoint primari** (non inferiorità, margine 10%):
  - sicurezza: [[Hemorragia intracraneal sintomática|sICH]] attribuibile al dispositivo o alla procedura entro 24 h (NIHSS ≥4 o morte), giudicata da core lab e DMC;
  - efficacia: [[First pass effect|FPE]] eTICI 2c–3 dopo un passaggio (Core Lab), poi test di superiorità ([[ATHENA — Protocolo — v2.3]], p. 8, p. 30, p. 79–80).
- **Secondari inferenziali**: superiorità del FPE; mRS 0–2 a 90 giorni; eTICI 2c–3 e 2b50–3 entro 3 passaggi ([[ATHENA — Protocolo — v2.3]], p. 8, p. 31).
- **Descrittivi**: ICH secondo [[Clasificación de Heidelberg|Heidelberg]] a 24 h, SAE da procedura o dispositivo, peggioramento NIHSS ≥4, mortalità, embolizzazione in territori nuovi, [[TICI|eTICI]] finale ([[ATHENA — Protocolo — v2.3]], p. 8–9, p. 31–32).
- **Tempi**: arruolamento di 36 mesi, fine prevista ad agosto 2027 ([[ATHENA — Protocolo — v2.3]], p. 9).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Entro **16 h** dall'ultima volta visto asintomatico **alla puntura arteriosa** (era 24 h fino alla v2.11) | ([[ATHENA — Protocolo — v2.3]], p. 33, p. 36–37; [[ATHENA — Cambios — v2.11 a v2.3]], p. 5–6) |
| Età | 22–85 anni | ([[ATHENA — Protocolo — v2.3]], p. 33) |
| mRS pre | 0–2 | ([[ATHENA — Protocolo — v2.3]], p. 33) |
| NIHSS | ≥6 e ≤25, basale prima della procedura (era ≥8 fino alla v2.11) | ([[ATHENA — Protocolo — v2.3]], p. 33; [[ATHENA — Cambios — v2.11 a v2.3]], p. 8) |
| Imaging / ASPECTS / core | **O** restrizione della diffusione ≤50 mL su CTP/MRP **o** ASPECTS 6–10 su TC/DWI-RM; ASPECTS 5 ammesso nei centri che lo valutano con RM. Per l'eleggibilità prevale la lettura in tempo reale dell'investigatore | ([[ATHENA — Protocolo — v2.3]], p. 34, p. 37, p. 60–61) |
| Occlusione | **Singola**, eTICI ≤1, di ICA terminale, M1 o M2 dominante o prossimale, su angiografia o angio-TC/RM. Esclusi territori multipli, tandem che richiede trattamento o impedisce l'accesso, ICAD responsabile | ([[ATHENA — Protocolo — v2.3]], p. 32, p. 34–36) |

## Criteri di inclusione
Testo originale (§3.4.1, [[ATHENA — Protocolo — v2.3]], p. 33–34; identico nella sinossi, p. 6):

1. Age 22 to 85 years. (p. 33)
2. Informed consent was obtained from subject or acceptable subject surrogate (e.g., next of kin, or legal representative). (p. 33)
3. A new focal disabling neurologic deficit consistent with acute cerebral ischemia. (p. 33)
4. Baseline NIHSS obtained prior to procedure ≥ 6 points and ≤ 25 points. (p. 33)
5. Pre-ictal mRS score of 0,1 or 2. (p. 33)
6. Treatable within 16 hours of symptom onset, defined as point in time when the subject was last observed to be asymptomatic; treatment start is defined by arterial puncture time. (p. 33)
7. If indicated, thrombolytic therapy shall be initiated per the institution's usual care and the most recent version of the AHA/ASA Guidelines. Subjects eligible for IV thrombolysis should receive it without delay. (p. 33)
8. Occlusion (eTICI ≤ 1 flow) of the terminal carotid artery, middle cerebral artery M1 segment or, dominant or proximal M2 segment, indicated for mechanical thrombectomy, confirmed with conventional angiography or CTA/MRA. (p. 34)
9. Imaging criteria: (p. 34)
   - Perfusion weighted criterion: volume of diffusion restriction visually assessed ≤ 50 mL on CTP/MRP, or
   - CT criterion: Alberta Stroke program early CT score (ASPECTS) 6 to 10 on baseline CT/DWI-MRI. (Inclusion of subjects with ASPECTS 5 is permitted at centers performing scoring on MRI).
10. The subject is indicated for a neurovascular thrombectomy procedure with an approved stent retriever per its Instructions for Use. (p. 34)

**Sintesi**: adulto di 22–85 anni con mRS pre ≤2 e deficit focale disabilitante, NIHSS 6–25, occlusione singola di ICA-T, M1 o M2 dominante/prossimale, trattabile entro 16 h alla puntura. Serve un core piccolo: ≤50 mL in perfusione oppure ASPECTS 6–10 (5 se valutato in RM). La trombolisi indicata si fa senza ritardi, secondo la pratica del centro. In Europa la trombolisi segue le linee guida ESO e AHA/ASA ([[ATHENA — Protocolo — v2.3]], p. 72).

## Criteri di esclusione
Testo originale (§3.4.2, [[ATHENA — Protocolo — v2.3]], p. 34–35; identico nella sinossi, p. 6–7):

*The following exclusion criteria will be assessed pre-operatively:* (p. 34)
1. Subject was diagnosed with a stroke in the past year.
2. Clinical symptoms suggestive of bilateral stroke or stroke in multiple territories.
3. Known hemorrhagic diathesis, coagulation factor deficiency, oral anticoagulant therapy with antivitamin K, with INR >3.0, or thrombocytopenia - baseline platelet count < 50,000 platelets/L.
4. Known baseline glucose of <50 mg/dL or >400 mg/dL.
5. Severe, sustained uncontrolled hypertension refractory to treatment (systolic blood pressure >185 mmHg or diastolic blood pressure >110 mmHg).
6. Serious, advanced, or terminal disease with anticipated life expectancy of less than 1 year.
7. Known cancer with metastases.
8. History of life-threatening allergy (more than rash) to contrast medium.
9. Known renal insufficiency with creatinine ≥3 mg/dL or glomerular filtration rate (GFR) <30 mL/min.
10. Subject is a current user or has a recent history of cocaine &/or heroin use.
11. Known pregnancy and/or lactating female.
12. Subject is participating in a concurrent study involving an investigational drug or device that would impact the primary endpoint of this study.
13. Subject is unlikely to be available for a 90-day follow-up (e.g. no fixed home address, visitor from overseas, etc.)
14. CT or MRI evidence of hemorrhage (the presence of microbleeds is allowed).
15. Significant mass effect with midline shift.
16. Evidence of intracranial tumor (except asymptomatic meningioma of ≤ 2cm in diameter).
17. Suspicion of aortic dissection, presumed septic embolus, or suspicion of bacterial endocarditis.
18. History of preexisting stent proximal to or at the occlusion site that may preclude safe deployment or recovery of the stent retriever.
19. Vessel tortuosity too difficult to allow endovascular access of the intracranial ICA per investigator judgement. Indicators of vessel tortuosity include but are not limited to the presence of carotid loops and type 3 aortic arches.

*The following exclusion criteria will be assessed intra-operatively:* (p. 34–35)
20. Initially treated with a different thrombectomy device during the current procedure. (p. 34)
21. eTICI score improvement to greater than eTICI 1 subsequent to initial screening and prior to intervention. (p. 35)
22. Angiographic evidence of vasculitis. (p. 35)
23. Evidence of tandem lesions, including complete occlusion, high grade stenosis or arterial dissection in the extracranial or internal carotid artery (ICA), requiring treatment or preventing access to thrombus. (p. 35)
24. Subjects with known or suspected underlying intracranial atherosclerotic lesions responsible for the target occlusion. (p. 35)
25. Subjects with occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation). (p. 35)
26. Inability to achieve arterial access. (p. 35)
27. Anatomical or physiological restrictions (e.g., severe stenosis, vasospasm, high tortuosity, etc.) detected via angiogram likely to result in an inability to appropriately position the guide and intermediate catheters or to deploy the ANA in the targeted ICA segment with acceptable vessel diameter as defined in the Instructions for Use. (p. 35)

Precisazioni per paese: in Spagna test di gravidanza per le donne "between 22 and 50 years old" salvo eccezioni (p. 74); in Francia esclusi anche gli adulti sotto misura di protezione legale e le persone private della libertà (p. 72–73).

**Sintesi**:
- **Prima della procedura** si escludono: ictus nell'ultimo anno; quadri bilaterali o multiterritoriali; diatesi emorragica, AVK con INR >3, piastrine <50.000; glicemia <50 o >400 mg/dL; PA refrattaria >185/110; aspettativa di vita <1 anno; cancro metastatico; allergia grave al contrasto; creatinina ≥3 mg/dL o GFR <30; cocaina o eroina; gravidanza o allattamento; altri studi che interferiscono con l'endpoint primario; follow-up a 90 giorni improbabile. All'imaging: emorragia (le microemorragie sono ammesse), effetto massa con shift, tumore intracranico (salvo meningioma ≤2 cm asintomatico); poi sospetta dissezione aortica, embolo settico o endocardite, stent preesistente nel sito, tortuosità che impedisce l'accesso alla ICA intracranica.
- **In sala**, sull'angiografia iniziale: altro dispositivo di trombectomia già usato; miglioramento a eTICI >1; vasculite; tandem che richiede trattamento o impedisce l'accesso; [[Ateroesclerosis intracraneal (ICAD)|ICAD]] responsabile; territori multipli; accesso impossibile; anatomia che non permette di posizionare i cateteri o l'ANA.
- Gli anticoagulanti diretti (DOAC) non sono citati: si escludono solo gli AVK con INR >3,0.

## Intervento e procedure
- **Dispositivi**: in ogni passaggio uno dei tre stent retriever ammessi (Solitaire, Trevo, pRESET); in Spagna i modelli obbligatori sono pRESET, Solitaire X e Trevo NXT ProVue. Catetere guida o long sheath ≥0,088", microcatetere ≤0,021" ([[ATHENA — Protocolo — v2.3]], p. 25, p. 41, p. 75).
- **Vietati in entrambi i bracci**: [[Catéter guía con balón|catetere guida a palloncino]], doppio stent, accesso radiale o carotideo (solo femorale) ([[ATHENA — Protocolo — v2.3]], p. 41).
- **Passaggi**: fino a 3 con la tecnica assegnata; poi salvataggio libero. Contano come salvataggio (fallimento di efficacia) i passaggi oltre il terzo, trombolitici o antiaggreganti intra-arteriosi (es. Aggrastat, Integrilin) nei primi tre passaggi e il cambio di tecnica prima del terzo ([[ATHENA — Protocolo — v2.3]], p. 33, p. 41).
- **IFU dopo le fratture di stent retriever**: evitare angoli acuti fra stent e filo di spinta, soprattutto con stent lunghi a cavallo di M1–M2; il microcatetere non va più ritirato obbligatoriamente prima di aspirare ([[ATHENA — Protocolo — v2.3]], p. 27; [[ATHENA — Cambios — v2.11 a v2.3]], p. 14–16).
- **Trombolisi**: ammessa e dovuta se indicata, secondo la pratica del centro, senza ritardi (inclusione 7) ([[ATHENA — Protocolo — v2.3]], p. 33, p. 37).
- **Trombectomia**: è il trattamento in entrambi i bracci; varia solo la tecnica di accesso e di restrizione del flusso.
- **Anestesia e anticoagulazione in sala**: secondo lo standard del centro ([[ATHENA — Protocolo — v2.3]], p. 40).
- **Angiografia**: DSA in AP e laterale all'inizio (conferma dell'eTICI ≤1), dopo ogni passaggio e alla fine ([[ATHENA — Protocolo — v2.3]], p. 40).
- **Esami prima della procedura**: secondo lo standard locale; "Suggested testing" coagulazione, emocromo, glicemia, creatinina. Le esclusioni 3, 4 e 9 valgono per valori "known" ([[ATHENA — Protocolo — v2.3]], p. 34, p. 44).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| V1 Screening / basale | prima della procedura | criteri, demografia, anamnesi, PA, esami, farmaci (con orario della trombolisi), mRS pre, NIHSS, imaging | ([[ATHENA — Protocolo — v2.3]], p. 35–37) |
| V2 Procedura indice | G0 | criteri intra-operatori, randomizzazione, angiografie, registro dei passaggi | ([[ATHENA — Protocolo — v2.3]], p. 35, p. 40–41) |
| V3 | 24 h (−8/+12 h) | NIHSS, TC o RM senza contrasto, AE, farmaci | ([[ATHENA — Protocolo — v2.3]], p. 42, p. 47) |
| V4 | G5 (±24 h) o dimissione, se prima | mRS, NIHSS, destinazione, AE, farmaci | ([[ATHENA — Protocolo — v2.3]], p. 42) |
| V5 | G90 (±14 g) | mRS, AE; **preferibilmente in presenza**, per telefono se non è possibile | ([[ATHENA — Protocolo — v2.3]], p. 42; [[ATHENA — CI — v4.0]], p. 4) |

## Consenso
- **Tipo**: scritto, del soggetto o di un "acceptable surrogate" (familiare o rappresentante legale), **prima della procedura indice** ([[ATHENA — Protocolo — v2.3]], p. 32, p. 36, p. 62).
- **Varianti ammesse se approvate dal CE**: consenso a distanza del surrogato per via elettronica; consenso differito; testimone se il soggetto capisce ma non può firmare ([[ATHENA — Protocolo — v2.3]], p. 36, p. 62–63). Per l'Europa: consenso orale "if approved by the local EC" ed esenzione secondo l'art. 68 MDR ([[ATHENA — Protocolo — v2.3]], p. 72).
- **CI del centro (v4.0)**: tre moduli, tutti scritti: paziente; rappresentante legale, familiare o persona vincolata di fatto "antes de la intervención", con conferma successiva del paziente; testimone imparziale per chi non può leggere o scrivere ([[ATHENA — CI — v4.0]], p. 10–12). Nessun modulo orale, telefonico o differito.
- **Lingue**: CI disponibile in Drive solo in castellano.

## Co-arruolamento
- Escluso chi partecipa a uno studio con farmaco o dispositivo "that would impact the primary endpoint of this study" (esclusione 12) ([[ATHENA — Protocolo — v2.3]], p. 34).
- Escluso chi è stato trattato prima con un altro dispositivo di trombectomia nella stessa procedura (esclusione 20) ([[ATHENA — Protocolo — v2.3]], p. 34). Di fatto è incompatibile con altri studi di dispositivi EVT nella stessa procedura (es. [[ARTEMIS]], [[PIVOTAL]], TWIN-2-WIN 2): **inferenza**, da confermare con il promotore.
- Studi di farmaci (es. neuroprotettori) non sono esclusi in sé: dipende dall'impatto sull'endpoint primario. Non riportato nel documento per studi specifici.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:59-71` e `:358`;
- `src/lib/domain/acute-rules.ts:135-147` (`athena()`);
- `src/lib/domain/acute-reasons.ts:37-47` (`reasonAthena()`);
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/lib/domain/vessels.ts`.

Verificato il 2026-10-19 sul commit `509e348`.

> [!important] Chi ha ragione: app o foglio del team?
> Ha ragione il **foglio del team** ("<16h", NIHSS "6-25", età 22–85, ASPECTS 6–10, TICA/M1/M2), che coincide con il protocollo v2.3. I valori dell'app ("< 24 h", NIHSS ">= 8") sono quelli della **v2.11** superata ([[ATHENA — Cambios — v2.11 a v2.3]], p. 5–8).

> [!success] Coincide
> - età 22–85 (`acute-rules.ts:138-139`; testo `trials-info.ts:62`);
> - mRS pre ≤2 (`:141`; testo `:62`);
> - candidato a trombectomia richiesto (`lvo` da "Candidato a trombectomia (EVT)? → Eleggibile", `PostImaging.svelte:25-27`), come l'inclusione 10;
> - stato `active` come il foglio (`trials-info.ts:60`);
> - testo ASPECTS "6-10" (`trials-info.ts:62`), come l'inclusione 9b (ma la regola non lo applica: punto 5);
> - trombolisi "Optional." e trombectomia "Yes." (`trials-info.ts:65-66`);
> - esami pre-EVT "No." (`:67`): il protocollo li lascia allo standard locale e le esclusioni valgono per valori noti (p. 34, p. 44);
> - nessuna esclusione per DOAC (il campo `doac` non è usato da `athena()`), come il protocollo, che esclude solo gli AVK con INR >3,0 (p. 34);
> - visite 24 h, G5/dimissione e G90 in presenza (`trials-info.ts:70`);
> - randomizzazione elettronica con link dedicato (`trials-info.ts:358`; p. 38).

- [ ] **1. [FP] Finestra a 24 h invece di 16 h.**
> [!warning] Contraddizione
> Protocollo, inclusione 6: "Treatable within 16 hours of symptom onset (…); treatment start is defined by arterial puncture time" ([[ATHENA — Protocolo — v2.3]], p. 33, p. 36–37). Fino alla v2.11 erano 24 h ([[ATHENA — Cambios — v2.11 a v2.3]], p. 5–6).
> App: `input.ltsw <= 24` (`acute-rules.ts:142`; `acute-reasons.ts:42` "LTSW <= 24h"); testo `trials-info.ts:62` `window: "< 24 h"`. I pazienti fra 16 e 24 h vengono proposti. Inoltre `ltsw` è il tempo trascorso al momento della valutazione, mentre il limite vale **alla puntura arteriosa**: anche con 16 h servirebbe un margine o un avviso.

- [ ] **2. [FN] NIHSS minimo 8 invece di 6.**
> [!warning] Contraddizione
> Protocollo, inclusione 4: "Baseline NIHSS obtained prior to procedure ≥ 6 points and ≤ 25 points" ([[ATHENA — Protocolo — v2.3]], p. 33); nella v2.11 era ≥8 ([[ATHENA — Cambios — v2.11 a v2.3]], p. 8).
> App: `input.nihss >= 8` (`acute-rules.ts:140`; `acute-reasons.ts:40`); testo `trials-info.ts:62` `nihss: ">= 8"`. I pazienti con NIHSS 6–7 vengono scartati.

- [ ] **3. [FP] Il NIHSS massimo di 25 non è controllato.**
> [!warning] Contraddizione
> Protocollo: NIHSS "≤ 25 points" (inclusione 4, p. 33; screening, p. 32, p. 37) ([[ATHENA — Protocolo — v2.3]]).
> App: nessun limite superiore (`acute-rules.ts:140`); il testo `trials-info.ts:62` dice solo ">= 8". Un NIHSS di 26–42 risulta eleggibile.

- [ ] **4. [FP] Il vaso occluso non è controllato.**
> [!warning] Contraddizione
> Protocollo, inclusione 8: occlusione "of the terminal carotid artery, middle cerebral artery M1 segment or, dominant or proximal M2 segment" (p. 34); "single occlusion" (p. 36); esclusione 25 per territori multipli (p. 35); l'occlusione secondaria vista prima della procedura impedisce il consenso (p. 32) ([[ATHENA — Protocolo — v2.3]]).
> App: `athena()` non legge `targetVessels` (`acute-rules.ts:135-147`) e non c'è un flag ATHENA in `computeVesselFlags` (`:79-119`). Basta `lvo === "yes"` (`:143`). Risultano eleggibili basilare, P1, VA, A1, ICA intracranica non terminale ("Intracranial ICA (no T)"), "Any M2" non dominante, ">M2" (`vessels.ts:12-25`) e la selezione di più vasi. Il testo `trials-info.ts:64` "TICA, M1 or M2 occlusion." non dice che la M2 deve essere dominante o prossimale ([TXT]).

- [ ] **5. [FP] ASPECTS e core non controllati.**
> [!warning] Contraddizione
> Protocollo, inclusione 9: core ≤50 mL su CTP/MRP **oppure** ASPECTS 6–10 su TC/DWI-RM, con ASPECTS 5 ammesso nei centri che valutano con RM ([[ATHENA — Protocolo — v2.3]], p. 34, p. 37).
> App: `athena()` non legge `aspects` (`acute-rules.ts:135-147`), anche se il campo si compila nella stessa scheda EVT (`PostImaging.svelte:175-177`). Il testo "6-10" (`trials-info.ts:62`) non si applica. Un paziente con ASPECTS 0–4 risulta eleggibile. Se si aggiunge il controllo, va fatto con l'alternativa del core ≤50 mL (e l'ASPECTS 5 in RM), altrimenti diventa un falso negativo.

- [ ] **6. [FN] Ogni tandem esclude, ma il protocollo esclude solo quello che richiede trattamento o impedisce l'accesso.**
> [!warning] Contraddizione
> Protocollo, esclusione 23, **valutata in sala**: "Evidence of tandem lesions (…) requiring treatment or preventing access to thrombus" ([[ATHENA — Protocolo — v2.3]], p. 35).
> App: `input.tandem === "no"` obbligatorio (`acute-rules.ts:144`; `acute-reasons.ts:44` "no tandem"); il toggle "Occlusione tandem?" non distingue (`PostImaging.svelte:30`, `:70`, `:172`). Un tandem con stenosi cervicale non da trattare e che non impedisce l'accesso viene scartato. Vedi [[Oclusión en tándem]].

- [ ] **7. [FN] Qualunque tortuosità esclude; il protocollo esclude solo quella che impedisce l'accesso alla ICA intracranica.**
> [!warning] Contraddizione
> Protocollo, esclusione 19: "Vessel tortuosity too difficult to allow endovascular access of the intracranial ICA per investigator judgement" (p. 34); esclusione 27, in sala, "high tortuosity" che impedisce di posizionare i cateteri o l'ANA (p. 35) ([[ATHENA — Protocolo — v2.3]]).
> App: `input.tortuosity === "no"` obbligatorio (`acute-rules.ts:145`); il toggle generico "Tortuosita' vasi?" (`PostImaging.svelte:174`) basta a scartare. Il controllo `tortuosity === ""` (`acute-rules.ts:136`) e l'etichetta "richiesto valore esplicito" (`acute-reasons.ts:45`) non servono davvero: il toggle salva sempre "yes" o "no", con "no" di default (`PostImaging.svelte:31`, `:71`). Il falso negativo dipende da come il medico interpreta la domanda.

- [ ] **8. [TXT] Consenso orale o telefonico non previsto dal CI del centro.**
> [!warning] Contraddizione
> Protocollo: consenso scritto del soggetto o del surrogato; a distanza per via elettronica, differito o orale **solo se approvati dal CE** (p. 36, p. 62–63, p. 72) ([[ATHENA — Protocolo — v2.3]]). CI v4.0: solo moduli scritti (paziente, rappresentante prima dell'intervento, testimone) ([[ATHENA — CI — v4.0]], p. 10–12).
> App: `trials-info.ts:63` "Written & oral/phone consent." (come il foglio). Da verificare con il CEIm se esista un'approvazione del consenso orale o telefonico.

- [ ] **9. [TXT] Visita del G90: in presenza, ma ammessa per telefono.**
> Protocollo: "This visit will be preferably performed in person. However, if circumstances prevent conducting this visit in person, this visit may be conducted by phone call" ([[ATHENA — Protocolo — v2.3]], p. 42; [[ATHENA — CI — v4.0]], p. 4).
> App: `trials-info.ts:70` "Day 90 (in-person)". Corretto, ma manca l'alternativa telefonica.

- [ ] **10. [TXT] Controllo e vincoli tecnici descritti in modo incompleto.**
> Protocollo: nel controllo il catetere intermedio è facoltativo, "with or without aspiration"; vietati BGC, doppio stent e accesso radiale o carotideo; solo Solitaire, Trevo o pRESET ([[ATHENA — Protocolo — v2.3]], p. 41).
> App: `trials-info.ts:68` "Stent retriever + ANA vs Stent retriever + DAC."; le note (`:69`) non citano i dispositivi vietati né l'esclusione per altro dispositivo già usato (esclusione 20, p. 34).

- [ ] **11. [TXT] "3 h limit removed": non verificabile sui documenti in Drive.**
> Protocollo v2.3: "If indicated, thrombolytic therapy shall be initiated per the institution's usual care and the most recent version of the AHA/ASA Guidelines" ([[ATHENA — Protocolo — v2.3]], p. 33). La tabella dei cambi non tocca l'inclusione 7 ([[ATHENA — Cambios — v2.11 a v2.3]]); la riformulazione risale probabilmente alla v2.1 o alla v1.31 francese ([[ATHENA — Protocolo — v2.3]], p. 10). Nessun documento in Drive contiene un limite di 3 h.
> App: `trials-info.ts:69` "Thrombolysis per local practice (3 h limit removed)." (come il foglio). Il contenuto pratico è corretto; il riferimento alle 3 h è storico e non documentato.

- [ ] **12. [NC] Esclusioni cliniche e intra-operatorie non modellate.**
> La regola non controlla: deficit disabilitante (incl. 3); ictus nell'ultimo anno; quadri bilaterali; AVK con INR >3, piastrine <50.000, glicemia; PA refrattaria >185/110; creatinina ≥3 o GFR <30; cocaina o eroina; cancro metastatico; aspettativa di vita <1 anno; gravidanza; altri studi; emorragia, effetto massa, tumore; dissezione aortica, embolo settico, endocardite; stent preesistente. Né i criteri in sala: altro dispositivo già usato, eTICI >1 prima dell'intervento, vasculite, ICAD, accesso, anatomia ([[ATHENA — Protocolo — v2.3]], p. 33–35). L'emorragia è filtrata dal tipo di ictus nell'interfaccia; gli altri restano a carico del medico. È una scelta di progetto, ma i criteri in sala andrebbero almeno ricordati nelle note della scheda.

## Problemi documentali
- **Worksheet "V2"**: secondo il contesto di questa sessione, il worksheet in uso al centro dichiara la versione **V2**, mentre il protocollo vigente in Drive è la **v2.3**. Il worksheet non è nella cartella e non è stato verificato. Con la v2.11 la finestra era di 24 h e il NIHSS ≥8: se il worksheet riporta questi valori, è superato.
- **v2.11 assente in Drive**: la tabella dei cambi parte da una v2.11 che non è nella cartella. Secondo la revision history era la versione spagnola in vigore (09-12-2024), identica alla 2.1; la v2.2 non è mai stata presentata in Spagna ([[ATHENA — Protocolo — v2.3]], p. 10).
- **CI anteriore al protocollo**: v4.0 del 04-11-2025 contro protocollo del 25-11-2025. Non contiene dati toccati dalla v2.3 ([[ATHENA — CI — v4.0]]).
- **Sospensione dello studio** per due fratture di stent retriever nel braccio ANA; la ripresa non è documentata in Drive ([[ATHENA — Cambios — v2.11 a v2.3]], p. 14).
- **Test di gravidanza in Spagna**: 22–50 anni nel protocollo (p. 74), 18–50 anni nella sinossi ([[ATHENA — Sinopsis — v2.3]], p. 4).
- **Data della v2.3 USA**: 4 novembre 2025 nella sinossi spagnola, 25 novembre nel protocollo ([[ATHENA — Sinopsis — v2.3]], p. 9).
- **Refusi del protocollo**: piastrine "/L" (esclusione 3); NIHSS al G5 "± 12 hours" (p. 46) contro ±24 h altrove; rimando a "Figure 4" inesistente (p. 38); pagine dell'indice errate (p. 12–14); IFU del Trevo che cita il BGC vietato (p. 27–28, p. 41); ITT definita in due modi (p. 39, p. 78).
- **Registro**: nessun numero NCT nel protocollo (p. 63).

## Fonti
- [[ATHENA — Protocolo — v2.3]]
- [[ATHENA — Sinopsis — v2.3]]
- [[ATHENA — CI — v4.0]]
- [[ATHENA — Cambios — v2.11 a v2.3]]
- [[Esquema ensayos — septiembre 2026]] (stato)
