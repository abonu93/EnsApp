---
tipo: ensayo
estudio: SAIL-MeVO
alias: [SAIL MEVO, SAILING-MEVO, "Stent-retriever–Assisted Intra-arterial Lysis", "SAIL-MeVO Randomized Trial"]
estado_app: no está en la app
clave_app: ""
categoria: isquémico
fase: "III"
promotor: "Vall d'Hebron Institut de Recerca (VHIR) – FlowCat Lab (studio promosso dallo sperimentatore)"
registro: []              # ClinicalTrials.gov "to be assigned" (protocollo p. 1)
protocolo_vigente: "Version 2.1, 08-09-2026"
ci_vigente: "Paziente v1.1 (28-04-2026) e rappresentante v1.2 (04-06-2026), solo in inglese"
drive_carpeta: "https://drive.google.com/drive/folders/1YEER9SvdcVhoQdw5JaVKMkQ9BSI7YhHx"
fuentes: ["[[SAIL-MeVO — Protocolo — V2.1]]", "[[SAIL-MeVO — Sinopsis — V1.0]]", "[[SAIL-MeVO — CI — v1.1]]", "[[SAIL-MeVO — CI representante — v1.2]]"]
actualizado: 2026-10-19
---
# SAIL-MeVO

> [!summary] In breve
> Studio di fase III promosso da Vall d'Hebron (VHIR – FlowCat Lab), randomizzato 1:1, PROBE. Confronta la miglior terapia medica (BMT) da sola con BMT + trattamento endovascolare (EVT) nell'ictus da [[MeVO]] **isolata**: M2 non dominante–M3, A2–A3, P2–P3.
> - **Finestra**: <12 h alla randomizzazione; nell'ictus al risveglio si conta dal punto medio del sonno.
> - **Paziente**: 18–80 anni, [[mRS]] pre 0–1, [[NIHSS]] 9–17.
> - **Imaging**: [[ASPECTS]] ≥6; se disponibili, core IA in TC <10 mL e Tmax >6 s >30 mL.
> - **EVT**: [[Aspiración directa (ADAPT)|ADAPT]] di prima linea (massimo 2 tentativi), poi SAIL: [[Stent retriever|stent retriever]] aperto e [[Trombólisis intraarterial|lisi intra-arteriosa]] locale ([[SAIL-MeVO — Protocolo — V2.1]], p. 8–10, p. 28, p. 43–44).

> [!info] Stato
> - **Foglio "Esquema ensayos"** (fonte di verità; modifica del 2026-10-19 08:19, verificata in questa sessione e invariata): **aperto**.
> - **Drive originale**: secondo le informazioni di ingestione lo studio è ancora in "ENSAYOS PENDIENTES ABRIR", con parere favorevole di giugno 2026. Non riverificato file per file in questa sessione.
> - **App**: **non presente** (nessuna voce in `src/lib/domain/trials-info.ts`, nessuna regola in `acute-rules.ts`). Decisione del team ancora aperta ([[Estado de los estudios]]).
> - **Documenti**: ClinicalTrials.gov "to be assigned/inserted before trial activation" ([[SAIL-MeVO — Protocolo — V2.1]], p. 1). Il protocollo V2.1 (08-09-2026) è **posteriore** al parere di giugno. Non risulta in Drive un'approvazione specifica della V2.1; è un'inferenza, da verificare.

