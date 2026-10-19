---
tipo: ensayo
estudio: SOVATELTIDE
alias: [Sovateltide/ACIS/IND2022, PMZ-1620, IRL-1620, Sovateltida]
estado_app: activo
clave_app: "Sovateltide"
categoria: isquémico
fase: "III"
promotor: "Pharmazz EU Limited (filiale di Pharmazz, Inc.)"
registro: ["NCT05691244", "EU CT 2024-519551-29-00", "IND 145570"]
protocolo_vigente: "v3.1, 25-05-2025"
ci_vigente: "v4.2.0, 05-05-2025 (Main ICF Spain, centro 3418), anteriore al protocollo v3.1"
drive_carpeta: "https://drive.google.com/drive/folders/1v4AHrgMrzgA4mIRmCy0maJCBZ_W5malv"
fuentes: ["[[SOVATELTIDE — Protocolo — v3.1]]", "[[SOVATELTIDE — CI — v4.2.0]]"]
actualizado: 2026-10-19
---
# SOVATELTIDE

> [!summary] In breve
> Studio di fase III, multicentrico, randomizzato 1:1, in doppio cieco, promosso da Pharmazz. Confronta la sovateltide, agonista selettivo del recettore ETB con effetto neuroprotettivo e neurorigenerativo, con un placebo, entrambi aggiunti allo standard of care. È rivolto a pazienti con ictus ischemico acuto entro 24 h, di 18–80 anni, con [[NIHSS]] 8–19 (voce 1a <2) e [[mRS]] pre 0–2, **non candidati a trombectomia**. La trombolisi è ammessa. Si danno 3 boli e.v. al giorno, nei giorni 1, 3 e 6 ([[SOVATELTIDE — Protocolo — v3.1]], p. 8, p. 62–63).

> [!info] Stato
> Foglio "Esquema ensayos" (fonte di verità, modificato il 2026-10-09): **aperto**. App: `status: "active"` (`src/lib/domain/trials-info.ts:217`). Coincidono.
> Il parere del CEIm non è nella cartella Drive; il CI dichiara l'approvazione del CEIm e dell'AEMPS ([[SOVATELTIDE — CI — v4.2.0]], p. 1).

## Disegno
- **Tipo**: fase III, multicentrico, randomizzato 1:1, in doppio cieco, a gruppi paralleli, controllato con placebo ([[SOVATELTIDE — Protocolo — v3.1]], p. 1, p. 51).
- **Bracci**: sovateltide + standard of care contro placebo identico + standard of care. Lo standard of care è quello del centro ([[SOVATELTIDE — Protocolo — v3.1]], p. 51–52).
- **Randomizzazione**: centrale (IWRS/RTSM), stratificata per tempo di arruolamento (<12 h vs ≥12 h) e per uso di trombolitici e.v. all'arruolamento ([[SOVATELTIDE — Protocolo — v3.1]], p. 51–52, p. 55).
- **Cieco**: pazienti, sperimentatori e promotore restano in cieco ([[SOVATELTIDE — Protocolo — v3.1]], p. 55).
- **Numerosità**: 514 pazienti (257 per braccio), circa 65 centri in USA, Canada, Regno Unito ed Europa ([[SOVATELTIDE — Protocolo — v3.1]], p. 8, p. 51). Il calcolo si basa sullo studio indiano di fase III: mRS ≤2 atteso nel 55,71% con placebo e nell'80,60% con sovateltide ([[SOVATELTIDE — Protocolo — v3.1]], p. 88).
- **Endpoint primario**: mRS 0–2 a 90 giorni ([[SOVATELTIDE — Protocolo — v3.1]], p. 50).
- **Secondari chiave** (in sequenza gerarchica): NIHSS <6, Barthel ≥90 e mRS 0–1 a 90 giorni. Altri secondari: qualità di vita (EQ-5D-5L, SS-QOL), ictus ricorrente, mortalità, ICH sintomatica e radiologica a 24 (±6) h, MoCA ([[SOVATELTIDE — Protocolo — v3.1]], p. 50–51, p. 85).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | <24 h dall'esordio **alla prima dose**; nell'ictus durante il sonno l'esordio è l'ultima volta visto normale. Strato <12 h / ≥12 h | ([[SOVATELTIDE — Protocolo — v3.1]], p. 55, p. 62) |
| Età | 18–80 anni | ([[SOVATELTIDE — Protocolo — v3.1]], p. 62) |
| mRS pre | 0–2 | ([[SOVATELTIDE — Protocolo — v3.1]], p. 62) |
| NIHSS | ≥8 e <20 allo screening, con voce **1a (livello di coscienza) <2**; esclusi i comatosi (1a ≥2) | ([[SOVATELTIDE — Protocolo — v3.1]], p. 62) |
| Imaging / ASPECTS / core | Ictus ischemico diagnosticato **clinicamente e/o** con TC o RM; nessuna emorragia su TC/RM. ASPECTS solo esplorativo, aggiudicato dal core lab. Nessun criterio di core o perfusione | ([[SOVATELTIDE — Protocolo — v3.1]], p. 51, p. 54, p. 62) |
| Occlusione | Non richiesta né esclusa. Esclusi i pazienti trattati con terapia endovascolare o candidati a chirurgia per l'ictus | ([[SOVATELTIDE — Protocolo — v3.1]], p. 62) |

