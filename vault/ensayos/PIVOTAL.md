---
tipo: ensayo
estudio: PIVOTAL
alias: [RapidPulse, "RapidPulse Pivotal Study", CIP-0002, RPAS]
estado_app: activo
clave_app: "PIVOTAL"
categoria: dispositivo
fase: "pivotal (dispositivo sperimentale, braccio singolo contro un obiettivo di performance)"
promotor: "RapidPulse, Inc. (Miami, USA)"
registro: ["Protocol Number CIP-0002"]
protocolo_vigente: "CIP-0002 Revision 03, 29-01-2026"
ci_vigente: "Versión 3, 29-01-2026 (castellano e catalano; nome Drive: V03 — 2026-04-30)"
drive_carpeta: "https://drive.google.com/drive/folders/1hUPzCRh8O3kgRRNvcoEwHRbzDp95LzPt"
fuentes: ["[[PIVOTAL — Protocolo — Rev 03]]", "[[PIVOTAL — Sinopsis — Rev 03]]", "[[PIVOTAL — CI — V03]]", "[[PIVOTAL — CI català — V03]]"]
actualizado: 2026-10-19
---
# PIVOTAL

> [!summary] In breve
> Studio pivotal globale, multicentrico, prospettico, adattativo, in aperto e **a braccio singolo** del **RapidPulse™ Aspiration System**, un sistema di aspirazione pulsata usato come prima linea con tecnica [[Aspiración directa (ADAPT)|ADAPT]]. Popolazione: 18–80 anni, [[mRS]] pre 0–1, [[NIHSS]] ≥6, occlusione di grosso vaso con [[TICI]] 0–1 alla DSA (ICA intracranica, M1, M2, vertebrale o basilare), puntura arteriosa entro 8 h dall'esordio o dall'ultima volta visto bene. Non c'è braccio di confronto: l'endpoint primario, il [[First pass effect|first pass effect]] (mTICI ≥2c al primo passaggio), si confronta con un obiettivo ricavato dalla letteratura ([[PIVOTAL — Protocolo — Rev 03]], p. 18, p. 32, p. 41).

> [!success] Stato: foglio del team e app coincidono
> Foglio "Esquema ensayos" (fonte di verità, modificato il 2026-10-09): **aperto** ([[Esquema ensayos — septiembre 2026]]).
> App: `status: "active"` (`src/lib/domain/trials-info.ts:73`), riattivato il 2026-10-19 (commit `7818276`; vedi [[Estado de los estudios]]).

