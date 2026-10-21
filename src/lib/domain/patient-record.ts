// Messaggio condiviso (WhatsApp / copia) e riga del foglio per un paziente.
// Usati da Share.svelte.
// NON contiene logica clinica.

import { buildTrialsForSheet, hasKnownStudyArm, SHEET_TRIAL_KEYS_CSV, type StudyOutcomes } from "./sheet-payload";
import { VESSEL_OPTIONS } from "./vessels";
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
  /** Emorragia: reversione dell'anticoagulazione e farmaco usato. */
  reversal?: string;
  reversalAgent?: string;
  /** Dettagli clinici per il messaggio (non vanno nel foglio). */
  wakeup?: boolean;
  targetVessels?: string[];
  tandem?: string;
  aspects?: number;
  evtCandidate?: string;
  ivtCandidate?: string;
  gcs?: number;
  hemVolume?: number;
  anticoag?: string;
  secondaryCause?: string;
  spotSign?: string;
}

/** Farmaci di reversione (etichette per messaggio e foglio, come nei protocolli). */
export const REVERSAL_LABEL: Record<string, string> = {
  idarucizumab: "idarucizumab",
  andexanet: "andexanet alfa",
  pcc: "PCC",
  vitk: "vitamin K",
  ffp: "FFP",
  protamine: "protamine",
  other: "other",
};

const yesNo = (v: string | undefined) => (v === "eligible" || v === "yes" ? "yes" : v === "not eligible" || v === "no" ? "no" : undefined);

/** Righe cliniche del messaggio: sede dell'occlusione, ASPECTS, candidature, dati dell'emorragia. */
function clinicalLines(r: PatientRecord): string[] {
  const lines: string[] = [];
  if (r.wakeup) lines.push("Onset: wake-up / unknown (LTSW from last seen well)");
  if (Array.isArray(r.targetVessels)) {
    const sites = r.targetVessels.map((v) => VESSEL_OPTIONS.find((o) => o.value === v)?.label ?? v);
    if (r.tandem === "yes") sites.push("extracranial ICA/CCA (tandem)");
    lines.push(`Occlusion: ${sites.length ? sites.join(" + ") : "none"}`);
  } else if (r.tandem === "yes") {
    lines.push("Occlusion: extracranial ICA/CCA (tandem)");
  }
  if (r.aspects != null) lines.push(`ASPECTS: ${r.aspects}`);
  const evt = yesNo(r.evtCandidate);
  if (evt) lines.push(`EVT candidate: ${evt}`);
  const ivt = yesNo(r.ivtCandidate);
  if (ivt) lines.push(`IVT candidate: ${ivt}`);
  if (r.gcs != null) lines.push(`GCS: ${r.gcs}`);
  if (r.hemVolume != null) lines.push(`Hematoma volume: ${r.hemVolume} mL`);
  if (r.anticoag) lines.push(`Anticoagulation: ${r.anticoag}`);
  if (r.secondaryCause) lines.push(`Secondary cause: ${r.secondaryCause}`);
  const spot = yesNo(r.spotSign);
  if (spot) lines.push(`Spot sign: ${spot}`);
  return lines;
}

export function buildShareMessage(r: PatientRecord): string {
  const lines: string[] = [];
  if (r.patientId) lines.push(`Patient ID: ${maskPatientId(r.patientId)}`);
  if (r.age != null) lines.push(`Age: ${r.age}`);
  if (r.nihss != null) lines.push(`NIHSS: ${r.nihss}`);
  if (r.premrs != null) lines.push(`pre-mRS: ${r.premrs}`);
  if (r.ltswHours != null) lines.push(`LTSW: ${fmtHoursAsClock(r.ltswHours)}`);
  if (r.strokeType) lines.push(`Stroke type: ${r.strokeType}`);
  lines.push(...clinicalLines(r));

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
  if (r.reversal) extras.push(`Anticoagulation reversal: ${r.reversal}${r.reversalAgent ? ` (${REVERSAL_LABEL[r.reversalAgent] ?? r.reversalAgent})` : ""}`);
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
    // Salvate quando il foglio ha le colonne "Reversal" e "Reversal_agent".
    Reversal: r.reversal ?? "",
    Reversal_agent: r.reversalAgent ? REVERSAL_LABEL[r.reversalAgent] ?? r.reversalAgent : "",
    Notes: r.notes,
    missed_trials: missed.join(","),
    eligible_at_submit: eligibleNow.join(","),
    source,
  };
  return { payload, missed };
}
