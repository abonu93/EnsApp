// Costruzione payload Google Sheets. INVARIANTE per compatibilita' backend
// (Apps Script GAS_URL). Snapshot test in tests/domain/sheet-payload.test.ts.

import { canonicalTrialName } from "./trials-info";
import { maskPatientId } from "$lib/utils/mask";

export const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxt9NhlJbn5n6d06_aKFW-a76pYqpe-86xedfNKI6MIkexDOSjLnTSZd56Nau9y12Lf/exec";

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
  "NORAHOME",
  "TENACITY",
  "SAILMEVO",
] as const;

export type SheetTrialKey = (typeof SHEET_TRIAL_KEYS)[number];

/**
 * Elenco CSV delle chiavi trial, inviato nel payload come `trialKeys`.
 * L'Apps Script crea le colonne mancanti partendo da questo elenco, quindi un
 * trial nuovo non richiede piu' di aggiornare e rideployare lo script.
 */
export const SHEET_TRIAL_KEYS_CSV = SHEET_TRIAL_KEYS.join(",");
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
  "NORA HOME": "NORAHOME",
  TENACITY: "TENACITY",
  "SAIL-MeVO": "SAILMEVO",
};

/**
 * Disegno dello studio (schede del vault, vault/ensayos/*): decide se al
 * momento dell'arruolamento si conosce il braccio.
 * - "open": randomizzato in aperto (anche PROBE): si registra intervention/control;
 * - "blinded": in cieco contro placebo, il braccio non si conosce;
 * - "single-arm": non randomizzato, nessun braccio di controllo;
 * - "unknown": nessun documento (SAFER-DOAC).
 * Gli studi non elencati sono "open". Gli studi chiusi o in pausa restano come
 * nel legacy (non selezionabili; da rivedere se riaprono).
 */
export type StudyDesign = "open" | "blinded" | "single-arm" | "unknown";
const STUDY_DESIGN: Record<string, StudyDesign> = {
  FASTEST: "blinded", // rFVIIa vs placebo, doppio cieco
  "TICH-3": "blinded", // acido tranexamico vs placebo, in cieco
  REMEDY: "blinded", // DM199 vs placebo, doppio cieco
  SOVATELTIDE: "blinded", // sovateltide vs placebo, doppio cieco
  NiVO: "single-arm", // iNstroke 4F, braccio singolo
  PIVOTAL: "single-arm", // RapidPulse, braccio singolo
  "SAFER-DOAC": "unknown",
};
const DESIGN_BY_CANON: Record<string, StudyDesign> = Object.fromEntries(
  Object.entries(STUDY_DESIGN).map(([name, d]) => [canonicalTrialName(name), d])
);

export function studyDesign(name: string): StudyDesign {
  return DESIGN_BY_CANON[canonicalTrialName(normalizeStudyName(name))] ?? "open";
}

export function normalizeStudyName(name: string): string {
  if (name === "SaferDoac") return "SAFER-DOAC";
  if (name === "DOIT") return "DO-IT";
  if (name === "TICH3") return "TICH-3";
  return name || "";
}

/** Si registra intervention/control solo per gli studi randomizzati in aperto. */
export function hasKnownStudyArm(name: string): boolean {
  return studyDesign(name) === "open";
}

// Per la colonna del foglio si accetta anche la chiave di TRIALS_INFO
// (es. "Twin2Win2", "DOIT", "Orion" dalla registrazione rapida), confrontata
// ignorando maiuscole, spazi e trattini. Prima questi nomi venivano scartati
// in silenzio e la colonna restava "no".
const SHEET_KEY_BY_CANON: Record<string, SheetTrialKey> = Object.fromEntries(
  Object.entries(NAME_TO_KEY).map(([name, key]) => [canonicalTrialName(name), key])
);

