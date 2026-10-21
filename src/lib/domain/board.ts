// Bedside Board: tutti gli studi aperti valutati con dati parziali.
// NON contiene logica clinica. Interroga i wrapper *-reasons.ts e le regole
// *-rules.ts cosi' come sono:
// - un criterio fallito e' "da sapere" se assegnando un valore a un dato
//   mancante cambia esito (il trial resta "possibile, manca X");
// - un criterio soddisfatto e' "da confermare" se un valore di un dato
//   mancante lo farebbe fallire (es. "no tandem" senza risposta);
// - la finestra si ricava facendo avanzare l'orologio sui criteri di tempo.
// Con tutti i dati compilati l'esito coincide con la regola del repo.

import * as acute from "./acute-rules";
import * as hem from "./hemorrhagic-rules";
import type { AcuteInput } from "./acute-rules";
import type { HemorrhagicInput } from "./hemorrhagic-rules";
import { REASON_BY_TRIAL } from "./acute-reasons";
import { REASON_BY_HEM_TRIAL } from "./hem-reasons";
import { EXCLUSIVE_GROUPS, TRIALS_INFO, canonicalTrialName, findTrialInfo, isTrialOpen } from "./trials-info";
import { VESSEL_OPTIONS } from "./vessels";
import type { ReasonReport } from "./reason-report";

/** Pseudo-campo: l'ora dell'ultima volta visto bene (foglio orologio). */
export const CLOCK = "__clock";

export type BoardStore = "pre" | "post" | "hem";
export type OptionValue = string | number | boolean;

export interface BoardField {
  key: string;
  store: BoardStore;
  kind: "num" | "opts" | "vessels";
  min?: number;
  max?: number;
  /** Valore iniziale dello slider quando il dato manca. */
  start?: number;
  unit?: string;
  options?: readonly OptionValue[];
  /** Valori provati per capire se il criterio dipende da questo dato. */
  probe: readonly unknown[];
  mono?: boolean;
}

const YN = ["yes", "no"] as const;
const YNNA = ["yes", "no", "na"] as const;
const CAND = ["eligible", "not eligible"] as const;
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const yn = (key: string, store: BoardStore, options: readonly OptionValue[] = YN): BoardField => ({
  key, store, kind: "opts", options, probe: options,
});

const VESSEL_PROBE: VesselCodeList[] = [
  [],
  ...VESSEL_OPTIONS.map((v) => [v.value]),
  ["ica-terminal", "m1"],
  ["m1", "m2-any"],
  ["m1", "basilar"],
];
type VesselCodeList = acute.VesselCode[];

