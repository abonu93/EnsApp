---
tipo: ensayo
estudio: TWIN2WIN-2
alias: ["TWIN-2-WIN 2", "Twin2Win2", "TWIN2WIN 2", "Twin2Win fase 2"]
estado_app: activo
clave_app: "Twin2Win2"
categoria: dispositivo
fase: "non riportata nel documento (studio accademico di tecnica endovascolare)"
promotor: "non indicato esplicitamente; Vall d'Hebron Institut de Recerca (VHIR) nel piè di pagina"
registro: []
protocolo_vigente: "Versión (02), 13-08-2024"
ci_vigente: "V.03, 01-10-2024"
drive_carpeta: "https://drive.google.com/drive/folders/1oRZGeexi_tGoyBT9rBpXkr4iYbBxyDCI"
fuentes: ["[[TWIN2WIN-2 — Protocolo — V2]]", "[[TWIN2WIN-2 — CI — V3]]"]
actualizado: 2026-10-20
---
# TWIN2WIN-2

> [!summary] In breve
> Studio accademico del Vall d'Hebron: randomizzato, multicentrico (5–10 centri), in aperto con endpoint in cieco. Confronta la trombectomia primaria con **doppio [[Stent retriever|stent retriever]]** (DS-EVT) e quella con stent singolo (SS-EVT) come primo tentativo. Popolazione: occlusione TICI 0–1 di ICA terminale, M1 distale o basilare **confermata in angiografia**, [[NIHSS]] ≥6, [[mRS]] pre 0–2, trattabile entro 24 h dall'ultima volta visto bene. Endpoint primario: mRS 0–1 o ritorno al mRS basale a 90 giorni ([[TWIN2WIN-2 — Protocolo — V2]], p. 2–5).

> [!warning] Da non confondere con TWIN2WIN
> TWIN2WIN-2 è la "segunda fase" di **TWIN2WIN** (studio chiuso, cartella CERRADOS), che aveva come endpoint la ricanalizzazione completa al primo passaggio ([[TWIN2WIN-2 — Protocolo — V2]], p. 1–2). Il modello di consenso del CI V3 porta ancora il titolo del primo studio ("TWIN2WIN …", [[TWIN2WIN-2 — CI — V3]], p. 5). Anche il foglio dei pazienti dell'app scrive la colonna "TWIN2WIN" (`src/lib/domain/sheet-payload.ts:17`, `:46`).

> [!info] Stato
> Foglio [[Esquema ensayos — septiembre 2026]] (ricontrollato il 2026-10-19; file modificato su Drive il 2026-10-19 alle 08:19): **TWIN-2-WIN 2 aperto**. App: `status: "active"` (`src/lib/domain/trials-info.ts:101`). Coerenti. Ma vedi la divergenza tecnica sul nome (punto 6): oggi non ha effetti, li avrebbe se lo studio venisse chiuso o messo in pausa.

