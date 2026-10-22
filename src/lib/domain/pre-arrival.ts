// Pre-arrivo: i dati della chiamata del SEM (codice ictus) prima che il
// paziente arrivi in PS. NON contiene logica clinica: traduce i dati del SEM
// negli input del Bedside Board e li valuta con judgeBoard() cosi' com'e'.
// - Le finestre si contano all'ora di arrivo prevista (o adesso, se non c'e').
// - La RACE si mostra soltanto: nessuna regola la usa.
// - Il CIP resta sul dispositivo: non entra nei messaggi ne' nel foglio.

import { judgeBoard, type BoardInput, type BoardResult } from "./board";
import type { AnticoagStatus } from "./hemorrhagic-rules";

export type Antithrombotic = "none" | "antiplatelet" | "doac" | "warfarin" | "lmwh";

export const ANTITHROMBOTICS: readonly Antithrombotic[] = ["none", "antiplatelet", "doac", "warfarin", "lmwh"];

/** Arrivo previsto fra (minuti), come nel design. */
export const ETA_OPTIONS: readonly number[] = [5, 10, 15, 20, 30, 40, 50, 60];

/** Soglia della scala RACE per il sospetto di occlusione di grande vaso. */
export const RACE_LVO = 5;

export interface PreArrivalClock {
  mode: "known" | "wakeup";
  /** Esordio / ultima volta visto bene (ms). */
  at: number;
  /** Risveglio: trovato con i sintomi (ms). */
  found: number | null;
}

export interface PreArrival {
  /** Identificativo condiviso fra i dispositivi (foglio PreArrivals). */
  id?: string;
  /** Ultima modifica (ms), per capire quale versione e' la piu' recente. */
  updatedAt?: number;
  cip?: string;
  age?: number;
  premrs?: number;
  race?: number;
  /** Piu' voci insieme (es. antiaggregante + DOAC); "none" da solo. */
  anti: Antithrombotic[];
  clock: PreArrivalClock;
  /** Minuti all'arrivo scelti alla chiamata. */
  eta?: number;
  /** Ora di arrivo prevista (ms), fissata al salvataggio. */
  arriveAt?: number | null;
}

// Per l'emorragia vale il farmaco piu' restrittivo fra quelli indicati.
const ANTI_RANK: readonly Antithrombotic[] = ["warfarin", "lmwh", "doac", "antiplatelet", "none"];

/** Antitrombotico per le regole emorragiche (undefined se non indicato). */
export function hemAnticoag(anti: readonly Antithrombotic[]): AnticoagStatus | undefined {
  return ANTI_RANK.find((a) => anti.includes(a));
}

/** DOAC per le regole acute: "yes" se fra gli antitrombotici, "no" se ne e' indicato un altro. */
export function doacFlag(anti: readonly Antithrombotic[]): "yes" | "no" | undefined {
  if (!anti.length) return undefined;
  return anti.includes("doac") ? "yes" : "no";
}

/** Ora a cui si valutano le finestre: l'arrivo previsto, mai nel passato. */
export function evaluationTime(pre: PreArrival, nowMs: number): number {
  return pre.arriveAt != null ? Math.max(nowMs, pre.arriveAt) : nowMs;
}

/** Input del Board con i soli dati del SEM, all'ora `atMs`. */
export function preArrivalBoardInput(pre: PreArrival, atMs: number): BoardInput {
  const ltsw = (atMs - pre.clock.at) / 3_600_000;
  const wakeup = pre.clock.mode === "wakeup";
  const hoursSinceDiscovery = wakeup && pre.clock.found != null ? (atMs - pre.clock.found) / 3_600_000 : undefined;
  const common = { age: pre.age, premrs: pre.premrs, ltsw, hoursSinceDiscovery };
  return {
    acute: { ...common, wakeupStroke: wakeup, doac: doacFlag(pre.anti) },
    hem: { ...common, anticoag: hemAnticoag(pre.anti) },
    strokeType: undefined,
    clockSet: true,
  };
}

/** Studi possibili e fuori all'arrivo previsto. */
export function judgePreArrival(pre: PreArrival, nowMs: number): BoardResult {
  return judgeBoard(preArrivalBoardInput(pre, evaluationTime(pre, nowMs)));
}

const pad = (n: number) => String(n).padStart(2, "0");
/** "YYYY-MM-DDTHH:MM" in ora locale, come gli altri campi data del paziente. */
function localIso(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * All'arrivo: i dati del SEM negli store del paziente (preData / hemData),
 * negli stessi campi che usano il Board e il flusso guidato.
 */
export function preArrivalToPatient(pre: PreArrival): {
  pre: Record<string, unknown>;
  hem: Record<string, unknown>;
} {
  const wakeup = pre.clock.mode === "wakeup";
  const out: Record<string, unknown> = {
    ltswDate: localIso(pre.clock.at),
    wakeupStroke: wakeup,
  };
  if (wakeup && pre.clock.found != null) out.discoveryDate = localIso(pre.clock.found);
  if (pre.age != null) out.age = pre.age;
  if (pre.premrs != null) out.premrs = pre.premrs;
  const doac = doacFlag(pre.anti);
  if (doac) out.doac = doac;
  if (pre.cip) out.cip = pre.cip;
  if (pre.race != null) out.race = pre.race;
  if (pre.anti.length) out.antithrombotics = [...pre.anti];
  const anticoag = hemAnticoag(pre.anti);
  return { pre: out, hem: anticoag ? { anticoag } : {} };
}

/** Normalizza il CIP come lo detta il SEM: maiuscole, senza spazi. */
export function normalizeCip(v: string): string {
  return v.toUpperCase().replace(/\s/g, "").slice(0, 14);
}
