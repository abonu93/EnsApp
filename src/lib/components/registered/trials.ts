// Studi selezionabili nel Paziente registrato: quelli con reclutamento aperto
// (trials-info.ts), con il nome di display usato nel resto dell'app.

import { TRIALS_INFO, canonicalTrialName, getTrialCategory, isTrialOpen } from "$lib/domain/trials-info";
import { REASON_BY_TRIAL } from "$lib/domain/acute-reasons";
import { REASON_BY_HEM_TRIAL } from "$lib/domain/hem-reasons";
import { normalizeStudyName, type StudyDesign } from "$lib/domain/sheet-payload";
import type { Dictionary } from "$lib/i18n/it";

export type RegTrialGroup = "isch" | "hemo" | "other";

const DISPLAY = [...Object.keys(REASON_BY_TRIAL), ...Object.keys(REASON_BY_HEM_TRIAL)];
/** Nome di display ("TWIN-2-WIN 2", "DO-IT", ...) dalla chiave del catalogo. */
export function displayName(key: string): string {
  return DISPLAY.find((n) => canonicalTrialName(n) === canonicalTrialName(key)) ?? normalizeStudyName(key);
}

const OTHER = new Set(["saferdoac", "norahome"]);

export const REG_TRIALS = Object.keys(TRIALS_INFO)
  .filter((key) => isTrialOpen(key))
  .map((key) => {
    const cat = getTrialCategory(key);
    const group: RegTrialGroup =
      cat === "hemorrhagic" ? "hemo" : cat === "post-acute" || OTHER.has(canonicalTrialName(key)) ? "other" : "isch";
    return { name: displayName(key), key, group, focus: TRIALS_INFO[key].category };
  });

export function focusOf(name: string): string {
  return REG_TRIALS.find((tr) => tr.name === name)?.focus ?? "";
}

/** Nota sul braccio per gli studi senza intervention/control. */
export function designNote(t: Dictionary, d: StudyDesign): string {
  if (d === "blinded") return t.registered.designBlinded;
  if (d === "single-arm") return t.registered.designSingle;
  if (d === "unknown") return t.registered.designUnknown;
  return "";
}
