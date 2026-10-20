---
tipo: ensayo
estudio: FASTEST
alias: ["rFVIIa for Acute Hemorrhagic Stroke Administered at Earliest Time", "FASTEST Part 2"]
estado_app: activo
clave_app: "FASTEST"
categoria: hemorrágico
fase: "III"
promotor: "Joseph P. Broderick, University of Cincinnati (investigator-sponsored; finanziamento NIH/NINDS StrokeNet; farmaco Novo Nordisk A/S)"
registro: ["NCT03496883", "EU CT 2024-517383-28-00", "EudraCT 2019-003722-25", "UTN U1111-1201-0087"]
protocolo_vigente: "V10.5 Consolidated Protocol, 03-02-2026"
ci_vigente: "v1.5, 15-03-2025 (castellano e català), anteriore al protocollo V10.5"
drive_carpeta: "https://drive.google.com/drive/folders/1v4q-RArxveUszjyNYP3Mea7mrLG-6Jy3"
fuentes: ["[[FASTEST — Protocolo — V10.5]]", "[[FASTEST — CI — v1.5]]", "[[FASTEST — CI — v1.5 (català)]]"]
actualizado: 2026-10-19
---
# FASTEST

> [!summary] In breve
> Studio di fase III, randomizzato 1:1 e in doppio cieco: **rFVIIa 80 µg/kg** (massimo 10 mg, bolo e.v. in 2 min) contro placebo, oltre alla miglior terapia medica, nell'**emorragia intracerebrale spontanea** trattata **entro 2 h** dall'esordio o dall'ultima volta visto bene. Età 18–80, [[mRS]] pre ≤2, [[GCS]] ≥8, [[Volumen de hematoma|volume ICH]] 2–<60 mL, IVH limitata. La **Parte 2** (vigente) include solo pazienti con [[Spot sign|spot sign]] positivo in angio-TC, oppure trattati entro 90 min con o senza spot sign ([[FASTEST — Protocolo — V10.5]], p. 5–6, p. 24–26).

> [!note] Stato
> Foglio del team: **aperto** ([[Esquema ensayos — septiembre 2026]]). App: `status: "active"` (`src/lib/domain/trials-info.ts:243`). Coerente.

## Disegno
- **Tipo**: fase III globale, randomizzato 1:1, doppio cieco, controllato con placebo. Randomizzazione semplice, senza stratificazione. Kit con due flaconi da 5 mg di rFVIIa o placebo identico ([[FASTEST — Protocolo — V10.5]], p. 6, p. 24, p. 27).
- **Parte 1**: chiusa a 1/2025 per futilità complessiva dopo 626 randomizzati (endpoint mRS a 180 gg). Segnale di efficacia negli spot sign positivi e nei trattati entro 90 min ([[FASTEST — Protocolo — V10.5]], p. 5, p. 16, p. 21–23).
- **Parte 2** (emendamenti 9 e 10): fino a 350 nuovi pazienti in circa 125 ospedali, incluse 15 unità mobili (MSU). Interim dopo 150 e 250 pazienti ([[FASTEST — Protocolo — V10.5]], p. 5, p. 26, p. 33).
- **Endpoint primario (Parte 2)**: mRS ordinale a **90 giorni** (0–2, 3, 4–6), analisi bayesiana con dynamic borrowing dalla Parte 1 ([[FASTEST — Protocolo — V10.5]], p. 6, p. 25, p. 30).
- **Secondari**: mRS a 7 livelli, UW-mRS, mRS 0–2 ed EQ-5D a 90 e 180 giorni; crescita di ICH e ICH+IVH dal basale alle 24 h ([[FASTEST — Protocolo — V10.5]], p. 25).
- **Sicurezza**: IMA, infarto cerebrale ed EP entro 4 giorni dal farmaco ([[FASTEST — Protocolo — V10.5]], p. 7, p. 29).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Trattamento entro **2 h** dall'esordio o dall'ultima volta visto bene. Parte 2: spot sign positivo, oppure trattamento entro **90 min** con o senza spot sign | ([[FASTEST — Protocolo — V10.5]], p. 5, p. 26) |
| Età | 18–80 anni inclusi | (p. 26) |
| mRS pre | ≤2 (esclusione mRS >2) | (p. 26) |
| Gravità | [[GCS]] ≥8 (esclusione GCS 3–7). NIHSS non usato come criterio | (p. 24, p. 26) |
| Imaging | ICH spontanea su TC; volume ≥2 e <60 mL ([[Volumen de hematoma|ABC/2]] o software FDA/CE, lettura locale); IVH limitata ("IVH score ≤ 7"; esclusa se un ventricolo laterale è pieno per ≥2/3 o entrambi per ≥1/3); no tronco encefalico (cervelletto ammesso); angio-TC basale obbligatoria nella Parte 2 | (p. 24, p. 26–28) |
| Anticoagulanti | Esclusi: ACO (AVK o DOAC) negli ultimi 7 giorni, EBPM <24 h, eparina non frazionata con PTT alterato, procoagulanti <24 h | (p. 26) |

