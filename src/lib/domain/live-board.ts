// Stroke code condiviso: il paziente del board visto e modificato da piu'
// dispositivi. Si sincronizza campo per campo: ogni campo porta l'ora
// dell'ultima modifica e vince la piu' recente (nessuno sovrascrive i dati
// inseriti da un altro su campi diversi).
// Mai condivisi: ID paziente (cartella) e CIP, che restano sul dispositivo.

import { GAS_URL } from "./sheet-payload";

/** Campi che non escono dal dispositivo. */
export const LOCAL_ONLY = new Set(["pre.patientId", "pre.cip"]);

export type FlatFields = Record<string, unknown>;
export interface Stamped {
  v: unknown;
  t: number;
}
export type StampedFields = Record<string, Stamped>;

export interface LiveSources {
  pre: Record<string, unknown>;
  post: Record<string, unknown>;
  hem: Record<string, unknown>;
  studies: string[];
}

const absent = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

/** Dati del paziente in chiavi piatte ("pre.age", "post.aspects", "sel.studies"), senza i campi locali. */
export function flattenLive(s: LiveSources): FlatFields {
  const out: FlatFields = {};
  for (const [group, obj] of [["pre", s.pre], ["post", s.post], ["hem", s.hem]] as const) {
    for (const [k, v] of Object.entries(obj)) {
      const key = `${group}.${k}`;
      if (!LOCAL_ONLY.has(key) && !absent(v)) out[key] = v;
    }
  }
  if (s.studies.length) out["sel.studies"] = [...s.studies];
  return out;
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Chiavi cambiate fra due istantanee (anche quelle tolte). */
export function changedKeys(prev: FlatFields, next: FlatFields): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  return [...keys].filter((k) => !same(prev[k], next[k]));
}

/**
 * Campi remoti piu' recenti dei nostri: { key: valore } (null = tolto).
 * `stamps` = ora della nostra ultima modifica (o dell'ultimo valore remoto preso).
 */
export function newerRemote(remote: StampedFields, stamps: Record<string, number>): StampedFields {
  const out: StampedFields = {};
  for (const [k, f] of Object.entries(remote)) {
    if (LOCAL_ONLY.has(k)) continue;
    if (f && typeof f.t === "number" && f.t > (stamps[k] ?? 0)) out[k] = f;
  }
  return out;
}

/** Applica i campi remoti alle sorgenti (restituisce copie). */
export function applyLive(s: LiveSources, fields: StampedFields): LiveSources {
  const next: LiveSources = { pre: { ...s.pre }, post: { ...s.post }, hem: { ...s.hem }, studies: [...s.studies] };
  for (const [key, f] of Object.entries(fields)) {
    if (key === "sel.studies") {
      next.studies = Array.isArray(f.v) ? f.v.map(String) : [];
      continue;
    }
    const dot = key.indexOf(".");
    const group = key.slice(0, dot) as "pre" | "post" | "hem";
    const k = key.slice(dot + 1);
    if (!(group === "pre" || group === "post" || group === "hem") || !k) continue;
    if (absent(f.v)) delete next[group][k];
    else next[group][k] = f.v;
  }
  return next;
}

export type LiveStatus = "open" | "closed";
export interface LiveBoardRow {
  id: string;
  updatedAt: number;
  status: LiveStatus;
  fields: StampedFields;
}

function parseRow(r: Record<string, unknown>): LiveBoardRow | null {
  const id = String(r.id ?? "");
  const updatedAt = typeof r.updatedAt === "number" ? r.updatedAt : Date.parse(String(r.updatedAt ?? ""));
  if (!id || !Number.isFinite(updatedAt)) return null;
  let fields: unknown = r.fields;
  if (typeof fields === "string") {
    try {
      fields = JSON.parse(fields);
    } catch {
      fields = {};
    }
  }
  return {
    id,
    updatedAt,
    status: r.status === "closed" ? "closed" : "open",
    fields: fields && typeof fields === "object" ? (fields as StampedFields) : {},
  };
}

export type LiveFetch = { ok: true; supported: boolean; rows: LiveBoardRow[] } | { ok: false };

/** Stroke code condivisi (ultime 24h). supported=false con lo script vecchio. */
export async function fetchLiveBoards(): Promise<LiveFetch> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(GAS_URL + "?op=boards", { method: "GET", signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as unknown;
    if (data && typeof data === "object" && !Array.isArray(data) && Array.isArray((data as { items?: unknown }).items)) {
      const rows = (data as { items: Record<string, unknown>[] }).items.map(parseRow).filter((r): r is LiveBoardRow => !!r);
      return { ok: true, supported: true, rows };
    }
    return { ok: true, supported: false, rows: [] };
  } catch {
    clearTimeout(timeoutId);
    return { ok: false };
  }
}

/** Invia i campi modificati (lo script li unisce campo per campo). */
export async function sendLiveBoard(id: string, status: LiveStatus, fields: StampedFields): Promise<boolean> {
  try {
    const body = new URLSearchParams({ payload: JSON.stringify({ kind: "board", id, status, fields }) });
    await fetch(GAS_URL + "?op=board", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
    return true;
  } catch {
    return false;
  }
}
