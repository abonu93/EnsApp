// Campi del Paziente registrato (design "Eligo Registered Patient"). Solo UI:
// i valori vanno in quickPatient e nella riga del foglio come per Share.

import type { QuickPatientData } from "$lib/stores/quickPatient";
import { REVERSAL_LABEL } from "$lib/domain/patient-record";

export type RegFieldKey =
  | "patientId" | "age" | "nihss" | "premrs" | "strokeType"
  | "targetVessels" | "aspects" | "tev" | "mtici" | "tiv"
  | "gcs" | "hemVolume" | "reversal" | "reversalAgent" | "notes";

export interface RegField {
  kind: "text" | "longtext" | "num" | "opts" | "vessels";
  min?: number;
  max?: number;
  start?: number;
  unit?: string;
  options?: readonly (string | number)[];
  mono?: boolean;
}

const YN = ["Yes", "No"] as const;

export const REG_FIELDS: Record<RegFieldKey, RegField> = {
  patientId: { kind: "text", mono: true },
  age: { kind: "num", min: 18, max: 110, start: 70, mono: true },
  nihss: { kind: "num", min: 0, max: 42, start: 8, mono: true },
  premrs: { kind: "opts", options: [0, 1, 2, 3, 4, 5], mono: true },
  strokeType: { kind: "opts", options: ["ischemic", "hemorrhagic"] },
  targetVessels: { kind: "vessels" },
  aspects: { kind: "num", min: 0, max: 10, start: 8, mono: true },
  tev: { kind: "opts", options: YN },
  mtici: { kind: "opts", options: ["0", "1", "2a", "2b50", "2b67", "2c", "3"], mono: true },
  tiv: { kind: "opts", options: YN },
  gcs: { kind: "num", min: 3, max: 15, start: 13, mono: true },
  hemVolume: { kind: "num", min: 0, max: 120, start: 20, unit: " mL", mono: true },
  reversal: { kind: "opts", options: YN },
  reversalAgent: { kind: "opts", options: Object.keys(REVERSAL_LABEL) },
  notes: { kind: "longtext" },
};

/** Sempre visibili. */
export const MAIN_FIELDS: RegFieldKey[] = ["patientId", "age", "nihss", "premrs", "strokeType"];

/** Dati aggiuntivi disponibili secondo il tipo di ictus (e le risposte date). */
export function extrasFor(p: QuickPatientData): RegFieldKey[] {
  const hem = p.strokeType === "hemorrhagic";
  const x: RegFieldKey[] = [];
  if (!hem) {
    x.push("targetVessels", "aspects", "tev");
    if (p.tev === "Yes") x.push("mtici");
    x.push("tiv");
  } else {
    x.push("gcs", "hemVolume", "reversal");
    if (p.reversal === "Yes") x.push("reversalAgent");
  }
  x.push("notes");
  return x;
}

/** LTSW alla visita (foglio "Ultima volta visto bene"). */
export interface LtswValue {
  ltswMode: "clock" | "hours";
  ltswH: number;
  /** ms dell'ultima volta visto bene (modalita' "clock"). */
  lsw?: number;
  wakeup: boolean;
}