## Criteri di inclusione
Testo originale (§4.62, [[FASTEST — Protocolo — V10.5]], p. 26; uguali nella sinossi, p. 5):

1) Patients aged 18-80 years, inclusive
2) Patients with spontaneous ICH
3) Able to treat with study medication (rFVIIa/placebo) within 2 hours of stroke onset or last known well
4) Positive spot sign on baseline CTA for Part 2 participants only or able to be treated within 90 minutes with or without a positive spot sign.
5) Efforts to obtain informed consent per EFIC guidelines (U.S.) or adherence to country-specific emergency research informed consent regulations (Canada, Germany, Spain, U.K., Japan, Australia, Finland)

**Sintesi**: adulto di 18–80 anni con ICH spontanea, trattabile entro 120 min. Tra 91 e 120 min serve lo spot sign positivo; entro 90 min lo spot sign non conta (p. 5, p. 25).

## Criteri di esclusione
Testo originale (§4.63, [[FASTEST — Protocolo — V10.5]], p. 26–27; sinossi p. 6):

1) Score of 3 to 7 on the Glasgow Coma Scale
2) Secondary ICH related to known causes (e.g., trauma, aneurysm, arteriovenous malformation (AVM), oral anticoagulant use (vitamin K antagonists or novel oral anticoagulants) within the past 7 days, coagulopathy, etc.)
3) ICH volume < 2 ml and ≥ 60 ml
4) Filling of one lateral ventricle of the brain at least 2/3 with blood, OR, filling of both lateral ventricles of the brain at least 1/3 with blood.
5) Pre-existing disability (mRS > 2)
6) Symptomatic thrombo-embolic or vaso-occlusive disease in past 90 days (e.g., cerebral infarction, myocardial infarction, pulmonary embolus, deep vein thrombosis, or unstable angina)
7) Clinical findings or EKG evidence of ST segment elevation consistent with acute myocardial ischemia
8) Brainstem location of hemorrhage (patients with cerebellar hemorrhage may be enrolled)
9) Refusal to participate in study by patient, legal representative, or family member
10) Known or suspected thrombocytopenia (unless current platelet count documented above 50,000/μL)
11) Unfractionated heparin use with abnormal PTT
12) Pro-coagulant drugs within 24 hours prior to patient enrollment into the FASTEST trial (example, tranexamic acid or aminocaproic acid)
13) Low-molecular weight heparin use within the previous 24 hours
14) Recent (within 90 days) carotid endarterectomy or coronary or cerebrovascular angioplasty or stenting
15) Advanced or terminal illness or any other condition the investigator feels would pose a significant hazard to the patient if rFVIIa were administered
16) Recent (within 30 days) participation in any investigational drug or device trial or earlier participation in any investigational drug or device trial for which the duration of effect is expected to persist until to the time of FASTEST enrollment
17) Planned withdrawal of care or comfort care measures
18) Patient known or suspected of not being able to comply with trial protocol (e.g., due to alcoholism, drug dependency, or psychological disorder)
19) Known or suspected allergy to trial medication(s), excipients, or related products
20) Contraindications to study medication
21) Previous participation in this trial (previously randomized)
22) Females of childbearing potential who are known to be pregnant or within 12 weeks post-partum and/or lactating at time of enrolment

**Sintesi**. Sono esclusi:
- GCS ≤7, volume <2 o ≥60 mL, IVH estesa, sede nel tronco;
- ICH secondaria: trauma, aneurisma, MAV, coagulopatia, ACO negli ultimi 7 giorni;
- eventi trombotici o vaso-occlusivi sintomatici negli ultimi 90 giorni, STEMI clinico o all'ECG;
- piastrinopenia, EBF con PTT alterato, EBPM <24 h, procoagulanti <24 h (es. acido tranexamico);
- endoarteriectomia, angioplastica o stent coronarico o cerebrovascolare negli ultimi 90 giorni;
- cure palliative, studio sperimentale negli ultimi 30 giorni, gravidanza, puerperio ≤12 settimane, allattamento.

