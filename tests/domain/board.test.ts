// Bedside Board: l'esito con dati parziali non deve mai contraddire le regole.
// - Dati completi: "eligible" sse la regola del repo da' true.
// - Dati parziali: se esiste un completamento eleggibile, il trial non e' "out"
//   (nessuno studio escluso per un dato che manca).

import { describe, test, expect } from "vitest";
import { BOARD_FIELDS, BOARD_TRIALS, CLOCK, judgeBoard, judgeTrial, type BoardInput } from "$lib/domain/board";
import * as acute from "$lib/domain/acute-rules";
import * as hem from "$lib/domain/hemorrhagic-rules";

// PRNG deterministico (mulberry32)
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T,>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

type Rec = Record<string, unknown>;

function completeCase(r: () => number) {
  const strokeType = pick(r, ["ischemic", "hemorrhagic"] as const);
  const values: Rec = {};
  for (const f of BOARD_FIELDS) {
    if (f.key === "strokeType") continue;
    values[f.key] = f.probe.length ? pick(r, f.probe) : undefined;
  }
  // Valori "favorevoli" piu' frequenti, per avere abbastanza eleggibili.
  if (r() < 0.6) Object.assign(values, { age: 66, premrs: 0, nihss: pick(r, [6, 10, 14]), aspects: 9, targetVessels: [pick(r, ["m1", "ica-terminal", "m2-any", "gt-m2"])] });
  const wakeup = r() < 0.25;
  const ltsw = pick(r, [0.4, 1.2, 1.8, 3, 4.1, 5, 7, 10, 13, 20, 30, 50]);
  const clock: Rec = {
    ltsw,
    wakeupStroke: wakeup,
    hoursSinceDiscovery: wakeup ? Math.max(0.2, ltsw - pick(r, [1, 3, 6])) : undefined,
  };
  if (!wakeup) values.wakeupSymptomsWithin6h = undefined;
  if (values.candidate === "eligible") values.lvo = "yes";
  else if (values.candidate === "not eligible") values.lvo = "no";
  return { strokeType, values, clock };
}

function boardOf(c: ReturnType<typeof completeCase>, values: Rec = c.values, strokeType: string | undefined = c.strokeType): BoardInput {
  const input = { ...values, ...c.clock };
  return { acute: input as never, hem: input as never, strokeType, clockSet: true };
}

/** Esito delle regole come in stores/eligibility.ts (filtro per tipo incluso). */
function ruleSays(name: string, c: ReturnType<typeof completeCase>): boolean {
  const input = { ...c.values, ...c.clock } as never;
  const def = BOARD_TRIALS.find((t) => t.name === name)!;
  if (def.type === "hemo") return c.strokeType === "hemorrhagic" && def.rule(input);
  if (c.strokeType === "hemorrhagic" && name !== "WeTrust") return false;
  return def.rule(input);
}

describe("board: catalogo", () => {
  test("ogni studio aperto ha regola e reasons", () => {
    expect(BOARD_TRIALS.length).toBeGreaterThan(10);
    for (const t of BOARD_TRIALS) {
      expect(typeof t.rule, t.name).toBe("function");
      expect(typeof t.reasons, t.name).toBe("function");
    }
  });
});

describe("board: dati completi = regole del repo", () => {
  test("eligible sse la regola e' vera (500 casi casuali)", () => {
    const r = rng(42);
    let eligibleSeen = 0;
    for (let n = 0; n < 500; n++) {
      const c = completeCase(r);
      const res = judgeBoard(boardOf(c));
      for (const def of BOARD_TRIALS) {
        const j = [...res.open, ...res.out].find((x) => x.name === def.name)!;
        const expected = ruleSays(def.name, c);
        if (expected) eligibleSeen++;
        expect({ trial: def.name, n, status: j.status === "eligible" }).toEqual({ trial: def.name, n, status: expected });
      }
    }
    expect(eligibleSeen).toBeGreaterThan(50);
  });
});

