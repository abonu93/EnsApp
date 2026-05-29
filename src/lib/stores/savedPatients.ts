// Lista pazienti gia' inviati su Google Sheet. Persistita localmente
// per consentire la ripresa di un caso anche dopo refresh o cambio flusso.
// NON contiene PII oltre il patientId inserito a mano dall'operatore.

import { persisted } from "./persistence";
import type { PreData, PostData, HemData } from "./patient";

export interface SavedPatient {
  /** ID univoco interno (timestamp). */
  id: string;
  /** Timestamp ISO dell'invio. */
  savedAt: string;
  patientId?: string;
  strokeType?: "ischemic" | "hemorrhagic" | "";
  age?: number;
  nihss?: number;
  /** Trial selezionati (display name). */
  trials: string[];
  /** Snapshot completo per la ri-apertura. */
  snapshot: {
    pre: PreData;
    post: PostData;
    hem: HemData;
    studies: string[];
    outcomes: Record<string, "intervention" | "control">;
    chronic: string[];
    notes: string;
    /** Extra Share: TEV/mTICI/TIV. */
    extras: Partial<{ tev: "Yes" | "No"; mtici: string; tiv: "Yes" | "No" }>;
  };
}

const MAX_ENTRIES = 50;

export const savedPatients = persisted<SavedPatient[]>({
  key: "ensapp:saved:v1",
  initial: [],
  // Mai scadono per TTL: l'utente puo' rivederli a piacere.
});

export function addSavedPatient(entry: Omit<SavedPatient, "id" | "savedAt">): SavedPatient {
  const id = String(Date.now());
  const record: SavedPatient = {
    ...entry,
    id,
    savedAt: new Date().toISOString(),
  };
  savedPatients.update((list) => {
    const next = [record, ...list];
    return next.slice(0, MAX_ENTRIES);
  });
  return record;
}

export function removeSavedPatient(id: string): void {
  savedPatients.update((list) => list.filter((p) => p.id !== id));
}

export function clearSaved(): void {
  savedPatients.clear();
}