Il criterio 3 dice "and" (refuso; la sinossi dice "or", p. 6).

## Intervento e procedure
- **Farmaco**: rFVIIa 80 µg/kg (massimo 10 mg) o placebo, e.v. in 2 minuti, in dose unica ([[FASTEST — Protocolo — V10.5]], p. 6, p. 27, p. 38).
- **Arruolamento**: lo sperimentatore verifica i criteri, misura GCS, NIHSS, mRS, volume ICH (ABC/2), IVH e spot sign, poi apre il kit successivo. La randomizzazione coincide con la somministrazione del farmaco (p. 27).
- **Terapia di base**: PA sistolica target 140 mmHg con farmaci e.v.; ricovero in UCI o stroke unit (p. 24, p. 27).
- **Trombolisi / trombectomia**: non pertinenti (ICH). Gli antitrombotici sono controindicati nell'ICH (p. 27).
- **Esami prima della dose**: non c'è un elenco obbligatorio. Le piastrine servono solo se si sospetta piastrinopenia (excl. 10); il PTT se il paziente è in eparina non frazionata (excl. 11). ECG e troponina sono previsti al basale (Table of Events, p. 28).

## Visite e follow-up
| Visita | Momento | Contenuto | Fonte |
|---|---|---|---|
| Basale | prima della dose | anamnesi, EO, vitali, NIHSS, GCS, mRS pre, TC + angio-TC, ECG, troponina | ([[FASTEST — Protocolo — V10.5]], p. 28) |
| 1 h post-dose | ±15 min | vitali, NIHSS, EA | (p. 27–28) |
| 24 h dall'esordio | ±6 h | vitali, NIHSS, TC di controllo, troponina, EA | (p. 27–28) |
| G4 / dimissione | se prima | EA | (p. 28–29) |
| G30 | ±14 gg | mRS a distanza o in presenza | (p. 27–28) |
| G90 | ±14 gg | **mRS in presenza** (Parte 2; a distanza se non fattibile, preferibilmente video), EQ-5D | (p. 27–28) |
| G180 | ±14 gg | mRS a distanza o in presenza, EQ-5D; mortalità | (p. 27–29) |

Il CI dice: prelievo di 10 mL e TC/RM a 18–30 h; telefonata o videochiamata a 30 e 180 giorni; **visita in clinica a 90 giorni** ([[FASTEST — CI — v1.5]], p. 4–5).

## Consenso
- **Protocollo, Spagna**: consenso del paziente se capace; altrimenti del familiare o del rappresentante legale. Se non ci sono, **inclusione senza consenso previo** (RD 1090/2015, art. 7), con conferma del paziente o del rappresentante appena possibile ([[FASTEST — Protocolo — V10.5]], p. 44). Vedi [[Consentimiento diferido]].
- **USA**: EFIC, se il consenso non si ottiene entro 30 min dalla TC e 120 min dall'esordio (p. 27, p. 38).
- **CI locale v1.5**: moduli per il paziente, il rappresentante (legale, familiare o persona vincolata di fatto) e il riconsenso. La p. 1 informa che il medico può aver incluso il paziente in urgenza senza rappresentante disponibile ([[FASTEST — CI — v1.5]], p. 1, p. 10–12).
- **Lingue**: castellano e catalano ([[FASTEST — CI — v1.5 (català)]]).

## Co-arruolamento
- Esclusi i procoagulanti nelle 24 h precedenti, "example, tranexamic acid" (excl. 12), e la partecipazione a uno studio sperimentale con farmaco o dispositivo negli ultimi 30 giorni (excl. 16) ([[FASTEST — Protocolo — V10.5]], p. 26). Un paziente già randomizzato in [[TICH-3]] (acido tranexamico o placebo) **non può entrare** in FASTEST. Il co-arruolamento con studi specifici non è altrimenti trattato.

## Divergenze con EnsApp
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `071119a`)
> - ✅ 1 spot sign (obbligatorio tra 91 e 120 min)
> - ✅ 2 causa secondaria
> - ✅ 3 ECG: solo sopraslivellamento ST
> - ✅ 4 IVH estesa al posto di 'IVH score noto'
> - 🟨 5 anticoagulanti: AVK/DOAC 7 gg, eparina/EBPM terapeutica, EBPM profilattica 24 h; l'eparina non frazionata con PTT normale resta esclusa
> - ✅ 7 bordo delle 2 h
> - ✅ 8–9 etichette trombosi 90 gg, gravidanza/puerperio/allattamento, endoarteriectomia/stent
> - ✅ 11 scheda informativa compilata
> - ⬜ 6 finestra congelata (problema trasversale T1)
> - ⬜ 10 esclusioni non modellate (ricordate nelle note della scheda)

