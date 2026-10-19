---
tipo: ensayo
estudio: TICH-3
alias: ["Tranexamic acid for hyperacute spontaneous IntraCerebral Haemorrhage", TICH3]
estado_app: activo
clave_app: "TICH3"
categoria: hemorrágico
fase: "III"
promotor: "University of Nottingham (finanziamento NIHR HTA; coordinamento Nottingham Stroke Trials Unit)"
registro: ["ISRCTN97695350", "EudraCT 2021-001050-62", "EU CTIS 2022-500587-35-00", "IRAS 297457"]
protocolo_vigente: "Final Version 3.1, 25-04-2024"
ci_vigente: "v2.0, 21-03-2023 (solo modulo di firma del paziente, in castellano), anteriore al protocollo v3.1"
drive_carpeta: "https://drive.google.com/drive/folders/1iduIJmqrH__K4NcFo5e91VmiCWBYxAw5"
fuentes: ["[[TICH-3 — Protocolo — v3.1]]", "[[TICH-3 — CI — v2.0]]"]
actualizado: 2026-10-19
---
# TICH-3

> [!summary] In breve
> Studio di fase III pragmatico, randomizzato 1:1, in cieco: **[[Ácido tranexámico|acido tranexamico]] 2 g e.v.** (1 g in 10 min + 1 g in 8 h) contro placebo, in aggiunta allo standard of care, nell'**emorragia intracerebrale spontanea** entro **4,5 h** dall'esordio, o dalla scoperta se l'esordio è ignoto. Adulti senza limite superiore di età né di [[mRS]]; esclusi [[GCS]] <5, [[Volumen de hematoma|volume]] >60 mL (±10%), warfarin o EBPM terapeutica (i [[DOAC]] sono ammessi), cure palliative già decise. Endpoint primario: **morte a 7 giorni**. Almeno 5500 pazienti ([[TICH-3 — Protocolo — v3.1]], p. 5, p. 25–26).

> [!note] Stato
> Foglio del team: **aperto** ([[Esquema ensayos — septiembre 2026]]). App: `status: "active"` (`src/lib/domain/trials-info.ts:256`). Coerente. Vedi però la divergenza 6: il nome mostrato "TICH-3" non trova la chiave `TICH3`, quindi un cambio di stato non avrebbe effetto nel riepilogo.

