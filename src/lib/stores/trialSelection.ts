// Selezione trial dall'utente in Summary. Persistito 24h.

import { derived } from "svelte/store";
import { persisted } from "./persistence";
import { exclusiveWith } from "$lib/domain/trials-info";

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

/**
 * Seleziona o deseleziona uno studio. Selezionare uno studio di un gruppo
 * esclusivo (EXCLUSIVE_GROUPS) toglie gli altri del gruppo.
 */
export function toggleStudy(name: string): void {
  const partners = exclusiveWith(name);
  selectedStudies.update((arr) =>
    arr.includes(name) ? arr.filter((n) => n !== name) : [...arr.filter((n) => !partners.includes(n)), name]
  );
}

/** Da dove si arriva al Riepilogo: flusso guidato o Bedside Board (per "indietro" e la colonna source). */
export const flowOrigin = persisted<"guided" | "board">({
  key: "ensapp:flow:origin:v1",
  initial: "guided",
  ttlMs: TTL_24H,
});

export function clearSelection(): void {
  selectedStudies.clear();
  studyOutcomes.clear();
  selectedChronic.clear();
  notesText.clear();
}
