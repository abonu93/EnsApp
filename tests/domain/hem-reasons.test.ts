// I reason report emorragici devono restare allineati a hemorrhagic-rules.ts:
// se il report dice "eligible" anche la regola deve dire eligible, e viceversa.

import { describe, test, expect } from "vitest";
import { fastest, tich3, type HemorrhagicInput } from "$lib/domain/hemorrhagic-rules";
import { reasonFastest, reasonTich3, REASON_BY_HEM_TRIAL } from "$lib/domain/hem-reasons";

const tich3Ok: HemorrhagicInput = {
  age: 70, premrs: 1, ltsw: 2, gcs: 14, hemVolume: 30,
  ivh: "no", seizure: "no", secondaryCause: "None",
};

const fastestOk: HemorrhagicInput = {
  age: 70, premrs: 1, ltsw: 1, gcs: 14, hemVolume: 30,
  brainstem: "no", procoagulant: "no", ecg: "no", thrombosis: "no",
  pregnancy: "no", angioplasty: "no", ivhScore: "yes", anticoag: "none",
};

describe("hem-reasons - parita' con le regole", () => {
  test("TICH-3: report e regola concordano", () => {
    const cases: HemorrhagicInput[] = [
      tich3Ok,
      { ...tich3Ok, ltsw: 5 },
      { ...tich3Ok, hemVolume: 70 },
      { ...tich3Ok, gcs: 4 },
      { ...tich3Ok, ivh: "yes" },
      { ...tich3Ok, ivh: "" },
      { ...tich3Ok, seizure: "" },
      { ...tich3Ok, secondaryCause: "Traumatic" },
      {} as HemorrhagicInput,
    ];
    for (const c of cases) {
      expect(reasonTich3(c).eligible).toBe(tich3(c));
    }
  });

  test("FASTEST: report e regola concordano", () => {
    const cases: HemorrhagicInput[] = [
      fastestOk,
      { ...fastestOk, ltsw: 3 },
      { ...fastestOk, age: 85 },
      { ...fastestOk, gcs: 7 },
      { ...fastestOk, hemVolume: 1 },
      { ...fastestOk, hemVolume: 60 },
      { ...fastestOk, ivhScore: "" },
      { ...fastestOk, ecg: "yes" },
      { ...fastestOk, anticoag: "doac" },
      {} as HemorrhagicInput,
    ];
    for (const c of cases) {
      expect(reasonFastest(c).eligible).toBe(fastest(c).eligible);
    }
  });

  test("TICH-3: elenca i criteri mancanti", () => {
    const fail = reasonTich3({ ...tich3Ok, gcs: 3, secondaryCause: "AVM" }).fail;
    expect(fail).toContain("GCS >= 5");
    expect(fail).toContain("nessuna causa secondaria");
    expect(fail).not.toContain("LTSW < 4.5h");
  });

  test("mappa per display name usata da Summary", () => {
    expect(REASON_BY_HEM_TRIAL["TICH-3"]).toBe(reasonTich3);
    expect(REASON_BY_HEM_TRIAL.FASTEST).toBe(reasonFastest);
  });
});
