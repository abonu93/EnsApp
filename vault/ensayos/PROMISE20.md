---
tipo: ensayo
estudio: PROMISE20
alias: [PROMISE 20, "BraiN20 validation"]
estado_app: no está en la app
clave_app: ""            # la chiave "PROMISE" descrive PROMISE20 RELOADED, non questo studio
categoria: dispositivo
fase: "studio osservazionale di coorte (AEMPS: observational Non-PostAuthorization) con dispositivo medico"
promotor: "Time is Brain, S.L."
registro: []             # NCT06149754 secondo il protocollo di PROMISE20 RELOADED; non riportato nel v1.3
protocolo_vigente: "Version 1.3, 19-10-2023"
ci_vigente: "Versión 1.3, 19-10-2023"
drive_carpeta: "https://drive.google.com/drive/folders/1JtOwydL3rSOpnk4TBIVGc32XqpHV3xZj"
fuentes: ["[[PROMISE20 — Protocolo — v1.3]]", "[[PROMISE20 — CI — v1.3]]"]
actualizado: 2026-10-19
---
# PROMISE20

> [!summary] In breve
> Primo studio clinico del dispositivo **BraiN20®** di Time is Brain: monitoraggio continuo dei [[Potenciales evocados somatosensoriales|potenziali evocati somatosensoriali]] (risposta N20) durante la trombectomia. Studio osservazionale, prospettico, multicentrico (3 centri catalani) a braccio unico, con 65 pazienti valutabili e un'analisi di futilità sui primi 17. Popolazione: LVO anteriore (ICA intracranica distale o T, M1, M2) trattata con EVT entro 24 h, [[NIHSS]] ≥6, [[mRS]] pre ≤2, qualsiasi core ([[PROMISE20 — Protocolo — v1.3]], p. 2–3, p. 17, p. 25).

> [!note] Non è PROMISE20 RELOADED
> Il successore [[PROMISE20 RELOADED]] usa un BraiN20® aggiornato e ha **NIHSS ≥1**. Secondo il suo protocollo PROMISE20 (NCT06149754) è stato fermato nel luglio 2024 dopo l'analisi di futilità sui primi 17 pazienti ([[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 6, p. 14). La voce `PROMISE` di EnsApp (`trials-info.ts:85-99`) descrive RELOADED, non questo studio (vedi divergenze).

## Disegno
- **Tipo**: prospettico, multicentrico, osservazionale, a braccio unico, pazienti consecutivi, valutazione in cieco dell'endpoint primario ([[PROMISE20 — Protocolo — v1.3]], p. 2, p. 16). Classificato dall'AEMPS come "observational study Non-PostAuthorization" (p. 32).
- **Centri**: H. Germans Trias i Pujol, H. Vall d'Hebron, H. Josep Trueta (p. 17).
- **Endpoint primario**: >75% di registrazioni N20 con affidabilità ottima o buona secondo due neurofisiologi in cieco (p. 4, p. 16).
- **Secondario principale**: AUC ≥0,80 dell'algoritmo BraiN20® per l'indipendenza (mRS 0–2) a 7 giorni (p. 4, p. 21). Altri: N20 per NIHSS (<17/≥17), tempo (<6/≥6 h) e ASPECTS; registrazioni non valutabili; prognosi a 90 giorni (p. 4).
- **Sicurezza**: scomparsa dell'N20 durante la procedura, mortalità a 7 giorni, tempi porta-puntura e puntura-ricanalizzazione, tollerabilità (p. 4, p. 21).
- **Numerosità**: 65 valutabili; futilità se ≥6 dei primi 17 hanno affidabilità bassa o non leggibile; primi 15 pazienti di validazione esclusi dall'analisi (p. 5, p. 18, p. 25).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | trattabile entro 24 h dall'ultima volta visto bene; "treatment point" = puntura arteriosa | ([[PROMISE20 — Protocolo — v1.3]], p. 17) |
| Età | ≥18 anni | (p. 17) |
| mRS pre | ≤2 | (p. 17) |
| NIHSS | **≥6** prima della procedura | (p. 17) |
| Imaging / core | qualsiasi core, senza limiti di volume (ASPECTS o TCP/RM-DWI solo misurati) | (p. 17, p. 19) |
| Occlusione | TICI 0–1 di ICA intracranica (distale o T), M1 o M2 adatta a EVT, su angio-TC o angio-RM, con o senza occlusione o stenosi carotidea cervicale | (p. 17) |
| EVT | il paziente deve essere trattato con EVT secondo i protocolli locali | (p. 17) |

