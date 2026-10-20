---
tipo: ensayo
estudio: MOSTE
alias: [IN-EXTREMIS-MOSTE, "MinOr Stroke Therapy Evaluation", "IN EXTREMIS"]
estado_app: cerrado   # aggiornato 2026-10-19
clave_app: "MOSTE"
categoria: isquémico
fase: "non riportata nel documento (indagine clinica su strategia con dispositivi CE/FDA)"
promotor: "CHU de Montpellier"
registro: []
protocolo_vigente: "V5, 24-06-2024 (= versione 10 del 24-06-2024 in Francia)"
ci_vigente: "v2.0, 12-01-2024 (nome Drive: \"v2 Enmienda 3\"), anteriore al protocollo V5"
drive_carpeta: "https://drive.google.com/drive/folders/1lHMd52LP7GyLvo4MKCdRIu0sy-o7-4zw"
fuentes: ["[[MOSTE — Protocolo — V5]]", "[[MOSTE — Sinopsis — V5]]", "[[MOSTE — CI — v2.0]]"]
actualizado: 2026-10-19
---
# MOSTE

> [!summary] In breve
> Studio randomizzato 1:1, multicentrico internazionale, PROBE, promosso dal CHU de Montpellier. Confronta la trombectomia meccanica (MT) + miglior terapia medica (BMT) con la sola BMT in un [[Ictus minor con LVO]]: [[NIHSS]] 0–5 con deficit potenzialmente disabilitante e occlusione di grosso vaso anteriore (ICA, M1, M1-M2, con o senza [[Oclusión en tándem|tandem]]). La finestra è TLKW ≤23 h alla randomizzazione, con [[ASPECTS]] ≥6 e [[mRS]] pre ≤1 ([[MOSTE — Protocolo — V5]], p. 4, p. 23–24).

> [!warning] Stato: foglio del team vs app
> **Foglio "Esquema ensayos" (fonte di verità, modificato il 2026-10-09, ricontrollato il 2026-10-19): RECLUTAMIENTO CERRADO.**
> App: `status: "active"` (`src/lib/domain/trials-info.ts:45`). Poiché `isTrialOpen()` nasconde solo gli studi `closed` (`trials-info.ts:402-405`), il riepilogo continua a proporre MOSTE ai pazienti eleggibili (`src/routes/Summary.svelte:25`, `:48`).
> Il protocollo V5 prevede il reclutamento fino al 30-04-2027 ([[MOSTE — Protocolo — V5]], p. 4, p. 20). La chiusura è quindi del centro o anticipata, ma non risulta dai documenti in Drive. Va segnalato, non corretto d'ufficio (vedi [[Estado de los estudios]]).

