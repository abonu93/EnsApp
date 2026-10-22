// Pre-arrivo: i pazienti annunciati dal SEM (anche piu' ambulanze insieme),
// in attesa di arrivare in PS. Persistiti sul dispositivo (TTL 24h) finche'
// non arrivano o si scartano.
// Condiviso con il team tramite il foglio PreArrivals (senza CIP): chi apre
// l'app vede i pazienti in arrivo inseriti dagli altri e puo' prenderli.

import { derived, get, writable } from "svelte/store";
import { persisted } from "./persistence";
import { hemData, preData } from "./patient";
import { startLive } from "./liveBoard";
import { parkCurrent } from "./sessions";
import { preArrivalToPatient, type PreArrival } from "$lib/domain/pre-arrival";
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

/** Pazienti in arrivo (piu' ambulanze insieme), ognuno con il suo id. */
export const preArrivals = persisted<PreArrival[]>({
  key: "ensapp:prearrival:v1",
  initial: [],
  ttlMs: TTL_24H,
  // Prima c'era un solo pre-arrivo (oggetto): diventa una lista.
  validate: (raw) => {
    const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return (list as PreArrival[])
      .filter((p) => p && typeof p === "object" && p.clock && typeof p.clock.at === "number" && Array.isArray(p.anti))
      .map((p) => (p.id ? p : { ...p, id: newPreArrivalId() }));
  },
});

/** In ordine di arrivo previsto (senza ETA in fondo). */
export const preArrivalsByEta = derived(preArrivals, ($l) =>
  [...$l].sort((a, b) => (a.arriveAt ?? Infinity) - (b.arriveAt ?? Infinity))
);

export function findPreArrival(id: string | undefined): PreArrival | undefined {
  return id ? get(preArrivals).find((p) => p.id === id) : undefined;
}

export type SharedPreArrival = PreArrival & { id: string; status: PreArrivalStatus };

/** null = non ancora verificato; false = script del foglio non aggiornato. */
export const shareSupported = writable<boolean | null>(null);
/** Pazienti in arrivo condivisi dagli altri dispositivi (non quelli locali). */
export const sharedIncoming = writable<SharedPreArrival[]>([]);

const without = (id: string | undefined) => preArrivals.update((l) => l.filter((x) => x.id !== id));

/** Salva (nuovo o modificato) e lo condivide come "in arrivo". Restituisce l'id. */
export function savePreArrival(p: PreArrival): string {
  const next: PreArrival = { ...p, id: p.id ?? newPreArrivalId(), updatedAt: Date.now() };
  preArrivals.update((l) => (l.some((x) => x.id === next.id) ? l.map((x) => (x.id === next.id ? next : x)) : [...l, next]));
  void publish(next, "incoming");
  return next.id!;
}

/** Scartato: chiuso qui e per tutti. */
export function discardPreArrival(id: string): void {
  const p = findPreArrival(id);
  without(id);
  if (p) void publish({ ...p, updatedAt: Date.now() }, "discarded");
}

/**
 * Il paziente e' arrivato: nuovo paziente con i dati del SEM gia' inseriti
 * (stessi campi del Board e del flusso guidato), pre-arrivo chiuso per tutti.
 */
export function arrivePreArrival(p: PreArrival): void {
  // Il paziente gia' aperto resta fra gli altri pazienti.
  parkCurrent();
  const seed = preArrivalToPatient(p);
  preData.set(seed.pre);
  hemData.set(seed.hem);
  // Lo stroke code resta condiviso con lo stesso id del pre-arrivo.
  if (p.id) startLive(p.id);
  without(p.id);
  void publish({ ...p, updatedAt: Date.now() }, "arrived");
}

/** Chiude per tutti un pre-arrivo condiviso da un collega (es. inserito per errore). */
export function discardSharedPreArrival(s: SharedPreArrival): void {
  sharedIncoming.update((list) => list.filter((x) => x.id !== s.id));
  void publish({ ...s, updatedAt: Date.now() }, "discarded");
}

/** Prende sul dispositivo un paziente in arrivo condiviso da un collega. */
export function adoptPreArrival(s: SharedPreArrival): void {
  const { status: _status, ...p } = s;
  preArrivals.update((l) => [...l.filter((x) => x.id !== p.id), p]);
  sharedIncoming.update((list) => list.filter((x) => x.id !== s.id));
}

async function publish(p: PreArrival, status: PreArrivalStatus): Promise<void> {
  if (!p.id) return;
  // Solo con lo script nuovo: quello vecchio scriverebbe la riga fra i pazienti.
  if (get(shareSupported) == null) await refreshShared();
  if (get(shareSupported) !== true) return;
  await sendPreArrivalRow(toPreArrivalRow({ ...p, id: p.id }, status, Date.now()));
}

/** Legge il foglio: lista condivisa e, se un collega ha chiuso o modificato i nostri, li segue. */
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

  preArrivals.update((list) =>
    list.flatMap((local) => {
      const remote = local.id ? latest.get(local.id) : undefined;
      if (!remote || (remote.updatedAt ?? 0) <= (local.updatedAt ?? 0)) return [local];
      if (remote.status !== "incoming") return [];
      const { status: _status, ...p } = remote;
      return [{ ...p, cip: local.cip }];
    })
  );

  const t = Date.now();
  const mine = new Set(get(preArrivals).map((p) => p.id));
  sharedIncoming.set(
    [...latest.values()]
      .filter((r) => r.status === "incoming" && !mine.has(r.id) && t - r.clock.at < TTL_24H)
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
