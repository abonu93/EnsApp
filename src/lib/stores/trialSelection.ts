// Selezione trial dall'utente in Summary. Persistito 24h.

import { derived } from "svelte/store";
import { persisted } from "./persistence";
import { isTrialOpen } from "$lib/domain/trials-info";

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
 * Toggle di un trial. I trial non arruolabili (status "closed"/"inactive",
 * es. SHIONOGI, MOSTE, Librexia) non possono essere selezionati: il toggle
 * e' un no-op in aggiunta, ma resta valido in rimozione per poter ripulire
 * una selezione salvata prima della disattivazione del trial.
 */
export function toggleStudy(name: string): void {
  selectedStudies.update((arr) => {
    if (arr.includes(name)) return arr.filter((n) => n !== name);
    if (!isTrialOpen(name)) return arr;
    return [...arr, name];
  });
}

/**
 * Rimuove dalla selezione persistita i trial diventati non arruolabili.
 * La selezione vive 24h in localStorage: senza questa pulizia un trial
 * disattivato dopo la selezione resterebbe nel payload inviato al Sheet
 * pur non essendo piu' visibile (quindi non deselezionabile) nella UI.
 */
export function pruneUnselectableStudies(): void {
  selectedStudies.update((arr) => {
    const kept = arr.filter((n) => isTrialOpen(n));
    return kept.length === arr.length ? arr : kept;
  });
  studyOutcomes.update((map) => {
    const entries = Object.entries(map).filter(([name]) => isTrialOpen(name));
    return entries.length === Object.keys(map).length
      ? map
      : (Object.fromEntries(entries) as Record<string, "intervention" | "control">);
  });
  selectedChronic.update((arr) => {
    const kept = arr.filter((n) => isTrialOpen(n));
    return kept.length === arr.length ? arr : kept;
  });
}

export function clearSelection(): void {
  selectedStudies.clear();
  studyOutcomes.clear();
  selectedChronic.clear();
  notesText.clear();
}
