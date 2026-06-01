// Spiegazioni "perche' questo trial NON e' eligibile".
// Ogni funzione applica gli stessi criteri di acute-rules.ts ma colleziona
// i fail come stringhe (i18n in italiano: i criteri restano in inglese
// clinico per coerenza con TRIALS_INFO).
// NON ridefinisce la logica clinica: e' un wrapper diagnostico.

import type { AcuteInput, VesselCode } from "./acute-rules";
import { computeVesselFlags } from "./acute-rules";

export interface ReasonReport {
  /** Criteri soddisfatti (per audit). */
  meet: string[];
  /** Criteri NON soddisfatti. Lista vuota se il trial e' eligible. */
  fail: string[];
  eligible: boolean;
}

function hv(input: AcuteInput, code: VesselCode): boolean {
  return Array.isArray(input.targetVessels) && input.targetVessels.includes(code);
}
function vcount(input: AcuteInput): number {
  return Array.isArray(input.targetVessels) ? input.targetVessels.length : 0;
}
function isNumber(v: unknown): v is number {
  return typeof v === "number" && !Number.isNaN(v);
}

type Check = { ok: boolean; label: string };
function reduce(checks: Check[]): ReasonReport {
  const meet = checks.filter((c) => c.ok).map((c) => c.label);
  const fail = checks.filter((c) => !c.ok).map((c) => c.label);
  return { meet, fail, eligible: fail.length === 0 };
}

export function reasonWeTrust(input: AcuteInput): ReasonReport {
  const wakeup = input.wakeupStroke === true;
  const maxH = wakeup ? 12 : 6;
  const within6h = wakeup ? input.wakeupSymptomsWithin6h === true : true;
  return reduce([
    { ok: input.age >= 18, label: "age >= 18" },
    { ok: input.nihss >= 10, label: "NIHSS >= 10" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.ltsw <= maxH, label: `LTSW <= ${maxH}h` },
    { ok: within6h, label: "wake-up sintomi entro 6h" },
    { ok: input.angiograph === "yes", label: "angiografo Philips disponibile" },
  ]);
}

export function reasonAthena(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.age >= 22 && input.age <= 85, label: "age 22-85" },
    { ok: input.nihss >= 8, label: "NIHSS >= 8" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.ltsw <= 24, label: "LTSW <= 24h" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: input.tandem === "no", label: "no tandem" },
    { ok: input.tortuosity === "no", label: "no tortuosita' (richiesto valore esplicito)" },
  ]);
}

export function reasonVanish(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.age >= 18, label: "age >= 18" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 6, label: "NIHSS >= 6" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.vanish, label: "vessel ICA-T o M1" },
  ]);
}

export function reasonPivotal(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw < 8, label: "LTSW < 8h" },
    { ok: input.age >= 18 && input.age <= 80, label: "age 18-80" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 6, label: "NIHSS >= 6" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.pivotal, label: "vessel ICA-T, M1 o basilar" },
  ]);
}

export function reasonPromise(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw <= 24, label: "LTSW <= 24h" },
    { ok: input.age >= 18, label: "age >= 18" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.nihss >= 1, label: "NIHSS >= 1" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.promise, label: "vessel ICA-T / M1 / M2" },
  ]);
}

export function reasonNivo(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.age >= 18, label: "age >= 18" },
    { ok: input.ltsw <= 24, label: "LTSW <= 24h" },
    { ok: input.nihss >= 5, label: "NIHSS >= 5" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.nivo, label: "vessel distale (>M2, A2/>A2, P1/P2/>P2)" },
    { ok: vcount(input) <= 1, label: "singolo vaso" },
    { ok: isNumber(input.aspects) && input.aspects >= 6, label: "ASPECTS >= 6" },
  ]);
}

export function reasonMoste(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw < 23, label: "LTSW < 23h" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss < 6, label: "NIHSS < 6" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.moste, label: "vessel ICA-T / M1 / M2" },
  ]);
}

export function reasonTwin2win2(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw < 24, label: "LTSW < 24h" },
    { ok: input.age > 18, label: "age > 18" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.nihss >= 6, label: "NIHSS >= 6" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.twin2win2, label: "vessel ICA-T, M1 o basilar" },
  ]);
}

export function reasonArtemis(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw < 24, label: "LTSW < 24h" },
    { ok: input.age >= 18 && input.age <= 85, label: "age 18-85" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.nihss >= 6 && input.nihss <= 25, label: "NIHSS 6-25" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.artemis, label: "vessel ICA intracr., ICA-T, M1, M2 prox/dom" },
    { ok: isNumber(input.aspects) && input.aspects > 5, label: "ASPECTS > 5" },
  ]);
}

