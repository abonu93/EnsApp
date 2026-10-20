---
tipo: ensayo
estudio: LIBREXIA
alias: [LIBREXIA-STROKE, "70033093STR3001", milvexian, Librexia]
estado_app: cerrado   # aggiornato 2026-10-19
clave_app: "Librexia"
categoria: post-agudo
fase: "3"
promotor: "Janssen Research & Development (co-sviluppo con Bristol Myers Squibb); in Spagna Janssen-Cilag International NV"
registro: ["EU CT 2022-501176-26-00", "IND 138848"]
protocolo_vigente: "Amendment 2/EEA-1, 10-04-2024"
ci_vigente: "Main ICF V7.0 ESP(es) 1.0, 05-03-2025"
drive_carpeta: "https://drive.google.com/drive/folders/1abfLoaMMWw07fMqi0I8KKHULaMzf7Xew"
fuentes: ["[[LIBREXIA — Protocolo — Enmienda 2]]", "[[LIBREXIA — Sinopsis — Enmienda 1]]", "[[LIBREXIA — CI — V7.0]]"]
actualizado: 2026-10-19
---
# LIBREXIA

> [!summary] In breve
> LIBREXIA-STROKE è uno studio di fase 3, in doppio cieco, guidato dagli eventi, su circa 15.000 partecipanti. Confronta milvexian 25 mg ogni 12 h, un inibitore orale del fattore XIa, con il placebo, entrambi in aggiunta a SAPT o DAPT. La popolazione è:
> - ictus ischemico acuto con [[NIHSS]] ≤7 alla randomizzazione;
> - AIT ad alto rischio con [[ABCD2]] ≥6;
> - in entrambi i casi entro 48 h dall'esordio e non cardioembolici con indicazione all'anticoagulazione.
>
> Dopo trombolisi o trombectomia si randomizza solo dopo più di 24 h dalla fine del trattamento. L'endpoint primario è il tempo al primo ictus ischemico ([[LIBREXIA — Protocolo — Enmienda 2]], p. 29, p. 31, p. 39–40).

> [!info] Stato
> **Foglio "Esquema ensayos": CERRADO** ([[Esquema ensayos — septiembre 2026]]). **App**: `status: "closed"` dal 2026-10-19 (`src/lib/domain/trials-info.ts:201`).
> - Il link alla valutazione post-acuta è nascosto (`src/routes/Summary.svelte:135-137`).
> - `eligible` è sempre falso (`src/routes/PostAcute.svelte:37`).
>
> Lo stato è coerente. Le divergenze qui sotto sono quindi **latenti**: oggi non hanno effetto clinico, ma lo avrebbero se lo studio venisse riaperto o se la pagina servisse da modello per altri studi post-acuti.

