---
tipo: ensayo
estudio: DO-IT
alias: [DOIT, "DO IT", "The DOAC Intravenous Thrombolysis trial"]
estado_app: activo
clave_app: "DOIT"
categoria: isquémico
fase: "IV (categoria 3: farmaci in commercio usati fuori indicazione)"
promotor: "Insel Gruppe AG, Inselspital (Ospedale Universitario di Berna)"
registro: ["NCT06571149", "EU CT 2024-515561-34-01"]
protocolo_vigente: "v2.0, 01-01-2026"
ci_vigente: "Appendix ICF Spain V1.3, 01-01-2026 (procedura di consenso; il modulo per il paziente non è in Drive)"
drive_carpeta: "https://drive.google.com/drive/folders/16YG95cLaqruw6wpbkIugX88oqFi8Myz8"
fuentes: ["[[DO-IT — Protocolo — v2.0]]", "[[DO-IT — Sinopsis — V1.1]]", "[[DO-IT — CI — V1.3]]", "[[DO-IT — Cambios — v1.0 a v2.0]]"]
actualizado: 2026-10-20
---
# DO-IT

> [!summary] In breve
> Studio PROBE randomizzato 1:1, promosso dall'Inselspital di Berna. Confronta la trombolisi e.v. ([[Alteplasa]] o [[Tenecteplasa]], dose standard) + BMT con la sola BMT in pazienti con ictus ischemico acuto e **assunzione di un [[DOAC]] nelle 48 h precedenti** (o in terapia con DOAC e ora dell'ultima dose ignota). I pazienti devono essere per il resto candidati all'IVT e avere un deficit disabilitante. Finestra: randomizzazione entro 4 h 15 min e IVT entro 4 h 30 min dal LKW, oppure mismatch DWI-FLAIR in RM con trattamento entro 4,5 h dal riconoscimento dei sintomi ([[DO-IT — Protocolo — v2.0]], p. 8, p. 31).

> [!warning] Non è uno studio sull'ictus lieve
> Il razionale è il DOAC, non la gravità dell'ictus. Il protocollo **esclude** di fatto l'ictus lieve non disabilitante, chiedendo un "disabling deficit according to the judgement of the treating physician" ([[DO-IT — Protocolo — v2.0]], p. 26, p. 31). Vedi [[Ictus no discapacitante]].

> [!note] Stato
> Foglio [[Esquema ensayos — septiembre 2026]] (fonte di verità): **aperto**. App: `status: "active"` (`src/lib/domain/trials-info.ts:286`). Coerente. Il protocollo prevede l'ultimo paziente randomizzato a 01/2029 ([[DO-IT — Protocolo — v2.0]], p. 9).

