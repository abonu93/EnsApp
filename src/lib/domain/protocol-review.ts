// Revisione dei protocolli per il team (2026-11-12): cosa non torna tra
// protocolli, resumenes del team, foglio "Esquema ensayos", Drive e app.
// Fonte: revisione del Drive originale "Ensayos" del 2026-11-12 (vault/ e
// documento di revisione). I problemi trasversali (credenziali, registri,
// stato degli studi) sono stati tolti su richiesta del team.
//
// Testi nelle tre lingue dell'app. Ogni punto ha un id stabile: lo stato
// della revisione si salva per id (foglio "Review" dell'Apps Script).

import type { Locale } from "$lib/i18n";
import { GAS_URL } from "./sheet-payload";

export type ReviewSource = "app" | "sheet" | "summary" | "drive" | "registry";
export type ReviewSeverity = "high" | "medium" | "low" | "note";
export type ReviewText = Readonly<Record<Locale, string>>;

export interface ReviewItem {
  id: string;
  /** Nome dello studio come nel catalogo (o un gruppo, es. "Nuevos estudios"). */
  trial: string;
  source: ReviewSource;
  severity: ReviewSeverity;
  /** Cosa non torna. */
  finding: ReviewText;
  /** Cosa dice il protocollo, o cosa verificare. */
  protocol?: ReviewText;
}

export const REVIEW_DATE = "2026-11-12";