## Disegno
- **Tipo**: globale, multicentrico, a braccio singolo, prospettico, adattativo, in aperto, contro un obiettivo di performance (PG) ricavato dalla letteratura ([[PIVOTAL — Protocolo — Rev 03]], p. 18, p. 32).
- **Global Principal Investigators**: Raul G. Nogueira (UPMC, Pittsburgh) e Marc Ribo (Vall d'Hebron). PI locale: Dr. Marc Ribó, centro 201 ([[PIVOTAL — Protocolo — Rev 03]], p. 17; [[PIVOTAL — CI — V03]], p. 1).
- **Numerosità**: obiettivo 170 pazienti (FAS), massimo 340, fino a 30 centri; ogni centro al massimo il 20% (34 pazienti con 170). Analisi intermedia al 50% per ricalcolare la numerosità ([[PIVOTAL — Protocolo — Rev 03]], p. 21, p. 37–38, p. 40).
- **Durata**: reclutamento circa 18 mesi, follow-up 90 giorni, studio circa 21 mesi ([[PIVOTAL — Protocolo — Rev 03]], p. 21, p. 37).
- **Endpoint primario di efficacia**: FPE, cioè mTICI ≥2c dopo il primo passaggio, letto dall'Imaging Core Lab. Va superata la soglia 0,4054 con il 97,5% di confidenza; atteso 51,5% ([[PIVOTAL — Protocolo — Rev 03]], p. 18, p. 32, p. 38).
- **Endpoint primario di sicurezza**: [[Hemorragia intracraneal sintomática|sICH]] entro 24 h dalla trombectomia (definizione di Heidelberg), giudicata dal CEC; soglia 9,41% ([[PIVOTAL — Protocolo — Rev 03]], p. 18–19, p. 33).
- **Secondari chiave** (gerarchici): mTICI ≥2b entro 3 passaggi con il solo dispositivo (PG 0,55); FPE contro la media di letteratura (0,4547); mRS ≤2 a 90 giorni (PG 0,4578) ([[PIVOTAL — Protocolo — Rev 03]], p. 19–20, p. 39).
- **Altri**: mFPE, mTICI finale ≥2b, tempo puntura–riperfusione, recupero neurologico precoce, ΔNIHSS a 24 h; SAE legati a dispositivo o procedura, mortalità a 90 giorni, vasospasmo, embolia in nuovo territorio, ICH secondo Heidelberg ([[PIVOTAL — Protocolo — Rev 03]], p. 20–21, p. 34).
- **Bias**: CEC, DSMB e Imaging Core Lab indipendenti. Il core lab è quello di neuroimaging vascolare della UCLA ([[PIVOTAL — Protocolo — Rev 03]], p. 51–52, p. 55; [[PIVOTAL — CI — V03]], p. 19).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | **Puntura arteriosa** entro 8 h dall'esordio o dal LKN, **e** entro 120 min dall'imaging TC/RM di qualificazione | ([[PIVOTAL — Protocolo — Rev 03]], p. 41) |
| Età | 18–80 anni | ([[PIVOTAL — Protocolo — Rev 03]], p. 41) |
| mRS pre | 0–1 | ([[PIVOTAL — Protocolo — Rev 03]], p. 41) |
| NIHSS | ≥6 | ([[PIVOTAL — Protocolo — Rev 03]], p. 41) |
| Imaging / ASPECTS / core | Esclusi [[ASPECTS]] <6 (circolazione posteriore: PC-ASPECTS <7 su immagini sorgente dell'angio-TC o DWI) e, se si usa un software automatico, core >50 cc in TC-perfusione o >70 cc in DWI | ([[PIVOTAL — Protocolo — Rev 03]], p. 42) |
| Occlusione | LVO con flusso TICI 0–1 **confermata con DSA**: anteriore (ICA intracranica, M1 o M2) o posteriore (vertebrale o basilare), con o senza trombolisi. Escluse [[Oclusión en tándem|tandem]] e occlusioni intracraniche multiple | ([[PIVOTAL — Protocolo — Rev 03]], p. 41–42) |

## Criteri di inclusione
Testo originale (§8.2, [[PIVOTAL — Protocolo — Rev 03]], p. 41–42; sinossi p. 21–22). L'asterisco indica i criteri valutabili in pre-screening senza consenso, perché fanno parte dello standard di cura.

1. \*Age 18 to 80 years (p. 41)
2. \*Clinical diagnosis of acute ischemic stroke with NIH Stroke Scale (NIHSS) score ≥ 6 (p. 41)
3. \*Able to be treated (i.e., defined by arterial puncture time) within 8 hours of symptom onset or last known normal (LKN) (p. 41)
4. \*Able to be treated (i.e., defined by arterial puncture time) within 120 minutes from the time of the qualifying baseline CT/MR image (p. 41)
5. \*Pre-morbid Modified Rankin Scale (mRS) score 0-1 (p. 41)
6. \*Angiographic confirmation of large vessel occlusion (LVO) with TICI 0-1 flow in the anterior (intracranial internal carotid artery or middle cerebral artery M1 or M2 segments) or posterior circulation (vertebral or basilar arteries) as confirmed by digital subtraction angiography (DSA) irrespective of IV thrombolysis administration.
   Note: If indicated, thrombolytic therapy shall be initiated per institution’s usual care. If eligible for thrombolytic therapy in accordance with thrombolytic agent labelling and the most recent version of the AHA/ASA “Guidelines for the Early Management of Patients With Acute Ischemic Stroke,” subjects should be treated as soon as possible, and lytic use should not be delayed regardless of potential eligibility for mechanical neurothrombectomy. (p. 41)
7. \*Candidate to receive treatment with ADAPT technique (Direct Aspiration First-Pass Technique) (p. 41)
8. Informed consent obtained in accordance with applicable IRB/EC and regulatory laws.
   Note (not applicable to U.S. sites): If approved by the local Ethics Committee and country regulations, the investigator is allowed to enroll a patient if, due to the medical condition, the patient is not able to sign and, if applicable, no legal authorized representative or person of trust is available. However, if the patient regains capacity to give consent, the patient should be informed and his/her consent requested for the possible continuation of this research as required by local institutional IRB/EC policy. (p. 41)
9. As applicable by French laws, the patient is affiliated to a health social security regimen or equivalent. (p. 42)

**Sintesi**: 18–80 anni, NIHSS ≥6, mRS pre 0–1. La puntura arteriosa deve avvenire entro 8 h dall'esordio **e** entro 120 min dall'imaging di qualificazione. L'occlusione (ICA intracranica, M1, M2, vertebrale o basilare) va confermata con DSA con TICI 0–1, indipendentemente dalla trombolisi, che non va ritardata. Il paziente deve essere candidato all'ADAPT.

## Criteri di esclusione
Testo originale (§8.3, [[PIVOTAL — Protocolo — Rev 03]], p. 42–43; sinossi p. 22–24):

1. \*Imaging exclusions (based on CT/CTA, MR/MRA or DSA):
   a. Presence of intracerebral hemorrhage
   b. Significant mass effect and/or midline shift
   c. ASPECTS <6 (or PC-ASPECTS <7 on CT angiography source images or DWI MRI for posterior circulation stroke)
   d. If automated software is used, ischemic core lesion >50cc on CTP or >70cc on DWI-MRI
   e. Evidence of intracranial tumor (except small meningioma)
   f. Arterial stenosis proximal to the occlusion that could prevent thrombus removal and/or requiring stenting.
   g. Evidence of preexisting arterial injury or dissection
   h. Vessel tortuosity too difficult to allow endovascular access per investigator judgement.
   i. Known or suspected ICAD
   j. Evidence of multiple intracranial occlusions
   k. Tandem occlusions (p. 42)
2. \*Recurrent strokes within the last 3 months (p. 42)
3. \*Uncontrolled hypertension. Note: if the blood pressure can be successfully reduced and maintained at the acceptable level (per investigator judgement) using medication, the subject can be enrolled. (p. 42)
4. \*Known hemorrhagic diathesis, coagulation deficiency, or on oral anticoagulant therapy with INR >3.0. (p. 42)
5. \*Known platelet count <50,000 units/mcL. (p. 42)
6. \*Life expectancy of less than 6 months due to co-morbidities. (p. 42)
7. \*Known pregnancy or women in labor. (p. 42)
8. \*Known or suspected vasculitis. (p. 42)
9. \*Current participation in an interventional drug or device study that may confound the results of this study. Studies requiring extended follow-up for products that were investigational but have since become commercially available are not considered investigational studies. (p. 42)
10. \*Any other medical, behavioral, or psychological conditions that in the opinion of the Investigator could limit the patient's ability to participate in the study, including compliance with follow-up requirements, or that could impact the scientific integrity of the study. (p. 42)
11. \*As applicable by French laws, breastfeeding women, persons deprived of their liberty by a judicial or administrative decision, or persons of full age who are the subject of a legal protection measure. (p. 43)

**Sintesi**:
- imaging: emorragia, effetto massa, ASPECTS <6 (PC-ASPECTS <7), core automatico >50 cc in TC-perfusione o >70 cc in DWI, tumore, stenosi prossimale che impedisce l'estrazione o richiede stent, dissezione, tortuosità proibitiva, ICAD noto o sospetto, occlusioni intracraniche multiple, tandem;
- clinici: ictus nei 3 mesi precedenti, ipertensione non controllabile, diatesi emorragica o anticoagulante orale con INR >3,0, piastrine note <50.000/µL, aspettativa di vita <6 mesi, gravidanza o travaglio, vasculite, partecipazione a un altro studio interventistico che confonda i risultati.

## Intervento e procedure
- **Dispositivo**: RapidPulse™ Aspiration System: pompa riutilizzabile, set di tubi e canestro monouso, catetere RapidPulse™ 071. Aspirazione pulsata con ciclo rapido del vuoto, o costante ([[PIVOTAL — Protocolo — Rev 03]], p. 17–18, p. 31).
- **Tecnica**: ADAPT con il RPAS come prima linea; accesso transfemorale, altri accessi solo se il femorale non è fattibile ([[PIVOTAL — Protocolo — Rev 03]], p. 41, p. 48).
- **Passaggio**: ogni accensione dell'aspirazione RapidPulse con il catetere sul trombo, seguita da angiografia; mTICI dopo ogni passaggio ([[PIVOTAL — Protocolo — Rev 03]], p. 48–49).
- **Salvataggio**: stent retriever o altri sistemi di aspirazione **dopo tre passaggi** con il dispositivo, solo con dispositivi in commercio. Un salvataggio dopo il primo passaggio conta come fallimento dell'endpoint primario ([[PIVOTAL — Protocolo — Rev 03]], p. 49).
- **Trombolisi**: ammessa. Va fatta secondo la pratica del centro e le linee guida AHA/ASA, senza ritardi per la trombectomia ([[PIVOTAL — Protocolo — Rev 03]], p. 41, p. 43).
- **Trombectomia**: è l'intervento stesso. Il paziente è arruolato al consenso; se risulta non eleggibile prima che il catetere attraversi la cute è uno screen failure ([[PIVOTAL — Protocolo — Rev 03]], p. 43).
- **Esami**: laboratorio e TC/RM secondo lo standard del centro; nessun esame specifico dello studio ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 46).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Screening / basale | prima della procedura | consenso, eleggibilità, anamnesi, esame obiettivo, TC o RM, laboratorio, NIHSS, mRS pre | ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 46) |
| Procedura | — | DSA, mTICI basale e per passaggio, PA minima, AE | ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 48–49) |
| 24 h | (−6/+12) nella Tab. 1; "(+6/-12)" nel §9.6 | NIHSS, TC senza contrasto e/o RM, parametri vitali, AE | ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 49) |
| G5–7 o dimissione | la prima delle due | NIHSS, mRS (alla dimissione se ancora ricoverato), parametri vitali | ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 50) |
| G90 | ±14 giorni | NIHSS, mRS, AE. **Preferibilmente in presenza**; telemedicina o telefono solo se non può venire, e allora senza NIHSS né parametri vitali | ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 50) |

