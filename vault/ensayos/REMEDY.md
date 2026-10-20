---
tipo: ensayo
estudio: REMEDY
alias: [REMEDY-2, ReMEDy2, "ReMEDy2 Trial", DM199-2021-001, rinvecalinasa, "rinvecalinase alfa", DM199]
estado_app: activo
clave_app: "REMEDY"
categoria: isquémico
fase: "2/3 (disegno adattivo)"
promotor: "DiaMedica Therapeutics Inc."
registro: ["NCT05065216", "EU CT 2024-513911-28-00", "IND 151943"]
protocolo_vigente: "V6.2, 29-10-2025 [EU Only]"
ci_vigente: "v2.1, 13-07-2026 (HIP-DCI Spagna, da DCI master UE V3.0 del 03-11-2025)"
drive_carpeta: "https://drive.google.com/drive/folders/1XulIeeBAMKvliXKixSeFUg7Gto0qyhK6"
fuentes: ["[[REMEDY — Protocolo — V6.2]]", "[[REMEDY — Sinopsis — V5.0]]", "[[REMEDY — CI — v2.1]]"]
actualizado: 2026-10-19
---
# REMEDY

> [!summary] In breve
> Studio di fase 2/3 adattivo, randomizzato 1:1, in doppio cieco, promosso da DiaMedica. Confronta DM199 (rinvecalinase alfa, callicreina tissutale umana ricombinante) con placebo nell'ictus ischemico **senza occlusione di grosso vaso trattabile** e **senza trombectomia**. La finestra è <24 h dal LKW, con [[NIHSS]] 5–15, [[mRS]] pre 0–1 e [[ASPECTS]] ≥6 (esclusi 0–5). Lo schema è una dose e.v., poi 7 iniezioni s.c. fino al giorno 21. I pazienti trombolisati entrano solo se, ≥6 h dopo la fibrinolisi, hanno ancora un NIHSS 5–15 con miglioramento <4 punti e un imaging senza PH1/PH2 ([[REMEDY — Protocolo — V6.2]], p. 10, p. 37–38, p. 41).

> [!note] Stato
> Foglio "Esquema ensayos" (come REMEDY-2): **aperto**. App: `status: "active"` (`src/lib/domain/trials-info.ts:302`). Coerente.

## Disegno
- **Tipo**: fase 2/3, adattivo, randomizzato 1:1, doppio cieco, controllato con placebo (p. 12, p. 35). Il placebo ha gli stessi eccipienti, lo stesso aspetto e lo stesso schema ([[REMEDY — Protocolo — V6.2]], p. 41).
- **Randomizzazione**: IRT; stratificazione per NIHSS allo screening (5–10 vs 11–15) e per fibrinolisi precedente sì/no ([[REMEDY — Protocolo — V6.2]], p. 46).
- **Numerosità**: 364 pazienti per 90% di potenza (mRS 0–1 atteso del 15% con placebo e del 29% con DM199). Analisi ad interim dopo 200 pazienti a 90 giorni (futilità e ricalcolo), poi parte B fino a un massimo di 728. Circa 100 centri ([[REMEDY — Protocolo — V6.2]], p. 10, p. 15, p. 73–74).
- **Endpoint primario**: mRS 0–1 a 90 giorni ([[REMEDY — Protocolo — V6.2]], p. 33).
- **Endpoint secondari**: shift del mRS, mRS 0–2, mortalità, NIHSS 0–1 e Barthel ≥95 a 90 giorni; recidiva ischemica ([[REMEDY — Protocolo — V6.2]], p. 33–34).
- **Storia**: arruolamento sospeso nel 2022 dopo 3 ipotensioni gravi su 9 pazienti con 1 µg/kg e.v.; ripreso con 0,5 µg/kg (max 50 µg) ([[REMEDY — Protocolo — V6.2]], p. 25, p. 35).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | randomizzazione e **inizio dell'infusione e.v.** entro 24 h dal LKW/esordio ("< 24 hours" in Tab. 3). Dopo fibrinolisi (fatta entro 4,5 h), almeno 6 h dalla fine della fibrinolisi | ([[REMEDY — Protocolo — V6.2]], p. 37, p. 43) |
| Età | 18–90 anni inclusi | ([[REMEDY — Protocolo — V6.2]], p. 37) |
| Peso | 40–166 kg inclusi | ([[REMEDY — Protocolo — V6.2]], p. 37) |
| mRS pre | 0–1 | ([[REMEDY — Protocolo — V6.2]], p. 37) |
| NIHSS | 5–15 "at approximately the time of randomization", misurato subito prima della randomizzazione. Ammessi i pazienti con NIHSS iniziale <5 che peggiorano a 5–15 in modo persistente. Dopo fibrinolisi: NIHSS pre-trombolisi ≤15, e 5–15 persistente ≥6 h dopo con miglioramento <4 punti | ([[REMEDY — Protocolo — V6.2]], p. 20, p. 37) |
| Imaging / ASPECTS / core | escluso ASPECTS 0–5 (cioè serve ≥6); esclusa emorragia; dopo fibrinolisi o peggioramento, imaging ripetuto: escludono PH1, PH2 ([[Clasificación de Heidelberg|Heidelberg]]) o emorragia con peggioramento; HI1 e HI2 ammessi. Perfusione non richiesta | ([[REMEDY — Protocolo — V6.2]], p. 20, p. 37–38) |
| Occlusione | **esclusa** l'occlusione di grosso vaso **sintomatica** di ICA intracranica (I/T/L), M1, vertebrale o basilare. Esclusi anche ictus del tronco o del cervelletto (imaging e sintomi) e la dissezione extracranica. Ammessi gli ictus della ACP senza coinvolgimento di tronco o cervelletto | ([[REMEDY — Protocolo — V6.2]], p. 38) |

