// Formattazione del Paziente registrato (solo UI).

import type { Dictionary } from "$lib/i18n/it";
import { isMissing } from "$lib/domain/board";
import { VESSEL_SHORT, optLabel } from "../board/format";
import { REG_FIELDS, type RegFieldKey } from "./fields";

export function regLabel(t: Dictionary, key: RegFieldKey, short = false): string {
  const f = t.registered.fields[key];
  return short ? f.short : f.label;
}

export function regOption(t: Dictionary, key: RegFieldKey, v: unknown): string {
  if (key === "reversalAgent") return (t.share.reversalAgents as Record<string, string>)[String(v)] ?? String(v);
  if (REG_FIELDS[key].mono) return String(v);
  return optLabel(t, v);
}

/** Valore leggibile di un campo, o null se manca. */
export function regValue(t: Dictionary, key: RegFieldKey, v: unknown): string | null {
  const f = REG_FIELDS[key];
  if (f.kind === "vessels") {
    if (!Array.isArray(v)) return null;
    return v.length ? v.map((c) => VESSEL_SHORT[c] ?? c).join(" + ") : t.board.noneValue;
  }
  if (isMissing(v)) return null;
  if (f.kind === "num") return `${v}${f.unit ?? ""}`;
  if (f.kind === "longtext") {
    const s = String(v);
    return s.length > 18 ? `${s.slice(0, 18)}…` : s;
  }
  if (f.kind === "text") return String(v);
  return regOption(t, key, v);
}

const pad = (n: number) => String(n).padStart(2, "0");
export const hm = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();

/** "hoy" / "ayer" / "14 oct". */
export function dayWord(t: Dictionary, ms: number, now: number, locale: string): string {
  if (sameDay(ms, now)) return t.registered.today;
  if (sameDay(ms, now - 864e5)) return t.registered.yesterday;
  const d = new Date(ms);
  return `${d.getDate()} ${d.toLocaleString(locale, { month: "short" })}`;
}

/** Data completa per il messaggio (inglese come il resto del messaggio). */
export function fmtFull(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()} ${hm(ms)}`;
}
