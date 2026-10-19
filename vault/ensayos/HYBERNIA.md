---
tipo: ensayo
estudio: HYBERNIA
alias: [HM-001, "Hybernia Delta H", "ΔH Brain Cooling System", "Hybernia Medical"]
estado_app: pausado
clave_app: "HYBERNIA"
categoria: dispositivo
fase: "first-in-human (indagine clinica con dispositivo medico, MDR)"
promotor: "Hybernia Medical, LLC (rappresentante legale e CRO in Spagna: Evidenze Health España S.L.U.)"
registro: ["NCT06634303"]
protocolo_vigente: "CIP HM-001 V1.1, 17-03-2025"
ci_vigente: "HIP-CI HM-001 v1.2, 31-03-2025"
drive_carpeta: "https://drive.google.com/drive/folders/1xl6CkofWWwVtaBlHh_OnpixhCUGwHF9J"
fuentes: ["[[HYBERNIA — Protocolo — V1.1]]", "[[HYBERNIA — Sinopsis — v1.1]]", "[[HYBERNIA — CI — v1.2]]"]
actualizado: 2026-10-19
---
# HYBERNIA

> [!summary] In breve
> Studio **first-in-human**, monocentrico (Vall d'Hebron), a braccio singolo, su un massimo di 10 pazienti, promosso da Hybernia Medical. Valuta sicurezza e performance del sistema **Delta H (ΔH)**: subito dopo una trombectomia con riperfusione mTICI 2a–3, un catetere nella ICA ipsilaterale infonde per circa 30 min soluzione fisiologica fredda, con un'ipotermia cerebrale selettiva come [[Neuroprotección|neuroprotezione]] aggiuntiva. Popolazione: 18–89 anni, [[mRS]] pre 0–1, [[NIHSS]] ≥6, [[ASPECTS]] 5–10, occlusione di ICA intracranica, M1 o M2, puntura arteriosa entro 24 h dal LKW ([[HYBERNIA — Protocolo — V1.1]], p. 8, p. 15–16, p. 20–21). Non c'è gruppo di controllo.

> [!info] Stato: foglio del team, app e documenti
> - **Foglio "Esquema ensayos"**: "HYBERNIA (EN PAUSA)". Il file su Drive è stato modificato il **2026-10-19** (la nota [[Esquema ensayos — septiembre 2026]] riporta il 2026-10-09); per HYBERNIA lo stato resta "en pausa".
> - **App**: `status: "paused"` (`src/lib/domain/trials-info.ts:129`). Dal 2026-10-19 `isTrialOpen()` esclude anche i `paused` (`trials-info.ts:410-413`), quindi HYBERNIA non compare fra gli eleggibili (`src/routes/Summary.svelte:48`), né in Share (`Share.svelte:38`) né in TrialPatient (`TrialPatient.svelte:75`). Coincide con il foglio.
> - **Contesto del team** (non verificabile nei documenti in Drive): cartella originale in ENSAYOS INACTIVOS, parere favorevole di maggio 2026, cartelle Screening e Procedure vuote. Il CI v1.2 (marzo 2025) si dichiara già approvato da CEIm e AEMPS ([[HYBERNIA — CI — v1.2]], p. 1). Il protocollo prevede 6 mesi di studio e il first-in-human nel 2025 ([[HYBERNIA — Protocolo — V1.1]], p. 8, p. 44). Nessun documento spiega la pausa.

## Disegno
- **Tipo**: prospettico, first-in-human, nazionale, monocentrico, a braccio singolo; nessuna randomizzazione né cieco ([[HYBERNIA — Protocolo — V1.1]], p. 8, p. 15).
- **Obiettivo primario**: performance tecnica e clinica del sistema ΔH nei pazienti sottoposti a rivascolarizzazione endovascolare per ictus ischemico acuto. Secondari: sicurezza, usabilità, uso di risorse ([[HYBERNIA — Protocolo — V1.1]], p. 8, p. 15).
- **Numerosità**: fino a 10 soggetti; studio di circa 6 mesi; follow-up di 90 giorni ([[HYBERNIA — Protocolo — V1.1]], p. 8, p. 21).
- **Endpoint tecnici**: raffreddamento di 30 min, Delta target raggiunto entro 5 min e mantenuto ±1 °C, rispetto dei range di sicurezza, allarmi, mTICI e tempo di riperfusione, volume dell'infarto a 3–10 giorni, mRS alla dimissione, 30 e 90 giorni ([[HYBERNIA — Protocolo — V1.1]], p. 9, p. 16–17).
- **Endpoint di sicurezza**: emorragia intracranica radiologica a 3–10 giorni o alla dimissione, sICH, vasospasmo, SADE, riammissioni per ictus e mortalità a 90 giorni ([[HYBERNIA — Protocolo — V1.1]], p. 9–10, p. 17).
- **Regola di arresto**: piano bayesiano sulla mortalità intraospedaliera (attesa 30%); revisione dal 3° paziente con 3 morti su 3–4, 4 su 5–7, 5 su 8, 6 su 9 ([[HYBERNIA — Protocolo — V1.1]], p. 40). Medical monitor indipendente e DSMB ([[HYBERNIA — Protocolo — V1.1]], p. 34).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Puntura arteriosa per la trombectomia **entro 24 h dal LKW**; trattamento sperimentale avviato entro **150 min dall'imaging pre-trattamento** (esclusione 9) | ([[HYBERNIA — Protocolo — V1.1]], p. 21) |
| Età | 18–89 anni | ([[HYBERNIA — Protocolo — V1.1]], p. 20) |
| mRS pre | 0–1 | ([[HYBERNIA — Protocolo — V1.1]], p. 20) |
| NIHSS | ≥6; esclusi coma o coscienza ridotta prima della MT (**NIHSS 1a >1**) | ([[HYBERNIA — Protocolo — V1.1]], p. 20) |
| Imaging / ASPECTS / core | ASPECTS 5–10 su TC senza contrasto o RM; perfusione facoltativa secondo la pratica del centro; nessun criterio di core | ([[HYBERNIA — Protocolo — V1.1]], p. 20, p. 24) |
| Occlusione | Occlusione target su **angiografia con catetere pre-MT** di ICA intracranica, M1 o M2 (circolazione anteriore) | ([[HYBERNIA — Protocolo — V1.1]], p. 20–21) |
| Riperfusione | **mTICI 2a–3** all'angiografia di fine MT: l'eleggibilità si conferma dopo la trombectomia | ([[HYBERNIA — Protocolo — V1.1]], p. 16, p. 21, p. 23) |
| Laboratorio | Ematocrito ≥33% (esclusione <33%); peso ≥40 kg; no dialisi | ([[HYBERNIA — Protocolo — V1.1]], p. 20–21) |

## Criteri di inclusione
Testo originale (Tabella 1, §5, [[HYBERNIA — Protocolo — V1.1]], p. 20–21; identico nella sinossi, p. 8):

1. Age 18 to 89 (p. 20)
2. Informed signed consent obtained from patient or legally authorized representative (p. 20)
3. Clinical symptoms consistent with AIS (p. 20)
4. Pre-stroke modified Rankin Scale (mRS) score 0-1 (p. 20)
5. National Institute of Health Stroke Scale (NIHSS) ≥ 6 (p. 20)
6. Alberta Stroke Program Early CT Score (ASPECTS) score 5-10 (p. 20)
7. IV tissue plasminogen activator (tPA) or Tenecteplase (TNK) may be administered within 4.5h of last known well (LKW), if patient eligible (p. 20)
8. Mechanical thrombectomy (MT) treatment performed with arterial puncture within 24h of LKW. (p. 21)
9. Pre-MT catheter angiogram shows target occlusion in intracranial ICA, M1 MCA, or M2 MCA (p. 21)
10. End of MT catheter angiogram shows achievement of moderate-to-complete reperfusion (modified Treatment in Cerebral Ischemia score or mTICI 2a-3) (p. 21)

**Sintesi**: adulto fino a 89 anni, autonomo prima dell'ictus (mRS 0–1), NIHSS ≥6, ASPECTS 5–10, occlusione di ICA intracranica, M1 o M2 sull'angiografia, trombectomia con puntura entro 24 h dal LKW e riperfusione almeno mTICI 2a alla fine. La trombolisi e.v. entro 4,5 h è ammessa se indicata. Nella sinossi in castellano il criterio 10 dice "mTICI de 2 a 3" ([[HYBERNIA — Sinopsis — v1.1]], p. 2).

## Criteri di esclusione
Testo originale (Tabella 1, §5, [[HYBERNIA — Protocolo — V1.1]], p. 20–21):

1. Pre-MT CT or MRI shows acute intracranial hemorrhage. (p. 20)
2. Previous intracranial hemorrhage, AVM, neoplasm (except small meningioma), or vascular stent-implant (p. 20)
3. Coma or reduced level of consciousness prior to MT (NIHSS 1A>1) (p. 20)
4. Seizure between LKW and time of potential enrollment (p. 20)
5. Severe contrast allergy or absolute contraindication to iodinated contrast. (p. 20)
6. Hypersensitivity to cold, i.e., history of cold-sensitive antibodies, Raynaud syndrome, or hepatitis C (p. 20)
7. Hematocrit <33% (p. 20) ("Baseline Hematocrit <33%" nella sinossi, p. 9)
8. Severe known renal impairment, i.e., requires renal replacement therapy (dialysis). (p. 21)
9. Post-reperfusion investigational therapy cannot be started within 150 min following pre-treatment CT or MR imaging (p. 21)
10. Presumed septic embolism, suspicion of bacterial endocarditis. (p. 21)
11. Known pregnancy (in women with child-bearing potential) (p. 21)
12. Body weight < 40kg (p. 21)
13. Patient not willing and able to participate in follow-up visits to day 90. (p. 21)
14. Life expectancy <6 months due to pre-existing conditions such as severe heart or renal failure, cancer, etc. (p. 21)
15. Currently or within past 30 days participating in another investigational treatment study (p. 21)

**Sintesi**: oltre a emorragia acuta e controindicazioni al contrasto, sono esclusi:
- precedenti di emorragia intracranica, MAV, neoplasia (salvo piccolo meningioma) o stent vascolare;
- coma o coscienza ridotta (NIHSS 1a >1) e crisi dopo il LKW;
- ipersensibilità al freddo (crioagglutinine, Raynaud, epatite C);
- ematocrito <33%, dialisi, peso <40 kg, gravidanza nota;
- sospetta embolia settica o endocardite;
- aspettativa di vita <6 mesi, impossibilità di fare il follow-up a 90 giorni;
- partecipazione **attuale o negli ultimi 30 giorni** a un altro studio con trattamento sperimentale;
- impossibilità di iniziare il raffreddamento entro 150 min dalla TC o RM pre-trattamento.

## Intervento e procedure
- **Dispositivo**: Hybernia Delta H (ΔH) Brain Cooling System. Contenitore isolato con 2 sacche da 1 L di salina refrigerata (1–4 °C) e cold pack, modulo pompa-controller, set monouso con cassetta e catetere intra-arterioso con termocoppie ([[HYBERNIA — Protocolo — V1.1]], p. 18, p. 25).
- **Sequenza**: trombectomia standard con stent retriever e/o aspirazione (trombolitici IA solo come aggiunta) ([[HYBERNIA — Protocolo — V1.1]], p. 20). Dopo l'angiografia di controllo, il catetere ΔH sostituisce il catetere da trombectomia nel guida già in sede e si porta nella **ICA ipsilaterale** ([[HYBERNIA — Protocolo — V1.1]], p. 25–26).
- **Parametri da inserire nel controller**: **ematocrito basale, peso, temperatura corporea** e calo di temperatura target (TTD; per esempio −3 o −4 °C) ([[HYBERNIA — Protocolo — V1.1]], p. 14, p. 25).
- **Raffreddamento**: automatico, circa 30 min, <1.800 mL di salina fredda (massimo assoluto 1,8 L); TTD ±1 °C; temperatura sistemica monitorata in modo non invasivo, coperta termica ammessa ([[HYBERNIA — Protocolo — V1.1]], p. 26, p. 37). Permanenza in sala più lunga di circa 30–45 min ([[HYBERNIA — Protocolo — V1.1]], p. 36).
- **Durante il raffreddamento**: vitali continui, temperatura ogni 10 min, elettroliti, Hb/Hct, INR/aPTT a inizio e fine; mTICI post-raffreddamento; NIHSS 1–2 h dopo la fine dell'ERT ([[HYBERNIA — Protocolo — V1.1]], p. 23, p. 26–27).
- **Trombolisi**: ammessa (tPA o TNK e.v. entro 4,5 h dal LKW, se eleggibile); trombectomia diretta se controindicata o non indicata ([[HYBERNIA — Protocolo — V1.1]], p. 20). Vedi [[Alteplasa]], [[Tenecteplasa]].
- **Trombectomia**: obbligatoria ("Thrombectomy Rx (mandatory)") ([[HYBERNIA — Protocolo — V1.1]], p. 22).
- **Esami allo screening**: emocromo con Hb/Hct, BMP (Na, K, Cl, CO2, BUN, creatinina, glicemia, calcio), INR/aPTT, test di gravidanza, ECG, Rx torace, peso ([[HYBERNIA — Protocolo — V1.1]], p. 22, p. 24). L'emogasanalisi non è citata.

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Screening e trattamento | Giorno 0 | criteri, consenso, esami, NIHSS, mRS, Barthel, imaging, angiografia pre e post, raffreddamento | ([[HYBERNIA — Protocolo — V1.1]], p. 22–27) |
| Giorno 1 | 24 h (±4 h) | NIHSS, TC (dual energy preferita) o RM, angio-TC/RM se standard, ECG, esami | ([[HYBERNIA — Protocolo — V1.1]], p. 22, p. 27) |
| Giorno 2 | 48 h (±4 h) | vitali, temperatura, NIHSS | ([[HYBERNIA — Protocolo — V1.1]], p. 27) |
| Giorno 3–10 o dimissione | il primo dei due | NIHSS, mRS, Barthel, TC o RM (DWI preferita) per volume finale | ([[HYBERNIA — Protocolo — V1.1]], p. 22, p. 27–28) |
| Giorno 30 | ±5 giorni | mRS, Barthel; televideo, telefono o presenza | ([[HYBERNIA — Protocolo — V1.1]], p. 28) |
| Giorno 90 | ±7 giorni | mRS, Barthel, riammissioni; presenza o tele-visita | ([[HYBERNIA — Protocolo — V1.1]], p. 28) |

## Consenso
- **Tipo**: consenso informato **scritto**, del paziente o del rappresentante legale, prima dell'inclusione, cioè dopo la trombectomia; può servire un consenso separato per la procedura prima della trombectomia ([[HYBERNIA — Protocolo — V1.1]], p. 16, p. 23).
- **Capacità ridotta**: si arruola solo con il consenso scritto del rappresentante; l'eventuale assenso orale del paziente si documenta, ma non sostituisce la firma del rappresentante. Paziente capace che non sa leggere o scrivere: consenso davanti a testimoni ([[HYBERNIA — Protocolo — V1.1]], p. 23–24).
- **CI v1.2**: firma del paziente oppure del "representante legal, familiar o persona vinculada de hecho" ([[HYBERNIA — CI — v1.2]], p. 9).
- **Orale, telefonico o differito**: non previsti né nel protocollo né nel CI.
- **Lingue**: in Drive solo il CI in castellano; catalano non presente.

## Co-arruolamento
- Escluso chi partecipa **ora o ha partecipato negli ultimi 30 giorni** a un altro studio con trattamento sperimentale ("another investigational treatment study") ([[HYBERNIA — Protocolo — V1.1]], p. 21). La formula comprende anche gli studi con dispositivo. In pratica HYBERNIA non è compatibile con gli altri studi acuti in fase iperacuta.
- Compatibilità con studi specifici: non riportata nel documento.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:128-140` (scheda) e `:410-413` (`isTrialOpen`);
- `src/lib/domain/acute-rules.ts:100-105` (`computeVesselFlags`) e `:239-252` (`hybernia()`);
- `src/lib/domain/acute-reasons.ts:134-145`;
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/lib/stores/patient.ts`.

Verificato il 2026-10-19.

> [!success] Coincide
> - Stato `paused` (`trials-info.ts:129`) come nel foglio; lo studio non viene proposto (`trials-info.ts:410-413`; `Summary.svelte:48`).
> - Età 18–89 (`acute-rules.ts:243-244`), mRS pre ≤1 (`:245`), NIHSS ≥6 (`:246`), ASPECTS 5–10 (`aspects > 4`, `:249-250`; testo `trials-info.ts:131`).
> - Trombectomia obbligatoria: serve `lvo === "yes"`, cioè "Candidato a trombectomia (EVT)? → Elegible" (`acute-rules.ts:247`; `PostImaging.svelte:27`); testo "Thrombectomy: Yes." (`trials-info.ts:135`).
> - Vasi: ICA intracranica, ICA-T, M1, qualsiasi M2 (`acute-rules.ts:100-105`; `acute-reasons.ts:142`; testo `trials-info.ts:133`), come "intracranial ICA, M1 MCA, or M2 MCA" (p. 21).
> - Trombolisi "Optional." (`trials-info.ts:134`).
> - Finestra "< 24 h" (`acute-rules.ts:242`), compatibile con la puntura entro 24 h dal LKW (vedi però il punto 3).
> - Le motivazioni (`acute-reasons.ts:134-145`) usano gli stessi criteri della regola.

- [ ] **[NC] 1. L'eleggibilità si decide dopo la trombectomia: l'app non chiede la riperfusione.**
> [!warning] Contraddizione
> Protocollo: inclusione 10 "End of MT catheter angiogram shows achievement of moderate-to-complete reperfusion (… mTICI 2a-3)" (p. 21); "After endovascular revascularization with a moderate-to-complete reperfusion, AIS subjects' eligibility will be evaluated and written informed consent obtained prior inclusion" (p. 16); "Eligibility: X (post IA Rx)" (p. 23) ([[HYBERNIA — Protocolo — V1.1]]). Anche l'occlusione si conferma sull'angiografia con catetere pre-MT (inclusione 9, p. 21).
> App: `hybernia()` valuta il paziente prima dell'EVT, con i vasi dell'angio-TC (`acute-rules.ts:239-252`); `notes: []` (`trials-info.ts:138`) non avvisa che l'inclusione e il consenso vengono dopo la riperfusione. Un paziente proposto con TICI finale 0–1 non è eleggibile. È coerente con il ruolo di pre-screening dell'app, ma va detto nella scheda.

- [ ] **[NC] 2. Raffreddamento entro 150 min dall'imaging pre-trattamento (esclusione 9) non verificato.**
> [!warning] Contraddizione
> Protocollo: "Post-reperfusion investigational therapy cannot be started within 150 min following pre-treatment CT or MR imaging" (esclusione 9, [[HYBERNIA — Protocolo — V1.1]], p. 21).
> App: nessun tempo dall'imaging; conta solo `ltsw < 24` (`acute-rules.ts:242`). Nei trasferimenti con imaging fatto nel centro inviante, o con procedure lunghe, il paziente può risultare eleggibile ma uscire dal limite. Il criterio non compare neppure nel testo (`trials-info.ts:128-140`).

- [ ] **[NC] 3. Finestra: puntura entro 24 h dal LKW, misurata dall'app al momento della valutazione.**
> [!warning] Contraddizione
> Protocollo: "Mechanical thrombectomy (MT) treatment performed with arterial puncture within 24h of LKW" (inclusione 8, [[HYBERNIA — Protocolo — V1.1]], p. 21).
> App: `input.ltsw < 24` (`acute-rules.ts:242`; `acute-reasons.ts:137` "LTSW < 24h"), con `ltsw` = ore trascorse quando si usa l'app (`stores/patient.ts:82-90`). Valutato a 23 h e mezza, il paziente risulta eleggibile anche se la puntura avverrà dopo le 24 h. Differenza di bordo.

- [ ] **[NC] 4. Coscienza ridotta (NIHSS 1a >1) non verificata.**
> [!warning] Contraddizione
> Protocollo, esclusione 3: "Coma or reduced level of consciousness prior to MT (NIHSS 1A>1)" ([[HYBERNIA — Protocolo — V1.1]], p. 20).
> App: chiede solo il NIHSS totale (`acute-rules.ts:246`, `nihss >= 6`). Un paziente con NIHSS ≥6 e item 1a ≥2, frequente nelle occlusioni prossimali gravi, risulta eleggibile.

- [ ] **[NC] 5. Ematocrito <33% (esclusione 7): solo nel testo.**
> [!warning] Contraddizione
> Protocollo: "Hematocrit <33%" (p. 20), "Baseline Hematocrit <33%" (p. 9); l'ematocrito basale è anche un parametro da inserire nel controller (p. 25) ([[HYBERNIA — Protocolo — V1.1]]).
> App: `preEvtLabs: "Yes - blood gas incl. hematocrit."` (`trials-info.ts:136`), come il foglio ("gasometría con Hto"), ma la regola non usa l'ematocrito. Il protocollo chiede emocromo con Hb/Hct, BMP e INR/aPTT allo screening e non cita l'emogasanalisi (p. 24): l'emogas con Hct è una scelta locale per avere il valore subito.

- [ ] **[NC] 6. Co-arruolamento: l'app permette di selezionare HYBERNIA insieme ad altri studi.**
> [!warning] Contraddizione
> Protocollo, esclusione 15: "Currently or within past 30 days participating in another investigational treatment study" ([[HYBERNIA — Protocolo — V1.1]], p. 21).
> App: nel riepilogo si possono selezionare più studi insieme (`Summary.svelte:56-58`), senza avviso di incompatibilità né domanda su studi negli ultimi 30 giorni. Oggi l'effetto è nullo perché lo studio è in pausa.

- [ ] **[TXT] 7. Consenso: "Written & oral/phone" non ha base nei documenti.**
> [!warning] Contraddizione
> Protocollo: consenso scritto del paziente o del rappresentante; l'assenso orale del paziente non sostituisce la firma scritta del rappresentante (p. 23–24). CI: solo firme ([[HYBERNIA — CI — v1.2]], p. 9). Foglio del team: "Escrito".
> App: `consent: "Written & oral/phone consent."` (`trials-info.ts:132`). Differisce anche dal foglio.

- [ ] **[TXT] 8. Visite: mancano 48 h e giorno 30; G90 non solo telefonica.**
> [!warning] Contraddizione
> Protocollo: G1 (24 ±4 h), G2 (48 ±4 h), G3–10 o dimissione, G30 (±5 giorni; video, telefono o presenza), G90 (±7 giorni; presenza o tele-visita) ([[HYBERNIA — Protocolo — V1.1]], p. 22, p. 27–28). Il foglio, nell'export, riporta "Visita 24h, Visita 48h, Visita 3-10 días/alta, Visita 30 días (telefónica), Visita 90 días (telefónica)".
> App: `["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"]` (`trials-info.ts:139`).

- [ ] **[TXT] 9. Intervento: non solo stent retriever.**
> [!warning] Contraddizione
> Protocollo: "Endovascular treatment procedures will employ commercially available stent retrievers and/or aspiration devices. Adjunct use of IA thrombolytics is possible…" (p. 20); il dispositivo è un raffreddamento cerebrale selettivo con salina fredda intracarotidea per circa 30 min (p. 25–26) ([[HYBERNIA — Protocolo — V1.1]]).
> App: `intervention: "Stent retriever + Hybernia Delta H Brain Cooling System."` (`trials-info.ts:137`). Il foglio ha la cella dell'intervento illeggibile ("º").

> [!note] Non modellati (scelta di progetto, non divergenza)
> La regola non controlla le altre esclusioni: precedenti di emorragia, MAV, neoplasia o stent vascolare; crisi dopo il LKW; allergia grave al contrasto; ipersensibilità al freddo (crioagglutinine, Raynaud, epatite C); dialisi; sospetta embolia settica o endocardite; gravidanza; peso <40 kg; aspettativa di vita <6 mesi; follow-up a 90 giorni non garantito ([[HYBERNIA — Protocolo — V1.1]], p. 20–21). L'emorragia acuta è filtrata dal tipo di ictus nell'interfaccia. La condizione sui vasi è un OR (`acute-rules.ts:100-105`): una combinazione con occlusioni posteriori passerebbe, mentre il §5 parla di circolazione anteriore (p. 20); caso raro.

## Problemi documentali
- **Stato e date**: cartella originale in ENSAYOS INACTIVOS con parere favorevole di maggio 2026 (contesto del team), mentre il CI di marzo 2025 si dichiara già approvato da CEIm e AEMPS (p. 1) e il protocollo prevede 6 mesi di studio a partire dal 2025 (p. 8, p. 44). Non c'è un protocollo successivo alla V1.1 né documenti sulla pausa. Le cartelle Screening e Procedure sono vuote.
- **Appendici mancanti**: CV del PI, CRF, scale mRS, NIHSS, Barthel, mTICI, ASPECTS "attached as a separate document" (pp. 48–55), non presenti in Drive. Mancano anche l'IFU e l'Investigator's Brochure.
- **Figure**: la Figura 1 (workflow, p. 16) è un'immagine con testo illeggibile.
- **sICH definita come "NIHSS reduction of ≥4 points or death"** (p. 10, p. 17): probabile refuso per aumento.
- **"Groin cuff"**: annunciato nella revision history (p. 3) come aggiunto al CI, assente nel CI v1.2 ([[HYBERNIA — CI — v1.2]]).
- **Trombectomia** "mandatory" nel protocollo (p. 22), "a criterio del equipo médico" nel calendario del CI (p. 13).
- **Sinossi in castellano**: "mTICI de 2 a 3" al posto di "2a-3"; piè di pagina "V1" ([[HYBERNIA — Sinopsis — v1.1]], p. 2).
- **Altri refusi del protocollo**: approvazione FDA delle deviazioni (p. 4), CEC citato ma non definito (p. 34), follow-up "90 days±5 days" (p. 17) contro ±7 (p. 28).
- **Foglio del team**: la cella dell'intervento di HYBERNIA è illeggibile nell'export ("º"). Il foglio è stato modificato il 2026-10-19 (la nota di riferimento dice 2026-10-09).

## Fonti
- [[HYBERNIA — Protocolo — V1.1]]
- [[HYBERNIA — Sinopsis — v1.1]]
- [[HYBERNIA — CI — v1.2]]
- [[Esquema ensayos — septiembre 2026]] (stato)