## Disegno
- **Tipo**: internazionale, multicentrico, prospettico, randomizzato 1:1 a due bracci paralleli, trattamento in aperto con endpoint in cieco (PROBE), di superiorità ([[MOSTE — Protocolo — V5]], p. 4, p. 19).
- **Bracci**: MT + BMT contro BMT da sola. Nel braccio BMT è ammessa la MT secondaria entro 24 h, solo per deterioramento neurologico ([[MOSTE — Protocolo — V5]], p. 8, p. 21, p. 27).
- **Randomizzazione**: web, tramite eCRF (Clinsight/ENNOV, Università di Lille), con minimizzazione per età (cut-off a 70 anni, formulato in modo incoerente), sede dell'occlusione (ICA vs M1 o M1-M2), fibrinolisi e.v., tempo 0–4,5 vs 4,5–23 h e centro ([[MOSTE — Protocolo — V5]], p. 5, p. 21, p. 42).
- **Cieco**: trattamento aperto. Il mRS a 90 giorni lo valuta un valutatore in cieco certificato, con intervista guidata. Il core lab (UCLA) legge tutte le immagini ([[MOSTE — Protocolo — V5]], p. 19, p. 57).
- **Numerosità**: massimo 824 pazienti (412 per braccio), fino a 41 centri in Europa e USA ([[MOSTE — Protocolo — V5]], p. 4, p. 20). Ipotesi: mRS 0–1 dal 60% al 70%, test a una coda (alfa 2,5%, potenza 80%). Due interim a 274 e 548 pazienti, con ricalcolo della numerosità alla seconda ([[MOSTE — Protocolo — V5]], p. 38, p. 40).
- **Endpoint primario**: mRS 0–1 a 90 giorni ([[MOSTE — Protocolo — V5]], p. 22).
- **Endpoint secondari**: mRS 0–2 e mRS 0; EQ-5D-5L; MoCA, Trail Making A e B, STROOP (centri francesi); ΔNIHSS a 24 h; tasso di MT secondaria; volume dell'infarto e ricanalizzazione a 24 h; TICI 2b/3 ([[MOSTE — Protocolo — V5]], p. 22).
- **Sicurezza**: mortalità a 90 giorni (primario); sICH secondo Heidelberg a 24 h, peggioramento NIHSS ≥10 fino a G5–7, eventi legati a procedura o dispositivo ([[MOSTE — Protocolo — V5]], p. 22–23).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | TLKW ≤23 h **alla randomizzazione**; trattamento entro 24 h dal TLKW; accesso arteriale entro 60 min dalla randomizzazione (raccomandati ≤45 min) | ([[MOSTE — Protocolo — V5]], p. 6, p. 23, p. 63) |
| Età | ≥18 anni, nessun limite superiore | ([[MOSTE — Protocolo — V5]], p. 23) |
| mRS pre | ≤1 | ([[MOSTE — Protocolo — V5]], p. 24) |
| NIHSS | 0–5 alla randomizzazione, con deficit potenzialmente disabilitante; misurato entro 1 h prima della randomizzazione da un valutatore certificato esterno all'équipe interventistica | ([[MOSTE — Protocolo — V5]], p. 23, p. 35–36) |
| Imaging / ASPECTS / core | ASPECTS ≥6 in TC senza contrasto o RM-DWI. RM preferita; TC/angio-TC/TC-perfusione se la RM non è disponibile. Imaging entro 1 h prima della randomizzazione; nei drip and ship va ripetuto se il primo ha più di 1 h. Perfusione non richiesta | ([[MOSTE — Protocolo — V5]], p. 24, p. 36, p. 58, p. 64) |
| Occlusione | LVO intracranica anteriore su angio-TC o angio-RM: ICA, M1, M1-M2, con o senza lesione cervicale (tandem). Escluse la ICA cervicale prossimale isolata, la M2 isolata e le occlusioni in più territori | ([[MOSTE — Protocolo — V5]], p. 7–8, p. 24, p. 29) |

## Criteri di inclusione
Testo originale (§11.1, [[MOSTE — Protocolo — V5]], p. 23–24; numerazione della sinossi, p. 6–7):

1. Subject is ≥ 18 years old at inclusion (no upper age limit) (p. 23)
2. Clinical signs consistent with acute ischemic stroke with time last known well (TLKW) ≤ 23h at randomization (With the goal of remaining within 24 hours from TLKW to treatment) (p. 23)
3. NIHSS 0-5 at the time of randomization with potentially disabling deficit that would prevent a patient from performing basic activities of daily living (bathing, ambulating, toileting, hygiene, and eating) or returning to the same work (p. 23)
4. ASPECT score ≥ 6 on non-contrast CT or DWI-MRI (p. 24)
5. Ischemic Stroke confirmed with cerebral imaging or normal imaging with suspected ischemic stroke (p. 24)
6. Proven anterior circulation intracranial large vessel occlusion on CTA or MRA (ICA, M1, M1-M2 with or without cervical lesion (Tandem)) at the time of randomization. The MCA – M1 segment is defined as the first branch of the intracranial ICA which courses horizontally from its branching point off the ICA through the Sylvian fissure up to the first bifurcation distal to the lenticulo-striate arteries, in the Sylvian fissure. The MCA M1-M2 occlusion is considered to represent a distal M1 segment occlusion and is operationally defined as total occlusion of the M2 segment (defined as the portions of the MCA distal to the first bifurcation or trifurcation, but prior to the second bifurcation) and suspicion of any involvement of the M1 segment. (p. 24)
7. For Drip and Ship patients: New imaging performed again on inclusion center if first imaging performed > 1 hour before randomization. (p. 24)
8. Patient or patient's representative has received information about the study and has signed and dated the appropriate Informed Consent Form (p. 24)
9. Anticipated possibility to start the procedure (arterial access) within 60 minutes after randomization (p. 24)
10. Pre stroke mRS ≤ 1 (p. 24)
11. For patients for whom thrombolytic therapy, such as IV t-PA, is indicated, regardless of degree of disability, such treatment is initiated as soon as possible and within the accepted clinical guidelines as measured from stroke symptom onset. (p. 24)