## Disegno
- **Tipo**: multicentrico, prospettico, a due bracci, randomizzato 1:1, open label con endpoint in cieco (PROBE), di superiorità ([[DO-IT — Protocolo — v2.0]], p. 1, p. 29).
- **Bracci**: IVT (alteplasa o tenecteplasa) + BMT contro sola BMT. Nel controllo nessun placebo ([[DO-IT — Protocolo — v2.0]], p. 9, p. 34). La BMT può includere la trombectomia in entrambi i bracci ([[DO-IT — Protocolo — v2.0]], p. 34, p. 40).
- **Randomizzazione**: secuTrial (CTU Bern), minimizzazione probabilistica stratificata per NIHSS ≤6 vs >6, centro, DOAC entro 12 h vs >12 h/ora ignota ([[DO-IT — Protocolo — v2.0]], p. 29). Prima di randomizzare, un medico indipendente conferma l'eleggibilità ([[DO-IT — Protocolo — v2.0]], p. 40).
- **Cieco**: trattamento aperto; mRS a 90 giorni valutato da personale certificato in cieco; core lab di imaging e comitato eventi (CEC) in cieco ([[DO-IT — Protocolo — v2.0]], p. 30, p. 38).
- **Numerosità**: 906 pazienti (453 per braccio), con ricalcolo adattivo solo in aumento; circa 100 centri ([[DO-IT — Protocolo — v2.0]], p. 9, p. 32, p. 47).
- **Endpoint primario**: [[mRS]] a 90 giorni ±2 settimane, analisi shift ([[DO-IT — Protocolo — v2.0]], p. 8, p. 27, p. 48).
- **Endpoint secondari**: mRS 0–2 o ritorno al basale; ΔNIHSS e volume dell'infarto a 24 ±12 h; EuroQol 5D-3L; Barthel esteso; destinazione alla dimissione ([[DO-IT — Protocolo — v2.0]], p. 27).
- **Sicurezza**: [[Hemorragia intracraneal sintomática|sICH]] entro 36 h (ECASS-2); qualunque ICH a 24 ±12 h (Heidelberg, core lab); mortalità a 7 giorni o alla dimissione e a 90 giorni; sanguinamento extracranico maggiore (ISTH); edema orolinguale ([[DO-IT — Protocolo — v2.0]], p. 27–28). Quattro interim di sicurezza e futilità (10, 30, 50, 75%) ([[DO-IT — Protocolo — v2.0]], p. 48).

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Randomizzazione ≤4 h 15 min e IVT ≤4 h 30 min dal LKW; **oppure** mismatch DWI-FLAIR in RM e IVT entro 4,5 h dal riconoscimento dei sintomi (es. risveglio) | ([[DO-IT — Protocolo — v2.0]], p. 8, p. 31) |
| Età | ≥18 anni, nessun limite superiore | ([[DO-IT — Protocolo — v2.0]], p. 32) |
| mRS pre | Non è un criterio (raccolto come basale) | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 31–32) |
| NIHSS | Nessuna soglia: "disabling deficit" a giudizio del medico curante; NIHSS ≤6 vs >6 solo per la stratificazione | ([[DO-IT — Protocolo — v2.0]], p. 29, p. 31) |
| DOAC | Assunzione entro 48 h prima dell'arruolamento, o terapia in corso con ora dell'ultima dose ignota. Livelli plasmatici non richiesti | ([[DO-IT — Protocolo — v2.0]], p. 31) |
| Imaging / ASPECTS / core | TC o RM secondo lo standard locale; RM con mismatch DWI-FLAIR solo per la via a esordio ignoto. Nessun criterio ASPECTS o di core | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 31) |
| Occlusione | Non richiesta. Pazienti con trombectomia prevista ≤20% del totale | ([[DO-IT — Protocolo — v2.0]], p. 32) |

## Criteri di inclusione
Testo originale (§7.1, [[DO-IT — Protocolo — v2.0]], p. 31):

- I1) Informed consent (deferred consent when possible according to national legislation) (p. 31)
- I2) AIS eligible to receive intravenous alteplase/tenecteplase as per standard of care and disabling deficit according to the judgement of the treating physician (p. 31)
- I3) DOAC ingestion within 48 hours prior to enrollment, or patient with an ongoing prescription of DOAC but exact time point of last intake is unknown. (p. 31)
- I4) Either
  - Can be randomized within 4 hours 15 minutes and treated within 4 hours 30 minutes of last known well time OR
  - MRI showing a pattern of "DWI-FLAIR-mismatch", i.e. acute ischemic lesion visibly on DWI ("positive DWI") but no marked parenchymal hyperintensity visible on FLAIR ("negative FLAIR") indicative of an acute ischemic lesion ≤4.5 hours of age AND Treatment can be started within 4.5 hours of symptom recognition (e.g., awakening). (p. 31)

Inoltre (p. 31): "Selection by plasma levels is not an in- nor exclusion criterion". Nei centri con dosaggio calibrato in <30 min, con dubbio clinico e ultima dose non nelle 2 h precedenti al prelievo, si attende il risultato: "patients with non-measurable (below local detection threshold) DOAC activity … should not be enrolled in the trial."

