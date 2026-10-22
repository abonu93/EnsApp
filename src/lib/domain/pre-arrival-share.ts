// Pre-arrivo condiviso: messaggio WhatsApp e riga del foglio "PreArrivals".
// NON contiene logica clinica: riporta l'esito di judgePreArrival().
// Il CIP non esce mai dal dispositivo: non e' ne' nel messaggio ne' nella riga.

import { GAS_URL } from "./sheet-payload";
import { ANTITHROMBOTICS, RACE_LVO, evaluationTime, type Antithrombotic, type PreArrival } from "./pre-arrival";
import type { BoardResult } from "./board";

export type PreArrivalStatus = "incoming" | "arrived" | "discarded";

/** Riga del foglio PreArrivals (stessi nomi delle colonne). */
export interface PreArrivalRow {
  id: string;
  updatedAt: string;
  status: PreArrivalStatus;
  age: number | "";
  premrs: number | "";
  race: number | "";
  anti: string;
  clockMode: "known" | "wakeup";
  at: string;
  found: string;
  arriveAt: string;
  eta: number | "";
  nihss: number | "";
}

const iso = (ms: number | null | undefined) => (ms == null ? "" : new Date(ms).toISOString());
const ms = (v: unknown): number | null => {
  if (v === "" || v == null) return null;
  const t = typeof v === "number" ? v : Date.parse(String(v));
  return Number.isFinite(t) ? t : null;
};
const num = (v: unknown): number | undefined => {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export function newPreArrivalId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `pa-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Riga da inviare (senza CIP). */
export function toPreArrivalRow(p: PreArrival & { id: string }, status: PreArrivalStatus, nowMs: number): PreArrivalRow {
  return {
    id: p.id,
    updatedAt: iso(p.updatedAt ?? nowMs),
    status,
    age: p.age ?? "",
    premrs: p.premrs ?? "",
    race: p.race ?? "",
    anti: p.anti.join(","),
    clockMode: p.clock.mode,
    at: iso(p.clock.at),
    found: iso(p.clock.found),
    arriveAt: iso(p.arriveAt),
    eta: p.eta ?? "",
    nihss: p.nihss ?? "",
  };
}

/** Riga letta dal foglio -> pre-arrivo (null se illeggibile). */
export function fromPreArrivalRow(r: Record<string, unknown>): (PreArrival & { id: string; status: PreArrivalStatus }) | null {
  const id = String(r.id ?? "").trim();
  const at = ms(r.at);
  const status = r.status === "arrived" || r.status === "discarded" ? r.status : r.status === "incoming" ? "incoming" : null;
  if (!id || at == null || !status) return null;
  const anti = String(r.anti ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is Antithrombotic => (ANTITHROMBOTICS as readonly string[]).includes(s));
  const wakeup = r.clockMode === "wakeup";
  return {
    id,
    status,
    updatedAt: ms(r.updatedAt) ?? undefined,
    age: num(r.age),
    nihss: num(r.nihss),
    premrs: num(r.premrs),
    race: num(r.race),
    anti,
    clock: { mode: wakeup ? "wakeup" : "known", at, found: wakeup ? ms(r.found) : null },
    eta: num(r.eta),
    arriveAt: ms(r.arriveAt),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");
const clockOf = (t: number) => `${pad(new Date(t).getHours())}:${pad(new Date(t).getMinutes())}`;
function dur(m: number): string {
  const s = Math.max(0, Math.round(m));
  const h = Math.floor(s / 60);
  return h ? `${h}h ${pad(s % 60)}m` : `${s % 60}m`;
}
const ANTI_TEXT: Record<Antithrombotic, string> = {
  none: "none",
  antiplatelet: "antiplatelet",
  doac: "DOAC",
  warfarin: "VKA",
  lmwh: "LMWH/heparin",
};

/**
 * Messaggio per i canali WhatsApp del team (in inglese, come il messaggio
 * di Share). Gli studi sono quelli possibili all'arrivo previsto.
 */
export function buildPreArrivalMessage(p: PreArrival, res: BoardResult, nowMs: number): string {
  const t = evaluationTime(p, nowMs);
  const lines: string[] = ["Stroke code pre-arrival (SEM)"];
  if (p.arriveAt != null) {
    const eta = (p.arriveAt - nowMs) / 60_000;
    lines.push(eta > 0.5 ? `ETA ${dur(eta)} (~${clockOf(p.arriveAt)})` : `Arriving now (~${clockOf(p.arriveAt)})`);
  } else {
    lines.push("ETA unknown");
  }
  const facts: string[] = [];
  if (p.age != null) facts.push(`Age ${p.age}`);
  if (p.nihss != null) facts.push(`NIHSS ${p.nihss}`);
  if (p.premrs != null) facts.push(`pre-mRS ${p.premrs}`);
  if (p.race != null) facts.push(`RACE ${p.race}${p.race >= RACE_LVO ? " (LVO suspected)" : ""}`);
  if (facts.length) lines.push(facts.join(" · "));
  if (p.anti.length) lines.push(`Antithrombotics: ${p.anti.map((a) => ANTI_TEXT[a]).join(" + ")}`);
  const since = dur((t - p.clock.at) / 60_000);
  if (p.clock.mode === "known") {
    lines.push(`Onset ${clockOf(p.clock.at)} · ${since} ${p.arriveAt != null ? "at arrival" : "now"}`);
  } else {
    const found = p.clock.found != null ? `, found ${clockOf(p.clock.found)}` : "";
    lines.push(`Wake-up / unknown: last seen well ${clockOf(p.clock.at)}${found} · ${since} ${p.arriveAt != null ? "at arrival" : "now"}`);
  }
  lines.push("");
  if (res.open.length) {
    lines.push(`Possible at arrival (${res.open.length}):`);
    for (const j of res.open) {
      const w = j.window;
      const when = !w ? "" : j.early ? ` (opens in ${dur(w.opensInMin)})` : Number.isFinite(w.leftMin) ? ` (${dur(w.leftMin)} left)` : "";
      lines.push(`- ${j.name}${when}`);
    }
  } else {
    lines.push("No trial open at arrival");
  }
  if (res.out.length) lines.push(`Out: ${res.out.map((j) => j.name).join(", ")}`);
  lines.push("NIHSS and imaging decide the rest.");
  return lines.join("\n");
}

export function whatsAppUrl(message: string): string {
  return "https://wa.me/?text=" + encodeURIComponent(message);
}

// --------------------------------------------------------------------------
// Foglio PreArrivals (Apps Script). Lo script vecchio, senza op=prearrivals,
// risponde [] a ogni GET diverso da list: la risposta { v, items } dice che
// lo script nuovo c'e', e solo allora si invia (altrimenti la riga finirebbe
// fra i pazienti).

export type PreArrivalFetch =
  | { ok: true; supported: boolean; rows: Record<string, unknown>[] }
  | { ok: false; reason: string };

export async function fetchPreArrivals(): Promise<PreArrivalFetch> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(GAS_URL + "?op=prearrivals", { method: "GET", signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { ok: false, reason: "HTTP " + res.status };
    const data = (await res.json()) as unknown;
    if (data && typeof data === "object" && !Array.isArray(data) && Array.isArray((data as { items?: unknown }).items)) {
      return { ok: true, supported: true, rows: (data as { items: Record<string, unknown>[] }).items };
    }
    return { ok: true, supported: false, rows: [] };
  } catch (e) {
    clearTimeout(timeoutId);
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}

export async function sendPreArrivalRow(row: PreArrivalRow): Promise<boolean> {
  try {
    const body = new URLSearchParams({ payload: JSON.stringify({ kind: "prearrival", ...row }) });
    await fetch(GAS_URL + "?op=prearrival", {
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