**Sintesi**: adulto senza limite di età, mRS pre ≤1, NIHSS 0–5 con deficit potenzialmente disabilitante, ASPECTS ≥6, LVO anteriore (ICA, M1 o M1-M2, anche tandem) entro 23 h dal TLKW alla randomizzazione. Deve essere possibile l'accesso arteriale entro 60 min. La trombolisi indicata va fatta comunque, senza ritardi. Nella sinossi l'inclusione 3 dice "disabling deficit", senza "potentially" ([[MOSTE — Protocolo — V5]], p. 6).

## Criteri di esclusione
Testo originale (§11.2–11.3, [[MOSTE — Protocolo — V5]], p. 24–26; numerazione della sinossi, p. 7–8):

*General Exclusion Criteria*
1. Anticipated impossibility to start the procedure (arterial access) within 60 minutes after randomization (p. 24)
2. Known absence of vascular access (p. 24)
3. Known contrast or endovascular product life-threatening allergy (p. 24)
4. Female who is known to be pregnant or lactating at time of admission (p. 24)
5. Patient who presents severe or fatal co-morbidities or Life expectancy under 6 months that will likely interfere with improvement or follow-up or that will render the procedure unlikely to benefit the patient. (p. 25)
6. Patient unable to present or be available for follow-up (p. 25)
7. Pre-existing neurological or psychiatric disease that would confound the neurological or functional evaluations (p. 25)
8. Evidence of vessel recanalization prior to randomization (p. 25)
9. Seizures at stroke onset if it makes the diagnosis of stroke doubtful and precludes obtaining an accurate baseline NIHSS assessment. (p. 25)
10. Current participation in another investigational drug study (p. 25)
11. Suspicion of aortic dissection based on medical history, clinical evaluation or/and imaging (p. 25)
12. Major patients under guardianship (p. 25)
13. Blood glucose < 50 mg/dL or > 400 mg/dL (p. 25)
14. Cr > 4.0, unless the patient is on dialysis (p. 25)
15. Platelet count < 50000/uL (p. 25)
16. INR > 3.0 or PTT > 3 times upper limit of normal (ULN) (p. 25)

*Imaging Exclusion Criteria*
1. Isolated proximal cervical ICA occlusion (solo sinossi, p. 7; ribadito a p. 29; assente nel §11.3)
2. Evidence of intracranial hemorrhage on CT/MRI (p. 25)
3. Excessive tortuosity of cervical vessels on CTA/MRA that would likely result in unstable access platform (p. 25)
4. High suspicion of underlying intracranial stenosis on CTA/MRA (p. 25)
5. Suspected cerebral vascular disease (e.g. vasculitis) based on medical history and CTA/MRA (p. 25)
6. Presumed calcified Embolus or Intracranial Stenosis decompensation (p. 25)
7. Intracranial stent implanted in the same vascular territory that would preclude the safe deployment/removal of the stent retriever device (p. 25)
8. Occlusions in multiple vascular territories (e.g.: bilateral anterior circulation, or anterior circulation/vertebrobasilar system) on CTA/MRA (p. 26)
9. Significant mass effect with midline shift as confirmed on CT/MRI (p. 26)