## Disegno
- **Tipo**: fase III, prospettico, multicentrico, randomizzato, in aperto con valutazione degli esiti in cieco (PROBE) ([[SAIL-MeVO — Protocolo — V2.1]], p. 8, p. 27; [[SAIL-MeVO — Sinopsis — V1.0]], §Diseño).
- **Bracci**: BMT secondo linee guida, con IVT se indicata, contro BMT + EVT ([[SAIL-MeVO — Protocolo — V2.1]], p. 9, p. 31).
- **Randomizzazione**: 1:1, web centralizzata, blocchi permutati per centro. Strati: età ≤70 / >70 anni, territorio MCA / ACA-PCA, IVT sì/no ([[SAIL-MeVO — Protocolo — V2.1]], p. 29–30).
- **Numerosità**: 200 per braccio, circa 420 con il 5% di perdite (mRS 0–2 dal 43% al 57%, alfa 0,05, potenza 80%). Fino a 10 centri; reclutamento di circa 24 mesi ([[SAIL-MeVO — Protocolo — V2.1]], p. 9, p. 27, p. 36, p. 40).
- **Endpoint primario**: mRS 0–2 a 90 giorni ([[SAIL-MeVO — Protocolo — V2.1]], p. 13, p. 34).
- **Secondari**, in ordine gerarchico:
  - shift ordinale mRS, poi mRS 0–1;
  - ΔNIHSS ≥8 o NIHSS ≤2 a 24 h;
  - volume dell'infarto a 24–48 h;
  - destino alla dimissione;
  - EQ-5D-5L e PROMs ([[SAIL-MeVO — Protocolo — V2.1]], p. 10–11, p. 15).
- **Sicurezza**:
  - sICH secondo ECASS-III entro 24–36 h ([[Hemorragia intracraneal sintomática]]);
  - qualunque ICH classificata con [[Clasificación de Heidelberg|Heidelberg]];
  - embolizzazione in un nuovo territorio, ESA, perforazione o dissezione;
  - mortalità a 90 giorni ([[SAIL-MeVO — Protocolo — V2.1]], p. 11, p. 35).
- **Interim**: sicurezza ogni 100 pazienti; efficacia o futilità al 50% circa del reclutamento ([[SAIL-MeVO — Protocolo — V2.1]], p. 15).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | <12 h dall'esordio alla **randomizzazione**. Ictus al risveglio: <12 h dal **punto medio del sonno**. Altri esordi non testimoniati: <12 h dall'ultima volta visto bene | ([[SAIL-MeVO — Protocolo — V2.1]], p. 28) |
| Età | 18–80 anni | (p. 28) |
| mRS pre | 0–1 (il foglio dice 0–2: vedi "Problemi documentali") | (p. 28) |
| NIHSS | 9–17. Se si fa la trombolisi e.v., conta il NIHSS **30 min dopo l'inizio** dell'IVT, che deve restare 9–17. Con più NIHSS vale l'ultimo prima della randomizzazione; nei pazienti sedati o intubati, l'ultimo prima della sedazione | (p. 10, p. 28) |
| Imaging / ASPECTS / core | ASPECTS ≥6 in TC senza contrasto. Se c'è il software di core IA in TC (Methinks), AI-ICV <10 mL. Se si fa la TC-perfusione, ipoperfusione con Tmax >6 s >30 mL. Con più studi vale il più recente | (p. 28, p. 32–33) |
| Occlusione | MeVO **isolata** su angio-TC o angio-RM: M2 non dominante–M3, A2–A3, P2–P3. Esclusi LVO prossimale (ICA, M1) e tandem con stenosi cervicale dell'ICA >70% | (p. 28, p. 33) |

## Criteri di inclusione
Testo originale ([[SAIL-MeVO — Protocolo — V2.1]], p. 28; sinossi interna p. 10). Gli elenchi sono puntati: la numerazione è aggiunta.

1. Age 18–80; pre-stroke mRS 0–1. (p. 28)
2. Baseline NIHSS ≥9 and ≤17. (p. 28) — "For patients receiving intravenous thrombolysis before randomization, the NIHSS score used to determine eligibility will be obtained 30 minutes after initiation of intravenous thrombolysis and must remain between 9 and 17, inclusive." (p. 28)
3. Onset-to-randomization <12 hours; for wake-up strokes, <12 hours from the sleep midpoint; for other unwitnessed strokes, <12 hours from last known well (p. 28)
4. Isolated MeVO on CTA/MRA: non dominant M2–M3, A2–A3, P2–P3. (p. 28)
5. ASPECTS ≥6 on NCCT. When AI-based NCCT core-volume assessment is available, AI-ICV must be <10 mL. When CTP is available, the volume of hypoperfused tissue with Tmax >6 seconds must be >30 mL. (p. 28)
6. Informed consent (patient or LAR). (p. 28)