/** Campi del paziente, con lo store in cui vivono (src/lib/stores/patient.ts). */
export const BOARD_FIELDS: readonly BoardField[] = [
  { key: "strokeType", store: "post", kind: "opts", options: ["ischemic", "hemorrhagic"], probe: [] },
  { key: "nihss", store: "pre", kind: "num", min: 0, max: 42, start: 8, mono: true,
    probe: [0, 1, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25, 26, 42] },
  { key: "premrs", store: "pre", kind: "opts", options: range(0, 5), probe: range(0, 5), mono: true },
  { key: "age", store: "pre", kind: "num", min: 18, max: 100, start: 70, unit: " y", mono: true,
    probe: [17, 18, 19, 21, 22, 23, 50, 79, 80, 81, 84, 85, 86, 88, 89, 90, 91, 99] },
  { key: "targetVessels", store: "post", kind: "vessels", probe: VESSEL_PROBE },
  { key: "aspects", store: "post", kind: "num", min: 0, max: 10, start: 8, mono: true, probe: range(0, 10) },
  { key: "candidate", store: "post", kind: "opts", options: CAND, probe: CAND },
  { key: "ivtCandidate", store: "post", kind: "opts", options: CAND, probe: CAND },
  { key: "gcs", store: "hem", kind: "num", min: 3, max: 15, start: 13, mono: true, probe: [3, 4, 5, 6, 7, 8, 9, 15] },
  { key: "hemVolume", store: "hem", kind: "num", min: 0, max: 120, start: 20, unit: " mL", mono: true,
    probe: [0, 1, 2, 10, 30, 59, 60, 100] },
  { key: "anticoag", store: "hem", kind: "opts",
    options: ["none", "antiplatelet", "doac", "warfarin", "lmwh", "heparin"],
    probe: ["none", "antiplatelet", "doac", "warfarin", "lmwh", "heparin"] },
  { key: "secondaryCause", store: "hem", kind: "opts",
    options: ["None", "Tumor", "AVM", "Aneurysm", "Cavernoma", "Traumatic", "Other"],
    probe: ["None", "Tumor"] },
  yn("spotSign", "hem"),
  { key: "wakeupSymptomsWithin6h", store: "pre", kind: "opts", options: [true, false], probe: [true, false] },
  yn("angiograph", "pre"),
  yn("doac", "pre"),
  yn("acei", "pre"),
  yn("tandem", "post"),
  yn("tortuosity", "post"),
  yn("lesionConfirmed", "post"),
  yn("contraTpa", "post"),
  yn("perfusionMismatch", "post", YNNA),
  yn("largeCore", "post"),
  yn("diabetes", "post"),
  yn("vanishCoreMismatch", "post"),
  yn("evtWithin1h", "post"),
  yn("aiCoreLt10", "post", YNNA),
  yn("tmaxGt30", "post", YNNA),
  yn("pregnant", "post"),
  yn("lifeExpectancyLt3m", "post"),
  yn("contrastAllergy", "post"),
  yn("ivtExceptDoac", "post"),
  yn("nihss1aGe2", "post"),
  yn("posteriorFossa", "post"),
  yn("coreGt70", "post"),
  yn("doacReversal", "post"),
  yn("brainstem", "hem"),
  yn("procoagulant", "hem"),
  yn("ecg", "hem"),
  yn("thrombosis", "hem"),
  yn("pregnancy", "hem"),
  yn("angioplasty", "hem"),
  yn("ivhLarge", "hem"),
  yn("ivh", "hem"),
  yn("seizure", "hem"),
];

export const FIELD_BY_KEY: Record<string, BoardField> = Object.fromEntries(BOARD_FIELDS.map((f) => [f.key, f]));

const HEM_KEYS = new Set(["age", "premrs", ...BOARD_FIELDS.filter((f) => f.store === "hem").map((f) => f.key)]);
const ACUTE_FIELDS = BOARD_FIELDS.filter((f) => f.store !== "hem" && f.key !== "strokeType");
const HEM_FIELDS = BOARD_FIELDS.filter((f) => HEM_KEYS.has(f.key));

/** Gli 8 dati in griglia, per tipo di ictus. */
export const BOARD_GRID = {
  isch: ["strokeType", "nihss", "premrs", "age", "targetVessels", "aspects", "candidate", "ivtCandidate"],
  hemo: ["strokeType", "gcs", "premrs", "age", "hemVolume", "anticoag", "secondaryCause", "spotSign"],
} as const;

export function isMissing(v: unknown): boolean {
  return v === undefined || v === null || v === "" || (typeof v === "number" && Number.isNaN(v));
}

// --------------------------------------------------------------------------
// Studi

type AnyInput = Record<string, unknown>;

interface BoardTrialDef {
  name: string;
  type: "isch" | "hemo";
  reasons: (i: AnyInput) => ReasonReport;
  rule: (i: AnyInput) => boolean;
}

const ACUTE_RULE: Record<string, (i: AcuteInput) => boolean> = {
  WeTrust: acute.weTrust,
  ATHENA: acute.athena,
  VANISH: acute.vanish,
  PIVOTAL: acute.pivotal,
  PROMISE: acute.promise,
  NiVO: acute.nivo,
  MOSTE: acute.moste,
  "TWIN-2-WIN 2": acute.twin2win2,
  ARTEMIS: acute.artemis,
  HYBERNIA: acute.hybernia,
  "DONE SYMPLE": acute.doneSymple,
  SHIONOGI: acute.shionogi,
  SOVATELTIDE: acute.sovateltide,
  ORION: acute.orion,
  "DO-IT": acute.doit,
  REMEDY: acute.remedy,
  "NORA HOME": acute.noraHome,
  TENACITY: acute.tenacity,
  "SAIL-MeVO": acute.sailMevo,
};

const HEM_RULE: Record<string, (i: HemorrhagicInput) => boolean> = {
  FASTEST: (i) => hem.fastest(i).eligible,
  "TICH-3": hem.tich3,
};

