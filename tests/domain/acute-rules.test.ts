import { describe, test, expect } from "vitest";
import {
  weTrust,
  athena,
  vanish,
  artemis,
  computeVesselFlags,
  tenacity,
} from "$lib/domain/acute-rules";
import { reasonArtemis } from "$lib/domain/acute-reasons";

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

describe("acute-rules - ARTEMIS (tandem occlusion excluded)", () => {
  const base = {
    age: 68,
    nihss: 14,
    premrs: 1,
    ltsw: 3,
    lvo: "yes" as const,
    targetVessels: ["m1" as const],
    aspects: 8,
  };

  test("eligible without tandem occlusion", () => {
    expect(artemis({ ...base, tandem: "no" })).toBe(true);
  });

  test("not eligible with tandem occlusion", () => {
    expect(artemis({ ...base, tandem: "yes" })).toBe(false);
  });

  test("missing tandem answer does not exclude", () => {
    expect(artemis({ ...base, tandem: "" })).toBe(true);
    expect(artemis(base)).toBe(true);
  });

  test("reasonArtemis reports tandem as the failed criterion", () => {
    const report = reasonArtemis({ ...base, tandem: "yes" });
    expect(report.eligible).toBe(false);
    expect(report.fail).toEqual(["no occlusione tandem (esclusione)"]);
    expect(reasonArtemis({ ...base, tandem: "no" }).eligible).toBe(true);
  });
});
