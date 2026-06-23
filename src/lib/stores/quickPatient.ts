// Stato del quick-patient flow (separato dal flusso guided).
// Persistito 24h cosi' l'utente puo' tornare al form se navigato fuori.

import { persisted } from "./persistence";

const TTL_24H = 24 * 60 * 60 * 1000;

export type QuickStrokeType = "ischemic" | "hemorrhagic" | "";

export interface QuickPatientData {
  patientId?: string;
  age?: number;
  nihss?: number;
  premrs?: number;
  /** ISO datetime "Last seen well". Le ore vengono derivate. */
  ltswDate?: string;
  /** LTSW in ore (derivato da ltswDate al momento della compilazione). */
  ltsw?: number;
  strokeType?: QuickStrokeType;
  trial?: string;
  arm?: "intervention" | "control" | "";
  /** Trattamenti in acuto: trombectomia (TEV) + relativo mTICI + trombolisi (TIV). */
  tev?: "Yes" | "No" | "";
  mtici?: string;
  tiv?: "Yes" | "No" | "";
  notes?: string;
}

export const quickPatient = persisted<QuickPatientData>({
  key: "ensapp:quickPatient:v1",
  initial: {},
  ttlMs: TTL_24H,
});

export function clearQuickPatient(): void {
  quickPatient.clear();
}
