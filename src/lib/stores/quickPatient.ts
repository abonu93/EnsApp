// Stato della registrazione di un paziente gia' arruolato (Paziente registrato,
// ex quick-patient), separato dal flusso guided.
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
  /** Vasi target / occlusi (codici VesselCode). Opzionale. */
  targetVessels?: string[];
  /** Trattamenti in acuto: trombectomia (TEV) + relativo mTICI + trombolisi (TIV). */
  tev?: "Yes" | "No" | "";
  mtici?: string;
  tiv?: "Yes" | "No" | "";
  notes?: string;
  // --- Paziente registrato (non acuto, anche giorni dopo) ---
  /** ISO: quando il paziente e' stato visto/valutato. */
  seenDate?: string;
  /** LTSW alla valutazione: da data e ora ("clock") o riferito in ore ("hours"). */
  ltswMode?: "clock" | "hours";
  /** Ore fra ultima volta visto bene e valutazione. */
  ltswH?: number;
  /** ISO dell'ultima volta visto bene (modalita' "clock"). */
  lsw?: string;
  wakeup?: boolean;
  /** Studi in cui e' arruolato, con il braccio se lo studio ne ha uno. */
  trials?: { name: string; arm: "intervention" | "control" | "" }[];
  aspects?: number;
  gcs?: number;
  hemVolume?: number;
  reversal?: "Yes" | "No" | "";
  reversalAgent?: string;
  /** Campi aggiuntivi mostrati (via "+ Aggiungi dato"). */
  shown?: string[];
}

export const quickPatient = persisted<QuickPatientData>({
  key: "ensapp:quickPatient:v1",
  initial: {},
  ttlMs: TTL_24H,
});

export function clearQuickPatient(): void {
  quickPatient.clear();
}