export const REVIEW_ITEMS: readonly ReviewItem[] = [
  {
    id: "ds-v5-criteria",
    trial: "DONE SYMPLE",
    source: "app",
    severity: "high",
    finding: {
      es: "La app y el Esquema usan los criterios de la v4: 18-80 años, mRS 0-1, core ≤70 cc y exclusiones por INR, plaquetas y hemoglobina.",
      ca: "L'app i l'Esquema fan servir els criteris de la v4: 18-80 anys, mRS 0-1, core ≤70 cc i exclusions per INR, plaquetes i hemoglobina.",
      en: "The app and the Esquema sheet use the v4 criteria: age 18-80, mRS 0-1, core ≤70 cc and exclusions for INR, platelets and haemoglobin.",
    },
    protocol: {
      es: "Protocolo V5 (29-06-2026): 18-85 años; mRS 0-1 hasta 70 años y 0 por encima; core ≤100 cc o ASPECTS ≥4; sin exclusiones de laboratorio; visitas día 6 ±1 y día 90 ±30. Confirmar la aprobación del CEIm antes de cambiar la app.",
      ca: "Protocol V5 (29-06-2026): 18-85 anys; mRS 0-1 fins a 70 anys i 0 per sobre; core ≤100 cc o ASPECTS ≥4; sense exclusions de laboratori; visites dia 6 ±1 i dia 90 ±30. Confirmar l'aprovació del CEIm abans de canviar l'app.",
      en: "Protocol V5 (29-06-2026): age 18-85; mRS 0-1 up to 70 and 0 above; core ≤100 cc or ASPECTS ≥4; no laboratory exclusions; visits day 6 ±1 and day 90 ±30. Confirm ethics committee approval before changing the app.",
    },
  },
  {
    id: "ds-v5-docs",
    trial: "DONE SYMPLE",
    source: "drive",
    severity: "medium",
    finding: {
      es: "En la carpeta solo está la V5 en Word (\"CLEAN\"). Faltan el PDF aprobado y un resumen y un CI alineados con la V5.",
      ca: "A la carpeta només hi ha la V5 en Word (\"CLEAN\"). Falten el PDF aprovat i un resum i un CI alineats amb la V5.",
      en: "The folder only holds V5 as a Word file (\"CLEAN\"). The approved PDF, a summary and a consent form matching V5 are missing.",
    },
  },
  {
    id: "ten-diabetes",
    trial: "TENACITY",
    source: "summary",
    severity: "high",
    finding: {
      es: "El resumen pone \"Diabetes\" como criterio de exclusión.",
      ca: "El resum posa \"Diabetis\" com a criteri d'exclusió.",
      en: "The summary lists \"Diabetes\" as an exclusion criterion.",
    },
    protocol: {
      es: "Solo excluye ictus previo con diabetes concomitante (excl. 21, p. 32). La diabetes sola no excluye.",
      ca: "Només exclou ictus previ amb diabetis concomitant (excl. 21, p. 32). La diabetis sola no exclou.",
      en: "Only prior stroke with concomitant diabetes is excluded (excl. 21, p. 32). Diabetes alone does not exclude.",
    },
  },
  {
    id: "ten-nihss",
    trial: "TENACITY",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen escribe \"NIHSS 6-25 o NIHSS <5 discapacitante\" dentro de las exclusiones.",
      ca: "El resum escriu \"NIHSS 6-25 o NIHSS <5 discapacitant\" dins de les exclusions.",
      en: "The summary writes \"NIHSS 6-25 or disabling NIHSS <5\" under the exclusions.",
    },
    protocol: {
      es: "Excluye NIHSS >25 y NIHSS ≤5 no discapacitante (excl. 6-7, p. 31): entra un NIHSS ≤5 discapacitante, también 5.",
      ca: "Exclou NIHSS >25 i NIHSS ≤5 no discapacitant (excl. 6-7, p. 31): hi entra un NIHSS ≤5 discapacitant, també 5.",
      en: "It excludes NIHSS >25 and non-disabling NIHSS ≤5 (excl. 6-7, p. 31): a disabling NIHSS ≤5, including 5, is eligible.",
    },
  },
  {
    id: "ten-mt",
    trial: "TENACITY",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen excluye a los \"tratados con trombectomía\".",
      ca: "El resum exclou els \"tractats amb trombectomia\".",
      en: "The summary excludes patients \"treated with thrombectomy\".",
    },
    protocol: {
      es: "Solo excluye la trombectomía prevista en el mismo hospital de la aleatorización; los pacientes trasladados para trombectomía son elegibles (p. 29, 31).",
      ca: "Només exclou la trombectomia prevista al mateix hospital de l'aleatorització; els pacients traslladats per a trombectomia són elegibles (p. 29, 31).",
      en: "Only thrombectomy planned at the randomising hospital is excluded; patients transferred elsewhere for thrombectomy are eligible (p. 29, 31).",
    },
  },
  {
    id: "ten-imaging",
    trial: "TENACITY",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen presenta la opción 2 (angio-TC + ASPECTS) como alternativa a la perfusión.",
      ca: "El resum presenta l'opció 2 (angio-TC + ASPECTS) com a alternativa a la perfusió.",
      en: "The summary presents option 2 (CTA + ASPECTS) as an alternative to perfusion.",
    },
    protocol: {
      es: "La vía angio-TC + ASPECTS solo vale para centros sin perfusión por TC ni RM (p. 30, 46). Vall d'Hebron tiene perfusión.",
      ca: "La via angio-TC + ASPECTS només val per a centres sense perfusió per TC ni RM (p. 30, 46). Vall d'Hebron té perfusió.",
      en: "The CTA + ASPECTS route is only for sites without CT or MR perfusion (p. 30, 46). Vall d'Hebron has perfusion.",
    },
  },
  {
    id: "ten-72h",
    trial: "TENACITY",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen y la app ponen \">4,5 h y ≤72 h\" como criterio de inclusión.",
      ca: "El resum i l'app posen \">4,5 h i ≤72 h\" com a criteri d'inclusió.",
      en: "The summary and the app state \">4.5 h and ≤72 h\" as an inclusion criterion.",
    },
    protocol: {
      es: "La inclusión solo dice >4,5 h. El límite de 72 h viene de la exclusión 8: imagen o clínica que sugiere un ictus de más de 72 h.",
      ca: "La inclusió només diu >4,5 h. El límit de 72 h ve de l'exclusió 8: imatge o clínica que suggereix un ictus de més de 72 h.",
      en: "Inclusion only says >4.5 h. The 72 h limit comes from exclusion 8: imaging or clinical findings suggesting a stroke older than 72 h.",
    },
  },
  {
    id: "ten-visits",
    trial: "TENACITY",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen dice \"Visitas 60 y 90d\" al principio y 30 y 90 días más abajo.",
      ca: "El resum diu \"Visites 60 i 90d\" al principi i 30 i 90 dies més avall.",
      en: "The summary says \"visits 60 and 90 d\" at the top and 30 and 90 days further down.",
    },
    protocol: {
      es: "Visitas telefónicas a los 30 y 90 días.",
      ca: "Visites telefòniques als 30 i 90 dies.",
      en: "Phone visits at day 30 and day 90.",
    },
  },
  {
    id: "ten-icf",
    trial: "TENACITY",
    source: "drive",
    severity: "low",
    finding: {
      es: "El CI español (Main ICF V1.0ESP 2.0, 05-02-2026) se subió a Drive el 12-11-2026; antes no había CI en la carpeta. Comprobar que es la versión vigente.",
      ca: "El CI en castellà (Main ICF V1.0ESP 2.0, 05-02-2026) es va pujar a Drive el 12-11-2026; abans no hi havia CI a la carpeta. Comprovar que és la versió vigent.",
      en: "The Spanish consent form (Main ICF V1.0ESP 2.0, 05-02-2026) was uploaded on 12-11-2026; the folder had no consent form before. Check it is the current version.",
    },
  },
  {
    id: "rem-nihss",
    trial: "REMEDY",
    source: "summary",
    severity: "high",
    finding: {
      es: "El resumen pide \"NIHSS >5 y NIHSS <15\".",
      ca: "El resum demana \"NIHSS >5 i NIHSS <15\".",
      en: "The summary requires \"NIHSS >5 and NIHSS <15\".",
    },
    protocol: {
      es: "NIHSS ≥5 y ≤15 (incl. 4): entran también 5 y 15. La app ya usa 5-15.",
      ca: "NIHSS ≥5 i ≤15 (incl. 4): hi entren també 5 i 15. L'app ja fa servir 5-15.",
      en: "NIHSS ≥5 and ≤15 (incl. 4): 5 and 15 are eligible too. The app already uses 5-15.",
    },
  },
  {
    id: "rem-date",
    trial: "REMEDY",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen conserva \"Fecha inicio prevista: julio 2025\".",
      ca: "El resum conserva \"Data d'inici prevista: juliol 2025\".",
      en: "The summary still says \"planned start: July 2025\".",
    },
    protocol: {
      es: "Aprobación inicial CTIS el 28-11-2025; actualizar el estado.",
      ca: "Aprovació inicial CTIS el 28-11-2025; actualitzar l'estat.",
      en: "Initial CTIS approval on 28-11-2025; update the status.",
    },
  },
  {
    id: "ori-nihss",
    trial: "ORION",
    source: "summary",
    severity: "high",
    finding: {
      es: "El resumen pide \"NIHSS >5\".",
      ca: "El resum demana \"NIHSS >5\".",
      en: "The summary requires \"NIHSS >5\".",
    },
    protocol: {
      es: "NIHSS ≥5: un NIHSS de 5 entra. La app ya usa ≥5.",
      ca: "NIHSS ≥5: un NIHSS de 5 hi entra. L'app ja fa servir ≥5.",
      en: "NIHSS ≥5: a score of 5 is eligible. The app already uses ≥5.",
    },
  },
  {
    id: "ori-mrs",
    trial: "ORION",
    source: "summary",
    severity: "medium",
    finding: {
      es: "Falta la regla de mRS 0 por encima de 85 años y la sección de exclusiones está vacía.",
      ca: "Falta la regla de mRS 0 per sobre dels 85 anys i la secció d'exclusions és buida.",
      en: "The mRS 0 rule above age 85 is missing and the exclusion section is empty.",
    },
    protocol: {
      es: "18-90 años, mRS <2 y mRS 0 si >85 años; 27 criterios de exclusión (v3.1).",
      ca: "18-90 anys, mRS <2 i mRS 0 si >85 anys; 27 criteris d'exclusió (v3.1).",
      en: "Age 18-90, mRS <2 and mRS 0 if over 85; 27 exclusion criteria (v3.1).",
    },
  },
  {
    id: "ori-window",
    trial: "ORION",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen dice \"administrar el tratamiento dentro de las primeras 6 h\".",
      ca: "El resum diu \"administrar el tractament dins de les primeres 6 h\".",
      en: "The summary says \"give the treatment within the first 6 h\".",
    },
    protocol: {
      es: "4,5-6 h sin perfusión; 4,5-24 h con mismatch en la perfusión.",
      ca: "4,5-6 h sense perfusió; 4,5-24 h amb mismatch a la perfusió.",
      en: "4.5-6 h without perfusion; 4.5-24 h with a perfusion mismatch.",
    },
  },
  {
    id: "ori-icf",
    trial: "ORION",
    source: "drive",
    severity: "low",
    finding: {
      es: "En Drive hay un Main ICF v2.0 (23-06-2026) desde el 30-09-2026; la ficha del estudio se basa en el CI v1.0.",
      ca: "A Drive hi ha un Main ICF v2.0 (23-06-2026) des del 30-09-2026; la fitxa de l'estudi es basa en el CI v1.0.",
      en: "Drive holds a Main ICF v2.0 (23-06-2026) since 30-09-2026; the trial card is based on consent form v1.0.",
    },
  },
  {
    id: "sail-mrs",
    trial: "SAIL-MeVO",
    source: "sheet",
    severity: "high",
    finding: {
      es: "El Esquema pone mRS 0-2.",
      ca: "L'Esquema posa mRS 0-2.",
      en: "The Esquema sheet says mRS 0-2.",
    },
    protocol: {
      es: "mRS previo 0-1 (p. 28). La app y el resumen ya usan 0-1.",
      ca: "mRS previ 0-1 (p. 28). L'app i el resum ja fan servir 0-1.",
      en: "Pre-stroke mRS 0-1 (p. 28). The app and the summary already use 0-1.",
    },
  },
  {
    id: "sail-summary",
    trial: "SAIL-MeVO",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen cita el protocolo V1.0 y omite dos reglas de la V2.1.",
      ca: "El resum cita el protocol V1.0 i omet dues regles de la V2.1.",
      en: "The summary cites protocol V1.0 and leaves out two V2.1 rules.",
    },
    protocol: {
      es: "V2.1: con trombólisis, el NIHSS debe seguir entre 9 y 17 a los 30 min del inicio; en el ictus del despertar, <12 h desde el punto medio del sueño (p. 28).",
      ca: "V2.1: amb trombòlisi, el NIHSS ha de seguir entre 9 i 17 als 30 min de l'inici; en l'ictus del despertar, <12 h des del punt mitjà del son (p. 28).",
      en: "V2.1: after thrombolysis, NIHSS must still be 9-17 at 30 min from its start; wake-up stroke counts <12 h from the sleep midpoint (p. 28).",
    },
  },
  {
    id: "sail-sponsor",
    trial: "SAIL-MeVO",
    source: "drive",
    severity: "low",
    finding: {
      es: "Cambio de promotor a la Fundació Ictus en curso (solicitud al CEIm del 02-10-2026): el CI y los contratos cambiarán.",
      ca: "Canvi de promotor a la Fundació Ictus en curs (sol·licitud al CEIm del 02-10-2026): el CI i els contractes canviaran.",
      en: "Sponsor change to Fundació Ictus in progress (ethics committee request of 02-10-2026): consent form and contracts will change.",
    },
  },
  {
    id: "sov-nihss",
    trial: "SOVATELTIDE",
    source: "sheet",
    severity: "medium",
    finding: {
      es: "El Esquema pone NIHSS 8-20.",
      ca: "L'Esquema posa NIHSS 8-20.",
      en: "The Esquema sheet says NIHSS 8-20.",
    },
    protocol: {
      es: "NIHSS ≥8 y <20, es decir 8-19, con ítem 1A <2. La app ya es correcta.",
      ca: "NIHSS ≥8 i <20, és a dir 8-19, amb ítem 1A <2. L'app ja és correcta.",
      en: "NIHSS ≥8 and <20, i.e. 8-19, with item 1A <2. The app is already correct.",
    },
  },
  {
    id: "sov-visits",
    trial: "SOVATELTIDE",
    source: "summary",
    severity: "low",
    finding: {
      es: "La lista de visitas del resumen omite los días 3 y 6.",
      ca: "La llista de visites del resum omet els dies 3 i 6.",
      en: "The summary's visit list leaves out days 3 and 6.",
    },
    protocol: {
      es: "Tres dosis los días 1, 3 y 6 ±1, con ECG e inmunogenicidad los días 3 y 6.",
      ca: "Tres dosis els dies 1, 3 i 6 ±1, amb ECG i immunogenicitat els dies 3 i 6.",
      en: "Three doses on days 1, 3 and 6 ±1, with ECG and immunogenicity on days 3 and 6.",
    },
  },
  {
    id: "tich-gcs",
    trial: "TICH-3",
    source: "sheet",
    severity: "medium",
    finding: {
      es: "El Esquema pone \"GCS >5\".",
      ca: "L'Esquema posa \"GCS >5\".",
      en: "The Esquema sheet says \"GCS >5\".",
    },
    protocol: {
      es: "Excluye GCS <5: un GCS de 5 entra. La app y el resumen son correctos.",
      ca: "Exclou GCS <5: un GCS de 5 hi entra. L'app i el resum són correctes.",
      en: "It excludes GCS <5: a GCS of 5 is eligible. The app and the summary are correct.",
    },
  },
  {
    id: "tich-window",
    trial: "TICH-3",
    source: "app",
    severity: "note",
    finding: {
      es: "Con inicio desconocido, la app cuenta las 4,5 h desde el descubrimiento de los síntomas.",
      ca: "Amb inici desconegut, l'app compta les 4,5 h des del descobriment dels símptomes.",
      en: "With unknown onset, the app counts the 4.5 h from symptom discovery.",
    },
    protocol: {
      es: "Decisión local con el IP (11-11-2026): siempre desde la última vez visto bien. Pendiente de publicar en la app. No es un error de protocolo.",
      ca: "Decisió local amb l'IP (11-11-2026): sempre des de l'última vegada vist bé. Pendent de publicar a l'app. No és un error de protocol.",
      en: "Local decision with the PI (11-11-2026): always from last seen well. Not yet released in the app. Not a protocol error.",
    },
  },
  {
    id: "tich-icf",
    trial: "TICH-3",
    source: "drive",
    severity: "medium",
    finding: {
      es: "El CI v2.0 (21-03-2023) es anterior al protocolo v3.1 (25-04-2024) y falta la hoja de información a la que remite.",
      ca: "El CI v2.0 (21-03-2023) és anterior al protocol v3.1 (25-04-2024) i falta el full d'informació al qual remet.",
      en: "Consent form v2.0 (21-03-2023) predates protocol v3.1 (25-04-2024) and the information sheet it refers to is missing.",
    },
  },
  {
    id: "van-aspects",
    trial: "VANISH",
    source: "sheet",
    severity: "medium",
    finding: {
      es: "El Esquema pone ASPECTS ≥4; la app usa >4 (decisión del equipo del 21-10-2026).",
      ca: "L'Esquema posa ASPECTS ≥4; l'app fa servir >4 (decisió de l'equip del 21-10-2026).",
      en: "The Esquema sheet says ASPECTS ≥4; the app uses >4 (team decision of 21-10-2026).",
    },
    protocol: {
      es: "El protocolo v1.2 no tiene criterio ASPECTS. Decidir si un ASPECTS de 4 entra y alinear Esquema y app.",
      ca: "El protocol v1.2 no té criteri ASPECTS. Decidir si un ASPECTS de 4 hi entra i alinear Esquema i app.",
      en: "Protocol v1.2 has no ASPECTS criterion. Decide whether ASPECTS 4 is eligible and align the sheet and the app.",
    },
  },
  {
    id: "van-twin",
    trial: "VANISH",
    source: "registry",
    severity: "high",
    finding: {
      es: "En el registro de inclusiones, 3 pacientes están en VANISH y en TWIN-2-WIN 2 el mismo día. La app no tiene regla para esta pareja.",
      ca: "Al registre d'inclusions, 3 pacients són a VANISH i a TWIN-2-WIN 2 el mateix dia. L'app no té cap regla per a aquesta parella.",
      en: "In the enrolment log, 3 patients are in both VANISH and TWIN-2-WIN 2 on the same day. The app has no rule for this pair.",
    },
    protocol: {
      es: "TWIN-2-WIN 2 excluye estudios con fármaco o dispositivo que puedan afectarlo (excl. 12). Confirmar por escrito con los promotores.",
      ca: "TWIN-2-WIN 2 exclou estudis amb fàrmac o dispositiu que el puguin afectar (excl. 12). Confirmar per escrit amb els promotors.",
      en: "TWIN-2-WIN 2 excludes drug or device studies that may affect it (excl. 12). Confirm in writing with the sponsors.",
    },
  },
  {
    id: "wet-window",
    trial: "WeTrust",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El criterio de inclusión 4 del resumen solo dice \"<6 h\".",
      ca: "El criteri d'inclusió 4 del resum només diu \"<6 h\".",
      en: "Inclusion criterion 4 in the summary only says \"<6 h\".",
    },
    protocol: {
      es: "Rev 09: también ictus del despertar con última vez visto bien <12 h y síntomas descubiertos <6 h antes de llegar. La app ya lo aplica.",
      ca: "Rev 09: també ictus del despertar amb última vegada vist bé <12 h i símptomes descoberts <6 h abans d'arribar. L'app ja ho aplica.",
      en: "Rev 09: also wake-up stroke with last seen well <12 h and symptoms found <6 h before arrival. The app already applies it.",
    },
  },
  {
    id: "twin-mrs",
    trial: "TWIN-2-WIN 2",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen dice \"mRS preictal de 0 o 2\".",
      ca: "El resum diu \"mRS preictal de 0 o 2\".",
      en: "The summary says \"pre-stroke mRS of 0 or 2\".",
    },
    protocol: {
      es: "mRS 0-2.",
      ca: "mRS 0-2.",
      en: "mRS 0-2.",
    },
  },
  {
    id: "fast-summary",
    trial: "FASTEST",
    source: "summary",
    severity: "medium",
    finding: {
      es: "El resumen da como fin del estudio el 31-12-2024 y el modelo de visita cita el CI V1.3 (11-07-2022), con fecha de entrega de copia anterior a la firma.",
      ca: "El resum dona com a final de l'estudi el 31-12-2024 i el model de visita cita el CI V1.3 (11-07-2022), amb data de lliurament de còpia anterior a la signatura.",
      en: "The summary gives 31-12-2024 as the study end and the visit template cites consent form V1.3 (11-07-2022), with a copy date earlier than the signature.",
    },
    protocol: {
      es: "Vigentes: protocolo V10.5 (03-02-2026) y CI V1.5 (15-03-2025).",
      ca: "Vigents: protocol V10.5 (03-02-2026) i CI V1.5 (15-03-2025).",
      en: "Current: protocol V10.5 (03-02-2026) and consent form V1.5 (15-03-2025).",
    },
  },
  {
    id: "nivo-docs",
    trial: "NiVO",
    source: "drive",
    severity: "medium",
    finding: {
      es: "Solo hay sinopsis, sin protocolo completo. El modelo de visita cita los CI pre y post v1.0; en Drive están los v2.0.",
      ca: "Només hi ha sinopsi, sense protocol complet. El model de visita cita els CI pre i post v1.0; a Drive hi ha els v2.0.",
      en: "Only the synopsis is available, no full protocol. The visit template cites pre/post consent forms v1.0; Drive holds v2.0.",
    },
  },
  {
    id: "doit-consent",
    trial: "DO-IT",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen dice consentimiento \"oral\"; el Esquema dice \"escrito/diferido\".",
      ca: "El resum diu consentiment \"oral\"; l'Esquema diu \"escrit/diferit\".",
      en: "The summary says \"oral\" consent; the Esquema sheet says \"written/deferred\".",
    },
    protocol: {
      es: "Comprobar en el protocolo v2.0 qué tipo de consentimiento está aprobado.",
      ca: "Comprovar al protocol v2.0 quin tipus de consentiment està aprovat.",
      en: "Check in protocol v2.0 which consent type is approved.",
    },
  },
  {
    id: "piv-summary",
    trial: "PIVOTAL",
    source: "summary",
    severity: "low",
    finding: {
      es: "El resumen solo lista exclusiones; no tiene criterios de inclusión.",
      ca: "El resum només llista exclusions; no té criteris d'inclusió.",
      en: "The summary only lists exclusions; it has no inclusion criteria.",
    },
  },
  {
    id: "nora-safer-docs",
    trial: "NORA HOME",
    source: "drive",
    severity: "medium",
    finding: {
      es: "NORA HOME y SAFER-DOAC están activos en la app pero no hay ningún documento suyo en Drive.",
      ca: "NORA HOME i SAFER-DOAC són actius a l'app però no hi ha cap document seu a Drive.",
      en: "NORA HOME and SAFER-DOAC are active in the app but Drive holds no documents for them.",
    },
  },
  {
    id: "elapse-v2",
    trial: "ELAPSE",
    source: "drive",
    severity: "low",
    finding: {
      es: "Protocolo V2.0 y CI ES V1.1 subidos el 14-10-2026; la ficha de referencia usa la V1.2. Estudio no presente en la app.",
      ca: "Protocol V2.0 i CI ES V1.1 pujats el 14-10-2026; la fitxa de referència fa servir la V1.2. Estudi no present a l'app.",
      en: "Protocol V2.0 and Spanish consent V1.1 uploaded on 14-10-2026; the reference notes use V1.2. Study not in the app.",
    },
  },
  {
    id: "icarus-docs",
    trial: "ICARUS",
    source: "drive",
    severity: "low",
    finding: {
      es: "Protocolo V3.0 y CI post hoc (paciente y familiar) V1.1 en Drive, sin ficha en la app.",
      ca: "Protocol V3.0 i CI post hoc (pacient i familiar) V1.1 a Drive, sense fitxa a l'app.",
      en: "Protocol V3.0 and post hoc consent forms (patient and relative) V1.1 in Drive, no card in the app.",
    },
  },
  {
    id: "new-studies",
    trial: "Nuevos estudios",
    source: "drive",
    severity: "low",
    finding: {
      es: "Documentos nuevos sin ficha: FR33ZE (protocolo 3.3; ¿es CEREFUZE?), Regeneron R7508 y ORBIT-XI / Ribocure RC05T003 (protocolo v1).",
      ca: "Documents nous sense fitxa: FR33ZE (protocol 3.3; és CEREFUZE?), Regeneron R7508 i ORBIT-XI / Ribocure RC05T003 (protocol v1).",
      en: "New documents with no card: FR33ZE (protocol 3.3; is it CEREFUZE?), Regeneron R7508 and ORBIT-XI / Ribocure RC05T003 (protocol v1).",
    },
  },
];

