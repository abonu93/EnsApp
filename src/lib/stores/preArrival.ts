// Pre-arrivo: il paziente annunciato dal SEM, in attesa di arrivare in PS.
// Persistito sul dispositivo (TTL 24h) finche' non arriva o si scarta.

import { derived } from "svelte/store";
import { persisted } from "./persistence";
import { clearPatient, hemData, now, preData } from "./patient";
import { clearSelection } from "./trialSelection";
import { judgePreArrival, preArrivalToPatient, type PreArrival } from "$lib/domain/pre-arrival";

const TTL_24H = 24 * 60 * 60 * 1000;

export const preArrival = persisted<PreArrival | null>({
  key: "ensapp:prearrival:v1",
  initial: null,
  ttlMs: TTL_24H,
  validate: (raw) => {
    const p = raw as PreArrival | null;
    if (p === null) return null;
    return p && typeof p === "object" && p.clock && typeof p.clock.at === "number" && Array.isArray(p.anti) ? p : null;
  },
});

/** Studi all'arrivo previsto, aggiornati con l'orologio dell'app. */
export const preArrivalResult = derived([preArrival, now], ([$p, $now]) => ($p ? judgePreArrival($p, $now) : null));

export function clearPreArrival(): void {
  preArrival.clear();
}

/**
 * Il paziente e' arrivato: nuovo paziente con i dati del SEM gia' inseriti
 * (stessi campi del Board e del flusso guidato), pre-arrivo chiuso.
 */
export function arrivePreArrival(p: PreArrival): void {
  clearPatient();
  clearSelection();
  const seed = preArrivalToPatient(p);
  preData.set(seed.pre);
  hemData.set(seed.hem);
  clearPreArrival();
}