**Sintesi**: adulto fino a 80 anni, autonomo (mRS 0–1), con deficit moderato (NIHSS 9–17, ricontrollato a 30 min se trombolisato) e MeVO isolata. Deve essere randomizzato entro 12 h; nel risveglio si conta dal punto medio del sonno. Serve un core piccolo: ASPECTS ≥6 e, se misurato, core IA <10 mL. Se si fa la perfusione serve un'ipoperfusione >30 mL.

## Criteri di esclusione
Testo originale ([[SAIL-MeVO — Protocolo — V2.1]], p. 28; sinossi interna p. 10):

1. Proximal LVO (ICA, M1) or tandem cervical ICA stenosis >70%. (p. 28)
2. Intracranial hemorrhage at baseline. (p. 28)
3. Pregnant women (p. 28; assente nella sinossi interna, p. 10)
4. Life expectancy <3 months. (p. 28)
5. Severe allergy to iodinated contrast (p. 28)

**Sintesi**: poche esclusioni. Sono escluse l'occlusione prossimale o il tandem con stenosi >70%, l'emorragia, la gravidanza, l'aspettativa di vita <3 mesi e l'allergia grave al contrasto iodato. Non ci sono soglie di laboratorio: gli esami basali (piastrine, INR se warfarin, aPTT se eparina o DOAC, test di gravidanza) sono solo raccolti ([[SAIL-MeVO — Protocolo — V2.1]], p. 34).

## Intervento e procedure
- **Braccio BMT**: terapia secondo linee guida, con trombolisi e.v. se indicata ([[SAIL-MeVO — Protocolo — V2.1]], p. 31).
- **Braccio EVT**, a gradini ([[SAIL-MeVO — Protocolo — V2.1]], p. 31, p. 43–44):
  1. **ADAPT**, se il catetere da aspirazione (di solito 0,043") arriva al trombo senza tortuosità eccessiva: massimo 2 tentativi.
  2. **SAIL**, di prima linea se l'anatomia è sfavorevole o come salvataggio. Stent retriever ri-guainabile (di solito 3 × 20 mm) aperto attraverso il trombo, infusione locale del farmaco dal catetere distale in 5–10 min (metà dose, poi l'altra metà a giudizio), ri-guainamento **senza** ritirare lo stent aperto. SAIL ripetuti o manovre convenzionali sono sconsigliati.
- **Farmaci SAIL** (uno a scelta): tirofiban fino a 0,8 mg (16 mL a 0,05 mg/mL); [[Alteplasa|alteplasa]] fino a 20 mg; [[Tenecteplasa|tenecteplasi]] fino a 5 mg; eptifibatide (dose non riportata) ([[SAIL-MeVO — Protocolo — V2.1]], p. 44).
- **Dopo la procedura**: niente mantenimento di tirofiban o antitrombotici, salvo sospetta [[Ateroesclerosis intracraneal (ICAD)|ICAD]]. Antitrombotici dalle 24 h ([[SAIL-MeVO — Protocolo — V2.1]], p. 44).
- **Ammessi** i vasodilatatori intra-arteriosi (nimodipina). **Vietati** "experimental endovascular devices or drugs" ([[SAIL-MeVO — Protocolo — V2.1]], p. 31–32).
- **Trombolisi e.v.**: ammessa in entrambi i bracci, se indicata. Condiziona il NIHSS di eleggibilità, ricontrollato a 30 min, ed è un fattore di stratificazione ([[SAIL-MeVO — Protocolo — V2.1]], p. 28–30).
- **Accesso**: transfemorale; anestesia a discrezione ([[SAIL-MeVO — Protocolo — V2.1]], p. 43).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Basale | prima della randomizzazione | anamnesi, esami, criteri, consenso, TC/angio-TC (RM/angio-RM) ± perfusione, NIHSS, mRS | ([[SAIL-MeVO — Protocolo — V2.1]], p. 33) |
| Post-EVT | subito dopo la procedura | dettagli della procedura, TICI basale/primo passaggio/finale | (p. 34) |
| 24 h | 16–36 h nella Tab. 2 (12–48 h e 24 ± 12 h nel testo) | TC o RM obbligatoria, NIHSS, classificazione ICH | (p. 32–34) |
| Giorno 5 o dimissione | ±1 giorno ("day 7/discharge" a p. 12 e p. 36) | NIHSS, mRS, destino alla dimissione | (p. 32–33) |
| 30 giorni | ±7 | mRS, eventi avversi | (p. 33) |
| 90 giorni | ±30 nella Tab. 2 (±14 o ±15 nel testo) | mRS in cieco, EQ-5D-5L, PROMs | (p. 13, p. 31–33) |

