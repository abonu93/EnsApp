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
  /**
   * Trial per cui il paziente era eleggibile ma NON e' stato arruolato
   * (missed opportunities, per analisi statistica).
   */
  missed?: string[];
  /** True se questo record arriva dal backend remoto, non dal device locale. */
  remote?: boolean;
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

const MAX_ENTRIES = 500;

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

/**
 * Merge una lista di pazienti remoti (da Google Sheet) con quelli locali.
 * Strategia: i remoti sostituiscono i locali con stesso `id`.
 * I locali senza match remoto restano (es. salvataggi offline non ancora
 * sincronizzati al backend). I remoti senza match locale vengono aggiunti.
 */
export function mergeRemote(remote: SavedPatient[]): void {
  savedPatients.update((local) => {
    const byId = new Map<string, SavedPatient>();
    for (const p of local) byId.set(p.id, p);
    for (const r of remote) byId.set(r.id, { ...r, remote: true });
    const merged = Array.from(byId.values());
    merged.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
    return merged.slice(0, MAX_ENTRIES);
  });
}
