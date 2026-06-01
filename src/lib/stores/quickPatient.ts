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
  strokeType?: QuickStrokeType;
  trial?: string;
  arm?: "intervention" | "control" | "";
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
