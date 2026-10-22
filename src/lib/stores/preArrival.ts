// Pre-arrivo: il paziente annunciato dal SEM, in attesa di arrivare in PS.
// Persistito sul dispositivo (TTL 24h) finche' non arriva o si scarta.
// Condiviso con il team tramite il foglio PreArrivals (senza CIP): chi apre
// l'app vede i pazienti in arrivo inseriti dagli altri e puo' prenderli.

import { derived, get, writable } from "svelte/store";
import { persisted } from "./persistence";
import { clearPatient, hemData, now, preData } from "./patient";
import { clearSelection } from "./trialSelection";
import { startLive } from "./liveBoard";
import { judgePreArrival, preArrivalToPatient, type PreArrival } from "$lib/domain/pre-arrival";
import {
  fetchPreArrivals,
  fromPreArrivalRow,
  newPreArrivalId,
  sendPreArrivalRow,
  toPreArrivalRow,
  type PreArrivalStatus,
} from "$lib/domain/pre-arrival-share";

const TTL_24H = 24 * 60 * 60 * 1000;
const POLL_MS = 30_000;

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

export type SharedPreArrival = PreArrival & { id: string; status: PreArrivalStatus };

/** null = non ancora verificato; false = script del foglio non aggiornato. */
export const shareSupported = writable<boolean | null>(null);
/** Pazienti in arrivo condivisi dagli altri dispositivi (non quello locale). */
export const sharedIncoming = writable<SharedPreArrival[]>([]);

/** Salva (nuovo o modificato) e lo condivide come "in arrivo". */
export function savePreArrival(p: PreArrival): void {
  const next: PreArrival = { ...p, id: p.id ?? newPreArrivalId(), updatedAt: Date.now() };
  preArrival.set(next);
  void publish(next, "incoming");
}

/** Scartato: chiuso qui e per tutti. */
export function discardPreArrival(): void {
  const p = get(preArrival);
  preArrival.clear();
  if (p) void publish({ ...p, updatedAt: Date.now() }, "discarded");
}

export function clearPreArrival(): void {
  preArrival.clear();
}

/**
 * Il paziente e' arrivato: nuovo paziente con i dati del SEM gia' inseriti
 * (stessi campi del Board e del flusso guidato), pre-arrivo chiuso per tutti.
 */
export function arrivePreArrival(p: PreArrival): void {
  clearPatient();
  clearSelection();
  const seed = preArrivalToPatient(p);
  preData.set(seed.pre);
  hemData.set(seed.hem);
  // Lo stroke code resta condiviso con lo stesso id del pre-arrivo.
  if (p.id) startLive(p.id);
  preArrival.clear();
  void publish({ ...p, updatedAt: Date.now() }, "arrived");
}

/** Prende sul dispositivo un paziente in arrivo condiviso da un collega. */
export function adoptPreArrival(s: SharedPreArrival): void {
  const { status: _status, ...p } = s;
  preArrival.set(p);
  sharedIncoming.update((list) => list.filter((x) => x.id !== s.id));
}

async function publish(p: PreArrival, status: PreArrivalStatus): Promise<void> {
  if (!p.id) return;
  // Solo con lo script nuovo: quello vecchio scriverebbe la riga fra i pazienti.
  if (get(shareSupported) == null) await refreshShared();
  if (get(shareSupported) !== true) return;
  await sendPreArrivalRow(toPreArrivalRow({ ...p, id: p.id }, status, Date.now()));
}

/** Legge il foglio: lista condivisa e, se un collega ha chiuso o modificato il nostro, lo segue. */
export async function refreshShared(): Promise<void> {
  const res = await fetchPreArrivals();
  if (!res.ok) return;
  shareSupported.set(res.supported);
  if (!res.supported) return;

  // Ultima versione di ogni id.
  const latest = new Map<string, SharedPreArrival>();
  for (const raw of res.rows) {
    const r = fromPreArrivalRow(raw);
    if (!r) continue;
    const cur = latest.get(r.id);
    if (!cur || (r.updatedAt ?? 0) >= (cur.updatedAt ?? 0)) latest.set(r.id, r);
  }

  const local = get(preArrival);
  if (local?.id) {
    const remote = latest.get(local.id);
    if (remote && (remote.updatedAt ?? 0) > (local.updatedAt ?? 0)) {
      if (remote.status === "incoming") {
        const { status: _status, ...p } = remote;
        preArrival.set({ ...p, cip: local.cip });
      } else {
        preArrival.clear();
      }
    }
  }

  const t = Date.now();
  sharedIncoming.set(
    [...latest.values()]
      .filter((r) => r.status === "incoming" && r.id !== local?.id && t - r.clock.at < TTL_24H)
      .sort((a, b) => (a.arriveAt ?? Infinity) - (b.arriveAt ?? Infinity))
  );
}

// Aggiornamento ogni 30 s mentre la pagina e' visibile, finche' almeno una
// schermata (Home, Nuovo paziente, In arrivo) lo chiede.
let watchers = 0;
let timer: ReturnType<typeof setInterval> | null = null;
let lastTick = 0;
function tick() {
  if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
  // Cambiando schermata non si rilegge il foglio a ogni passaggio.
  if (Date.now() - lastTick < 10_000) return;
  lastTick = Date.now();
  void refreshShared();
}
function onVisible() {
  if (document.visibilityState === "visible") tick();
}

/** Avvia l'aggiornamento della lista condivisa; restituisce la funzione per fermarlo. */
export function watchShared(): () => void {
  watchers++;
  if (watchers === 1) {
    tick();
    timer = setInterval(tick, POLL_MS);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", onVisible);
  }
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    watchers--;
    if (watchers === 0) {
      if (timer) clearInterval(timer);
      timer = null;
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", onVisible);
    }
  };
}