**Sintesi**: ictus ischemico acuto con deficit disabilitante, candidato all'IVT secondo lo standard se non fosse per il DOAC, con DOAC nelle 48 h (o ora dell'ultima dose ignota). Finestra di 4,5 h dal LKW, con randomizzazione entro 4 h 15 min; in alternativa, esordio ignoto con mismatch DWI-FLAIR (vedi [[Ictus del despertar]]).

## Criteri di esclusione
Testo originale (§7.1, [[DO-IT — Protocolo — v2.0]], p. 31–32):

- E1) Contra-indications to IVT by the current standard of care of the treating physicians with the exception of recent DOAC intake as specified above. (p. 31)
- E2) Intended reversal by specific or unspecific reversal agents: This refers to planned or initiated reversal of DOAC effect prior to randomization, using specific reversal agents (idarucizumab or andexanet alfa) or non-specific agents (e.g., prothrombin complex concentrate [PCC], activated PCC, or fresh frozen plasma [FFP]). Tranexamic acid is not considered as a reversal agent. (p. 31)
- E3) Pregnancy. This is defined as a positive pregnancy test or known or suspected pregnancy at the time of screening. (p. 31–32)
- E4) Patient < 18 years of age (since the benefit of IVT is unproven in this population) (p. 32)
- "… inclusion of patients with intended mechanical thrombectomy is limited to a maximum of 20% of the study population. If this number is reached, the following additional exclusion criterion will be applied:" E5) Intended treatment with endovascular reperfusion strategies (p. 32)

Nella sinossi E3 è "Pregnancy or lactating women" ([[DO-IT — Protocolo — v2.0]], p. 8; [[DO-IT — Sinopsis — V1.1]], p. 2).

**Sintesi**: si escludono le controindicazioni all'IVT diverse dal DOAC, l'antagonizzazione prevista o iniziata (idarucizumab, andexanet, PCC, FFP; l'acido tranexamico non conta), la gravidanza (e l'allattamento secondo la sinossi) e i minori. Una volta raggiunto il tetto del 20%, anche i candidati a trombectomia.

## Intervento e procedure
- **IVT**: alteplasa 0,9 mg/kg (max 90 mg; 10% in bolo, resto in 60 min) o tenecteplasa 0,25 mg/kg (max 25 mg) in bolo, secondo lo standard del centro. Vietate dosi di tenecteplasa >0,25 mg/kg ([[DO-IT — Protocolo — v2.0]], p. 29, p. 35).
- **Tempi**: obiettivo randomizzazione→IVT <10 min. I centri che lo superano vengono contattati e possono essere esclusi dal reclutamento ([[DO-IT — Protocolo — v2.0]], p. 35).
- **Trombectomia**: secondo lo standard locale in entrambi i bracci, entro il tetto del 20% dei pazienti con MT prevista ([[DO-IT — Protocolo — v2.0]], p. 32, p. 40).
- **Antagonisti del DOAC**: il loro uso prima dell'IVT è criterio di esclusione ([[DO-IT — Protocolo — v2.0]], p. 31, p. 34, p. 36).
- **Braccio di controllo**: BMT. Se i livelli plasmatici risultano poi normali, l'IVT non è raccomandata, ma può essere data se trattenerla è giudicato non etico (cross-over atteso <5%) ([[DO-IT — Protocolo — v2.0]], p. 34).
- **Dopo IVT**: PA <180/105 mmHg; niente antiaggreganti, anticoagulanti o altri trombolitici per 24 h ([[DO-IT — Protocolo — v2.0]], p. 26, p. 35–36). In caso di sICH, gestione secondo le linee guida: l'Appendice I richiamata manca nel PDF ([[DO-IT — Protocolo — v2.0]], p. 35, p. 58).
- **Farmaco**: commerciale, dalla farmacia ospedaliera, rimborsato da Boehringer Ingelheim; il farmaco usato va conservato per ispezione dove la legge lo richiede ([[DO-IT — Protocolo — v2.0]], p. 19, p. 34, p. 36). Il foglio del team aggiunge: usare la medicazione del frigo-ensayos e non buttare le fiale ([[Esquema ensayos — septiembre 2026]]).
- **Esami pre-randomizzazione**: esami di routine (standard of care), incluso il test di gravidanza; nelle donne in età fertile il test negativo va confermato prima della randomizzazione ([[DO-IT — Protocolo — v2.0]], p. 13, p. 40).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| V0 Screening e randomizzazione | giorno 0 | criteri, anamnesi e dettagli del DOAC, esami con test di gravidanza, NIHSS, mRS pre, TC o RM, conferma del medico indipendente, randomizzazione | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 40) |
| V1 Basale | giorno 0 | IVT (braccio sperimentale), MT secondo lo standard, AESI e SAE | ([[DO-IT — Protocolo — v2.0]], p. 40) |
| V2 | 24 ±12 h | TC o RM, NIHSS, farmaci, AESI e SAE | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 40) |
| V3 | 7–10 giorni o dimissione | NIHSS, mRS, consenso post hoc, risorse alla dimissione | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 41) |
| V4 | 90 giorni ±2 settimane | mRS ed EuroQol in cieco, NIHSS, SAE; in presenza quando possibile, altrimenti telefonica | ([[DO-IT — Protocolo — v2.0]], p. 13, p. 41) |