## Disegno
- **Tipo**: fase III pragmatico, prospettico, randomizzato 1:1, in cieco, controllato con placebo. Pilota interno di 30 mesi, poi fase principale senza pause; circa 145 centri ([[TICH-3 — Protocolo — v3.1]], p. 5, p. 19).
- **Randomizzazione**: si apre la confezione numerata più bassa disponibile; sequenza stratificata per centro, a blocchi permutati di dimensione variabile. Il numero di confezione diventa il numero del paziente nell'eCRF ([[TICH-3 — Protocolo — v3.1]], p. 6, p. 17, p. 22).
- **Cieco**: paziente, famiglia, staff di arruolamento, équipe clinica e valutatori del follow-up. Fiale di TXA e di NaCl 0,9% rese simili con etichette e guaina ([[TICH-3 — Protocolo — v3.1]], p. 22–23).
- **Numerosità**: almeno 5500 (2750 per braccio). Ipotesi: morte a 7 giorni dal 10,31% al 7,74% (OR 0,73), alfa 5% bilaterale, potenza 90% ([[TICH-3 — Protocolo — v3.1]], p. 5, p. 36).
- **Endpoint primario**: morte entro il giorno 7 incluso dall'esordio ([[TICH-3 — Protocolo — v3.1]], p. 21).
- **Secondari**: mRS a 180 giorni (il principale); morte entro il giorno 2; EQ-5D-5L e VAS, giorni a casa, AD-8, FSS-7 a 180 giorni ([[TICH-3 — Protocolo — v3.1]], p. 21, p. 37).
- **Sicurezza**: TEV, eventi ischemici arteriosi e crisi epilettiche nei primi 7 giorni; eventi fatali fino alla dimissione. Gli altri AE e SAE non si raccolgono ([[TICH-3 — Protocolo — v3.1]], p. 21, p. 37–38).
- **Base razionale**: in TICH-2 (entro 8 h) il TXA riduceva crescita dell'ematoma e morte precoce ma non la disabilità a 90 giorni. TICH-3 arruola prima ed esclude gli ematomi grandi ([[TICH-3 — Protocolo — v3.1]], p. 13–15).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Entro 4,5 h dall'esordio; con esordio ignoto (anche al risveglio) entro 4,5 h **dalla scoperta**. Il farmaco va **iniziato** entro 4,5 h; randomizzare oltre è una violazione | ([[TICH-3 — Protocolo — v3.1]], p. 25–26, p. 34) |
| Età | ≥18 anni, nessun limite superiore | ([[TICH-3 — Protocolo — v3.1]], p. 25) |
| mRS pre | Nessun criterio (si registra al giorno 1) | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 25) |
| Gravità | Esclusione: GCS <5 (quindi GCS ≥5 ammesso). Nessun criterio di NIHSS | ([[TICH-3 — Protocolo — v3.1]], p. 26) |
| Imaging | TC o RM cerebrale di routine che conferma l'ICH. Angio-TC non richiesta; lesioni vascolari da escludere solo se **note** | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 26, p. 33) |
| Volume | Escluso >60 mL (±10%), stimato con ABC/2; in alternativa diametro massimo >5 cm = escludere | ([[TICH-3 — Protocolo — v3.1]], p. 26, p. 33) |
| IVH | Non esclusa | ([[TICH-3 — Protocolo — v3.1]], p. 26) |
| Anticoagulanti | Esclusi warfarin ed EBPM terapeutica in corso; **DOAC ammessi** | ([[TICH-3 — Protocolo — v3.1]], p. 25–26) |
| Gravidanza | Non esclusa; decide l'incertezza del clinico | ([[TICH-3 — Protocolo — v3.1]], p. 26–27) |
| Laboratorio | Nessuno | ([[TICH-3 — Protocolo — v3.1]], p. 35) |

## Criteri di inclusione
Testo originale ([[TICH-3 — Protocolo — v3.1]], p. 25; sinossi p. 5):

> Adults (≥ 18years) within 4.5 h of onset of acute spontaneous ICH (confirmed on brain imaging). When onset of symptoms is unknown patient must be within 4.5 hours of symptom discovery and have no other exclusion criteria. (p. 25)

Precisazione sull'ICH spontanea: "It is not necessary to exclude underlying vascular lesions (e.g. aneurysms) – but if they are known that is not 'spontaneous' ICH so participant should not be included." (p. 26)

**Sintesi**: adulto con ICH spontanea confermata all'imaging, entro 4,5 h dall'esordio o dalla scoperta dei sintomi. Una causa secondaria **nota** (aneurisma, MAV, trauma…) esclude, ma non bisogna cercarla attivamente.

## Criteri di esclusione
Testo originale ([[TICH-3 — Protocolo — v3.1]], p. 25–26; sinossi p. 5):

i. Patient with a known indication for TXA treatment (e.g. traumatic brain injury). (p. 25)
ii. Patient with contraindication to TXA (p. 25)
iii. Patient known to be taking therapeutic anticoagulation with warfarin or low molecular weighted heparin at time of enrolment. Patients taking direct oral anticoagulants can be included and are not excluded. (p. 25)
iv. Massive ICH for which haemostatic treatment seems futile (This would ordinarily be when haematoma volume is estimated as larger than 60ml (+/-10%)) (p. 26)
v. Severe coma (Glasgow Coma Scale <5) (p. 26)
vi. Decision already taken for palliative (end of life) care with withdrawal of active treatment (p. 26)

