// State del paziente in lavorazione. Persistito con TTL 24h.
// IMPORTANTE: nessun PII oltre a patientId (inserito manualmente).
// Reset esplicito via clearPatient() o startNewPatient().

import { derived } from "svelte/store";
import { persisted } from "./persistence";
import type { AcuteInput } from "$lib/domain/acute-rules";
import type { HemorrhagicInput } from "$lib/domain/hemorrhagic-rules";

const TTL_24H = 24 * 60 * 60 * 1000;

export type PreData = Partial<{
  patientId: string;
  age: number;
  nihss: number;
  premrs: number;
  /** ISO datetime "Last seen well". Le ore vengono derivate. */
  ltswDate: string;
  /** Fallback: se l'utente preferisce inserire ore direttamente. */
  ltsw: number;
  wakeupStroke: boolean;
  wakeupSymptomsWithin6h: boolean;
  angiograph: "yes" | "no" | "";
  doac: "yes" | "no" | "";
  acei: "yes" | "no" | "";
}>;

export type StrokeType = "ischemic" | "hemorrhagic" | "";

export type PostData = Partial<{
  strokeType: StrokeType;
  candidate: "eligible" | "not eligible" | "";
  ivtCandidate: "eligible" | "not eligible" | "";
  lvo: "yes" | "no" | "";
  tandem: "yes" | "no" | "";
  tortuosity: "yes" | "no" | "";
  targetVessels: string[];
  aspects: number;
  lesionConfirmed: "yes" | "no" | "";
  contraTpa: "yes" | "no" | "";
}>;

export type HemData = Partial<HemorrhagicInput>;

export const preData = persisted<PreData>({
  key: "ensapp:patient:pre:v1",
  initial: {},
  ttlMs: TTL_24H,
});

export const postData = persisted<PostData>({
  key: "ensapp:patient:post:v1",
  initial: {},
  ttlMs: TTL_24H,
});

export const hemData = persisted<HemData>({
  key: "ensapp:patient:hem:v1",
  initial: {},
  ttlMs: TTL_24H,
});

/** Calcola ore tra LTSW datetime e adesso (positive). */
export function hoursSince(isoDate: string | undefined): number | undefined {
  if (!isoDate) return undefined;
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return undefined;
  const diffMs = Date.now() - t;
  return diffMs / 3_600_000;
}

/**
 * LTSW ore derivato: priorita' a `ltswDate` (se presente),
 * fallback a `ltsw` numerico per retro-compatibilita'.
 */
export const ltswHours = derived(preData, ($pre) => {
  const fromDate = hoursSince($pre.ltswDate);
  if (fromDate !== undefined) return fromDate;
  return $pre.ltsw;
});

/** Snapshot completo per le regole acute (preData + postData merged + ltswHours derived). */
export const acuteInput = derived([preData, postData, ltswHours], ([$pre, $post, $h]) => {
  return { ...$pre, ...$post, ltsw: $h } as Partial<AcuteInput>;
});

export function clearPatient(): void {
  preData.clear();
  postData.clear();
  hemData.clear();
}

/** True se almeno un campo e' compilato: usato per il banner "Patient in progress". */
export const hasPatientInProgress = derived(
  [preData, postData, hemData],
  ([$pre, $post, $hem]) =>
    Object.keys($pre).length > 0 ||
    Object.keys($post).length > 0 ||
    Object.keys($hem).length > 0
);
