---
tipo: fuente
estudio: "[[WETRUST]]"
documento: Protocolo
version: "Rev. 09 (ID doc. XCY607-130512)"
fecha: 2025-09-15        # data della Rev. 09 nello storico revisioni (p. 14); il nome del file Drive dice "2026-02"
idioma: es
paginas: 130
drive_id: "1nlMyVXUFMQNkTXPgqo-qWSJnO_8LtAoR"
drive_url: "https://drive.google.com/file/d/1nlMyVXUFMQNkTXPgqo-qWSJnO_8LtAoR/view"
lectura: parcial
actualizado: 2026-10-19
---
# WETRUST — Protocolo — Rev 09

> [!warning] Lettura parziale: pp. 1–80 su 130
> - Il metodo previsto (`download_file_content` + `pdftotext -layout`) **non ha funzionato**: il PDF pesa 4 MB e la risposta in base64 ha superato il limite di dimensione del connettore Drive (connessione chiusa). Non è stato ritentato per non interrompere il connettore usato in parallelo da altri agenti.
> - È stato usato `read_file_content`, che si **interrompe in silenzio a p. 80** (fine §8.8.13, circa 305k caratteri). **Non lette le pp. 81–130**: §8.8.14–8.10 (resto degli endpoint esplorativi, sottogruppi, dati mancanti), §9 gestione dati, §10–13, **§14 processo di consenso informato (p. 88–89)**, §15 eventi avversi ed effetti avversi attesi (p. 90–96), §16 popolazione vulnerabile, §17 conclusione anticipata, §18 pubblicazione, §19 bibliografia, Appendici I–IV (sperimentatori e centri, ruoli, monitor, requisiti di notifica per paese).
> - Senza layout: le tabelle a più colonne (Tabella 3 p. 50–51, Tabella 5 p. 69, Tabella 6 p. 69–70) arrivano rimescolate; i valori riportati qui sono stati ricostruiti con cautela.
> - Le figure (1–20: flussi di lavoro, disegno, popolazioni, Figura 18 con le sedi di occlusione, metriche dei tempi) sono immagini e non sono leggibili; il testo delle Figure 6–7 e 15–16 è invece estratto.
> - Il criterio di eleggibilità, gli endpoint, la popolazione target e la statistica principale sono nelle pagine lette.
>
> File in Drive (copia ordinata): "WETRUST — Protocolo — Rev 09 — 2026-02.pdf". Nell'originale si chiama "Protocolo actualizado.pdf" (stessa dimensione, caricato l'11-02-2026).

## Indice del documento
| Sezione | Pagina |
|---|---|
| Aprobación (frontespizio) | 1 |
| Historial de revisiones (Rev. 00–09) | 2–16 |
| Índice | 17–18 |
| 1. Introducción al documento (definizioni e abbreviazioni) | 19–21 |
| 2. Resumen (sinossi, con criteri di inclusione/esclusione p. 29–30) | 22–33 |
| 3. Descripción del dispositivo (Butterfly Reconstructor / SmartCT R3) | 34–37 |
| 4. Justificación del diseño (dati clinici CBCT, ANGIOCAT) | 37–49 |
| 5. Riesgos y beneficios | 49–54 |
| 6. Objetivos e hipótesis | 54–57 |
| 7. Diseño del estudio (7.1 disegno p. 57; 7.1.1 fase preliminare p. 58; 7.4.1 criteri p. 59–60; 7.4.3 numerosità p. 61; 7.5 procedure p. 61–64) | 57–65 |
| 8. Consideraciones estadísticas (8.1 popolazioni p. 66–68; 8.2–8.3 numerosità e interim p. 68–71; 8.7 obiettivo primario p. 72–73; 8.8 secondari p. 73–) | 65–84 (lette fino a p. 80) |
| 9–13. Dati, modifiche, deviazioni, dispositivi, conformità | 84–87 (non lette) |
| 14. Proceso de consentimiento informado (14.1 incapaci; 14.2 urgenza; 14.3 analfabeti) | 88–89 (non lette) |
| 15. Notificación de acontecimientos adversos | 90–96 (non lette) |
| 16–19. Vulnerabili, conclusione, pubblicazione, bibliografia | 96–100 (non lette) |
| Apéndices I–IV | 101–130 (non lette) |