Inoltre, dal §12: "Subject with isolated proximal cervical ICA occlusions, isolated M2 occlusions and subjects with occlusions in multiple vascular territories (…) on the pre-randomization neuro-imaging are excluded from the study." ([[MOSTE — Protocolo — V5]], p. 29)

**Sintesi**: oltre ai criteri tecnici (accesso entro 60 min, tortuosità, stent intracranico, sospetta stenosi intracranica o embolo calcifico) sono esclusi:
- ricanalizzazione già avvenuta, emorragia, effetto massa con shift;
- occlusioni multiterritoriali, ICA cervicale isolata, M2 isolata;
- gravidanza, aspettativa di vita <6 mesi, crisi all'esordio che rendono dubbio il NIHSS;
- adulti sotto tutela legale;
- partecipazione a un altro studio **con farmaco**.

Ci sono anche soglie di laboratorio: glicemia <50 o >400 mg/dL, creatinina >4,0 mg/dL senza dialisi, piastrine <50.000/µL, INR >3,0 o PTT >3 volte il limite superiore.

## Intervento e procedure
- **Braccio MT**: qualunque dispositivo CE o FDA (codice NRY) della lista approvata, a scelta dell'operatore (stent retriever o aspirazione). Con lo stent retriever è obbligatorio il catetere guida a palloncino; raccomandati al massimo 3 passaggi per dispositivo. Accesso femorale se possibile ([[MOSTE — Protocolo — V5]], p. 8, p. 26). L'inizio del trattamento è l'accesso arteriale, entro 60 min dalla randomizzazione; la procedura va chiusa entro 2 h ([[MOSTE — Protocolo — V5]], p. 26, p. 63). Ci si ferma a TICI 2b/3 ([[MOSTE — Protocolo — V5]], p. 31, p. 63).
- **Farmaci in sala**: vietati i trombolitici intra-arteriosi; eparina al massimo 3000 UI in bolo + 500 UI/h; antiaggreganti ammessi se si posiziona uno stent carotideo ([[MOSTE — Protocolo — V5]], p. 9, p. 28).
- **Braccio BMT**: terapia a discrezione del medico secondo le linee guida ESO o AHA/ASA (fibrinolisi e.v., antiaggreganti, anticoagulanti), **mai terapie intra-arteriose** ([[MOSTE — Protocolo — V5]], p. 10, p. 32).
- **MT secondaria (braccio BMT)**: entro 24 h dalla randomizzazione, se il NIHSS peggiora di ≥4 punti o arriva a ≥6, o per deterioramento clinico a giudizio del medico. Servono una TC senza contrasto senza emorragia e un ASPECTS >6. Oltre 24 h si segue la pratica locale ([[MOSTE — Protocolo — V5]], p. 8–9, p. 27).
- **Trombolisi**: ammessa e anzi dovuta se indicata, come pratica standard prima della valutazione per lo studio e senza ritardi (inclusione 11) ([[MOSTE — Protocolo — V5]], p. 6, p. 24, p. 32).
- **Trombectomia**: è l'intervento randomizzato.
- **Entrambi i bracci**: nei pazienti trombolisati, niente nuovi antitrombotici né anticoagulanti fino all'imaging a 24 h. Nessuna terapia endovascolare né endoarteriectomia programmata prima delle valutazioni a 24 h. EBPM sottocute ammessa per la profilassi della TVP ([[MOSTE — Protocolo — V5]], p. 32).
- **PA**: dopo tPA <180/105 mmHg nelle prime 24 h; dopo riperfusione TICI 2b/3 si raccomanda una PAS <140 mmHg ([[MOSTE — Protocolo — V5]], p. 64).
- **Esami prima della randomizzazione**: non c'è un elenco obbligatorio, ma i criteri di esclusione 13–16 richiedono glicemia, creatinina, piastrine e INR/PTT. La Tabella 1 prevede "Labs" allo screening ([[MOSTE — Protocolo — V5]], p. 25, p. 34).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| V1 Screening / basale | prima della randomizzazione (t0) | criteri, anamnesi, farmaci, esami, consenso, mRS pre, NIHSS (entro 1 h), RM/angio-RM o TC/angio-TC (entro 1 h), ASPECTS | ([[MOSTE — Protocolo — V5]], p. 34–36) |
| Procedura | solo braccio MT (o MT secondaria) | angiografia e dettagli della procedura | ([[MOSTE — Protocolo — V5]], p. 34) |
| V2 | 24 h (−6/+12) dalla randomizzazione | NIHSS, imaging (RM/angio-RM o TC/angio-TC, idealmente la stessa modalità del basale, RM raccomandata), IQCODE breve | ([[MOSTE — Protocolo — V5]], p. 10, p. 36–37) |
| V3 | G5–7 o dimissione, se precedente | NIHSS; imaging facoltativo | ([[MOSTE — Protocolo — V5]], p. 10, p. 37) |
| V4 | G90 (±14) | **in presenza** con valutatore in cieco: mRS, EQ-5D-5L, MoCA, Trail Making A e B, STROOP (Francia). mRS telefonico solo se il paziente non può venire | ([[MOSTE — Protocolo — V5]], p. 10, p. 37) |