## Disegno
- **Tipo**: fase 3, multicentrico, randomizzato 1:1, in doppio cieco, controllato con placebo, a gruppi paralleli, guidato dagli eventi, di superiorità ([[LIBREXIA — Protocolo — Enmienda 2]], p. 31).
- **Randomizzazione**: centrale con IWRS, a blocchi per paese, stratificata per terapia antiaggregante prevista (SAPT o DAPT) ([[LIBREXIA — Protocolo — Enmienda 2]], p. 46–47).
- **Bracci**: milvexian 25 mg due volte al giorno contro placebo identico, entrambi in aggiunta a SAPT o DAPT a scelta dello sperimentatore. L'ASA va limitato a 75–100 mg/die; le dosi di carico sono ammesse ([[LIBREXIA — Protocolo — Enmienda 2]], p. 31–32, p. 44–45).
- **Numerosità**: circa 15.000 partecipanti per 909 eventi (HR 0,8, potenza del 90%). Interim di futilità o superiorità a circa 546 eventi. Arruolamento di circa 40 mesi, durata totale di circa 42 mesi ([[LIBREXIA — Protocolo — Enmienda 2]], p. 32, p. 71, p. 77).
- **Endpoint primario**: tempo al primo ictus ischemico, inclusi gli ictus di tipo indeterminato ([[LIBREXIA — Protocolo — Enmienda 2]], p. 29, p. 72).
- **Endpoint secondari**: morte CV, IM o ictus ischemico; ictus ischemico a 90 giorni; MAVE ([[LIBREXIA — Protocolo — Enmienda 2]], p. 29).
- **Endpoint di sicurezza principale**: emorragie BARC 3c e 5 ([[LIBREXIA — Protocolo — Enmienda 2]], p. 30).
- **Quote di arruolamento**: circa il 25% di non trattati con trombolisi o trombectomia randomizzati entro 24 h; tetto di circa il 20% agli ictus lacunari ([[LIBREXIA — Protocolo — Enmienda 2]], p. 33, p. 39).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Randomizzazione entro 48 h dall'esordio (nell'[[Ictus del despertar|ictus al risveglio]], dall'ultima volta in cui il paziente era normale). Dopo IVT o EVT, con o senza stent: almeno 24 h dalla fine del trattamento, e sempre entro 48 h | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 40) |
| Età | ≥40 anni, nessun limite superiore | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 39) |
| [[mRS]] pre | Escluso un mRS pre-evento ≥3 (quindi 0–2) | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 41) |
| NIHSS | Ictus: ≤7 **alla randomizzazione**. Il NIHSS dello screening vale se misurato entro 6 h e senza cambiamenti. AIT: ABCD2 ≥6, confermato alla randomizzazione | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 16, p. 31, p. 39–40) |
| Imaging | Ictus: deficit persistente, **oppure** lesione ischemica acuta al neuroimaging standard, **oppure** trombolisi o trombectomia eseguite. AIT: nessun infarto all'imaging. Esclusa l'emorragia intracranica in corso, salvo microsanguinamenti e HI1 secondo [[Clasificación de Heidelberg|Heidelberg]] | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 39–41) |
| Eziologia | Esclusi gli ictus o AIT cardioembolici con indicazione all'anticoagulazione e quelli con altra causa determinata ([[TOAST]] "Other Determined Etiology", per esempio dissezione o arterite). Ictus lacunare ammesso | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 33, p. 41) |
| Occlusione | Non richiesta | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 39–40) |
| Laboratorio | Dopo IVT/EVT: INR ≤1,5 e aPTT ≤1,4 volte l'ULN. Per tutti: eGFR ≥15; ALT entro 3 volte l'ULN; piastrine ≥75.000; bilirubina <1,5 volte l'ULN; Hb ≥8 g/dL; nessun prolungamento noto dell'aPTT oltre 1,4 volte l'ULN | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 40–42) |

## Criteri di inclusione
Testo originale (§5.1, [[LIBREXIA — Protocolo — Enmienda 2]], p. 39–41):

1. ≥40 years of age (p. 39)
2. Ischemic Stroke: a neurological deficit attributable to an acute brain infarction and NIHSS score ≤ 7 and at least 1 of the following: Persistent signs or symptoms of the ischemic event at the time of randomization, OR Acute, ischemic brain lesion determined by standard-of-care neuroimaging OR Participant underwent thrombolysis or thrombectomy OR TIA: acute onset neurological deficit attributable to focal ischemia of the brain by history or examination, with complete symptom resolution of the deficit and no brain infarction on neuroimaging (eg, CT scan or MRI, performed as part of standard medical practice), and ABCD2 Score ≥6 (p. 39–40)
3. Participants will be randomized as soon as possible after determining eligibility and within 48 hours of onset of event. In participants in whom a stroke was evident on awakening from sleep, within 48 hours from the time at which the participants' condition was last reported to be normal. Participants who received thrombolysis and/or mechanical thrombectomy with or without stenting can be randomized but only after 24 hours have elapsed after the end of this treatment and not more than 48 hours after the onset of the index event, and provided that post-treatment neuroimaging excludes cerebral bleeding and have post-thrombolytic therapy/post-thrombectomy INR ≤ 1.5 and aPTT ≤ 1.4 times the ULN prior to study randomization. Cerebrovascular vessel stenting is allowed as clinically indicated. If these procedures are done pre-randomization, then randomization should occur at least 24 hours after the end of the procedure and not more than 48 hours after the onset of the index event. (p. 40)
4. Current or planned antiplatelet treatment per international and/or local guidelines. If ASA is used, it will be limited to low dose (75 to 100 mg/day). Loading dose of antiplatelet agents (including ASA) are allowed per standard-of-care. (p. 40)
5. All female participants of childbearing potential must have a negative highly sensitive serum (β-human chorionic gonadotropin [β-hCG]) or urine test at screening (p. 40)
6. 6.1. A female participant must agree not to be pregnant, breastfeeding, or planning to become pregnant until 4 days (representing >5 half-lives) after the last dose of study intervention (p. 40)
7. A female participant must be (…) a. Not of childbearing potential or b. 7.b.1. Of childbearing potential and practicing a highly effective method of contraception (…) until 4 days (representing >5 half-lives) after last dose of study intervention (…) (p. 40)
8. 8.1. A female participant using hormonal contraceptives should use an additional non-hormonal contraceptive method (…) until 4 days after last dose (…) (p. 40–41)
9. Participant must sign an ICF (or their legally authorized representative must sign) indicating that he or she understands the purpose of, and procedures required for, the study and is willing to participate in the study and willing to provide at least vital status at the end of the study. (p. 41)
10. Willing and able to adhere to the lifestyle restrictions (Section 5.3) specified in this protocol. (p. 41)