**Sintesi**: esclusi i pazienti con indicazione al TXA (trauma cranico) o con controindicazione (non elencate nel protocollo: rimanda alla scheda tecnica), in terapia anticoagulante terapeutica con warfarin o EBPM, con ematoma >60 mL (±10%), GCS <5 o cure palliative già decise. **Non** sono esclusi: DOAC, IVH, candidati neurochirurgici, gravidanza, anziani, disabilità previa ([[TICH-3 — Protocolo — v3.1]], p. 26–27).

## Intervento e procedure
- **Farmaco**: TXA 2 g e.v. da una cannula venosa: carico di 1 g (10 mL in 100 mL di NaCl 0,9%) **in 10 minuti**, poi 1 g (10 mL in 250 mL) **in 8 ore**. Placebo: NaCl 0,9% con lo stesso schema. Confezione con 4 fiale da 500 mg/5 mL ([[TICH-3 — Protocolo — v3.1]], p. 6, p. 31). Il foglio del team lo riassume come "bolo 10 min, 2 fiale, + infusione 8 h, 2 fiale" ([[Esquema ensayos — septiembre 2026]]).
- **Tempi**: il farmaco si può iniziare in sala TC; la confezione può viaggiare con il paziente nella "grab bag" dei trombolitici. Se la confezione è aperta e l'ICH non si conferma, va distrutta ([[TICH-3 — Protocolo — v3.1]], p. 18, p. 25).
- **Sospensione**: con un evento di sicurezza (trombosi o crisi) durante l'infusione, l'infusione si ferma ([[TICH-3 — Protocolo — v3.1]], p. 22–23).
- **Standard of care**: riduzione della PA secondo linee guida; nei pazienti in DOAC è ammessa l'antagonizzazione, che viene registrata. Neurochirurgia consentita ([[TICH-3 — Protocolo — v3.1]], p. 25–26, p. 33).
- **Trombolisi e trombectomia**: non pertinenti (ICH). Il TXA antagonizza i fibrinolitici ([[TICH-3 — Protocolo — v3.1]], p. 18).
- **Imaging**: TC o RM all'arrivo (standard of care); nessun imaging di controllo previsto dallo studio ([[TICH-3 — Protocolo — v3.1]], p. 33, p. 35).
- **Laboratorio**: nessuno ([[TICH-3 — Protocolo — v3.1]], p. 35).

## Visite e follow-up
| Visita | Momento | Contenuto | Fonte |
|---|---|---|---|
| Basale | dopo la TC/RM | checklist, consenso orale, randomizzazione, farmaco | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 32) |
| Giorno 1 | dati inseriti dopo la randomizzazione | GCS, NIHSS, PA, volume, mRS pre, CFS, lavoro, disposizione | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 32) |
| Giorno 7, dimissione o morte | eCRF dal centro | eventi di sicurezza, morte a 7 giorni (primario), degenza, disposizione, risorse | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 32) |
| Giorno 180 | **centralizzato** (coordinatore nazionale) | questionario **postale**, telefono se non risponde, anche da un proxy: mRS, EQ-5D-5L, AD-8, FSS-7, risorse | ([[TICH-3 — Protocolo — v3.1]], p. 20, p. 33) |

Il foglio del team riporta "7 gg, 180 gg" ([[Esquema ensayos — septiembre 2026]]): coerente.

## Consenso
- **Protocollo**: consenso d'urgenza **orale** del paziente o del rappresentante legale personale (familiare, anche per telefono); se non c'è nessuno, un **medico indipendente** firma come rappresentante legale professionale. Consenso scritto appena possibile, idealmente entro 24 h. Telemedicina e consenso telefonico o in videochiamata con testimone sono ammessi. I dati di chi muore o non recupera la capacità si usano ([[TICH-3 — Protocolo — v3.1]], p. 28–31). Vedi [[Consentimiento diferido]].
- **CI in Drive (v2.0)**: solo il modulo di firma del paziente capace, in castellano; la hoja de información v2.0 a cui rimanda non è in Drive ([[TICH-3 — CI — v2.0]], p. 1–2).
- **Lingue**: castellano (nonostante il nome del file dica "inglés"). Nessuna versione in catalano.