## Consenso
- **Protocollo**: consenso scritto del paziente, del rappresentante legale (LAR) o di altra persona autorizzata dalla normativa e dal CE; short form se il CE lo approva. Fuori dagli USA, se CE e normativa lo permettono, inclusione senza firma quando né il paziente né un LAR o persona di fiducia possono firmare; consenso del paziente appena recupera la capacità ([[PIVOTAL — Protocolo — Rev 03]], p. 41, p. 45–46). Vedi [[Consentimiento diferido]].
- **CI V03 locale** (castellano e catalano): quattro moduli con firma scritta: soggetto o rappresentante/familiare/persona vincolata de hecho (firma "previamente" per l'urgenza, poi conferma del paziente); testimone se il paziente consente ma non può firmare; **testimone imparziale in emergenza** se il paziente non può capire né firmare e non c'è rappresentante; consenso a continuare ([[PIVOTAL — CI — V03]], p. 12–15).
- **Orale o telefonico**: non previsto né dal protocollo Rev 03 né dal CI V03. Secondo il team, nella cartella Drive originale (non nella copia ordinata) c'è un documento di consenso orale di marzo 2025, quindi anteriore alla Rev 03 e al CI V03: **non letto**, da verificare se è ancora approvato.
- **Lingue**: castellano e catalano, nella stessa versione.

## Co-arruolamento
- Escluso chi partecipa **ora** a uno studio interventistico con farmaco o dispositivo "that may confound the results of this study"; non contano i follow-up di prodotti nel frattempo commercializzati ([[PIVOTAL — Protocolo — Rev 03]], p. 42). Il CI è più restrittivo: "no debe participar en otro estudio de investigación" ([[PIVOTAL — CI — V03]], p. 3).
- Compatibilità con studi specifici: non riportata nei documenti.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:72-84`;
- `src/lib/domain/acute-rules.ts:82-85` (`computeVesselFlags`) e `:160-171` (`pivotal()`);
- `src/lib/domain/acute-reasons.ts:60-70`;
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/lib/domain/vessels.ts`.

Verificato il 2026-10-19 sul commit `7818276` (working tree pulito).

> [!success] Coincide
> - stato attivo, come nel foglio (`trials-info.ts:73`);
> - età 18–80 (`acute-rules.ts:164-165`; testo `trials-info.ts:75`);
> - mRS pre ≤1 (`:166`) e NIHSS ≥6 (`:167`);
> - LVO obbligatoria, cioè paziente candidato a EVT (`:168`), coerente con uno studio di trombectomia;
> - ICA terminale, M1 e basilare fra i vasi ammessi (`:82-85`);
> - trombolisi "Optional." e trombectomia "Yes." (`trials-info.ts:78-79`);
> - "preEvtLabs: No." (`:80`): il protocollo non chiede esami propri, solo quelli dello standard ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 46);
> - intervento (`:81`) e nota "Initial treatment with a different thrombectomy device not allowed." (`:82`): coerenti con la prima linea RapidPulse e il salvataggio dopo tre passaggi (p. 49);
> - testo dell'imaging (`:77`) "ICA (including T), M1, M2, intracranial vertebral or basilar": coincide con il protocollo, ma la regola no (punto 1).