Il testo completo dei criteri 7 e 8 è in [[LIBREXIA — Protocolo — Enmienda 2]].

**Sintesi**: età ≥40 anni. Ictus ischemico con NIHSS ≤7 e deficit persistente, lesione acuta all'imaging o trattamento di riperfusione; oppure AIT con ABCD2 ≥6 senza infarto. Randomizzazione entro 48 h. Dopo IVT o EVT servono più di 24 h dalla fine del trattamento, un imaging senza emorragia, INR ≤1,5 e aPTT ≤1,4 volte l'ULN. Terapia antiaggregante in corso o prevista. Gravidanza esclusa e contraccezione fino a 4 giorni dopo l'ultima dose.

## Criteri di esclusione
Testo originale (§5.2, [[LIBREXIA — Protocolo — Enmienda 2]], p. 41–42):

1. Current intracranial hemorrhage (hemorrhage into the brain, subarachnoid hemorrhage, intraventricular hemorrhage, subdural hematoma or epidural hematoma); except CMB and minor hemorrhagic transformation of infarct manifesting as scattered petechiae (Hemorrhagic Infarction Type 1 [HI1] according to Heidelberg classification). (p. 41)
2. Prior history of intracranial hemorrhage except subarachnoid hemorrhage > 1 year prior with adequate treatment. (p. 41)
3. 3.1 The index stroke or TIA is considered to have a cardio-embolic etiology based on local standard-of-care investigations and for which guidelines recommend anticoagulation. (p. 41)
4. 4.1. The index stroke or TIA considered to have an other known cause, not related to athero-thrombotic sources (TOAST Other Determined Etiology) (Adams 1993), based on local standard-of-care investigations. Examples of such etiologies include intracranial tumor, arteritis, arterial dissection, vasospasm or AVM. (p. 41)
5. Pre-event disability with mRS score of 3 or higher. (p. 41)
6. Any condition that requires chronic anticoagulation at the discretion of the investigator and/or local guidelines. Note: Participants with an indication for chronic antiplatelet therapy after placement of a bio-prosthetic nonmechanical valve (eg, transcatheter aortic valve replacement [TAVR]) do not satisfy this exclusion criterion and are eligible for study participation. (p. 41)
7. Conditions with an increased risk of bleeding, including: Clinically significant bleeding within the previous 3 months; Known bleeding diathesis; Known aPTT prolongation > 1.4 times the ULN or known congenital FXI deficiency; Spinal cord hemorrhage; Retinal hemorrhage (p. 41)
8. Current active liver disease, eg, acute hepatitis, known cirrhosis, including participants receiving antiviral treatment for hepatitis. (p. 42)
9. History of any significant drug allergy (such as anaphylaxis, Stevens-Johnson Syndrome, toxic epidermal necrolysis, drug reaction with eosinophilia and systemic symptoms [DRESS]). (p. 42)
10. Known allergies, hypersensitivity, or intolerance to milvexian or its excipients (refer to the milvexian IB). (p. 42)
11. Requires dialysis on a permanent basis. (p. 42)
12. eGFR <15 mL/min/1.73 m2 at screening. (p. 42)
13. Planned use of any disallowed therapies as noted in Section 6.8, Concomitant Therapy including isoniazid. (p. 42)
14. Received an investigational intervention or used an invasive investigational medical device within 4 weeks before the planned first dose of study intervention or is currently enrolled in an investigational interventional study. (p. 42)
15. Any of the following laboratory results, based on local laboratory, outside of the ranges specified below prior to randomization: ALT 3× ULN; Platelet count <75,000 mm3; Total bilirubin ≥ 1.5x ULN unless an alternative causative factor such as Gilbert's syndrome is identified; Hemoglobin <8.0 g/dL (p. 42)
16. Any condition for which, in the opinion of the investigator, participation would not be in the best interest of the participant (…) or has a life expectancy of <12 months. (p. 42)
17. 17.1. At the time of screening, any participant who will not consider following the study contact schedule, or not allow a contact to the participant, or to the designated family members (if provided) or health care practitioner, to determine any endpoint events and/or vital status, up until the end of the study. (p. 42)
18. Participants who are incarcerated, including prisoners or participants compulsorily detained for treatment of psychiatric disease. (p. 42)
19. Known current substance abuse that could impact study compliance. (p. 42)
20. Employee of the investigator or study site, with direct involvement in the proposed study or other studies under the direction of that investigator or study site, as well as family members of the employees or the investigator. (p. 42)