## Consenso
- **Protocollo**: consenso differito ("deferred consent") in base all'art. 35 del Regolamento UE 536/2014, quando il paziente non può consentire, non è possibile raggiungere un LAR entro la finestra e non ci sono obiezioni note. Consenso post hoc del LAR o del paziente appena possibile, con verifica almeno ogni 24 h ([[DO-IT — Protocolo — v2.0]], p. 19–20). Vedi [[Consentimiento diferido]].
- **Spagna (Appendix ICF Spain V1.3)**: per l'inclusione è **obbligatorio il consenso verbale telefonico del familiare/LAR**, documentato in cartella (nome, documento, parentela), seguito dal consenso scritto del rappresentante legale. Poi consenso post hoc del paziente durante il ricovero o alla visita 3; altrimenti tentativi mensili; alla visita 4 consenso del paziente anche se il familiare aveva già firmato ([[DO-IT — CI — V1.3]], p. 1–3).
- **Testimone imparziale**: se il paziente non può scrivere ([[DO-IT — CI — V1.3]], p. 1).
- **Lingue**: in Drive non c'è il foglio informativo per il paziente né in castellano né in catalano; c'è solo l'appendice procedurale in inglese.

> [!warning] Contraddizione
> Foglio [[Esquema ensayos — septiembre 2026]]: CI "escrito/diferido". Appendice spagnola: per includere serve **sempre** almeno il consenso verbale telefonico del familiare/LAR ([[DO-IT — CI — V1.3]], p. 1). L'inclusione senza alcun contatto, ammessa dal protocollo generale ([[DO-IT — Protocolo — v2.0]], p. 19), non è prevista in Spagna.

## Co-arruolamento
- Il protocollo non elenca studi compatibili o incompatibili. Nella stima del reclutamento si assume che il 90% dei pazienti non si sovrapponga a "ongoing competing trials that do not allow co-enrollment" ([[DO-IT — Protocolo — v2.0]], p. 32).
- Non riportato nel documento: un divieto esplicito di partecipare ad altri studi.

## Divergenze con EnsApp
> [!done] Correzioni applicate all'app il 2026-10-20 (commit `9895f0a`)
> - ✅ 1 nuova domanda "Sarebbe candidato a IVT se non fosse per il DOAC?" (compare se DOAC sì e IVT non eleggibile)
> - ✅ 3 la domanda sul DOAC include "ora dell'ultima dose ignota"
> - ✅ 4 randomizzazione entro 4 h 15 min · ✅ 5 trial ischemici mai proposti per un'emorragia
> - ✅ 11–14 testi: consenso differito, visite, esami, imaging, tetto del 20% per la EVT, livelli del DOAC
> - restano aperti 2 (DWI-FLAIR: il foglio dice "wake-up excluidos", domanda al team), 6–10
> - ✅ (dd2f49f) antagonizzazione del DOAC prevista o iniziata esclude (excl. 2), nuova domanda
> [!done] Correzioni applicate all'app il 2026-10-19 (commit `ac10c24`)
> - ✅ nome 'DO-IT' risolto: stato e colonna del foglio dati nella registrazione rapida

