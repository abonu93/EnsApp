import { describe, test, expect } from "vitest";
import {
  weTrust,
  athena,
  vanish,
  computeVesselFlags,
  tenacity,
  sailMevo,
} from "$lib/domain/acute-rules";
import { reasonSailMevo } from "$lib/domain/acute-reasons";

describe("acute-rules - smoke (ported from legacy node:test)", () => {
  test("weTrust: eligible when all criteria are met", () => {
    const ok = weTrust({ age: 70, nihss: 12, premrs: 2, ltsw: 4, angiograph: "yes" });
    expect(ok).toBe(true);
  });

  test("weTrust: not eligible when NIHSS is too low", () => {
    const ok = weTrust({ age: 70, nihss: 8, premrs: 2, ltsw: 4, angiograph: "yes" });
    expect(ok).toBe(false);
  });

  test("weTrust: allows wake-up stroke up to 12h", () => {
    const ok = weTrust({
      age: 70,
      nihss: 12,
      premrs: 1,
      ltsw: 11,
      wakeupStroke: true,
      wakeupSymptomsWithin6h: true,
      angiograph: "yes",
    });
    expect(ok).toBe(true);
  });

  test("computeVesselFlags: maps target vessels correctly", () => {
    const flags = computeVesselFlags(["m1", "m2-any"]);
    const nivoAllowed = computeVesselFlags(["p2"]);
    expect(flags.vanish).toBe(true);
    expect(flags.promise).toBe(true);
    expect(flags.nivo).toBe(false);
    expect(nivoAllowed.nivo).toBe(true);
  });

  test("athena: returns false when tortuosity is missing", () => {
    const ok = athena({
      age: 50,
      nihss: 12,
      premrs: 1,
      ltsw: 3,
      lvo: "yes",
      tandem: "no",
      tortuosity: "",
      targetVessels: ["m1"],
    });
    expect(ok).toBe(false);
  });

  test("vanish: requires vessel ica-terminal or m1", () => {
    expect(vanish({ age: 50, nihss: 8, premrs: 1, ltsw: 5, lvo: "yes", targetVessels: ["m1"] })).toBe(true);
    expect(vanish({ age: 50, nihss: 8, premrs: 1, ltsw: 5, lvo: "yes", targetVessels: ["basilar"] })).toBe(false);
  });
});

describe("acute-rules - TENACITY (TNK > 4.5h - 72h)", () => {
  const base = {
    age: 70,
    nihss: 12,
    premrs: 1,
    ltsw: 20,
    candidate: "not eligible" as const,
    ivtCandidate: "not eligible" as const,
    perfusionMismatch: "yes" as const,
  };

  test("eligible via CT perfusion mismatch (option 1)", () => {
    expect(tenacity(base)).toBe(true);
  });

  test("eligible via CTA M1 + ASPECTS >= 7 without perfusion (option 2)", () => {
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m1"], aspects: 7 })
    ).toBe(true);
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m1"], aspects: 6 })
    ).toBe(false);
  });

  test("M2 occlusion requires ASPECTS 9-10", () => {
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m2-any"], aspects: 8 })
    ).toBe(false);
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m2-any"], aspects: 9 })
    ).toBe(true);
  });

  test("no imaging criterion met -> not eligible", () => {
    expect(tenacity({ ...base, perfusionMismatch: "no" })).toBe(false);
  });

  test("window: LTSW must be > 4.5h and <= 72h", () => {
    expect(tenacity({ ...base, ltsw: 4.5 })).toBe(false);
    expect(tenacity({ ...base, ltsw: 4.6 })).toBe(true);
    expect(tenacity({ ...base, ltsw: 72 })).toBe(true);
    expect(tenacity({ ...base, ltsw: 72.5 })).toBe(false);
  });

  test("NIHSS must be 6-25", () => {
    expect(tenacity({ ...base, nihss: 5 })).toBe(false);
    expect(tenacity({ ...base, nihss: 6 })).toBe(true);
    expect(tenacity({ ...base, nihss: 25 })).toBe(true);
    expect(tenacity({ ...base, nihss: 26 })).toBe(false);
  });

  test("pre-mRS must be 0-1 and age >= 18", () => {
    expect(tenacity({ ...base, premrs: 2 })).toBe(false);
    expect(tenacity({ ...base, age: 17 })).toBe(false);
  });

  test("exclusions: EVT candidate, IVT candidate, ICA occlusion", () => {
    expect(tenacity({ ...base, candidate: "eligible" })).toBe(false);
    expect(tenacity({ ...base, ivtCandidate: "eligible" })).toBe(false);
    expect(tenacity({ ...base, targetVessels: ["ica-terminal"] })).toBe(false);
    expect(tenacity({ ...base, targetVessels: ["ica-intracranial"] })).toBe(false);
  });

  test("exclusions: high-risk imaging (large core / ASPECTS 0-6)", () => {
    expect(tenacity({ ...base, largeCore: "yes" })).toBe(false);
    expect(tenacity({ ...base, aspects: 6 })).toBe(false);
    expect(tenacity({ ...base, aspects: 7 })).toBe(true);
  });

  test("exclusions: diabetes and contraindications to tenecteplase", () => {
    expect(tenacity({ ...base, diabetes: "yes" })).toBe(false);
    expect(tenacity({ ...base, contraTpa: "yes" })).toBe(false);
  });
});

