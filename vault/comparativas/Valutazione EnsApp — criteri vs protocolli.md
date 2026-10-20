---
tipo: comparativa
fuentes: ["[[Estado de los estudios]]", "[[Esquema ensayos — septiembre 2026]]", "[[ATHENA]]", "[[DO-IT]]", "[[DONE SYMPLE]]", "[[FASTEST]]", "[[NiVO]]", "[[ORION]]", "[[PIVOTAL]]", "[[REMEDY]]", "[[SOVATELTIDE]]", "[[TENACITY]]", "[[TICH-3]]", "[[TWIN2WIN-2]]", "[[VANISH]]", "[[WETRUST]]", "[[ARTEMIS]]", "[[HYBERNIA]]", "[[LIBREXIA]]", "[[MOSTE]]", "[[PROMISE20 RELOADED]]", "[[PROMISE20]]", "[[SHIONOGI]]", "[[MARRS]]", "[[DOAC-CVT]]", "[[SAIL-MeVO]]"]
actualizado: 2026-10-20
---
# Valutazione di EnsApp: criteri dell'app e protocolli

Questa nota è per il medico che gestisce l'app. Raccoglie le sezioni "Divergenze con EnsApp" delle schede in `ensayos/` e le verifica sul codice attuale. Il codice di `src/` è invariato dal commit `7818276`; HEAD è `a4dae47`. Le righe di codice citate valgono per questo stato.

Legenda: **[FN]** l'app scarta pazienti eleggibili · **[FP]** l'app propone pazienti non eleggibili · **[NC]** criterio non controllato · **[TXT]** errore solo nel testo informativo.

Stato nell'app al 2026-10-19 ([[Estado de los estudios]]):
- **chiusi**: [[MOSTE]], [[ARTEMIS]], [[LIBREXIA]], [[SHIONOGI]];
- **in pausa**, quindi non proposti: PROMISE (= [[PROMISE20 RELOADED]]), [[HYBERNIA]];
- **attivi**: tutti gli altri.

## 0. Correzioni applicate (2026-10-19)

| Commit | Correzione | Divergenze risolte |
|---|---|---|
| `ac10c24` | Nomi → chiavi (T2): confronto ignorando maiuscole, spazi e trattini | Registrazione rapida: 7 studi aperti ora salvati nel foglio dati; stato e link di randomizzazione di TWIN-2-WIN 2 e DONE SYMPLE |
| `071119a` | [[FASTEST]] alla Parte 2 del protocollo V10.5 | spot sign, causa secondaria, IVH estesa, ECG, anticoagulanti, bordo 2 h, etichette, scheda |
| `cce926f` | [[TICH-3]] | AVK ed eparina/EBPM terapeutica escluse, età ≥18, scheda |
| `7b77a2e` | [[ATHENA]] al protocollo v2.3 | 16 h, NIHSS 6–25, vasi, ASPECTS, tandem, tortuosità, scheda |
| `7ec19c0` | Finestre temporali (T1): orologio dell'app ogni 30 s, LTSW ricalcolato per regole, motivi e schede | Un trial esce dai risultati quando la finestra scade a paziente aperto. Resta a carico del medico che il limite di molti protocolli vale alla puntura, randomizzazione o dose |
| `fbba0ca` | Merge di `main`: [[SAIL-MeVO]] è ora nell'app (PR #12) | La scheda SAIL-MeVO usa anche lei il tempo aggiornato |
| secondo blocco | Scheda Imaging comune (T3), [[VANISH]] al protocollo v1.2, [[REMEDY]] (ASPECTS, LVO, ACE-inibitori) | Vaso, tandem e ASPECTS chiesti a tutti gli ischemici; VANISH 9 h, tandem, core/mismatch, ICA intracranica |
| `99d4582` (terzo blocco) | [[PIVOTAL]], [[TWIN2WIN-2]], [[NiVO]], [[ORION]], [[TENACITY]]; etichette dei vasi | Vasi, occlusione singola/territorio, tandem, ASPECTS, tortuosità; ORION NIHSS 5, mRS 86-90, perfusione oltre 6 h, EVT entro 1 h; TENACITY sopratentoriale e "ictus pregresso + diabete" |
| `9895f0a` (quarto blocco) | Tipo di ictus (T10), [[DONE SYMPLE]], [[DO-IT]], [[SOVATELTIDE]], [[WETRUST]], [[REMEDY]]; correzioni del controllo incrociato su [[ORION]], [[REMEDY]], [[PIVOTAL]], [[TICH-3]] | Nessun trial ischemico per un'emorragia e viceversa; DONE SYMPLE senza candidatura EVT, ICA/M1, core; DO-IT "a parte il DOAC" e 4 h 15 min; SOVATELTIDE diagnosi clinica e NIHSS 1a; WETRUST wake-up; REMEDY tronco/cervelletto; testi copiati (T7) corretti |
| `dd2f49f` (secondo controllo) | [[WETRUST]], [[DONE SYMPLE]], [[DO-IT]], [[ORION]], [[REMEDY]]; selezione dei trial | WeTrust non sparisce con l'emorragico; selezione dell'altro tipo ripulita; core DONE SYMPLE separato; antagonizzazione DOAC; perfusione "non eseguita" |

Le sezioni seguenti fotografano lo stato **prima** di queste correzioni; il dettaglio di cosa resta aperto è nel riquadro "Correzioni applicate" di ogni scheda.

## 1. Sintesi

- **Studi esaminati: 23.**
  - 14 attivi con documenti: [[ATHENA]], [[DO-IT]], [[DONE SYMPLE]], [[FASTEST]], [[NiVO]], [[ORION]], [[PIVOTAL]], [[REMEDY]], [[SOVATELTIDE]], [[TENACITY]], [[TICH-3]], [[TWIN2WIN-2]], [[VANISH]], [[WETRUST]].
  - 2 attivi senza documenti: SAFER-DOAC e NORA HOME.
  - 6 chiusi o in pausa.
  - [[MARRS]] (colonna "MARSS" nel foglio dati).
- **Negli studi attivi, 166 divergenze aperte**: **30 FN, 41 FP, 42 NC, 57 TXT**. Il totale dei tag è 170, perché 4 voci ne hanno due.
- **Negli studi chiusi o in pausa, 61 divergenze latenti**: 10 FN, 16 FP, 14 NC, 22 TXT (sezione 4).

I problemi più gravi:
1. **[[FASTEST]] applica i criteri della Parte 1, che è chiusa.** Lo spot sign non viene chiesto e la causa secondaria è ignorata. Il rFVIIa può quindi essere proposto oltre i 90 min senza spot sign, o in un'ICH traumatica o da MAV.
2. **[[TICH-3]] non esclude warfarin ed EBPM terapeutica.** La domanda c'è, ma la regola non la legge. Inoltre l'app propone TICH-3 e FASTEST insieme.
3. **[[VANISH]] non controlla la finestra di 9 h** (alteplasi intra-arteriosa), né il tandem, né il core/mismatch.
4. **[[ATHENA]] usa ancora i valori della v2.11**: 24 h invece di 16 h, NIHSS ≥8 invece di 6–25. Non controlla né il vaso né l'ASPECTS.
5. **Tutte le finestre temporali usano un LTSW "congelato".** È calcolato quando si compila la schermata pre-imaging e non si aggiorna. Inoltre si confronta con il momento della valutazione, mentre i protocolli fissano il limite alla puntura, alla randomizzazione o alla dose. Riguarda 13 studi attivi.
6. **[[TENACITY]]**: il diabete da solo esclude (FN). Con il mismatch vengono accettati il circolo posteriore e la ICA cervicale/tandem (FP con TNK).
7. **Falsi negativi sistematici per come è costruita l'interfaccia**:
   - [[REMEDY]] non è mai proposto entro 4,5 h;
   - [[DONE SYMPLE]] solo se il paziente è "candidato EVT";
   - [[DO-IT]] quasi mai, per la domanda "candidato IVT";
   - [[NiVO]] scarta la M2 non dominante.