- [ ] **1. [FN] La regola accetta solo ICA-T, M1 e basilare: esclude ICA intracranica non terminale, M2 e vertebrale.**
> [!warning] Contraddizione
> Protocollo, inclusione 6: "intracranial internal carotid artery or middle cerebral artery M1 or M2 segments) or posterior circulation (vertebral or basilar arteries)" ([[PIVOTAL — Protocolo — Rev 03]], p. 41). Indicazione d'uso e glossario: ICA, M1, M2, basilare e vertebrale (p. 11, p. 18, p. 31). Nessuna restrizione a M2 prossimale o dominante.
> App: `computeVesselFlags` imposta `pivotal` solo con `ica-terminal`, `m1` o `basilar` (`acute-rules.ts:82-85`); etichetta "vessel ICA-T, M1 o basilar" (`acute-reasons.ts:68`). Non vengono accettati `ica-intracranial` ("Intracranial ICA (no T)", `vessels.ts:12`), `m2-proxdom` e `m2-any` (`:15-16`), né `va` (`:25`). Un paziente con M2 o vertebrale intracranica eleggibile non viene proposto. Il testo `trials-info.ts:77` e il foglio del team li includono. Nota: l'opzione "VA" non distingue vertebrale intracranica ed extracranica; l'indicazione d'uso parla di malattia occlusiva **intracranica** (p. 18).

