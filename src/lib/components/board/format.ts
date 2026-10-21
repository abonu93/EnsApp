// Formattazione per il Bedside Board (solo UI).

import { FIELD_BY_KEY, isMissing } from "$lib/domain/board";
import type { Dictionary } from "$lib/i18n/it";

/** Etichette corte dei vasi per griglia e pulsanti (le lunghe sono in vessels.ts). */
export const VESSEL_SHORT: Record<string, string> = {
  "ica-intracranial": "ICA",
  "ica-terminal": "ICA-T",
  m1: "M1",
  "m2-proxdom": "M2 dom",
  "m2-any": "M2 n-dom",
  "gt-m2": "M3–M4",
  a1: "A1",
  a2: "A2",
  "gt-a2": "A3",
  basilar: "Basilar",
  p1: "P1",
  p2: "P2",
  "gt-p2": "P3",
  va: "VA",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Minuti -> "3h 05m" / "45m" / "3 d". Arrotonda prima al minuto (mai "2h 60m"). */
export function fmtMin(m: number): string {
  const s = Math.max(0, Math.round(m));
  const h = Math.floor(s / 60);
  const mm = s % 60;
  if (h >= 48) return `${Math.round(s / 1440)} d`;
  return h ? `${h}h ${pad(mm)}m` : `${mm}m`;
}

const sameDay = (a: number, b: number) => {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
};

/** "07:20", "ieri 23:10" o "14 ott 08:00". */
export function fmtClock(ts: number, now: number, yesterday: string, locale: string): string {
  const d = new Date(ts);
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  if (sameDay(ts, now)) return time;
  if (sameDay(ts, now - 864e5)) return `${yesterday} ${time}`;
  return `${d.getDate()} ${d.toLocaleString(locale, { month: "short" })} ${time}`;
}

/** Sostituisce {chiave} nel testo. */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

type Opt = keyof Dictionary["board"]["opt"];

export function optLabel(t: Dictionary, v: unknown): string {
  const key: string =
    v === true || v === "eligible" ? "yes" :
    v === false || v === "not eligible" ? "no" :
    String(v).toLowerCase();
  return (t.board.opt as Record<string, string>)[key as Opt] ?? String(v);
}

export function fieldLabel(t: Dictionary, key: string, short = false): string {
  const f = (t.board.fields as Record<string, { label: string; short: string }>)[key];
  return f ? (short ? f.short : f.label) : key;
}

/** Valore leggibile di un dato, o null se manca. */
export function fmtValue(t: Dictionary, key: string, v: unknown): string | null {
  const f = FIELD_BY_KEY[key];
  if (!f) return null;
  if (f.kind === "vessels") {
    if (!Array.isArray(v)) return null;
    return v.length ? v.map((c) => VESSEL_SHORT[c] ?? c).join(" + ") : t.board.noneValue;
  }
  if (isMissing(v)) return null;
  if (f.kind === "num") return `${v}${f.unit === " mL" ? " mL" : ""}`;
  if (key === "premrs") return String(v);
  return optLabel(t, v);
}