## Co-arruolamento
- Il protocollo **non tratta** il co-arruolamento né la partecipazione ad altri studi ([[TICH-3 — Protocolo — v3.1]], ricerca testuale su tutte le 55 pagine).
- In senso inverso, [[FASTEST]] esclude i procoagulanti nelle 24 h precedenti, citando proprio l'acido tranexamico, e chi ha partecipato a uno studio sperimentale negli ultimi 30 giorni ([[FASTEST — Protocolo — V10.5]], p. 26). Un paziente randomizzato in TICH-3 non può quindi entrare in FASTEST.
- FASTEST → TICH-3: TICH-3 non esclude chi ha ricevuto rFVIIa né chi è in un altro studio. Il protocollo non dice nulla in merito.
- In pratica, con ICH entro 2 h ed età 18–80 i due studi sono **alternativi**: bisogna scegliere a quale proporre il paziente.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:255-267` (voce `TICH3`) e `:399-413` (`findTrialInfo`, `isTrialOpen`);
- `src/lib/domain/hemorrhagic-rules.ts:82-91` (`tich3()`) e `src/lib/domain/hem-reasons.ts:33-42` (`reasonTich3()`);
- `src/lib/stores/eligibility.ts:68-74`;
- interfaccia: `src/routes/PreImaging.svelte:20-37`, `src/routes/PostImaging.svelte:46-62`, `:122-140`, `:226-264`, `src/routes/Summary.svelte:40-55`, etichette `src/lib/i18n/es.ts:254-257`, `:306-312`;
- storia: commit `691c0a2` (i toggle "IVH isolata" ed "Esclusione TXA" partivano da `""` e TICH-3 non risultava mai eleggibile; ora partono da `"no"`, `PostImaging.svelte:49-54`).

Verificato il 2026-10-19.

> [!success] Coincide
> - Finestra <4,5 h (`hemorrhagic-rules.ts:84`; testo `trials-info.ts:258`), ma vedi i punti 3 e 4;
> - volume <60 mL (`:85`), ma vedi il punto 8 sul ±10%;
> - GCS ≥5 (`:87`), esattamente l'esclusione "GCS <5";
> - causa secondaria nota esclusa (`secondaryCause === "None"`, `:89`), comprese trauma, MAV, aneurisma e tumore, come da p. 25–26;
> - nessun limite superiore di età (`trials-info.ts:258` "No upper limit");
> - nessun criterio di mRS pre, NIHSS o gravidanza, come il protocollo;
> - l'IVH associata a ICH non esclude;
> - stato `active` come nel foglio (`trials-info.ts:256`).

- [ ] **1. [FP] Warfarin ed EBPM non escludono: la regola ignora la domanda sugli anticoagulanti.**
> [!warning] Contraddizione
> Protocollo, esclusione iii: "Patient known to be taking therapeutic anticoagulation with warfarin or low molecular weighted heparin at time of enrolment. Patients taking direct oral anticoagulants can be included and are not excluded." ([[TICH-3 — Protocolo — v3.1]], p. 25).
> App: la scheda emorragica chiede "Terapia anticoagulante" con Ninguna / Warfarin / "Heparina <24h" / DOAC (`PostImaging.svelte:130-135`, `:261-262`; `es.ts:169`, `:312`). `tich3()` però **non legge `anticoag`** (`hemorrhagic-rules.ts:82-91`; `hem-reasons.ts:33-42`). Un paziente in warfarin, o in EBPM a dose terapeutica, risulta eleggibile. È il FP più rilevante, perché la domanda c'è già. Vanno invece lasciati eleggibili i DOAC, come fa già l'app.
> Nota: il protocollo nomina solo il warfarin. Per l'acenocumarolo, l'AVK più usato in Spagna, e per l'eparina non frazionata serve conferma del promotore. L'etichetta "Heparina <24h" non coincide con "therapeutic … at time of enrolment".

- [ ] **2. [FP] L'età ≥18 non viene controllata.**
> [!warning] Contraddizione
> Protocollo: "Adults (≥ 18years)" (p. 25).
> App: `tich3()` non ha condizioni su `age` (`hemorrhagic-rules.ts:82-91`). Il testo `trials-info.ts:258` dice "No upper limit", senza limite inferiore. Rilevanza pratica bassa (ICH pediatrica in un'unità ictus di adulti).

- [ ] **3. [FN] Esordio ignoto o ictus al risveglio: l'app conta dall'ultima volta visto bene, il protocollo dalla scoperta.**
> [!warning] Contraddizione
> Protocollo: "When onset of symptoms is unknown patient must be within 4.5 hours of symptom discovery" (p. 25); "presenting within 4.5 hours of wake-up or discovery" (p. 26) ([[TICH-3 — Protocolo — v3.1]]).
> App: `ltsw` sono le ore dall'LTSW (`PreImaging.svelte:20`, `:26`, `:36`; etichetta "LTSW", `es.ts:105`). Il flag `wakeupStroke` esiste (`PreImaging.svelte:21`, `:37`), ma `tich3()` non lo usa e non esiste un campo "ora della scoperta". Un'ICH scoperta al risveglio 1 h prima, con LTSW la sera prima, risulta non eleggibile anche se il protocollo la ammette. Vedi [[Ictus del despertar]].

- [ ] **4. [FP] La finestra si calcola quando si inserisce l'ora, non quando si valuta né quando si somministra.**
> [!warning] Contraddizione
> Protocollo: il farmaco va **iniziato** entro 4,5 h; "randomisation after 4.5 hours after ICH" è una violazione di protocollo (p. 25–26, p. 34).
> App: `hemEligibility` usa `$pre.ltsw` (`eligibility.ts:68-69`), salvato da `PreImaging.svelte:36` quando si compila la scheda pre-imaging. Le regole acute usano invece `ltswHours`, ricalcolato (`stores/patient.ts:82-86`). Un paziente inserito a 4 h resta "eleggibile" anche se il riepilogo si apre a 5 h. Stesso problema descritto in [[FASTEST]] (divergenza 6).

- [ ] **5. [NC] FASTEST e TICH-3 proposti insieme, senza avviso.**
> [!warning] Contraddizione
> [[FASTEST]] esclude i procoagulanti nelle 24 h ("example, tranexamic acid") e la partecipazione a uno studio sperimentale negli ultimi 30 giorni ([[FASTEST — Protocolo — V10.5]], p. 26). Il protocollo TICH-3 non parla di co-arruolamento ([[TICH-3 — Protocolo — v3.1]]).
> App: `hemEligibleList` elenca entrambi (`Summary.svelte:40-43`) e si possono selezionare insieme (`:47-48`). Con ICH <2 h, età 18–80, mRS ≤2, GCS ≥8 e volume 2–59 mL entrambi risultano eleggibili e non compare nessun avviso che sono alternativi.

- [ ] **6. [NC] "TICH-3" non trova la scheda `TICH3`: lo stato non verrebbe applicato.**
> [!warning] Contraddizione
> App: il riepilogo filtra con `isTrialOpen(e.display)` (`Summary.svelte:47-54`) e il nome mostrato è "TICH-3" (`:42`). `findTrialInfo("TICH-3")` cerca la chiave esatta o una chiave uguale ignorando le maiuscole (`trials-info.ts:399-404`): "tich-3" ≠ "tich3", quindi restituisce `undefined` e `isTrialOpen` risponde `true` per default (`:410-413`). Oggi non ha effetto perché TICH-3 è `active` (`:256`). Se il team lo mettesse in pausa o lo chiudesse in `trials-info.ts`, l'app continuerebbe a proporlo. Altri punti fanno già la conversione esplicita "TICH-3" ↔ "TICH3" (`src/lib/domain/sheet-payload.ts:44`, `:67`).

- [ ] **7. [FN] L'"IVH isolata" esclude, ma il protocollo non la nomina.**
> [!warning] Contraddizione
> Protocollo: "Patients with intra-ventricular haemorrhage (IVH) will not be excluded" (p. 26). L'inclusione richiede però una "acute spontaneous ICH" (p. 25). L'emorragia ventricolare **primaria**, senza componente parenchimale, non è trattata ([[TICH-3 — Protocolo — v3.1]]).
> App: `ivh === "no"` è obbligatorio (`hemorrhagic-rules.ts:86`; etichetta "Hemorragia aislada IVH — confinada al sistema ventricular", `es.ts:254-255`; `hem-reasons.ts:37`). È un criterio dell'app, non del protocollo. È ragionevole se l'IVH primaria non conta come ICH, ma va confermato con il promotore. Attenzione: lo stesso toggle alimenta l'ICH score (`PostImaging.svelte:227`; `HIchCard.svelte:20-21`), dove "IVH" significa IVH **presente**, non isolata. Chi lo attiva per un'ICH con estensione ventricolare esclude per errore il paziente da TICH-3.

- [ ] **8. [FN] Volume: limite rigido a 60 mL contro "larger than 60ml (+/-10%)".**
> [!warning] Contraddizione
> Protocollo: esclusione se "estimated as larger than 60ml (+/-10%)" (p. 26); inclusione "HV < 60 mls (+/-10%)" (p. 26). In alternativa basta il diametro massimo: >5 cm = escludere (p. 26, p. 33) ([[TICH-3 — Protocolo — v3.1]]).
> App: `hemVolume < 60` (`hemorrhagic-rules.ts:85`; `hem-reasons.ts:36`). Esattamente 60 mL è escluso, mentre il protocollo esclude "larger than 60". La tolleranza del ±10% non è prevista. Caso limite. Non c'è nemmeno la scorciatoia del diametro: con "volume non disponibile" (`PostImaging.svelte:47`, `:232`) la regola usa comunque il valore del quadrante.

- [ ] **9. [NC] Indicazione e controindicazione al TXA: un solo toggle, criteri non definiti.**
> [!warning] Contraddizione
> Protocollo: esclusione i "known indication for TXA treatment (e.g. traumatic brain injury)" ed esclusione ii "contraindication to TXA", senza elenco: rimanda alla scheda tecnica (SmPC), che non è in Drive ([[TICH-3 — Protocolo — v3.1]], p. 18, p. 25).
> App: il toggle "Exclusion TXA — Convulsiones / trombosis / hipersensibilidad a TXA" (`es.ts:256-257`; `PostImaging.svelte:258`) deve essere "no" (`hemorrhagic-rules.ts:88`). Il campo si chiama `seizure`, ma il toggle copre tre condizioni. Non si sa se "Convulsiones" significhi crisi all'esordio dell'ICH o storia di epilessia: il protocollo non dice né l'una né l'altra. Il toggle parte da "no" (`PostImaging.svelte:54`), quindi se nessuno lo apre il paziente risulta eleggibile. Il trauma cranico è coperto da `secondaryCause = "Traumatic"`.

- [ ] **10. [NC] Cure palliative già decise: non chieste.**
> Protocollo, esclusione vi: "Decision already taken for palliative (end of life) care with withdrawal of active treatment" (p. 26). App: nessun campo (`HemorrhagicInput`, `hemorrhagic-rules.ts:21-38`).

- [ ] **11. [TXT] La scheda informativa è vuota.**
> [!warning] Contraddizione
> App: `trials-info.ts:259-266`: `consent: "—"`, `imaging: "— (ICH pathway)."`, `thrombolytic: "—"`, `preEvtLabs: "—"`, `intervention: "—"`, `notes: []`, `visits: null`; `key.age` "No upper limit" senza "≥ 18 y".
> Protocollo e foglio:
> - intervento: TXA 2 g e.v. (1 g in 10 min + 1 g in 8 h) contro placebo (p. 31);
> - imaging: TC o RM di routine, volume ABC/2 o diametro >5 cm (p. 26, p. 33);
> - laboratorio: nessuno (p. 35);
> - consenso: orale d'urgenza del paziente o del familiare, anche telefonico, poi scritto entro circa 24 h; medico indipendente se non c'è nessuno (p. 28–31);
> - note: DOAC ammessi, warfarin ed EBPM esclusi, IVH non esclusa, esordio ignoto contato dalla scoperta (p. 25–26);
> - visite: giorno 1, giorno 7 o dimissione, giorno 180 postale o telefonica centralizzata (p. 20, p. 33).

- [ ] **12. [TXT] Etichette dei motivi.**
> App: "LTSW < 4.5h" (`hem-reasons.ts:35`) per un criterio che il protocollo misura dall'esordio o dalla scoperta. "no convulsioni / trombosi / ipersensibilita' a TXA" (`:39`) per un'esclusione che il protocollo formula come "contraindication to TXA". Mancano le etichette per età e anticoagulanti (vedi punti 1–2).

> [!note] Foglio del team
> Il foglio scrive "GCS >5" ([[Esquema ensayos — septiembre 2026]]), ma il protocollo esclude solo GCS <5, quindi GCS 5 è ammesso ([[TICH-3 — Protocolo — v3.1]], p. 26). L'app (`gcs >= 5`) segue il protocollo. Il resto della riga del foglio coincide con il protocollo (<4,5 h, nessun limite di età né di mRS, <60 mL con DOAC ammessi, niente esami, visite a 7 e 180 giorni).

## Problemi documentali
- **Nome del file del protocollo**: "sin version en el titulo — 2024-10". La versione è nel documento: **Final Version 3.1 del 25-04-2024**. "2024-10" è la data di stampa del PDF ([[TICH-3 — Protocolo — v3.1]], p. 1).
- **Nome del file del CI**: "v2.0 ingles", ma il modulo è **in castellano** (plantilla de país para España). È solo il modulo di firma del paziente; la hoja de información v2.0 non è in Drive ([[TICH-3 — CI — v2.0]]).
- **CI anteriore al protocollo**: 21-03-2023 contro 25-04-2024.
- **Mancano i moduli del percorso d'urgenza** (consenso orale, familiare, medico indipendente, consenso a continuare) previsti dal protocollo (p. 28–31). Non si sa come il percorso britannico del "medico indipendente" sia stato adattato in Spagna.
- **Cartella originale**: secondo il contesto fornito per l'ingestione, contiene sette file da 0 byte (sinossi spagnola v4.1, quattro CRF, due manuali di imaging), non copiati nella copia ordinata. Non esiste un CI tradotto oltre a questo modulo. Da segnalare al team: i file vanno ricaricati.
- **Anomalie interne del protocollo**: flow chart della v3.0 dentro la v3.1 (p. 20); data della SmPC di riferimento 02-02-2021 (p. 18, p. 55) contro 11-04-2019 (p. 40); 2750 contro 2688 per braccio (p. 5, p. 36); durata "7.25 years" (p. 5) contro "7 year 4 months" (p. 24); rimandi errati all'Appendix 1 (p. 19) e alla Tabella 1 (p. 31).
- **Controindicazioni al TXA** non elencate nel protocollo (esclusione ii): serve la SmPC.
- **Warfarin**: l'esclusione iii non nomina gli altri AVK.

## Fonti
- [[TICH-3 — Protocolo — v3.1]]
- [[TICH-3 — CI — v2.0]]
- [[Esquema ensayos — septiembre 2026]] (stato e sintesi del team)
- [[FASTEST]] (co-arruolamento)
