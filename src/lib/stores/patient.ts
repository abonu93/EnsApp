// State del paziente in lavorazione. Persistito con TTL 24h.
// IMPORTANTE: nessun PII oltre a patientId (inserito manualmente).
// Reset esplicito via clearPatient() o startNewPatient().

import { derived, readable } from "svelte/store";
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
  /** TENACITY: mismatch CTP >= 20% (ratio >= 1.2) E volume mismatch > 10 mL. */
  perfusionMismatch: "yes" | "no" | "";
  /** TENACITY: core/DWI >= 70 mL o ipodensita' intensa in TC basale. */
  largeCore: "yes" | "no" | "";
  /** TENACITY: diabete (criterio di esclusione). */
  diabetes: "yes" | "no" | "";
  /** VANISH: core <= 70 mL e mismatch > 1,2 con differenza > 10 mL. */
  vanishCoreMismatch: "yes" | "no" | "";
  /** SAIL-MeVO: core IA < 10 mL ("na" = non disponibile). */
  aiCoreLt10: "yes" | "no" | "na" | "";
  /** SAIL-MeVO: volume Tmax > 6 s > 30 mL ("na" = non disponibile). */
  tmaxGt30: "yes" | "no" | "na" | "";
  /** SAIL-MeVO: esclusioni. */
  pregnant: "yes" | "no" | "";
  lifeExpectancyLt3m: "yes" | "no" | "";
  contrastAllergy: "yes" | "no" | "";
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

/** Calcola ore tra LTSW datetime e `nowMs` (default: adesso). */
export function hoursSince(isoDate: string | undefined, nowMs: number = Date.now()): number | undefined {
  if (!isoDate) return undefined;
  const t = new Date(isoDate).getTime();
  if (Number.isNaN(t)) return undefined;
  const diffMs = nowMs - t;
  return diffMs / 3_600_000;
}

/** Ogni quanto si ricalcolano le finestre temporali mentre l'app e' aperta. */
export const CLOCK_TICK_MS = 30_000;

/**
 * Orologio dell'app: emette Date.now() ogni CLOCK_TICK_MS finche' qualcuno
 * e' iscritto. Senza di esso le ore dall'LTSW restavano ferme al momento
 * dell'inserimento e un paziente restava "in finestra" anche dopo il limite.
 */
export const now = readable(Date.now(), (set) => {
  set(Date.now());
  const id = setInterval(() => set(Date.now()), CLOCK_TICK_MS);
  return () => clearInterval(id);
});

/**
 * LTSW ore derivato e aggiornato nel tempo: priorita' a `ltswDate` (se
 * presente), fallback a `ltsw` numerico (es. pazienti ricaricati dal foglio,
 * dove esiste solo il valore in ore).
 */
export const ltswHours = derived([preData, now], ([$pre, $now]) => {
  const fromDate = hoursSince($pre.ltswDate, $now);
  if (fromDate !== undefined) return fromDate;
  return $pre.ltsw;
});

/** Snapshot completo per le regole acute (preData + postData merged + ltswHours derived). */
export const acuteInput = derived([preData, postData, ltswHours], ([$pre, $post, $h]) => {
  return { ...$pre, ...$post, ltsw: $h } as Partial<AcuteInput>;
});

/**
 * Snapshot per le regole emorragiche. Rispecchia ESATTAMENTE il merge usato da
 * `hemEligibility` ({...pre, ...hem}), cosi' i reason report mostrati in
 * Summary non possono divergere dal calcolo di eleggibilita'.
 */
export const hemInput = derived([preData, hemData, ltswHours], ([$pre, $hem, $h]) => {
  return { ...$pre, ...$hem, ltsw: $h } as Partial<HemorrhagicInput>;
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
