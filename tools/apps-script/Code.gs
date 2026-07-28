// === Eligo backend — schema dinamico + supporto missed/eligible/source ===
//
// Copia di lavoro dello script Apps Script legato allo spreadsheet
// EnsApp_Data. Sorgente di verita' operativa = editor Apps Script; questo
// file serve a versionare le modifiche insieme al client.
//
// Trial supportati: 23 chiavi (incluso TENACITY).
//
// NOTA: le colonne dei trial mancanti nel foglio vengono create in automatico
// al primo doPost (ensureTrialColumns_). Senza quella colonna l'arruolamento
// verrebbe scartato in silenzio, perche' la riga si costruisce leggendo le
// intestazioni.

const SHEET_NAME = ""; // "" = primo foglio dello spreadsheet

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (SHEET_NAME) {
    const named = ss.getSheetByName(SHEET_NAME);
    if (named) return named;
  }
  return ss.getSheets()[0];
}

// 23 trial keys — include NORAHOME e TENACITY
const TRIAL_KEYS = ["WeTrust","MARSS","ATHENA","VANISH","PIVOTAL","MOSTE","FASTEST",
  "TICH3","LIBREXIA","TWIN2WIN","ARTEMIS","HYBERNIA","DONESYMPLE","SAFERDOAC",
  "SHIONOGI","SOVATELTIDE","ORION","DOIT","REMEDY","PROMISE","NIVO","NORAHOME",
  "TENACITY"];

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
  "TNK": "TENACITY"
};

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
 * Aggiunge in coda le colonne dei trial mancanti (es. TENACITY al primo invio
 * dopo l'aggiornamento dell'app), cosi' non serve un passo manuale sul foglio.
 * Gli alias contano come presenti: "DO  IT" vale DOIT, "NiVO" vale NIVO.
 */
function ensureTrialColumns_(sh) {
  const lastCol = sh.getLastColumn();
  if (lastCol === 0) return;

  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const present = {};
  headers.forEach(h => { if (h) present[canonicalTrialKey_(h)] = true; });

  const missing = TRIAL_KEYS.filter(k => !present[k]);
  if (missing.length === 0) return;

  sh.getRange(1, lastCol + 1, 1, missing.length)
    .setValues([missing])
    .setFontWeight("bold");
}

// ---------- WRITE ----------
function doPost(e) {
  try {
    const payload = JSON.parse(e.parameter.payload || "{}");
    const sh = getSheet_();
    const lastCol = sh.getLastColumn();
    if (lastCol === 0) {
      // Foglio totalmente vuoto: crea header iniziale completo
      const initialHeaders = [
        "Timestamp","N_patient","Age","NIHSS","LTSW_h","pre_mRS",
        ...TRIAL_KEYS,
        "TEV","mTICI","TIV","Notes",
        "missed","eligible","source"
      ];
      sh.getRange(1, 1, 1, initialHeaders.length).setValues([initialHeaders]).setFontWeight("bold");
      sh.setFrozenRows(1);
    }

    // Colonne trial nuove (es. TENACITY) create al volo prima di scrivere.
    ensureTrialColumns_(sh);

    const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(h => String(h || "").trim());

    const row = headers.map(col => {
      const key = String(col || "").trim();
      if (!key) return "";

      // Timestamp
      if (key === "Timestamp" || key === "timestamp") {
        return payload.timestamp || payload.Timestamp || new Date().toISOString();
      }
      // Patient id (N_patient column)
      if (key === "N_patient") return payload.patientId ?? payload.N_patient ?? "";
      // Lower-snake clinical fields
      if (key === "LTSW_h") return payload.ltsw ?? payload.LTSW_h ?? "";
      if (key === "pre_mRS") return payload.premrs ?? payload.pre_mRS ?? "";
      if (key === "Age") return payload.age ?? payload.Age ?? "";
      if (key === "NIHSS") return payload.nihss ?? payload.NIHSS ?? "";

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
      if (TRIAL_KEYS.indexOf(canonical) >= 0) {
        return trialValue_(payload, canonical, key);
      }

      // Default: payload[key]
      const v = payload[key];
      return v == null ? "" : v;
    });
    sh.appendRow(row);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}

// ---------- READ ----------
function doGet(e) {
  const op = (e && e.parameter && e.parameter.op) || "list";
  if (op !== "list") return jsonOut([]);

  const sh = getSheet_();
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow < 2 || lastCol < 1) return jsonOut([]);

  const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h || "").trim());
  const data = sh.getRange(2, 1, lastRow - 1, lastCol).getValues();

  const rows = data.map((r, idx) => {
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = r[i]; });

    // id univoco per la sync
    if (!obj.id) {
      obj.id = obj.Timestamp || obj.timestamp || ("row-" + (idx + 2));
    }
    // Timestamp ISO
    if (obj.Timestamp instanceof Date) obj.Timestamp = obj.Timestamp.toISOString();
    obj.timestamp = obj.Timestamp || obj.timestamp || null;

    // Trial arruolati: deriva dalle colonne se non c'e' un campo trials esplicito.
    // Riconosce sia il nome canonico (NORAHOME, TENACITY) sia gli alias.
    if (!obj.trials || obj.trials === "") {
      obj.trials = TRIAL_KEYS.filter(k => {
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
    ["Age","NIHSS","LTSW_h","pre_mRS","age","nihss","ltsw","premrs"].forEach(k => {
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