## Punti chiave
- **Identificativi**: ID doc. XCY607-130512, Rev. 09; numero EUDAMED **CIV-20-12-035204** (p. 1). La Rev. 09 ha "corretto il numero CIV" del frontespizio (p. 14). NCT non riportato nelle pagine lette.
- **Promotore**: Philips Medical Systems Nederland B.V., Best (Paesi Bassi) (p. 1). Lo storico cita il cambio di CRO da Trium a QbD Group e di eCRF da Datatrak a Medidata (p. 16).
- **Titolo**: "Workflow Optimization to REduce Time to Endovascular Reperfusion for Ultra-fast Stroke Treatment" (WE-TRUST) (p. 1, p. 19).
- **Disegno**: studio sul flusso di lavoro dell'ictus, prospettico, multicentrico, randomizzato, controllato, in aperto, con valutazione in cieco e disegno adattativo (p. 22, p. 57). Randomizzazione 1:1 (p. 23, p. 57).
- **Bracci** (p. 23–24, p. 57):
  1. **DTAS** ([[Direct to angio]]): CBCT senza contrasto ([[Cone-beam CT]]) ricostruita con Butterfly Reconstructor o SmartCT R3 per escludere l'emorragia, poi CBCT-A, arteriografia/ASD o altro imaging per confermare l'occlusione; trombectomia nella stessa sala.
  2. **Convenzionale (controllo)**: TC/RM, angio-TC/angio-RM, perfusione secondo gli standard locali, poi trasferimento in sala angiografica per la TM. Si chiede di eseguire tutto l'imaging del braccio di controllo in un'unica sessione (p. 59).
  - Trombolisi in entrambi i bracci secondo le linee guida istituzionali e regionali (p. 23–24, p. 31, p. 61).
