---
tipo: ensayo
estudio: PROMISE20 RELOADED
alias: [PROMISE 20 RELOADED, PROMISE20R, "PROMISE (EnsApp)", BraiN20]
estado_app: pausado   # aggiornato 2026-10-19
clave_app: "PROMISE"
categoria: dispositivo
fase: "Cohort interventional study; indagine pre-market pivotal con dispositivo medico (MDR)"
promotor: "Time is Brain, S.L."
registro: ["CIV-ES-25-05-052994"]
protocolo_vigente: "CIP Rev 1, 11-04-2025"
ci_vigente: "HIP+CI Rev 3, 10-07-2025 (Vall d'Hebron)"
drive_carpeta: "https://drive.google.com/drive/folders/1WRFzOKfXhEsHNbQuUBV3HNHLQx3al40P"
fuentes: ["[[PROMISE20 RELOADED — Protocolo — Rev 1]]", "[[PROMISE20 RELOADED — Sinopsis — v1]]", "[[PROMISE20 RELOADED — CI — v3]]", "[[PROMISE20 RELOADED — Otro — Resumen estudio]]"]
actualizado: 2026-10-19
---
# PROMISE20 RELOADED

> [!summary] In breve
> Studio prospettico multicentrico (3 centri di Barcellona), a braccio singolo, promosso da Time is Brain, S.L. Valida il dispositivo **BraiN20®** aggiornato, che registra in automatico la risposta N20 dei [[Potenciales evocados somatosensoriales|potenziali evocati somatosensoriali]] di entrambi i nervi mediani. Si fa una registrazione prima della puntura arteriosa e una entro 30 min dalla fine della EVT. Popolazione: ictus ischemico con LVO anteriore (ICA intracranica distale o T, M1 o M2, TICI 0–1) trattato con EVT entro 24 h, [[mRS]] pre ≤2, [[NIHSS]] ≥1, qualsiasi [[ASPECTS]]. Nessuna decisione clinica si basa sul dispositivo e il co-arruolamento è ammesso ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 7, p. 20, p. 22).

> [!note] Da non confondere con PROMISE20
> [[PROMISE20]] (NCT06149754) è il primo studio sull'uomo con BraiN20®. È stato fermato nel luglio 2024 dopo un'analisi di futilità sui primi 17 pazienti, per problemi di usabilità ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 6, p. 14). In EnsApp la chiave `PROMISE` (nome visualizzato "PROMISE") corrisponde a **questo** studio, RELOADED.

> [!warning] Stato
> Foglio [[Esquema ensayos — septiembre 2026]]: **"PROMISE 20 RELOADED (EN PAUSA)"** (riletto il 2026-10-19). App: `status: "paused"` (`src/lib/domain/trials-info.ts:88`). `isTrialOpen()` esclude i `paused` (`trials-info.ts:410-413`), quindi lo studio non compare fra gli eleggibili (`src/routes/Summary.svelte:48`, `:53`), nella condivisione (`Share.svelte:38`) né nella selezione manuale (`TrialPatient.svelte:75`). App e foglio coincidono.
> Il cronogramma prevedeva l'ultimo paziente arruolato a marzo 2026 e il report finale a ottobre 2026 ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 9). Non c'è in Drive un documento che spieghi la pausa.

## Disegno
- **Tipo**: prospettico, multicentrico, in aperto, a braccio singolo, interventistico, arruolamento consecutivo, con valutazione in cieco dell'endpoint secondario principale. Indagine clinica pre-market con dispositivo medico (MDR 2017/745, ISO 14155) ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 6–7, p. 14).
- **Centri**: H.U. Vall d'Hebron (CEIm di riferimento), H. Santa Creu i Sant Pau, H. U. Bellvitge ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22).
- **Endpoint primario**: risultato di BraiN20® prima della EVT (N20 presente, assente o non valutabile), concordanza con la lettura di due esperti in cieco (kappa >0,60) ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 21, p. 24).
- **Endpoint secondario principale**: capacità dell'algoritmo di predire il mRS a 90 giorni. Gruppi di esito: mRS 0–2, 0–3, 4–6. Altri secondari: interazione N20 × ricanalizzazione; quota di registrazioni valutabili (≥0,65); N20 per NIHSS (<17/≥17), tempo (<6/≥6 h) e ASPECTS (<5/≥5); scomparsa o comparsa dell'N20 dopo la EVT ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 21, p. 24).
- **Sicurezza**: mortalità a 7 giorni, tollerabilità, deficienze del dispositivo, SAE, tempo di montaggio degli elettrodi, tempo porta-puntura ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22).
- **Numerosità**: 72 pazienti, più i primi 3 pazienti pilota per centro (contano solo per la sicurezza); nessuna analisi ad interim ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 28, p. 30). Il CI dice "un máximo de 74 pacientes evaluables" ([[PROMISE20 RELOADED — CI — v3]], p. 3).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | trattabile entro 24 h dall'ultima volta visto bene; il "treatment point" è la **puntura arteriosa** | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) |
| Età | ≥18 anni | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) |
| mRS pre | ≤2 | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) |
| NIHSS | ≥1, misurato prima della procedura | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) |
| Imaging / ASPECTS / core | qualsiasi core, senza limiti di volume (ASPECTS su TC o RM-DWI solo registrato); perfusione consigliata, non obbligatoria | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22, p. 28) |
| Occlusione | TICI 0–1 di ICA intracranica (distale o T), M1 o M2 "suitable for EVT" su angio-TC o angio-RM, con o senza occlusione o stenosi carotidea cervicale ([[Oclusión en tándem|tandem]] ammesso); escluse le occlusioni in più territori | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22–23) |
| EVT | il paziente deve essere sottoposto a EVT secondo il protocollo locale | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) |