## Criteri di inclusione
Testo originale (§6.1, [[REMEDY — Protocolo — V6.2]], p. 37; identico nella sinossi, p. 12–13):

1. Participant is between 18 and 90 years of age inclusive.
2. Participant weight is 40 kg to 166 kg inclusive.
3. Participant to be randomized and infusion with investigational product initiated within 24 hours of last known normal/AIS stroke onset.
4. Participant has NIHSS ≥5 and ≤15 at approximately the time of randomization. This criterion also applies to participants who meet the following conditions:
   - The participant initially presents with an NIHSS score below 5 but clinically worsens, including cases of progressing stroke/stroke-in-evolution, resulting in a subsequent persistent NIHSS score of ≥5 and ≤15; and
   - Participant meets all other inclusion and exclusion criteria, including repeat brain imaging to rule out hemorrhagic transformation.
5. Participant had a pre-morbid mRS score of 0 to 1 (mRS score prior to AIS) as stated by participant or participant's representative.
6. If participant has received fibrinolytic treatment for AIS within 4.5 hours of last known normal/AIS stroke onset and at least 6 hours after completing fibrinolytic treatment, and the participant meets all of the following criteria:
   - Participant's initial NIHSS score prior to fibrinolytics was ≤15; and
   - At least six hours after fibrinolytics, the participant has NIHSS score of ≥5 and ≤15 with a persistent deficit; and
   - The participant's NIHSS score showed less than a 4-point improvement, or worsened, after receiving fibrinolytics; and
   - Participant meets all other inclusion and exclusion criteria including repeat brain imaging to rule out hemorrhagic transformation. Hemorrhagic transformation is defined as any of the following: PH1 or PH2 type hemorrhage based on Heidelberg Classification; Hemorrhage resulting in neurologic deterioration. Note: HI1 and HI2 type hemorrhages based on Heidelberg classification are not exclusionary.
7. Participant and/or legally authorized representative is able to provide informed consent.
8. Participant is willing and able to comply with the study protocol, in the Investigator's judgment.

**Sintesi**: adulto di 18–90 anni e 40–166 kg, mRS pre 0–1, NIHSS 5–15 alla randomizzazione, infusione iniziata entro 24 h. Chi ha fatto la trombolisi entra solo dopo ≥6 h dalla fine, con NIHSS pre-trombolisi ≤15, NIHSS ancora 5–15 con miglioramento <4 punti e imaging senza PH1/PH2.

## Criteri di esclusione
Testo originale (§6.2, [[REMEDY — Protocolo — V6.2]], p. 38–40; sinossi p. 13–15):

