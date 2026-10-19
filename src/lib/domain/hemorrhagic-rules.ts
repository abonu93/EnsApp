import type { YesNoEmpty } from "./acute-rules.js";

export type AnticoagStatus =
  | "none"
  | "warfarin"
  | "doac"
  | "lmwh"
  | "heparin"
  | "antiplatelet"
  | "";
export type SecondaryCause =
  | "None"
  | "Tumor"
  | "AVM"
  | "Aneurysm"
  | "Cavernoma"
  | "Traumatic"
  | "Other"
  | "";

export interface HemorrhagicInput {
  age: number;
  premrs: number;
  ltsw: number;
  gcs: number;
  hemVolume: number;
  brainstem?: YesNoEmpty;
  procoagulant?: YesNoEmpty;
  ecg?: YesNoEmpty;
  thrombosis?: YesNoEmpty;
  pregnancy?: YesNoEmpty;
  angioplasty?: YesNoEmpty;
  /** FASTEST: IVH estesa (>= 2/3 di un ventricolo laterale o >= 1/3 di entrambi). */
  ivhLarge?: YesNoEmpty;
  /** FASTEST: spot sign su angio-TC basale; obbligatorio oltre 90 min. */
  spotSign?: YesNoEmpty;
  anticoag?: AnticoagStatus;
  ivh?: YesNoEmpty;
  seizure?: YesNoEmpty;
  secondaryCause?: SecondaryCause;
}

export interface FastestResult {
  baseCriteriaMet: boolean;
  extraMissing: boolean;
  eligible: boolean;
}

// FASTEST: protocollo V10.5, Parte 2 (l'unica aperta), p. 24-27.
// - oltre 90 min dall'esordio serve lo spot sign positivo (incl. 4);
// - ICH secondaria esclusa (excl. 2);
// - ECG: esclude solo il sopraslivellamento ST da ischemia acuta (excl. 7);
// - IVH: esclude l'IVH estesa (excl. 4), non "score non calcolato";
// - anticoagulanti: AVK o DOAC negli ultimi 7 giorni, EBPM nelle 24 h,
//   eparina a dose terapeutica (excl. 2, 11, 13). Gli antiaggreganti no.
export const FASTEST_SPOT_SIGN_AFTER_H = 1.5;

/** Spot sign richiesto solo tra 90 e 120 min; oltre le 2 h FASTEST e' comunque escluso. */
export function fastestNeedsSpotSign(ltsw: number): boolean {
  return ltsw > FASTEST_SPOT_SIGN_AFTER_H && ltsw <= 2;
}

const FASTEST_EXCLUDED_ANTICOAG: AnticoagStatus[] = ["warfarin", "doac", "heparin", "lmwh"];

export function fastest(input: HemorrhagicInput): FastestResult {
  const baseCriteriaMet =
    input.ltsw <= 2 &&
    input.premrs <= 2 &&
    input.age >= 18 &&
    input.age <= 80;

  const needsSpotSign = fastestNeedsSpotSign(input.ltsw);

  const extraMissing =
    !input.brainstem ||
    !input.procoagulant ||
    !input.ecg ||
    !input.thrombosis ||
    !input.pregnancy ||
    !input.angioplasty ||
    !input.ivhLarge ||
    (needsSpotSign && !input.spotSign);

  const criteriaMet =
    input.gcs >= 8 &&
    input.hemVolume >= 2 &&
    input.hemVolume < 60 &&
    input.secondaryCause === "None" &&
    input.brainstem === "no" &&
    input.procoagulant === "no" &&
    input.ecg === "no" &&
    input.thrombosis === "no" &&
    input.pregnancy === "no" &&
    input.angioplasty === "no" &&
    input.ivhLarge === "no" &&
    (!needsSpotSign || input.spotSign === "yes") &&
    !!input.anticoag &&
    !FASTEST_EXCLUDED_ANTICOAG.includes(input.anticoag);

  return {
    baseCriteriaMet,
    extraMissing,
    eligible: baseCriteriaMet && !extraMissing && criteriaMet,
  };
}

// TICH-3: protocollo Final v3.1, p. 25-26. Esclusione iii: anticoagulazione
// terapeutica con warfarin (AVK) o EBPM; i DOAC sono esplicitamente ammessi.
// La EBPM profilattica non e' un'esclusione.
const TICH3_EXCLUDED_ANTICOAG: AnticoagStatus[] = ["warfarin", "heparin"];

export function tich3(input: HemorrhagicInput): boolean {
  return (
    input.age >= 18 &&
    input.ltsw < 4.5 &&
    input.hemVolume < 60 &&
    input.ivh === "no" &&
    input.gcs >= 5 &&
    input.seizure === "no" &&
    input.secondaryCause === "None" &&
    !TICH3_EXCLUDED_ANTICOAG.includes(input.anticoag ?? "")
  );
}