- [ ] **2. [FP] L'ASPECTS non viene controllato.**
> [!warning] Contraddizione
> Protocollo, esclusione 1c: "ASPECTS <6 (or PC-ASPECTS <7 … for posterior circulation stroke)" ([[PIVOTAL — Protocolo — Rev 03]], p. 42).
> App: `pivotal()` non legge `aspects` (`acute-rules.ts:160-171`), anche se il campo si compila nella stessa scheda EVT (`PostImaging.svelte:176-177`). Il testo `trials-info.ts:75` dice "6-10", ma la logica no. Un paziente anteriore con ASPECTS 0–5 risulta eleggibile. Per la circolazione posteriore il PC-ASPECTS non viene chiesto (vedi punto 7).

- [ ] **3. [FP] Il tandem non viene escluso.**
> [!warning] Contraddizione
> Protocollo, esclusione 1k: "Tandem occlusions" ([[PIVOTAL — Protocolo — Rev 03]], p. 42).
> App: il campo `tandem` esiste nella scheda EVT (`PostImaging.svelte:172`), ma `pivotal()` non lo usa (`acute-rules.ts:160-171`). Lo usa solo ATHENA (`:144`). Un tandem ICA cervicale + M1 risulta eleggibile. Neanche `trials-info.ts:82` lo cita.

