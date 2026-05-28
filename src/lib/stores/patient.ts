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

/** Snapshot completo per le regole acute (preData + postData merged). */
export const acuteInput = derived([preData, postData], ([$pre, $post]) => {
  return { ...$pre, ...$post } as Partial<AcuteInput>;
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