8. **[[ORION]] è proposto anche se il foglio lo dà "en pausa".** Non controlla la EVT entro 1 h, il territorio né la perfusione oltre 6 h.

## 2. Problemi trasversali

Ogni problema ha una causa unica nel codice e riguarda più studi. I conteggi distinguono gli studi attivi da quelli latenti (chiusi o in pausa).

### T1. Finestra temporale: LTSW congelato e misurato nel momento sbagliato
**Verifica nel codice.**
- `PreImaging.svelte:26` calcola `ltswHrs = $derived(hoursSince(ltswDate))`. `Date.now()` non è reattivo, quindi il valore si ricalcola solo quando cambia `ltswDate` o quando la schermata viene riaperta. In `:36` il valore viene salvato in `preData.ltsw`.
- Leggono questo valore congelato:
  - tutte le regole acute (`stores/eligibility.ts:37-44`, merge `{...pre, ...post}`);
  - le regole emorragiche (`eligibility.ts:68-69`);
  - la visibilità delle schede FASTEST e TENACITY (`PostImaging.svelte:104`, `:107`);
  - LIBREXIA (`PostAcute.svelte:34`).
- `ltswHours` (`stores/patient.ts:82-86`) e `acuteInput` (`:89-91`) servono **solo** ai motivi di non eleggibilità nel Riepilogo (`Summary.svelte:9`, `:61`) e al campo `LTSW_h` della condivisione (`Share.svelte:125`). Motivi ed eleggibilità possono quindi contraddirsi.
- Nell'app non c'è un timer che aggiorni l'eleggibilità. L'unico `setInterval` controlla gli aggiornamenti dell'app (`main.ts:53`).

