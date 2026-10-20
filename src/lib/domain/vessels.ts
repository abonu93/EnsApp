// Etichette dei vasi per la UI. Le chiavi (VesselCode) sono semantiche
// e usate da acute-rules.ts; le labels sono solo UI.
// I codici storici restano invariati, ma le etichette seguono i segmenti dei
// protocolli: "m2-any" = M2 non dominante (la dominante/prossimale ha il suo
// codice), "gt-a2" = A3 e "gt-p2" = P3 (NiVO e SAIL-MeVO arrivano ad A3 e P3;
// A4-A5 e P4 non sono ammessi da nessun trial).

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
  { value: "m2-any", label: "M2 non-dominant" },
  { value: "gt-m2", label: "M3-M4" },
  { value: "a1", label: "A1" },
  { value: "a2", label: "A2" },
  { value: "gt-a2", label: "A3" },
  { value: "basilar", label: "Basilar" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "gt-p2", label: "P3" },
  { value: "va", label: "VA" },
];