Confronto con:
- `src/lib/domain/trials-info.ts:285-300`;
- `src/lib/domain/acute-rules.ts:303-310` (`doit()`);
- `src/lib/domain/acute-reasons.ts:189-196` (`reasonDoit()`);
- interfaccia: `src/routes/PreImaging.svelte:156-158` (DOAC), `src/routes/PostImaging.svelte:155-159` (candidato IVT), `src/routes/PreResult.svelte:51-66` (avviso DOAC), `src/lib/i18n/es.ts:114`, `:126`, `:145`.

Verificato il 2026-10-19 (commit `7818276`).

> [!success] Coincide
> - Stato attivo come il foglio (`trials-info.ts:286`; `isTrialOpen()` `:410-413`);
> - età ≥18 (`acute-rules.ts:305`), senza limite superiore;
> - DOAC richiesto (`:307`) e indicazione all'IVT richiesta (`:308`);
> - nessuna soglia di NIHSS, mRS o ASPECTS (`trials-info.ts:288`), come nel protocollo;
> - la trombectomia non esclude (`trials-info.ts:292` "Optional");
> - testi di categoria e intervento (`trials-info.ts:287`, `:294`) e controindicazioni elencate (`:297`).

- [ ] **[FN] 1. La domanda "Candidato a trombolisi (IVT)?" esclude proprio i pazienti dello studio.**
> [!warning] Contraddizione
> Protocollo: I2 "AIS eligible to receive intravenous alteplase/tenecteplase as per standard of care…" ed E1 "Contra-indications to IVT … **with the exception of recent DOAC intake**" ([[DO-IT — Protocolo — v2.0]], p. 31). Secondo le linee guida il DOAC <48 h è una controindicazione all'IVT ([[DO-IT — Protocolo — v2.0]], p. 21).
> App: `doit()` richiede `ivtCandidate === "eligible"` (`acute-rules.ts:308`); la domanda è "Candidato a trombolisi (IVT)?" senza precisare "a parte il DOAC" (`PostImaging.svelte:158`; `es.ts:145`). Un medico che risponde secondo lo standard dirà "No elegible" a un paziente in DOAC, e DO-IT non comparirà mai. È il falso negativo più probabile.

- [ ] **[FN] 2. La via "esordio ignoto con mismatch DWI-FLAIR" non è prevista.**
> [!warning] Contraddizione
> Protocollo, I4 seconda opzione: RM con mismatch DWI-FLAIR e trattamento entro 4,5 h "of symptom recognition (e.g., awakening)" ([[DO-IT — Protocolo — v2.0]], p. 31).
> App: `input.ltsw <= 4.5` (`acute-rules.ts:306`), con `ltsw` calcolato dall'ultima volta visto bene (`stores/patient.ts:82-86`). Il flag `wakeupStroke` non entra in `doit()`. Un ictus al risveglio con LKW >4,5 h e mismatch DWI-FLAIR risulta non eleggibile.
> Il foglio dice però "wake-up excluidos" ([[Esquema ensayos — septiembre 2026]]): se è una scelta locale (ad esempio per la disponibilità della RM), va documentata; altrimenti è un falso negativo.

- [ ] **[FN] 3. La domanda sul DOAC non copre "ora dell'ultima dose ignota".**
> [!warning] Contraddizione
> Protocollo, I3: "… or patient with an ongoing prescription of DOAC but exact time point of last intake is unknown" ([[DO-IT — Protocolo — v2.0]], p. 31).
> App: "DOAC (NOAC) en las 48h previas?" (`es.ts:114`; `it.ts:115`; `PreImaging.svelte:157`), etichetta "DOAC nelle 48h" (`acute-reasons.ts:193`), nota "DOAC in previous 48h" (`trials-info.ts:296`). Chi non sa quando il paziente ha preso l'ultima dose può rispondere "No".