## Consenso
- **Tipo**: consenso informato **scritto** prima della randomizzazione, del paziente o del rappresentante ("acceptable patient surrogate") ([[MOSTE — Protocolo — V5]], p. 35, p. 61). Il primo passo può essere il consenso di una persona di fiducia; quello del paziente si raccoglie appena possibile ([[MOSTE — Protocolo — V5]], p. 34).
- **Emergenza**: se il CEIm e la normativa lo permettono, si può includere un paziente quando né lui né il rappresentante né la persona di fiducia possono firmare; il paziente va informato e il consenso richiesto appena possibile (non vale negli USA) ([[MOSTE — Protocolo — V5]], p. 61).
- **CI locale (v2.0)**: firma del paziente; oppure firma del rappresentante legale, del familiare o della persona di fatto "antes de la intervención", con conferma successiva del paziente ([[MOSTE — CI — v2.0]], p. 1, p. 9–10). L'inclusione senza alcuna firma non è prevista nel CI.
- **Orale o telefonico**: non riportato né nel protocollo né nel CI.
- **Lingue**: CI disponibile in Drive solo in castellano. Il catalano non è presente nella cartella.

## Co-arruolamento
- Escluso solo chi partecipa **ora** a un altro studio sperimentale **con farmaco** ("investigational drug study") ([[MOSTE — Protocolo — V5]], p. 25). Gli studi con dispositivo non sono citati.
- Compatibilità con studi specifici: non riportata nel documento.

## Divergenze con EnsApp
Confronto con:
- `src/lib/domain/trials-info.ts:44-58` e `:360`;
- `src/lib/domain/acute-rules.ts:86-90` (`computeVesselFlags`) e `:200-209` (`moste()`);
- `src/lib/domain/acute-reasons.ts:98-107`;
- per l'interfaccia, `src/routes/PostImaging.svelte` e `src/lib/domain/vessels.ts`.

Verificato il 2026-10-19 sul commit `6617a91`.

> [!success] Coincide
> - mRS pre ≤1 (`acute-rules.ts:204`);
> - NIHSS 0–5 (`nihss < 6`, `:205`; testo `trials-info.ts:49`);
> - nessun limite superiore di età (`trials-info.ts:49`);
> - finestra di 23 h (vedi però il punto 8);
> - LVO obbligatoria (`:206`);
> - ICA-T e M1 fra i vasi ammessi (`:87-88`);
> - tandem non escluso (`tandem` non usato dalla regola, come da protocollo);
> - trombolisi "Optional." e randomizzazione "EVT yes/no" (`trials-info.ts:52-53`);
> - drip and ship con nuovo imaging se >1 h (`trials-info.ts:56`);
> - testo ASPECTS "6-10" (`trials-info.ts:49`);
> - link di randomizzazione all'eCRF Ennov dell'Università di Lille (`trials-info.ts:360`; [[MOSTE — Protocolo — V5]], p. 42);
> - stato `closed` come il foglio (`trials-info.ts:47`, vedi il punto 13).