Confronto con:
- `src/lib/domain/trials-info.ts:242-254`;
- `src/lib/domain/hemorrhagic-rules.ts:46-80` (`fastest()`) e `src/lib/domain/hem-reasons.ts:15-30` (`reasonFastest()`);
- `src/lib/stores/eligibility.ts:68-74`;
- per l'interfaccia, `src/routes/PostImaging.svelte:104`, `:130-140`, `:226-283`, e le etichette in `src/lib/i18n/es.ts:171-179`.

Verificato il 2026-10-19.

> [!success] Coincide
> - Età 18–80 inclusi (`hemorrhagic-rules.ts:50-51`);
> - mRS pre ≤2 (`:49`);
> - finestra ≤2 h (`:48`; testo `trials-info.ts:245`);
> - GCS ≥8 (`:63`);
> - volume 2–59 mL (`hemVolume >= 2 && < 60`, `:64-65`);
> - esclusione dell'emorragia del tronco (`:66`);
> - procoagulanti nelle 24 h (`:67`);
> - stato `active` come nel foglio (`trials-info.ts:243`).

- [ ] **1. [FP] Lo spot sign non viene chiesto: tra 90 e 120 min l'app propone anche gli spot sign negativi.**
> [!warning] Contraddizione
> Protocollo, inclusione 4 (Parte 2): "Positive spot sign on baseline CTA for Part 2 participants only or able to be treated within 90 minutes with or without a positive spot sign" ([[FASTEST — Protocolo — V10.5]], p. 26). La Parte 1, senza spot sign, è chiusa (p. 5, p. 16). L'angio-TC basale è obbligatoria (p. 24).
> App: `fastest()` usa solo `ltsw <= 2` (`hemorrhagic-rules.ts:48`) e non esiste un campo spot sign (`HemorrhagicInput`, `:21-38`). Anche il foglio del team indica "spot sign + o − se <90 min, solo + se 91-120 min". In pratica l'app applica i criteri della Parte 1, chiusa.

- [ ] **2. [FP] La causa secondaria non viene controllata.**
> [!warning] Contraddizione
> Protocollo, esclusione 2: "Secondary ICH related to known causes (e.g., trauma, aneurysm, arteriovenous malformation (AVM), … coagulopathy, etc.)"; inclusione 2: "spontaneous ICH" ([[FASTEST — Protocolo — V10.5]], p. 26).
> App: il campo `secondaryCause` è obbligatorio (`PostImaging.svelte:139`, `:246-249`) e lo usa solo `tich3()` (`hemorrhagic-rules.ts:89`). `fastest()` lo ignora: un'ICH traumatica, da MAV, aneurisma o tumore risulta eleggibile.

- [ ] **3. [FN] "Anomalías ECG?" esclude più pazienti del protocollo.**
> [!warning] Contraddizione
> Protocollo, esclusione 7: solo "Clinical findings or EKG evidence of ST segment elevation consistent with acute myocardial ischemia" ([[FASTEST — Protocolo — V10.5]], p. 26). Nella Parte 1 il 44% dei pazienti aveva un ECG "Abnormal, not clinically significant" (Tab. 9, p. 18).
> App: domanda "Anomalias ECG?" (`es.ts:175`; it "Anomalie ECG?"), con richiesta `ecg === "no"` (`hemorrhagic-rules.ts:68`; `hem-reasons.ts:24` "no anomalie ECG"). Un'anomalia non ischemica (BBD, FA, onde T aspecifiche) esclude un paziente eleggibile.

- [ ] **4. [FP] [FN] "IVH score conocido?" non verifica l'IVH.**
> [!warning] Contraddizione
> Protocollo: esclusione 4, "Filling of one lateral ventricle of the brain at least 2/3 with blood, OR, filling of both lateral ventricles of the brain at least 1/3 with blood" (p. 26); piano generale "no IVH or a smaller volume of IVH (IVH score ≤ 7)" (p. 24) ([[FASTEST — Protocolo — V10.5]]).
> App: chiede se l'IVH score è **noto** e richiede "yes" (`es.ts:179`; `hemorrhagic-rules.ts:72`; `hem-reasons.ts:28` "IVH score noto"). Un'IVH massiva con score noto passa (FP); un paziente senza IVH, per cui nessuno ha calcolato lo score, viene escluso (FN).