// ---------------------------------------------------------------------------
// Stato della revisione

export type ReviewStatus = "pending" | "agree" | "done" | "disagree";
export const REVIEW_STATUSES: readonly ReviewStatus[] = ["pending", "agree", "done", "disagree"];

export interface ReviewMark {
  status: ReviewStatus;
  note: string;
  by: string;
  /** Ora della modifica (ms): vince la piu' recente. */
  t: number;
}

export const REVIEW_NOTE_MAX = 500;
export const REVIEW_BY_MAX = 40;

const ITEM_IDS = new Set(REVIEW_ITEMS.map((i) => i.id));

/** Riga del foglio Review (o del server) -> mark valido, o null. */
export function parseReviewRow(r: Record<string, unknown>): [string, ReviewMark] | null {
  const id = String(r.id ?? "");
  if (!ITEM_IDS.has(id)) return null;
  const status = String(r.status ?? "") as ReviewStatus;
  if (!REVIEW_STATUSES.includes(status)) return null;
  const t = Date.parse(String(r.updatedAt ?? ""));
  if (!Number.isFinite(t)) return null;
  return [id, {
    status,
    note: String(r.note ?? "").slice(0, REVIEW_NOTE_MAX),
    by: String(r.by ?? "").slice(0, REVIEW_BY_MAX),
    t,
  }];
}