- [ ] **4. [FP] Le occlusioni intracraniche multiple non vengono escluse.**
> [!warning] Contraddizione
> Protocollo, esclusione 1j: "Evidence of multiple intracranial occlusions" ([[PIVOTAL — Protocolo — Rev 03]], p. 42).
> App: `vessels.pivotal` è un OR (`acute-rules.ts:82-85`) e il numero di vasi non viene contato, a differenza di NiVO (`selectedVesselCount`, `:194`). Con M1 + basilare il paziente risulta eleggibile.

- [ ] **5. [FP] La tortuosità non viene usata.** Protocollo, esclusione 1h: "Vessel tortuosity too difficult to allow endovascular access per investigator judgement" ([[PIVOTAL — Protocolo — Rev 03]], p. 42). Il campo `tortuosity` si compila nella scheda EVT (`PostImaging.svelte:174`), ma `pivotal()` lo ignora. È un giudizio dello sperimentatore, quindi un falso positivo minore.

- [ ] **6. [NC] La finestra si misura alla puntura, non al momento del calcolo; i 120 minuti dall'imaging non vengono verificati.**
> [!warning] Contraddizione
> Protocollo: "Able to be treated (i.e., defined by arterial puncture time) within 8 hours…" e "…within 120 minutes from the time of the qualifying baseline CT/MR image" (inclusioni 3 e 4, [[PIVOTAL — Protocolo — Rev 03]], p. 41).
> App: `input.ltsw < 8` (`acute-rules.ts:163`; `acute-reasons.ts:63` "LTSW < 8h"; `trials-info.ts:75` "< 8 h"), dove `ltsw` sono le ore trascorse al momento della valutazione (`stores/patient.ts:82-86`). Un paziente a 7,5 h risulta eleggibile anche se la puntura arriverà oltre le 8 h; il limite dei 120 min dall'imaging non c'è. La differenza fra `< 8` e "within 8 hours" (≤8) è solo di bordo.

- [ ] **7. [NC] Core automatico, PC-ASPECTS, conferma con DSA e criteri tecnici non vengono chiesti.**
  - Core >50 cc in TC-perfusione o >70 cc in DWI se si usa un software automatico (esclusione 1d, p. 42): il campo `largeCore` esiste, ma solo nella scheda TENACITY, con soglia 70 mL (`PostImaging.svelte:209`; `acute-rules.ts:42-43`).
  - PC-ASPECTS <7 nella circolazione posteriore (esclusione 1c, p. 42): non c'è un campo.
  - TICI 0–1 confermato con DSA (inclusione 6, p. 41) e candidato ADAPT (inclusione 7): l'app usa `lvo`, derivato da "Candidato a trombectomia: eleggibile" (`PostImaging.svelte:26-27`). È un'approssimazione accettabile, perché la conferma avviene in sala ([[PIVOTAL — Protocolo — Rev 03]], p. 43, p. 46).
  - Stenosi prossimale, dissezione, ICAD noto o sospetto, tumore, effetto massa (esclusioni 1b, 1e–1g, 1i, p. 42).

- [ ] **8. [NC] Le esclusioni cliniche non sono modellate** (scelta di progetto, da rendere esplicita). Mancano:
  - ictus negli ultimi 3 mesi;
  - ipertensione non controllabile;
  - diatesi emorragica o anticoagulante orale con INR >3,0 (il campo `doac` non serve qui: il protocollo esclude per INR, non per tipo di anticoagulante);
  - piastrine <50.000/µL, aspettativa di vita <6 mesi, gravidanza o travaglio, vasculite;
  - partecipazione ad altri studi interventistici ([[PIVOTAL — Protocolo — Rev 03]], p. 42–43).
  L'emorragia è comunque filtrata dal tipo di ictus nell'interfaccia.