- [ ] **1. [FP] L'ASPECTS non viene controllato.**
> [!warning] Contraddizione
> Protocollo, inclusione 4: "ASPECT score ≥ 6 on non-contrast CT or DWI-MRI" ([[MOSTE — Protocolo — V5]], p. 24).
> App: `moste()` (`acute-rules.ts:200-209`) e `reasonMoste()` (`acute-reasons.ts:98-107`) non leggono `aspects`, anche se il campo si compila nella stessa scheda EVT (`PostImaging.svelte:175-177`). Il testo `trials-info.ts:49` dice "6-10", ma la logica no. Un paziente con ASPECTS 0–5 risulta eleggibile: falsi positivi.

- [ ] **2. [FP] La M2 isolata è accettata.**
> [!warning] Contraddizione
> Protocollo: si ammette "M1-M2", cioè l'occlusione totale di M2 **con sospetto coinvolgimento di M1** ([[MOSTE — Protocolo — V5]], p. 24). "isolated M2 occlusions … are excluded from the study" ([[MOSTE — Protocolo — V5]], p. 29). L'App. B considera eleggibile come M1 distale la mancata visualizzazione dell'origine di uno dei due rami M2 ([[MOSTE — Protocolo — V5]], p. 72).
> App: `computeVesselFlags` accetta `m2-any` e `m2-proxdom` da soli (`acute-rules.ts:89-90`); l'etichetta è "vessel ICA-T / M1 / M2" (`acute-reasons.ts:105`). Una M2 isolata, anche non dominante ("Any M2", `vessels.ts:16`), risulta eleggibile: falsi positivi. Il foglio scrive "M1-M2" come l'app (`trials-info.ts:51`), ma la regola non lo applica.

- [ ] **3. [FP] Non si controllano le occlusioni in più territori né la tortuosità.**
> [!warning] Contraddizione
> Protocollo, esclusioni imaging 3 e 8: "Excessive tortuosity of cervical vessels…" e "Occlusions in multiple vascular territories…" ([[MOSTE — Protocolo — V5]], p. 25–26, p. 29).
> App: `vessels.moste` è un OR (`acute-rules.ts:86-90`), quindi per esempio M1 + basilare risulta eleggibile. Il campo `tortuosity` esiste (`PostImaging.svelte:174`), ma `moste()` non lo usa.

- [ ] **4. [FP] Il deficit "potentially disabling" non viene chiesto.**
> [!warning] Contraddizione
> Protocollo, inclusione 3: NIHSS 0–5 "with potentially disabling deficit…" ([[MOSTE — Protocolo — V5]], p. 23); la sinossi dice "disabling deficit" (p. 6).
> App: basta `nihss < 6` (`acute-rules.ts:205`). Un NIHSS 0–1 con deficit non disabilitante risulta eleggibile. È accettabile come scelta di progetto, ma va reso esplicito.

- [ ] **5. [FP] L'età ≥18 non viene controllata.**
> [!warning] Contraddizione
> Protocollo, inclusione 1: "Subject is ≥ 18 years old at inclusion (no upper age limit)" ([[MOSTE — Protocolo — V5]], p. 23).
> App: `moste()` non ha alcuna condizione su `input.age` (`acute-rules.ts:202-208`). Il "No upper limit" di `trials-info.ts:49` è corretto, ma manca il limite inferiore.

- [ ] **6. [FN] MOSTE compare solo se il paziente è marcato "candidato a trombectomia".**
> [!warning] Contraddizione
> Protocollo: in MOSTE la trombectomia è proprio il trattamento randomizzato, in pazienti con NIHSS 0–5 per i quali non è lo standard ([[MOSTE — Protocolo — V5]], p. 15–16, p. 19).
> App: `lvo` deriva da "Candidato a trombectomia (EVT)? → Eleggibile" (`PostImaging.svelte:25-27`), e la scheda dei vasi appare solo in quel caso (`:102`, `:163-169`). Se il medico risponde "Non eleggibile" a un ictus minor con LVO, cosa plausibile fuori dallo studio, MOSTE non viene mai valutato: falsi negativi di flusso.