describe("acute-rules - SAIL-MeVO (EVT in MeVO)", () => {
  const base = {
    age: 65,
    nihss: 12,
    premrs: 0,
    ltsw: 6,
    targetVessels: ["m2-any" as const],
    aspects: 8,
  };

  test("eligible with isolated MeVO and optional imaging not available", () => {
    expect(sailMevo(base)).toBe(true);
    expect(sailMevo({ ...base, aiCoreLt10: "na", tmaxGt30: "na" })).toBe(true);
    expect(sailMevo({ ...base, aiCoreLt10: "yes", tmaxGt30: "yes" })).toBe(true);
    expect(reasonSailMevo(base).eligible).toBe(true);
  });

  test("EVT candidacy does not matter (EVT is randomized)", () => {
    expect(sailMevo({ ...base, candidate: "eligible", lvo: "yes" })).toBe(true);
    expect(sailMevo({ ...base, candidate: "not eligible", lvo: "no" })).toBe(true);
  });

  test("MeVO vessels: non-dominant M2-M3, A2-A3, P2-P3", () => {
    for (const v of ["m2-any", "gt-m2", "a2", "gt-a2", "p2", "gt-p2"] as const) {
      expect(sailMevo({ ...base, targetVessels: [v] })).toBe(true);
    }
    for (const v of ["m2-proxdom", "m1", "ica-terminal", "ica-intracranial", "a1", "p1", "basilar", "va"] as const) {
      expect(sailMevo({ ...base, targetVessels: [v] })).toBe(false);
    }
    expect(sailMevo({ ...base, targetVessels: [] })).toBe(false);
  });

  test("occlusion must be isolated (one vessel)", () => {
    expect(sailMevo({ ...base, targetVessels: ["m2-any", "a2"] })).toBe(false);
    expect(sailMevo({ ...base, targetVessels: ["m1", "m2-any"] })).toBe(false);
  });

  test("age 18-80, pre-mRS 0-1, NIHSS 9-17, LTSW < 12h", () => {
    expect(sailMevo({ ...base, age: 17 })).toBe(false);
    expect(sailMevo({ ...base, age: 80 })).toBe(true);
    expect(sailMevo({ ...base, age: 81 })).toBe(false);
    expect(sailMevo({ ...base, premrs: 2 })).toBe(false);
    expect(sailMevo({ ...base, nihss: 8 })).toBe(false);
    expect(sailMevo({ ...base, nihss: 9 })).toBe(true);
    expect(sailMevo({ ...base, nihss: 17 })).toBe(true);
    expect(sailMevo({ ...base, nihss: 18 })).toBe(false);
    expect(sailMevo({ ...base, ltsw: 11.9 })).toBe(true);
    expect(sailMevo({ ...base, ltsw: 12 })).toBe(false);
  });

  test("imaging: ASPECTS >= 6, AI core < 10 mL, Tmax > 6s > 30 mL", () => {
    expect(sailMevo({ ...base, aspects: 6 })).toBe(true);
    expect(sailMevo({ ...base, aspects: 5 })).toBe(false);
    expect(sailMevo({ ...base, aspects: undefined })).toBe(false);
    expect(sailMevo({ ...base, aiCoreLt10: "no" })).toBe(false);
    expect(sailMevo({ ...base, tmaxGt30: "no" })).toBe(false);
  });

  test("exclusions: tandem, pregnancy, life expectancy, contrast allergy", () => {
    expect(sailMevo({ ...base, tandem: "yes" })).toBe(false);
    expect(sailMevo({ ...base, pregnant: "yes" })).toBe(false);
    expect(sailMevo({ ...base, lifeExpectancyLt3m: "yes" })).toBe(false);
    expect(sailMevo({ ...base, contrastAllergy: "yes" })).toBe(false);
    expect(reasonSailMevo({ ...base, contrastAllergy: "yes" }).eligible).toBe(false);
  });
});