- [ ] **9. [TXT] Consenso "Written & oral/phone" non previsto dai documenti vigenti.**
> [!warning] Contraddizione
> Protocollo Rev 03: consenso scritto del paziente o del LAR, short form, inclusione senza firma se il CE lo permette ([[PIVOTAL — Protocolo — Rev 03]], p. 41, p. 45–46). CI V03: solo moduli con firma scritta, compreso il testimone imparziale in emergenza ([[PIVOTAL — CI — V03]], p. 12–15).
> App: `trials-info.ts:76` "Written & oral/phone consent." (come il foglio del team). Il consenso orale di marzo 2025 che il team segnala nel Drive originale non è nella copia ordinata ed è anteriore alla Rev 03 e al CI V03: va confermato che sia ancora approvato dal CEIm.

- [ ] **10. [TXT] G90 non è telefonica di default.**
> [!warning] Contraddizione
> Protocollo: "At day 90 follow-up, it is preferred that the patient return to the clinic for an in-person visit"; telemedicina o telefono solo se non è possibile, e allora senza NIHSS ([[PIVOTAL — Protocolo — Rev 03]], p. 26, p. 50).
> App: `trials-info.ts:83` "Day 90 (phone)".

- [ ] **11. [TXT] Testo della finestra e dell'imaging incompleto.** `trials-info.ts:75` "< 8 h" non dice che il limite vale alla puntura arteriosa, né cita i 120 min dall'imaging. `:77` e `:82` non citano la conferma con DSA (TICI 0–1), l'esclusione del tandem e delle occlusioni multiple, il PC-ASPECTS ≥7 per la circolazione posteriore né il core automatico (≤50 cc in TC-perfusione, ≤70 cc in DWI) ([[PIVOTAL — Protocolo — Rev 03]], p. 41–42).

## Problemi documentali
- **Consenso orale non nella copia ordinata**: secondo il team il documento (marzo 2025) è nella cartella Drive originale; è anteriore alla Rev 03 (29-01-2026) e al CI V03. Non è stato letto.
- **Rev 03 solo amministrativa**: l'unica modifica è l'indirizzo del promotore; i criteri sono quelli della Rev 02 (22-03-2024) ([[PIVOTAL — Protocolo — Rev 03]], p. 69).
- **Appendice A assente**: la tabella delle 45 pubblicazioni usate per l'obiettivo di performance è citata (p. 36), ma la p. 68 contiene solo il titolo ([[PIVOTAL — Protocolo — Rev 03]]).
- **Finestra della visita a 24 h**: "(-6/+12)" nella Tab. 1 e nel CI, "(+6/-12)" nel titolo del §9.6 ([[PIVOTAL — Protocolo — Rev 03]], p. 5, p. 26, p. 49).
- **Trombolisi**: l'indicazione d'uso parla di pazienti "ineligible for or failed intravenous thrombolytics" (p. 18, p. 31), l'inclusione 6 di occlusione "irrespective of IV thrombolysis administration" (p. 41).
- **Sinossi in castellano**: mancano gli asterischi su inclusioni 4 e 7 ed esclusione 8; "hemorragia intracraneal" invece di "intracerebral"; l'intestazione delle esclusioni dice "criterios de inclusión" ([[PIVOTAL — Sinopsis — Rev 03]], p. 6–8).
- **CI**: data interna 29-01-2026 contro "2026-04-30" nel nome del file; età solo "al menos 18 años", senza il limite di 80; esclusi tutti gli altri studi, non solo quelli interventistici ([[PIVOTAL — CI — V03]], p. 1, p. 3).
- **CI catalano**: manca una frase sulla cessione dei dati (p. 18), intestazione in castellano, refusi ([[PIVOTAL — CI català — V03]]).
- **Registro**: nessun numero NCT o EUDAMED nei documenti; il CI rimanda a ClinicalTrials.gov ([[PIVOTAL — CI — V03]], p. 19).

## Fonti
- [[PIVOTAL — Protocolo — Rev 03]]
- [[PIVOTAL — Sinopsis — Rev 03]]
- [[PIVOTAL — CI — V03]]
- [[PIVOTAL — CI català — V03]]
- [[Esquema ensayos — septiembre 2026]] (stato)
