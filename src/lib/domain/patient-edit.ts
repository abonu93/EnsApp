// Modifica di un paziente gia' salvato: bozza dei campi modificabili, payload
// "op=update" per il foglio (Code.gs, patientUpdate_) e record locale aggiornato.
// Si modificano i dati che l'app registra al momento dell'invio: dati base,
// tipo di ictus, studi (con braccio), trattamenti acuti, note. Le colonne
// cliniche di dettaglio (imaging, criteri) restano quelle del primo invio.
// NON contiene logica clinica.

import type { SavedPatient } from "$lib/stores/savedPatients";
import { buildTrialsForSheet, hasKnownStudyArm, SHEET_TRIAL_KEYS_CSV } from "./sheet-payload";
import { REVERSAL_LABEL } from "./patient-record";
import { maskPatientId } from "$lib/utils/mask";

export type YesNo = "Yes" | "No" | "";
export type Arm = "intervention" | "control";

export interface EditDraft {
  patientId: string;
  age: number | null;
  nihss: number | null;
  premrs: number | null;
  /** LTSW in ore al momento della valutazione (colonna LTSW_h). */
  ltswH: number | null;
  strokeType: "ischemic" | "hemorrhagic" | "";
  studies: string[];
  outcomes: Record<string, Arm>;
  tev: YesNo;
  mtici: string;
  tiv: YesNo;
  reversal: YesNo;
  reversalAgent: string;
  notes: string;
}

export const MTICI_VALUES = ["0", "1", "2a", "2b50", "2b67", "2c", "3"] as const;
export const REVERSAL_AGENTS = ["idarucizumab", "andexanet", "pcc", "vitk", "ffp", "protamine", "other"] as const;

const yn = (v: unknown): YesNo => {
  const s = String(v ?? "").trim().toLowerCase();
  return s === "yes" || s === "si" || s === "sí" ? "Yes" : s === "no" ? "No" : "";
};

/** Chiave del farmaco di reversione dall'etichetta scritta nel foglio. */
export function reversalAgentKey(v: string | undefined): string {
  if (!v) return "";
  if (v in REVERSAL_LABEL) return v;
  return Object.entries(REVERSAL_LABEL).find(([, label]) => label.toLowerCase() === v.toLowerCase())?.[0] ?? "other";
}

/** L'ID del record e' quello mascherato della lettura pubblica (xxxx123)? */
export function isMaskedId(id: string | undefined): boolean {
  return !!id && /^x{2,}/.test(id);
}

/** LTSW in ore del record: valore salvato, altrimenti dalla data LSW all'invio. */
export function savedLtswHours(p: SavedPatient): number | undefined {
  if (p.ltswH != null) return p.ltswH;
  if (p.snapshot.pre.ltsw != null) return p.snapshot.pre.ltsw;
  const from = Date.parse(p.snapshot.pre.ltswDate ?? "");
  const to = Date.parse(p.sheetTs ?? p.savedAt);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return undefined;
  return Math.round(((to - from) / 3_600_000) * 100) / 100;
}

export function draftFromSaved(p: SavedPatient): EditDraft {
  const ex = p.snapshot.extras;
  const studies = [...(p.snapshot.studies?.length ? p.snapshot.studies : p.trials)];
  const outcomes: Record<string, Arm> = {};
  for (const name of studies) {
    if (hasKnownStudyArm(name)) outcomes[name] = p.snapshot.outcomes[name] ?? "intervention";
  }
  return {
    // L'ID mascherato non si puo' rimandare al foglio: va riscritto completo.
    patientId: isMaskedId(p.patientId) ? "" : p.patientId ?? "",
    age: p.age ?? p.snapshot.pre.age ?? null,
    nihss: p.nihss ?? p.snapshot.pre.nihss ?? null,
    premrs: p.snapshot.pre.premrs ?? null,
    ltswH: savedLtswHours(p) ?? null,
    strokeType: p.strokeType || p.snapshot.post.strokeType || "",
    studies,
    outcomes,
    tev: yn(ex.tev),
    mtici: ex.mtici ?? "",
    tiv: yn(ex.tiv),
    reversal: yn(ex.reversal),
    reversalAgent: reversalAgentKey(ex.reversalAgent),
    notes: p.snapshot.notes ?? "",
  };
}

