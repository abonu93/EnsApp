import { describe, test, expect } from "vitest";
import { fastest, tich3 } from "$lib/domain/hemorrhagic-rules";

describe("hemorrhagic-rules - smoke (ported from legacy node:test)", () => {
  test("fastest: eligible with complete valid profile", () => {
    const result = fastest({
      age: 65,
      premrs: 1,
      ltsw: 1.5,
      hemVolume: 20,
      gcs: 12,
      brainstem: "no",
      procoagulant: "no",
      ecg: "no",
      thrombosis: "no",
      pregnancy: "no",
      angioplasty: "no",
      ivhScore: "yes",
      anticoag: "none",
    });
    expect(result.eligible).toBe(true);
    expect(result.baseCriteriaMet).toBe(true);
    expect(result.extraMissing).toBe(false);
  });

  test("fastest: fails when additional questions are missing", () => {
    const result = fastest({
      age: 65,
      premrs: 1,
      ltsw: 1.5,
      hemVolume: 20,
      gcs: 12,
      brainstem: "",
      procoagulant: "no",
      ecg: "no",
      thrombosis: "no",
      pregnancy: "no",
      angioplasty: "no",
      ivhScore: "yes",
      anticoag: "none",
    });
    expect(result.extraMissing).toBe(true);
    expect(result.eligible).toBe(false);
  });

  test("tich3: eligible only when all criteria match", () => {
    const eligible = tich3({
      age: 65,
      premrs: 1,
      ltsw: 2,
      hemVolume: 30,
      gcs: 10,
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    });
    const notEligible = tich3({
      age: 65,
      premrs: 1,
      ltsw: 5,
      hemVolume: 30,
      gcs: 10,
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    });
    expect(eligible).toBe(true);
    expect(notEligible).toBe(false);
  });
});