/** WeTrust si randomizza prima dell'imaging (come in stores/eligibility.ts). */
const TYPE_INDEPENDENT = new Set(["WeTrust"]);

const ALL_TRIALS: BoardTrialDef[] = [
  ...Object.entries(REASON_BY_TRIAL).map(([name, fn]) => ({
    name,
    type: "isch" as const,
    reasons: fn as unknown as BoardTrialDef["reasons"],
    rule: ACUTE_RULE[name] as unknown as BoardTrialDef["rule"],
  })),
  ...Object.entries(REASON_BY_HEM_TRIAL).map(([name, fn]) => ({
    name,
    type: "hemo" as const,
    reasons: fn as unknown as BoardTrialDef["reasons"],
    rule: HEM_RULE[name] as unknown as BoardTrialDef["rule"],
  })),
];

/** Studi proposti dal board: solo quelli con reclutamento aperto. */
export const BOARD_TRIALS = ALL_TRIALS.filter((t) => isTrialOpen(t.name));

/** Studi chiusi o in pausa (trials-info.ts), elencati a fondo pagina. */
export const NOT_RECRUITING: Array<{ name: string; status: string }> = Object.entries(TRIALS_INFO)
  .filter(([, info]) => info.status === "closed" || info.status === "paused")
  .map(([name, info]) => ({ name, status: info.status }));

// --------------------------------------------------------------------------
// Valutazione

export type RowKind = "type" | "time" | "criterion";

export interface BoardRow {
  /** Testo del criterio (da *-reasons.ts); per kind "type" e' "ischemic" o "hemorrhagic". */
  label: string;
  kind: RowKind;
  /** true soddisfatto, false fallito, null non ancora noto. */
  res: boolean | null;
  /** Soddisfatto solo perche' il dato manca: da confermare prima di arruolare. */
  pending: boolean;
  /** Dato che lo decide (campo di BOARD_FIELDS o CLOCK). */
  field?: string;
}

export interface BoardWindow {
  /** Minuti alla chiusura (Infinity: nessun limite superiore). */
  leftMin: number;
  /** Minuti all'apertura (0 se gia' aperta). */
  opensInMin: number;
  /** Frazione trascorsa della finestra corrente (0-1). */
  elapsedFrac: number;
}

export type BoardStatus = "eligible" | "possible" | "out";

export interface BoardJudgement {
  name: string;
  type: "isch" | "hemo";
  focus: string;
  status: BoardStatus;
  rows: BoardRow[];
  /** Criteri falliti (status "out"). */
  fails: BoardRow[];
  /** Dati che mancano per decidere, in ordine di griglia. */
  needs: string[];
  window: BoardWindow | null;
  closed: boolean;
  early: boolean;
}

export interface BoardInput {
  acute: Partial<AcuteInput>;
  hem: Partial<HemorrhagicInput>;
  strokeType?: string;
  /** False se l'ora dell'ultima volta visto bene non e' ancora inserita. */
  clockSet: boolean;
}

/** LVO segue la candidatura EVT, esattamente come in PostImaging.svelte. */
function withDerived(i: AnyInput): AnyInput {
  if (i.candidate === "eligible") return { ...i, lvo: "yes" };
  if (i.candidate === "not eligible") return { ...i, lvo: "no" };
  return i;
}

function failSet(def: BoardTrialDef, i: AnyInput): Set<string> {
  try {
    return new Set(def.reasons(withDerived(i)).fail);
  } catch {
    return new Set(["__error"]);
  }
}

function ruleOk(def: BoardTrialDef, i: AnyInput): boolean {
  try {
    return def.rule(withDerived(i)) === true;
  } catch {
    return false;
  }
}

const sameValue = (a: unknown, b: unknown) =>
  a === b || (Array.isArray(a) && Array.isArray(b) && JSON.stringify(a) === JSON.stringify(b));

const TIME_SAMPLES = [
  0.1, 0.5, 1, 1.4, 1.6, 2, 2.5, 3, 4, 4.2, 4.4, 4.6, 5, 5.5, 6.5, 7.5, 8.5, 9.5, 11, 11.9, 12.1,
  15, 16.5, 20, 22.9, 23.5, 24.5, 25.5, 30, 48, 60, 71, 73, 90,
];

