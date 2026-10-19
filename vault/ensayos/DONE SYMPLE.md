---
tipo: ensayo
estudio: DONE SYMPLE
alias: [DONESYMPLE, DoneSymple, "EnDOvascular Therapy for Late WiNdow IschEmic Stroke Patients Selected bY AutoMatic Plain ComputErized Tomography"]
estado_app: activo
clave_app: "DoneSymple"
categoria: isquémico
fase: "III"
promotor: "Fundació Ictus (subvención educativa no restringida de Medtronic Neurovascular)"
registro: []
protocolo_vigente: "Versión 4, 09-10-2024"
ci_vigente: "Versión 03, 27-11-2024"
drive_carpeta: "https://drive.google.com/drive/folders/15rFhrRi0YL_r76nOk_nnNz6JLg4suNi4"
fuentes: ["[[DONE SYMPLE — Protocolo — v4]]", "[[DONE SYMPLE — CI — v3]]"]
actualizado: 2026-10-19
---
# DONE SYMPLE

> [!summary] In breve
> Studio di fase III, randomizzato 1:1, PROBE, adattativo bayesiano, promosso dalla Fundació Ictus (co-PI Vall d'Hebron). Confronta la **trombectomia endovascolare (EVT) + trattamento medico** con il **solo trattamento medico** nell'ictus con occlusione di grosso vaso della circolazione anteriore in [[Ventana extendida|finestra molto tardiva]]: 6–72 h dal LKW, ma **24–72 h** nei centri dove l'EVT è standard fino a 24 h (come Vall d'Hebron). La selezione è solo con TC senza contrasto letta da un software automatico (LVO e [[Volumen del core|core]] ≤70 cc). 18–80 anni, [[NIHSS]] ≥8, [[mRS]] pre 0–1 ([[DONE SYMPLE — Protocolo — v4]], p. 12, p. 14, p. 36; [[DONE SYMPLE — CI — v3]], p. 2).

> [!warning] Intervento: non è tPA intra-arterioso
> L'app descrive DONE SYMPLE come "Late-window EVT + IA tPA" con randomizzazione "IA tPA yes/no" (`src/lib/domain/trials-info.ts:143`, `:148`, `:150`): è il disegno di [[VANISH]]. Il protocollo randomizza **EVT sì/no** e **vieta** i fibrinolitici intra-arteriosi in entrambi i bracci ([[DONE SYMPLE — Protocolo — v4]], p. 12, p. 33, p. 42). Vedi divergenza 1.

> [!note] Stato
> Foglio [[Esquema ensayos — septiembre 2026]]: **aperto**. App: `status: "active"` (`trials-info.ts:142`). Coerente. Nessuna documentazione regolatoria in Drive.

