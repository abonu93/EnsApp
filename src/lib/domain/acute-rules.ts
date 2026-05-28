export type VesselCode =
  | "ica-intracranial"
  | "ica-terminal"
  | "m1"
  | "m2-proxdom"
  | "m2-any"
  | "gt-m2"
  | "a1"
  | "a2"
  | "gt-a2"
  | "basilar"
  | "p1"
  | "p2"
  | "gt-p2"
  | "va";

export type YesNo = "yes" | "no";
export type YesNoEmpty = YesNo | "";
export type CandidateStatus = "eligible" | "not eligible" | "";

export interface AcuteInput {
  age: number;
  nihss: number;
  premrs: number;
  ltsw: number;
  wakeupStroke?: boolean;
  wakeupSymptomsWithin6h?: boolean;
  angiograph?: YesNoEmpty;
  lvo?: YesNoEmpty;
  tandem?: YesNoEmpty;
  tortuosity?: YesNoEmpty;
  targetVessels?: VesselCode[];
  aspects?: number;
  lesionConfirmed?: YesNoEmpty;
  candidate?: CandidateStatus;
  ivtCandidate?: CandidateStatus;
  doac?: YesNoEmpty;
  acei?: YesNoEmpty;
  contraTpa?: YesNoEmpty;
}

export interface VesselFlags {
  vanish: boolean;
  pivotal: boolean;
  moste: boolean;
  twin2win2: boolean;
  artemis: boolean;
  hybernia: boolean;
  promise: boolean;
  nivo: boolean;
}

function toArray<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : [];
}

function hasVessel(targetVessels: VesselCode[] | undefined, code: VesselCode): boolean {
  return toArray(targetVessels).includes(code);
}

function selectedVesselCount(targetVessels: VesselCode[] | undefined): number {
  return toArray(targetVessels).length;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isLvo(lvo: YesNoEmpty | undefined): boolean {
  return lvo === "yes";
}

export function computeVesselFlags(targetVessels: VesselCode[] | undefined): VesselFlags {
  return {
    vanish: hasVessel(targetVessels, "ica-terminal") || hasVessel(targetVessels, "m1"),
    pivotal:
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "basilar"),
    moste:
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "m2-any") ||
      hasVessel(targetVessels, "m2-proxdom"),
    twin2win2:
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "basilar"),
    artemis:
      hasVessel(targetVessels, "ica-intracranial") ||
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "m2-proxdom"),
    hybernia:
      hasVessel(targetVessels, "ica-intracranial") ||
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "m2-any") ||
      hasVessel(targetVessels, "m2-proxdom"),
    promise:
      hasVessel(targetVessels, "ica-terminal") ||
      hasVessel(targetVessels, "m1") ||
      hasVessel(targetVessels, "m2-any") ||
      hasVessel(targetVessels, "m2-proxdom"),
    nivo:
      hasVessel(targetVessels, "gt-m2") ||
      hasVessel(targetVessels, "a2") ||
      hasVessel(targetVessels, "gt-a2") ||
      hasVessel(targetVessels, "p1") ||
      hasVessel(targetVessels, "p2") ||
      hasVessel(targetVessels, "gt-p2"),
  };
}

export function weTrust(input: AcuteInput): boolean {
  const wakeupStroke = input.wakeupStroke === true;
  const maxHours = wakeupStroke ? 12 : 6;
  const wakeupSymptomsWithin6h = wakeupStroke ? input.wakeupSymptomsWithin6h === true : true;
  return (
    input.age >= 18 &&
    input.nihss >= 10 &&
    input.premrs <= 2 &&
    input.ltsw <= maxHours &&
    wakeupSymptomsWithin6h &&
    input.angiograph === "yes"
  );
}

export function athena(input: AcuteInput): boolean {
  if (input.tortuosity === "") return false;
  return (
    input.age >= 22 &&
    input.age <= 85 &&
    input.nihss >= 8 &&
    input.premrs <= 2 &&
    input.ltsw <= 24 &&
    isLvo(input.lvo) &&
    input.tandem === "no" &&
    input.tortuosity === "no"
  );
}

export function vanish(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.age >= 18 &&
    input.premrs <= 1 &&
    input.nihss >= 6 &&
    isLvo(input.lvo) &&
    vessels.vanish
  );
}