/** Unisce due mappe di revisione: per ogni punto vince la modifica piu' recente. */
export function mergeReviews(
  a: Readonly<Record<string, ReviewMark>>,
  b: Readonly<Record<string, ReviewMark>>,
): Record<string, ReviewMark> {
  const out: Record<string, ReviewMark> = { ...a };
  for (const [id, m] of Object.entries(b)) {
    if (!out[id] || m.t > out[id].t) out[id] = m;
  }
  return out;
}

export function statusOf(marks: Readonly<Record<string, ReviewMark>>, id: string): ReviewStatus {
  return marks[id]?.status ?? "pending";
}

/** Punti raggruppati per studio, nell'ordine dell'elenco. */
export function reviewByTrial(items: readonly ReviewItem[] = REVIEW_ITEMS): [string, ReviewItem[]][] {
  const groups = new Map<string, ReviewItem[]>();
  for (const it of items) groups.set(it.trial, [...(groups.get(it.trial) ?? []), it]);
  return [...groups.entries()];
}

// ---------------------------------------------------------------------------
// Foglio "Review" dell'Apps Script (op=reviews / op=review). Lo script vecchio
// risponde [] a ogni GET sconosciuto: solo { v, items } dice che la revisione
// condivisa c'e'; altrimenti la revisione resta sul dispositivo.