/** Sposta l'orologio di `dh` ore: LTSW e ore dalla scoperta avanzano insieme. */
function shift(i: AnyInput, dh: number): AnyInput {
  const d = i.hoursSinceDiscovery;
  return {
    ...i,
    ltsw: (i.ltsw as number) + dh,
    hoursSinceDiscovery: typeof d === "number" && Number.isFinite(d) ? d + dh : d,
  };
}

const FIELD_ORDER = [...BOARD_GRID.isch, ...BOARD_GRID.hemo, ...BOARD_FIELDS.map((f) => f.key)];
const byFieldOrder = (a: string, b: string) => {
  const ia = a === CLOCK ? -1 : FIELD_ORDER.indexOf(a);
  const ib = b === CLOCK ? -1 : FIELD_ORDER.indexOf(b);
  return ia - ib;
};

const STEP_H = 0.5; // scansione a 30 min (nessuna finestra e' piu' corta), poi bisezione al minuto
const HORIZON_H = 96;

function windowOf(def: BoardTrialDef, input: AnyInput, timeLabels: string[]): BoardWindow & { closed: boolean } {
  const okAt = (dh: number) => {
    const f = failSet(def, shift(input, dh));
    return timeLabels.every((l) => !f.has(l));
  };
  // Primo istante (ore da adesso) in cui okAt(dh) diventa `target`, cercando in avanti.
  const firstForward = (target: boolean): number => {
    let prev = 0;
    for (let dh = STEP_H; dh <= HORIZON_H; dh += STEP_H) {
      if (okAt(dh) === target) {
        let lo = prev, hi = dh;
        while (hi - lo > 1 / 60) {
          const mid = (lo + hi) / 2;
          if (okAt(mid) === target) hi = mid; else lo = mid;
        }
        return hi;
      }
      prev = dh;
    }
    return Infinity;
  };
  const ltsw = input.ltsw as number;
  if (okAt(0)) {
    const end = firstForward(false);
    // Inizio della finestra: indietro fino all'esordio.
    let start = -ltsw;
    for (let dh = -STEP_H; dh >= -ltsw; dh -= STEP_H) {
      if (!okAt(dh)) { start = dh; break; }
    }
    const span = end - start;
    const elapsedFrac = Number.isFinite(span) && span > 0 ? Math.min(1, Math.max(0, -start / span)) : 0;
    return { leftMin: end * 60, opensInMin: 0, elapsedFrac, closed: false };
  }
  const opens = firstForward(true);
  return { leftMin: Infinity, opensInMin: opens * 60, elapsedFrac: 0, closed: !Number.isFinite(opens) };
}

export function judgeTrial(def: BoardTrialDef, board: BoardInput): BoardJudgement {
  const input = (def.type === "hemo" ? board.hem : board.acute) as AnyInput;
  const fields = def.type === "hemo" ? HEM_FIELDS : ACUTE_FIELDS;
  const clockSet = board.clockSet && typeof input.ltsw === "number" && Number.isFinite(input.ltsw);

  let report: ReasonReport;
  try {
    report = def.reasons(withDerived(input));
  } catch {
    report = { meet: [], fail: [], eligible: false, labels: [] };
  }
  const base = new Set(report.fail);
  const labels = report.labels;
  const deps = new Map<string, Set<string>>(labels.map((l) => [l, new Set()]));
  const timeDep = new Set<string>();
  const missing = new Set(fields.filter((f) => isMissing(input[f.key])).map((f) => f.key));
  if (!clockSet) missing.add(CLOCK);

  const note = (probe: AnyInput, key: string | null) => {
    const f = failSet(def, probe);
    for (const l of labels) {
      if (f.has(l) !== base.has(l)) {
        if (key) deps.get(l)!.add(key);
        else timeDep.add(l);
      }
    }
  };
  for (const field of fields) {
    for (const v of field.probe) {
      if (!sameValue(v, input[field.key])) note({ ...input, [field.key]: v }, field.key);
    }
  }
  for (const t of TIME_SAMPLES) {
    if (clockSet) note(shift(input, t - (input.ltsw as number)), null);
    else note({ ...input, ltsw: t }, CLOCK);
  }

  const rows: BoardRow[] = [];
  if (!TYPE_INDEPENDENT.has(def.name)) {
    const want = def.type === "hemo" ? "hemorrhagic" : "ischemic";
    rows.push({
      label: want,
      kind: "type",
      res: isMissing(board.strokeType) ? null : board.strokeType === want,
      pending: false,
      field: "strokeType",
    });
  }
  const timeLabels: string[] = [];
  for (const label of labels) {
    const d = [...deps.get(label)!].sort(byFieldOrder);
    const miss = d.filter((k) => missing.has(k));
    const ok = !base.has(label);
    const isTime = timeDep.has(label) && miss.length === 0;
    if (isTime) timeLabels.push(label);
    rows.push({
      label,
      kind: isTime ? "time" : "criterion",
      res: ok ? true : miss.length ? null : false,
      pending: ok && miss.length > 0,
      field: miss[0] ?? d[0] ?? (timeDep.has(label) ? CLOCK : undefined),
    });
  }

  const win = clockSet && timeLabels.length ? windowOf(def, input, timeLabels) : null;
  const closed = !!win?.closed;
  const early = !!win && !win.closed && win.opensInMin > 0;
  const fails = rows.filter((r) => r.res === false && r.kind !== "time");
  const unknown = rows.filter((r) => r.res === null);
  const needs = [...new Set(unknown.map((r) => r.field!).filter(Boolean))].sort(byFieldOrder);

  let status: BoardStatus;
  if (closed || fails.length) status = "out";
  else if (unknown.length || early) status = "possible";
  // Le regole restano l'ultima parola: un esito diverso non diventa "eligible".
  else status = ruleOk(def, input) ? "eligible" : "possible";

  return {
    name: def.name,
    type: def.type,
    focus: findTrialInfo(def.name)?.category ?? "",
    status,
    rows,
    fails,
    needs,
    window: win ? { leftMin: win.leftMin, opensInMin: win.opensInMin, elapsedFrac: win.elapsedFrac } : null,
    closed,
    early,
  };
}

