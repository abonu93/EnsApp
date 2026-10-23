// Stroke code condiviso: il paziente del board e' lo stesso su tutti i
// dispositivi che lo aprono. Le modifiche locali partono subito (campo per
// campo, con l'ora della modifica); quelle dei colleghi arrivano ogni 5 s.
// ID paziente e CIP restano sul dispositivo (LOCAL_ONLY).

import { derived, get, writable } from "svelte/store";
import { persisted } from "./persistence";
import { clearPatient, hasPatientInProgress, hemData, postData, preData } from "./patient";
import { clearSelection, selectedStudies } from "./trialSelection";
import {
  applyLive,
  changedKeys,
  fetchLiveBoards,
  flattenLive,
  newerRemote,
  sendLiveBoard,
  type FlatFields,
  type LiveBoardRow,
  type LiveSources,
  type StampedFields,
} from "$lib/domain/live-board";
import { newPreArrivalId } from "$lib/domain/pre-arrival-share";

const TTL_24H = 24 * 60 * 60 * 1000;
/** Uno stroke code fermo da piu' di 12 h non compare piu' nella lista. */
const LIST_MS = 12 * 60 * 60 * 1000;
const LIVE_POLL_MS = 5_000;
const IDLE_POLL_MS = 30_000;

export interface LiveLocal {
  id: string;
  /** Ora dell'ultima modifica nota di ogni campo. */
  stamps: Record<string, number>;
  /** Ultima istantanea nota (per capire cosa e' cambiato qui). */
  base: FlatFields;
  /** Campi cambiati qui e non ancora inviati. */
  pending: string[];
}

export const liveLocal = persisted<LiveLocal | null>({
  key: "ensapp:live:v1",
  initial: null,
  ttlMs: TTL_24H,
  validate: (raw) => {
    const l = raw as LiveLocal | null;
    return l && typeof l.id === "string" && l.stamps && l.base && Array.isArray(l.pending) ? l : null;
  },
});
/**
 * Stroke code del paziente attivo gia' chiuso (registrato qui o da un collega):
 * il board non deve ricondividerlo con un id nuovo finche' il paziente resta.
 */
export const liveEnded = persisted<boolean>({
  key: "ensapp:live-ended:v1",
  initial: false,
  ttlMs: TTL_24H,
  validate: (raw) => raw === true,
});
/** null = non ancora verificato; false = script del foglio non aggiornato. */
export const liveSupported = writable<boolean | null>(null);
/** Stroke code aperti dai colleghi (non quello di questo dispositivo). */
export const liveBoards = writable<LiveBoardRow[]>([]);

const sources = derived(
  [preData, postData, hemData, selectedStudies],
  ([$pre, $post, $hem, $sel]): LiveSources => ({
    pre: $pre as Record<string, unknown>,
    post: $post as Record<string, unknown>,
    hem: $hem as Record<string, unknown>,
    studies: $sel,
  })
);

let applying = false;

// Modifiche locali: si segnano con l'ora e partono dopo un attimo.
sources.subscribe((s) => {
  if (applying) return;
  const cur = get(liveLocal);
  if (!cur) return;
  const flat = flattenLive(s);
  const changed = changedKeys(cur.base, flat);
  if (!changed.length) return;
  const t = Date.now();
  const stamps = { ...cur.stamps };
  for (const k of changed) stamps[k] = t;
  liveLocal.set({ ...cur, base: flat, stamps, pending: [...new Set([...cur.pending, ...changed])] });
  schedulePush();
});

// Paziente cancellato su questo dispositivo: si esce dallo stroke code
// condiviso (per i colleghi resta aperto).
hasPatientInProgress.subscribe((has) => {
  if (has || applying) return;
  if (get(liveLocal)) liveLocal.set(null);
  if (get(liveEnded)) liveEnded.set(false);
});

let pushTimer: ReturnType<typeof setTimeout> | null = null;
function schedulePush() {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushTimer = null;
    void pushLive();
  }, 800);
}

/** Inizia a condividere il paziente del board (id del pre-arrivo, se c'era). */
export function startLive(id?: string): void {
  if (get(liveLocal)) return;
  liveEnded.set(false);
  const base = flattenLive(get(sources));
  const t = Date.now();
  const keys = Object.keys(base);
  liveLocal.set({ id: id ?? newPreArrivalId(), base, stamps: Object.fromEntries(keys.map((k) => [k, t])), pending: keys });
  schedulePush();
}

/** Riprende la condivisione di un paziente messo da parte (con le modifiche non inviate). */
export function restoreLive(l: LiveLocal | null): void {
  liveLocal.set(l);
  if (l?.pending.length) schedulePush();
}

/** Il board ha un paziente: lo condivide (una volta, non dopo la chiusura). */
export function ensureLive(): void {
  if (!get(liveLocal) && !get(liveEnded) && get(hasPatientInProgress)) startLive();
}