- [ ] **5. [FN] / [FP] Anticoagulanti: risposta unica, senza tempi né PTT.**
> [!warning] Contraddizione
> Protocollo: ACO (AVK o DOAC) "within the past 7 days" (excl. 2); "Unfractionated heparin use with abnormal PTT" (excl. 11); "Low-molecular weight heparin use within the previous 24 hours" (excl. 13) ([[FASTEST — Protocolo — V10.5]], p. 26). Gli antiaggreganti non sono esclusi.
> App: richiede `anticoag === "none"` (`hemorrhagic-rules.ts:73`). Le opzioni sono Ninguna / Warfarin / "Heparina <24h" / DOAC (`PostImaging.svelte:130-135`; `es.ts:312`); `lmwh` e `antiplatelet` esistono nel tipo (`hemorrhagic-rules.ts:7-9`) ma non nell'interfaccia.
> - FN: eparina non frazionata con PTT normale; ACO sospeso da più di 7 giorni, se l'utente lo segna.
> - FN di flusso: la domanda non è obbligatoria (`PostImaging.svelte:137-140`); se resta vuota FASTEST risulta non eleggibile ("nessuna terapia anticoagulante", `hem-reasons.ts:29`).
> - FP: EBPM in profilassi, se l'utente non la considera "Heparina".

- [ ] **6. [FP] La finestra di 2 h si calcola quando si inserisce l'ora, non quando si valuta.**
> [!warning] Contraddizione
> Protocollo: "Able to treat with study medication … within 2 hours" (inclusione 3); nella Parte 2, oltre 90 min serve lo spot sign (p. 26). Fa fede il tempo alla **somministrazione**, perché l'arruolamento coincide con la dose (p. 27) ([[FASTEST — Protocolo — V10.5]]).
> App: `hemEligibility` usa `$pre.ltsw` (`eligibility.ts:68-69`), salvato da `PreImaging.svelte:26`, `:36` al momento dell'inserimento. Le regole acute usano invece `ltswHours` (`stores/patient.ts:82-91`). Il tempo trascorso tra la scheda pre-imaging e il riepilogo non viene contato: un paziente inserito a 1 h 50 min resta "eleggibile" anche dopo le 2 h.

- [ ] **7. [FN] Bordo delle 2 h: la scheda FASTEST appare solo con `ltsw < 2`, la regola accetta `<= 2`.**
> [!warning] Contraddizione
> App: `showFastest` richiede `ltsw < 2` (`PostImaging.svelte:104`; testo "Solo se muestra si LTSW < 2h", `es.ts:172`), mentre `fastest()` accetta `ltsw <= 2` (`hemorrhagic-rules.ts:48`; `hem-reasons.ts:17`). A esattamente 2,0 h le 7 domande restano vuote, `extraMissing` è vero (`:53-60`) e il paziente risulta non eleggibile. Caso limite.

- [ ] **8. [FN] "Historia de trombosis aguda?" senza finestra di 90 giorni.**
> [!warning] Contraddizione
> Protocollo, esclusione 6: "Symptomatic thrombo-embolic or vaso-occlusive disease in past 90 days (e.g., cerebral infarction, myocardial infarction, pulmonary embolus, deep vein thrombosis, or unstable angina)" (p. 26).
> App: "Historia de trombosis aguda?" (`es.ts:176`), `thrombosis === "no"` (`hemorrhagic-rules.ts:69`). Letta come anamnesi remota, esclude chi ha avuto una TVP o un infarto anni fa (FN). Al contrario, "trombosis" può non far pensare a ictus ischemico, IMA o angina instabile recenti (FP).

- [ ] **9. [FP] Gravidanza, angioplastica: etichette più strette del criterio.**
> [!warning] Contraddizione
> Protocollo: esclusione 22, "pregnant or within 12 weeks post-partum and/or lactating"; esclusione 14, "Recent (within 90 days) carotid endarterectomy or coronary or cerebrovascular angioplasty or stenting" (p. 26–27).
> App: "Embarazo?" (`es.ts:177`) e "Angioplastia reciente?" (`es.ts:178`). Non citano puerperio e allattamento, endoarteriectomia, stent e la finestra di 90 giorni.

