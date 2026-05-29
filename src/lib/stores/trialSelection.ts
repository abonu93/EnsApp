// Selezione trial dall'utente in Summary. Persistito 24h.

import { derived } from "svelte/store";
import { persisted } from "./persistence";

const TTL_24H = 24 * 60 * 60 * 1000;

export const selectedStudies = persisted<string[]>({
  key: "ensapp:trialSel:studies:v1",
  initial: [],
  ttlMs: TTL_24H,
});

export const studyOutcomes = persisted<Record<string, "intervention" | "control">>({
  key: "ensapp:trialSel:outcomes:v1",
  initial: {},
  ttlMs: TTL_24H,
});

export const selectedChronic = persisted<string[]>({
  key: "ensapp:trialSel:chronic:v1",
  initial: [],
  ttlMs: TTL_24H,
});

export const notesText = persisted<string>({
  key: "ensapp:trialSel:notes:v1",
  initial: "",
  ttlMs: TTL_24H,
});

export const hasSelection = derived(
  [selectedStudies, selectedChronic],
  ([$s, $c]) => $s.length > 0 || $c.length > 0
);

export function clearSelection(): void {
  selectedStudies.clear();
  studyOutcomes.clear();
  selectedChronic.clear();
  notesText.clear();
}