- [ ] **[FP] 4. Finestra: l'app accetta fino a 4,5 h, ma si randomizza entro 4 h 15 min.**
> [!warning] Contraddizione
> Protocollo: "randomized within 4 hours 15 minutes and treated within 4 hours 30 minutes of last known well time" (p. 31); "Randomization has to be performed within 4 hours and 15 minutes" (p. 40) ([[DO-IT — Protocolo — v2.0]]).
> App: `ltsw <= 4.5` (`acute-rules.ts:306`; `acute-reasons.ts:192`; `trials-info.ts:288` "<= 4.5 h"). Fra 4 h 15 min e 4 h 30 min il paziente risulta eleggibile ma non è randomizzabile. Inoltre `ltsw` è misurato quando si usa l'app, prima della randomizzazione.

- [ ] **[FP] 5. Stato residuo con l'ictus emorragico.**
> `doit()` non controlla `strokeType` (`acute-rules.ts:303-310`), e `ivtCandidate` resta in `postData` anche se si passa da "ischemico" a "emorragico" (`PostImaging.svelte:66-68`). Se si compila prima come ischemico candidato all'IVT e poi si cambia tipo, DO-IT resta nell'elenco (`Summary.svelte:34`, `:47-49`). Caso limite che riguarda anche altri studi.

- [ ] **[NC] 6. Deficit disabilitante non chiesto.**
> Protocollo, I2: "disabling deficit according to the judgement of the treating physician" ([[DO-IT — Protocolo — v2.0]], p. 31); motivazione al §3.8 (p. 26). App: nessuna condizione (`acute-rules.ts:303-310`). Un ictus lieve non disabilitante candidato all'IVT risulterebbe eleggibile; in pratica il filtro passa per la risposta "candidato IVT", che di solito non include i non disabilitanti.

- [ ] **[NC] 7. Antagonizzazione prevista o iniziata (E2) non verificata.**
> Protocollo: E2, idarucizumab, andexanet, PCC, FFP; acido tranexamico escluso dalla definizione ([[DO-IT — Protocolo — v2.0]], p. 31). App: citata solo nel testo (`trials-info.ts:297`), non chiesta né controllata.

- [ ] **[NC] 8. Gravidanza (E3) e allattamento non verificati.**
> Protocollo: E3 (p. 31–32), test negativo prima della randomizzazione nelle donne in età fertile (p. 40); allattamento solo nella sinossi (p. 8) ([[DO-IT — Protocolo — v2.0]]). App: solo testo (`trials-info.ts:297`).

- [ ] **[NC] 9. Tetto del 20% per la trombectomia (E5).**
> Protocollo: raggiunto il 20% di pazienti con MT prevista, si escludono i candidati a trattamento endovascolare ([[DO-IT — Protocolo — v2.0]], p. 32). App: "Optional (not required)." (`trials-info.ts:292`), senza menzione del tetto né modo di sapere se è stato raggiunto.

- [ ] **[NC] 10. Livelli plasmatici del DOAC.**
> Protocollo: non sono criterio; si attendono solo con test calibrato in <30 min, dubbio clinico e ultima dose non nelle 2 h prima del prelievo; con attività non misurabile non si arruola ([[DO-IT — Protocolo — v2.0]], p. 31). App: l'avviso generico "Realizar CTA torácica y niveles del fármaco." (`PreResult.svelte:51-66`; `es.ts:126`) non distingue il caso DO-IT; attendere i livelli in tutti i pazienti può far uscire dalla finestra.

- [ ] **[TXT] 11. Consenso.**
> Protocollo: consenso differito ([[DO-IT — Protocolo — v2.0]], p. 19–20). Spagna: consenso verbale telefonico del familiare/LAR obbligatorio per l'inclusione, poi firma del rappresentante e consenso post hoc del paziente ([[DO-IT — CI — V1.3]], p. 1–2). App: "Per local practice." (`trials-info.ts:289`).