1. At screening, or with repeat imaging (see Inclusion 4 and 6), participant has imaging confirmed hemorrhage stroke. (p. 38)
2. Participant has image findings with symptomatic large vessel occlusion at one or more of the following locations: Intracranial carotid I/T/L or M1 segment MCA, vertebral or basilar artery (BA). (p. 38)
3. Participant has large core of established infarction defined as Alberta Stroke Program Early CT Score (ASPECTS) 0-5. (p. 38)
4. Participant has or will receive MT for their current AIS. Diagnostic angiogram without proceeding to MT is not exclusionary). (p. 38)
5. Participant has suspected or confirmed extracranial arterial dissection. (p. 38)
6. Participant has imaging findings and symptoms consistent with a brain stem or cerebellar stroke. Posterior cerebral artery strokes without any associated brain stem or cerebellar involvement are allowable. (p. 38)
7. Participant has 2 consecutive recorded measurements of SBP <100 mmHg or MAP <65 mmHg; MAP = DBP + [1/3 (SBP – DBP)] after stroke symptom onset and within 6 hours prior to randomization. (p. 38)
8. Participant is currently prescribed angiotensin-converting enzyme inhibitor (ACEi) and is unable or unwilling to convert to another antihypertensive pharmacological treatment through Day 29 ±1 day (8 days after last treatment). (p. 38)
9. Participant is currently prescribed an (ACEi), and the last reported dose by the participant or their representative: was taken less than 24 hours prior to the start of IV IP infusion for participants with normal or mild (CKD 1-3a [eGFR ≥ 45 mL/min/1.73 m²]), or was taken less than 48 hours prior to the start of IV IP infusion for participants with significant (CKD 3b or higher [eGFR < 45 mL/min/1.73 m²]) (p. 38)
10. Participant has a history of clinically significant allergic reactions such as angioedema or anaphylaxis requiring hospitalization. (p. 38)
11. Participant has a diagnosis or suspected diagnosis of hereditary angioedema (HAE) or is taking or prescribed medications commonly used as prophylaxis/treatment of HAE, such as C1-esterase inhibitors (Cinryze, Berinert, Ruconest, Haegarda), Danazol, kallikrein inhibitors (Ecallantide, Berotralstat, Lanadelumab), Bradykinin B2 Receptor Antagonists (Icatibant), or other medication designed to influence the kallikrein-kinin system. (p. 38)
12. Life expectancy estimated at ≤1 year prior to enrollment. (p. 38)
13. Participant has clinical evidence of an active infection at the time of enrollment requiring parenteral treatment or hospitalization to monitor or manage the infection. NOTE: Treatment of uncomplicated infections with oral antibiotics would not be an exclusion (…). (p. 38–39)
14. Participant has known alpha 1-antitrypsin deficiency (α1-antitrypsin deficiency). (p. 39)
15. Participant is pregnant or nursing. NOTE: Participants who agree to stop nursing may be considered for inclusion at the discretion of the Investigator. (p. 39)
16. Participants of child-bearing potential who do not agree to use medically acceptable contraceptive measures to prevent pregnancy. (…) must have a negative serum pregnancy test performed locally at screening. (…) (p. 39; testo completo in [[REMEDY — Protocolo — V6.2]])
17. Participant is currently participating in or has participated in a study using an investigational device or drug or received an investigational drug or investigational use of a licensed drug within 30 days prior to screening. (p. 39)
18. Participant does not have sufficient venous access for infusion of investigational product or blood sampling. (p. 40)
19. Participant is unable or unwilling to comply with protocol requirements, including assessments, tests, and follow-up visits. (p. 40)
20. Participant has any other medical condition (such as hemodialysis) which in the opinion of the Investigator will make participation medically unsafe or interfere with the study results. (p. 40)