## Disegno
- **Tipo**: "Ensayo prospectivo, multicéntrico, aleatorizado, controlado, abierto y ciego"; DS-EVT primaria contro SS-EVT primaria come primo tentativo di trombectomia ([[TWIN2WIN-2 — Protocolo — V2]], p. 2). Trattamento in aperto, objetivo primario valutato in cieco da un investigatore indipendente (p. 7).
- **Randomizzazione**: 1:1, web in tempo reale con Study Randomizer, stratificata per sede dell'occlusione (ICA terminale, M1 distale, basilare); si inseriscono solo sede e centro (p. 2, p. 6–8).
- **Momento**: dopo la neuroimmagine di riferimento si chiede il consenso; si include e randomizza una volta confermata la sede dell'occlusione, cioè **in angiografia** (p. 2, p. 4–5).
- **Numerosità**: 402 pazienti (201 per braccio); interim dopo il G90 dei primi 201 (Pocock) (p. 4, p. 6). DSMB indipendente ogni 25 pazienti (p. 3).
- **Endpoint primario**: mRS 0–1 a 90 giorni **o** ritorno al mRS pre-ictus, in ITT (p. 2–3, p. 8).
- **Sicurezza primaria**: sICH + altri eventi avversi gravi legati alla procedura entro 24 h (−8/+12) (p. 2).
- **Secondari**: ricanalizzazione completa al primo passaggio (TICI 2c–3, vedi [[First pass effect]]) e nei primi 3; mTICI ≥2b entro 3 passaggi e finale; tempo puntura–riperfusione; NIHSS a 24 h, G5/dimissione e G90; mRS a G5/dimissione, mRS ordinale e 0–2 a G90; qualunque emorragia a 24 h; deterioramento NIHSS ≥4; embolie in territorio nuovo; perforazione o dissezione; mortalità (p. 3–4, p. 8).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | "Tratable lo antes posible y al menos dentro de las 24 horas" dall'ultima volta visto bene | ([[TWIN2WIN-2 — Protocolo — V2]], p. 5) |
| Età | ≥18, nessun limite superiore | ([[TWIN2WIN-2 — Protocolo — V2]], p. 4) |
| mRS pre | 0–2 (testo: "de 0 o 2"; esclusione mRS >2) | ([[TWIN2WIN-2 — Protocolo — V2]], p. 4–5) |
| NIHSS | ≥6 prima della procedura, con deficit focale incapacitante | ([[TWIN2WIN-2 — Protocolo — V2]], p. 4) |
| Imaging / ASPECTS / core | Esclusione con [[ASPECTS]] <6 in TC o <5 in DWI; emorragia esclusa (microsanguinamenti ammessi); effetto massa con shift escluso. Perfusione non richiesta | ([[TWIN2WIN-2 — Protocolo — V2]], p. 5–6) |
| Occlusione | Flusso [[TICI]] 0–1 di ICA terminale, M1 distale o basilare, **confermata in angiografia convenzionale**. Esclusi territori multipli, dissezione carotidea o stenosi di alto grado che impediscono l'accesso, aterosclerosi intracranica responsabile | ([[TWIN2WIN-2 — Protocolo — V2]], p. 4–6) |

## Criteri di inclusione
Testo originale ([[TWIN2WIN-2 — Protocolo — V2]], p. 4–5):

*Clínica*
1. Edad ≥18 (p. 4)
2. Consentimiento informado obtenido del paciente o de un sustituto aceptable del paciente (es decir, el pariente más cercano o el representante legal). (p. 4)
3. Un nuevo déficit neurológico focal incapacitante compatible con una isquemia cerebral aguda. (p. 4)
4. NIHSS basal obtenido antes del procedimiento ≥ 6 puntos. (p. 4)
5. Puntuación mRS preictal de 0 o 2. (p. 4)
6. Tratable lo antes posible y al menos dentro de las 24 horas siguientes al inicio de los síntomas, definido como el momento en que el paciente fue visto bien por última vez (en la línea de base). (p. 5)
7. Los pacientes para los que está indicada la t-PA IV y que están disponibles para el tratamiento, son tratados con t-PA IV. Para aquellos pacientes para los que está indicado el t-PA IV y que están disponibles para el tratamiento, el t-PA IV debe ser administrado como recomiendan las Guías de la AHA/ASA para el manejo temprano de pacientes con Accidente Cerebrovascular Isquémico Agudo (AIS). (p. 5)

*Neuroimagen*
1. Oclusión (flujo TICI 0 o TICI 1), de la arteria carótida interna terminal, segmentos o M1 distal de la arteria cerebral media o basilar, apta para trombectomía mecánica, confirmada en la angiografía convencional. (p. 5)
2. NRI participantes habrán cumplido una formación sobre el correcto uso de DS-EVT (p. 5)

**Sintesi**: adulto (≥18) con mRS pre 0–2, deficit focale incapacitante e NIHSS ≥6, trattabile entro 24 h dall'ultima volta visto bene. L'occlusione (TICI 0–1) deve essere di ICA terminale, M1 distale o basilare e va confermata in angiografia. La trombolisi indicata si fa secondo le linee guida. Il criterio di neuroimmagine 2 riguarda la formazione degli operatori, non il paziente.

## Criteri di esclusione
Testo originale ([[TWIN2WIN-2 — Protocolo — V2]], p. 5–6):