export function reasonHybernia(input: AcuteInput): ReasonReport {
  const v = computeVesselFlags(input.targetVessels);
  return reduce([
    { ok: input.ltsw < 24, label: "LTSW < 24h" },
    { ok: input.age >= 18 && input.age <= 89, label: "age 18-89" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 6, label: "NIHSS >= 6" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
    { ok: v.hybernia, label: "vessel ICA intracr. / ICA-T / M1 / M2" },
    { ok: isNumber(input.aspects) && input.aspects > 4, label: "ASPECTS > 4" },
  ]);
}

export function reasonDoneSymple(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.ltsw >= 24 && input.ltsw <= 72, label: "LTSW 24-72h" },
    { ok: input.age >= 18 && input.age <= 80, label: "age 18-80" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 8, label: "NIHSS >= 8" },
    { ok: input.lvo === "yes", label: "LVO confermato" },
  ]);
}

export function reasonShionogi(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.ltsw < 25, label: "LTSW < 25h" },
    { ok: input.age > 18, label: "age > 18" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 6 && input.nihss <= 22, label: "NIHSS 6-22" },
    { ok: input.lesionConfirmed === "yes", label: "lesione confermata" },
  ]);
}

export function reasonSovateltide(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.candidate === "not eligible", label: "non candidato EVT" },
    { ok: input.ltsw < 24, label: "LTSW < 24h" },
    { ok: input.age >= 18 && input.age <= 80, label: "age 18-80" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.lesionConfirmed === "yes", label: "lesione confermata" },
    { ok: input.nihss >= 8 && input.nihss < 20, label: "NIHSS 8-19" },
  ]);
}

export function reasonOrion(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.ltsw >= 4.5 && input.ltsw <= 24, label: "LTSW 4.5-24h" },
    { ok: input.age >= 18 && input.age <= 90, label: "age 18-90" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss > 5, label: "NIHSS > 5" },
    { ok: vcount(input) >= 1, label: "almeno un vessel" },
    { ok: input.contraTpa === "no", label: "no controindicazioni TPA" },
  ]);
}

export function reasonDoit(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.age >= 18, label: "age >= 18" },
    { ok: input.ltsw <= 4.5, label: "LTSW <= 4.5h" },
    { ok: input.doac === "yes", label: "DOAC nelle 48h" },
    { ok: input.ivtCandidate === "eligible", label: "candidato IVT" },
  ]);
}

export function reasonNoraHome(input: AcuteInput): ReasonReport {
  return reduce([
    { ok: input.age > 18, label: "age > 18" },
    { ok: input.nihss < 5, label: "NIHSS < 5 (oppure TIA ad alto rischio)" },
  ]);
}

export function reasonRemedy(input: AcuteInput): ReasonReport {
  const excluded =
    hv(input, "ica-intracranial") || hv(input, "ica-terminal") || hv(input, "m1") ||
    hv(input, "va") || hv(input, "basilar");
  return reduce([
    { ok: input.ltsw < 24, label: "LTSW < 24h" },
    { ok: input.age >= 18 && input.age <= 90, label: "age 18-90" },
    { ok: input.premrs <= 1, label: "pre-mRS <= 1" },
    { ok: input.nihss >= 5 && input.nihss <= 15, label: "NIHSS 5-15" },
    { ok: input.candidate === "not eligible", label: "non candidato EVT" },
    { ok: !excluded, label: "no occlusione ICA intracr./ICA-T/M1/VA/basilar" },
    { ok: isNumber(input.aspects) && input.aspects >= 6, label: "ASPECTS >= 6" },
    { ok: input.acei !== "yes", label: "non in ACE-inibitori" },
  ]);
}

/** Mappa nome di display -> funzione reasons. */
export const REASON_BY_TRIAL: Record<string, (i: AcuteInput) => ReasonReport> = {
  WeTrust: reasonWeTrust,
  ATHENA: reasonAthena,
  VANISH: reasonVanish,
  PIVOTAL: reasonPivotal,
  PROMISE: reasonPromise,
  NiVO: reasonNivo,
  MOSTE: reasonMoste,
  "TWIN-2-WIN 2": reasonTwin2win2,
  ARTEMIS: reasonArtemis,
  HYBERNIA: reasonHybernia,
  "DONE SYMPLE": reasonDoneSymple,
  SHIONOGI: reasonShionogi,
  SOVATELTIDE: reasonSovateltide,
  ORION: reasonOrion,
  "DO-IT": reasonDoit,
  REMEDY: reasonRemedy,
  "NORA HOME": reasonNoraHome,
};
