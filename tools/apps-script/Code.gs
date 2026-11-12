// === Eligo backend — schema dinamico + supporto missed/eligible/source ===
//
// Copia di lavoro dello script Apps Script legato allo spreadsheet
// EnsApp_Data. Sorgente di verita' operativa = editor Apps Script; questo
// file serve a versionare le modifiche insieme al client.
//
// Tipo di ictus (ischemic / hemorrhagic): scritto nella colonna esistente
// "Ischemic/Haemorragic" (o "Stroke_type", creata se manca) e riletto come
// strokeType da doGet.
//
// Colonne cliniche (CLINICAL_COLS: reversione, vasi, ASPECTS, GCS, ...):
// create in coda se mancano, come i trial.
//
// Trial supportati: quelli di TRIAL_KEYS piu' quelli che l'app dichiara nel
// payload (campo `trialKeys`, CSV di SHEET_TRIAL_KEYS lato client).
//
// NOTA: le colonne dei trial mancanti nel foglio vengono create in automatico
// al primo doPost (ensureTrialColumns_). Senza quella colonna l'arruolamento
// verrebbe scartato in silenzio, perche' la riga si costruisce leggendo le
// intestazioni. Dato che l'elenco arriva dall'app, aggiungere un trial nuovo
// non richiede di modificare ne' rideployare questo script.

const SHEET_NAME = ""; // "" = primo foglio dello spreadsheet

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (SHEET_NAME) {
    const named = ss.getSheetByName(SHEET_NAME);
    if (named) return named;
  }
  return ss.getSheets()[0];
}

// La web app e' pubblica: un testo che inizia con = + - @ verrebbe preso dal
// foglio come formula (es. Notes "-> TC" = #ERROR!, o una formula iniettata).
// L'apostrofo iniziale lo tiene come testo e non compare nel valore letto.
function sheetText_(v) {
  return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
}

// ID paziente sempre come testo: "00123" resterebbe 123 e la riga non si
// ritroverebbe piu' (verifica dell'invio, sync dei pazienti).
function sheetId_(v) {
  const s = v == null ? "" : String(v);
  return s ? "'" + s : "";
}

// La lettura (doGet) e' pubblica: l'ID paziente esce mascherato come nei
// messaggi WhatsApp (ultime 3 cifre visibili, il resto "x"). Nel foglio resta
// completo. Stessa regola di maskPatientId() nell'app.
function maskId_(v) {
  const s = v == null ? "" : String(v).trim();
  return s.length <= 3 ? s : "x".repeat(s.length - 3) + s.slice(-3);
}

// Ora dichiarata dal client: mai nel futuro, altrimenti una riga (o un campo)
// non si potrebbe piu' aggiornare ne' cancellare.
function notFuture_(t, now) {
  return t > now ? now : t;
}

// Trial keys di base (24). Non serve piu' aggiornarla per i trial nuovi:
// arrivano da payload.trialKeys e vengono ricordati in knownTrialKeys_().
const TRIAL_KEYS = ["WeTrust","MARSS","ATHENA","VANISH","PIVOTAL","MOSTE","FASTEST",
  "TICH3","LIBREXIA","TWIN2WIN","ARTEMIS","HYBERNIA","DONESYMPLE","SAFERDOAC",
  "SHIONOGI","SOVATELTIDE","ORION","DOIT","REMEDY","PROMISE","NIVO","NORAHOME",
  "TENACITY","SAILMEVO"];

// Alias: l'app o un header umano potrebbe scrivere il nome con spazi.
// Mappa tutte le varianti -> chiave canonica nella colonna del foglio.
const TRIAL_ALIASES = {
  "NORA HOME": "NORAHOME",
  "NORA_HOME": "NORAHOME",
  "Nora Home": "NORAHOME",
  "noraHome": "NORAHOME",
  "DO IT": "DOIT",
  "DO  IT": "DOIT",
  "NiVO": "NIVO",
  "Tenacity": "TENACITY",
  "tenacity": "TENACITY",
  "TNK": "TENACITY",
  "SAIL-MeVO": "SAILMEVO",
  "SAIL-MEVO": "SAILMEVO",
  "SAIL MeVO": "SAILMEVO",
  "SailMevo": "SAILMEVO"
};

