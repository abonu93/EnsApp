// Pre-arrivo: i dati del SEM diventano input del board senza logica propria,
// e le finestre si contano all'ora di arrivo prevista.

import { describe, test, expect } from "vitest";
import { judgeBoard } from "$lib/domain/board";
import {
  doacFlag,
  evaluationTime,
  hemAnticoag,
  judgePreArrival,
  normalizeCip,
  preArrivalBoardInput,
  preArrivalToPatient,
  type PreArrival,
} from "$lib/domain/pre-arrival";

const H = 3_600_000;
const NOW = new Date(2026, 9, 22, 9, 0).getTime();

const sem = (over: Partial<PreArrival> = {}): PreArrival => ({
  cip: "ROCA0480512001",
  age: 78,
  premrs: 1,
  race: 7,
  anti: ["doac"],
  clock: { mode: "known", at: NOW - 0.8 * H, found: null },
  ...over,
});

describe("pre-arrivo: antitrombotici", () => {
  test("DOAC per le regole acute", () => {
    expect(doacFlag([])).toBeUndefined();
    expect(doacFlag(["none"])).toBe("no");
    expect(doacFlag(["antiplatelet"])).toBe("no");
    expect(doacFlag(["antiplatelet", "doac"])).toBe("yes");
  });

  test("per l'emorragia vale il piu' restrittivo", () => {
    expect(hemAnticoag([])).toBeUndefined();
    expect(hemAnticoag(["none"])).toBe("none");
    expect(hemAnticoag(["antiplatelet", "doac"])).toBe("doac");
    expect(hemAnticoag(["doac", "warfarin"])).toBe("warfarin");
    expect(hemAnticoag(["antiplatelet", "lmwh"])).toBe("lmwh");
  });
});

describe("pre-arrivo: valutazione", () => {
  test("senza ETA si valuta adesso, con ETA all'arrivo (mai nel passato)", () => {
    expect(evaluationTime(sem(), NOW)).toBe(NOW);
    expect(evaluationTime(sem({ arriveAt: NOW + 15 * 60_000 }), NOW)).toBe(NOW + 15 * 60_000);
    expect(evaluationTime(sem({ arriveAt: NOW - 5 * 60_000 }), NOW)).toBe(NOW);
  });

  test("le ore dall'esordio sono contate all'arrivo", () => {
    const i = preArrivalBoardInput(sem({ arriveAt: NOW + 30 * 60_000 }), NOW + 30 * 60_000);
    expect(i.acute.ltsw).toBeCloseTo(1.3, 6);
    expect(i.hem.ltsw).toBeCloseTo(1.3, 6);
    expect(i.acute.doac).toBe("yes");
    expect(i.hem.anticoag).toBe("doac");
    expect(i.strokeType).toBeUndefined();
  });

  test("risveglio: ore dalla scoperta dei sintomi", () => {
    const p = sem({ clock: { mode: "wakeup", at: NOW - 8 * H, found: NOW - 2 * H } });
    const i = preArrivalBoardInput(p, NOW);
    expect(i.acute.wakeupStroke).toBe(true);
    expect(i.acute.hoursSinceDiscovery).toBeCloseTo(2, 6);
    expect(i.acute.wakeupSymptomsWithin6h).toBeUndefined();
  });

  test("coincide con il board con gli stessi dati", () => {
    const p = sem({ arriveAt: NOW + 20 * 60_000 });
    const t = NOW + 20 * 60_000;
    const direct = judgeBoard({
      acute: { age: 78, premrs: 1, ltsw: (t - p.clock.at) / H, wakeupStroke: false, doac: "yes" },
      hem: { age: 78, premrs: 1, ltsw: (t - p.clock.at) / H, anticoag: "doac" },
      clockSet: true,
    });
    const via = judgePreArrival(p, NOW);
    expect(via.open.map((j) => [j.name, j.status])).toEqual(direct.open.map((j) => [j.name, j.status]));
    expect(via.out.map((j) => j.name)).toEqual(direct.out.map((j) => j.name));
  });

  test("con i soli dati del SEM nessuno e' gia' eleggibile e la RACE non cambia nulla", () => {
    const a = judgePreArrival(sem({ race: 2 }), NOW);
    const b = judgePreArrival(sem({ race: 9 }), NOW);
    expect(a.eligible).toEqual([]);
    expect(a.open.map((j) => j.name)).toEqual(b.open.map((j) => j.name));
  });

  test("DOAC esclude FASTEST; mRS 3 e 88 anni escludono molti studi", () => {
    expect(judgePreArrival(sem(), NOW).out.map((j) => j.name)).toContain("FASTEST");
    const old = judgePreArrival(sem({ age: 88, premrs: 3, anti: ["none"] }), NOW);
    expect(old.out.map((j) => j.name)).toEqual(expect.arrayContaining(["ATHENA", "WeTrust", "PIVOTAL"]));
  });
});

describe("pre-arrivo: all'arrivo", () => {
  test("i dati vanno negli stessi campi del paziente", () => {
    const at = new Date(2026, 9, 22, 8, 12).getTime();
    const { pre, hem } = preArrivalToPatient(sem({ clock: { mode: "known", at, found: null } }));
    expect(pre).toEqual({
      ltswDate: "2026-10-22T08:12",
      wakeupStroke: false,
      age: 78,
      premrs: 1,
      doac: "yes",
      cip: "ROCA0480512001",
      race: 7,
      antithrombotics: ["doac"],
    });
    expect(hem).toEqual({ anticoag: "doac" });
  });

  test("risveglio e dati mancanti", () => {
    const at = new Date(2026, 9, 22, 1, 0).getTime();
    const found = new Date(2026, 9, 22, 7, 30).getTime();
    const { pre, hem } = preArrivalToPatient({ anti: [], clock: { mode: "wakeup", at, found } });
    expect(pre).toEqual({ ltswDate: "2026-10-22T01:00", wakeupStroke: true, discoveryDate: "2026-10-22T07:30" });
    expect(hem).toEqual({});
  });

  test("CIP: maiuscole, senza spazi, al massimo 14 caratteri", () => {
    expect(normalizeCip("roca 0480 5120 01xx")).toBe("ROCA0480512001");
  });
});