## Criteri di inclusione
Testo originale (§8.2.1, [[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22):

1. AIS with anterior LVO undergoing EVT treatment according to local protocols.
2. Age ≥18
3. No significant pre-stroke functional dependence (mRS ≤ 2)
4. Patient treatable within 24 hours of symptom onset. Symptoms onset is defined as the time the patient was last seen well, and treatment point as the time of arterial puncture.
5. Baseline NIHSS score obtained prior to procedure must be equal or higher than 1 point
6. Occlusion (TICI 0-1) of the intracranial ICA (distal ICA or T occlusions), MCA-M1 segment or M2 suitable for EVT, as evidenced by CTA or MRA with or without concomitant cervical carotid occlusion or stenosis.
7. Any infarct core, without volume restrictions, measured by ASPECT score on non-contrast CT, or DWI-MRI prior to EVT
8. Informed consent obtained from patient or acceptable patient surrogate; or the deferred informed consent, to avoid the delay in the start of the mechanical thrombectomy.
9. Because this trial does not provide benefit and does not interact in treatment decision making during the trial, included patients may also participate in other clinical trials.

**Sintesi**: adulto con mRS pre ≤2 e NIHSS ≥1, LVO anteriore completa (TICI 0–1) di ICA intracranica distale o T, M1 o M2, candidato a EVT, con puntura entro 24 h dall'ultima volta visto bene. Nessun limite di ASPECTS o di core. Il co-arruolamento in altri studi è ammesso.

## Criteri di esclusione
Testo originale (§8.2.2, [[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 23):

*Clinical criteria*
1. Patients with a well-documented history of neuromuscular diseases and other neurodegenerative disorders, prior stroke (TIA not excluded) or nervous system tumors that could interfere with SEP assessment.
2. Serious, advanced, or terminal illness with anticipated life expectancy of less than three months.
3. Patients with a pre-existing neurological or psychiatric disease that would confound the neurological or functional evaluations.
4. Women in the premenopausal period.

*Neuroimaging criteria*
5. CT or MR evidence of hemorrhage (the presence of microbleeds is allowed).
6. Subjects with occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation)
7. Evidence of intracranial tumor (except small meningioma).

*BraiN20® medical device safety issues*
8. Subjects with a demand-type cardiac pacemaker, defibrillator, or other electrical implant or metal.
9. Patients with suspected or well-known cancerous skin lesion in the area where electrical stimulation will be applied.
10. Patients who have a localized disorder in the wrist and forearm where electrical stimulation is to be applied (i.e., fractures or dislocations).

> [!warning] Contraddizione — esclusioni 1 e 4: sinossi contro corpo del protocollo
> Sinossi (inglese e castellana): "… prior stroke (TIA not excluded) or **brain surgery** …" e "**Women of childbearing age without a negative pregnancy test**" ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 8; [[PROMISE20 RELOADED — Sinopsis — v1]], p. 4). La timeline chiede un test di gravidanza nelle WOCBP senza contraccezione altamente efficace (p. 27).
> Corpo del protocollo: "… or **nervous system tumors** …" e "**Women in the premenopausal period.**" ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 23).
> Il riassunto del team segue la sinossi ([[PROMISE20 RELOADED — Otro — Resumen estudio]]). Secondo il corpo sono escluse tutte le donne in premenopausa, anche con test negativo; secondo la sinossi solo quelle senza test negativo.

**Sintesi**: sono esclusi i pazienti con ictus pregresso (non l'AIT), malattie neuromuscolari o neurodegenerative, tumori del sistema nervoso o chirurgia cerebrale (secondo la versione), malattia neurologica o psichiatrica che confonde la valutazione, aspettativa di vita <3 mesi. Esclusi anche emorragia (le microemorragie sono ammesse), tumore intracranico (salvo piccolo meningioma) e occlusioni in più territori. Per la sicurezza del dispositivo: pacemaker, defibrillatore o altri impianti elettrici o metallici, lesioni cutanee neoplastiche o lesioni di polso e avambraccio nella zona di stimolazione. Infine le donne in premenopausa (corpo) o in età fertile senza test negativo (sinossi).

> [!note] Il "≥55 anni" del foglio del team
> Nella riga "Otros" del foglio, colonna di PROMISE 20 RELOADED, c'è: "En mujeres edad ≥55 años. Anestesía en gases afectaría resultados. Registro post-procedimiento no superior a 30 min tras finalizar procedimiento." La colonna è giusta: contando le celle della riga (export del 2026-10-19), il testo sta nella 13ª colonna di studio, quella di PROMISE. Non è uno sfasamento.
> Il numero 55 però **non è riportato in nessun documento** in Drive: protocollo, sinossi, CI e riassunto del team. È verosimilmente una regola pratica del team per applicare l'esclusione 4 ("premenopausal", p. 23), cioè considerare in postmenopausa le donne dai 55 anni. Va confermato con il team o con il promotore.

## Intervento e procedure
- **Dispositivo**: BraiN20® (modello 101.001), tablet portatile con elettrodi di superficie: fascia sullo scalpo e cerotti su entrambi i polsi. Registra i PES di entrambi i nervi mediani (N20 ipsilaterale alla lesione, contralaterale come controllo). Fa una misura ogni 33 s e dà un risultato medio in 3 min: "N20 present", "N20 absent" o "N20 not-assessable". Nessuna formazione specialistica: lo usano medici o infermieri ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 10, p. 27–28).
- **Registrazione basale**: in urgenza o in sala angiografica, **prima della puntura**; nella CRF vanno NIHSS e risultato. Se gli interventisti lo chiedono il sistema si può rimuovere durante la EVT, ma **la fascia non si toglie** ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 28).
- **Registrazione dopo la EVT**: il prima possibile, **entro 30 min**, preferibilmente in sala angiografica. Poi si tolgono gli elettrodi ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 29).
- **Anestesia**: preferita la sedoanalgesia con respiro spontaneo. In anestesia generale si usano propofol e remifentanil (TCI) e nessun miorilassante, salvo il rocuronio all'induzione. "Halogenated anaesthesia as well as benzodiazepines shoud be avoided before and during the endovascular procedure" ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 28–29). È il senso della nota del foglio "anestesia en gases afectaría resultados".
- **Trombolisi**: e.v. (alteplasi o tenecteplase) se indicata, senza ritardi e prima del monitoraggio ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 20, p. 28).
- **Trombectomia**: obbligatoria per l'inclusione, secondo il protocollo locale, con stent retriever, aspirazione o tecnica combinata. La fine della procedura la decidono gli interventisti ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22, p. 28–29).
- **Esami**: glicemia al basale come da pratica clinica; INR nei pazienti in warfarin o acenocumarolo ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 25, p. 29). Nessun esame obbligatorio prima della EVT.