// Chiavi trial dichiarate dall'app: solo lettere, cifre e "_", per non creare
// intestazioni arbitrarie da un POST qualsiasi (la web app e' pubblica).
const TRIAL_KEY_RE = /^[A-Za-z0-9_]{1,40}$/;
const MAX_TRIAL_KEYS = 100;
const KNOWN_TRIALS_PROP = "KNOWN_TRIAL_KEYS";

/** Chiavi trial in payload.trialKeys (CSV o array), valide e canoniche. */
function payloadTrialKeys_(payload) {
  const raw = payload && payload.trialKeys;
  const list = Array.isArray(raw) ? raw : String(raw || "").split(",");
  const out = [];
  list.forEach(k => {
    const key = canonicalTrialKey_(k);
    if (TRIAL_KEY_RE.test(key) && out.indexOf(key) < 0 && out.length < MAX_TRIAL_KEYS) out.push(key);
  });
  return out;
}

/**
 * Tutte le chiavi trial note: TRIAL_KEYS + quelle gia' viste nei POST
 * (salvate nelle Script Properties, cosi' anche doGet le riconosce).
 * Con `payload` aggiunge e memorizza quelle nuove dichiarate dall'app.
 */
function knownTrialKeys_(payload) {
  const props = PropertiesService.getScriptProperties();
  const stored = String(props.getProperty(KNOWN_TRIALS_PROP) || "").split(",").filter(Boolean);
  const keys = TRIAL_KEYS.slice();
  stored.concat(payload ? payloadTrialKeys_(payload) : []).forEach(k => {
    if (keys.indexOf(k) < 0 && keys.length < TRIAL_KEYS.length + MAX_TRIAL_KEYS) keys.push(k);
  });
  const extra = keys.filter(k => TRIAL_KEYS.indexOf(k) < 0);
  if (payload && extra.join(",") !== stored.join(",")) {
    props.setProperty(KNOWN_TRIALS_PROP, extra.join(","));
  }
  return keys;
}

/** Chiave canonica di una intestazione (o la chiave stessa se non e' un alias). */
function canonicalTrialKey_(key) {
  const k = String(key || "").trim();
  return TRIAL_ALIASES[k] || k;
}

/** Tutte le varianti conosciute di una chiave canonica. */
function trialVariants_(canonical) {
  const out = [canonical];
  for (const alias in TRIAL_ALIASES) {
    if (TRIAL_ALIASES[alias] === canonical) out.push(alias);
  }
  return out;
}

/**
 * Valore da scrivere in una colonna trial: prima la chiave canonica, poi
 * l'intestazione reale del foglio, poi tutti gli alias. Default "no".
 */
function trialValue_(payload, canonical, sheetKey) {
  const candidates = [canonical, sheetKey].concat(trialVariants_(canonical));
  for (let i = 0; i < candidates.length; i++) {
    const v = payload[candidates[i]];
    if (v != null && String(v) !== "") return v;
  }
  return "no";
}

/**
 * Aggiunge in coda le colonne dei trial mancanti (es. un trial appena aggiunto
 * all'app, al suo primo invio), cosi' non serve un passo manuale sul foglio.
 * Gli alias contano come presenti: "DO  IT" vale DOIT, "NiVO" vale NIVO.
 */
function ensureTrialColumns_(sh, trialKeys) {
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) return;

  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const present = {};
  headers.forEach(h => { if (h) present[canonicalTrialKey_(h)] = true; });

  const missing = trialKeys.filter(k => !present[k]);
  if (missing.length === 0) return;

  sh.getRange(1, lastCol + 1, 1, missing.length)
    .setValues([missing])
    .setFontWeight("bold");
}

// Tipo di ictus. Il foglio DB ha gia' la colonna "Ischemic/Haemorragic":
// si scrive li'. Se nessuna delle intestazioni note c'e', lo script crea
// "Stroke_type" in coda al primo doPost.
const STROKE_COLS = ["Ischemic/Haemorragic", "Ischemic/Hemorrhagic", "Stroke_type"];
const STROKE_TYPES = ["ischemic", "hemorrhagic"];