- [ ] **10. [NC] Altre esclusioni non modellate.**
> GCS e volume sono controllati, ma non lo sono:
> - piastrinopenia <50.000/µL (excl. 10);
> - coagulopatia e ACO negli ultimi 7 giorni come causa secondaria (excl. 2), salvo tramite la domanda sugli anticoagulanti;
> - cure palliative pianificate (excl. 17);
> - studio sperimentale negli ultimi 30 giorni (excl. 16), compreso [[TICH-3]];
> - precedente randomizzazione in FASTEST (excl. 21);
> - allergia o controindicazione al farmaco (excl. 19–20);
> - malattia terminale (excl. 15).
>
> ([[FASTEST — Protocolo — V10.5]], p. 26–27.) L'app può proporre FASTEST e TICH-3 insieme allo stesso paziente (`Summary.svelte:40-42`), ma il TXA esclude da FASTEST (excl. 12).

- [ ] **11. [TXT] La scheda informativa è vuota.**
> [!warning] Contraddizione
> App: `trials-info.ts:246-253`: `consent: "—"`, `imaging: "— (ICH pathway)."`, `preEvtLabs: "—"`, `intervention: "—"`, `notes: []`, `visits: null`.
> Protocollo e CI:
> - rFVIIa 80 µg/kg (massimo 10 mg) contro placebo, bolo e.v. in 2 min (p. 27);
> - TC + **angio-TC** basale obbligatoria, TC a 24 h (p. 24, p. 28);
> - ECG e troponina al basale, troponina a 24 h (p. 28);
> - consenso d'urgenza con inclusione senza consenso previo ammessa in Spagna (p. 44);
> - visite a 1 h, 24 h, G4/dimissione, G30 a distanza, **G90 in presenza**, G180 a distanza (p. 27–28; [[FASTEST — CI — v1.5]], p. 4–5).
>
> Testi suggeriti: window "≤ 2 h (91–120 min only if spot sign +)", GCS ≥8, volume 2–59 mL.

- [ ] **12. [TXT] Foglio del team: ECG a 24 h e follow-up solo telefonico.**
> [!warning] Contraddizione
> Foglio [[Esquema ensayos — septiembre 2026]]: "troponine + ECG basale e a 24 h", "telefonico fino a 180 gg".
> Protocollo: ECG **solo al basale**, troponina al basale e a 24 h (p. 28); mRS a 90 giorni **in presenza** nella Parte 2 (p. 27–28). Il CI lo conferma: "acuda a la clínica" a 90 giorni ([[FASTEST — CI — v1.5]], p. 4). Non è un dato dell'app, ma serve se si compila `visits`.

## Problemi documentali
- **CI anteriore al protocollo**: CI v1.5 del 15-03-2025, protocollo V10.5 del 03-02-2026. Il CI non cita la Parte 2, lo spot sign né l'angio-TC obbligatoria ([[FASTEST — CI — v1.5]]).
- **Promotore**: "NIH/NINDS rappresentato dall'Università di Cincinnati" nel CI (p. 1, p. 3); "Sponsor: Joseph P. Broderick, MD - University of Cincinnati" nel protocollo (p. 1).
- **Numerosità**: 980 pazienti nel CI (p. 3) contro 626 (Parte 1) + fino a 350 (Parte 2) nel protocollo (p. 5).
- **Protocollo**:
  - esclusione 3 con "and" invece di "or" (p. 26 vs p. 6);
  - "IVH score ≤ 7" (p. 24) non definito e diverso dal criterio dei ventricoli (p. 26);
  - EQ-5D incoerente tra p. 27 e p. 28;
  - figure e Study Schedule in immagine (p. 14, p. 20–21, p. 49).
- **Titolo "Prüfplan"**: non trovato nel testo né nei metadati della copia; il protocollo è in inglese.
- **Dal contesto della richiesta (non verificabile nella copia ordinata)**: la sinossi originale è ferma alla V9.5 e c'è un PDF di training da 0 byte. Nella cartella della copia ci sono solo i 3 file letti.
- **CI catalano**: piè di pagina con sigla "ES"; "familiar o familiar" (p. 1) ([[FASTEST — CI — v1.5 (català)]]).

## Fonti
- [[FASTEST — Protocolo — V10.5]]
- [[FASTEST — CI — v1.5]]
- [[FASTEST — CI — v1.5 (català)]]
- [[Esquema ensayos — septiembre 2026]] (stato e foglio HIC)
