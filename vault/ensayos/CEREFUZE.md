---
tipo: ensayo
estudio: CEREFUZE
alias: ["Cerefuze Neurovascular Reperfusion System", "FIHP-001", "Venous Blood Conditioning"]
estado_app: no está en la app
clave_app: ""
categoria: dispositivo
fase: "first-in-human feasibility (indagine clinica su dispositivo, ISO 14155 / MDR)"
promotor: "non indicato nel protocollo (intestazione Cerefuze Medical); il CI indica VHIR – FlowCat Lab"
registro: []
protocolo_vigente: "FIHP-001 Rev 01, firmato il 15-08-2026 (nome del file: 2026-09)"
ci_vigente: "v1.1, 17-09-2026 (paziente e familiare/rappresentante; nome del file: V1)"
drive_carpeta: "https://drive.google.com/drive/folders/1Df2M41_2N_nEG4sWnesgrvFCrC3hiVDZ"
fuentes: ["[[CEREFUZE — Protocolo — Rev 01]]", "[[CEREFUZE — CI paciente — V1.1]]", "[[CEREFUZE — CI familiar — V1.1]]"]
actualizado: 2026-10-19
---
# CEREFUZE

> [!summary] In breve
> Studio first-in-human, a braccio singolo, monocentrico (Vall d'Hebron), su **5 pazienti**. Valuta la sicurezza del sistema Cerefuze: per 30 minuti, subito dopo una trombectomia riuscita, si reinfonde nel territorio riperfuso sangue venoso autologo condizionato (gas, pH, calcio chelato con citrato, osmolarità), attraverso il catetere guida a palloncino. Obiettivo: ridurre il danno da riperfusione ([[CEREFUZE — Protocolo — Rev 01]], p. 4, p. 6–7). Si includono pazienti con occlusione di ICA intracranica, M1 o M2, NIHSS >12, ASPECTS 5–10, mRS pre 0–1, puntura arteriosa entro 24 h dal LKW e mTICI 2a–3 a fine procedura (p. 4–5).

> [!warning] Stato
> **Foglio "Esquema ensayos"**: lo studio **non compare** (non nel foglio).
> **App**: assente da `src/lib/domain/trials-info.ts`. **Drive**: cartella "PENDIENTES ABRIR".
> Nessun documento indica la data di apertura. Il CI dice che lo studio è "aprobado por un Comité de Ética" ([[CEREFUZE — CI paciente — V1.1]], p. 2).

## Disegno
- **Tipo**: prospettico, braccio singolo, monocentrico, first-in-human, di fattibilità; open-label, non randomizzato, senza controllo; nessuna escalation di dose (p. 4).
- **Numerosità**: 5 soggetti; statistica solo descrittiva (p. 4, p. 12).
- **Endpoint primario (sicurezza)**: composito entro 90 giorni di sICH (ECASS III), eventi avversi gravi legati al dispositivo, mortalità per tutte le cause (p. 3).
- **Secondari**: fattibilità (uso riuscito, completamento della terapia, malfunzionamenti); NIHSS a 24 h e alla dimissione o giorno 5; mRS a 90 giorni; volume dell'infarto a 24–48 h, trasformazione emorragica, edema, TICI finale; calcio, lattato e sodio (p. 3–4).
- **Sicurezza**: un DSMB indipendente rivede ogni paziente prima di approvare il successivo (p. 10–11). Fonte per tutto: [[CEREFUZE — Protocolo — Rev 01]].

## Popolazione e finestra
| Parametro | Valore | Fonte |
|---|---|---|
| Finestra | Puntura arteriosa per la trombectomia entro 24 h dal LKW; esordio ≤24 h "or imaging-based selection"; Cerefuze iniziabile entro **150 min dall'imaging pre-trattamento** (esclusione 9) | ([[CEREFUZE — Protocolo — Rev 01]], p. 5) |
| Età | 18–89 anni | (p. 4) |
| mRS pre | 0–1 | (p. 5) |
| NIHSS | **>12** al basale, senza miglioramento immediato dopo l'endovascolare; esclusi coma o coscienza ridotta (NIHSS 1a >1) | (p. 5) |
| Imaging / ASPECTS / core | ASPECTS 5–10; emorragia esclusa sia alla TC pre-trombectomia sia alla **cone-beam CT** subito dopo l'EVT | (p. 4–5) |
| Occlusione | ICA intracranica, M1 o M2 sull'angiografia pre-trombectomia (§4.1 dice ICA cervicale o intracranica e M1; §5.2 aggiunge M2) | (p. 4–5, p. 7) |
| Riperfusione | mTICI 2a–3 all'angiografia finale (§4.1 dice mTICI ≥2b) | (p. 4–5) |

## Criteri di inclusione
Testo originale (Tabella 2, [[CEREFUZE — Protocolo — Rev 01]], p. 4–5; criteri non numerati nel protocollo, numerazione nostra):

1. Age 18 to 89 (p. 4)
2. Informed signed consent obtained from patient or legally authorized representative (p. 4)
3. Clinical symptoms consistent with acute ischemic stroke (p. 5)
4. Pre-stroke mRS score 0-1 (p. 5)
5. NIHSS > 12 at baseline with no immediate improvement after endovascular treatment (p. 5)
6. Alberta Stroke Program Early CT Score (ASPECTS) score 5-10 (p. 5)
7. IV tissue plasminogen activator (tPA) or Tenecteplase (TNK) may be administered within 4.5h of last known well (LKW), if patient eligible (p. 5)
8. MT treatment performed with arterial puncture within 24h of LKW. (p. 5)
9. Pre-MT catheter angiogram shows target occlusion in intracranial ICA, M1 MCA, or M2 MCA (p. 5)
10. End of MT catheter angiogram shows achievement of moderate-to-complete reperfusion (modified Treatment in Cerebral Ischemia score or mTICI 2a-3) (p. 5)
11. Symptom onset ≤24 hours or imaging-based selection (p. 5)
12. Eligible for mechanical thrombectomy (p. 5)
13. Cone-beam CT performed immediately after EVT does not show intracranial haemorrhage (p. 5)

**Sintesi**: adulto fino a 89 anni, autonomo (mRS 0–1), ictus grave (NIHSS >12) che non migliora subito dopo la trombectomia, ASPECTS 5–10, occlusione di ICA intracranica, M1 o M2, puntura entro 24 h dal LKW e riperfusione almeno mTICI 2a a fine procedura, senza emorragia alla cone-beam CT. La trombolisi e.v. entro 4,5 h è ammessa se indicata. L'eleggibilità si chiude **in sala, dopo la trombectomia**.

## Criteri di esclusione
Testo originale (Tabella 2, [[CEREFUZE — Protocolo — Rev 01]], p. 4–5; numerazione nostra):

1. Pre-MT CT shows acute intracranial haemorrhage. (p. 4)
2. Previous intracranial haemorrhage, AVM, neoplasm (except small meningioma), or vascular stent-implant (p. 4)
3. Coma or reduced level of consciousness prior to MT (NIHSS 1A>1) (p. 5)
4. Seizure between LKW and time of potential enrolment (p. 5)
5. Severe contrast allergy or absolute contraindication to iodinated contrast. (p. 5)
6. Hypersensitivity to cold, i.e., history of cold- sensitive antibodies, Raynaud syndrome, or hepatitis C (p. 5)
7. Haematocrit <33% (p. 5)
8. Severe known renal impairment, i.e., requires renal replacement therapy (dialysis). (p. 5)
9. Post-reperfusion investigational therapy cannot be started within 150 min following pre- treatment CT or MR imaging (p. 5)
10. Presumed septic embolism, suspicion of bacterial endocarditis. (p. 5)
11. Known pregnancy (in people with child-bearing potential) (p. 5)
12. Body weight < 40kg (p. 5)
13. No extracranial or intracranial stenting were implanted during EVT (p. 5)
14. Patient not willing and able to participate in follow-up visits to day 90. (p. 5)
15. Life expectancy <6 months due to pre-existing conditions such as severe heart or renal failure, cancer, etc. (p. 5)
16. Currently or within past 30 days participating in another investigational treatment study (p. 5)
17. Known coagulopathy (p. 5)
18. Known calcium metabolism disorders (p. 5)

**Sintesi**: oltre a emorragia e controindicazioni al contrasto, sono esclusi:
- precedenti di emorragia intracranica, MAV, neoplasia (salvo piccolo meningioma) o stent vascolare;
- coma o coscienza ridotta (NIHSS 1a >1), crisi dopo il LKW;
- ematocrito <33%, dialisi, peso <40 kg, gravidanza nota, coagulopatia nota, disturbi noti del metabolismo del calcio;
- "ipersensibilità al freddo" (criterio ereditato da HYBERNIA);
- embolia settica o endocardite sospette; aspettativa di vita <6 mesi; impossibilità di fare il follow-up;
- partecipazione attuale o negli ultimi 30 giorni a un altro studio con trattamento sperimentale;
- impossibilità di iniziare Cerefuze entro 150 min dall'imaging pre-trattamento.
- L'esclusione 13 sugli stent è scritta al contrario: vedi Problemi documentali.

## Intervento e procedure
- **Dispositivo**: sangue venoso prelevato con cannula da 12 Fr dalla vena femorale; ossigenatore a fibre cave con scambiatore di calore; reinfusione pulsatile attraverso il **catetere guida a palloncino** della trombectomia; flusso 200 (± 50) mL/min per **30 minuti** ([[CEREFUZE — Protocolo — Rev 01]], p. 6–7).
- **Agenti aggiunti**: citrato di sodio (147 mg del diidrato nei primi 30 s; target di Ca++ <0,5 mmol/L) e salina ipertonica al 7,5% (14,6 mL nei primi 5 min). Target: pH ≤7,25, osmolalità >320 mosmol/L, pCO2 50+ mmHg, PA media locale 120+ mmHg (p. 6, p. 8–9).
- **Trombolisi**: ammessa entro 4,5 h dal LKW se indicata (inclusione 7, p. 5).
- **Trombectomia**: obbligatoria, standard secondo il protocollo dell'ospedale; poi verifica della riperfusione e cone-beam CT prima di Cerefuze (p. 6).
- **Monitoraggio**: ECG continuo; calcio basale e post-procedura, elettroliti, INR e aPTT; ricovero post-procedura in terapia intensiva o semi-intensiva (p. 9–10; [[CEREFUZE — CI paciente — V1.1]], p. 6).

## Visite e follow-up
| Visita | Momento | Contenuto principale | Fonte |
|---|---|---|---|
| Basale | prima della procedura | anamnesi, esami, criteri, consenso, NIHSS, mRS, NCCT/CTA/CTP (facoltativa) | ([[CEREFUZE — Protocolo — Rev 01]], p. 6, p. 11) |
| Procedura | giorno 0 | angiografia, TICI (basale, primo passaggio, finale), cone-beam CT, 30 min di Cerefuze | (p. 6, p. 11) |
| 24 h | 16–36 h | NIHSS, imaging (TC o RM; RM nella Tabella 8), classificazione ICH | (p. 6, p. 11) |
| Dimissione | giorno 5 (+1) o dimissione | NIHSS, mRS, destinazione | (p. 11) |
| 30 giorni | +7 giorni | sicurezza, mRS | (p. 6, p. 11) |
| 90 giorni | +30 giorni | mRS, EQ-5D-5L, eventi avversi | (p. 6, p. 11) |

Il CI dice che "algunas visitas podrán realizarse de forma telefónica" senza precisare quali ([[CEREFUZE — CI paciente — V1.1]], p. 5). Le X del calendario non sono attribuibili con certezza dall'estrazione.

## Consenso
- **Tipo**: scritto, del paziente o del rappresentante legale ([[CEREFUZE — Protocolo — Rev 01]], p. 4). Il protocollo prevede procedure "emergency and proxy consent" approvate dal comitato etico (p. 13), ma i CI in Drive contengono solo le firme del paziente e del familiare o rappresentante ([[CEREFUZE — CI paciente — V1.1]], p. 8–9; [[CEREFUZE — CI familiar — V1.1]], p. 8).
- **Orale o telefonico**: non riportato nei documenti.
- **Lingue**: solo castellano.

## Co-arruolamento
- Esclusi i pazienti che partecipano, o hanno partecipato negli ultimi 30 giorni, a un altro studio con trattamento sperimentale (esclusione 16, [[CEREFUZE — Protocolo — Rev 01]], p. 5). Di fatto incompatibile con gli studi acuti con farmaco o dispositivo sperimentale; con [[HYBERNIA]] condivide la stessa popolazione post-trombectomia.

## Proposta per EnsApp
Lo studio non è in app. Verificato il 2026-10-19 su `src/lib/domain/acute-rules.ts`, `src/routes/PreImaging.svelte`, `src/routes/PostImaging.svelte`, `src/lib/stores/patient.ts`.

**Campi esistenti che basterebbero per una pre-selezione** (la scelta definitiva si fa solo in sala, dopo la trombectomia):
- età 18–89 → `age` (`PreImaging.svelte:85-91`; [[CEREFUZE — Protocolo — Rev 01]], p. 4);
- mRS pre 0–1 → `premrs` (`PreImaging.svelte:98-102`; p. 5);
- NIHSS >12 → `nihss` (`PreImaging.svelte:93-96`; p. 5);
- puntura entro 24 h dal LKW → `ltsw` (`PreImaging.svelte:113`), con il limite che `ltsw` sono le ore al momento della valutazione, non alla puntura (p. 5);
- candidato a trombectomia → `candidate === "eligible"`, da cui `lvo` (`PostImaging.svelte:27`, `:156`) (inclusione 12, p. 5);
- vasi ICA intracranica, M1, M2 → `targetVessels` (`PostImaging.svelte:169`; codici `ica-intracranial`, `ica-terminal`, `m1`, `m2-proxdom`, `m2-any`). Il flag già esistente `vessels.hybernia` (`acute-rules.ts:100-105`) copre esattamente questi vasi (p. 5);
- ASPECTS 5–10 → `aspects` (`PostImaging.svelte:177`), come `aspects > 4` in `hybernia()` (`acute-rules.ts:249-250`) (p. 5).

In pratica `hybernia()` (`acute-rules.ts:239-252`) è già quasi la regola di CEREFUZE. Basterebbe cambiare il NIHSS (>12 invece di ≥6) e aggiungere un limite superiore all'ASPECTS (≤10, implicito).

**Campi mancanti**:
- **mTICI finale 2a–3** e **cone-beam CT senza emorragia** dopo l'EVT: sono il cuore dell'eleggibilità e l'app non ha dati post-procedura (p. 5–6);
- assenza di miglioramento immediato dopo l'EVT e NIHSS 1a ≤1 (p. 5);
- stent extra o intracranico impiantato durante l'EVT (esclusione 13, scritta al contrario, p. 5);
- avvio entro 150 min dall'imaging pre-trattamento (p. 5);
- ematocrito, peso, dialisi, coagulopatia, metabolismo del calcio, crisi all'esordio, ipersensibilità al freddo (p. 4–5).

## Problemi documentali
- **Criteri ricopiati da HYBERNIA** (15 esclusioni su 18 identiche), compresa l'"ipersensibilità al freddo" ([[CEREFUZE — Protocolo — Rev 01]], p. 5; [[HYBERNIA — Protocolo — V1.1]], p. 20–21).
- **Esclusione 13 formulata al contrario**: "No extracranial or intracranial stenting were implanted during EVT" (p. 5).

> [!warning] Contraddizione — soglia di riperfusione
> §4.1: "following EVT (mTICI ≥2b)" (p. 4). Inclusione 10: "mTICI 2a-3" (p. 5). Flusso: "TICI 2 2a" (p. 6). CI: "recanalización arterial parcial o completa" ([[CEREFUZE — CI paciente — V1.1]], p. 5).

> [!warning] Contraddizione — vasi ammessi
> §4.1: ICA "(either cervical or intracranial) or the M1 segment" (p. 4). Inclusione 9: "intracranial ICA, M1 MCA, or M2 MCA" (p. 5). §5.2: ICA cervicale o intracranica, "M1 or M2" (p. 7).

> [!warning] Contraddizione — promotore
> Protocollo: intestazione Cerefuze Medical, promotore non nominato, CRO Nora Health "on behalf of the Sponsor" (p. 2, p. 14). CI: "Promotor: Vall d'Hebron Institut de Recerca (VHIR) – FlowCat Lab" ([[CEREFUZE — CI paciente — V1.1]], p. 1).

- **CI e protocollo**: il CI dice che i dati "no se compartirán con terceros" e che non si attendono complicanze del sistema; il protocollo prevede accesso di promotore, CRO e comitati, ed elenca rischi specifici (ipocalcemia, edema, embolia gassosa, lesione vascolare) (p. 9, p. 14; [[CEREFUZE — CI paciente — V1.1]], p. 5–7).
- **"Randomization"** nel calendario di uno studio a braccio singolo (p. 11).
- **Refusi**: "7500 mL/min" (p. 6), citrato "capped (mmol/kg)" senza valore (p. 6), "NIHSS improvement 24 points" (p. 3), "ISO 14115:2019" (p. 10), "ReGenerate system" (p. 7).
- **Frontespizio illeggibile** (p. 1); nessun numero di registro; versione e data deducibili solo da intestazione e firma digitale (15-08-2026).
- PDF di 7 MB non scaricato: letto con `read_file_content`, testo completo delle pp. 2–14; tabelle rimescolate (vedi la nota fonte).

## Fonti
- [[CEREFUZE — Protocolo — Rev 01]]
- [[CEREFUZE — CI paciente — V1.1]]
- [[CEREFUZE — CI familiar — V1.1]]
- [[Esquema ensayos — septiembre 2026]] (lo studio non vi compare)