Nel CI "Some visits may be conducted by telephone" ([[SAIL-MeVO — CI — v1.1]], p. 3).

## Consenso
- **Tipo**: consenso **scritto** prima dell'arruolamento, del paziente o, se incapace, del rappresentante legale o di una persona di fiducia ([[SAIL-MeVO — Protocolo — V2.1]], p. 29).
- **Emergenza**: se non è disponibile nessuno e lo approvano il CE e la normativa, arruolamento con consenso d'urgenza, poi consenso scritto per continuare. In caso di rifiuto il paziente viene ritirato ([[SAIL-MeVO — Protocolo — V2.1]], p. 29; [[SAIL-MeVO — Sinopsis — V1.0]], §Consideraciones éticas). Vedi [[Consentimiento diferido]].
- **CI in Drive**: paziente v1.1 e rappresentante v1.2, **solo in inglese**. Nessuno dei due descrive il percorso d'emergenza ([[SAIL-MeVO — CI — v1.1]], [[SAIL-MeVO — CI representante — v1.2]]).
- **Orale o telefonico**: non previsto.

## Co-arruolamento
> [!done] Decisione del team (2026-10-21, commit `a99924f`)
> - SAIL-MeVO e NiVO non si possono co-arruolare (esclusivi nel Riepilogo)

Non riportato nei documenti. Il protocollo vieta "experimental endovascular devices or drugs" ([[SAIL-MeVO — Protocolo — V2.1]], p. 32).

Nota per il team: [[NiVO]] (attivo in app) recluta MeVO con un catetere da aspirazione dentro un'indagine clinica, e le popolazioni si sovrappongono (NIHSS ≥5, M2 non dominante, A2–A3, P2–P3). La compatibilità va chiesta ai promotori.

## Proposta per EnsApp
> [!note] Dal 2026-10-19 SAIL-MeVO è nell'app (PR #12, `sailMevo()` in `acute-rules.ts`). Questa proposta è stata scritta prima: va riletta come confronto con la regola implementata.

Lo studio non è nell'app. Qui sotto: cosa servirebbe per una regola di eleggibilità, con i campi già presenti e quelli mancanti. Codice verificato il 2026-10-19; **nessun file modificato**.