describe("board: dati parziali non escludono mai per errore", () => {
  test("se il completamento e' eleggibile, il trial non e' out", () => {
    const r = rng(7);
    let checked = 0;
    for (let n = 0; n < 800; n++) {
      const c = completeCase(r);
      const eligibleNames = BOARD_TRIALS.filter((d) => ruleSays(d.name, c)).map((d) => d.name);
      if (!eligibleNames.length) continue;
      const partial: Rec = {};
      for (const [k, v] of Object.entries(c.values)) if (r() < 0.5) partial[k] = v;
      if (partial.candidate === undefined) delete partial.lvo;
      const type = r() < 0.3 ? undefined : c.strokeType;
      const res = judgeBoard(boardOf(c, partial, type));
      for (const name of eligibleNames) {
        const j = res.out.find((x) => x.name === name);
        expect({ name, n, out: !!j, fails: j?.fails.map((f) => f.label) }).toEqual({ name, n, out: false, fails: undefined });
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(80);
  });
});

describe("board: scenari al letto", () => {
  const def = (name: string) => BOARD_TRIALS.find((t) => t.name === name)!;
  const pre = { age: 72, nihss: 14, premrs: 1, ltsw: 95 / 60, wakeupStroke: false };

  test("pre-TC: WeTrust chiede solo l'angiografo, gli ischemici chiedono l'imaging", () => {
    const b: BoardInput = { acute: pre, hem: pre, clockSet: true };
    const w = judgeTrial(def("WeTrust"), b);
    expect(w.status).toBe("possible");
    expect(w.needs).toEqual(["angiograph"]);
    const athena = judgeTrial(def("ATHENA"), b);
    expect(athena.status).toBe("possible");
    expect(athena.needs[0]).toBe("strokeType");
    expect(athena.needs).toContain("targetVessels");
  });

  test("finestra: PIVOTAL (< 8h) a 1h35 chiude fra 6h25", () => {
    const b: BoardInput = { acute: pre, hem: pre, clockSet: true };
    const p = judgeTrial(def("PIVOTAL"), b);
    expect(Math.round(p.window!.leftMin)).toBe(8 * 60 - 95);
    expect(p.window!.elapsedFrac).toBeCloseTo(95 / 480, 2);
  });

  test("finestra non ancora aperta: DONE SYMPLE (24-72h) e' fuori, apre fra ~22h", () => {
    const b: BoardInput = { acute: { ...pre, ltsw: 2 }, hem: pre, clockSet: true };
    const d = judgeTrial(def("DONE SYMPLE"), b);
    expect(d.early).toBe(true);
    expect(d.status).toBe("out");
    expect(Math.round(d.window!.opensInMin / 60)).toBe(22);
  });

  test("finestra chiusa: FASTEST oltre 2h e' out", () => {
    const h = { ...pre, ltsw: 2.5 };
    const f = judgeTrial(def("FASTEST"), { acute: h, hem: h, strokeType: "hemorrhagic", clockSet: true });
    expect(f.closed).toBe(true);
    expect(f.status).toBe("out");
  });

  test("senza orologio i criteri di tempo chiedono l'LTSW", () => {
    const { ltsw: _omit, ...noClock } = pre;
    const p = judgeTrial(def("PIVOTAL"), { acute: noClock, hem: noClock, clockSet: false });
    expect(p.needs).toContain(CLOCK);
    expect(p.window).toBeNull();
  });

  test("criterio soft senza dato: 'no tandem' e' da confermare, non blocca", () => {
    const post = { ...pre, strokeType: "ischemic", targetVessels: ["m1"], aspects: 8, candidate: "eligible", lvo: "yes", ivtCandidate: "eligible", angiograph: "yes" };
    const b: BoardInput = { acute: post as never, hem: post as never, strokeType: "ischemic", clockSet: true };
    const p = judgeTrial(def("PIVOTAL"), b);
    const tandem = p.rows.find((r) => r.field === "tandem")!;
    expect(tandem.res).toBe(true);
    expect(tandem.pending).toBe(true);
    expect(p.status).toBe("eligible");
    expect(acute.pivotal(post as never)).toBe(true);
  });

  test("conflitti solo fra studi dello stesso gruppo esclusivo", () => {
    const mevo = { age: 66, nihss: 11, premrs: 0, ltsw: 3, wakeupStroke: false, strokeType: "ischemic", targetVessels: ["m2-any"], aspects: 9, candidate: "eligible", lvo: "yes", ivtCandidate: "not eligible", tandem: "no", aiCoreLt10: "yes", tmaxGt30: "yes", pregnant: "no", lifeExpectancyLt3m: "no", contrastAllergy: "no" };
    const res = judgeBoard({ acute: mevo as never, hem: mevo as never, strokeType: "ischemic", clockSet: true });
    expect(res.eligible.map((j) => j.name)).toEqual(expect.arrayContaining(["NiVO", "SAIL-MeVO"]));
    expect(res.conflicts).toEqual([expect.arrayContaining(["NiVO", "SAIL-MeVO"])]);
  });

  test("emorragia: FASTEST segue fastest().eligible", () => {
    const ich = { age: 64, premrs: 1, ltsw: 70 / 60, gcs: 13, hemVolume: 18, anticoag: "none", secondaryCause: "None", brainstem: "no", procoagulant: "no", ecg: "no", thrombosis: "no", pregnancy: "no", angioplasty: "no", ivhLarge: "no" };
    const f = judgeTrial(def("FASTEST"), { acute: ich as never, hem: ich as never, strokeType: "hemorrhagic", clockSet: true });
    expect(f.status).toBe("eligible");
    expect(hem.fastest(ich as never).eligible).toBe(true);
  });
});