- [ ] **7. [FN] La ICA intracranica non terminale è esclusa; il protocollo è ambiguo.**
> [!warning] Contraddizione
> Protocollo: "(ICA, M1, M1-M2 …)" (inclusione 6, p. 24); "Intracranial ICA and/or MCA-M1 or M1-M2" (p. 28); stratificazione "ICA vs MCA" (p. 21); ma il flow chart dice "ICA-T" (p. 33) ([[MOSTE — Protocolo — V5]]).
> App: `computeVesselFlags` include solo `ica-terminal`, non `ica-intracranial` ("Intracranial ICA (no T)", `vessels.ts:12`) (`acute-rules.ts:87`). Se la ICA intracranica non-T è ammessa, ci sono falsi negativi. Da chiarire con il promotore.

- [ ] **8. [FN]/[FP] Finestra: `< 23` invece di `≤ 23`, misurata quando si usa l'app e non alla randomizzazione.**
> [!warning] Contraddizione
> Protocollo: "TLKW ≤ 23h at randomization" ([[MOSTE — Protocolo — V5]], p. 23); trattamento entro 24 h dal TLKW ([[MOSTE — Protocolo — V5]], p. 6).
> App: `input.ltsw < 23` (`acute-rules.ts:203`; `acute-reasons.ts:101` "LTSW < 23h"; `trials-info.ts:49` "< 23 h"). `ltsw` sono le ore trascorse al momento della valutazione (`stores/patient.ts:82-90`). La differenza è di bordo (esattamente 23 h), ma l'app non avvisa che il limite vale alla randomizzazione, che avviene dopo.

- [ ] **9. [TXT] Consenso orale o telefonico non previsto dai documenti.**
> [!warning] Contraddizione
> Protocollo: consenso scritto del paziente o del rappresentante; persona di fiducia; inclusione senza firma se il CEIm lo permette ([[MOSTE — Protocolo — V5]], p. 34–35, p. 61). CI: solo firme scritte, del paziente o del rappresentante, poi conferma del paziente ([[MOSTE — CI — v2.0]], p. 9–10).
> App: `trials-info.ts:50` "Written & oral/phone consent." (come il foglio). Né l'orale né il telefonico compaiono nei documenti in Drive: da verificare con il CEIm o il promotore.

- [ ] **10. [TXT] Testo dell'imaging impreciso.**
> [!warning] Contraddizione
> Protocollo: occlusione su angio-TC **o angio-RM**, RM preferita (p. 24, p. 36, p. 58). A 24 h "MRI/MRA or CT/CTA", idealmente con la stessa modalità del basale e la RM raccomandata (p. 36). È esclusa la ICA cervicale prossimale **isolata**, non la ICA in generale (p. 7, p. 29) ([[MOSTE — Protocolo — V5]]).
> App: `trials-info.ts:51` "CTA showing occlusion: TICA, M1-M2 or tandem. CT + CTA at 24 h."; `:56` "Isolated ICA exclusion.", "24 h CT and CTA always.". La M1 da sola non è citata, la RM manca, e "Isolated ICA" va precisato come "isolated proximal cervical ICA".

- [ ] **11. [TXT] "preEvtLabs: No." contro criteri di esclusione di laboratorio.**
> [!warning] Contraddizione
> Protocollo, esclusioni 13–16: glicemia, creatinina, piastrine, INR/PTT; "Labs" allo screening nella Tabella 1 ([[MOSTE — Protocolo — V5]], p. 25, p. 34).
> App: `trials-info.ts:54` "No." Il protocollo non dice esplicitamente che i risultati debbano essere disponibili prima della randomizzazione, ma i criteri li presuppongono.