### Campi esistenti utilizzabili
| Criterio (protocollo) | Campo app | Dove si compila | Note |
|---|---|---|---|
| Età 18–80 (p. 28) | `age` | `PreImaging.svelte:86-91` | sufficiente |
| mRS pre 0–1 (p. 28) | `premrs` | `PreImaging.svelte:98-105` | sufficiente |
| NIHSS 9–17 (p. 28) | `nihss` | `PreImaging.svelte:93-96` | è il NIHSS di ingresso, non quello a 30 min dall'IVT |
| IVT sì/no (p. 28–30) | `ivtCandidate` | `PostImaging.svelte:158` | dice se il paziente è candidato, non se ha iniziato l'IVT né quando |
| Finestra <12 h (p. 28) | `ltsw`, ore da `ltswDate` a **adesso** | `PreImaging.svelte:113`; `stores/patient.ts:70-76` | misura il momento della valutazione, non la randomizzazione |
| Ictus al risveglio (p. 28) | `wakeupStroke` | `PreImaging.svelte:130-136` | esiste, ma senza l'ora del risveglio non si calcola il punto medio del sonno |
| ASPECTS ≥6 (p. 28) | `aspects` | `PostImaging.svelte:175-178` (scheda EVT), `:203-206` (scheda TENACITY) | il campo c'è, ma compare solo in quelle due schede |
| Vaso, MeVO isolata (p. 28) | `targetVessels` | `PostImaging.svelte:167-170`; codici in `vessels.ts:11-26` | `gt-m2`, `a2`, `gt-a2`, `p2`, `gt-p2`, con lo stesso conteggio "un solo vaso" di NiVO (`acute-rules.ts:194`) |
| Esclusione ICA/M1 (p. 28) | `targetVessels` (`ica-*`, `m1`) | come sopra | coperta dal vincolo "un solo vaso" |
| Esclusione tandem (p. 28) | `tandem` | `PostImaging.svelte:172` | è un toggle generico "tandem", non "stenosi dell'ICA cervicale >70%" |
| Esclusione emorragia (p. 28) | `strokeType` | `PostImaging.svelte:148` | le regole ischemiche non vengono calcolate se il tipo è emorragico |

### Campi o codici mancanti
1. **M2 non dominante**: oggi c'è "M2 proximal/dominant" (`m2-proxdom`, `vessels.ts:15`) e "Any M2" (`m2-any`, `:16`), che include anche la M2 dominante. Serve un codice `m2-nondom`.
2. **Segmenti distali troppo ampi**. I codici attuali includono segmenti non ammessi: serve dividerli o restringerli.
   - `gt-m2` (">M2", `vessels.ts:17`) comprende M3 **e M4**; il protocollo ammette fino a M3.
   - `gt-a2` (">A2", `:20`) comprende A3 e oltre (A4–A5); il protocollo ammette fino ad A3.
   - `gt-p2` (">P2", `:24`) comprende P3 e oltre (P4); il protocollo ammette fino a P3.
   - Codici necessari: `m3`, `a3`, `p3`.
3. **NIHSS a 30 min dall'inizio dell'IVT** (p. 28): nuovo campo numerico, obbligatorio se il paziente è trombolisato.
4. **Ora del risveglio o della scoperta dei sintomi**, per calcolare il punto medio del sonno (p. 28). Oggi `wakeupStroke` serve solo a WeTrust (`en.ts:110`).
5. **Core IA in TC (AI-ICV, Methinks)** in mL, oppure "non disponibile" (p. 28). `largeCore` (≥70 mL, TENACITY, `PostImaging.svelte:208-211`) non è utilizzabile.
6. **Ipoperfusione Tmax >6 s** in mL, oppure "perfusione non eseguita" (p. 28). `perfusionMismatch` (rapporto ≥1,2 e >10 mL, TENACITY, `PostImaging.svelte:194-197`) misura un'altra cosa.
7. **Esclusioni cliniche**: gravidanza, aspettativa di vita <3 mesi, allergia grave al contrasto iodato (p. 28). `pregnancy` esiste solo nella scheda emorragica FASTEST (`PostImaging.svelte:60`, `:276`).
8. **Tandem**: precisare l'etichetta come "stenosi dell'ICA cervicale >70%", oppure aggiungere un campo dedicato.
9. **Flusso dell'interfaccia**: il selettore dei vasi e l'ASPECTS compaiono solo se il medico risponde "Eleggibile" a "Candidato a trombectomia (EVT)?" (`PostImaging.svelte:102`, `:163-181`). Inoltre `lvo` deriva da quella risposta (`:27`). In SAIL-MeVO l'EVT è proprio il trattamento randomizzato e nelle MeVO il suo beneficio "remains uncertain" ([[SAIL-MeVO — Protocolo — V2.1]], p. 17). Un medico può quindi rispondere "Non eleggibile" a una MeVO candidabile. Serve mostrare vasi e ASPECTS anche nel ramo "non candidato", o una domanda "MeVO isolata?" indipendente dalla candidatura. La regola non deve usare `lvo`.