**Sintesi**: sono esclusi:
- emorragia intracranica in corso (HI1 e microsanguinamenti ammessi) o pregressa (salvo ESA trattata da più di un anno);
- causa cardioembolica con indicazione all'anticoagulazione, o altra causa determinata;
- mRS pre ≥3;
- necessità di anticoagulazione cronica;
- rischio emorragico (sanguinamento nei 3 mesi precedenti, diatesi, aPTT >1,4 volte l'ULN, deficit di FXI);
- epatopatia attiva;
- dialisi cronica o eGFR <15;
- isoniazide o altri farmaci vietati;
- un altro studio sperimentale nelle 4 settimane precedenti;
- esami fuori range (ALT, piastrine <75.000, bilirubina, Hb <8);
- aspettativa di vita inferiore a 12 mesi.

## Intervento e procedure
- **Farmaco**: compressa da 25 mg di milvexian o placebo, per via orale, due volte al giorno, a stomaco pieno o vuoto. Se il paziente non deglutisce, si disperde in acqua (anche via sondino) o in purea di mela ([[LIBREXIA — Protocolo — Enmienda 2]], p. 44–45).
- **Prima dose**: "as close to randomization as possible, ideally within 2 hours of randomization" ([[LIBREXIA — Protocolo — Enmienda 2]], p. 44).
- **Trombolisi e trombectomia**: ammesse per l'evento indice, con o senza stent. Dopo il trattamento la randomizzazione richiede almeno 24 h dalla fine, imaging senza emorragia, INR ≤1,5 e aPTT ≤1,4 volte l'ULN ([[LIBREXIA — Protocolo — Enmienda 2]], p. 40, p. 49). Per una recidiva durante lo studio non serve ritardare la trombolisi o la trombectomia per l'ultima dose ([[LIBREXIA — Protocolo — Enmienda 2]], p. 55).
- **Eparina profilattica**: la profilassi della TVP con UFH o EBPM iniziata prima della randomizzazione è ammessa, con 3 giorni di sovrapposizione. Dopo è vietata; si raccomanda la compressione pneumatica. Dopo il primo ricovero è vietata del tutto ([[LIBREXIA — Protocolo — Enmienda 2]], p. 49–50).
- **Farmaci vietati**: altri anticoagulanti, isoniazide, ASA >100 mg per più di 4 settimane, omeprazolo o esomeprazolo con clopidogrel, inibitori o induttori combinati forti di P-gp e CYP3A4 (entro 7 giorni) ([[LIBREXIA — Protocolo — Enmienda 2]], p. 49–50).
- **Esami**: gli esami di eleggibilità sono locali, anche quelli fatti per pratica clinica dopo l'evento. I campioni centrali si prendono al giorno 1 prima della prima dose ([[LIBREXIA — Protocolo — Enmienda 2]], p. 16, p. 63–64).

## Visite e follow-up
Lo studio è guidato dagli eventi: i pazienti restano in studio fino alla GTED, la data in cui si raggiunge il numero previsto di eventi primari. La partecipazione media prevista è di circa 15 mesi, la massima di circa 42 ([[LIBREXIA — CI — V7.0]], p. 2).

| Visita | Momento | Fonte |
|---|---|---|
| Screening e randomizzazione (giorno 1) | entro 48 h dall'evento | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14) |
| Mese 1 (settimana 4) | ±7 giorni (= 28 ±7 giorni) | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14) |
| Mese 3 (settimana 13) | ±7 giorni (= circa 91 ±7 giorni); NIHSS, mRS, PRO | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14–15) |
| Settimane 26, 39, 52, 65, 78, 91, 104, poi ogni 26 settimane | ±14 giorni | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14) |
| Dopo la settimana 130 | visite in presenza ogni 6 mesi, con una virtuale a 3 mesi fra l'una e l'altra | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 16) |
| Fine trattamento (EOT) e fine studio (EOS, virtuale) | EOS entro 30 giorni dalla GTED | ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14, p. 17) |