## Disegno
- **Tipo**: fase III, prospettico, randomizzato 1:1, in aperto con valutazione degli esiti in cieco (PROBE), iniziato dagli investigatori; disegno adattativo bayesiano con arricchimento per tempo ([[DONE SYMPLE — Protocolo — v4]], p. 12, p. 32–33, p. 65).
- **Bracci**: EVT + trattamento medico contro trattamento medico; cross-over vietato ([[DONE SYMPLE — Protocolo — v4]], p. 33, p. 67).
- **Randomizzazione**: web, blocchi permutati, stratificata per età (18–70 vs >70–80), NIHSS (0–15 vs >15–42), tempo dal LKW (6–24, 24–48, 48–72 h), core (0–30 vs >30–70 cc) e centro ([[DONE SYMPLE — Protocolo — v4]], p. 12, p. 40). Piattaforma non nominata; dati in REDCap (p. 60).
- **Numerosità**: 200–500, interim a 200/275/350/425. A ogni interim si possono chiudere i gruppi 48–72 h e poi 24–48 h per scarso beneficio ([[DONE SYMPLE — Protocolo — v4]], p. 65, p. 69–70). A Vall d'Hebron, che arruola solo a 24–72 h, la chiusura dei due gruppi tardivi fermerebbe l'arruolamento locale.
- **Endpoint primario**: mRS a 90 giorni, ordinale ponderato per utilità ([[DONE SYMPLE — Protocolo — v4]], p. 34, p. 67).
- **Sicurezza primaria**: sICH (PH2 + peggioramento NIHSS ≥4) a 24 h (−12/+16 h); tasso di PH2 ([[DONE SYMPLE — Protocolo — v4]], p. 33).
- **Secondari**: mRS ordinale (5–6 uniti), mRS 0–2, ΔNIHSS a 24 h e G5, recupero precoce e drammatico, mTICI e first pass effect, volume dell'infarto, metriche di tempo, EQ-5D-5L, falsi positivi del software ([[DONE SYMPLE — Protocolo — v4]], p. 34–35).
- **Organizzazione**: CCC University of Iowa e Vall d'Hebron; core lab UT Houston; statistica Berry Consultants; DSMB indipendente ([[DONE SYMPLE — Protocolo — v4]], p. 16–17, p. 62).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Randomizzazione entro 72 h dal LKW (6–72 h); **24–72 h** nei centri con EVT standard fino a 24 h. Puntura arteriosa entro 72 h dal LKW ed entro **90 min dalla TC iniziale** | ([[DONE SYMPLE — Protocolo — v4]], p. 14, p. 36; [[DONE SYMPLE — CI — v3]], p. 2) |
| Età | 18–80 anni | ([[DONE SYMPLE — Protocolo — v4]], p. 36) |
| mRS pre | 0–1 (§4.5); nella sinossi mRS 0 fra 70 e 80 anni | ([[DONE SYMPLE — Protocolo — v4]], p. 14, p. 36) |
| NIHSS | ≥8 basale (l'ultimo prima della randomizzazione; nei sedati quello prima della sedazione). "≥6" solo a p. 33 | ([[DONE SYMPLE — Protocolo — v4]], p. 33, p. 36, p. 39) |
| Imaging / ASPECTS / core | NCCT con software automatico (o angio-TC se disponibile) che indica LVO; **core ≤70 cc** dall'algoritmo di deep learning. Nessun criterio [[ASPECTS]] (solo letto dal core lab). Perfusione e angio-TC non obbligatorie | ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 40, p. 46, p. 64) |
| Occlusione | LVO della circolazione anteriore; il tempo zero cita "ICA o MCA-M1". M2 non citata nei criteri | ([[DONE SYMPLE — Protocolo — v4]], p. 12, p. 32, p. 36, p. 43) |

## Criteri di inclusione
Testo originale (§4.5.1, [[DONE SYMPLE — Protocolo — v4]], p. 36; varianti della sinossi a p. 14):

1. De 18 a 80 años de edad. (p. 36)
2. Presentación con signos y síntomas consistentes con un accidente cerebrovascular isquémico agudo. (p. 36)
3. Imágenes de TC sin contraste (NCCT) que indiquen la existencia de una oclusión de vaso grande mediante un software automatizado, o CTA (cuando esté disponible). (p. 36)
4. NIHSS basal ≥ 8. (p. 36)
5. Capacidad para aleatorizar dentro de las 72 horas después del inicio del accidente cerebrovascular (última vez visto bien). (p. 36)
   - Sinossi: "(en centros donde la EVT es el estándar de atención hasta 24 horas después del inicio de los síntomas, los pacientes solo se incluirán en el período de 24 a 72 horas)" (p. 14)
6. Puntuación pre-accidente cerebrovascular (mRS) de 0- 1. (p. 36)
   - Sinossi: "7. Para edades de 18 a 70 años, mRS previa al ictus 0-1. 8. Para edades de 70 a 80 años, mRS previa al ictus 0." (p. 14)
7. Capacidad para obtener un consentimiento informado firmado o que el representante legalmente autorizado (LAR) del sujeto haya firmado el formulario de consentimiento. (p. 36)
8. Volumen central ≤ 70 cc por un algoritmo de aprendizaje profundo de software automatizado. (p. 36)
9. Punción arterial dentro de las 72 horas (después de los primeros síntomas o la última vez vista bien). (p. 36)
10. Punción arterial dentro de los 90 minutos desde la TC inicial. (p. 36)

**Sintesi**: 18–80 anni, mRS pre 0–1, NIHSS ≥8, LVO anteriore rilevata dal software su TC senza contrasto (o angio-TC), core ≤70 cc, randomizzazione entro 72 h (a Vall d'Hebron fra 24 e 72 h), puntura entro 90 min dalla TC. Consenso scritto del paziente o del LAR, o consenso d'urgenza se approvato.

## Criteri di esclusione
Testo originale (§4.5.2, [[DONE SYMPLE — Protocolo — v4]], p. 36–37):

1. Mujeres embarazadas o en edad fértil con prueba positiva de beta gonadotropina coriónica humana (HCG) en orina o suero. (p. 36–37)
2. Alergia severa conocida (más que una erupción) al medio de contraste no controlada por medicamentos. (p. 37)
3. Hipertensión refractaria (definida como presión arterial sistólica persistente >185 mm Hg o presión arterial diastólica >110 mm Hg) a pesar del tratamiento con medicamentos. (p. 37)
4. Evidencia en la TC de las siguientes condiciones: a. Desplazamiento de línea media o herniación. b. Evidencia de hemorragia intracraneal. c. Efecto de masa con borrado de los ventrículos. (p. 37)
5. Accidente cerebrovascular bilateral. (p. 37)
6. Intento previo de recuperación de coágulo <6 horas. (p. 37)
7. Tratamiento con trombolíticos >4.5 horas después de la última vez que se vio bien. (p. 37)
8. Tumores intracraneales. (p. 37)
9. Diátesis hemorrágica conocida, deficiencia de factores de coagulación o tratamiento con anticoagulantes con un índice internacional normalizado (INR) >3.0 o tiempo de tromboplastina parcial (TTP) >3 veces el valor normal. (p. 37)
10. Recuento plaquetario basal <50,000 por microlitro (µL). (p. 37)
11. Expectativa de vida inferior a 90 días antes del inicio del accidente cerebrovascular. (p. 37)
12. Recuento de hemoglobina basal <7 mmol/L. (p. 37)
13. Participación en otro ensayo clínico aleatorizado que podría afectar la evaluación del estudio. (p. 37)
14. Émbolo séptico presumido o sospecha de endocarditis bacteriana. (p. 37)
15. Enfermedad neurológica o psiquiátrica preexistente que podría confundir las evaluaciones neurológicas o funcionales, por ejemplo, demencia con inhibidores de acetilcolinesterasa recetados (por ejemplo, Aricept). (p. 37)
16. Cualquier otra condición (en opinión del investigador del sitio) que impida un procedimiento endovascular o represente un riesgo significativo para el paciente si se realizara un procedimiento endovascular. (p. 37)

**Sintesi**: esclusi gravidanza, allergia grave al contrasto, ipertensione refrattaria >185/110, shift o erniazione, emorragia, effetto massa, ictus bilaterale, tumori, aspettativa di vita <90 giorni, embolia settica o endocardite, malattia neuropsichiatrica confondente. Esclusi anche un tentativo di trombectomia nelle 6 h precedenti e la **trombolisi fatta oltre 4,5 h dal LKW**. Soglie di laboratorio: INR >3, PTT >3 volte il normale, piastrine <50.000/µL, emoglobina <7 mmol/L (unità da verificare). Escluso chi partecipa a un altro RCT che possa confondere la valutazione.

## Intervento e procedure
- **Braccio EVT**: trombectomia meccanica con dispositivi con marchio CE secondo le IFU; aspirazione, stent retriever o combinazione a scelta dell'operatore; trattamento medico standard secondo le linee guida AHA ([[DONE SYMPLE — Protocolo — v4]], p. 41). Puntura femorale raccomandata entro 45 min dalla randomizzazione e 60 min dall'imaging di qualificazione ([[DONE SYMPLE — Protocolo — v4]], p. 41).
- **Vietati nel braccio EVT**: fibrinolitici e antiaggreganti **intra-arteriosi** durante la procedura e fino all'imaging di controllo; eparina sistemica sconsigliata; antispasmo ammesso ([[DONE SYMPLE — Protocolo — v4]], p. 42).
- **Braccio medico**: terapia a giudizio del medico secondo gli standard locali, **senza terapie intra-arteriose**; niente eparina e.v. fino all'imaging a 24 h ([[DONE SYMPLE — Protocolo — v4]], p. 42).
- **Trombolisi e.v.**: non è un criterio di inclusione. È **esclusa** la trombolisi fatta oltre 4,5 h dal LKW (esclusione 7). Una trombolisi standard entro 4,5 h non è esclusa ([[DONE SYMPLE — Protocolo — v4]], p. 37).
- **Trombectomia**: è l'intervento randomizzato (sì/no).
- **PA**: dopo EVT con mTICI 2b-3, 110–140/60–90 mmHg; senza riperfusione e nei controlli PAS <180 mmHg ([[DONE SYMPLE — Protocolo — v4]], p. 41).
- **Entrambi i bracci**: regole sugli antiaggreganti orali nelle prime 24 h formulate in modo ambiguo; EBPM per la TVP ammessa ([[DONE SYMPLE — Protocolo — v4]], p. 42).
- **Esami prima della randomizzazione**: glicemia in tutti e test di gravidanza nelle donne fertili ([[DONE SYMPLE — Protocolo — v4]], p. 43); il calendario aggiunge piastrine, INR (se warfarin), aPTT (se eparina o nuovi anticoagulanti) (p. 46).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Basale | prima della randomizzazione | anamnesi, esami, criteri, consenso, NCCT, NIHSS, mRS pre | ([[DONE SYMPLE — Protocolo — v4]], p. 43, p. 46) |
| Procedura | solo braccio EVT | dettagli, TICI, eventi avversi | ([[DONE SYMPLE — Protocolo — v4]], p. 44, p. 46) |
| 24 h | 16–36 h | **NCCT e/o RM obbligatoria** (emorragia secondo [[Clasificación de Heidelberg]]), NIHSS in cieco | ([[DONE SYMPLE — Protocolo — v4]], p. 45–46) |
| G5 | ±1 giorno o dimissione | mRS, NIHSS, disposizione alla dimissione | ([[DONE SYMPLE — Protocolo — v4]], p. 45) |
| G30 | ±5 o ±7 giorni (incoerente) | mRS centralizzato da HVH in cieco, anche telefonico; eventi avversi | ([[DONE SYMPLE — Protocolo — v4]], p. 45; [[DONE SYMPLE — CI — v3]], p. 3) |
| G90 | ±15 o ±30 giorni (incoerente) | mRS centralizzato da HVH in cieco, anche telefonico; EQ-5D-5L | ([[DONE SYMPLE — Protocolo — v4]], p. 45–46; [[DONE SYMPLE — CI — v3]], p. 3) |

## Consenso
- **Tipo**: consenso informato **scritto** del paziente o del LAR, prima di qualsiasi procedura dello studio ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 38).
- **Urgenza**: se il comitato etico e la normativa lo approvano, inclusione con "consentimiento informado de emergencia" quando né paziente né rappresentante né persona di fiducia possono firmare; condizioni a p. 39–40; consenso appena possibile ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 38–40). Vedi [[Consentimiento diferido]].
- **CI locale (v3)**: firma del paziente o del familiare o rappresentante, poi consenso del paziente quando ne è capace ([[DONE SYMPLE — CI — v3]], p. 1, p. 6). L'inclusione senza alcuna firma non è prevista nel CI.
- **Orale o telefonico**: non riportato né nel protocollo né nel CI.
- **Lingue**: in Drive solo il CI in castellano.