**Sintesi**: sono esclusi:
- emorragia; LVO sintomatica di ICA intracranica, M1, vertebrale o basilare; ASPECTS 0–5;
- trombectomia fatta o prevista (l'angiografia solo diagnostica non esclude);
- dissezione extracranica; ictus del tronco o del cervelletto;
- ipotensione: 2 misure consecutive con PAS <100 o PAM <65 nelle 6 h prima della randomizzazione;
- ACEi preso <24 h prima dell'infusione (<48 h se eGFR <45), o impossibilità di sospenderlo fino al giorno 29;
- angioedema ereditario o farmaci sul sistema callicreina-chinina; allergie gravi; deficit di α1-antitripsina;
- infezione attiva che richiede terapia parenterale; aspettativa di vita ≤1 anno; gravidanza o allattamento;
- **qualunque studio sperimentale con farmaco o dispositivo in corso o negli ultimi 30 giorni**; emodialisi o altre condizioni a giudizio dello sperimentatore.

> [!warning] Differenze rispetto alla sinossi in Drive (V5.0, due versioni indietro)
> La "sinossi" in Drive è l'estratto del protocollo V5.0 del 26-08-2024 ([[REMEDY — Sinopsis — V5.0]]). Rispetto alla V6.2 vigente cambiano:
> - **Escl. 7 (ipotensione)**: V5.0 "**any** recorded SBP < 100 … or MAP <65 … after stroke symptom onset and prior to randomization" (p. 12) → V6.2 "**2 consecutive** recorded measurements … **within 6 hours** prior to randomization" (p. 38). V6.2 più permissiva.
> - **Escl. 9 (ACEi)**: V5.0 solo "< 24 hours before start of IV study drug infusion" (p. 12) → V6.2 <24 h se eGFR ≥45, **<48 h se eGFR <45** (p. 38). V6.2 più restrittiva nell'insufficienza renale.
> - **Escl. 6 (tronco/cervelletto)**: V5.0 "imaging findings **and/or** symptoms" (p. 12) → V6.2 "imaging findings **and** symptoms" (p. 38). V6.2 più permissiva.
> - **Escl. 4 (MT)**: V6.2 aggiunge "Diagnostic angiogram without proceeding to MT is not exclusionary" (p. 38).
> - **Incl. 6 (dopo fibrinolisi)**: V6.2 aggiunge la definizione di trasformazione emorragica (PH1/PH2 o emorragia con peggioramento; HI1/HI2 non escludono) (p. 37).
> - **Incl. 3**: "treatment initiated" (V5.0, p. 11) → "infusion with investigational product initiated" (V6.2, p. 37). **Escl. 20**: V6.2 aggiunge "(such as hemodialysis)" (p. 40). **Escl. 16**: correzione della forma ("must agree" → "who do not agree").
> Età, peso, NIHSS, mRS, finestra, vasi esclusi e ASPECTS **non cambiano**.

## Intervento e procedure
- **Farmaco**: DM199 (rinvecalinase alfa, rhKLK1). Agisce tramite il sistema callicreina-chinina (bradichinina): vasodilatazione e miglior flusso collaterale verso la penombra ([[REMEDY — Protocolo — V6.2]], p. 26–27).
- **Dose e.v.**: 0,5 µg/kg (max 50 µg) in 50 mL di fisiologica, sacca precondizionata con polisorbato 80, linea dedicata ([[REMEDY — Protocolo — V6.2]], p. 41, p. 43).
- **Velocità**: 17,5 mL/h per 15 min, 25 mL/h per 15 min, poi 35 mL/h (aumento facoltativo dopo esposizione recente ad ACEi) ([[REMEDY — Protocolo — V6.2]], p. 44–45).
- **Monitoraggio PA/FC**: non iniziare se PAS <100 o PAM <65. Stop definitivo se servono vasopressori, o con PAS <90 o PAM <65 **e** sintomi di ipotensione ([[REMEDY — Protocolo — V6.2]], p. 43–45).
- **Dosi s.c.**: 3 µg/kg; la prima a 2 h (+10 h) dalla fine dell'infusione, poi due volte a settimana fino al giorno 21, **7 dosi s.c.** in totale, ad almeno 24 h l'una dall'altra. Le può fare un sanitario o un caregiver formato, anche a domicilio o in riabilitazione ([[REMEDY — Protocolo — V6.2]], p. 41, p. 45–46).
- **Trombolisi**: ammessa **prima**, come standard di cura entro 4,5 h, ma il paziente si valuta per lo studio solo ≥6 h dopo la fine (incl. 6). Non va negata per arruolare ([[REMEDY — Protocolo — V6.2]], p. 10, p. 37).
- **Trombectomia**: **esclusa** se fatta o prevista; l'angiografia solo diagnostica non esclude ([[REMEDY — Protocolo — V6.2]], p. 38).
- **Farmaci concomitanti**:
  - ACEi vietati fino al giorno 29 ±1, con washout di 24/48 h prima dell'e.v. ([[REMEDY — Protocolo — V6.2]], p. 48);
  - vietati i farmaci per l'angioedema ereditario ([[REMEDY — Protocolo — V6.2]], p. 49);
  - antiaggreganti e anticoagulanti **ammessi** secondo la pratica locale ([[REMEDY — Protocolo — V6.2]], p. 49).
- **Esami prima della randomizzazione**:
  - test di gravidanza su siero, locale, negativo prima della randomizzazione nelle donne fertili;
  - laboratorio centrale allo screening (ematologia, biochimica con eGFR, coagulazione, urine);
  - PA allo screening per i criteri ([[REMEDY — Protocolo — V6.2]], p. 19–20, p. 61–62).
  - L'eGFR serve per il washout degli ACEi (escl. 9).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Screening | prima della randomizzazione | consenso, anamnesi, PA, mRS pre, NIHSS (subito prima della randomizzazione), test di gravidanza su siero, laboratorio, imaging se applicabile | ([[REMEDY — Protocolo — V6.2]], p. 19–20) |
| Giorno 1 | randomizzazione e trattamento | infusione e.v. con monitoraggio, ECG, PK, ADA, 1ª s.c. a 2 (+10) h | ([[REMEDY — Protocolo — V6.2]], p. 19–20, p. 43–46) |
| Giorno 2 | | PK, ADA; mRS (o alla dimissione) | ([[REMEDY — Protocolo — V6.2]], p. 20, p. 58) |
| Giorno 4 (±1) | | s.c., laboratorio; anche a domicilio | ([[REMEDY — Protocolo — V6.2]], p. 19–20; [[REMEDY — CI — v2.1]], p. 6) |
| Giorni 7, 11, 14, 18 (±1) | | s.c.; in clinica, a domicilio o per telefono/telemedicina | ([[REMEDY — Protocolo — V6.2]], p. 19–20; [[REMEDY — CI — v2.1]], p. 6–7) |
| Giorno 21 (±1) | | ultima s.c., in presenza; esame obiettivo, laboratorio, PK, ADA, mRS | ([[REMEDY — Protocolo — V6.2]], p. 19; [[REMEDY — CI — v2.1]], p. 7) |
| Giorno 30 (−3/+7) | | anche per telefono o telemedicina | ([[REMEDY — Protocolo — V6.2]], p. 19; [[REMEDY — CI — v2.1]], p. 7) |
| Giorno 90 (+14) | | mRS (endpoint primario), NIHSS, Barthel, ECG, laboratorio, classificazione eziologica | ([[REMEDY — Protocolo — V6.2]], p. 19, p. 54) |

## Consenso
- **Protocollo**: consenso scritto prima di qualsiasi procedura, del paziente o del rappresentante legale (LAR) dove la legge lo permette (art. 31 del Reg. UE 536/2014). Il paziente va ri-consentito appena recupera la capacità ([[REMEDY — Protocolo — V6.2]], p. 79–80).
- **CI locale (v2.1)**: firma del paziente, oppure del rappresentante legale, del familiare o della persona vicina. In circostanze eccezionali, consenso **verbale telefonico** del rappresentante legale con ratifica scritta appena è presente (modulo con data e ora). Previsto anche il testimone imparziale ([[REMEDY — CI — v2.1]], p. 1, p. 20–24).
- **Differito senza alcun consenso**: non previsto.
- **Lingue**: in Drive solo il castellano.

## Co-arruolamento
- **Incompatibile** con qualunque altro studio sperimentale con **farmaco o dispositivo**, in corso o nei 30 giorni prima dello screening (escl. 17) ([[REMEDY — Protocolo — V6.2]], p. 39). Esclude quindi in pratica il co-arruolamento con gli altri studi acuti con farmaco o dispositivo.
- Compatibilità con studi specifici: non riportata nel documento.

## Divergenze con EnsApp
> [!done] Correzioni (secondo blocco, 2026-10-19, branch `claude/practical-johnson-mo40tz-block2`)
> - ✅ 1 ASPECTS ora sempre richiesto nella scheda Imaging: REMEDY torna proponibile entro 4,5 h
> - ✅ 2 vaso occluso sempre richiesto: l'esclusione delle occlusioni di grosso vaso funziona
> - ✅ 3 domanda sugli ACE-inibitori riformulata come le esclusioni 8–9
> - ✅ 9–10 testi della scheda
> - ⬜ 4 angiografia diagnostica, 5 condizioni dopo trombolisi, 6 tronco/cervelletto, 7 co-arruolamento, 8 altri criteri

Confronto con:
- `src/lib/domain/trials-info.ts:301-316`;
- `src/lib/domain/acute-rules.ts:322-343` (`remedy()`);
- `src/lib/domain/acute-reasons.ts:205-219` (`reasonRemedy()`);
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/routes/PreImaging.svelte`.

Verificato il 2026-10-19.

> [!success] Coincide
> - età 18–90 (`acute-rules.ts:332-333`);
> - mRS pre ≤1 (`:334`);
> - NIHSS 5–15 (`:335-336`);
> - finestra <24 h (`:331`; Tab. 3 "< 24 hours", p. 43);
> - soglia ASPECTS ≥6, cioè esclusione 0–5 (`:339-340`; testo `trials-info.ts:304`);
> - vasi esclusi ICA intracranica, ICA-T, M1, VA e basilare, quando sono inseriti (`:323-328`);
> - trombectomia esclusa tramite "non candidato EVT" (`:337`; `trials-info.ts:308`);
> - nota "post-IVT CT at 6h with <PH1" (`trials-info.ts:313`), corretta rispetto al protocollo (escludono PH1 e PH2, ammessi HI1/HI2, p. 37), e più precisa del foglio ("escludere se >PH1");
> - stato `active` = aperto nel foglio (`trials-info.ts:302`).

- [ ] [FN] **1. Entro 4,5 h l'ASPECTS non si può inserire, quindi REMEDY non risulta mai eleggibile.**
> [!warning] Contraddizione
> Protocollo: si esclude solo "ASPECTS 0-5" (escl. 3, [[REMEDY — Protocolo — V6.2]], p. 38).
> App: `remedy()` richiede `isValidNumber(input.aspects) && input.aspects >= 6` (`acute-rules.ts:339-340`) e `candidate === "not eligible"` (`:337`). Per i non candidati a EVT, il campo ASPECTS compare solo nella card TENACITY, visibile solo con LTSW >4,5 e ≤72 h (`PostImaging.svelte:103-108`, `:190-206`). La card EVT, che ha l'ASPECTS (`:175-177`), appare solo con candidato "Eleggibile" (`:102`, `:163`).
> Risultato: un paziente valutato entro 4,5 h, per esempio prima o subito dopo la trombolisi, non è mai proposto per REMEDY, salvo un ASPECTS rimasto in memoria da una scelta precedente. Tra 4,5 e 24 h serve compilare l'ASPECTS dentro una card intitolata "TENACITY - Domande aggiuntive" (`i18n/it.ts:181`). Anche con ASPECTS ignoto il paziente risulta non eleggibile.

- [ ] [FP] **2. L'occlusione di grosso vaso viene esclusa solo se il vaso è inserito, ma per i non candidati EVT il selettore di solito non compare.**
> [!warning] Contraddizione
> Protocollo: esclusa la "symptomatic large vessel occlusion (…) Intracranial carotid I/T/L or M1 segment MCA, vertebral or basilar artery" **indipendentemente** dalla candidatura a trombectomia (escl. 2, [[REMEDY — Protocolo — V6.2]], p. 38).
> App: l'esclusione legge `targetVessels` (`acute-rules.ts:323-328`). Per i pazienti "Non eleggibile" a EVT il VesselPicker si vede solo nella card TENACITY (>4,5 h) (`PostImaging.svelte:200-201`). Inoltre `lvo` viene forzato a "no" quando il paziente non è candidato (`PostImaging.svelte:27`).
> Risultato: un paziente con occlusione M1, basilare o ICA non candidato a trombectomia, per esempio per NIHSS basso, finestra o giudizio clinico, risulta eleggibile a REMEDY se il vaso non è stato inserito. Falso positivo.

- [ ] [FN] **3. ACE-inibitori: l'app esclude chiunque li assuma; il protocollo esclude solo l'assunzione recente o l'impossibilità di sospenderli.**
> [!warning] Contraddizione
> Protocollo: escluso solo chi non può o non vuole passare ad altro antipertensivo fino al giorno 29 ±1 (escl. 8). È escluso anche chi ha preso l'ultima dose <24 h prima dell'infusione e.v. (eGFR ≥45) o <48 h (eGFR <45) (escl. 9) ([[REMEDY — Protocolo — V6.2]], p. 38, p. 48).
> App: domanda "ACE inibitore (IECA) in terapia?" (`PreImaging.svelte:160-162`; `i18n/it.ts:116`) e `input.acei !== "yes"` (`acute-rules.ts:341`; motivo "non in ACE-inibitori", `acute-reasons.ts:217`). Un paziente in terapia con ACEi, con l'ultima dose ≥24 h (o ≥48 h) prima dell'infusione e disposto a cambiare, è eleggibile ma l'app lo scarta. Il foglio dice "non assunti nelle 24 h precedenti", più vicino al protocollo (senza la soglia di 48 h per eGFR <45).
> Nota: anche il CI locale è più restrittivo del protocollo ("No podrá participar (…) si ha tomado un inhibidor de la ECA después del inicio de su IIA", [[REMEDY — CI — v2.1]], p. 3).

- [ ] [FN] **4. Il candidato a trombectomia viene escluso anche se poi non la fa.**
> [!warning] Contraddizione
> Protocollo: si esclude chi "has or will receive MT"; "Diagnostic angiogram without proceeding to MT is not exclusionary" (escl. 4, [[REMEDY — Protocolo — V6.2]], p. 38). Le occlusioni non elencate nell'escl. 2 (per esempio M2) non escludono.
> App: `candidate === "not eligible"` obbligatorio (`acute-rules.ts:337`). Un paziente con occlusione M2 marcato "Eleggibile" a EVT, che poi si ferma all'angiografia diagnostica, non viene riproposto. Caso marginale: si risolve cambiando la risposta.

- [ ] [NC] **5. Le condizioni dopo trombolisi non sono verificate.**
> [!warning] Contraddizione
> Protocollo, incl. 6: dopo fibrinolisi entro 4,5 h, valutazione **≥6 h dopo la fine**. Servono NIHSS pre-trombolisi ≤15, NIHSS 5–15 persistente dopo ≥6 h, miglioramento <4 punti e imaging ripetuto senza PH1/PH2 né emorragia con peggioramento (p. 37). Incl. 4: ammessi anche i pazienti con NIHSS iniziale <5 che peggiorano a 5–15 (p. 37).
> App: `remedy()` non usa `ivtCandidate` e valuta un solo NIHSS, quello inserito (`acute-rules.ts:322-343`). Il testo dice solo "Allowed per protocol." (`trials-info.ts:307`) più la nota sul PH1 (`:313`). Un paziente valutato prima della trombolisi può essere proposto e poi non essere eleggibile a 6 h, o viceversa.

- [ ] [NC] **6. Ictus del tronco o del cervelletto non esclusi.**
> [!warning] Contraddizione
> Protocollo, escl. 6: esclusi gli ictus del tronco o del cervelletto (imaging **e** sintomi); ammessa la ACP senza coinvolgimento di tronco o cervelletto (p. 38).
> App: nessuna domanda né condizione (`acute-rules.ts:322-343`). È un potenziale falso positivo frequente in una popolazione senza LVO con NIHSS 5–15.

- [ ] [NC] **7. Co-arruolamento: REMEDY esclude qualsiasi altro studio con farmaco o dispositivo.**
> [!warning] Contraddizione
> Protocollo, escl. 17: "currently participating in or has participated in a study using an investigational device or drug (…) within 30 days prior to screening" (p. 39).
> App: il riepilogo può proporre REMEDY insieme ad altri studi acuti eleggibili (`Summary.svelte:35`, `:47-49`), senza avvisare che sono incompatibili.

- [ ] [NC] **8. Altri criteri non modellati.**
> [!warning] Contraddizione
> Protocollo: peso 40–166 kg (incl. 2, p. 37); dissezione extracranica (escl. 5); 2 misure consecutive di PAS <100 o PAM <65 nelle 6 h precedenti (escl. 7); angioedema, anafilassi, angioedema ereditario o farmaci sul sistema callicreina-chinina (escl. 10–11); aspettativa di vita ≤1 anno; infezione che richiede terapia parenterale; deficit di α1-antitripsina; gravidanza o allattamento; emodialisi (p. 38–40).
> App: nessuno di questi è controllato (`acute-rules.ts:322-343`). Il tipo emorragico è filtrato a monte dall'interfaccia.

- [ ] [TXT] **9. "preEvtLabs: No." contro esami richiesti prima della randomizzazione.**
> [!warning] Contraddizione
> Protocollo: test di gravidanza su siero, locale, negativo **prima della randomizzazione** nelle donne fertili; laboratorio centrale allo screening; l'eGFR decide il washout degli ACEi (p. 38, p. 61–62). Foglio: "analitica pre: sì (pre-dose)".
> App: `trials-info.ts:309` "No.".

- [ ] [TXT] **10. Testi informativi incompleti o imprecisi.**
> [!warning] Contraddizione
> - `trials-info.ts:312` "ACE inhibitor (IECA) use": andrebbe precisato con l'ultima dose ≥24 h prima dell'e.v. (≥48 h se eGFR <45) e la sostituzione fino al giorno 29 (p. 38).
> - `trials-info.ts:307` "Allowed per protocol.": manca che la trombolisi va fatta entro 4,5 h e che si valuta ≥6 h dopo, con NIHSS pre ≤15 e miglioramento <4 punti (p. 37).
> - `trials-info.ts:306`: mancano "symptomatic", l'esclusione di tronco e cervelletto e della dissezione extracranica (p. 38).
> - `trials-info.ts:305` "Per local practice.": il CI prevede la firma del paziente o del rappresentante, il consenso telefonico del rappresentante in casi eccezionali e il testimone imparziale ([[REMEDY — CI — v2.1]], p. 1, p. 20–24). Il foglio dice "scritto".
> - `trials-info.ts:310`: manca lo schema (e.v. unica, poi 7 s.c. fino al giorno 21), presente nel foglio (p. 41).
> - `trials-info.ts:315` `visits: null`: il calendario è giorni 1, 2, 4, 7, 11, 14, 18, 21, 30 e 90 (p. 19–20).
> - `trials-info.ts:303` "Neuroprotective": il protocollo descrive DM199 come callicreina ricombinante che migliora il flusso collaterale (p. 26), non come neuroprotettore. Imprecisione minore.

> [!note] Finestra
> `ltsw` sono le ore trascorse al momento della valutazione. Il protocollo chiede che l'**infusione** inizi entro 24 h (p. 37, p. 43) e, dopo trombolisi, non prima di 6 h dalla fine. L'app non avvisa del tempo residuo: non è una divergenza, ma va tenuto presente vicino alle 24 h.

## Problemi documentali
- **Sinossi disallineata**: in Drive c'è solo l'estratto del protocollo **V5.0** (26-08-2024), chiamato "Sinopsis". È due versioni indietro rispetto alla V6.2 vigente; la V6.0 (14-05-2025) non è in Drive. Differenze di eleggibilità sopra e in [[REMEDY — Sinopsis — V5.0]].
- **Foglio del team**:
  - riporta "ASPECTS 5-10" nella tabella ma "esclusione ASPECTS 0-5" nelle note: il protocollo esclude 0–5, quindi serve ≥6 (p. 38);
  - "escludere se >PH1" è impreciso: il PH1 esclude già (p. 37).
- **CI contro protocollo sugli ACEi**: il CI esclude chi ha preso un ACEi dopo l'esordio ([[REMEDY — CI — v2.1]], p. 3); il protocollo usa la soglia di 24/48 h prima dell'infusione (p. 38).
- **CI**: follow-up "1 y 8 semanas" (p. 7) contro "10 semanas" (p. 12–13); consenso telefonico del rappresentante previsto solo nel CI.
- **Protocollo V6.2**:
  - l'indicazione del §7.1 dice "does not have a large vessel occlusion" (p. 41), più ampio dell'escl. 2, che elenca solo alcuni vasi e solo se sintomatici (p. 38);
  - monitoraggio post-infusione a 5 min (Tab. 3, p. 44) contro 15 min (p. 20, p. 59);
  - §8.1.1 con un elenco di condizioni mancante (p. 50);
  - "hemorrhage stroke" (p. 38);
  - rimando alla "Section 13" per le analisi (p. 17).
- **Versione 6.1**: non elencata nella storia delle versioni (p. 1).

## Fonti
- [[REMEDY — Protocolo — V6.2]]
- [[REMEDY — Sinopsis — V5.0]] (superata)
- [[REMEDY — CI — v2.1]]
- [[Esquema ensayos — septiembre 2026]] (stato)