### Rischi se si usassero solo i campi attuali
- `[FP]` Una regola costruita su `gt-m2`, `gt-a2`, `gt-p2` (come NiVO, `acute-rules.ts:111-117`) proporrebbe pazienti con occlusione M4, A4–A5 o P4, non ammessi ("M2–M3, A2–A3, P2–P3", p. 28).
- `[FP]` Usare `m2-any` includerebbe la M2 dominante, esclusa ("non dominant M2", p. 28).
- `[FN]` Senza `m2-any` né un nuovo codice, la M2 non dominante, uno dei vasi principali dello studio, non sarebbe mai eleggibile.
- `[FN]` Se la regola dipendesse da `lvo === "yes"` come NiVO (`acute-rules.ts:192`), i pazienti marcati "non candidati a EVT" sparirebbero dallo screening.
- `[FN]` Ictus al risveglio: con `ltsw < 12` misurato dall'ultima volta visto bene si scartano pazienti con punto medio del sonno entro 12 h.
- `[FP]` Paziente trombolisato che migliora sotto 9 (o peggiora sopra 17) a 30 min: proposto in base al NIHSS di ingresso.
- `[FP]` La finestra è misurata alla valutazione, non alla randomizzazione: un paziente a 11,8 h risulterebbe eleggibile anche se la randomizzazione avviene dopo le 12 h.
- `[NC]` AI-ICV <10 mL, Tmax >6 s >30 mL, gravidanza, aspettativa di vita e allergia al contrasto non verrebbero controllati.

### Bozza della regola (pseudocodice)
```ts
// SAIL-MeVO — SAIL-MeVO — Protocolo — V2.1, p. 28 (sinossi interna p. 10)
// Codici nuovi richiesti: "m2-nondom", "m3", "a3", "p3" (vedi sopra).
const SAIL_MEVO_VESSELS = ["m2-nondom", "m3", "a2", "a3", "p2", "p3"];      // p. 28 incl. 4

function sailMevo(input: AcuteInput): boolean {
  const vessels = toArray(input.targetVessels);
  const isolatedMevo =
    vessels.length === 1 && SAIL_MEVO_VESSELS.includes(vessels[0]);       // p. 28 incl. 4, escl. 1

  // Finestra: <12 h dall'esordio / LKW; risveglio: dal punto medio del sonno (p. 28 incl. 3)
  const hours = input.wakeupStroke && isValidNumber(input.hoursFromSleepMidpoint)
    ? input.hoursFromSleepMidpoint
    : input.ltsw;                                                           // fallback conservativo

  // NIHSS: se IVT avviata, vale quello a 30 min dall'inizio (p. 28 incl. 2; p. 10)
  const nihssElig = input.ivtStarted === "yes" ? input.nihssPostIvt30 : input.nihss;

  return (
    hours < 12 &&                                                           // incl. 3
    input.age >= 18 && input.age <= 80 &&                                   // incl. 1
    input.premrs <= 1 &&                                                    // incl. 1 (foglio: 0-2!)
    isValidNumber(nihssElig) && nihssElig >= 9 && nihssElig <= 17 &&        // incl. 2
    isolatedMevo &&                                                         // incl. 4 + escl. 1 (ICA/M1)
    input.tandem !== "yes" &&                                               // escl. 1 (stenosi ICA >70%)
    isValidNumber(input.aspects) && input.aspects >= 6 &&                   // incl. 5
    (input.aiIcvMl === undefined || input.aiIcvMl < 10) &&                  // incl. 5, "when available"
    (input.tmax6Ml === undefined || input.tmax6Ml > 30) &&                  // incl. 5, "when CTP is available"
    input.pregnancy !== "yes" &&                                            // escl. 3
    input.lifeExpectancyLt3m !== "yes" &&                                   // escl. 4
    input.severeContrastAllergy !== "yes"                                   // escl. 5
    // escl. 2 (ICH): implicita, la regola gira solo con strokeType === "ischemic"
    // NON usare input.lvo / input.candidate (vedi punto 9)
  );
}
```
Servirebbero inoltre, se il team decide di aggiungere lo studio:
- una voce in `TRIALS_INFO`, con lo `status` deciso dal team: il foglio dice aperto, il Drive "pendientes abrir";
- la funzione `reasonSailMevo` in `acute-reasons.ts`;
- la chiave in `AcuteEligibility` (`stores/eligibility.ts:11-30`, `:41-66`);
- la riga in `Summary.svelte:33`, come NiVO;
- eventualmente la mappatura in `sheet-payload.ts`.