- [ ] **12. [TXT] Visite: G90 non è telefonica di default.**
> [!warning] Contraddizione
> Protocollo: G5–7 o dimissione, se precedente; G90 (±14) "within an inperson visit (by a blinded assessor)"; il telefono solo se il paziente non può venire ([[MOSTE — Protocolo — V5]], p. 37; [[MOSTE — CI — v2.0]], p. 4).
> App: `trials-info.ts:57` "Day 5 / discharge (in-person)", "Day 90 (phone)".

- [x] **13. [FP] Stato: l'app lo proponeva ancora, il foglio dice reclutamento chiuso. ✅ risolto il 2026-10-19 (status closed).**
> [!success] Risolto
> Foglio [[Esquema ensayos — septiembre 2026]]: MOSTE "reclutamiento cerrado". Protocollo: reclutamento previsto fino al 30-04-2027 ([[MOSTE — Protocolo — V5]], p. 20).
> Prima: `status: "active"`, e `Summary.svelte:48` elencava MOSTE fra gli studi eleggibili. Ora (commit `7818276`): `trials-info.ts:47` `status: "closed"`, con il commento sul foglio (`:45-46`). `isTrialOpen()` esclude `closed` e `paused` (`trials-info.ts:410-413`), quindi il Riepilogo (`Summary.svelte:48`) non lo propone più. Resta da allineare il frontmatter `estado_app: activo`.

> [!note] Non modellati (scelta di progetto, non divergenza)
> La regola non controlla le altre esclusioni cliniche e di imaging: emorragia, ricanalizzazione già avvenuta, accesso entro 60 min, sospetta stenosi intracranica o embolo calcifico, stent intracranico, effetto massa, gravidanza, adulti sotto tutela, altri studi con farmaco ([[MOSTE — Protocolo — V5]], p. 24–26). L'emorragia è comunque filtrata dal tipo di ictus nell'interfaccia.

## Problemi documentali
- **Audit "00 REVISAR"**: segnala "Consentimiento anterior al protocolo vigente" per MOSTE. Confermato: CI v2.0 del 12-01-2024 contro protocollo V5 del 24-06-2024. Il confronto ([[MOSTE — CI — v2.0]]) non trova differenze sostanziali in ciò che il CI descrive. Manca però l'inclusione senza firma prevista dal protocollo (p. 61), e non si sa se esista un CI successivo approvato.
- **Nomi dei file fuorvianti**: il "Protocolo — V5 castellano — 2024-11" è in **inglese** ed è datato **24-06-2024**; l'unico documento in castellano è la sinossi. Il CI "v2 Enmienda 3 — 2024-02" non cita alcun emendamento.
- **Intestazione incoerente** del protocollo: "24th June 2024" a pp. 1–34, "24th January 2024" a pp. 35–87 ([[MOSTE — Protocolo — V5]]).
- **ICA cervicale isolata**: esclusa nella sinossi (p. 7) e nel §12 (p. 29), assente nel §11.3 (p. 25–26).
- **ICA intracranica**: "ICA" o "Intracranial ICA" nel testo (p. 24, p. 28), "ICA-T" nel flow chart (p. 33).
- **"Disabling" vs "potentially disabling"** (inclusione 3): sinossi p. 6 contro §11.1 p. 23.
- **Cut-off di età per la stratificazione**: <70 vs ≥70 (p. 5) contro ≤70 vs >70 (p. 21, p. 41).
- **Finestra a 24 h**: "24 (-6/+24)" nel §14 (p. 32) contro "24 (-6/+12)" altrove.
- **Traduzione spagnola**: "Major patients under guardianship" è reso con "Pacientes ancianos bajo tutela" ([[MOSTE — Sinopsis — V5]], p. 5). È un errore di senso: significa adulti, non anziani.
- **Registro**: numero NCT non riportato; nell'App. D è un segnaposto ("NCTASOPHIE A COMPLETER", p. 77).
- **Chiusura del reclutamento**: nessun documento in Drive la attesta; la fonte è solo il foglio del team.

## Fonti
- [[MOSTE — Protocolo — V5]]
- [[MOSTE — Sinopsis — V5]]
- [[MOSTE — CI — v2.0]]
- [[Esquema ensayos — septiembre 2026]] (stato)