export type ReviewFetch =
  | { ok: true; supported: boolean; marks: Record<string, ReviewMark> }
  | { ok: false; reason: string };

export async function fetchReviews(): Promise<ReviewFetch> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(GAS_URL + "?op=reviews", { method: "GET", signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { ok: false, reason: "HTTP " + res.status };
    const data = (await res.json()) as unknown;
    const items = data && typeof data === "object" && !Array.isArray(data) ? (data as { items?: unknown }).items : undefined;
    if (!Array.isArray(items)) return { ok: true, supported: false, marks: {} };
    const marks: Record<string, ReviewMark> = {};
    for (const r of items) {
      const p = r && typeof r === "object" ? parseReviewRow(r as Record<string, unknown>) : null;
      if (p && (!marks[p[0]] || p[1].t > marks[p[0]].t)) marks[p[0]] = p[1];
    }
    return { ok: true, supported: true, marks };
  } catch (e) {
    clearTimeout(timeoutId);
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendReview(id: string, m: ReviewMark): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      payload: JSON.stringify({ kind: "review", id, status: m.status, note: m.note, by: m.by, updatedAt: new Date(m.t).toISOString() }),
    });
    await fetch(GAS_URL + "?op=review", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
    return true;
  } catch {
    return false;
  }
}