- **Dispositivo**: Butterfly Reconstructor R1.0 (in studio, non commercializzato) o SmartCT R3 (commercializzato, marcato CE, da usare solo nei paesi in cui è in commercio), installati sulla workstation Interventional Workspot e collegati a un angiografo Philips Allura Xper FD R8.1/R8.2 o Azurion R1.2/R2.1/R2.2 (p. 34–35, Tabella 1). La Rev. 09 ha introdotto SmartCT R3 (p. 14).
- **Randomizzazione**: all'arrivo in Pronto soccorso del centro comprensivo (CII), subito prima del triage d'imaging, cioè **prima** di conoscere l'occlusione (p. 24, p. 58). Strati: età (<70, ≥70); NIHSS (≤15 moderato, >15 grave); tempo (<3 h vs 3–6 h dall'esordio; ictus al risveglio con LSW <12 h); tipo di presentazione e trombolisi previa ("mother-ship" senza trombolisi; trasferito con trombolisi; trasferito senza trombolisi) (p. 58).
- **Pazienti "mother-ship"**: dal settembre 2023 si promuove l'arruolamento esclusivo di pazienti "mother-ship", definiti come pazienti **senza imaging di triage previo**; i trasferiti sono quelli con imaging previo (p. 15, p. 58).
- **Popolazione target** (analisi primaria di efficacia): randomizzati senza emorragia e con occlusione di grande vaso (OGV) confermata, trattati o no con TEV. OGV = occlusione (mTICI 0–1) della **ACI intracranica** (ACI distale o ACI-T, anche in tandem), del **segmento M1** (vaso che irrora >90% del territorio della ACM) o della **basilare**, con o senza occlusione/stenosi carotidea cervicale. **Escluse M2 (non dominante) o più distali**. Non sono nella popolazione target: effetto massa con shift della linea mediana, occlusioni in più territori vascolari, tumore intracranico (salvo piccolo meningioma). L'OGV è aggiudicata dal core lab in cieco (p. 67). La basilare è stata aggiunta nella Rev. 09 (p. 15).
- **Popolazione target modificata**: esclusi i pazienti trattati con trombolisi e.v. oltre 3 h dall'esordio/LSW (p. 67).
- **Endpoint primario**: distribuzione ordinale del [[mRS]] a 90 (±14) giorni nella popolazione target, valutato da un valutatore certificato in cieco con intervista strutturata RFA in presenza; se il paziente non può tornare, è preferibile una (video)chiamata a nessuna valutazione (p. 26–27, p. 72). Analisi con regressione logistica ordinale aggiustata per i fattori di stratificazione (p. 72).
- **Endpoint secondari** (gerarchici, solo se il primario è significativo): tempo porta-puntura arteriosa; tempo porta-riperfusione (eTICI ≥2b); mRS ordinale a 90 giorni nella popolazione randomizzata (p. 27, p. 73–74).
- **Sicurezza**: mortalità (anche correlata all'ictus) a 90 giorni; sICH a 24 (−12/+24) h secondo SITS-MOST modificata (PH2, ESA o EIV con peggioramento NIHSS ≥4 o morte), classificazione di Heidelberg da core lab; ICH asintomatica; emboli in territorio nuovo, perforazione e dissezione vascolare; effetti avversi e difetti del dispositivo (p. 27, p. 75–76). Per i pazienti fuori dalla popolazione target: tempo porta-diagnosi, diagnosi finale, dose di radiazioni, SAE da trombolisi o TM (p. 28, p. 77).
- **Esplorativi**: numerose metriche dei tempi; mRS alla dimissione o a 5–7 giorni; NIHSS basale, a 24 h, a 5–7 giorni e a 90 giorni; mRS ≤2; UW-mRS; volume dell'infarto a 24 h (core lab); risposta precoce (NIHSS 0–2 o miglioramento ≥8 a 24 h); eTICI finale (core lab); dose radiologica (p. 26, p. 28–29).
- **Numerosità**: 594 randomizzati (297 per braccio), 474 nella popolazione target (237 per braccio), 450 nella target modificata (225 per braccio). Si assume il 20% di pazienti senza OGV confermata e il 5% di differenza fra target e target modificata (p. 30, p. 61, p. 68). OR atteso 2,0 (dai dati ANGIOCAT), potenza 90%, alfa unilaterale 2,5%, mRS 0–2 atteso nel controllo 30% (p. 68–69).
- **Interim**: uno solo, al 50% della popolazione target (238 pazienti), con futilità non vincolante e possibile ricalcolo della numerosità fino a un massimo di 948 nella popolazione target (p. 68–70). Soglie unilaterali: 0,0125 all'interim, 0,0168 all'analisi finale (p. 69, p. 73).
- **Periodo di arruolamento previsto**: da giugno 2021 a **dicembre 2026** (66 mesi); durata complessiva circa 69,5 mesi (p. 30, p. 61).
- **Fase preliminare**: nei centri senza esperienza DTAS, almeno 2 pazienti "mother-ship" DTAS prima della fase randomizzata; il comitato direttivo decide il passaggio. Raccomandati porta-puntura <30 min e >30 pazienti/anno (p. 58). Il promotore monitora anche i tempi del braccio di controllo rispetto ai tempi storici del centro (p. 58–59).
- **Visite**: imaging TC/RM a 24 (−12/+24) h; dimissione o 5–7 giorni (mRS, NIHSS); 90 ±14 giorni (mRS in cieco). Dopo i 90 giorni il follow-up prosegue secondo la pratica clinica (p. 33, p. 60, p. 64).
- **Ritiro**: il paziente può ritirare il consenso in qualsiasi momento, tranne durante la sedazione (p. 61).
- **Dati di Vall d'Hebron citati nel razionale**: studio pilota DTAS (Ribo 2018), caso-controllo (Mendez 2018; Requena 2020) e RCT ANGIOCAT (Requena 2021: aOR 2,2 per lo spostamento del mRS; porta-puntura 18 vs 42 min) (p. 40–44).
- **ASPECTS**: nessun criterio ASPECTS. Il protocollo motiva che entro 6 h l'85–90% delle occlusioni prossimali ha ASPECTS ≥6, che la TM è considerata ragionevole anche con ASPECTS <6, e che si attende circa il 5% di core esteso (p. 37–38).

## Criteri (testuali)

### 7.4.1.1. Criterios de inclusión (p. 59)
1. El paciente tiene 18 años o más, o la edad legal para dar un consentimiento informado de acuerdo con las leyes locales o nacionales.
2. La puntuación NIHSS inicial obtenida antes de la aleatorización debe ser igual o mayor que 10 puntos.
3. Pacientes sin discapacidad funcional previa a ictus significativa (escala Rankin modificada de 0 a 2).
4. Pacientes con sospecha de accidente cerebrovascular isquémico agudo con tiempo estimado hasta la llegada al centro de ictus (centro de investigacion clínica que participa en el estudio) < 6 horas desde el inicio de los síntomas O; Ictus al despertar con un tiempo desde la última vez que se lo vio bien < 12 horas a la llegada al centro de ictus Y con síntomas identificados dentro de las 6 horas calculados también a la llegada al centro de ictus. El inicio de los síntomas se define como el momento en que se vio bien al paciente por última vez (Punto inicial - Baseline).
5. Consentimiento informado obtenido del paciente o de su representante legal designado (si se requiere por normativa local).
6. Unidad de angiografía disponible inmediatamente.
7. Equipo de tratamiento endovascular disponible inmediatamente (neurólogo, neurólogo intervencionista, anestesiólogo, personal de enfermería y técnicos de acuerdo con la práctica convencional local).

### 7.4.1.2. Criterios de exclusión (p. 59–60)
1. Diátesis hemorrágica, deficiencia del factor de coagulación o terapia oral con anticoagulantes conocida con un INR >3,0. (p. 59)
2. Recuento plaquetario inicial conocido <30 000/µl (p. 60)
3. Glucemia inicial <50 mg/dl (<2,78 mmol/l) (p. 60)
4. Para pacientes que reciban trombolisis: hipertensión grave sostenida (PAS >185 mmHg o PAD >110 mmHg). Nota: Si la presión arterial se puede reducir correctamente y mantenerse a un nivel aceptable con la medicación recomendada por las directrices de la AHA/ASA (incluidas infusiones i.v. antihipertensivas) [10], el paciente puede inscribirse en el estudio. (p. 60)
5. Pacientes procedentes de un centro de transferencia (centro de ictus primario) con una TC/RM cuya repetición no es necesaria en el centro de ictus integral según el criterio del médico o las prácticas locales (p. ej. TC/RM con menos de 90 minutos de antigüedad). (p. 60)
6. Pacientes en coma (puntuación de consciencia según NIHSS >1) definidos como con ausencia total de respuesta, que responden únicamente a reflejos o sin respuesta a reflejos (los pacientes intubados para traslado podrían aleatorizarse únicamente si se obtiene una puntuación NIHSS por parte de un neurólogo antes del traslado). (p. 60)
7. Pacientes con vómitos extremos (p. 60)
8. Pacientes extremadamente agitados (p. 60)
9. Convulsiones al comienzo del ictus que podrían evitar la obtención de una puntuación NIHSS inicial. (p. 60)
10. Enfermedad grave, avanzada o terminal con una esperanza de vida prevista de menos de un año. (p. 60)
11. Pacientes con aparición de ictus durante estancia hospitalaria. (p. 60)
12. Antecedentes de alergias potencialmente mortales (más que una erupción) al medio de contraste. (p. 60)
13. Vasculitis cerebral. (p. 60)
14. En los pacientes con enfermedad psiquiátrica o neurológica existente que podría confundir las evaluaciones neurológicas o funcionales la puntuación de la ERm inicial debe ser ≤2. Esto excluye a pacientes con demencia grave, que requieren asistencia constante en residencias con atención enfermera o que viven en sus domicilios, pero no realizan actividades cotidianas de manera totalmente independiente (ir al baño, vestirse, comer, cocinar y preparar comidas, etc.) (p. 60)
15. Improbable que esté disponible para seguimiento a los 90 días (por ejemplo, sin domicilio fijo, visitante de otro país). (p. 60)
16. Pacientes con estado clínico inestable que requieran soporte vital de emergencia. (p. 60)
17. Cualquier condición que, según el criterio del investigador, podría constituir un riesgo para el paciente si se inicia el tratamiento del estudio o que podría afectar a la participación del paciente en el estudio. (p. 60)
18. El paciente va a participar en un ensayo sobre un fármaco o un dispositivo que podría generar confusión durante el curso del estudio. (p. 60)
19. Mujeres en edad fértil que se conozca que están embarazadas en el momento del ingreso. (p. 60)
20. El paciente cumple alguno de los criterios de exclusión de acuerdo con las leyes nacionales vigentes (por ejemplo, edad, embarazo, lactancia). (p. 60)
21. El paciente es empleado de Philips o sus familiares residen con un empleado de Philips. (p. 60)

> [!note] Sinossi
> La sinossi (§2, "Criterios principales de inclusión/exclusión", p. 29–30) riporta gli stessi 7 criteri di inclusione e 21 di esclusione, con lo stesso testo. Fa fede §7.4.1.

## Note e anomalie
- **Lettura incompleta** (vedi sopra): in particolare manca §14 sul consenso (p. 88–89). Dallo storico revisioni si sa solo che la Rev. 06 ha spiegato "el intento de obtener consentimiento (verbal) antes de la inscripción" (p. 11) e che la Rev. 02 ha aggiornato il processo di consenso su indicazione della FDA (p. 10).
- **Data della revisione**: lo storico indica la Rev. 09 al 15 settembre 2025 (p. 14); il nome del file nella copia ordinata dice "2026-02", che corrisponde al caricamento in Drive (11-02-2026), non alla data del documento.
- **Finestra temporale incoerente fra sezioni**: l'inclusione 4 ammette l'ictus al risveglio con LSW <12 h (p. 59), ma la descrizione dei bracci parla ancora di imaging "en un plazo de 6 horas desde la última vez que se sintió bien" / "desde el inicio de los síntomas" (p. 23, p. 57). L'estensione a 12 h è stata aggiunta nella Rev. 09 (p. 15) senza aggiornare quel paragrafo.
- **Riferimento temporale**: la finestra si calcola **all'arrivo al centro** ("tiempo estimado hasta la llegada al centro de ictus"), non al momento della randomizzazione (p. 59).
- **Strati nella sinossi vs §7.1**: nella sinossi il NIHSS è "15 ictus moderado" (manca "≤") e il tempo è indicato come "UVSB"; in §7.1 "≤ 15" e "IS" (p. 24 vs p. 58). La sinossi dice anche "con administración previa de trombolíticos en el centro de ictus integral" dove §7.1 dice "centro de ictus primario" (p. 24 vs p. 58): refuso.
- **Coma definito con il NIHSS**, non con la GCS: esclusione 6, "puntuación de consciencia según NIHSS >1" (p. 60).
- **Esclusione 14 ridondante** con l'inclusione 3 (mRS ≤2) (p. 59–60).
- **Basilare aggiunta ma non ovunque**: l'imputazione dei dati mancanti usa ancora la sede "ACI distal frente a ACI-T frente a ACM-M1", senza la basilare (p. 72).
- **Riferimento bibliografico incoerente**: la classificazione di Heidelberg è citata come [30] e come [51] (p. 27, p. 75–76).
- **Esclusione 5**: con la scelta "mother-ship" esclusiva dal 2023 e il criterio che esclude i trasferiti con imaging valido, in pratica si arruolano pazienti senza imaging previo (p. 15, p. 58, p. 60).
- **Dati personali omessi**: il frontespizio e lo storico contengono nomi di autori e approvatori del promotore; non riportati (non sono ruoli clinici pubblici).