## Criteri di inclusione
Testo originale (§3.2.1, [[PROMISE20 — Protocolo — v1.3]], p. 17):

1. Acute ischemic stroke with large anterior vessel occlusion undergoing treatment with EVT according to local protocols.
2. Age ≥18.
3. No significant pre-stroke functional dependence (mRS ≤ 2).
4. Patient treatable within 24 hours of symptom onset. Symptoms onset is defined as the time the patient was last seen well, and treatment point as the time of arterial puncture.
5. Baseline NIHSS score obtained prior to procedure must be equal or higher than 6 points.
6. Occlusion (TICI 0-1) of the intracranial ICA (distal ICA or T occlusions), MCA-M1 segment or M2 suitable for EVT, as evidenced by CTA or MRA with or without concomitant cervical carotid occlusion or stenosis.
7. Any infarct core, without volume restrictions, measured by ASPECT score or by CTP/DWI-MRI prior to EVT.
8. Informed consent obtained from patient or acceptable patient surrogate; or the deferred informed consent, to avoid the delay in the start of the mechanical thrombectomy.

**Sintesi**: adulto candidato a EVT per LVO anteriore completa (ICA intracranica distale o T, M1, M2, anche con lesione cervicale), NIHSS ≥6, mRS pre ≤2, puntura entro 24 h; nessun limite di core.