function ensureStrokeColumn_(sh) {
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) return;
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  if (headers.some(h => STROKE_COLS.indexOf(h) >= 0)) return;
  sh.getRange(1, lastCol + 1, 1, 1)
    .setValues([["Stroke_type"]])
    .setFontWeight("bold");
}

// Colonne cliniche aggiuntive: create in coda al primo doPost se mancano.
// Elenco fisso (la web app e' pubblica): deve restare uguale a
// SHEET_CLINICAL_COLS nell'app (sheet-columns.ts), lo controlla un test.
const CLINICAL_COLS = [
  "Reversal", "Reversal_agent", "Seen_at",
  "LTSW_datetime", "Wakeup", "Discovery_datetime", "Wakeup_within_6h", "Angiograph", "DOAC", "ACEI",
  "Antithrombotics", "RACE",
  "Occlusion", "Tandem", "ASPECTS", "EVT_candidate", "IVT_candidate", "LVO", "Tortuosity",
  "Lesion_confirmed", "Contra_tPA", "Perfusion_mismatch", "Large_core_70", "Diabetes",
  "VANISH_core_mismatch", "EVT_within_1h", "AI_core_lt10", "Tmax_gt30", "Pregnancy",
  "Life_expectancy_lt3m", "Contrast_allergy", "IVT_except_DOAC", "NIHSS_1a_ge2", "Posterior_fossa",
  "Core_gt70", "DOAC_reversal",
  "GCS", "Hematoma_mL", "Anticoagulation", "Secondary_cause", "Spot_sign", "Brainstem",
  "Procoagulant", "ECG_ST", "Thrombosis", "Hem_pregnancy", "Angioplasty", "IVH_large", "IVH", "Seizure"
];
const CLINICAL_MAX_LEN = 200;

function ensureClinicalColumns_(sh) {
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) return;
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const missing = CLINICAL_COLS.filter(k => headers.indexOf(k) < 0);
  if (missing.length === 0) return;
  sh.getRange(1, lastCol + 1, 1, missing.length)
    .setValues([missing])
    .setFontWeight("bold");
}

/**
 * Da lanciare a mano dall'editor (Esegui): crea subito in coda al foglio DB
 * le colonne cliniche che mancano, senza aspettare il primo invio.
 */
function setupColumns() {
  const sh = getSheet_();
  ensureStrokeColumn_(sh);
  ensureClinicalColumns_(sh);
}

/** Valore di una colonna clinica: numero o testo corto. */
function clinicalValue_(v) {
  if (v == null) return "";
  if (typeof v === "number") return isFinite(v) ? v : "";
  return String(v).slice(0, CLINICAL_MAX_LEN);
}

/** Tipo di ictus valido ("ischemic" | "hemorrhagic"), altrimenti "". */
function strokeType_(v) {
  const s = String(v == null ? "" : v).trim().toLowerCase();
  return STROKE_TYPES.indexOf(s) >= 0 ? s : "";
}

/** Tipo di ictus da una riga letta (qualunque intestazione nota). */
function rowStrokeType_(obj) {
  for (let i = 0; i < STROKE_COLS.length; i++) {
    const t = strokeType_(obj[STROKE_COLS[i]]);
    if (t) return t;
  }
  return strokeType_(obj.strokeType);
}

// ---------- PRE-ARRIVO (scheda PreArrivals) ----------
//
// Pazienti annunciati dal SEM, condivisi fra i dispositivi. Una riga per id
// (upsert): vince la versione con updatedAt piu' recente. Il CIP non arriva
// mai qui. La web app e' pubblica: solo campi noti, con limiti di lunghezza.

const PRE_SHEET = "PreArrivals";
const PRE_COLS = ["id","updatedAt","status","age","premrs","race","anti","clockMode","at","found","arriveAt","eta","nihss"];
const PRE_STATUS = ["incoming","arrived","discarded"];
const PRE_ANTI = ["none","antiplatelet","doac","warfarin","lmwh"];
const PRE_LIST_MS = 24 * 60 * 60 * 1000;  // doGet: solo le ultime 24h
const PRE_KEEP_MS = 7 * 24 * 60 * 60 * 1000;  // righe piu' vecchie: cancellate

function preSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(PRE_SHEET);
  if (!sh) {
    sh = ss.insertSheet(PRE_SHEET);
    // Testo semplice: le date ISO non diventano Date del foglio.
    sh.getRange(1, 1, sh.getMaxRows(), PRE_COLS.length).setNumberFormat("@");
    sh.getRange(1, 1, 1, PRE_COLS.length).setValues([PRE_COLS]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  // Colonne aggiunte dopo (es. nihss): l'intestazione si allunga da sola.
  const width = sh.getLastColumn();
  if (width < PRE_COLS.length) {
    sh.getRange(1, width + 1, sh.getMaxRows(), PRE_COLS.length - width).setNumberFormat("@");
    sh.getRange(1, width + 1, 1, PRE_COLS.length - width).setValues([PRE_COLS.slice(width)]).setFontWeight("bold");
  }
  return sh;
}

function preTime_(v) {
  if (v instanceof Date) return v.getTime();
  const t = Date.parse(String(v || ""));
  return isNaN(t) ? null : t;
}
function preIso_(v) {
  const t = preTime_(v);
  return t == null ? "" : new Date(t).toISOString();
}
function preNum_(v, min, max) {
  if (v === "" || v == null) return "";
  const n = Number(v);
  return isNaN(n) || n < min || n > max ? "" : Math.round(n);
}

/** Riga pulita dal payload, o null se non valida. */
function preRow_(p) {
  const id = String(p.id || "");
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) return null;
  if (PRE_STATUS.indexOf(p.status) < 0) return null;
  const at = preIso_(p.at);
  if (!at) return null;
  const anti = String(p.anti || "").split(",").filter(a => PRE_ANTI.indexOf(a) >= 0).join(",");
  return [
    id,
    new Date(notFuture_(preTime_(p.updatedAt) || Date.now(), Date.now())).toISOString(),
    p.status,
    preNum_(p.age, 0, 120),
    preNum_(p.premrs, 0, 6),
    preNum_(p.race, 0, 9),
    anti,
    p.clockMode === "wakeup" ? "wakeup" : "known",
    at,
    preIso_(p.found),
    preIso_(p.arriveAt),
    preNum_(p.eta, 0, 600),
    preNum_(p.nihss, 0, 42)
  ];
}

function prePost_(payload) {
  const row = preRow_(payload);
  if (!row) return ContentService.createTextOutput("error: prearrival");
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = preSheet_();
    const last = sh.getLastRow();
    const data = last > 1 ? sh.getRange(2, 1, last - 1, PRE_COLS.length).getValues() : [];
    const now = Date.now();
    let found = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (String(data[i][0]) === row[0]) { found = i; break; }
    }
    if (found >= 0) {
      // Una versione piu' vecchia (arrivata in ritardo) non sovrascrive.
      if ((preTime_(data[found][1]) || 0) <= preTime_(row[1])) {
        sh.getRange(found + 2, 1, 1, PRE_COLS.length).setValues([row]);
      }
    } else {
      sh.appendRow(row);
    }
    // Pulizia: via le righe ferme da piu' di 7 giorni (dal fondo).
    for (let i = data.length - 1; i >= 0; i--) {
      const t = preTime_(data[i][1]);
      if (i !== found && t != null && now - t > PRE_KEEP_MS) sh.deleteRow(i + 2);
    }
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