## Visite e follow-up
| Visita | Momento | Contenuto | Fonte |
|---|---|---|---|
| t0 basale | ricovero | criteri (test di gravidanza nelle WOCBP), TC/RM-DWI con ASPECTS, angio-TC/RM, NIHSS, consenso | ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 27) |
| t1 | prima della puntura | prima registrazione BraiN20®, tempo di montaggio, NIHSS, ora della puntura | (p. 27) |
| t2 | fine EVT (entro 30 min) | seconda registrazione, eTICI finale, ora della riperfusione, NIHSS | (p. 26–27, p. 29) |
| t3 | 24 h (±6 h) | NIHSS; TC a 24–36 h (ASPECTS, trasformazione emorragica) | (p. 26–27) |
| t4 | giorno 7 (±24 h) o dimissione | NIHSS, mRS (valutatore locale cieco) | (p. 26–27) |
| t5 | giorno 90 (±7 g) | mRS per telefono o in presenza, valutatore locale cieco | (p. 26–27) |

## Consenso
- **Tipo**: scritto o **orale** del paziente o del surrogato prima dell'uso del dispositivo; **telefonico** del surrogato non presente; **differito** se il familiare non è raggiungibile; testimone se il paziente capisce ma non può firmare; conferma successiva del paziente ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 28, p. 36–37; [[PROMISE20 RELOADED — CI — v3]], p. 2, p. 8–11). Vedi [[Consentimiento diferido]].
- **Lingue**: CI solo in castellano nella cartella.