## Criteri di inclusione
Testo originale (§5.1, [[SOVATELTIDE — Protocolo — v3.1]], p. 62; sinossi p. 9–10):

1. Adult males or females aged 18 – 80 years old (p. 62)
2. Consent obtained per national laws and regulations, and in accordance with the applicable ethics committee requirements prior to study procedures (p. 62)
3. Stroke is ischemic in origin that is diagnosed clinically and/or radiologically (CT scan or diagnostic MRI) prior to enrolment. No hemorrhage as proved by cerebral CT/MRI scan. (p. 62)
4. Cerebral ischemic stroke patients presenting within 24 hours after onset of symptoms with NIHSS score ≥8 and <20, NIHSS Level of consciousness (1A) score <2 at the time of screening. This includes cerebral ischemic stroke patients who completely recovered from earlier episodes before having a new or fresh stroke having pre-stroke historical measure of mRS score 0-2. (p. 62)
5. The patient is <24 hours from the time of stroke onset when the first dose of sovateltide is administered. Time of onset is when symptoms began; for stroke that occurred during sleep, time of onset is when the patient was last seen or was self- reported to be normal (p. 62)
6. Reasonable expectation of availability to receive the full sovateltide course of therapy and to be available for subsequent follow-up visits (p. 62)

**Sintesi**: adulto di 18–80 anni con mRS pre 0–2 e ictus ischemico, diagnosticato anche solo clinicamente purché la TC/RM escluda un'emorragia. Servono un NIHSS 8–19 con voce 1a <2 e la prima dose entro 24 h dall'esordio o dall'ultima volta visto bene. Il paziente deve poter completare le 9 dosi e il follow-up.

## Criteri di esclusione
Testo originale (§5.2, [[SOVATELTIDE — Protocolo — v3.1]], p. 62–63; sinossi p. 10):