- [ ] **[TXT] 12. Visite assenti.**
> Protocollo: 24 ±12 h, 7–10 giorni o dimissione, 90 giorni ±2 settimane (in presenza quando possibile, altrimenti telefonica) ([[DO-IT — Protocolo — v2.0]], p. 13, p. 40–41). App: `visits: null` (`trials-info.ts:299`).

- [ ] **[TXT] 13. Esami pre-randomizzazione.**
> Protocollo: esami di routine con test di gravidanza allo screening; test negativo prima della randomizzazione nelle donne in età fertile ([[DO-IT — Protocolo — v2.0]], p. 13, p. 40). App: `preEvtLabs: "No."` (`trials-info.ts:293`), come il foglio.

- [ ] **[TXT] 14. Imaging e finestra nel testo informativo.**
> Protocollo: TC o RM; RM con mismatch DWI-FLAIR per l'esordio ignoto; TC o RM di controllo a 24 ±12 h ([[DO-IT — Protocolo — v2.0]], p. 13, p. 31, p. 40). App: "Ischemic stroke pathway." (`trials-info.ts:290`) e "LTSW <=4.5h" (`:296`), senza la randomizzazione entro 4 h 15 min né la via DWI-FLAIR.

> [!note] Link di randomizzazione
> Il protocollo usa secuTrial (CTU Bern) ([[DO-IT — Protocolo — v2.0]], p. 32). `randomizationLinks` (`trials-info.ts:357`) non ha una voce per DOIT: non è una divergenza, solo un'assenza.

## Problemi documentali
- **Descrizione dello studio**: nella richiesta di ingestione DO-IT era descritto come "BMT vs BMT + trombolisi EV nell'ictus lieve/non disabilitante". I documenti dicono il contrario: pazienti in DOAC con deficit **disabilitante** ([[DO-IT — Protocolo — v2.0]], p. 1, p. 26, p. 31).
- **Foglio del team**: "wake-up excluidos" contro la via DWI-FLAIR dell'I4 ([[DO-IT — Protocolo — v2.0]], p. 31); "analítica pre: no" contro esami e test di gravidanza allo screening (p. 13, p. 40).
- **Tempo di riferimento**: LKW (p. 8, p. 31) contro "symptom onset or awakening" (p. 29) e "symptom-onset" (p. 40); il flow chart parte da "Stroke onset" (p. 37).
- **Allattamento**: escluso nella sinossi (p. 8) e nella sinossi spagnola (p. 2), assente nell'E3 del §7.1.
- **Appendice I** (gestione della sICH) annunciata ma vuota (p. 35, p. 58).
- **CI**: in Drive c'è solo l'appendice procedurale spagnola (in inglese), non il foglio informativo e il modulo per il paziente.
- **Sinossi spagnola V1.1** (08-12-2025), anteriore al protocollo v2.0: "N= ~100" contro 906 pazienti; "última hora de pozo conocida" (traduzione errata di "last known well") ([[DO-IT — Sinopsis — V1.1]], p. 2).
- **Date dei file**: i nomi in Drive dicono 2026-06-30, i documenti 01-01-2026 (protocollo, CI) e 08-12-2025 (sinossi).
- **Incoerenze minori del protocollo**: PA "180-185/105" contro "180/105"; divieto di tenecteplasa a "0.4 mg/kg" contro ">0.25 mg/kg"; mRS a 90 giorni "after admission" contro "after randomization"; centri "fifty to one hundred" contro "about 100" ([[DO-IT — Protocolo — v2.0]], p. 9, p. 24–27, p. 32, p. 35–38).

## Fonti
- [[DO-IT — Protocolo — v2.0]]
- [[DO-IT — Sinopsis — V1.1]]
- [[DO-IT — CI — V1.3]]
- [[DO-IT — Cambios — v1.0 a v2.0]]
- [[Esquema ensayos — septiembre 2026]] (stato, note operative)