Telemedicina e visite a domicilio sono ammesse se il promotore le approva e non ci sono problemi di sicurezza ([[LIBREXIA — Protocolo — Enmienda 2]], p. 58, p. 64; [[LIBREXIA — CI — V7.0]], p. 3).

## Consenso
- **Tipo**: scritto, firmato prima di qualunque procedura, cartaceo o elettronico (eConsent). Se il paziente non può consentire, firma il rappresentante legale ([[LIBREXIA — Protocolo — Enmienda 2]], p. 16, p. 36, p. 41, p. 84–85). Non è previsto né il consenso differito né quello orale.
- **CI locale (V7.0)**: firme del paziente, del testimone imparziale (se il paziente non sa leggere) e dello sperimentatore. **Non c'è un modulo di firma per il rappresentante legale** ([[LIBREXIA — CI — V7.0]], p. 14–16).
- **Lingue**: CI solo in castellano.

## Co-arruolamento
- Escluso chi ha ricevuto un intervento sperimentale o usato un dispositivo invasivo sperimentale nelle 4 settimane prima della prima dose, o chi partecipa a un altro studio interventistico ([[LIBREXIA — Protocolo — Enmienda 2]], p. 42). Il CI vieta di partecipare ad altri studi clinici ([[LIBREXIA — CI — V7.0]], p. 3).
- Questo esclude in pratica i pazienti arruolati in uno studio acuto con farmaco o dispositivo nello stesso ricovero, per esempio i trombectomizzati in uno studio con dispositivo. È una deduzione dal criterio 14: non c'è un elenco di studi.

## Divergenze con EnsApp
Confronto, verificato il 2026-10-19, con:
- `src/routes/PostAcute.svelte:32-52`, il derived `eligible`. La logica non è in `acute-rules.ts` né in `acute-reasons.ts`;
- le domande dell'interfaccia in `src/lib/i18n/en.ts:210-228` (testi uguali in es, it e ca);
- `src/lib/domain/trials-info.ts:198-215`;
- `src/routes/Summary.svelte:134-137`;
- `src/lib/stores/patient.ts`.

> [!success] Coincide
> - stato chiuso, come nel foglio (`trials-info.ts:201`; `PostAcute.svelte:37`; `Summary.svelte:135`);
> - età ≥40 (`PostAcute.svelte:39`; p. 39);
> - soglia delle 48 h (`:40`; p. 40);
> - soglia NIHSS ≤7 (`:41`; p. 39);
> - struttura "deficit persistente OR lesione OR trattamento" (`:43`; p. 39);
> - valori INR ≤1,5 e aPTT ≤1,4 (`:45-46`; p. 40);
> - eGFR ≥15 (`:47`; esclusione 12, p. 42);
> - anticoagulazione cronica (`:48`; esclusione 6);
> - epatopatia (`:49`; esclusione 8);
> - gravidanza (`:50`; inclusioni 5–6);
> - chiavi `window`, `age`, `mrs` e `nihss` (`trials-info.ts:203`);
> - milvexian 25 mg ogni 12 h contro placebo (`:209`; p. 44–45);
> - esami prima della dose (`:208`; p. 16, p. 64);
> - consenso scritto (`:204`);
> - visite a 28 ±7 e 90 ±7 giorni (`:212-213`; p. 14).

