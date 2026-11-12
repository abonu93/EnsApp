// Lista pazienti gia' inviati su Google Sheet. Persistita localmente
// per consentire la ripresa di un caso anche dopo refresh o cambio flusso.
// NON contiene PII oltre il patientId inserito a mano dall'operatore.

import { persisted } from "./persistence";
import type { PreData, PostData, HemData } from "./patient";
import { maskPatientId } from "$lib/utils/mask";

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
  /** Timestamp della riga nel foglio (chiave per le modifiche e per la sync). */
  sheetTs?: string;
  /** ID paziente com'e' ora nel foglio (completo), se diverso da patientId. */
  sheetId?: string;
  /** LTSW in ore al momento dell'invio (colonna LTSW_h). */
  ltswH?: number;
  /** ISO dell'ultima modifica (app o colonna Updated_at del foglio). */
  updatedAt?: string;
  /** Modifica salvata sul dispositivo ma non ancora confermata nel foglio. */
  pendingSync?: boolean;
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
    extras: Partial<{ tev: "Yes" | "No"; mtici: string; tiv: "Yes" | "No"; reversal: "Yes" | "No"; reversalAgent: string }>;
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
    savedAt: entry.sheetTs ?? new Date().toISOString(),
  };
  savedPatients.update((list) => {
    const next = [record, ...list];
    return next.slice(0, MAX_ENTRIES);
  });
  return record;
}

/** Sostituisce un record (modifica) mantenendone la posizione. */
export function replaceSavedPatient(record: SavedPatient): void {
  savedPatients.update((list) => list.map((p) => (p.id === record.id ? record : p)));
}

export function removeSavedPatient(id: string): void {
  savedPatients.update((list) => list.filter((p) => p.id !== id));
}

export function clearSaved(): void {
  savedPatients.clear();
}

const sameTime = (a: string | undefined, b: string | undefined) => {
  const ta = Date.parse(a ?? "");
  const tb = Date.parse(b ?? "");
  return Number.isFinite(ta) && Number.isFinite(tb) && Math.abs(ta - tb) < 1000;
};

/** Invio fatto prima di `sheetTs`: Timestamp entro 10 min prima del salvataggio e stesso ID. */
function legacyMatch(local: SavedPatient, remote: SavedPatient): boolean {
  const saved = Date.parse(local.savedAt);
  const ts = Date.parse(remote.savedAt);
  if (!Number.isFinite(saved) || !Number.isFinite(ts) || ts > saved + 1000 || saved - ts > 10 * 60_000) return false;
  const id = local.sheetId ?? local.patientId ?? "";
  return !!id && (remote.patientId === id || remote.patientId === maskPatientId(id));
}

/**
 * Merge una lista di pazienti remoti (da Google Sheet) con quelli locali.
 * - Un record salvato su questo dispositivo e la sua riga del foglio sono lo
 *   stesso paziente (per `sheetTs`, o per ora + ID nei salvataggi vecchi):
 *   resta il record locale, che ha lo snapshot completo e l'ID non mascherato.
 *   Se la riga e' stata modificata dopo (altro dispositivo), si prendono i
 *   campi della riga.
 * - Gli altri remoti sostituiscono i remoti con stesso `id` o si aggiungono.
 * - I locali senza riga restano (es. salvataggi offline).
 */
export function mergeRemote(remote: SavedPatient[]): void {
  savedPatients.update((list) => {
    const locals = list.filter((p) => !p.remote);
    const byId = new Map<string, SavedPatient>();
    for (const p of list) byId.set(p.id, p);
    for (const r of remote) {
      const local =
        locals.find((l) => l.sheetTs && sameTime(l.sheetTs, r.savedAt)) ??
        locals.find((l) => !l.sheetTs && legacyMatch(l, r));
      if (!local) {
        byId.set(r.id, { ...r, remote: true });
        continue;
      }
      byId.delete(r.id); // copia remota di un sync precedente
      const cur = byId.get(local.id) ?? local;
      const remoteNewer = !!r.updatedAt && !cur.pendingSync && Date.parse(r.updatedAt) > Date.parse(cur.updatedAt ?? cur.savedAt) + 1000;
      const next: SavedPatient = remoteNewer
        ? {
            ...cur,
            strokeType: r.strokeType,
            age: r.age,
            nihss: r.nihss,
            ltswH: r.ltswH,
            trials: r.trials,
            missed: r.missed,
            updatedAt: r.updatedAt,
            snapshot: {
              ...cur.snapshot,
              pre: { ...cur.snapshot.pre, age: r.age, nihss: r.nihss, premrs: r.snapshot.pre.premrs },
              post: { ...cur.snapshot.post, strokeType: r.strokeType || undefined },
              studies: r.snapshot.studies,
              outcomes: r.snapshot.outcomes,
              notes: r.snapshot.notes,
              extras: r.snapshot.extras,
            },
          }
        : cur;
      byId.set(local.id, { ...next, sheetTs: r.savedAt });
    }
    const merged = Array.from(byId.values());
    merged.sort((a, b) => (a.savedAt < b.savedAt ? 1 : -1));
    return merged.slice(0, MAX_ENTRIES);
  });
}