## Co-arruolamento
- Esclusione 13: "Participación en otro ensayo clínico aleatorizado que podría afectar la evaluación del estudio" ([[DONE SYMPLE — Protocolo — v4]], p. 37).
- Esclusione 7: trombolisi oltre 4,5 h dal LKW. Un paziente trattato con TNK in [[TENACITY]] (4,5–72 h) non sarebbe quindi eleggibile, a prescindere dal braccio (deduzione dal testo dell'esclusione; compatibilità specifica non riportata nel documento).
- Compatibilità con altri studi specifici: non riportata nel documento.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:141-153` (voce `DoneSymple`), `:362` (link di randomizzazione), `:399-413` (`findTrialInfo`, `isTrialOpen`);
- `src/lib/domain/acute-rules.ts:254-264` (`doneSymple()`);
- `src/lib/domain/acute-reasons.ts:147-155` (`reasonDoneSymple()`);
- per l'interfaccia, `src/routes/PostImaging.svelte`, `src/routes/Summary.svelte`, `src/routes/PreImaging.svelte`.

Verificato il 2026-10-19.

> [!success] Coincide
> - età 18–80 (`acute-rules.ts:258-259`; testo `trials-info.ts:144`);
> - mRS pre ≤1 (`:260`), secondo la §4.5 (vedi però divergenza 5);
> - NIHSS ≥8 (`:261`);
> - finestra 24–72 h (`:256-257`), come la regola dei centri con EVT standard fino a 24 h, il CI e il foglio;
> - LVO obbligatoria (`:262`);
> - nessun criterio ASPECTS (`trials-info.ts:144` "-");
> - trombolisi "Optional." (`trials-info.ts:147`) per la trombolisi standard entro 4,5 h;
> - stato `active` coerente con il foglio (`trials-info.ts:142`).

- [ ] **1. [FN] DONE SYMPLE è valutato solo se il paziente è marcato "candidato a trombectomia".**
> [!warning] Contraddizione
> Protocollo: oltre le 24 h la EVT **non** è lo standard; per questo lo studio la randomizza contro il solo trattamento medico ([[DONE SYMPLE — Protocolo — v4]], p. 14, p. 18–19, p. 33).
> App: `lvo` deriva da "Candidato a trombectomia (EVT)? → Eleggibile" (`PostImaging.svelte:25-27`); la regola richiede `isLvo(input.lvo)` (`acute-rules.ts:262`). Se il medico risponde "Non eleggibile" (la risposta attesa fuori studio a 24–72 h), `lvo = "no"` e DONE SYMPLE non risulta mai eleggibile: compare la scheda TENACITY (`PostImaging.svelte:106-108`), non DONE SYMPLE. Falsi negativi sistematici.

- [ ] **2. [FP] Il core ≤70 cc non viene controllato.**
> [!warning] Contraddizione
> Protocollo, inclusione 8: "Volumen central ≤ 70 cc por un algoritmo de aprendizaje profundo de software automatizado." ([[DONE SYMPLE — Protocolo — v4]], p. 36).
> App: `doneSymple()` non legge `largeCore` (`acute-rules.ts:254-264`). Il campo esiste ma è nella sola scheda TENACITY, con soglia ≥70 mL e ipodensità (`PostImaging.svelte:209-210`; `i18n/it.ts:185`). Un paziente con core >70 cc risulta eleggibile.

- [ ] **3. [FP] Nessun controllo sulla sede: l'app accetta anche la circolazione posteriore.**
> [!warning] Contraddizione
> Protocollo: "AIS … por oclusión de grandes vasos (OVL) en la circulación anterior" (p. 12, p. 32); tempo zero dopo la conferma di "oclusión de vaso grande anterior en las arterias ICA o MCA-M1" (p. 43); flow chart "AIS in the anterior circulation" ([[DONE SYMPLE — Protocolo — v4]]).
> App: basta `lvo === "yes"`, nessun controllo su `targetVessels` (`acute-rules.ts:254-264`; `acute-reasons.ts:153` "LVO confermato"). Una basilare o una vertebrale risultano eleggibili. Per la M2 il protocollo non è esplicito: da chiarire con il promotore.

- [ ] **4. [TXT] Testo dell'intervento copiato da VANISH (tPA intra-arterioso).**
> [!warning] Contraddizione
> Protocollo: bracci "EVT versus terapia médica" (p. 12, p. 33); "El uso de agentes fibrinolíticos intraarteriales (IA) … está prohibido en los sujetos asignados al brazo de tratamiento" e nel braccio medico "NO puede incluir terapias intraarteriales" (p. 42) ([[DONE SYMPLE — Protocolo — v4]]). CI: "tratamiento médico o tratamiento médico + trombectomía mecánica" ([[DONE SYMPLE — CI — v3]], p. 2). Foglio: "trombectomía vs no", "randomizada sí/no".
> App: `category: "Late-window EVT + IA tPA"` (`trials-info.ts:143`), `thrombectomy: "Randomize: IA tPA yes/no alongside EVT strategy."` (`:148`), `intervention: "Intra-arterial tPA (per arm)."` (`:150`). Errore solo testuale, ma grave: suggerisce un trattamento che il protocollo vieta. Testo corretto: EVT + medical management vs medical management alone; randomize EVT yes/no; no IA thrombolytics.

- [ ] **5. [FP] mRS pre legato all'età (solo nella sinossi).**
> [!warning] Contraddizione
> Sinossi: "Para edades de 70 a 80 años, mRS previa al ictus 0" (p. 14); §4.5: "mRS de 0- 1" senza distinzione (p. 36) ([[DONE SYMPLE — Protocolo — v4]]).
> App: `input.premrs <= 1` a ogni età (`acute-rules.ts:260`). Se vale la sinossi, un paziente di 71–80 anni con mRS 1 risulta eleggibile senza esserlo. Il protocollo è internamente contraddittorio: da chiarire con il promotore.

- [ ] **6. [NC] Tempo di puntura e momento della randomizzazione.**
> Protocollo: randomizzazione e puntura entro 72 h dal LKW; puntura **entro 90 min dalla TC iniziale** (inclusioni 5, 9, 10, p. 36); puntura raccomandata entro 45 min dalla randomizzazione (p. 41) ([[DONE SYMPLE — Protocolo — v4]]).
> App: `ltsw` sono le ore al momento dell'uso (`stores/patient.ts:82-90`), confrontate con `<= 72` (`acute-rules.ts:257`); i 90 min dalla TC non sono chiesti. Vicino alle 72 h il paziente può risultare eleggibile ma uscire di finestra prima della puntura.

- [ ] **7. [NC] Esclusione per trombolisi oltre 4,5 h e per trombectomia recente.**
> Protocollo, esclusioni 6–7: "Intento previo de recuperación de coágulo <6 horas"; "Tratamiento con trombolíticos >4.5 horas después de la última vez que se vio bien" ([[DONE SYMPLE — Protocolo — v4]], p. 37).
> App: nessun campo su trombolisi tardiva o trombectomia precedente in `doneSymple()`. Interessa in particolare i pazienti trattati con TNK in [[TENACITY]] (4,5–72 h), che l'app può proporre per entrambi gli studi.

- [ ] **8. [NC] Problema tecnico: `findTrialInfo` non trova "DONE SYMPLE".**
> App: il riepilogo usa il nome visualizzato "DONE SYMPLE" (`Summary.svelte:29`) e filtra con `isTrialOpen(e.display)` (`Summary.svelte:48`, `:53`; anche `Share.svelte:38`). `findTrialInfo` confronta in minuscolo con le chiavi (`trials-info.ts:399-403`): "done symple" ≠ "donesymple". La voce non viene trovata e `isTrialOpen` restituisce `true` per default (`:410-412`). Oggi lo stato è `active` e non cambia nulla; se DONE SYMPLE venisse messo in pausa o chiuso, l'app continuerebbe a proporlo.

- [ ] **9. [TXT] Consenso orale o telefonico non previsto.**
> Protocollo: consenso scritto del paziente o del LAR; consenso d'urgenza se approvato ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 38–40). CI: solo firme ([[DONE SYMPLE — CI — v3]], p. 6). Foglio: "scritto".
> App: `consent: "Written & oral/phone consent."` (`trials-info.ts:145`). Né l'orale né il telefonico compaiono nei documenti; manca invece il consenso d'urgenza.

- [ ] **10. [TXT] Imaging descritto in modo incompleto.**
> Protocollo: NCCT con software automatico che indica LVO (o angio-TC se disponibile), core ≤70 cc dal software; NCCT o RM obbligatoria a 24 h ([[DONE SYMPLE — Protocolo — v4]], p. 36, p. 45–46).
> App: `imaging: "Presence of LVO."` (`trials-info.ts:146`). Non cita la selezione con TC senza contrasto e software, il core ≤70 cc, la circolazione anteriore né l'imaging a 24 h.

- [ ] **11. [TXT] "preEvtLabs: No." contro esami richiesti prima della randomizzazione.**
> Protocollo: glicemia in tutti e test di gravidanza nelle donne fertili prima della randomizzazione (p. 43); esami basali con piastrine, INR e aPTT secondo la terapia (p. 46); esclusioni 9, 10 e 12 su coagulazione, piastrine ed emoglobina (p. 37) ([[DONE SYMPLE — Protocolo — v4]]).
> App: `preEvtLabs: "No."` (`trials-info.ts:149`), come il foglio.

- [ ] **12. [TXT] Visite: manca il giorno 30.**
> Protocollo: 24 h (16–36 h), G5 ±1 o dimissione, **G30**, G90; mRS a G30 e G90 anche per telefono ([[DONE SYMPLE — Protocolo — v4]], p. 45–46). CI: visite telefoniche a 30 e 90 giorni ([[DONE SYMPLE — CI — v3]], p. 3).
> App: `visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"]` (`trials-info.ts:152`). Manca G30; per la 24 h l'imaging obbligatorio non è indicato.

- [ ] **13. [TXT] Finestra "chiusa" oltre 24 h nella schermata iniziale.**
> App: oltre 1440 min la finestra è etichettata "Finestra chiusa" in rosso (`PreImaging.svelte:53-59`; `i18n/it.ts:265`), proprio dove DONE SYMPLE (24–72 h) e TENACITY arruolano. È solo un'etichetta, ma può scoraggiare la valutazione.

> [!note] Non modellati (scelta di progetto, non divergenza)
> La regola non controlla le altre esclusioni cliniche e di imaging: gravidanza, allergia al contrasto, PA >185/110 refrattaria, shift, emorragia, effetto massa, ictus bilaterale, tumori, coagulopatia, piastrine, emoglobina, aspettativa di vita, embolia settica, malattia neuropsichiatrica, altri RCT ([[DONE SYMPLE — Protocolo — v4]], p. 36–37). Il link di randomizzazione `https://www.studyrandomizer.com/` (`trials-info.ts:362`) non è verificabile: il protocollo cita solo un "software basado en computadora y web" (p. 40).

## Problemi documentali
- **Protocollo letto in parte**: pp. 1–80; mancano contatti, bibliografia e appendici A–G (pp. 81–98), tra cui la scheda ASPECTS, la classificazione delle emorragie e la lista dei dispositivi. Criteri, procedure e visite sono coperti ([[DONE SYMPLE — Protocolo — v4]]).
- **Contraddizioni interne**: NIHSS ≥6 (p. 33) contro ≥8 (p. 12, p. 14, p. 36); mRS 0 fra 70 e 80 anni solo nella sinossi (p. 14); regola 24–72 h solo nella sinossi (p. 14); tPA intra-arterioso vietato (p. 42) ma citato come opzione per l'embolia distale (p. 52); finestre delle visite diverse fra sinossi, §5.4 e calendario (p. 15–16, p. 43–46); dispositivi "FDA o CE" (p. 33) contro "CE" (p. 41).
- **Esclusione 12** (emoglobina <7 mmol/L, p. 37): unità da verificare con il promotore.
- **Sinossi incompleta**: mancano le esclusioni 9, 10 e 12 e l'inclusione 10 (90 min dalla TC); numerazione delle esclusioni spostata; "Trazos bilaterales" è una traduzione errata di "bilateral strokes" (p. 14–15).
- **Riferimenti interni errati** nella §11 ("Sección 12.x", p. 66, p. 68); appendici H e I citate ma assenti dall'indice (p. 33, p. 59).
- **Registro ClinicalTrials.gov** non compilato nel protocollo (p. 2).
- **CI**: Apéndice 1 sulla protezione dei dati citato ma assente; resti di modello ("relacionados con la especificar"); "Comité de Ética de la Investigación con medicamentos" per uno studio con dispositivi ([[DONE SYMPLE — CI — v3]], p. 1–2, p. 4).
- **Documentazione regolatoria**: nessuna in Drive.

## Fonti
- [[DONE SYMPLE — Protocolo — v4]]
- [[DONE SYMPLE — CI — v3]]
- [[Esquema ensayos — septiembre 2026]] (stato)