- [ ] **1. `[FN]` L'ABCD2 ≥6 è richiesto anche agli ictus.**
> [!warning] Contraddizione
> Protocollo, inclusione 2: l'ABCD2 ≥6 vale solo per l'AIT. Per l'ictus servono NIHSS ≤7 e una delle tre condizioni ([[LIBREXIA — Protocolo — Enmienda 2]], p. 39–40; anche p. 31, p. 33).
> App: `abcd2 !== null && abcd2 >= 6` è in AND con tutto il resto (`PostAcute.svelte:44`), e il campo è obbligatorio (`:86`). Un ictus con NIHSS ≤7 e ABCD2 <6, o senza ABCD2 calcolato, risulta non eleggibile. È la maggioranza degli ictus minori: falsi negativi.

- [ ] **2. `[FN]` L'AIT non può mai risultare eleggibile.**
> [!warning] Contraddizione
> Protocollo: AIT con risoluzione completa, nessun infarto all'imaging e ABCD2 ≥6 (p. 40).
> App: chiede sempre "Persistent symptoms? / Imaging consistent with atherothrombotic etiology? / Treatment received in acute phase?" in OR obbligatorio (`PostAcute.svelte:43`; `en.ts:214-216`). Per definizione un AIT risponde "no" alle prime due e quasi sempre alla terza. In pratica l'app ammette solo "ictus con ABCD2 ≥6", e il ramo AIT del protocollo è perso.

- [ ] **3. `[FN]` "Causa aterotrombotica sospetta" obbligatoria.**
> [!warning] Contraddizione
> Protocollo: sono esclusi solo gli ictus cardioembolici **con indicazione all'anticoagulazione** e le **altre cause determinate** (TOAST, per esempio dissezione o arterite) ([[LIBREXIA — Protocolo — Enmienda 2]], p. 41). L'ictus lacunare è ammesso, con tetto del 20% (p. 33, p. 39). Nemmeno gli ictus a causa indeterminata sono esclusi.
> App: `causeSuspect === "yes"` alla domanda "Suspected atherothrombotic cause?" (`PostAcute.svelte:42`; `en.ts:213`). Un lacunare, un criptogenico o un cardioembolico senza indicazione all'anticoagulazione risponde "no" e viene scartato. Allo stesso modo "Imaging consistent with atherothrombotic etiology?" (`en.ts:215`) è più restrittivo di "Acute, ischemic brain lesion determined by standard-of-care neuroimaging" (p. 39).

- [ ] **4. `[FN]` Il NIHSS usato è quello d'ingresso, non quello alla randomizzazione.**
> [!warning] Contraddizione
> Protocollo: "NIHSS score of ≤7 at randomization", precisato dall'Amendment 2 ([[LIBREXIA — Protocolo — Enmienda 2]], p. 3, p. 31, p. 39). Il NIHSS dello screening vale solo se misurato entro 6 h (p. 16).
> App: `$preData.nihss` (`PostAcute.svelte:35`) è il NIHSS basale inserito in PreImaging, e la pagina non permette di aggiornarlo. Un paziente entrato con NIHSS 12, trattato e sceso a 4 dopo più di 24 h viene scartato (falso negativo). Il caso inverso, un peggioramento oltre 7, viene invece proposto (falso positivo).

- [ ] **5. `[FP]` Le ore dall'LTSW sono "congelate" all'inserimento.**
> [!warning] Contraddizione
> Protocollo: randomizzazione entro 48 h dall'esordio o dall'ultima volta in cui il paziente era normale (p. 40).
> App: `$preData.ltsw` (`PostAcute.svelte:34`) è il numero di ore calcolato al salvataggio di PreImaging (`PreImaging.svelte:36`). Non è il valore aggiornato `ltswHours` (`stores/patient.ts:82-86`) che usano le regole acute. Se la valutazione post-acuta si fa ore o giorni dopo, cosa normale per questo studio, l'app vede ancora le ore dell'ingresso: un paziente a 60 h può risultare "≤48 h".

- [ ] **6. `[FP]` Il mRS pre-evento non viene controllato.**
> [!warning] Contraddizione
> Protocollo, esclusione 5: "Pre-event disability with mRS score of 3 or higher" ([[LIBREXIA — Protocolo — Enmienda 2]], p. 41).
> App: `$preData.premrs` esiste (`stores/patient.ts:16`) ma `eligible` non lo legge (`PostAcute.svelte:38-51`). La chiave `mrs: "<= 2"` (`trials-info.ts:203`) è solo testo.

