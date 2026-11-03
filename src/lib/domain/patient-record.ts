// Messaggio condiviso (WhatsApp / copia) e riga del foglio per un paziente.
// Usati da Share.svelte.
// NON contiene logica clinica.

import { buildTrialsForSheet, hasKnownStudyArm, SHEET_TRIAL_KEYS_CSV, type StudyOutcomes } from "./sheet-payload";
import { VESSEL_OPTIONS } from "./vessels";
import { buildClinicalColumns, type SheetSources } from "./sheet-columns";
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
  /** Paziente registrato (non acuto): quando e' stato visto e da dove viene l'LTSW. */
  seen?: string;
  seenAt?: string;
  ltswDetail?: string;
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
  /** Ischemico: DOAC assunto (preData.doac) e antitrombotici riferiti dal SEM. */
  doac?: string;
  antithrombotics?: string[];
  secondaryCause?: string;
  spotSign?: string;
  /** Dati completi degli store (pre / post / hem) per le colonne cliniche del foglio. */
  sheetData?: SheetSources;
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

const ANTI_TEXT: Record<string, string> = { none: "none", antiplatelet: "antiplatelet", doac: "DOAC", warfarin: "VKA", lmwh: "LMWH/heparin" };

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
  else if (r.antithrombotics?.length) lines.push(`Antithrombotics: ${r.antithrombotics.map((a) => ANTI_TEXT[a] ?? a).join(" + ")}`);
  else if (yesNo(r.doac)) lines.push(`DOAC: ${yesNo(r.doac)}`);
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
  if (r.seen) lines.push(`Seen: ${r.seen}`);
  if (r.ltswHours != null) {
    lines.push(`LTSW${r.seen ? " at evaluation" : ""}: ${fmtHoursAsClock(r.ltswHours)}${r.ltswDetail ? ` (${r.ltswDetail})` : ""}`);
  }
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
  const strokeType = r.strokeType === "ischemic" || r.strokeType === "hemorrhagic" ? r.strokeType : "";
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
    // Tipo di ictus: "ischemic" | "hemorrhagic" ("" se non indicato). Nel foglio
    // DB la colonna e' "Ischemic/Haemorragic"; "Stroke_type" e' il nome usato
    // dallo script quando la colonna manca e deve crearla.
    Stroke_type: strokeType,
    "Ischemic/Haemorragic": strokeType,
    ...sheetTrials,
    // Colonne trial con intestazioni non normalizzate nel foglio:
    "DO  IT": sheetTrials.DOIT,
    NiVO: sheetTrials.NIVO,
    // Elenco dei trial: il backend crea da qui le colonne che mancano.
    trialKeys: SHEET_TRIAL_KEYS_CSV,
    TEV: r.tev ?? "",
    mTICI: r.mtici ?? "",
    TIV: r.tiv ?? "",
    // Colonne cliniche in coda (SHEET_CLINICAL_COLS): lo script le crea se mancano.
    ...buildClinicalColumns(r.sheetData ?? {}, r.strokeType, {
      Reversal: r.reversal ?? "",
      Reversal_agent: r.reversalAgent ? REVERSAL_LABEL[r.reversalAgent] ?? r.reversalAgent : "",
      // Paziente registrato: data della valutazione.
      Seen_at: r.seenAt ?? "",
    }),
    Notes: r.notes,
    missed_trials: missed.join(","),
    eligible_at_submit: eligibleNow.join(","),
    source,
  };
  return { payload, missed };
}
