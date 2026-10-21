// Messaggio condiviso (WhatsApp / copia) e riga del foglio per un paziente.
// Usati da Share.svelte.
// NON contiene logica clinica.

import { buildTrialsForSheet, hasKnownStudyArm, SHEET_TRIAL_KEYS_CSV, type StudyOutcomes } from "./sheet-payload";
import { fmtHoursAsClock } from "$lib/utils/time";
import { maskPatientId } from "$lib/utils/mask";

export interface PatientRecord {
  patientId?: string;
  age?: number;
  nihss?: number;
  premrs?: number;
  ltswHours?: number;
  strokeType?: string;
  selected: string[];
  outcomes: StudyOutcomes;
  notes: string;
  /** Trattamenti acuti (Share): "" se non indicati. */
  tev?: string;
  mtici?: string;
  tiv?: string;
}

export function buildShareMessage(r: PatientRecord): string {
  const lines: string[] = [];
  if (r.patientId) lines.push(`Patient ID: ${maskPatientId(r.patientId)}`);
  if (r.age != null) lines.push(`Age: ${r.age}`);
  if (r.nihss != null) lines.push(`NIHSS: ${r.nihss}`);
  if (r.premrs != null) lines.push(`pre-mRS: ${r.premrs}`);
  if (r.ltswHours != null) lines.push(`LTSW: ${fmtHoursAsClock(r.ltswHours)}`);
  if (r.strokeType) lines.push(`Stroke type: ${r.strokeType}`);

  if (r.selected.length > 0) {
    lines.push("");
    lines.push("Selected trials:");
    for (const name of r.selected) {
      if (hasKnownStudyArm(name)) {
        lines.push(`- ${name}: ${r.outcomes[name] ?? "intervention"}`);
      } else {
        lines.push(`- ${name}`);
      }
    }
  }

  const extras: string[] = [];
  if (r.tev) extras.push(`TEV: ${r.tev}`);
  if (r.mtici) extras.push(`mTICI: ${r.mtici}`);
  if (r.tiv) extras.push(`TIV: ${r.tiv}`);
  if (extras.length > 0) {
    lines.push("");
    lines.push("Acute treatments:");
    for (const e of extras) lines.push(`- ${e}`);
  }

  if (r.notes.trim()) {
    lines.push("");
    lines.push(`Notes: ${r.notes.trim()}`);
  }
  return lines.join("\n");
}

/**
 * Riga per il foglio EnsApp_Data. `eligibleNow`: trial eleggibili e aperti al
 * momento dell'invio; quelli non selezionati diventano "missed".
 */
export function buildSheetPayload(
  r: PatientRecord,
  eligibleNow: string[],
  source: string,
  timestamp: string = new Date().toISOString()
): { payload: Record<string, unknown>; missed: string[] } {
  const sheetTrials = buildTrialsForSheet(r.selected, r.outcomes);
  const enrolledSet = new Set(r.selected);
  const missed = eligibleNow.filter((name) => !enrolledSet.has(name));
  const payload = {
    // Le chiavi DEVONO combaciare ESATTAMENTE (case-sensitive) con le
    // intestazioni di colonna del foglio EnsApp_Data: il backend Apps
    // Script scrive ogni colonna leggendo payload[nomeColonna]. Nomi come
    // patientId/age/nihss/premrs/ltsw/timestamp non combaciavano e finivano
    // vuoti nel DB (ID paziente, NIHSS, mRS, LTSW, data mancanti).
    Timestamp: timestamp,
    N_patient: r.patientId,
    Age: r.age,
    NIHSS: r.nihss,
    LTSW_h: r.ltswHours,
    pre_mRS: r.premrs,
    ...sheetTrials,
    // Colonne trial con intestazioni non normalizzate nel foglio:
    "DO  IT": sheetTrials.DOIT,
    NiVO: sheetTrials.NIVO,
    // Elenco dei trial: il backend crea da qui le colonne che mancano.
    trialKeys: SHEET_TRIAL_KEYS_CSV,
    TEV: r.tev ?? "",
    mTICI: r.mtici ?? "",
    TIV: r.tiv ?? "",
    Notes: r.notes,
    missed_trials: missed.join(","),
    eligible_at_submit: eligibleNow.join(","),
    source,
  };
  return { payload, missed };
}