**Effetto.**
- **Limiti superiori** → FP: il paziente resta "eleggibile" anche a finestra scaduta.
- **Limiti inferiori** → FN: [[TENACITY]] e [[ORION]] (>4,5 h) e [[DONE SYMPLE]] (≥24 h). Un paziente inserito a 4 h resta "<4,5 h", quindi la scheda TENACITY non compare e ORION non risulta eleggibile.
- Anche con un valore aggiornato, il limite del protocollo vale **dopo**, non al momento della valutazione:
  - alla **puntura**: ATHENA (16 h), PIVOTAL (8 h e 120 min dall'imaging), TWIN2WIN-2, DONE SYMPLE (anche 90 min dalla TC), NiVO;
  - alla **randomizzazione**: DO-IT (4 h 15 min);
  - alla **dose o infusione**: FASTEST, TICH-3, SOVATELTIDE, ORION, REMEDY;
  - all'**arrivo**, cioè prima della valutazione: WETRUST.

**Studi toccati.**
- **13 attivi**: WETRUST, ATHENA, PIVOTAL, TWIN2WIN-2, DONE SYMPLE, SOVATELTIDE, ORION, NiVO, DO-IT, REMEDY, TENACITY, FASTEST, TICH-3.
- VANISH a parte: non controlla affatto la finestra (`acute-rules.ts:149-158`).
- **6 latenti**: ARTEMIS, HYBERNIA, MOSTE, PROMISE, SHIONOGI, LIBREXIA. Per LIBREXIA un paziente a 60 h può risultare "≤48 h".

### T2. Nomi visualizzati che non trovano la chiave in `trials-info.ts`
**Verifica nel codice.**
- `findTrialInfo` confronta il nome con la chiave, esatta o ignorando le maiuscole (`trials-info.ts:399-404`).
- `isTrialOpen` considera aperto ogni studio che non trova (`:410-413`).
- Il Riepilogo e la condivisione passano il nome visualizzato (`Summary.svelte:26`, `:29`, `:34`, `:42`, `:48`, `:53`; `Share.svelte:38`). Quattro nomi non trovano la chiave:

| Nome visualizzato | Chiave |
|---|---|
| "TWIN-2-WIN 2" | `Twin2Win2` |
| "DONE SYMPLE" | `DoneSymple` |
| "DO-IT" | `DOIT` |
| "TICH-3" | `TICH3` |

**Effetti.**
1. **Stato ignorato.** Se uno di questi 4 studi attivi venisse messo in pausa o chiuso, il Riepilogo continuerebbe a proporlo.
2. **Link di randomizzazione mancante.** `randomizationLinks` usa i nomi visualizzati (`trials-info.ts:361-362`), mentre la scheda dello studio cerca la chiave (`TrialsList.svelte:71`; `TrialDetail.svelte:14-15`, `:92-93`). Il pulsante non compare per **[[TWIN2WIN-2]] e [[DONE SYMPLE]]**.
3. **Dati persi nel foglio (nuovo rispetto alle schede).** La registrazione rapida usa le chiavi (`TrialPatient.svelte:74-76`, `:179-181`). `buildTrialsForSheet` cerca invece `NAME_TO_KEY`, che contiene solo i nomi visualizzati (`sheet-payload.ts:36-60`), e salta i nomi sconosciuti (`:87`).
   - Per **7 studi aperti** la colonna resta "no": `Twin2Win2`, `DoneSymple`, `DOIT`, `TICH3`, `Sovateltide`, `Orion`, `SaferDoac`. Per SAFER-DOAC c'è anche l'azzeramento esplicito (`:95`).
   - La scheda [[TWIN2WIN-2]] (punto 8) descriveva solo il proprio caso.
   - Il percorso Riepilogo → Condivisione usa i nomi visualizzati e funziona.

### T3. Campi chiesti solo in alcune schede di PostImaging; dipendenza da "candidato a trombectomia"
**Verifica nel codice.** `lvo` deriva dalla risposta "Candidato a trombectomia (EVT)?" (`PostImaging.svelte:27`). I campi si vedono solo in tre schede, ognuna con la sua condizione:

| Scheda | Quando compare | Campi |
|---|---|---|
| EVT | solo con "Eleggibile" (`:102`, `:163-181`) | vasi, tandem, tortuosità, ASPECTS |
| Non-EVT | con "Non eleggibile" (`:182-187`) | solo `lesionConfirmed` |
| TENACITY | non candidato e LTSW (congelato) fra 4,5 e 72 h (`:106-108`, `:190-222`) | perfusione, vasi, ASPECTS, core, `contraTpa`, diabete |

`contraTpa` vale "no" di default (`:43`).

**Effetti.**
- [[REMEDY]]:
  - [FN] entro 4,5 h l'ASPECTS non si può inserire, quindi lo studio non è mai proposto;
  - [FP] nel non candidato la LVO esclusa dal protocollo non viene vista se il vaso non è inserito.
- [[ORION]] [FN]: per i non candidati a EVT i vasi si chiedono solo nella scheda TENACITY, che è facoltativa.
- [[DONE SYMPLE]]:
  - [FN] serve "candidato EVT = Eleggibile", che a 24–72 h è proprio la risposta che fuori studio non si dà;
  - [FP] il core ≤70 cc non viene chiesto.
- [[TENACITY]] [FP]: nella sua scheda il tandem non viene chiesto.
- Core e perfusione esistono solo come campi TENACITY, con soglie TENACITY. Non servono per i criteri di core o mismatch degli altri studi: [[VANISH]] (core ≤70 / mismatch >1,2), [[ATHENA]] (core ≤50 in alternativa all'ASPECTS), [[PIVOTAL]] (core automatico), [[ORION]] (perfusione oltre 6 h).

**Studi toccati.**
- **7 attivi**: REMEDY, ORION, DONE SYMPLE, TENACITY, VANISH, ATHENA, PIVOTAL.
- **Latenti**: MOSTE (FN di flusso), ARTEMIS (core ≤50).
- Fuori dall'app: è il vincolo principale per un'eventuale regola [[SAIL-MeVO]] (sezione "Proposta per EnsApp", punto 9).

### T4. Campi chiesti ma non usati dalla regola, o usati da un solo studio
Verifica in `acute-rules.ts` e `hemorrhagic-rules.ts`:

- **tandem**: chiesto nella scheda EVT e letto **solo** da ATHENA (`acute-rules.ts:144`), dove esclude più del protocollo (FN).
  - Ignorato dove il protocollo lo esclude: [[VANISH]] (escl. 12), [[PIVOTAL]] (escl. 1k), [[NiVO]] (escl. 10). Sono FP. Vedi [[Oclusión en tándem]].
- **tortuosità**: letta solo da ATHENA (`:145`, FN); ignorata da PIVOTAL (FP minore) e da MOSTE (latente).
- **ASPECTS**: compilato nella scheda EVT ma ignorato da ATHENA, PIVOTAL e TWIN2WIN-2 (FP) e da MOSTE (latente). Lo usano NiVO, ARTEMIS, HYBERNIA, REMEDY e TENACITY.
- **causa secondaria** (obbligatoria nella scheda emorragica): la usa solo TICH-3 (`hemorrhagic-rules.ts:89`), FASTEST la ignora (FP).
- **anticoagulante** (scheda emorragica): lo usa solo FASTEST (`:73`), TICH-3 lo ignora (FP).
- **DOAC**: lo usa solo DO-IT (`acute-rules.ts:307`). ORION e TENACITY non lo leggono, anche se i loro protocolli escludono i DOAC nelle 48 h (NC).
- **controindicazioni alla trombolisi** (`contraTpa`): la usano ORION e TENACITY, VANISH no.

Studi toccati: **9 attivi** (ATHENA, VANISH, PIVOTAL, NiVO, TWIN2WIN-2, FASTEST, TICH-3, ORION, TENACITY); latente MOSTE.

### T5. Selettore dei vasi (`vessels.ts`, `computeVesselFlags` in `acute-rules.ts:79-119`)
- **ICA intracranica non terminale** (`ica-intracranial`, "Intracranial ICA (no T)"): non attiva [[VANISH]] (`:81`) né [[PIVOTAL]] (`:82-85`). È un FN, perché i protocolli dicono "intracranial ICA". Latenti: PROMISE (`:106-110`) e MOSTE (`:86-90`, protocollo ambiguo).
- **M2 non dominante: non selezionabile.** Esistono solo "M2 proximal/dominant" e "Any M2" (`vessels.ts:15-16`).
  - [[NiVO]] [FN]: nessuna delle due attiva il flag (`:111-117`).
  - "Any M2" comprende anche la M2 dominante. MOSTE accetta così la M2 isolata (FP latente).
  - [[PIVOTAL]] [FN]: esclude ogni M2 e la VA.
- **Codici troppo ampi**: ">M2", ">A2" e ">P2" (`vessels.ts:17`, `:20`, `:24`) comprendono M4, A4–A5 e P4. Per [[NiVO]] è un FP minore; per una regola [[SAIL-MeVO]] sarebbe un FP vero.
- **Codici mancanti**:
  - ICA extracranica: [[TENACITY]] (FP);
  - vertebrale intracranica distinta dall'extracranica: [[PIVOTAL]];
  - M1 prossimale distinta dalla distale: [[TWIN2WIN-2]] (NC).
- **Logica OR, senza contare i vasi.** Solo NiVO conta i vasi selezionati (`:194`); ORION chiede "almeno un vaso qualsiasi" (`:298`).
  - Occlusioni in più territori accettate: [[PIVOTAL]], [[TWIN2WIN-2]], [[ORION]] (attivi); ARTEMIS, MOSTE, PROMISE, HYBERNIA (latenti).
- **Nessun controllo del vaso**:
  - [[ATHENA]] (`:135-147`): bastano basilare, P1, A1 o "Any M2";
  - [[DONE SYMPLE]] (`:254-264`): passa anche il circolo posteriore;
  - [[TENACITY]], nella via con perfusione (`:378`, `:392`): non verifica la sede sopratentoriale.

Studi toccati: **8 attivi** (VANISH, PIVOTAL, NiVO, TENACITY, TWIN2WIN-2, ORION, ATHENA, DONE SYMPLE); **4 latenti**.

### T6. Co-arruolamento: l'app propone insieme studi che si escludono
**Verifica nel codice.** Non esiste alcuna logica di co-arruolamento (nessuna occorrenza in `src/`). Il Riepilogo permette di selezionare più studi insieme (`Summary.svelte:47-49`, `:56-58`). Le regole permettono queste combinazioni:

- **[[FASTEST]] + [[TICH-3]]**: ICH <2 h con età 18–80, mRS ≤2, GCS ≥8 e volume 2–59 mL. FASTEST esclude procoagulanti e TXA (escl. 12) e altri studi negli ultimi 30 giorni (escl. 16).
- **[[SOVATELTIDE]] + [[REMEDY]] + [[TENACITY]] + [[ORION]]**, tutti insieme. Esempio: paziente non candidato a EVT, 4,5–24 h, M2 con ASPECTS ≥9, NIHSS 8–15, mRS ≤1. SOVATELTIDE (escl. 6), REMEDY (escl. 17) e TENACITY (escl. 34) escludono la partecipazione ad altri studi.
- **Studi EVT con M1**: [[ATHENA]], [[PIVOTAL]], [[TWIN2WIN-2]] e [[VANISH]], più ORION oltre 4,5 h. ATHENA e PIVOTAL escludono gli altri studi interventistici.
- **[[NiVO]] + ORION** nelle occlusioni distali. NiVO esclude la partecipazione a un altro studio (escl. 13).
- Fuori dall'app: [[SAIL-MeVO]] e NiVO si sovrappongono.
- Latente: HYBERNIA (escl. 15).
- [[PROMISE20 RELOADED]] invece **ammette** il co-arruolamento.

Studi toccati: **9 attivi** (FASTEST, TICH-3, SOVATELTIDE, REMEDY, TENACITY, ORION, NiVO, ATHENA, PIVOTAL).

### T7. Testi di `trials-info.ts` copiati da altri studi o sbagliati
Verificati riga per riga:

| Studio | Righe | Errore |
|---|---|---|
| [[DONE SYMPLE]] | `:143`, `:148`, `:150` | "IA tPA" preso da VANISH. Il protocollo **vieta** i fibrinolitici intra-arteriosi |
| [[SOVATELTIDE]] | `:221` | imaging simile al testo di LIBREXIA |
| [[SOVATELTIDE]] | `:225-226` | schema di dosi e "5-day … 90 min" senza base nel protocollo |
| [[SOVATELTIDE]] | `:226` | esclusioni di VANISH |
| [[SOVATELTIDE]] | `:227` | visite che ricalcano ORION |
| [[TWIN2WIN-2]] | `:111` | visite di HYBERNIA (48 h, G3–10, G30) |
| [[VANISH]] | `:157` | "ASPECTS ≥4" senza base documentale |
| [[VANISH]] | `:159` | M2 e DSA, che il protocollo non prevede |
| [[VANISH]] | `:163` | "stenting defer >24 h" |
| [[ORION]] | `:235` | "thrombolytic: Yes" e un'ora contata dalla fine dell'infusione |
| SHIONOGI (latente) | `:191` | elezanumab, cioè lo studio ABBVIE |
| SHIONOGI (latente) | `:187` | imaging di ABBVIE |
| SHIONOGI (latente) | `:188`, `:192` | regola delle 24 h, che il foglio attribuisce a LIBREXIA |
| PROMISE (latente) | `:89`, `:96` | "thrombectomy device"; BraiN20 è un monitoraggio dei PES N20 |

Studi toccati: **5 attivi**; 2 latenti.

### T8. Consenso, visite ed esami: campi sbagliati o vuoti
- **"Written & oral/phone consent."** compare in 7 voci (`trials-info.ts:50`, `:63`, `:76`, `:104`, `:132`, `:145`, `:321`). L'orale o telefonico non è previsto dai protocolli né dai CI in Drive.
  - Attivi (5): [[ATHENA]], [[PIVOTAL]], [[TWIN2WIN-2]], [[DONE SYMPLE]], [[TENACITY]].
  - Latenti: MOSTE, HYBERNIA.
- **"Written."** è invece più restrittivo del protocollo per PROMISE (`:91`) e ARTEMIS (`:119`), entrambi latenti.
- **Consenso vuoto o generico** ("—" o "Per local practice"):
  - WETRUST (`:35`): il CI prevede il consenso differito;
  - VANISH (`:158`), FASTEST, TICH-3, NiVO, DO-IT, REMEDY.
- **`visits: null`** in 12 voci (`:42`, `:98`, `:165`, `:178`, `:240`, `:253`, `:266`, `:283`, `:299`, `:315`, `:334`, `:351`).
  - 9 attivi documentati: WETRUST, VANISH, ORION, FASTEST, TICH-3, NiVO, DO-IT, REMEDY, TENACITY.
  - Più SAFER-DOAC e NORA HOME.
- **Visite sbagliate** negli attivi:
  - TWIN2WIN-2: visite di un altro studio;
  - DONE SYMPLE: manca il G30;
  - SOVATELTIDE;
  - PIVOTAL: G90 indicato per telefono, il protocollo lo preferisce in presenza.
- **`preEvtLabs: "No."` errato** in 6 attivi:

| Studio | Riga | Esame previsto dal protocollo |
|---|---|---|
| DO-IT | `:293` | test di gravidanza |
| DONE SYMPLE | `:149` | glicemia, gravidanza, coagulazione |
| REMEDY | `:309` | gravidanza su siero, eGFR |
| TENACITY | `:326` | glicemia, gravidanza |
| VANISH | `:162` | gravidanza |
| TWIN2WIN-2 | `:108` | INR, piastrine |

  Latente: MOSTE (`:54`). Il "No." è invece corretto per ARTEMIS, ATHENA, PIVOTAL, NiVO e WETRUST.

### T9. Confini (`<` contro `<=`) ed età
- **Età `> 18` invece di `>= 18`**:
  - [[TWIN2WIN-2]] (`acute-rules.ts:215`, FN);
  - SHIONOGI (`:269`, latente);
  - NORA HOME (`:319`), il cui testo dice invece ">= 18 y" (`trials-info.ts:339`).
  - Solo nel testo: VANISH (`trials-info.ts:157`, la regola è corretta), Twin2Win2 (`:103`), Shionogi (`:185`).
- **Età ≥18 non controllata**: [[TICH-3]] (`hemorrhagic-rules.ts:82-91`) e MOSTE (latente).
- **Bordi**:

| Studio | App | Protocollo | Effetto |
|---|---|---|---|
| [[ORION]] | NIHSS `> 5` (`:297`) | ≥5 | FN |
| [[PIVOTAL]] | `< 8` | "within 8 h" | bordo |
| [[TWIN2WIN-2]] | `< 24` | "dentro de las 24 h" | bordo |
| [[WETRUST]] | `<= 6` | `< 6`, all'arrivo | bordo |
| [[TICH-3]] | volume `< 60` | ">60 mL (±10%)" | FN di bordo |
| [[FASTEST]] | scheda visibile con `< 2` (`PostImaging.svelte:104`) | la regola accetta `<= 2` (`hemorrhagic-rules.ts:48`) | FN a 2,0 h |
| MOSTE (latente) | `< 23` | "≤23 h" | bordo |

Studi toccati: **6 attivi**; latenti MOSTE e SHIONOGI.

### T10. Il tipo di ictus non è controllato dalle regole (nuovo)
**Verifica nel codice.**
- Nessuna regola legge `strokeType`: non c'è in `acute-rules.ts`, in `stores/eligibility.ts` né nel filtro di `Summary.svelte:47-49`.
- `PostImaging.svelte:64-80` riscrive in `postData` candidatura, vasi, ASPECTS e IVT anche quando si passa a "emorragico".

**Effetto.**
- Se si compila prima come ischemico e poi si cambia tipo, gli studi ischemici restano nell'elenco. La scheda [[DO-IT]] (punto 5) lo segnalava per il suo caso.
- Anche nel percorso diretto "emorragico" passa **NORA HOME** (età >18 e NIHSS <5). WeTrust passa per scelta di disegno, perché è pre-imaging.
- La frase "l'emorragia è filtrata dal tipo di ictus nell'interfaccia", presente in molte schede, è vera solo nel percorso diretto.

### T11. Ictus al risveglio o esordio ignoto: manca l'ora della scoperta
**Verifica nel codice.** `wakeupStroke` è letto solo da WeTrust (`acute-rules.ts:122-124`). L'opzione "sintomi entro 6 h" viene calcolata dal LSW (`PreImaging.svelte:27`), non dall'ora della scoperta.

Studi toccati (4 attivi):
- [[WETRUST]]: l'estensione a 12 h non si raggiunge mai (FN);
- [[DO-IT]]: manca la via DWI-FLAIR;
- [[TICH-3]]: il protocollo conta dalla scoperta;
- [[VANISH]]: il protocollo conta dal punto medio del sonno.

Inoltre [[SAIL-MeVO]]. Vedi [[Ictus del despertar]].

### T12. Risposte predefinite "no" trattate come verifiche
- `contraTpa` vale "no" di default (`PostImaging.svelte:43`). Nel percorso EVT ORION risulta così sempre "senza controindicazioni"; anche per TENACITY il "no" predefinito non è una verifica.
- TICH-3: "IVH isolata" ed "Esclusione TXA" partono da "no" (`:52`, `:54`). Se nessuno apre il toggle, il paziente risulta eleggibile.
- Tandem e tortuosità partono da "no" (`:30-31`, `:70-71`).

Studi toccati (4 attivi): ORION, TENACITY, TICH-3, ATHENA.

### T13. Un solo NIHSS, quello d'ingresso; la voce 1a non viene chiesta
**NIHSS d'ingresso usato dove il protocollo ne chiede un altro:**
- [[REMEDY]]: NIHSS dopo ≥6 h dalla trombolisi, con miglioramento <4 punti;
- [[ORION]]: NIHSS da ripetere se sono passati ≥60 min;
- latenti: LIBREXIA (NIHSS alla randomizzazione) e SHIONOGI (stabilità).

**Voce 1a non chiesta:**
- [[SOVATELTIDE]] (1a <2);
- [[WETRUST]] (1a >1, che il testo chiama "low GCS");
- latenti: HYBERNIA e SHIONOGI.

### T14. Esclusioni cliniche non modellate e messaggi troppo sicuri
Quasi tutte le schede elencano esclusioni cliniche non modellate. È una scelta di progetto, ma il medico non viene avvisato:
- `notes: []` in [[TWIN2WIN-2]], [[DONE SYMPLE]] e [[VANISH]];
- il messaggio WeTrust "E' possibile procedere alla randomizzazione" (`i18n/it.ts:124`) è troppo forte per una regola che non controlla nessuna esclusione.

## 3. Studio per studio (attivi, dal più grave)

| Studio | FN | FP | NC | TXT | Errore principale |
|---|---|---|---|---|---|
| [[FASTEST]] | 5 | 6 | 1 | 2 | Criteri della Parte 1 chiusa (niente spot sign), causa secondaria ignorata |
| [[TICH-3]] | 3 | 3 | 4 | 2 | Warfarin/EBPM non escludono: la domanda c'è, la regola non la legge |
| [[VANISH]] | 1 | 3 | 3 | 7 | Finestra di 9 h non controllata; tandem e core ignorati |
| [[ATHENA]] | 3 | 4 | 1 | 4 | Valori v2.11 (24 h, NIHSS ≥8); vaso e ASPECTS non controllati |
| [[ORION]] | 2 | 5 | 2 | 5 | EVT entro 1 h, territorio e perfusione >6 h non controllati; foglio "en pausa" |
| [[TENACITY]] | 2 | 4 | 1 | 4 | Diabete da solo esclude; posteriore/ICA cervicale accettati con TNK |
| [[DONE SYMPLE]] | 1 | 3 | 3 | 6 | Solo se "candidato EVT"; core e sede non controllati; testo "IA tPA" vietato |
| [[REMEDY]] | 3 | 1 | 4 | 2 | Mai proposto entro 4,5 h; LVO non esclusa se il vaso non è inserito |
| [[DO-IT]] | 3 | 2 | 5 | 4 | "Candidato IVT?" esclude proprio i pazienti in DOAC |
| [[PIVOTAL]] | 1 | 4 | 3 | 3 | M2, VA e ICA non-T scartate; ASPECTS, tandem e occlusioni multiple ignorati |
| [[TWIN2WIN-2]] | 2 | 2 | 6 | 3 | Più territori e ASPECTS non controllati; nome non risolto (stato, link, foglio) |
| [[NiVO]] | 1 | 3 | 3 | 5 | M2 non dominante non selezionabile; tandem ignorato |
| [[WETRUST]] | 2 | 1 | 2 | 4 | Estensione wake-up 6–12 h che non funziona |
| [[SOVATELTIDE]] | 1 | 0 | 4 | 6 | Lesione all'imaging richiesta (il protocollo accetta la diagnosi clinica); testi copiati |
| **Totale** | **30** | **41** | **42** | **57** | 166 voci (4 con due tag) |

### [[FASTEST]]
- **[FP] Spot sign non chiesto.** Fra 90 e 120 min la Parte 2 richiede lo spot sign positivo; l'app usa solo `ltsw <= 2` (`hemorrhagic-rules.ts:48`) e non ha il campo. Applica di fatto la Parte 1, chiusa ([[FASTEST — Protocolo — V10.5]], p. 26).
- **[FP] Causa secondaria ignorata.** `secondaryCause` è obbligatorio nell'interfaccia, ma `fastest()` non lo legge. Risultano eleggibili ICH traumatiche, da MAV, aneurisma o tumore (escl. 2, p. 26).
- **[FP]/[FN] "IVH score conocido?".** Si chiede se lo score è **noto** (`:72`), non quanto è estesa l'IVH (escl. 4). Un'IVH massiva con score noto passa; un paziente senza IVH e senza score calcolato viene scartato.
- **[FN] "Anomalías ECG?" troppo larga.** Esclude qualunque anomalia (`:68`); il protocollo esclude solo il sopraslivellamento ST ischemico (escl. 7).
- **[FP] Finestra congelata** (T1): `hemEligibility` usa `$pre.ltsw` (`eligibility.ts:68-69`). Il limite vale alla dose.

### [[TICH-3]]
- **[FP] Warfarin ed EBPM terapeutica non escludono.** `tich3()` non legge `anticoag` (`hemorrhagic-rules.ts:82-91`); i DOAC vanno invece lasciati ammessi (escl. iii, p. 25).
- **[NC] Proposto insieme a FASTEST**, senza avviso (T6).
- **[FN] Esordio ignoto contato dall'LTSW** invece che dalla scoperta (p. 25–26; T11).
- **[FP] Finestra congelata.** Un paziente inserito a 4 h resta eleggibile anche a 5 h (T1).
- **[FN] "IVH isolata" esclude.** È un criterio dell'app, non del protocollo. Lo stesso toggle alimenta l'ICH score, dove significa IVH presente: chi lo accende per un'estensione ventricolare esclude per errore il paziente (`PostImaging.svelte:227`).

### [[VANISH]]
- **[FP] Finestra di 9 h non controllata.** `vanish()` non usa `ltsw` (`acute-rules.ts:149-158`): un paziente a 20 h risulta eleggibile per l'alteplasi intra-arteriosa ([[VANISH — Protocolo — v1.2]], p. 17).
- **[FP] Tandem non escluso.** Il campo c'è, ma la regola non lo legge (escl. 12, p. 18).
- **[FP] Core ≤70 mL e mismatch >1,2 non controllati** (incl. 8–9, p. 17).
- **[FN] ICA intracranica non-T esclusa** (`:81`; incl. 7).
- **[TXT]** "ASPECTS ≥4" (`trials-info.ts:157`) non è nel protocollo; "weight-bearing M2" e DSA nemmeno (`:159`).

### [[ATHENA]]
- **[FP] 24 h invece di 16 h alla puntura** (`acute-rules.ts:142`; [[ATHENA — Protocolo — v2.3]], p. 33). Sono i valori della v2.11 superata.
- **[FN] NIHSS ≥8 invece di ≥6** (`:140`); **[FP]** il tetto di 25 non è controllato.
- **[FP] Vaso non controllato.** Non esiste un flag ATHENA: bastano basilare, P1, A1, "Any M2" o più vasi.
- **[FP] ASPECTS e core non controllati** (incl. 9, p. 34).
- **[FN] Tandem e tortuosità troppo stretti.** Qualunque tandem o tortuosità esclude; il protocollo esclude solo il tandem che richiede trattamento o impedisce l'accesso, e la tortuosità che impedisce l'accesso alla ICA (escl. 19, 23).

### [[ORION]]
- **[FP] Stato.** Il foglio dice "en pausa" (Parte 2 in attesa; la v3.1 la rinvia all'analisi finale della Parte 1); l'app lo propone. Il team ha scelto di non cambiarlo ([[Estado de los estudios]]).
- **[FP] EVT disponibile entro 1 h non controllata** (escl. 3, [[ORION — Protocolo — v2.2]], p. 48). Il selettore dei vasi compare soprattutto nei candidati a EVT, cioè proprio negli esclusi.
- **[FP] Qualunque vaso e più territori accettati** (`acute-rules.ts:298`): anche basilare e VA.
- **[FP] Oltre 6 h la perfusione non viene chiesta** (incl. 4–5, p. 46–47). **[FP]** fra 86 e 90 anni si accetta mRS 1.
- **[FN] NIHSS 5 escluso** (`:297`). I non candidati a EVT, che sono la popolazione principale, passano solo dalla scheda TENACITY (T3).

### [[TENACITY]]
- **[FN] Il diabete da solo esclude** (`acute-rules.ts:398`). Il protocollo esclude solo "prior stroke and concomitant diabetes" (escl. 21, [[TENACITY — Protocolo — V1.0]], p. 32).
- **[FP] Sede sopratentoriale non verificata** con la perfusione positiva: basilare, vertebrale, tronco e cervelletto passano (`:378`, `:392`).
- **[FP] ICA cervicale e tandem non rilevati**: manca il codice (`:369-371`; escl. 2).
- **[FP] Via c senza vincolo di centro.** È ammessa solo nei centri senza perfusione (p. 30, p. 46).
- **[NC] Controindicazioni alla TNK ridotte a una domanda**, con "no" predefinito; il DOAC non è usato (T12).

### [[DONE SYMPLE]]
- **[FN] Valutato solo se "candidato EVT = Eleggibile"** (`acute-rules.ts:262`; `PostImaging.svelte:27`). Oltre le 24 h la EVT non è lo standard ([[DONE SYMPLE — Protocolo — v4]], p. 14).
- **[FP] Core ≤70 cc non controllato** (incl. 8, p. 36).
- **[FP] Circolo posteriore accettato** (p. 12, p. 32).
- **[TXT] "IA tPA" copiato da VANISH** (`trials-info.ts:143`, `:148`, `:150`). Il protocollo **vieta** i fibrinolitici intra-arteriosi (p. 42).
- **[NC] Nome non risolto**: stato ignorato e pulsante di randomizzazione assente (T2).

### [[REMEDY]]
- **[FN] Mai proposto entro 4,5 h.** L'ASPECTS è obbligatorio (`acute-rules.ts:339-340`), ma nel non candidato a EVT compare solo nella scheda TENACITY, cioè oltre 4,5 h.
- **[FP] LVO esclusa solo se il vaso è inserito.** Nel non candidato a EVT il selettore di solito non compare (escl. 2, [[REMEDY — Protocolo — V6.2]], p. 38).
- **[FN] ACE-inibitori.** L'app esclude chiunque li assuma; il protocollo esclude solo l'ultima dose <24 h (o <48 h con eGFR <45) e chi non può sostituirli (p. 38).
- **[NC] Condizioni dopo trombolisi non verificate**: rivalutazione ≥6 h dopo, NIHSS pre ≤15. **[NC] Ictus del tronco o del cervelletto non esclusi.**

### [[DO-IT]]
- **[FN] La domanda "Candidato a trombolisi (IVT)?" esclude proprio i pazienti dello studio.** In DOAC <48 h lo standard dice "no"; il protocollo esclude le controindicazioni all'IVT "with the exception of recent DOAC intake" ([[DO-IT — Protocolo — v2.0]], p. 31).
- **[FN] Ultima dose del DOAC ignota** non prevista dalla domanda (I3).
- **[FN] Via DWI-FLAIR all'esordio ignoto** non prevista. Il foglio dice "wake-up excluidos": da chiarire.
- **[FP] La randomizzazione avviene entro 4 h 15 min**, ma l'app accetta fino a ≤4,5 h (p. 31, p. 40).
- **[FP] Stato residuo dopo il cambio a "emorragico"** (T10).

### [[PIVOTAL]]
- **[FN] Esclusi M2, vertebrale e ICA non-T** (`acute-rules.ts:82-85`). Il protocollo li ammette e il testo dell'app li elenca ([[PIVOTAL — Protocolo — Rev 03]], p. 41).
- **[FP] ASPECTS <6 e PC-ASPECTS non controllati** (escl. 1c).
- **[FP] Tandem non escluso** (escl. 1k). **[FP] Occlusioni multiple accettate** (escl. 1j).
- **[NC] Finestra di 8 h alla puntura e 120 min dall'imaging** non verificati (T1).

### [[TWIN2WIN-2]]
- **[FP] Occlusioni in più territori accettate** (`acute-rules.ts:91-94`; [[TWIN2WIN-2 — Protocolo — V2]], p. 5–6).
- **[FP] ASPECTS <6 in TC (<5 in RM) non controllato.**
- **[FN] Età `> 18`** invece di ≥18 (`:215`).
- **[NC] Problemi tecnici di nome** (T2): stato ignorato, pulsante di randomizzazione assente, registrazione rapida non salvata nel foglio.
- **[TXT] Visite di HYBERNIA** (`trials-info.ts:111`); il braccio di controllo SS-EVT non è citato.

### [[NiVO]]
- **[FN] La M2 non dominante non è selezionabile come vaso NiVO** (`acute-rules.ts:111-117`; `vessels.ts:15-16`). È il caso MeVO più frequente ([[NiVO — Sinopsis — v2.0]], p. 7).
- **[FP] Tandem ignorato** (escl. 10).
- **[FP] Finestra alla procedura**, non alla valutazione. **[FP]** ">A2" e ">P2" vanno oltre A3 e P3.
- **[NC] Co-arruolamento** (escl. 13) e MeVO secondaria non distinta dalla primaria.
- **Fonte**: solo la sinossi. Il protocollo completo non è in Drive.

### [[WETRUST]]
- **[FN] Estensione per l'ictus al risveglio rotta.** "Sintomi entro 6 h" viene calcolato dal LSW (`PreImaging.svelte:27`): la soglia di 12 h non si raggiunge mai ([[WETRUST — Protocolo — Rev 09]], p. 59).
- **[FN]/[FP] Tempo calcolato "adesso" e con `<=`.** Il protocollo usa `<` e lo misura all'arrivo.
- **[NC] Nessuna esclusione modellata.** Il messaggio "E' possibile procedere alla randomizzazione" è troppo forte.
- **[TXT] "low GCS"**: il criterio è il NIHSS 1a >1. Consenso "—" (il CI prevede il consenso differito). `visits: null`.

### [[SOVATELTIDE]]
- **[FN] Richiesta una lesione confermata all'imaging** (`acute-rules.ts:284`). Il protocollo accetta la diagnosi clinica con TC/RM senza emorragia ([[SOVATELTIDE — Protocolo — v3.1]], p. 62).
- **[NC] Voce NIHSS 1a <2 non chiesta**; finestra alla prima dose; co-arruolamento con REMEDY, TENACITY e ORION.
- **[TXT] Trombolisi "No."**: il protocollo la ammette e stratifica la randomizzazione su di essa (p. 51–52).
- **[TXT] Schema di dosi errato.** Sono 3 dosi a 3 ±1 h nei giorni 1, 3 e 6; il "5-day … 90 min" è inventato. Esclusioni copiate da VANISH, visite errate.

### Studi attivi senza documenti
- **SAFER-DOAC** (vedi [[DOAC-CVT]]):
  - non ha documenti in Drive e **non corrisponde a DOAC-CVT**, che è un registro della trombosi venosa cerebrale;
  - nell'app non ha né regola né motivi; esiste solo l'avviso "DOAC → angio-TC del torace e livelli" (`PreResult.svelte:51-67`);
  - è `active` (`trials-info.ts:168`) e selezionabile a mano, ma la registrazione rapida non lo salva nel foglio (T2).
- **NORA HOME**:
  - **non c'è alcun documento** in Drive né nel foglio: le divergenze non sono valutabili;
  - la regola è solo "età > 18 e NIHSS < 5" (`acute-rules.ts:318-320`), senza controllo del tipo di ictus (T10);
  - le note dicono "virtually any patient" (`trials-info.ts:348`).

## 4. Studi chiusi o in pausa: cosa correggere prima di riaprirli

Oggi queste divergenze sono latenti: gli studi non vengono proposti (`isTrialOpen`, `trials-info.ts:410-413`). Totale: 61 voci (10 FN, 16 FP, 14 NC, 22 TXT). Sono esclusi i 2 punti già risolti sullo stato, in ARTEMIS e MOSTE.

- **[[MOSTE]]** (chiuso; 12 voci: FN 3, FP 6, TXT 4):
  - controllare l'ASPECTS ≥6;
  - escludere la M2 isolata;
  - escludere più territori e la tortuosità;
  - aggiungere l'età ≥18;
  - togliere la dipendenza da "candidato EVT";
  - chiarire la ICA non-T con il promotore;
  - usare ≤23 h alla randomizzazione;
  - testi: consenso, imaging, esami, G90 in presenza.
- **[[ARTEMIS]]** (chiuso; 9 voci: FP 3, NC 3, TXT 3):
  - occlusione singola e un solo territorio;
  - core ≤50 cc in valutazione automatica;
  - finestra alla puntura;
  - nota sul tandem in sala;
  - consenso (remoto, differito, orale con CEIm);
  - visite (non esiste un G30; manca il G5; G90 in presenza).
- **[[LIBREXIA]]** (chiuso; 15 voci: FN 5, FP 4, NC 1, TXT 5). È il caso più grave: la logica post-acuta va riscritta.
  - ABCD2 ≥6 solo per l'AIT;
  - ramo AIT possibile;
  - "causa aterotrombotica" non obbligatoria;
  - NIHSS alla randomizzazione;
  - LTSW aggiornato (oggi congelato all'ingresso);
  - mRS ≤2;
  - 24 h dalla fine di IVT/EVT;
  - esclusione delle emorragie;
  - INR e aPTT solo dopo il trattamento.
- **[[SHIONOGI]]** (chiuso; 8 voci):
  - riscrivere tutta la scheda informativa, che descrive elezanumab (ABBVIE) e regole di LIBREXIA;
  - NIHSS 8–22, non 6–22;
  - escludere anche i candidati IVT;
  - età ≥18;
  - escludere la sede infratentoriale.
  - Non riusare la voce per ABBVIE senza ricontrollarla.
- **PROMISE / [[PROMISE20 RELOADED]]** (in pausa; 8 voci). La voce `PROMISE` descrive RELOADED, non [[PROMISE20]] (chiuso, NIHSS ≥6).
  - ammettere la ICA intracranica non-T;
  - escludere più territori;
  - note sulle esclusioni del dispositivo: pacemaker o impianti, ictus pregresso, premenopausa (regola "≥55 anni" del foglio da confermare);
  - intervento: "monitoraggio PES N20 con BraiN20", non dispositivo di trombectomia;
  - consenso scritto, orale, telefonico o differito;
  - note su anestesia (niente alogenati né benzodiazepine) e registrazione entro 30 min.
- **[[HYBERNIA]]** (in pausa; 9 voci: NC 6, TXT 3):
  - avvisare che eleggibilità e consenso vengono **dopo** la riperfusione (mTICI 2a–3);
  - limite di 150 min dall'imaging;
  - puntura entro 24 h;
  - NIHSS 1a >1;
  - ematocrito <33%;
  - co-arruolamento;
  - testi: consenso scritto, visite a 48 h e G30, aspirazione ammessa.
- **[[MARRS]]**: c'è solo la colonna "MARSS" del foglio dati (`sheet-payload.ts:9`, `:38`). Non va rinominata senza allineare il foglio Google e il test.

## 5. Priorità di correzione proposte

Complessità: bassa (una regola o un testo), media (regola + interfaccia + test), alta (flusso dell'interfaccia). Ogni cambio di regola richiede di aggiornare `tests/domain/acute-rules.test.ts`, `hemorrhagic-rules.test.ts` e le fixture `golden-cases.json`.

### P1. Sicurezza e falsi positivi gravi
1. **Finestra temporale aggiornata e ancorata al protocollo** (T1): ricalcolare il LTSW al momento del Riepilogo e mostrare il tempo residuo rispetto a puntura, randomizzazione o dose. **Media.**
   - File: `stores/patient.ts`, `stores/eligibility.ts`, `PreImaging.svelte:26-36`, `PostImaging.svelte:104-108`, `PostAcute.svelte:34`, `Summary.svelte`.
2. **[[FASTEST]]**: campo spot sign (≤90 min qualsiasi, 91–120 min solo positivo), uso di `secondaryCause`, IVH come estensione invece di "score noto", ECG = sopraslivellamento ST. **Media.**
   - File: `hemorrhagic-rules.ts:46-80`, `hem-reasons.ts`, `PostImaging.svelte`, `i18n/*.ts`.
3. **[[TICH-3]]**: leggere `anticoag` (warfarin ed EBPM terapeutica esclusi, DOAC ammessi) ed età ≥18. **Bassa.**
   - File: `hemorrhagic-rules.ts:82-91`, `hem-reasons.ts:33-42`.
4. **[[VANISH]]**: finestra ≤9 h ed esclusione del tandem (**bassa**); core ≤70 e mismatch >1,2 con campi propri (**media**).
   - File: `acute-rules.ts:149-158`, `acute-reasons.ts:49-58`.
5. **[[ATHENA]] alla v2.3**: ≤16 h, NIHSS 6–25, flag dei vasi (ICA-T, M1, M2 dominante o prossimale, singolo), ASPECTS 6–10 o core ≤50 (ASPECTS 5 in RM). **Bassa–media.**
   - File: `acute-rules.ts:135-147`, `acute-reasons.ts:37-47`, `trials-info.ts:62-64`.
6. **[[ORION]]**:
   - prima la decisione del team sullo stato;
   - poi vasi ammessi in un solo territorio, domanda "EVT fattibile entro 1 h dall'inizio del farmaco", perfusione oltre 6 h, mRS 0 a 86–90 anni.
   - **Media.** File: `acute-rules.ts:290-301`, `PostImaging.svelte`, `trials-info.ts:229-240`.
7. **[[TENACITY]]**: sede sopratentoriale anche nella via perfusione, ICA cervicale e tandem, via c solo nei centri senza perfusione. **Bassa–media.**
   - File: `acute-rules.ts:368-399`, `vessels.ts`, `PostImaging.svelte:190-222`.
8. **Regole EVT** (T4, T5):
   - conteggio dei territori per PIVOTAL, TWIN2WIN-2 e ORION;
   - ASPECTS per PIVOTAL (≥6, PC-ASPECTS ≥7) e TWIN2WIN-2 (≥6 in TC, ≥5 in RM);
   - tandem per PIVOTAL, NiVO e VANISH.
   - **Bassa.** File: `acute-rules.ts`, `acute-reasons.ts`.
9. **Controllo del tipo di ictus** (T10): regole ischemiche, NORA HOME compreso, solo con `strokeType === "ischemic"`; azzerare i campi ischemici quando si cambia tipo. **Bassa.**
   - File: `stores/eligibility.ts`, `PostImaging.svelte:64-80`.
10. **Avviso di co-arruolamento nel Riepilogo** (T6), con una tabella di incompatibilità decisa dal team. **Media.**
    - File: `Summary.svelte`, `trials-info.ts`.

### P2. Falsi negativi che fanno perdere pazienti
11. **Nomi → chiavi** (T2): normalizzare `findTrialInfo`, le chiavi di `randomizationLinks` e `NAME_TO_KEY` (applicare `normalizeStudyName` prima del lookup). **Bassa.** Da fare subito: la registrazione rapida perde oggi i dati di 7 studi aperti.
    - File: `trials-info.ts:357-413`, `sheet-payload.ts:36-95`, `tests/domain/sheet-payload.test.ts`.
12. **PostImaging**: vasi, ASPECTS e tandem indipendenti dalla candidatura EVT; DONE SYMPLE e REMEDY senza dipendenza da `lvo`/`candidate` (T3). **Alta.**
    - File: `PostImaging.svelte`, `acute-rules.ts` (`doneSymple`, `remedy`, `orion`).
13. **Selettore dei vasi** (T5):
    - nuovi codici: `m2-nondom`, `m3`, `a3`, `p3`, ICA extracranica, VA intracranica;
    - ICA intracranica non-T per VANISH e PIVOTAL; M2 e VA per PIVOTAL.
    - **Media.** File: `vessels.ts`, `VesselPicker.svelte`, `acute-rules.ts:79-119`.
14. **[[DO-IT]]**: domanda IVT "a parte il DOAC", ultima dose ignota, randomizzazione ≤4 h 15 min, via DWI-FLAIR (dopo la risposta del team). **Bassa.**
    - File: `i18n/*.ts`, `acute-rules.ts:303-310`.
15. **[[TENACITY]]**: escludere solo "ictus pregresso + diabete". **Bassa.**
    - File: `acute-rules.ts:398`, `i18n/it.ts:186`, `trials-info.ts:331`.
16. **[[REMEDY]]**: ACE-inibitori con i tempi dell'ultima dose e la possibilità di sostituirli. **Bassa.**
    - File: `PreImaging.svelte:160-162`, `acute-rules.ts:341`.
17. **Ora del risveglio o della scoperta** (T11): correggere WETRUST, TICH-3, VANISH e DO-IT. **Media.**
    - File: `PreImaging.svelte:21-38`, `stores/patient.ts`, regole.
18. **[[SOVATELTIDE]]**: "diagnosi clinica e/o radiologica senza emorragia" al posto di "lesione confermata"; chiedere la voce NIHSS 1a. **Bassa.**
    - File: `acute-rules.ts:284`, `i18n/*.ts`.
19. **Confini e domande** (T9):
    - età ≥18 per TWIN2WIN-2; NIHSS ≥5 per ORION; scheda FASTEST visibile a ≤2 h; ±10% sui 60 mL di TICH-3;
    - per FASTEST anche ECG, trombosi negli ultimi 90 giorni e anticoagulanti con i loro tempi;
    - per ATHENA tandem e tortuosità riformulati.
    - **Bassa.**

### P3. Testi informativi
20. **[[DONE SYMPLE]]**: togliere "IA tPA" (`trials-info.ts:143`, `:148`, `:150`). **Bassa.** È il primo dei testi da correggere, perché suggerisce un trattamento vietato.
21. **Testi copiati** (T7): SOVATELTIDE (`:221-227`), visite di TWIN2WIN-2 (`:111`), VANISH (`:159`, `:163`; `:157` dopo la risposta sull'ASPECTS), ORION (`:235-236`), NiVO (`:279`), WETRUST "low GCS" (`:41`). **Bassa.**
22. **Consenso** (T8): i 5 attivi con "oral/phone" vanno verificati con il CEIm; compilare il consenso di WETRUST, VANISH, FASTEST, TICH-3, NiVO, DO-IT e REMEDY. **Bassa.**
23. **Visite ed esami** (T8): compilare le 9 schede con `visits: null` e correggere le 4 sbagliate; correggere i 6 `preEvtLabs` errati. **Bassa.**
24. **Schede vuote e avvisi**:
    - compilare le schede FASTEST e TICH-3;
    - note sui criteri non modellati in TWIN2WIN-2, DONE SYMPLE e VANISH;
    - attenuare il messaggio WeTrust (`i18n/it.ts:124`);
    - cambiare l'etichetta "Finestra chiusa" oltre 24 h (`PreImaging.svelte:59`), proprio dove arruolano DONE SYMPLE e TENACITY.
    - **Bassa.**

## 6. Domande per il team e per i promotori

1. **[[VANISH]]**:
   - da dove viene l'"ASPECTS ≥4" del foglio e dell'app? Il protocollo v1.2 non lo contiene;
   - core e mismatch valgono per tutti o solo fra 4,5 e 9 h?
   - la M2 dominante va ammessa (foglio e testo dell'app) o no (protocollo)?
2. **[[ARTEMIS]]**: il tandem dell'esclusione 26 è extracranico o intracranico (sinossi contro corpo del protocollo)? Da sapere prima di un'eventuale riapertura.
3. **[[SAIL-MeVO]]**:
   - mRS pre 0–1 (protocollo e sinossi) o 0–2 (foglio)?
   - va aggiunto all'app? Il foglio lo dà aperto, il Drive "pendientes abrir";
   - è compatibile con [[NiVO]] per il co-arruolamento?
4. **[[PROMISE20 RELOADED]]**: "donne ≥55 anni" è una regola pratica del team per la premenopausa? Non è in nessun documento.
5. **[[ORION]]**:
   - resta attivo in app anche se il foglio lo dà "en pausa"?
   - si passa alla v3.1? Cambiano l'eGFR <30 e la stenosi esplicita, e la Parte 2 parte solo dopo l'analisi finale della Parte 1.
6. **SAFER-DOAC**: che studio è? Non ci sono documenti, e non è [[DOAC-CVT]]. Se non esiste più, va chiuso.
7. **NORA HOME**: esiste ancora? Non c'è alcun documento né riga nel foglio; senza protocollo la regola (età >18, NIHSS <5) non è verificabile.
8. **[[TENACITY]]**:
   - il centro è registrato come centro con perfusione? Se sì, la via c non è ammessa;
   - il CI locale prevede il consenso telefonico?
   - il DMC ha ristretto la finestra?
   - perché lo studio non è nel foglio?
9. **[[NiVO]]**: serve il protocollo completo. Oggi c'è solo la sinossi, e lo studio non è nel foglio.
10. **[[DONE SYMPLE]]**:
    - mRS 0 obbligatorio a 70–80 anni (sinossi) o mRS 0–1 per tutti (§4.5)?
    - la M2 è ammessa?
11. **[[TWIN2WIN-2]]**: la M1 prossimale è esclusa ("M1 distal")?
12. **[[TICH-3]]**:
    - acenocumarolo ed eparina non frazionata equivalgono al warfarin ai fini dell'esclusione?
    - l'IVH primaria isolata è esclusa?
13. **[[DO-IT]]**: "wake-up excluidos" è una scelta locale? Va documentata.
14. **Consenso orale o telefonico**: esiste un'approvazione del CEIm per ATHENA, PIVOTAL (consenso orale di marzo 2025, non nella copia), TWIN2WIN-2, DONE SYMPLE, TENACITY, MOSTE e HYBERNIA?
15. **Co-arruolamento**: quale politica adotta il team per FASTEST/TICH-3, SOVATELTIDE/REMEDY/TENACITY/ORION e gli studi EVT con dispositivo?
16. **[[WETRUST]]**: il §14 del protocollo non è stato letto, perché il download è fallito. Va letto prima di compilare consenso ed esami.

## Note sulla verifica

**Metodo di conteggio.**
- Ho contato le voci aperte (`- [ ]`) della sezione "Divergenze con EnsApp" di ogni scheda. Una voce con due tag conta in entrambi: FASTEST 4 e 5, TENACITY 5, WETRUST 2, MOSTE 8.
- Non ho contato i punti già risolti (`- [x]`, stato `closed` di ARTEMIS e MOSTE), le note "Non modellati" né i "Problemi documentali".
- Per SAFER-DOAC ([[DOAC-CVT]], "Proposta per EnsApp": 1 TXT, 2 NC) e per [[PROMISE20]] le divergenze sono state lette ma non sommate ai totali degli attivi.

**Nessuna divergenza esclusa.** Tutte le divergenze delle schede risultano ancora vere nel codice attuale. Il codice di `src/` non è cambiato dal commit `7818276`, sul quale le schede sono state verificate.

**Imprecisioni delle schede, corrette in questa nota:**
1. Le schede [[FASTEST]] (punto 6), [[TICH-3]] (punto 4) e [[LIBREXIA]] (punto 5) dicono che "le regole acute usano invece `ltswHours`, ricalcolato". Non è così: anche le regole acute leggono il `preData.ltsw` congelato (`eligibility.ts:37-44`); `ltswHours` serve solo ai motivi del Riepilogo (T1).
   - Molte schede dicono "`ltsw` = ore al momento della valutazione (`patient.ts:82-90`)". In realtà sono le ore all'ultima apertura o modifica della schermata pre-imaging (`PreImaging.svelte:26`, `:36`).
2. "L'emorragia è filtrata dal tipo di ictus nell'interfaccia" (ATHENA, MOSTE, PIVOTAL, HYBERNIA, TWIN2WIN-2, REMEDY, SOVATELTIDE e altre) vale solo nel percorso diretto. Nessuna regola legge `strokeType` (T10).
3. [[TWIN2WIN-2]] (punto 8) segnala la mancata registrazione nel foglio solo per sé. Il problema riguarda 7 studi aperti (T2).
4. [[ORION]] (punto 1, stato) resta una divergenza aperta rispetto al foglio, ma è una scelta esplicita del team.
5. [[FASTEST]] (punto 12) riguarda il foglio del team, non l'app. È contato come nella scheda.