export type DraftProblem = "id-missing" | "id-mismatch" | "mtici-missing" | "not-synced";

/** Problemi che impediscono il salvataggio (stesse regole dell'invio). */
export function draftProblems(p: SavedPatient, d: EditDraft): DraftProblem[] {
  const out: DraftProblem[] = [];
  const id = d.patientId.trim();
  if (!id) out.push("id-missing");
  // Record arrivato dal foglio: l'ID completo deve combaciare con quello mascherato.
  else if (isMaskedId(p.patientId) && maskPatientId(id) !== p.patientId) out.push("id-mismatch");
  if (d.strokeType !== "hemorrhagic" && d.tev === "Yes" && !d.mtici) out.push("mtici-missing");
  return out;
}

/** Trial "missed": quelli gia' missed meno quelli ora arruolati. */
export function missedAfterEdit(p: SavedPatient, d: EditDraft): string[] {
  return (p.missed ?? []).filter((n) => !d.studies.includes(n));
}

/**
 * Payload per Code.gs (kind "update"): trova la riga con Timestamp originale
 * e ID COMPLETO originale, e riscrive solo le colonne modificabili.
 */
export function buildUpdatePayload(
  d: EditDraft,
  match: { timestamp: string; patientId: string },
  missed: string[]
): Record<string, unknown> {
  const isHem = d.strokeType === "hemorrhagic";
  const sheetTrials = buildTrialsForSheet(d.studies, d.outcomes);
  const strokeType = d.strokeType;
  return {
    kind: "update",
    matchTimestamp: match.timestamp,
    matchId: match.patientId,
    N_patient: d.patientId.trim(),
    Age: d.age ?? "",
    NIHSS: d.nihss ?? "",
    LTSW_h: d.ltswH ?? "",
    pre_mRS: d.premrs ?? "",
    Stroke_type: strokeType,
    "Ischemic/Haemorragic": strokeType,
    ...sheetTrials,
    "DO  IT": sheetTrials.DOIT,
    NiVO: sheetTrials.NIVO,
    trialKeys: SHEET_TRIAL_KEYS_CSV,
    TEV: isHem ? "" : d.tev,
    mTICI: !isHem && d.tev === "Yes" ? d.mtici : "",
    TIV: isHem ? "" : d.tiv,
    Reversal: isHem ? d.reversal : "",
    Reversal_agent: isHem && d.reversal === "Yes" && d.reversalAgent ? REVERSAL_LABEL[d.reversalAgent] ?? d.reversalAgent : "",
    Notes: d.notes,
    missed_trials: missed.join(","),
  };
}

/** Record locale con le modifiche applicate (il resto dello snapshot resta). */
export function applyDraft(p: SavedPatient, d: EditDraft, missed: string[], updatedAt: string): SavedPatient {
  const isHem = d.strokeType === "hemorrhagic";
  const num = (v: number | null) => (v == null ? undefined : v);
  const outcomes: Record<string, Arm> = {};
  for (const name of d.studies) if (hasKnownStudyArm(name)) outcomes[name] = d.outcomes[name] ?? "intervention";
  return {
    ...p,
    patientId: d.patientId.trim(),
    strokeType: d.strokeType,
    age: num(d.age),
    nihss: num(d.nihss),
    ltswH: num(d.ltswH),
    trials: [...d.studies],
    missed,
    updatedAt,
    snapshot: {
      ...p.snapshot,
      pre: { ...p.snapshot.pre, patientId: d.patientId.trim(), age: num(d.age), nihss: num(d.nihss), premrs: num(d.premrs) },
      post: { ...p.snapshot.post, strokeType: d.strokeType || undefined },
      studies: [...d.studies],
      outcomes,
      notes: d.notes,
      extras: {
        tev: !isHem && d.tev ? d.tev : undefined,
        mtici: !isHem && d.tev === "Yes" && d.mtici ? d.mtici : undefined,
        tiv: !isHem && d.tiv ? d.tiv : undefined,
        reversal: isHem && d.reversal ? d.reversal : undefined,
        reversalAgent: isHem && d.reversal === "Yes" && d.reversalAgent ? d.reversalAgent : undefined,
      },
    },
  };
}