export function pivotal(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw < 8 &&
    input.age >= 18 &&
    input.age <= 80 &&
    input.premrs <= 1 &&
    input.nihss >= 6 &&
    isLvo(input.lvo) &&
    vessels.pivotal
  );
}

export function promise(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw <= 24 &&
    input.age >= 18 &&
    input.premrs <= 2 &&
    input.nihss >= 1 &&
    isLvo(input.lvo) &&
    vessels.promise
  );
}

export function nivo(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.age >= 18 &&
    input.ltsw <= 24 &&
    input.nihss >= 5 &&
    input.premrs <= 2 &&
    isLvo(input.lvo) &&
    vessels.nivo &&
    selectedVesselCount(input.targetVessels) <= 1 &&
    isValidNumber(input.aspects) &&
    input.aspects >= 6
  );
}

export function moste(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw < 23 &&
    input.premrs <= 1 &&
    input.nihss < 6 &&
    isLvo(input.lvo) &&
    vessels.moste
  );
}

export function twin2win2(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw < 24 &&
    input.age > 18 &&
    input.premrs <= 2 &&
    input.nihss >= 6 &&
    isLvo(input.lvo) &&
    vessels.twin2win2
  );
}

export function artemis(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw < 24 &&
    input.age >= 18 &&
    input.age <= 85 &&
    input.premrs <= 2 &&
    input.nihss >= 6 &&
    input.nihss <= 25 &&
    isLvo(input.lvo) &&
    vessels.artemis &&
    isValidNumber(input.aspects) &&
    input.aspects > 5
  );
}

export function hybernia(input: AcuteInput): boolean {
  const vessels = computeVesselFlags(input.targetVessels);
  return (
    input.ltsw < 24 &&
    input.age >= 18 &&
    input.age <= 89 &&
    input.premrs <= 1 &&
    input.nihss >= 6 &&
    isLvo(input.lvo) &&
    vessels.hybernia &&
    isValidNumber(input.aspects) &&
    input.aspects > 4
  );
}

export function doneSymple(input: AcuteInput): boolean {
  return (
    input.ltsw >= 24 &&
    input.ltsw <= 72 &&
    input.age >= 18 &&
    input.age <= 80 &&
    input.premrs <= 1 &&
    input.nihss >= 8 &&
    isLvo(input.lvo)
  );
}

export function shionogi(input: AcuteInput): boolean {
  return (
    input.ltsw < 25 &&
    input.age > 18 &&
    input.premrs <= 1 &&
    input.nihss >= 6 &&
    input.nihss <= 22 &&
    input.lesionConfirmed === "yes"
  );
}

export function sovateltide(input: AcuteInput): boolean {
  return (
    input.candidate === "not eligible" &&
    input.ltsw < 24 &&
    input.age >= 18 &&
    input.age <= 80 &&
    input.premrs <= 2 &&
    input.lesionConfirmed === "yes" &&
    input.nihss >= 8 &&
    input.nihss < 20
  );
}

export function orion(input: AcuteInput): boolean {
  return (
    input.ltsw >= 4.5 &&
    input.ltsw <= 24 &&
    input.age >= 18 &&
    input.age <= 90 &&
    input.premrs <= 1 &&
    input.nihss > 5 &&
    selectedVesselCount(input.targetVessels) >= 1 &&
    input.contraTpa === "no"
  );
}

export function doit(input: AcuteInput): boolean {
  return (
    input.age >= 18 &&
    input.ltsw <= 4.5 &&
    input.doac === "yes" &&
    input.ivtCandidate === "eligible"
  );
}

export function remedy(input: AcuteInput): boolean {
  const hasExcludedVessel =
    hasVessel(input.targetVessels, "ica-intracranial") ||
    hasVessel(input.targetVessels, "ica-terminal") ||
    hasVessel(input.targetVessels, "m1") ||
    hasVessel(input.targetVessels, "va") ||
    hasVessel(input.targetVessels, "basilar");

  return (
    input.ltsw < 24 &&
    input.age >= 18 &&
    input.age <= 90 &&
    input.premrs <= 1 &&
    input.nihss >= 5 &&
    input.nihss <= 15 &&
    input.candidate === "not eligible" &&
    !hasExcludedVessel &&
    isValidNumber(input.aspects) &&
    input.aspects >= 6 &&
    input.acei !== "yes"
  );
}