*Clínica*
1. Discapacidad funcional previa al ictus en la escala de Rankin modificada (mRS >2). (p. 5)
2. Tratamiento inicial con un dispositivo de trombectomía diferente. (p. 5)
3. Síntomas clínicos sugestivos de ictus bilateral o ictus en múltiples territorios. (p. 5)
4. Diátesis hemorrágica conocida, deficiencia de factores de coagulación o tratamiento anticoagulante oral conocido con INR > 3,0. (p. 5)
5. Recuento basal de plaquetas < 50.000. (p. 5)
6. Enfermedad grave, avanzada o terminal con una esperanza de vida prevista de menos de seis meses. (p. 5)
7. Sujetos con tumores intracraneales identificables. (p. 5)
8. Vasculitis cerebral. (p. 5)
9. Evidencia de infección sistémica activa. (p. 5)
10. Consumo actual conocido de cocaína en el momento del tratamiento. (p. 5)
11. Mujer en edad fértil de la que se sepa que está embarazada, y/o en periodo de lactancia, o que tenga una prueba de embarazo positiva en el momento del ingreso. (p. 5)
12. Paciente que participe en un estudio que implique un fármaco o dispositivo en investigación que pueda afectar a este estudio. (p. 5)
13. Pacientes que probablemente no estén disponibles para un seguimiento de 90 días (por ejemplo, sin domicilio fijo, visitante del extranjero). (p. 5)

*Imágenes neurológicas*
1. Hipodensidad en la TC o difusión restringida que suponga una puntuación ASPECTS de < 6 en la TC o < 5 en la RMD (RM ponderada por difusión). (p. 5)
2. Evidencia de hemorragia en TAC o RMN (se permite la presencia de microsangrados). (p. 5)
3. Evidencia angiográfica de disección carotídea, estenosis de alto grado que impida el acceso al coágulo o vasculitis. (p. 6)
4. Efecto de masa significativo con desplazamiento de la línea media. (p. 6)
5. Pacientes con lesiones ateroscleróticas intracraneales subyacentes conocidas o sospechadas responsables de la oclusión objetivo. (p. 6)
6. Pacientes con oclusiones en múltiples territorios vasculares (por ejemplo, circulación anterior bilateral o circulación anterior/posterior). (p. 6)
7. Evidencia de tumor intracraneal (excepto pequeños meningiomas). (p. 6)
8. Sospecha de disección aórtica, presunción de émbolo séptico o sospecha de endocarditis bacteriana. (p. 6)

**Sintesi**: sono esclusi i pazienti già trattati con un altro dispositivo di trombectomia, quelli con ictus o occlusioni in più territori, ASPECTS <6 in TC o <5 in DWI, emorragia, effetto massa, tumore intracranico (tranne piccoli meningiomi), vasculite, dissezione carotidea o stenosi che impedisce di raggiungere il trombo, aterosclerosi intracranica responsabile dell'occlusione, dissezione aortica, embolo settico o endocardite. Esclusioni cliniche: coagulopatia o anticoagulante orale con INR >3,0, piastrine <50.000, aspettativa di vita <6 mesi, infezione sistemica attiva, cocaina, gravidanza o allattamento, altri studi con farmaco o dispositivo che possano interferire, follow-up a 90 giorni improbabile.

## Intervento e procedure
- **Braccio sperimentale**: DS-EVT, doppio stent retriever come primo passaggio. **Controllo**: SS-EVT, stent retriever singolo come primo passaggio ([[TWIN2WIN-2 — Protocolo — V2]], p. 1–2).
- **Non riportati nel documento**: dispositivi ammessi (marca, misure), uso di catetere a palloncino o aspirazione, numero massimo di passaggi, terapia di salvataggio, farmaci in sala.
- **Operatori**: formazione obbligatoria sul DS-EVT (p. 5).
- **Trombolisi**: se indicata, si fa secondo le linee guida AHA/ASA (p. 5). Nessun limite di farmaco.
- **Trombectomia**: è lo standard in entrambi i bracci; si randomizza la tecnica del primo passaggio.
- **Esami**: non è previsto un elenco, ma le esclusioni 4–5 richiedono INR (se anticoagulato) e piastrine (p. 5).
- **Imaging di controllo**: TC a 24 h (−8/+12) per l'emorragia; RM o TC per l'infarto in territorio nuovo (p. 3, p. 10; [[TWIN2WIN-2 — CI — V3]], p. 3).