async function pushLive(): Promise<void> {
  const cur = get(liveLocal);
  if (!cur || !cur.pending.length) return;
  // Solo con lo script nuovo: quello vecchio scriverebbe la riga fra i pazienti.
  if (get(liveSupported) == null) await pullLive();
  if (get(liveSupported) !== true) return;
  const now = get(liveLocal);
  if (!now || now.id !== cur.id) return;
  const sent = now.pending;
  const fields: StampedFields = {};
  for (const k of sent) fields[k] = { v: now.base[k] ?? null, t: now.stamps[k] ?? Date.now() };
  liveLocal.set({ ...now, pending: [] });
  const ok = await sendLiveBoard(now.id, "open", fields);
  if (!ok) {
    const after = get(liveLocal);
    if (after && after.id === now.id) liveLocal.set({ ...after, pending: [...new Set([...after.pending, ...sent])] });
  }
}

function applyFields(fields: StampedFields): void {
  const next = applyLive(get(sources), fields);
  applying = true;
  try {
    preData.set(next.pre);
    postData.set(next.post);
    hemData.set(next.hem);
    selectedStudies.set(next.studies);
  } finally {
    applying = false;
  }
}

/** Legge il foglio: prende le modifiche dei colleghi e aggiorna la lista. */
export async function pullLive(): Promise<void> {
  const res = await fetchLiveBoards();
  if (!res.ok) return;
  liveSupported.set(res.supported);
  if (!res.supported) return;

  const cur = get(liveLocal);
  const mine = cur ? res.rows.find((r) => r.id === cur.id) : undefined;
  if (cur && mine) {
    if (mine.status === "closed") {
      // Registrato da un collega: i dati restano qui, la condivisione finisce.
      liveLocal.set(null);
      liveEnded.set(true);
    } else {
      const newer = newerRemote(mine.fields, cur.stamps);
      // Un campo cambiato qui e non ancora inviato resta il nostro.
      for (const k of cur.pending) delete newer[k];
      if (Object.keys(newer).length) {
        applyFields(newer);
        const stamps = { ...cur.stamps };
        for (const [k, f] of Object.entries(newer)) stamps[k] = f.t;
        const latest = get(liveLocal) ?? cur;
        liveLocal.set({ ...latest, stamps, base: flattenLive(get(sources)) });
      }
    }
  }

  const t = Date.now();
  const myId = get(liveLocal)?.id;
  liveBoards.set(
    res.rows
      // Anche l'ultima modifica dei campi (ora del dispositivo) dev'essere recente:
      // esclude righe con orologi sballati o scritte da test con l'ora finta.
      .filter((r) => r.status === "open" && r.id !== myId && t - r.updatedAt < LIST_MS && t - newestEdit(r) < LIST_MS)
      .sort((a, b) => b.updatedAt - a.updatedAt)
  );
}

/** Ultima modifica fra i campi di uno stroke code (0 se vuoto). */
function newestEdit(r: LiveBoardRow): number {
  let max = 0;
  for (const f of Object.values(r.fields)) if (f && typeof f.t === "number" && f.t > max) max = f.t;
  return max;
}

/**
 * Entra nello stroke code di un collega. Il paziente di questo dispositivo
 * va prima messo da parte (parkCurrent in sessions.ts).
 */
export function joinLive(row: LiveBoardRow): void {
  applying = true;
  try {
    clearPatient();
    clearSelection();
  } finally {
    applying = false;
  }
  applyFields(row.fields);
  const stamps: Record<string, number> = {};
  for (const [k, f] of Object.entries(row.fields)) if (f && typeof f.t === "number") stamps[k] = f.t;
  liveLocal.set({ id: row.id, stamps, base: flattenLive(get(sources)), pending: [] });
  liveEnded.set(false);
  liveBoards.update((list) => list.filter((r) => r.id !== row.id));
}

/** Chiude per tutti uno stroke code della lista (es. aperto per errore o di prova). */
export async function closeSharedBoard(id: string): Promise<void> {
  liveBoards.update((list) => list.filter((r) => r.id !== id));
  if (get(liveSupported) === true) await sendLiveBoard(id, "closed", {});
}

/** Paziente registrato nel foglio: lo stroke code si chiude per tutti. */
export async function closeLive(): Promise<void> {
  const cur = get(liveLocal);
  if (!cur) return;
  liveLocal.set(null);
  liveEnded.set(true);
  if (get(liveSupported) !== true) return;
  const fields: StampedFields = {};
  for (const k of cur.pending) fields[k] = { v: cur.base[k] ?? null, t: cur.stamps[k] ?? Date.now() };
  await sendLiveBoard(cur.id, "closed", fields);
}

// Aggiornamento: ogni 5 s con uno stroke code condiviso aperto, altrimenti
// ogni 30 s (per la lista in Home), solo con la pagina visibile.
let started = false;
let lastPull = 0;
export function startLiveSync(): () => void {
  if (started || typeof window === "undefined") return () => {};
  started = true;
  const tick = () => {
    if (document.visibilityState !== "visible") return;
    const every = get(liveLocal) ? LIVE_POLL_MS : IDLE_POLL_MS;
    if (Date.now() - lastPull < every - 500) return;
    lastPull = Date.now();
    void pullLive();
  };
  tick();
  const id = setInterval(tick, LIVE_POLL_MS);
  const onVis = () => {
    if (document.visibilityState === "visible") {
      lastPull = 0;
      tick();
    }
  };
  document.addEventListener("visibilitychange", onVis);
  return () => {
    started = false;
    clearInterval(id);
    document.removeEventListener("visibilitychange", onVis);
  };
}
