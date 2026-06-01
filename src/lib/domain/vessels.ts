// Etichette dei vasi per la UI. Le chiavi (VesselCode) sono semantiche
// e usate da acute-rules.ts; le labels sono solo UI.

import type { VesselCode } from "./acute-rules";

export interface VesselOption {
  value: VesselCode;
  label: string;
}

export const VESSEL_OPTIONS: VesselOption[] = [
  { value: "ica-intracranial", label: "Intracranial ICA (no T)" },
  { value: "ica-terminal", label: "Terminal ICA (ICA-T)" },
  { value: "m1", label: "M1" },
  { value: "m2-proxdom", label: "M2 proximal/dominant" },
  { value: "m2-any", label: "Any M2" },
  { value: "gt-m2", label: ">M2" },
  { value: "a1", label: "A1" },
  { value: "a2", label: "A2" },
  { value: "gt-a2", label: ">A2" },
  { value: "basilar", label: "Basilar" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "gt-p2", label: ">P2" },
  { value: "va", label: "VA" },
];