## Problemi documentali
> [!warning] Contraddizione — mRS pre
> Protocollo: "Age 18–80; pre-stroke mRS 0–1" ([[SAIL-MeVO — Protocolo — V2.1]], p. 10, p. 28); sinossi CEIm: "mRS 0–1" ([[SAIL-MeVO — Sinopsis — V1.0]], §Población).
> Foglio [[Esquema ensayos — septiembre 2026]]: "SAIL MEVO … mRS 0-2". Lo stesso protocollo usa la covariata "Baseline mRS (0 vs 1–2)" (p. 13, p. 37). Da chiarire con il promotore.

> [!warning] Contraddizione — core e perfusione
> Protocollo V2.1: AI-ICV <10 mL **solo se disponibile**, e Tmax >6 s >30 mL se si fa la perfusione ([[SAIL-MeVO — Protocolo — V2.1]], p. 28).
> Sinossi CEIm V1.0: core IA <10 mL senza condizioni, nessun criterio di perfusione ([[SAIL-MeVO — Sinopsis — V1.0]], §Población). Il foglio non riporta nessuno dei due.

- **Foglio incompleto** rispetto al protocollo. Mancano:
  - il NIHSS a 30 min dall'IVT;
  - il punto medio del sonno;
  - AI-ICV e Tmax;
  - le esclusioni (tandem >70%, gravidanza, aspettativa di vita, allergia).

  Il foglio scrive "trombectomia sì", ma nello studio l'EVT è randomizzata. "Analitica pre: no" è coerente: non ci sono soglie, solo esami raccolti (p. 34).
- **Nomi diversi**: "SAIL-MeVO" (protocollo, CI), "SAILING-MEVO" (sinossi CEIm), "SAIL MEVO" (foglio).
- **Versioni**: sinossi CEIm 08-01-2026, CI paziente 28-04-2026, CI rappresentante 04-06-2026, protocollo V2.1 08-09-2026. La tabella "Summary of Changes" del protocollo è vuota (p. 2), quindi non si sa cosa sia cambiato dalla versione precedente.
- **CI**:
  - solo in inglese, nessuna versione in castellano o catalano;
  - il modulo del rappresentante resta in prima persona del paziente ([[SAIL-MeVO — CI representante — v1.2]], p. 5);
  - nessuno dei due cita i farmaci intra-arteriosi né il consenso d'emergenza.
- **Finestre delle visite** incoerenti nel protocollo: 90 giorni ±14, ±15 o ±30; 24 h come 12–48, 16–36 o 24 ± 12 h; giorno 5 o giorno 7 ([[SAIL-MeVO — Protocolo — V2.1]], p. 12–16, p. 32–36).
- **Gravidanza** esclusa solo nel corpo del protocollo, non nella sinossi interna (p. 10 contro p. 28).
- **Registro** non ancora assegnato (p. 1).

## Fonti
- [[SAIL-MeVO — Protocolo — V2.1]]
- [[SAIL-MeVO — Sinopsis — V1.0]]
- [[SAIL-MeVO — CI — v1.1]]
- [[SAIL-MeVO — CI representante — v1.2]]
- [[Esquema ensayos — septiembre 2026]] (stato)