## Co-arruolamento
- **Ammesso**: "included patients may also participate in other clinical trials" (inclusione 9, [[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22). Studi incompatibili: non riportati nel documento. In pratica contano i vincoli degli altri studi (per esempio sull'anestesia o sui tempi in sala).

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:85-99` (scheda `PROMISE`) e `:410-413` (`isTrialOpen`);
- `src/lib/domain/acute-rules.ts:106-110` (`computeVesselFlags`) e `:173-183` (`promise()`);
- `src/lib/domain/acute-reasons.ts:72-82` (`reasonPromise`);
- per l'interfaccia, `src/routes/PostImaging.svelte:25-27`, `:102` e `src/lib/domain/vessels.ts:11-26`.

Verificato il 2026-10-19.

> [!success] Coincide
> Età ≥18 (`acute-rules.ts:177`), mRS pre ≤2 (`:178`), NIHSS ≥1 (`:179`), finestra ≤24 h (`:176`; vedi però il punto 4), EVT richiesta (`lvo` deriva da "candidato a EVT", `PostImaging.svelte:25-27`), ICA-T, M1 e qualsiasi M2 ammessi (`acute-rules.ts:106-110`), tandem non escluso, nessun limite di ASPECTS (`trials-info.ts:90` "-"), testo dell'imaging (`:92`), trombolisi "Optional." e trombectomia "Yes." (`:93-94`), stato in pausa coerente con il foglio (`:88`).

- [ ] `[FN]` **1. La ICA intracranica non terminale è esclusa.**
> [!warning] Contraddizione
> Protocollo, inclusione 6: "Occlusion (TICI 0-1) of the intracranial ICA (**distal ICA or T occlusions**), MCA-M1 segment or M2" ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22).
> App: `computeVesselFlags().promise` accetta `ica-terminal`, `m1`, `m2-any`, `m2-proxdom` (`acute-rules.ts:106-110`), ma non `ica-intracranial` ("Intracranial ICA (no T)", `vessels.ts:12`). Un'occlusione della ICA intracranica distale non T risulta non eleggibile. L'etichetta del motivo dice "vessel ICA-T / M1 / M2" (`acute-reasons.ts:80`), mentre la scheda scrive "Intracranial ICA (distal/T-ICA)" (`trials-info.ts:92`): il testo è giusto, la regola no.

- [ ] `[FP]` **2. Le occlusioni in più territori non sono escluse.**
> [!warning] Contraddizione
> Protocollo, esclusione 6: "Subjects with occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation)" ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 23).
> App: `vessels.promise` è un OR (`acute-rules.ts:106-110`), e `promise()` non conta i vasi selezionati (`:173-183`). Un paziente con M1 + basilare, o con M1 + P2, risulta eleggibile. L'app ha già il dato: per NiVO conta i vasi con `selectedVesselCount` (`acute-rules.ts:194`). Non distingue però due vasi dello stesso territorio (es. ICA-T + M1) da due territori diversi.

- [ ] `[NC]` **3. Le esclusioni cliniche e di sicurezza del dispositivo non vengono chieste.**
> [!warning] Contraddizione
> Protocollo, esclusioni 1–4 e 7–10: ictus pregresso (non l'AIT), malattie neuromuscolari o neurodegenerative, tumori del sistema nervoso, aspettativa di vita <3 mesi, donne in premenopausa, tumore intracranico, **pacemaker, defibrillatore o altri impianti elettrici o metallici**, lesioni cutanee o di polso e avambraccio ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 23).
> App: `promise()` non ha campi per nessuno di questi criteri (`acute-rules.ts:173-183`), e la scheda ha `notes: []` (`trials-info.ts:97`). L'**ictus pregresso** e il **pacemaker** sono frequenti nella popolazione con LVO: sono le esclusioni che più spesso renderebbero falsa una proposta dell'app. Andrebbero almeno scritte nelle note. L'emorragia (esclusione 5) è già filtrata dal tipo di ictus nell'interfaccia.

- [ ] `[NC]` **4. Finestra: l'app misura il tempo alla valutazione, il protocollo alla puntura.**
> [!warning] Contraddizione
> Protocollo, inclusione 4: "Patient treatable within 24 hours of symptom onset. (…) treatment point as the time of arterial puncture." ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22).
> App: `input.ltsw <= 24` (`acute-rules.ts:176`), dove `ltsw` sono le ore trascorse quando si usa l'app (`src/lib/stores/patient.ts:82-90`). Un paziente valutato a 23 h e 30 min e punto dopo le 24 h risulta eleggibile. La scheda scrive "< 24 h" (`trials-info.ts:90`), la regola "≤ 24": differenza solo di bordo.

- [ ] `[NC]` **5. TICI 0–1 non verificato.**
> Protocollo: occlusione "(TICI 0-1)" su angio-TC o angio-RM ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22). App: basta l'occlusione selezionata; non c'è un campo per l'occlusione completa contro la subocclusione (`acute-rules.ts:173-183`). Vedi [[TICI]].

- [ ] `[TXT]` **6. Intervento descritto in modo sbagliato.**
> [!warning] Contraddizione
> Protocollo: BraiN20® è un dispositivo di **monitoraggio** dei PES N20, prima e dopo la EVT. Non è un dispositivo di trombectomia e non modifica il trattamento ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 7, p. 10, p. 20).
> App: `intervention: "PROMISE thrombectomy device (per protocol)."` (`trials-info.ts:96`) e `category: "EVT device"` (`:89`). Il foglio scrive "Monitorización SEP N20 bilateral mediante BraiN20®: un registro antes de EVT, un registro tras EVT (≤ 30 min en sala)".

- [ ] `[TXT]` **7. Consenso: "Written." contro scritto, orale, telefonico o differito.**
> [!warning] Contraddizione
> Protocollo e CI: consenso scritto o orale, telefonico del surrogato e differito, già accettati dal CEIm di riferimento ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 28, p. 36–37; [[PROMISE20 RELOADED — CI — v3]], p. 2, p. 10–11). Il foglio scrive "Escrito y oral/telefónico/diferido".
> App: `consent: "Written."` (`trials-info.ts:91`). È più restrittivo del protocollo: può far credere che senza firma lo studio non sia praticabile.

- [ ] `[TXT]` **8. Mancano visite e note operative.**
> Protocollo: registrazione basale prima della puntura, seconda **entro 30 min** dalla fine della EVT con la fascia mantenuta in sede, **niente anestesia alogenata né benzodiazepine** (propofol e remifentanil se serve anestesia generale), co-arruolamento ammesso. Visite a 24 h, giorno 7 o dimissione e giorno 90 (telefono o presenza) ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22, p. 26–29).
> App: `notes: []` e `visits: null` (`trials-info.ts:97-98`). Le tre note del foglio (donne ≥55 anni, anestesia con gas, registrazione entro 30 min) non sono riportate nell'app.

> [!note] Non modellati (scelta di progetto, non divergenza)
> L'app non conosce il co-arruolamento: PROMISE20 RELOADED lo ammette esplicitamente (inclusione 9, p. 22), quindi non c'è conflitto con gli altri studi EVT proposti insieme.

## Problemi documentali
- **Protocollo della copia ordinata illeggibile**: il PDF "Rev 1 firmado" è protetto da password di apertura. Il testo è stato letto da un'altra copia, non protetta, della cartella originale ("Protocolo.pdf"): stessa revisione e stesso numero di pagine. Conviene sostituire il file nella copia ordinata (vedi [[PROMISE20 RELOADED — Protocolo — Rev 1]]).
- **Sinossi e corpo divergono** sulle esclusioni 1 e 4 (vedi il riquadro sopra).
- **CI con testo ereditato da PROMISE20**: "cualquier tipo de ictus", "sospecha de ictus", "máximo de 74 pacientes evaluables"; seconda registrazione solo "en algunos pacientes" ([[PROMISE20 RELOADED — CI — v3]], p. 2–3).
- **Versione del CI**: l'allegato del protocollo cita "HIP+CI v4.0" (p. 44); in Drive c'è la v3.
- **Protocollo incompleto in alcune parti**: manca la sezione 12, la 6.5 è vuota, "June 202" nel cronogramma (p. 9, p. 20, p. 33).
- **Registro**: nessun NCT per RELOADED nei documenti; c'è solo il CIV del CI.
- **"≥55 anni"**: presente solo nel foglio del team, non nei documenti (vedi sopra).
- **Pausa**: lo stato "en pausa" viene dal foglio; nessun documento in Drive la motiva.

## Fonti
- [[PROMISE20 RELOADED — Protocolo — Rev 1]]
- [[PROMISE20 RELOADED — Sinopsis — v1]]
- [[PROMISE20 RELOADED — CI — v3]]
- [[PROMISE20 RELOADED — Otro — Resumen estudio]] (cartella originale, solo verifica)
- [[Esquema ensayos — septiembre 2026]] (stato)