function findSheetKey(name: string): SheetTrialKey | undefined {
  return NAME_TO_KEY[name] ?? SHEET_KEY_BY_CANON[canonicalTrialName(name)];
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
    const key = findSheetKey(name);
    if (!key) continue;
    if (!hasKnownStudyArm(name)) {
      t[key] = "si";
    } else {
      t[key] = studyOutcomes[name] ?? "intervention";
    }
  }

  if (!selectedStudies.some((n) => findSheetKey(n) === "SAFERDOAC")) t.SAFERDOAC = "no";

  return t;
}

/**
 * Esito dell'invio. La POST e' `no-cors` (risposta illeggibile), quindi prima
 * l'app diceva sempre "salvato" anche se il foglio non riceveva nulla. Ora,
 * dopo l'invio, rilegge il foglio (doGet) e cerca la riga appena scritta.
 * - confirmed: riga trovata nel foglio;
 * - not-found: il foglio risponde ma la riga non c'e';
 * - unverified: inviato, ma il foglio non si e' potuto rileggere;
 * - failed: la richiesta non e' partita (rete).
 */
export type SendStatus = "confirmed" | "not-found" | "unverified" | "failed";
export interface SendResult {
  status: SendStatus;
  reason?: string;
}

/** Attese prima di ogni rilettura (lo script scrive dopo qualche secondo). */
const VERIFY_DELAYS_MS = [1500, 3500];
/** Scarto ammesso fra il Timestamp inviato e quello riletto dal foglio. */
const TIMESTAMP_TOLERANCE_MS = 10 * 60_000;

type SheetPayload = Record<string, unknown> & { Timestamp?: string; N_patient?: unknown };

/** La riga del foglio corrisponde al record inviato? */
export function rowMatchesPayload(row: SheetPatientRow, payload: SheetPayload): boolean {
  const sent = Date.parse(String(payload.Timestamp ?? ""));
  const got = Date.parse(String(row.timestamp ?? row.Timestamp ?? ""));
  if (!Number.isFinite(sent) || !Number.isFinite(got) || Math.abs(sent - got) > TIMESTAMP_TOLERANCE_MS) {
    return false;
  }
  const id = String(payload.N_patient ?? "").trim();
  // Lo script nuovo rilegge l'ID mascherato (xxxx123), quello vecchio completo.
  if (id) {
    const got = String(row.N_patient ?? "").trim();
    return got === id || got === maskPatientId(id);
  }
  return String(row.Age ?? "") === String(payload.Age ?? "") && String(row.NIHSS ?? "") === String(payload.NIHSS ?? "");
}

export async function sendToSheet(
  payload: SheetPayload,
  verifyDelaysMs: number[] = VERIFY_DELAYS_MS
): Promise<SendResult> {
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
    return { status: "failed", reason: e instanceof Error ? e.message : String(e) };
  }

  let readOk = false;
  let reason = "";
  for (const ms of verifyDelaysMs) {
    await new Promise((r) => setTimeout(r, ms));
    const res = await fetchPatientsFromSheet();
    if (!res.ok) {
      reason = res.reason;
      continue;
    }
    readOk = true;
    if (res.rows.some((row) => rowMatchesPayload(row, payload))) return { status: "confirmed" };
  }
  return readOk ? { status: "not-found" } : { status: "unverified", reason };
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

export type FetchResult =
  | { ok: true; rows: SheetPatientRow[] }
  | { ok: false; reason: string };

/**
 * Legge tutti i pazienti dal backend Apps Script (richiede un doGet
 * configurato lato Sheet). Distingue tra "fetch OK ma sheet vuoto"
 * (ok: true, rows: []) e "errore di rete/CORS/HTTP" (ok: false).
 * Timeout 10s per evitare hang dietro al redirect 302 di Apps Script.
 */
export async function fetchPatientsFromSheet(): Promise<FetchResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(GAS_URL + "?op=list", {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      return { ok: false, reason: "HTTP " + res.status };
    }
    const data = await res.json();
    const rows = Array.isArray(data) ? (data as SheetPatientRow[]) : [];
    return { ok: true, rows };
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("fetchPatientsFromSheet error:", e);
    return { ok: false, reason: msg };
  }
}