1. Patients receiving endovascular therapy or is a candidate for any surgical intervention for the treatment of stroke, which may include but not limited to endovascular techniques (p. 62)
2. Patients classified as comatose are defined as a patient who requires repeated stimulation to attend or is obtunded and requires strong or painful stimulation to make movements (NIHSS Level of Consciousness (1A) score ≥2) (p. 62)
3. Evidence of intracranial hemorrhage (intracerebral hematoma, intraventricular hemorrhage, SAH, epidural hemorrhage, acute or chronic subdural hematoma (SDH) on the baseline CT or MRI scan (p. 63)
4. Known pregnancy and lactating women (p. 63)
5. Known medical history of neurological (other than current acute ischemic stroke) or psychiatric condition that, in the investigator's opinion, would confound the neurological and functional evaluations, lead to further deterioration of neurological status, or interfere with participation in this study (p. 63)
6. Concurrent participation in any other therapeutic clinical trial (p. 63)
7. Evidence of any other major life-threatening or serious medical condition that would prevent completion of the study protocol impair the assessment of outcome, or in which sovateltide therapy would be contraindicated or might cause harm to the patient (p. 63)

Fuori elenco: "Participants not willing to use a highly effective contraception method will be excluded" (p. 77, p. 126); escluse anche le donne che allattano (p. 126).

**Sintesi**: sono esclusi i pazienti in trattamento endovascolare o candidati a chirurgia, i comatosi, chi ha un'emorragia intracranica di qualunque tipo, le donne incinte o che allattano, chi ha una malattia neurologica o psichiatrica che confonde la valutazione, chi partecipa a un altro studio terapeutico e chi ha una malattia grave che impedisce di completare lo studio. Non ci sono soglie di laboratorio.

## Intervento e procedure
- **Farmaco**: sovateltide 0,3 µg/kg in bolo e.v. di 1–2 minuti, **3 dosi a distanza di 3 ± 1 h** nei giorni 1, 3 e 6 (±1), cioè 0,9 µg/kg al giorno e 9 somministrazioni in tutto. La prima dose va data entro 24 h dall'esordio ([[SOVATELTIDE — Protocolo — v3.1]], p. 10–11, p. 55–56). Si cerca di dare le dosi alla stessa ora nei tre giorni; chi è dimesso prima del giorno 6 viene richiamato ([[SOVATELTIDE — Protocolo — v3.1]], p. 52).
- **Preparazione**: fiala liofilizzata da 30 µg in 5 mL di fisiologica (6 µg/mL), stabile 48 h a 2–8 °C. Dispensazione in cieco da RTSM: 1 o 2 confezioni da 9 fiale in base al peso ([[SOVATELTIDE — Protocolo — v3.1]], p. 33–34, p. 56).
- **Trombolisi**: ammessa. È un fattore di stratificazione; nessun intervallo minimo con la prima dose ([[SOVATELTIDE — Protocolo — v3.1]], p. 51–52). Il CI la cita tra le terapie di riferimento che restano in vigore ([[SOVATELTIDE — CI — v4.2.0]], p. 8).
- **Trombectomia**: **no**. Esclusi i pazienti che ricevono terapia endovascolare o ne sono candidati ([[SOVATELTIDE — Protocolo — v3.1]], p. 62; [[SOVATELTIDE — CI — v4.2.0]], p. 8). La trombectomia di salvataggio dopo l'inclusione non è trattata.
- **Farmaci concomitanti**: nessun divieto ([[SOVATELTIDE — Protocolo — v3.1]], p. 65).
- **Esami prima della dose**: emocromo, glicemia, lipidi, elettroliti, funzione epatica e renale, PTT, PT/INR, campione di immunogenicità **prima della prima dose**, ECG e test di gravidanza fanno parte delle valutazioni di eleggibilità. Valgono anche quelli fatti entro 24 h prima del consenso ([[SOVATELTIDE — Protocolo — v3.1]], p. 53, p. 57, p. 66). Non ci sono soglie di laboratorio.
- **NIHSS**: si misura prima della prima dose ([[SOVATELTIDE — Protocolo — v3.1]], p. 67).
- **Imaging**: solo quello dello standard of care, inviato al core lab, che verifica i criteri e aggiudica l'ASPECTS. Ammesso l'imaging del centro inviante ([[SOVATELTIDE — Protocolo — v3.1]], p. 54).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| V1 | giorno 1 | screening, randomizzazione, esami, ECG, NIHSS, mRS (anche pre), Barthel, QoL, C-SSRS; 3 dosi | ([[SOVATELTIDE — Protocolo — v3.1]], p. 53, p. 57–58) |
| V1 | giorno 2 | segni vitali, esame obiettivo, AE, ictus ricorrente | (p. 58) |
| V1 | giorno 3 | 3 dosi, ECG, immunogenicità | (p. 58–59) |
| V1 | giorno 6 ± 1 | 3 dosi, ECG, immunogenicità, MoCA | (p. 59) |
| V2 | giorno 30 ± 5 | **in presenza** (telemedicina se non possibile): esami, NIHSS, mRS, Barthel, QoL, MoCA, TOAST | (p. 59–60) |
| V3 | giorno 60 ± 5 | **telefonica**: AE, QoL, ictus ricorrente | (p. 60) |
| V4 | giorno 90 ± 5 | fine studio **in clinica**: esami, NIHSS, mRS, Barthel, QoL, MoCA | (p. 60–61) |

## Consenso
- **Tipo**: consenso informato **scritto** del paziente o del rappresentante legale (LAR), prima di qualsiasi procedura. È gerarchico: prima il paziente, poi il LAR se il paziente non ha capacità ([[SOVATELTIDE — Protocolo — v3.1]], p. 49, p. 92–93).
- **Recupero della capacità**: se ha firmato un altro, si chiede il consenso al paziente appena possibile, fino alla morte o alla visita del giorno 90 ([[SOVATELTIDE — Protocolo — v3.1]], p. 93).
- **CI locale**: firma del paziente, del rappresentante legale e, in alternativa, pagina per il **testimone imparziale** ([[SOVATELTIDE — CI — v4.2.0]], p. 11–13).
- **Orale, telefonico o differito**: non riportati nel documento.
- **Lingue**: in Drive c'è solo il castellano.

## Co-arruolamento
- Escluso chi partecipa a "any other therapeutic clinical trial" ([[SOVATELTIDE — Protocolo — v3.1]], p. 63).
- Compatibilità con studi specifici: non riportata nel documento.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:216-228` (scheda `Sovateltide`);
- `src/lib/domain/acute-rules.ts:277-288` (`sovateltide()`);
- `src/lib/domain/acute-reasons.ts:167-176` (`reasonSovateltide()`);
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/routes/Summary.svelte`.

Verificato il 2026-10-19.

> [!success] Coincide
> - stato attivo, come nel foglio (`trials-info.ts:217`);
> - età 18–80 inclusi (`acute-rules.ts:281-282`);
> - mRS pre ≤2 (`:283`);
> - NIHSS ≥8 e <20 (`:285-286`; testo "8-19" in `trials-info.ts:219` e `acute-reasons.ts:174`);
> - finestra <24 h dall'ultima volta visto bene, che vale anche per l'ictus durante il sonno (`:280`);
> - esclusione dei candidati a trombectomia con `candidate === "not eligible"` (`:279`; testo `trials-info.ts:223`);
> - ASPECTS "-" (`trials-info.ts:219`), non richiesto;
> - consenso scritto, con testimone imparziale (`trials-info.ts:220`; [[SOVATELTIDE — CI — v4.2.0]], p. 13);
> - esami pre-dose (`trials-info.ts:224`);
> - emorragia filtrata dal tipo di ictus nell'interfaccia (`PostImaging.svelte:102-103`).

- [ ] **1. [FN] L'app richiede una lesione visibile all'imaging; il protocollo accetta la diagnosi clinica.**
> [!warning] Contraddizione
> Protocollo, inclusione 3: "Stroke is ischemic in origin that is diagnosed clinically and/or radiologically (CT scan or diagnostic MRI) prior to enrolment. No hemorrhage as proved by cerebral CT/MRI scan." ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
> App: `sovateltide()` richiede `input.lesionConfirmed === "yes"` (`acute-rules.ts:284`; `acute-reasons.ts:173` "lesione confermata"). La domanda dell'interfaccia è "Lesione confermata su imaging (CT / CTP / MRI)?" (`PostImaging.svelte:185`; `src/lib/i18n/it.ts:160`). Un paziente con TC normale (senza emorragia) e quadro clinico chiaro, frequente nelle prime ore, risulta non eleggibile: falsi negativi.

- [ ] **2. [NC] La voce 1a del NIHSS (<2) non viene chiesta.**
> [!warning] Contraddizione
> Protocollo, inclusione 4 ed esclusione 2: "NIHSS Level of consciousness (1A) score <2"; i comatosi con 1A ≥2 sono esclusi ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
> App: c'è solo il NIHSS totale (`acute-rules.ts:285-286`), e né `trials-info.ts:219` né `acute-reasons.ts:174` citano la voce 1a. Un paziente con NIHSS 8–19 e 1a = 2 viene proposto, anche se non è eleggibile.

- [ ] **3. [NC] La finestra vale alla prima dose, non al momento dell'uso dell'app.**
> [!warning] Contraddizione
> Protocollo, inclusione 5: "The patient is <24 hours from the time of stroke onset when the first dose of sovateltide is administered" ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
> App: `input.ltsw < 24` (`acute-rules.ts:280`) usa le ore trascorse al momento della valutazione (`src/lib/stores/patient.ts:82-86`). Dopo vengono consenso, esami, randomizzazione e preparazione del farmaco: vicino alle 24 h l'app propone pazienti che non arriveranno in tempo alla dose. L'app non lo segnala.

- [ ] **4. [NC] Co-arruolamento: l'app può proporre insieme studi terapeutici incompatibili.**
> [!warning] Contraddizione
> Protocollo, esclusione 6: "Concurrent participation in any other therapeutic clinical trial" ([[SOVATELTIDE — Protocolo — v3.1]], p. 63).
> App: nessuna logica di co-arruolamento. Lo stesso paziente non candidato a trombectomia può risultare eleggibile anche a REMEDY (`acute-rules.ts:322`, `candidate === "not eligible"`) o a TENACITY (`acute-rules.ts:368`). Il riepilogo li elenca insieme (`Summary.svelte:31`, `:35-36`) senza avvisare.

- [ ] **5. [NC] Altre esclusioni non modellate.**
> [!note] Non verificate dall'app
> Gravidanza e allattamento, malattia neurologica o psichiatrica che confonde la valutazione, malattia grave o pericolosa per la vita, candidatura a chirurgia per l'ictus (non solo endovascolare), disponibilità per le 9 dosi e il follow-up, contraccezione altamente efficace ([[SOVATELTIDE — Protocolo — v3.1]], p. 62–63, p. 77, p. 126). Restano a giudizio del medico, come per gli altri studi.

- [ ] **6. [TXT] Trombolisi: "No." nella scheda, ma il protocollo la ammette.**
> [!warning] Contraddizione
> Protocollo: randomizzazione stratificata per "usage or non-usage of IV thrombolytic agents at enrollment", con sottostrati minimi di 70 pazienti trattati e non trattati ([[SOVATELTIDE — Protocolo — v3.1]], p. 8, p. 51–52). CI: il "tratamiento trombolítico" resta fra le terapie di riferimento ([[SOVATELTIDE — CI — v4.2.0]], p. 8). Foglio del team: "sì".
> App: `trials-info.ts:222` `thrombolytic: "No."`. La regola non usa `ivtCandidate`, quindi la logica è corretta; sbaglia solo il testo, che può però far scartare a mano i pazienti trombolisati.

- [ ] **7. [TXT] Schema di somministrazione sbagliato.**
> [!warning] Contraddizione
> Protocollo: 0,3 µg/kg in bolo di 1–2 min, **3 dosi a 3 ± 1 h di distanza nei giorni 1, 3 e 6 (±1)**, 9 somministrazioni in tutto ([[SOVATELTIDE — Protocolo — v3.1]], p. 10, p. 55–56).
> App: `trials-info.ts:225` "3 bolus doses (1-2 min) on Day 0 / Day 3 / Day 6", che sembra indicare una sola dose al giorno e conta dal giorno 0. `trials-info.ts:226` "5-day treatment course (daily IV bag 90 min).", che non corrisponde a nulla nel protocollo.

- [ ] **8. [TXT] Esclusioni inventate nella scheda.**
> [!warning] Contraddizione
> Protocollo: le esclusioni sono le 7 del §5.2 ([[SOVATELTIDE — Protocolo — v3.1]], p. 62–63). Non si escludono occlusione tandem, lesione con effetto massa o vasculite.
> App: `trials-info.ts:226` "Exclude: ICH, tandem occlusion, mass-effect lesion, cerebral vasculitis.". A parte l'ICH, sono le esclusioni di VANISH (colonna "Otros" del [[Esquema ensayos — septiembre 2026]]). La regola non le usa, quindi l'errore è solo nel testo.

- [ ] **9. [TXT] Testo dell'imaging copiato da un altro studio.**
> [!warning] Contraddizione
> Protocollo: diagnosi clinica e/o radiologica con TC o RM, nessuna emorragia; nessun requisito di ipodensità, perfusione od occlusione ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
> App: `trials-info.ts:221` "Ischemic stroke only (non-AITS): CT confirmation by any of: hypodensity, perfusion deficit, or vessel occlusion (anterior or posterior circulation).", simile al testo di LIBREXIA (`trials-info.ts:205`). Manca la RM e non si dice che basta la diagnosi clinica (vedi il punto 1).

- [ ] **10. [TXT] Visite sbagliate.**
> [!warning] Contraddizione
> Protocollo: V1 dal giorno 1 al 6 (giorni 1, 2, 3, 6); giorno 30 **in presenza** (telemedicina solo se non possibile); giorno 60 telefonico; giorno 90 in clinica ([[SOVATELTIDE — Protocolo — v3.1]], p. 53, p. 57–61). Il foglio dice "g. 1/3/6/30/60/90".
> App: `trials-info.ts:227` "Post-dose monitoring (0-72 h)", "Day 7 / discharge visit", "Day 30 (phone)", "Day 90 (phone)". Il testo è quasi identico allo schema di ORION nel foglio. Mancano i giorni 3, 6 e 60; i giorni 30 e 90 non sono telefonici.

- [ ] **11. [TXT] Il criterio di esclusione "candidato a chirurgia" è più ampio del testo dell'app.**
> [!warning] Contraddizione
> Protocollo, esclusione 1: "receiving endovascular therapy or is a candidate for any surgical intervention for the treatment of stroke" ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
> App: `trials-info.ts:223` "No (non-EVT candidate cohort)." e `acute-reasons.ts:169` "non candidato EVT". La chirurgia (per esempio la craniectomia decompressiva) non è citata.

## Problemi documentali
- **Parere del CEIm**: manca nella cartella Drive. Il CI dichiara l'approvazione del CEIm e dell'AEMPS ([[SOVATELTIDE — CI — v4.2.0]], p. 1).
- **CI anteriore al protocollo**: il CI v4.2.0 è del 05-05-2025, il protocollo v3.1 del 25-05-2025. Non risulta a quale versione del protocollo si riferisca il CI.
- **Test di gravidanza**: su urine nel protocollo (p. 53, p. 57), "urine or serum" nell'App. 8 (p. 126), "en sangre" nel CI (p. 7).
- **MoCA al giorno 6**: nel protocollo (p. 53, p. 59), non nel calendario del CI (p. 5).
- **Testimone imparziale**: nel CI (p. 13), non nel protocollo.
- **Rinvio sbagliato**: il §12.3 rimanda all'"Appendix 8" per i metodi di consenso, ma l'Appendice 8 riguarda la contraccezione ([[SOVATELTIDE — Protocolo — v3.1]], p. 93, p. 125).
- **Paziente non eleggibile scoperto dopo la dose**: a p. 58 completa le 9 dosi, a p. 63 il trattamento si interrompe subito a giudizio del PI.
- **Dati di fase I incoerenti**: MTD 0,6 µg/kg e 7–9 soggetti (p. 43, p. 47) contro MTD 1,0 µg/kg e 15 soggetti (p. 46, dati dello studio diagnostico VRP-1620).
- **Promotore**: Pharmazz EU Limited (p. 1) contro Pharmazz, Inc. (p. 94).
- **Foglio del team**: NIHSS "8-20" invece di ≥8 e <20 (8–19); intervento "g. 0/3/6" invece dei giorni 1/3/6 ([[Esquema ensayos — septiembre 2026]]).
- **Da non confondere con DONE SYMPLE**, studio diverso (trombectomia 24–72 h) presente nello stesso foglio.

## Fonti
- [[SOVATELTIDE — Protocolo — v3.1]]
- [[SOVATELTIDE — CI — v4.2.0]]
- [[Esquema ensayos — septiembre 2026]] (stato)