function preList_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRE_SHEET);
  const items = [];
  if (sh && sh.getLastRow() > 1) {
    const now = Date.now();
    sh.getRange(2, 1, sh.getLastRow() - 1, PRE_COLS.length).getValues().forEach(r => {
      const t = preTime_(r[1]);
      if (t == null || now - t > PRE_LIST_MS) return;
      const obj = {};
      PRE_COLS.forEach((c, i) => { obj[c] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
      items.push(obj);
    });
  }
  // L'oggetto { v, items } dice all'app che questo script gestisce i pre-arrivi.
  return jsonOut({ v: 1, items: items });
}

// ---------- STROKE CODE CONDIVISO (scheda LiveBoards) ----------
//
// Il paziente del board aperto su piu' dispositivi. Una riga per id; la
// colonna fields e' un JSON { "pre.age": { v, t }, ... } unito campo per
// campo: per ogni campo vince l'ora di modifica (t) piu' recente.
// ID paziente e CIP non sono accettati.

const LIVE_SHEET = "LiveBoards";
const LIVE_COLS = ["id","updatedAt","status","fields"];
const LIVE_KEY_RE = /^(pre|post|hem|sel)\.[A-Za-z0-9_]{1,40}$/;
const LIVE_LOCAL_ONLY = ["pre.patientId", "pre.cip"];
const LIVE_MAX_VALUE = 2000;   // caratteri JSON per campo
const LIVE_MAX_FIELDS = 150;
const LIVE_LIST_MS = 24 * 60 * 60 * 1000;
const LIVE_KEEP_MS = 7 * 24 * 60 * 60 * 1000;

function liveSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(LIVE_SHEET);
  if (!sh) {
    sh = ss.insertSheet(LIVE_SHEET);
    sh.getRange(1, 1, sh.getMaxRows(), LIVE_COLS.length).setNumberFormat("@");
    sh.getRange(1, 1, 1, LIVE_COLS.length).setValues([LIVE_COLS]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function liveParse_(v) {
  try {
    const o = JSON.parse(String(v || "{}"));
    return o && typeof o === "object" && !Array.isArray(o) ? o : {};
  } catch (err) {
    return {};
  }
}

function livePost_(payload) {
  const id = String(payload.id || "");
  if (!/^[A-Za-z0-9-]{8,64}$/.test(id)) return ContentService.createTextOutput("error: board");
  const incoming = payload.fields && typeof payload.fields === "object" ? payload.fields : {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = liveSheet_();
    const last = sh.getLastRow();
    const data = last > 1 ? sh.getRange(2, 1, last - 1, LIVE_COLS.length).getValues() : [];
    const now = Date.now();
    let found = -1;
    for (let i = data.length - 1; i >= 0; i--) {
      if (String(data[i][0]) === id) { found = i; break; }
    }
    const fields = found >= 0 ? liveParse_(data[found][3]) : {};
    Object.keys(incoming).forEach(k => {
      if (!LIVE_KEY_RE.test(k) || LIVE_LOCAL_ONLY.indexOf(k) >= 0) return;
      const f = incoming[k];
      const t = f && notFuture_(Number(f.t), now);
      if (!t || isNaN(t)) return;
      const v = f.v === undefined ? null : f.v;
      if (JSON.stringify(v).length > LIVE_MAX_VALUE) return;
      if (!fields[k] && Object.keys(fields).length >= LIVE_MAX_FIELDS) return;
      if (!fields[k] || Number(fields[k].t) < t) fields[k] = { v: v, t: t };
    });
    // Chiuso (paziente registrato) resta chiuso.
    const status = payload.status === "closed" || (found >= 0 && data[found][2] === "closed") ? "closed" : "open";
    const row = [id, new Date(now).toISOString(), status, JSON.stringify(fields)];
    if (found >= 0) sh.getRange(found + 2, 1, 1, LIVE_COLS.length).setValues([row]);
    else sh.appendRow(row);
    for (let i = data.length - 1; i >= 0; i--) {
      const t = preTime_(data[i][1]);
      if (i !== found && t != null && now - t > LIVE_KEEP_MS) sh.deleteRow(i + 2);
    }
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

function liveList_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LIVE_SHEET);
  const items = [];
  if (sh && sh.getLastRow() > 1) {
    const now = Date.now();
    sh.getRange(2, 1, sh.getLastRow() - 1, LIVE_COLS.length).getValues().forEach(r => {
      const t = preTime_(r[1]);
      if (t == null || now - t > LIVE_LIST_MS) return;
      items.push({ id: String(r[0]), updatedAt: new Date(t).toISOString(), status: r[2] === "closed" ? "closed" : "open", fields: liveParse_(r[3]) });
    });
  }
  return jsonOut({ v: 1, items: items });
}

/** Valore da scrivere nella colonna `key` per un payload paziente. */
function cellValue_(key, payload, trialKeys) {
  // Timestamp
  if (key === "Timestamp" || key === "timestamp") {
    return payload.timestamp || payload.Timestamp || new Date().toISOString();
  }
  // Patient id (N_patient column)
  if (key === "N_patient") return sheetId_(payload.patientId ?? payload.N_patient);
  // Lower-snake clinical fields
  if (key === "LTSW_h") return payload.ltsw ?? payload.LTSW_h ?? "";
  if (key === "pre_mRS") return payload.premrs ?? payload.pre_mRS ?? "";
  if (key === "Age") return payload.age ?? payload.Age ?? "";
  if (key === "NIHSS") return payload.nihss ?? payload.NIHSS ?? "";
  if (CLINICAL_COLS.indexOf(key) >= 0) return clinicalValue_(payload[key]);
  if (STROKE_COLS.indexOf(key) >= 0) return strokeType_(payload.Stroke_type ?? payload.strokeType);

  // Missed / Eligible / Source (accetta CSV o array)
  if (key === "missed" || key === "missed_trials" || key === "missedTrials") {
    const v = payload.missed ?? payload.missed_trials ?? payload.missedTrials ?? "";
    return Array.isArray(v) ? v.join(",") : String(v || "");
  }
  if (key === "eligible" || key === "eligible_at_submit" || key === "eligibleAtSubmit") {
    const v = payload.eligible ?? payload.eligible_at_submit ?? payload.eligibleAtSubmit ?? "";
    return Array.isArray(v) ? v.join(",") : String(v || "");
  }
  if (key === "source") return payload.source || "";

  // Colonne trial: risoluzione uniforme via alias (NORAHOME, DOIT, NIVO,
  // TENACITY, ...). Default "no" se il paziente non e' arruolato.
  const canonical = canonicalTrialKey_(key);
  if (trialKeys.indexOf(canonical) >= 0) {
    return trialValue_(payload, canonical, key);
  }

  // Default: payload[key]
  const v = payload[key];
  return v == null ? "" : v;
}

// ---------- MODIFICA DI UN PAZIENTE GIA' INVIATO (op=update) ----------
//
// L'app corregge la riga esistente invece di aggiungerne una nuova. La riga si
// trova dal Timestamp originale + ID paziente COMPLETO: la lettura pubblica
// (doGet) espone solo l'ID mascherato, quindi chi non conosce l'ID non puo'
// modificare la riga. Si scrivono solo le colonne modificabili dall'app (dati
// base, tipo di ictus, studi, trattamenti acuti, note, missed); le altre
// colonne cliniche restano come al primo invio. Ogni cella cambiata finisce
// nella scheda "Edits" (vecchio e nuovo valore), e "Updated_at" dice quando.

const UPDATED_COL = "Updated_at";
const EDITS_SHEET = "Edits";
const EDITS_COLS = ["edited_at", "row_timestamp", "column", "old", "new"];
const UPDATE_BASE_COLS = ["N_patient", "Age", "NIHSS", "LTSW_h", "pre_mRS",
  "TEV", "mTICI", "TIV", "Notes", "Reversal", "Reversal_agent",
  "missed", "missed_trials", "missedTrials"];

function updatableCol_(key, trialKeys) {
  return UPDATE_BASE_COLS.indexOf(key) >= 0 || STROKE_COLS.indexOf(key) >= 0 ||
    trialKeys.indexOf(canonicalTrialKey_(key)) >= 0;
}

/** Testo di una cella come lo vede l'app (date in ISO, niente apostrofo). */
function cellText_(v) {
  if (v instanceof Date) return v.toISOString();
  return String(v == null ? "" : v).replace(/^'/, "");
}

/** Stesso istante (tolleranza 1 s: il foglio puo' perdere i millisecondi). */
function sameTime_(a, b) {
  const ta = a instanceof Date ? a.getTime() : Date.parse(String(a || ""));
  const tb = b instanceof Date ? b.getTime() : Date.parse(String(b || ""));
  return isFinite(ta) && isFinite(tb) && Math.abs(ta - tb) < 1000;
}

function ensureUpdatedColumn_(sh) {
  const lastCol = sh.getLastColumn();
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  if (headers.indexOf(UPDATED_COL) >= 0) return;
  sh.getRange(1, lastCol + 1, 1, 1).setValues([[UPDATED_COL]]).setFontWeight("bold");
}

function editsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(EDITS_SHEET);
  if (!sh) {
    sh = ss.insertSheet(EDITS_SHEET);
    sh.getRange(1, 1, 1, EDITS_COLS.length).setValues([EDITS_COLS]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function patientUpdate_(p) {
  const matchTs = String(p.matchTimestamp || "");
  const matchId = String(p.matchId == null ? "" : p.matchId).trim();
  if (!matchTs || !matchId) return ContentService.createTextOutput("error: update");
  // Un ID nuovo deve essere completo (mai la versione mascherata della lettura).
  const newId = String(p.N_patient == null ? "" : p.N_patient).trim();
  if (!newId || /^x{2,}/.test(newId)) return ContentService.createTextOutput("error: update");

  const sh = getSheet_();
  const trialKeys = knownTrialKeys_(p);
  ensureTrialColumns_(sh, trialKeys);
  ensureStrokeColumn_(sh);
  ensureUpdatedColumn_(sh);

  const lastCol = sh.getLastColumn();
  const lastRow = sh.getLastRow();
  if (lastRow < 2) return ContentService.createTextOutput("error: not found");
  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const tsCol = headers.indexOf("Timestamp") >= 0 ? headers.indexOf("Timestamp") : headers.indexOf("timestamp");
  const idCol = headers.indexOf("N_patient");
  if (tsCol < 0 || idCol < 0) return ContentService.createTextOutput("error: not found");

  const data = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();
  let rowIdx = -1;
  for (let i = 0; i < data.length; i++) {
    if (sameTime_(data[i][tsCol], matchTs) && cellText_(data[i][idCol]).trim() === matchId) { rowIdx = i; break; }
  }
  if (rowIdx < 0) return ContentService.createTextOutput("error: not found");

  const now = new Date().toISOString();
  const rowTs = cellText_(data[rowIdx][tsCol]);
  const edits = [];
  headers.forEach((key, c) => {
    if (!key) return;
    let next;
    if (key === UPDATED_COL) next = now;
    else if (updatableCol_(key, trialKeys)) next = cellValue_(key, p, trialKeys);
    else return;
    const oldText = cellText_(data[rowIdx][c]);
    const nextText = cellText_(next);
    if (oldText === nextText) return;
    sh.getRange(rowIdx + 2, c + 1).setValue(sheetText_(next));
    if (key !== UPDATED_COL) edits.push([now, rowTs, key, oldText, nextText].map(sheetText_));
  });
  if (edits.length) {
    const log = editsSheet_();
    log.getRange(log.getLastRow() + 1, 1, edits.length, EDITS_COLS.length).setValues(edits);
  }
  return ContentService.createTextOutput("ok");
}

// ---------- WRITE ----------
function doPost(e) {
  try {
    const payload = JSON.parse(e.parameter.payload || "{}");
    if (e.parameter.op === "prearrival" || payload.kind === "prearrival") return prePost_(payload);
    if (e.parameter.op === "board" || payload.kind === "board") return livePost_(payload);
    // Lock: due invii insieme non creano due volte le stesse colonne trial.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      if (e.parameter.op === "update" || payload.kind === "update") return patientUpdate_(payload);
      return patientPost_(payload);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}

function patientPost_(payload) {
  const sh = getSheet_();
  const trialKeys = knownTrialKeys_(payload);
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) {
    // Foglio totalmente vuoto: crea header iniziale completo
    const initialHeaders = [
      "Timestamp","N_patient","Age","NIHSS","LTSW_h","pre_mRS",
      ...trialKeys,
      "TEV","mTICI","TIV","Notes",
      "missed","eligible","source",
      "Stroke_type",
      ...CLINICAL_COLS
    ];
    sh.getRange(1, 1, 1, initialHeaders.length).setValues([initialHeaders]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }

  // Colonne trial nuove (dichiarate dall'app) create al volo prima di scrivere.
  ensureTrialColumns_(sh, trialKeys);
  ensureStrokeColumn_(sh);
  ensureClinicalColumns_(sh);

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h || "").trim());

  const row = headers.map(col => {
    const key = String(col || "").trim();
    return key ? cellValue_(key, payload, trialKeys) : "";
  });
  sh.appendRow(row.map(sheetText_));
  return ContentService.createTextOutput("ok");
}

// ---------- READ ----------
function doGet(e) {
  const op = (e && e.parameter && e.parameter.op) || "list";
  if (op === "prearrivals") return preList_();
  if (op === "boards") return liveList_();
  // Lo script sa modificare un paziente gia' inviato (op=update): l'app lo
  // chiede prima di mandare una modifica, uno script vecchio aggiungerebbe
  // una riga nuova invece di correggere quella esistente.
  if (op === "caps") return jsonOut({ v: 1, update: true });
  if (op !== "list") return jsonOut([]);

  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return jsonOut([]);

  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const trialKeys = knownTrialKeys_();
  const data = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();

  const rows = data.map((r, idx) => {
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = r[i]; });
    if (obj.N_patient != null && obj.N_patient !== "") obj.N_patient = maskId_(obj.N_patient);
    if (obj.patientId != null && obj.patientId !== "") obj.patientId = maskId_(obj.patientId);

    // id univoco per la sync
    if (!obj.id) {
      obj.id = obj.Timestamp || obj.timestamp || ("row-" + (idx + 2));
    }
    // Timestamp ISO
    if (obj.Timestamp instanceof Date) obj.Timestamp = obj.Timestamp.toISOString();
    if (obj[UPDATED_COL] instanceof Date) obj[UPDATED_COL] = obj[UPDATED_COL].toISOString();
    obj.timestamp = obj.Timestamp || obj.timestamp || null;

    // Trial arruolati: deriva dalle colonne se non c'e' un campo trials esplicito.
    // Riconosce sia il nome canonico (NORAHOME, TENACITY) sia gli alias.
    if (!obj.trials || obj.trials === "") {
      obj.trials = trialKeys.filter(k => {
        const candidates = trialVariants_(k).map(name => obj[name]);
        return candidates.some(v =>
          v != null && String(v).trim() !== "" &&
          String(v).toLowerCase() !== "no" &&
          String(v).toLowerCase() !== "false" &&
          String(v) !== "0"
        );
      });
    } else if (typeof obj.trials === "string") {
      obj.trials = obj.trials.split(",").map(s => s.trim()).filter(Boolean);
    }

    // Tipo di ictus per l'app (statistiche ischemici / emorragici).
    obj.strokeType = rowStrokeType_(obj);

    // Missed CSV -> array
    const rawMissed = obj.missed ?? obj.missed_trials ?? obj.missedTrials ?? "";
    obj.missed = typeof rawMissed === "string"
      ? rawMissed.split(",").map(s => s.trim()).filter(Boolean)
      : Array.isArray(rawMissed) ? rawMissed : [];

    // Eligible CSV -> array
    const rawEligible = obj.eligible ?? obj.eligible_at_submit ?? obj.eligibleAtSubmit ?? "";
    obj.eligible = typeof rawEligible === "string"
      ? rawEligible.split(",").map(s => s.trim()).filter(Boolean)
      : Array.isArray(rawEligible) ? rawEligible : [];

    // Numeric coercion
    ["Age","NIHSS","LTSW_h","pre_mRS","age","nihss","ltsw","premrs","ASPECTS","GCS","Hematoma_mL","RACE"].forEach(k => {
      if (obj[k] === "" || obj[k] == null) return;
      const n = Number(obj[k]);
      if (!isNaN(n)) obj[k] = n;
    });

    return obj;
  });
  return jsonOut(rows);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