## Visite e follow-up
| Visita | Momento | Contenuto | Fonte |
|---|---|---|---|
| Inclusione | dopo neuroimmagine di riferimento e conferma angiografica | consenso, randomizzazione, procedura; modulo con le variabili, dati basali in RedCap | ([[TWIN2WIN-2 — Protocolo — V2]], p. 4, p. 10) |
| Post-procedura | fine della procedura | endpoint di efficacia tecnica | (p. 4) |
| 24 h | −8/+12 h | TC (emorragia), NIHSS (deterioramento) | (p. 4, p. 10) |
| G5 o dimissione | ±12 h | NIHSS, mRS, eventi avversi, destino e farmaci alla dimissione | (p. 4, p. 10) |
| G90 | ±14 giorni | **telefonica** con paziente o familiari: mRS, NIHSS, eventi avversi, farmaci | (p. 4, p. 10; [[TWIN2WIN-2 — CI — V3]], p. 3) |

## Consenso
- **Tipo**: consenso informato **scritto** del paziente o di un "sustituto aceptable" (parente più stretto o rappresentante legale) ([[TWIN2WIN-2 — Protocolo — V2]], p. 4, p. 10).
- **Rappresentante**: se il paziente non è in grado, firma un familiare o un altro rappresentante autorizzato; appena possibile si chiede il consenso del paziente per continuare ([[TWIN2WIN-2 — CI — V3]], p. 1). Il modello prevede le firme di partecipante, investigatore e "familiar/representante (si procede)" ([[TWIN2WIN-2 — CI — V3]], p. 5).
- **Momento**: dopo la neuroimmagine di riferimento, prima dell'inclusione e della randomizzazione ([[TWIN2WIN-2 — Protocolo — V2]], p. 4).
- **Orale, telefonico o differito**: non riportati né nel protocollo né nel CI.
- **Lingue**: CI solo in castellano nella cartella Drive.

## Co-arruolamento
- Esclusi i pazienti in un altro studio "que implique un fármaco o dispositivo en investigación que pueda afectar a este estudio" (esclusione 12) e quelli trattati prima con un altro dispositivo di trombectomia (esclusione 2) ([[TWIN2WIN-2 — Protocolo — V2]], p. 5).
- Compatibilità con studi specifici: non riportata nel documento. Gli studi su un dispositivo o una tecnica del primo passaggio (per esempio [[ARTEMIS]], che vieta il doppio stent, o [[PIVOTAL]]) sono di fatto incompatibili nella stessa procedura: è un'inferenza dai due criteri, da confermare con l'équipe.

## Divergenze con EnsApp
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `99d4582`)
> - ✅ 1 occlusioni in più territori escluse · ✅ 2 ASPECTS ≥6 (anteriore; soglia della TC)
> - ✅ 4 età ≥18 · ✅ 5 finestra ≤24 h (misurata alla valutazione: vedi finestre temporali)
> - ✅ 11, 12, 13 testi: visite, consenso scritto, intervento DS-EVT vs SS-EVT
> - restano aperti 3 (M1 distale non distinta), 9 e 10 (dispositivo precedente ed esami come solo testo)
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `ac10c24`)
> - ✅ nome 'TWIN-2-WIN 2' risolto: stato, link di randomizzazione e colonna del foglio dati

Confronto con:
- `src/lib/domain/trials-info.ts:100-112` (scheda), `:361` (link di randomizzazione), `:399-413` (`findTrialInfo`, `isTrialOpen`);
- `src/lib/domain/acute-rules.ts:91-94` (`computeVesselFlags`) e `:211-221` (`twin2win2()`);
- `src/lib/domain/acute-reasons.ts:109-119` (`reasonTwin2win2`);
- per l'interfaccia, `src/routes/PostImaging.svelte`, `Summary.svelte`, `Share.svelte`, `TrialDetail.svelte`, `TrialPatient.svelte` e `src/lib/domain/sheet-payload.ts`.

Verificato il 2026-10-19 (`trials-info.ts` aggiornato lo stesso giorno, commit 7818276).