## Criteri di esclusione
Testo originale (§3.2.2, [[PROMISE20 — Protocolo — v1.3]], p. 17–18; numerazione del corpo, con l'8 ripetuto):

*Clinical criteria*
1. Patients with a well-documented history of neuromuscular diseases and other neurodegenerative disorders, prior stroke (TIA not excluded) or nervous system tumors that could interfere with SEP assessment.
2. Serious, advanced, or terminal illness with anticipated life expectancy of less than three months.
3. Patients with a pre-existing neurological or psychiatric disease that would confound the neurological or functional evaluations.
4. Known pregnant women. In case of women of childbearing potential (WOCBP) with no highly effective methods for birth control, a pregnancy test should be performed.
5. Intended use of anesthetic gases during the endovascular procedure. (p. 17)

*Neuroimaging criteria*

6. CT or MR evidence of hemorrhage (the presence of microbleeds is allowed).
7. Subjects with occlusions in multiple vascular territories (e.g., bilateral anterior circulation, or anterior/posterior circulation).
8. Evidence of intracranial tumor (except small meningioma). (p. 18)

*BraiN20® medical device safety issues*

8. Subjects with a demand-type cardiac pacemaker, defibrillator, or other electrical implant or metal.
9. Patients with suspected or well-known cancerous skin lesion in the area where electrical stimulation will be applied.
10. Patients who have a localized disorder in the wrist and forearm where electrical stimulation is to be applied (i.e., fractures or dislocations). (p. 18)

**Sintesi**: esclusi ictus pregresso (non l'AIT), malattie neuromuscolari o neurodegenerative, tumori del sistema nervoso, aspettativa di vita <3 mesi, gravidanza nota, uso previsto di gas anestetici, emorragia, occlusioni in più territori, pacemaker o impianti metallici, lesioni cutanee o di polso nella zona di stimolazione.

## Intervento e procedure
- **Dispositivo**: BraiN20®, elettrodi di superficie su scalpo e polso, una N20 ogni 33 s; registrazione dal pronto soccorso o dalla sala prima della puntura, **continua** durante la EVT e fino al trasferimento in UI/UCI. Le registrazioni si rivedono in cieco ([[PROMISE20 — Protocolo — v1.3]], p. 18).
- **Trombolisi**: e.v. senza ritardi se indicata, per pratica clinica ([[PROMISE20 — Protocolo — v1.3]], p. 19).
- **Trombectomia**: obbligatoria come trattamento di pratica clinica (stent retriever, aspirazione o tecnica combinata) (p. 17, p. 20).
- **Anestesia**: sedoanalgesia preferita; in anestesia generale propofol + remifentanil, niente miorilassanti tranne il rocuronio all'induzione; i gas anestetici escludono (p. 17, p. 20).
- **Nessuna azione clinica** prevista sui risultati del dispositivo; se l'N20 scompare si controllano glicemia, temperatura, PA e NIHSS (p. 20, p. 23).

## Visite e follow-up
| Momento | Contenuto | Fonte |
|---|---|---|
| Basale (t0) | criteri, TC o RM-DWI (ASPECTS), angio-TC/RM, glicemia, test di gravidanza se necessario | ([[PROMISE20 — Protocolo — v1.3]], p. 21–22) |
| EVT (t1–t2) | NIHSS e prima registrazione BraiN20®, tempi, eTICI finale, NIHSS a fine EVT, N20 post-EVT | (p. 22) |
| 24 h (±6) (t3) | NIHSS; TC a 24–36 h | (p. 22–23) |
| 7 giorni o dimissione (t4) | NIHSS, mRS da valutatore in cieco | (p. 22–23) |
| 90 giorni (±15) (t5) | mRS per telefono o in presenza, valutatore in cieco | (p. 22–23) |

## Consenso
- **Protocollo**: consenso differito se approvato dal CEIm; consenso scritto o **orale** del paziente o del rappresentante prima dell'uso; consenso orale **per telefono** se il rappresentante non è presente; testimone se il paziente capisce ma non può firmare ([[PROMISE20 — Protocolo — v1.3]], p. 19–20). Il §5.1 cita anche una deroga al consenso ("waiver", p. 32).
- **CI v1.3**: firma del paziente o del rappresentante, consenso verbale davanti a testimoni con firma successiva, consenso differito se approvato ([[PROMISE20 — CI — v1.3]], p. 2, p. 9–10).
- **Lingue**: solo castellano in Drive.

## Co-arruolamento
- Non riportato nel documento: il protocollo non esclude la partecipazione ad altri studi.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:85-99` (voce `PROMISE`);
- `src/lib/domain/acute-rules.ts:106-110` (vasi) e `:173-183` (`promise()`);
- `src/lib/domain/acute-reasons.ts:72-82` (`reasonPromise()`);
- `src/routes/Summary.svelte:24`, `:47-49`.

Verificato il 2026-10-19.

> [!important] Quale studio descrive la voce `PROMISE`
> La voce descrive **PROMISE20 RELOADED**, non PROMISE20. Il discriminante è il NIHSS: l'app usa `nihss >= 1` (`acute-rules.ts:179`; `trials-info.ts:90` "nihss: '>= 1'"), come RELOADED ("equal or higher than 1 point", [[PROMISE20 RELOADED — Protocolo — Rev 1]], p. 22) e come la riga "PROMISE 20 RELOADED" del foglio [[Esquema ensayos — septiembre 2026]]. PROMISE20 richiedeva NIHSS ≥6 ([[PROMISE20 — Protocolo — v1.3]], p. 17). Il resto (24 h, ≥18 anni, mRS ≤2, ICA distale/T, M1, M2) è identico nei due protocolli. Anche lo stato `paused` (`trials-info.ts:88`) corrisponde alla pausa di RELOADED nel foglio. PROMISE20, chiuso, non ha una voce propria nell'app; la colonna "PROMISE" del foglio Google (`sheet-payload.ts:27`, `:56`) è unica per i due studi.

> [!success] Coincide (fra PROMISE20 e la regola dell'app)
> - finestra 24 h (`ltsw <= 24`, `acute-rules.ts:176`);
> - età ≥18 (`:177`);
> - mRS pre ≤2 (`:178`);
> - LVO richiesta (`:180`) e vasi ICA-T, M1, M2 (`:106-110`);
> - nessun limite di ASPECTS (`trials-info.ts:90` "aspects: '-'").

- [ ] **1. [TXT] Intervento descritto come dispositivo di trombectomia.**
> Protocollo: BraiN20® è un dispositivo di **monitoraggio** dei PES, non di trombectomia; la EVT si fa con dispositivi di pratica clinica ([[PROMISE20 — Protocolo — v1.3]], p. 2, p. 18, p. 20).
> App: `trials-info.ts:96` "PROMISE thrombectomy device (per protocol)." Errato per entrambi gli studi PROMISE.

- [ ] **2. [FP] (solo se la voce fosse letta come PROMISE20) NIHSS ≥1 invece di ≥6.**
> Protocollo PROMISE20: "equal or higher than 6 points" ([[PROMISE20 — Protocolo — v1.3]], p. 17). App: `nihss >= 1` (`acute-rules.ts:179`). Corretto per RELOADED; per PROMISE20 i NIHSS 1–5 sarebbero falsi positivi. Lo studio è chiuso e la voce è `paused`, quindi oggi senza effetto.

- [ ] **3. [NC] ICA intracranica distale non terminale.**
> Protocollo: "intracranial ICA (distal ICA or T occlusions)" (p. 17). App: `computeVesselFlags` per `promise` include solo `ica-terminal`, non `ica-intracranial` (`acute-rules.ts:106-110`); il testo dice "Intracranial ICA (distal/T-ICA)" (`trials-info.ts:92`). Una ICA distale non-T risulterebbe non eleggibile (FN), da valutare insieme a RELOADED, che ha lo stesso criterio.

- [ ] **4. [TXT] Consenso solo "Written."**
> Protocollo e CI: anche orale (di persona o per telefono, con testimone) e differito ([[PROMISE20 — Protocolo — v1.3]], p. 19; [[PROMISE20 — CI — v1.3]], p. 2). App: `trials-info.ts:91` "Written.".

- [ ] **5. [NC] Esclusioni specifiche del dispositivo non modellate.**
> Gas anestetici previsti, pacemaker o impianti metallici, lesioni di polso o cutanee, ictus pregresso, occlusioni in più territori ([[PROMISE20 — Protocolo — v1.3]], p. 17–18): `promise()` non le controlla. `vessels.promise` è un OR, quindi anche un'occlusione multiterritoriale passa.

## Problemi documentali
- **Registro**: il protocollo v1.3 non riporta il proprio NCT; NCT06149754 viene dal protocollo di RELOADED.
- **Esclusione 8 ripetuta** nel corpo del protocollo (p. 18); la sinossi numera 1–11 (p. 3).
- **Allegati mancanti**: CI, charter PES, valutazione clinica, PMCF e indagini precedenti sono "Attached to this protocol" ma non sono nel PDF (p. 36–38).
- **Riferimenti normativi incoerenti**: il §5.1 cita il Reg. (UE) 536/2014 (farmaci) per la deroga al consenso in uno studio con dispositivo (p. 32); il CI parla di "ensayo clínico" ([[PROMISE20 — CI — v1.3]], p. 2, p. 6).
- **Stato**: non presente nel foglio [[Esquema ensayos — septiembre 2026]]; chiuso secondo l'indice Drive e, secondo RELOADED, interrotto nel luglio 2024.

## Fonti
- [[PROMISE20 — Protocolo — v1.3]]
- [[PROMISE20 — CI — v1.3]]
- [[PROMISE20 RELOADED]] (successore; solo per il contesto)