- [ ] **7. `[FP]` Le 24 h dopo IVT o EVT e l'imaging senza emorragia non vengono controllati.**
> [!warning] Contraddizione
> Protocollo: dopo trombolisi o trombectomia, con o senza stent, si randomizza "only after 24 hours have elapsed after the end of this treatment", con "post-treatment neuroimaging excludes cerebral bleeding" (p. 40, p. 49).
> App: `treatmentReceived === "yes"` basta a soddisfare l'inclusione (`PostAcute.svelte:43`), senza chiedere il tempo dalla fine del trattamento né il controllo radiologico. Un paziente a 10 h dalla trombectomia risulta eleggibile.

- [ ] **8. `[FP]` Un'emorragia può risultare eleggibile.**
> [!warning] Contraddizione
> Protocollo, esclusioni 1–2: emorragia intracranica in corso (salvo microsanguinamenti e HI1) o pregressa (p. 41).
> App: il link alla pagina post-acuta, quando lo studio è aperto, non dipende dal tipo di ictus: è fuori dai blocchi condizionali (`Summary.svelte:134-137`). `eligible` non legge `strokeType`. Un paziente con ICH, età ≥40 e NIHSS ≤7 potrebbe risultare "Librexia eligible".

- [ ] **9. `[FN]` INR ≤1,5 e aPTT obbligatori anche per i non trattati.**
> [!warning] Contraddizione
> Protocollo: INR ≤1,5 e aPTT ≤1,4 volte l'ULN sono richiesti **dopo trombolisi o trombectomia** (p. 40). Per tutti vale solo l'esclusione di un "known aPTT prolongation > 1.4 times the ULN" (esclusione 7, p. 41), e non c'è una soglia di INR.
> App: INR e aPTT sono obbligatori e filtrano tutti i pazienti (`PostAcute.svelte:45-46`, `:94-95`). L'etichetta "aPTT ratio" (`en.ts:221`) non dice rispetto a cosa: il protocollo usa "times the ULN", mentre il rapporto di laboratorio di solito è sul controllo. Un paziente non trattato con INR >1,5 senza anticoagulanti viene scartato: caso raro, ma è un falso negativo.

- [ ] **10. `[NC]` Criteri non verificati dall'app.**
> [!note] Non verificati
> - terapia antiaggregante in corso o prevista, con ASA ≤100 mg (inclusione 4);
> - contraccezione (7–8);
> - rischio emorragico: sanguinamento nei 3 mesi, diatesi, deficit di FXI, emorragia spinale o retinica (esclusione 7);
> - allergie a farmaci (9–10);
> - dialisi cronica (11): si chiede solo l'eGFR;
> - isoniazide e inibitori o induttori di P-gp e CYP3A4 (13);
> - altro studio sperimentale nelle 4 settimane, rilevante per il co-arruolamento acuto (14);
> - ALT, piastrine <75.000, bilirubina, Hb <8 (15);
> - aspettativa di vita inferiore a 12 mesi (16);
> - altre cause determinate come la dissezione (4.1), solo in parte coperte dalla domanda sull'aterotrombosi;
> - criteri 17–20 ([[LIBREXIA — Protocolo — Enmienda 2]], p. 40–42).
>
> Inoltre i dati del paziente scadono dopo 24 h senza aprire l'app (`stores/patient.ts:10`, `:53-57`; `persistence.ts:45`). In quel caso `age` torna −1 e la pagina dice "non eleggibile" senza spiegare perché.

