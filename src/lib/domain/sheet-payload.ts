// Costruzione payload Google Sheets. INVARIANTE per compatibilita' backend
// (Apps Script GAS_URL). Snapshot test in tests/domain/sheet-payload.test.ts.

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbza3_tPpr34MxzXOkMjRpPgAH_5O2Ws8TZAdBv6ux3AYh4IKo4jQNbbYL_hZs4Q4YK3/exec";

export const SHEET_TRIAL_KEYS = [
  "WeTrust",
  "MARSS",
  "ATHENA",
  "VANISH",
  "PIVOTAL",
  "MOSTE",
  "FASTEST",
  "TICH3",
  "LIBREXIA",
  "TWIN2WIN",
  "ARTEMIS",
  "HYBERNIA",
  "DONESYMPLE",
  "SAFERDOAC",
  "SHIONOGI",
  "SOVATELTIDE",
  "ORION",
  "DOIT",
  "REMEDY",
  "PROMISE",
  "NIVO",
] as const;

export type SheetTrialKey = (typeof SHEET_TRIAL_KEYS)[number];
export type SheetTrialValue = "no" | "si" | "intervention" | "control";

const NAME_TO_KEY: Record<string, SheetTrialKey> = {
  WeTrust: "WeTrust",
  MARSS: "MARSS",
  ATHENA: "ATHENA",
  VANISH: "VANISH",
  PIVOTAL: "PIVOTAL",
  MOSTE: "MOSTE",
  FASTEST: "FASTEST",
  "TICH-3": "TICH3",
  Librexia: "LIBREXIA",
  "TWIN-2-WIN 2": "TWIN2WIN",
  ARTEMIS: "ARTEMIS",
  HYBERNIA: "HYBERNIA",
  "DONE SYMPLE": "DONESYMPLE",
  "SAFER-DOAC": "SAFERDOAC",
  SHIONOGI: "SHIONOGI",
  SOVATELTIDE: "SOVATELTIDE",
  ORION: "ORION",
  "DO-IT": "DOIT",
  REMEDY: "REMEDY",
  PROMISE: "PROMISE",
  NiVO: "NIVO",
};

const STUDIES_WITHOUT_ARM = new Set(["SAFER-DOAC", "FASTEST", "TICH-3", "NiVO", "REMEDY"]);

export function normalizeStudyName(name: string): string {
  if (name === "SaferDoac") return "SAFER-DOAC";
  if (name === "DOIT") return "DO-IT";
  if (name === "TICH3") return "TICH-3";
  return name || "";
}

export function hasKnownStudyArm(name: string): boolean {
  return !STUDIES_WITHOUT_ARM.has(normalizeStudyName(name));
}

export type StudyOutcomes = Record<string, "intervention" | "control" | undefined>;

export function buildTrialsForSheet(
  selectedStudies: string[],
  studyOutcomes: StudyOutcomes = {}
): Record<SheetTrialKey, SheetTrialValue> {
  const t = Object.fromEntries(
    SHEET_TRIAL_KEYS.map((k) => [k, "no" as SheetTrialValue])
  ) as Record<SheetTrialKey, SheetTrialValue>;

  for (const name of selectedStudies) {
    const key = NAME_TO_KEY[name];
    if (!key) continue;
    if (!hasKnownStudyArm(name)) {
      t[key] = "si";
    } else {
      t[key] = studyOutcomes[name] ?? "intervention";
    }
  }

  if (!selectedStudies.includes("SAFER-DOAC")) t.SAFERDOAC = "no";

  return t;
}

export async function sendToSheet(payload: unknown): Promise<void> {
  try {
    const body = new URLSearchParams({ payload: JSON.stringify(payload) });
    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
  } catch (e) {
    console.warn("sendToSheet error:", e);
  }
}

/**
 * Forma minimale di un record letto dal backend (Apps Script doGet).
 * I campi sono opzionali per resilienza: il backend puo' evolvere
 * senza rompere il client.
 */
export interface SheetPatientRow {
  id?: string;
  timestamp?: string;
  patientId?: string;
  age?: number;
  nihss?: number;
  premrs?: number;
  ltsw?: number;
  strokeType?: string;
  /** Trial arruolati: ["WeTrust","ATHENA",...] */
  trials?: string[];
  /** Missed trials: eligibili NON arruolati. */
  missed?: string[];
  TEV?: string;
  mTICI?: string;
  TIV?: string;
  Notes?: string;
  /** Per ogni SHEET_TRIAL_KEYS contiene "no" | "si" | "intervention" | "control". */
  [trialKey: string]: unknown;
}

/**
 * Legge tutti i pazienti dal backend Apps Script (richiede un doGet
 * configurato lato Sheet). Ritorna [] se l'endpoint non risponde o
 * non e' configurato; non blocca l'app.
 */
export async function fetchPatientsFromSheet(): Promise<SheetPatientRow[]> {
  try {
    // L'endpoint doGet del GAS deve servire JSON con CORS abilitato:
    // return ContentService.createTextOutput(JSON.stringify(rows))
    //   .setMimeType(ContentService.MimeType.JSON);
    const res = await fetch(GAS_URL + "?op=list", { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as SheetPatientRow[]) : [];
  } catch (e) {
    console.warn("fetchPatientsFromSheet error:", e);
    return [];
  }
}