> [!success] Coincide
> - mRS pre ≤2 (`acute-rules.ts:216`; testo `trials-info.ts:103` "0-2");
> - NIHSS ≥6 (`:217`; testo `:103`);
> - occlusione obbligatoria (`isLvo`, `:218`), con ICA-T e basilare fra i vasi ammessi (`:91-94`);
> - "aspects: \"-\"" e nessun controllo di perfusione: il protocollo non chiede core né perfusione (ma vedi il punto 2 sull'ASPECTS);
> - testo imaging "Occlusion with TICI 0-1 flow at ICA-T, distal M1 MCA, or basilar." (`trials-info.ts:105`);
> - trombolisi "Optional." e trombectomia "Yes." (`:106-107`);
> - studio proposto solo ai candidati a trombectomia (`PostImaging.svelte:25-27`, `:102`), come da protocollo;
> - link a Study Randomizer (`trials-info.ts:361`; [[TWIN2WIN-2 — Protocolo — V2]], p. 7);
> - stato attivo, come il foglio.

- [ ] **1. [FP] Le occlusioni in più territori risultano eleggibili.**
> [!warning] Contraddizione
> Protocollo: esclusi "Síntomas clínicos sugestivos de ictus bilateral o ictus en múltiples territorios" (clinica 3) e "oclusiones en múltiples territorios vasculares (por ejemplo, circulación anterior bilateral o circulación anterior/posterior)" (imaging 6) ([[TWIN2WIN-2 — Protocolo — V2]], p. 5–6).
> App: `vessels.twin2win2` è un OR (`acute-rules.ts:91-94`) e la regola non conta i vasi selezionati (`:211-221`). Per esempio ICA-T + basilare risulta eleggibile.

- [ ] **2. [FP] L'ASPECTS non viene controllato.**
> [!warning] Contraddizione
> Protocollo, esclusione imaging 1: "ASPECTS de < 6 en la TC o < 5 en la RMD" ([[TWIN2WIN-2 — Protocolo — V2]], p. 5).
> App: `aspects: "-"` (`trials-info.ts:103`), e `twin2win2()` non legge `aspects` (`acute-rules.ts:211-221`), anche se il campo si compila nella stessa scheda EVT (`PostImaging.svelte:175-177`). Un ASPECTS 0–5 in TC risulta eleggibile. Il campo non distingue fra TC e DWI, che hanno soglie diverse. Anche il foglio [[Esquema ensayos — septiembre 2026]] scrive ASPECTS "no": il testo dell'app lo segue, il protocollo no.

- [ ] **3. [NC] M1 prossimale: il protocollo dice "M1 distal", l'app accetta qualunque M1.**
> [!warning] Contraddizione
> Protocollo: "segmentos o M1 distal de la arteria cerebral media" (neuroimagen 1, p. 5); "M1-MCA distal" (p. 4); strati "ICA terminal, M1 distal y arteria basilar" (p. 2) ([[TWIN2WIN-2 — Protocolo — V2]]). La frase è sgrammaticata e non dice esplicitamente se la M1 prossimale è esclusa.
> App: accetta il codice `m1` (`acute-rules.ts:93`), che nell'interfaccia è solo "M1" (`vessels.ts:14`), senza distinzione prossimale/distale. Il testo informativo dice "distal M1" (`trials-info.ts:105`), la ragione "ICA-T, M1 o basilar" (`acute-reasons.ts:117`). Se la M1 prossimale è esclusa, ci sono falsi positivi: da chiarire con l'IP.

- [ ] **4. [FN] Età: `> 18` invece di `≥ 18`.**
> [!warning] Contraddizione
> Protocollo, inclusione clinica 1: "Edad ≥18" ([[TWIN2WIN-2 — Protocolo — V2]], p. 4).
> App: `input.age > 18` (`acute-rules.ts:215`; `acute-reasons.ts:113` "age > 18"; testo `trials-info.ts:103` "> 18 y"). Un paziente di 18 anni compiuti viene scartato. Anche il foglio del team scrive "\>18".

- [ ] **5. [FN] Finestra: `< 24` invece di "dentro de las 24 horas", misurata alla valutazione.**
> [!warning] Contraddizione
> Protocollo: "Tratable lo antes posible y al menos dentro de las 24 horas siguientes al inicio de los síntomas, definido como el momento en que el paciente fue visto bien por última vez" (inclusione clinica 6, p. 5).
> App: `input.ltsw < 24` (`acute-rules.ts:214`; `acute-reasons.ts:112`; testo `trials-info.ts:103` "< 24 h"). La differenza è di bordo (esattamente 24 h). Inoltre il protocollo parla di **trattamento** entro 24 h, mentre `ltsw` sono le ore trascorse quando si usa l'app (`stores/patient.ts:82-90`): a 23 h e mezza l'app propone lo studio anche se la procedura inizierà dopo le 24 h. L'app non lo segnala.

- [ ] **6. [NC] Problema tecnico: `isTrialOpen("TWIN-2-WIN 2")` non trova lo studio.**
> `findTrialInfo()` cerca la chiave esatta o la chiave uguale al nome ignorando le maiuscole (`trials-info.ts:399-404`). "twin-2-win 2" non è uguale a "twin2win2", quindi restituisce `undefined`, e `isTrialOpen()` considera aperti gli studi sconosciuti (`:410-413`). Il riepilogo e la condivisione chiamano `isTrialOpen` con il nome visualizzato (`Summary.svelte:26`, `:48`, `:53`; `Share.svelte:30`, `:38`). Oggi è innocuo perché lo stato è `active`. Ma se lo studio venisse messo in pausa o chiuso, l'app continuerebbe a proporlo in quelle schermate, mentre `TrialPatient.svelte:74-76`, che usa le chiavi, lo nasconderebbe.

- [ ] **7. [NC] Problema tecnico: il pulsante di randomizzazione non compare nella scheda dello studio.**
> Il link è registrato con il nome visualizzato, `randomizationLinks["TWIN-2-WIN 2"]` (`trials-info.ts:361`). La scheda però si apre dal catalogo con la chiave `Twin2Win2` (`TrialsList.svelte:71`) e cerca `randomizationLinks[name]` con quella chiave (`TrialDetail.svelte:14-15`, `:92-93`): non trova nulla, quindi il pulsante Study Randomizer non viene mostrato. Lo stesso schema riguarda "DONE SYMPLE" (chiave `DoneSymple`).

- [ ] **8. [NC] Problema tecnico: il registro rapido del paziente non salva lo studio nel foglio dati.**
> In `TrialPatient.svelte` le opzioni sono le chiavi di `TRIALS_INFO` (`:74-76`), quindi lo studio vale `Twin2Win2`. `buildTrialsForSheet()` cerca `NAME_TO_KEY["Twin2Win2"]`, ma la mappa conosce solo `"TWIN-2-WIN 2"` (`sheet-payload.ts:46`). Con `if (!key) continue;` (`:86-87`) la colonna TWIN2WIN resta "no". Un paziente registrato in TWIN2WIN-2 da quella schermata non risulta nel foglio come arruolato. Il flusso Riepilogo → Condivisione usa il nome visualizzato e funziona.

- [ ] **9. [NC] Non si chiede se il paziente è già stato trattato con un altro dispositivo.**
> [!warning] Contraddizione
> Protocollo, esclusione clinica 2: "Tratamiento inicial con un dispositivo de trombectomía diferente." ([[TWIN2WIN-2 — Protocolo — V2]], p. 5). Il foglio del team la riporta nella colonna "Otros".
> App: nessun campo e nessuna nota (`trials-info.ts:110` `notes: []`). Va almeno aggiunta come nota, insieme alla conferma angiografica (TICI 0–1 in DSA, p. 5), che l'app non può verificare prima della procedura.

- [ ] **10. [NC] Altre esclusioni non modellate, compresi gli esami.**
> Protocollo: INR >3,0 in anticoagulati, piastrine <50.000, tumore intracranico, vasculite, infezione attiva, cocaina, gravidanza, dissezione carotidea o stenosi che impedisce l'accesso, aterosclerosi intracranica responsabile, effetto massa, dissezione aortica o embolo settico (p. 5–6).
> App: `preEvtLabs: "No."` (`trials-info.ts:108`), mentre le esclusioni 4–5 richiedono piastrine e INR. Il campo `tandem` esiste (`PostImaging.svelte:172`), ma la regola non lo usa; il protocollo non cita il tandem ed esclude solo la dissezione o la stenosi che impediscono di raggiungere il trombo. L'emorragia è filtrata dal tipo di ictus nell'interfaccia (`PostImaging.svelte:101-103`).

- [ ] **11. [TXT] Le visite nell'app sono quelle di un altro studio.**
> [!warning] Contraddizione
> Protocollo: post-procedura, 24 h (−8/+12), G5 ±12 h o dimissione, G90 ±14 giorni telefonico ([[TWIN2WIN-2 — Protocolo — V2]], p. 4, p. 10; [[TWIN2WIN-2 — CI — V3]], p. 3). Il foglio del team riporta per TWIN-2-WIN 2 "inicio, 24h, 5d/alta (presencial), 90 días (telefónica)".
> App: "48 h (in-person)", "Day 3-10 / discharge (in-person)", "Day 30 (phone)" (`trials-info.ts:111`). Né la visita a 48 h né quella a G30 esistono nel protocollo. È la sequenza che il foglio attribuisce a **HYBERNIA**: probabile slittamento di colonna nella copia dal foglio.

- [ ] **12. [TXT] Consenso orale o telefonico non previsto dai documenti.**
> [!warning] Contraddizione
> Protocollo: consenso del paziente o di un sostituto (parente o rappresentante legale) (p. 4, p. 10). CI: firma scritta del paziente o del familiare/rappresentante, poi consenso del paziente appena possibile ([[TWIN2WIN-2 — CI — V3]], p. 1, p. 5).
> App: "Written & oral/phone consent." (`trials-info.ts:104`), come il foglio. Né l'orale né il telefonico compaiono nei documenti in Drive: da verificare con il CEIm o l'IP.

- [ ] **13. [TXT] Testo dell'intervento incompleto.**
> App: "Double-stent (DS-EVT) technique." (`trials-info.ts:109`). Il protocollo **randomizza** DS-EVT contro SS-EVT (stent singolo) come primo passaggio ([[TWIN2WIN-2 — Protocolo — V2]], p. 2). Manca il braccio di controllo. Il testo imaging (`:105`) non dice che l'occlusione va confermata in angiografia convenzionale (p. 5).

## Problemi documentali
- **Protocollo breve**: 10 pagine senza indice, calendario a tabella, gestione degli eventi avversi, pagina firme né registro ([[TWIN2WIN-2 — Protocolo — V2]]).
- **mRS "de 0 o 2"** (p. 4) invece di 0–2.
- **Sede dell'occlusione sgrammaticata**: "segmentos o M1 distal" (p. 5), "ICA terminal, , M1-MCA distal" (p. 4).
- **Criterio sugli operatori** numerato fra le inclusioni del paziente (neuroimagen 2, p. 5).
- **Statistica incoerente**: alfa bilaterale 5% per la numerosità (p. 6) contro alfa unilaterale 0,05 per l'analisi (p. 7); numerosità calcolata solo su mRS 0–1 mentre l'endpoint primario include il ritorno al mRS basale (p. 3, p. 6, p. 8); 402 pazienti ma "160 pacientes en 6-9 meses" (p. 6).
- **Residuo di copia**: "fármaco del estudio" nella popolazione di sicurezza (p. 7).
- **CI con titolo e obiettivo del primo TWIN2WIN**: modello di consenso intitolato "TWIN2WIN" con il refuso "RSE … frente a RSE"; obiettivo descritto come ricanalizzazione angiografica, non mRS ([[TWIN2WIN-2 — CI — V3]], p. 2, p. 5).
- **CI**: rimanda a un "Apéndice 1" assente; cita un "Comité de Ética de la Investigación con medicamentos" ([[TWIN2WIN-2 — CI — V3]], p. 1, p. 3).
- **ASPECTS nel foglio del team**: "no", ma il protocollo esclude ASPECTS <6 in TC o <5 in DWI (p. 5).

## Fonti
- [[TWIN2WIN-2 — Protocolo — V2]]
- [[TWIN2WIN-2 — CI — V3]]
- [[Esquema ensayos — septiembre 2026]] (stato)