- [ ] **11. `[TXT]` Testo dell'imaging: "non-lacunar" e "perfusion deficit, or vessel occlusion".**
> [!warning] Contraddizione
> Protocollo: lacunare ammesso (p. 33; tetto introdotto dall'Amendment 1, p. 114). "Non-lacunar" era un criterio dello studio di fase 2 AXIOMATIC-SSP (p. 25). Per l'ictus basta la lesione acuta al neuroimaging standard, oppure il deficit persistente, oppure il trattamento. Deficit di perfusione e occlusione non sono citati, e nemmeno la circolazione anteriore o posteriore (p. 39–40).
> App: `trials-info.ts:205` "Non-cardioembolic / non-lacunar; CT/MR showing hypodensity, perfusion deficit, or vessel occlusion (anterior or posterior circulation)." Il foglio del team riporta lo stesso testo.

- [ ] **12. `[TXT]` "First dose within 3 h of randomization".**
> [!warning] Contraddizione
> Protocollo: "as close to randomization as possible, ideally within 2 hours of randomization", introdotto dall'Amendment 2 (p. 3, p. 44).
> App: `trials-info.ts:209` "first dose within 3 h of randomization", come il foglio.

- [ ] **13. `[TXT]` Trombolisi e trombectomia indicate come "—".**
> [!warning] Contraddizione
> Protocollo: entrambe ammesse per l'evento indice, con o senza stent. Poi si randomizza dopo almeno 24 h dalla fine e entro 48 h dall'esordio, con imaging senza emorragia, INR ≤1,5 e aPTT ≤1,4 volte l'ULN (p. 40, p. 49).
> App: `trials-info.ts:206-207` "—". L'informazione "TEV/stent: attendere >24 h" del foglio non è riportata in app.

- [ ] **14. `[TXT]` Note sull'eparina e sull'anticoagulazione imprecise.**
> [!warning] Contraddizione
> Protocollo: la profilassi con UFH o EBPM iniziata prima della randomizzazione è ammessa, con 3 giorni di sovrapposizione col farmaco in studio, poi è vietata e si raccomanda la compressione pneumatica. È esclusa "Any condition that requires **chronic** anticoagulation" (p. 41, p. 49–50).
> App: `trials-info.ts:210` "No prophylactic LMWH > 3 days." e "Exclude patients requiring therapeutic anticoagulation." Il senso è giusto, ma non dice che i 3 giorni sono di sovrapposizione dopo la randomizzazione, né che l'esclusione riguarda l'anticoagulazione **cronica**. La nota "Non-cardioembolic" omette "for which guidelines recommend anticoagulation".

- [ ] **15. `[TXT]` Visite: lo studio non finisce a 90 giorni.**
> [!warning] Contraddizione
> Protocollo: studio guidato dagli eventi. Dopo le settimane 4 e 13 (±7) ci sono visite alle settimane 26, 39, 52, 65, 78, 91 e 104 (±14), poi ogni 26 settimane fino a EOT ed EOS. Partecipazione media di circa 15 mesi ([[LIBREXIA — Protocolo — Enmienda 2]], p. 14, p. 16; [[LIBREXIA — CI — V7.0]], p. 2).
> App: `trials-info.ts:211-214` riporta solo due visite, "from screening/randomization". Le visite si contano dalla randomizzazione (giorno 1).

## Problemi documentali
- **Foglio del team vs protocollo**: "TC/RM con ipodensità, deficit di perfusione o occlusione" e "prima dose entro 3 h" non coincidono con l'Amendment 2 (p. 39–40, p. 44). Sembrano venire da una versione precedente o dal fase 2 ("non-lacunar", p. 25).
- **Sinossi indietro di un emendamento**: la sinossi è dell'Amendment 1/EEA-1 (03-06-2023) e **non contiene criteri di eleggibilità** ([[LIBREXIA — Sinopsis — Enmienda 1]]).
- **CI senza modulo per il rappresentante legale**, che il protocollo invece prevede ([[LIBREXIA — CI — V7.0]], p. 14–16; [[LIBREXIA — Protocolo — Enmienda 2]], p. 16, p. 41). Il CI (03-2025) non dice a quale versione del protocollo si riferisce.
- **Incoerenze minori del protocollo**:
  - "24 hours after" (SoA, p. 16) contro ">24 hours" o "at least 24 hours" (p. 31, p. 40);
  - l'AIT è annidato come quarto "OR" nel criterio 2 (p. 39–40);
  - "ALT 3× ULN" senza segno di confronto (p. 42).
- **Figure in immagine**: schema (p. 13), Tab. 1 (p. 20), Tab. 4 (p. 54) e le scale NIHSS e mRS (pp. 102–110) non sono leggibili.

## Fonti
- [[LIBREXIA — Protocolo — Enmienda 2]]
- [[LIBREXIA — Sinopsis — Enmienda 1]]
- [[LIBREXIA — CI — V7.0]]
- [[Esquema ensayos — septiembre 2026]] (stato)
