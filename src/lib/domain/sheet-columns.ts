// Colonne cliniche del foglio DB, in coda alle colonne storiche: tutti i
// parametri che l'app registra (tranne ID paziente e CIP, che il CIP non esce
// mai dal dispositivo). Lo script (Code.gs, CLINICAL_COLS) crea le colonne
// che mancano: i due elenchi devono restare uguali (test).
// NON contiene logica clinica.

import { VESSEL_OPTIONS } from "./vessels";

type Store = "pre" | "post" | "hem" | "share";
/** Ischemico / emorragico: la colonna si riempie solo per quel tipo di ictus. */
type Only = "isch" | "hem";

interface ColDef {
  col: string;
  store: Store;
  key: string;
  only?: Only;
}

export interface SheetSources {
  pre?: Record<string, unknown>;
  post?: Record<string, unknown>;
  hem?: Record<string, unknown>;
}

const c = (col: string, store: Store, key: string, only?: Only): ColDef => ({ col, store, key, only });

export const CLINICAL_COL_DEFS: readonly ColDef[] = [
  // Schermata di invio (valori gia' pronti nel record).
  c("Reversal", "share", "Reversal"),
  c("Reversal_agent", "share", "Reversal_agent"),
  c("Seen_at", "share", "Seen_at"),
  // Pre-imaging.
  c("LTSW_datetime", "pre", "ltswDate"),
  c("Wakeup", "pre", "wakeupStroke"),
  c("Discovery_datetime", "pre", "discoveryDate"),
  c("Wakeup_within_6h", "pre", "wakeupSymptomsWithin6h"),
  c("Angiograph", "pre", "angiograph"),
  c("DOAC", "pre", "doac"),
  c("ACEI", "pre", "acei"),
  c("Antithrombotics", "pre", "antithrombotics"),
  c("RACE", "pre", "race"),
  // Imaging, ischemico.
  c("Occlusion", "post", "targetVessels", "isch"),
  c("Tandem", "post", "tandem", "isch"),
  c("ASPECTS", "post", "aspects", "isch"),
  c("EVT_candidate", "post", "candidate", "isch"),
  c("IVT_candidate", "post", "ivtCandidate", "isch"),
  c("LVO", "post", "lvo", "isch"),
  c("Tortuosity", "post", "tortuosity", "isch"),
  c("Lesion_confirmed", "post", "lesionConfirmed", "isch"),
  c("Contra_tPA", "post", "contraTpa", "isch"),
  c("Perfusion_mismatch", "post", "perfusionMismatch", "isch"),
  c("Large_core_70", "post", "largeCore", "isch"),
  c("Diabetes", "post", "diabetes", "isch"),
  c("VANISH_core_mismatch", "post", "vanishCoreMismatch", "isch"),
  c("EVT_within_1h", "post", "evtWithin1h", "isch"),
  c("AI_core_lt10", "post", "aiCoreLt10", "isch"),
  c("Tmax_gt30", "post", "tmaxGt30", "isch"),
  c("Pregnancy", "post", "pregnant", "isch"),
  c("Life_expectancy_lt3m", "post", "lifeExpectancyLt3m", "isch"),
  c("Contrast_allergy", "post", "contrastAllergy", "isch"),
  c("IVT_except_DOAC", "post", "ivtExceptDoac", "isch"),
  c("NIHSS_1a_ge2", "post", "nihss1aGe2", "isch"),
  c("Posterior_fossa", "post", "posteriorFossa", "isch"),
  c("Core_gt70", "post", "coreGt70", "isch"),
  c("DOAC_reversal", "post", "doacReversal", "isch"),
  // Imaging, emorragia.
  c("GCS", "hem", "gcs", "hem"),
  c("Hematoma_mL", "hem", "hemVolume", "hem"),
  c("Anticoagulation", "hem", "anticoag", "hem"),
  c("Secondary_cause", "hem", "secondaryCause", "hem"),
  c("Spot_sign", "hem", "spotSign", "hem"),
  c("Brainstem", "hem", "brainstem", "hem"),
  c("Procoagulant", "hem", "procoagulant", "hem"),
  c("ECG_ST", "hem", "ecg", "hem"),
  c("Thrombosis", "hem", "thrombosis", "hem"),
  c("Hem_pregnancy", "hem", "pregnancy", "hem"),
  c("Angioplasty", "hem", "angioplasty", "hem"),
  c("IVH_large", "hem", "ivhLarge", "hem"),
  c("IVH", "hem", "ivh", "hem"),
  c("Seizure", "hem", "seizure", "hem"),
];

export const SHEET_CLINICAL_COLS: readonly string[] = CLINICAL_COL_DEFS.map((d) => d.col);

const vesselLabel = (v: unknown) => VESSEL_OPTIONS.find((o) => o.value === v)?.label ?? String(v);

/** Valore per il foglio: numeri e testo cosi' come sono, si/no per i booleani, liste con " + ". */
function cellValue(col: string, v: unknown): string | number {
  if (v == null || v === "") return "";
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") return Number.isFinite(v) ? v : "";
  if (Array.isArray(v)) {
    if (col === "Occlusion") return v.length ? v.map(vesselLabel).join(" + ") : "none";
    return v.map(String).join(" + ");
  }
  return String(v);
}

/**
 * Colonne cliniche della riga. `share`: valori della schermata di invio
 * (reversione, data della valutazione). I campi ischemici restano vuoti per
 * un'emorragia e viceversa, anche se gli store hanno valori rimasti.
 */
export function buildClinicalColumns(
  src: SheetSources,
  strokeType: string | undefined,
  share: Record<string, unknown>
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const d of CLINICAL_COL_DEFS) {
    const skip = (d.only === "isch" && strokeType === "hemorrhagic") || (d.only === "hem" && strokeType !== "hemorrhagic");
    const from = d.store === "share" ? share : src[d.store];
    out[d.col] = skip ? "" : cellValue(d.col, from?.[d.key]);
  }
  return out;
}