export interface BoardResult {
  /** Eligible e possibili, i piu' urgenti prima. */
  open: BoardJudgement[];
  out: BoardJudgement[];
  eligible: BoardJudgement[];
  /** Gruppi di studi eleggibili che non si possono combinare (EXCLUSIVE_GROUPS). */
  conflicts: string[][];
  /** Il dato che sblocca piu' studi aperti. */
  next: { field: string; decides: number } | null;
  /** Dati fuori griglia che gli studi aperti guardano ancora. */
  extra: string[];
}

const RANK: Record<BoardStatus, number> = { eligible: 0, possible: 1, out: 2 };

export function judgeBoard(board: BoardInput): BoardResult {
  const all = BOARD_TRIALS.map((t) => judgeTrial(t, board));
  const open = all
    .filter((j) => j.status !== "out")
    .sort((a, b) =>
      RANK[a.status] - RANK[b.status] ||
      Number(a.early) - Number(b.early) ||
      (a.window?.leftMin ?? Infinity) - (b.window?.leftMin ?? Infinity)
    );
  const eligible = open.filter((j) => j.status === "eligible");
  const eligibleKeys = new Set(eligible.map((j) => canonicalTrialName(j.name)));
  const conflicts = EXCLUSIVE_GROUPS
    .map((g) => eligible.filter((j) => g.some((n) => canonicalTrialName(n) === canonicalTrialName(j.name))).map((j) => j.name))
    .filter((g) => g.length > 1 && g.every((n) => eligibleKeys.has(canonicalTrialName(n))));

  const tally = new Map<string, number>();
  for (const j of open) for (const k of j.needs) tally.set(k, (tally.get(k) ?? 0) + 1);
  const top = [...tally.entries()].sort((a, b) => b[1] - a[1] || byFieldOrder(a[0], b[0]))[0];

  const type = board.strokeType === "hemorrhagic" ? "hemo" : "isch";
  const grid = new Set<string>(BOARD_GRID[type]);
  // I dati dell'emorragia servono solo quando l'imaging la mostra.
  const extraFrom = open.filter((j) => j.type === "isch" || type === "hemo");
  const extra = [...new Set(extraFrom.flatMap((j) => j.rows.map((r) => r.field)))]
    .filter((k): k is string => !!k && k !== CLOCK && !!FIELD_BY_KEY[k] && !grid.has(k))
    .sort(byFieldOrder);

  return {
    open,
    out: all.filter((j) => j.status === "out"),
    eligible,
    conflicts,
    next: top ? { field: top[0], decides: top[1] } : null,
    extra,
  };
}
