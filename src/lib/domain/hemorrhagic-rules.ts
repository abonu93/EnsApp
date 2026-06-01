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
  ivhScore?: YesNoEmpty;
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

export function fastest(input: HemorrhagicInput): FastestResult {
  const baseCriteriaMet =
    input.ltsw <= 2 &&
    input.premrs <= 2 &&
    input.age >= 18 &&
    input.age <= 80;

  const extraMissing =
    !input.brainstem ||
    !input.procoagulant ||
    !input.ecg ||
    !input.thrombosis ||
    !input.pregnancy ||
    !input.angioplasty ||
    !input.ivhScore;

  const criteriaMet =
    input.gcs >= 8 &&
    input.hemVolume >= 2 &&
    input.hemVolume < 60 &&
    input.brainstem === "no" &&
    input.procoagulant === "no" &&
    input.ecg === "no" &&
    input.thrombosis === "no" &&
    input.pregnancy === "no" &&
    input.angioplasty === "no" &&
    input.ivhScore === "yes" &&
    input.anticoag === "none";

  return {
    baseCriteriaMet,
    extraMissing,
    eligible: baseCriteriaMet && !extraMissing && criteriaMet,
  };
}

export function tich3(input: HemorrhagicInput): boolean {
  return (
    input.ltsw < 4.5 &&
    input.hemVolume < 60 &&
    input.ivh === "no" &&
    input.gcs >= 5 &&
    input.seizure === "no" &&
    input.secondaryCause === "None"
  );
}
