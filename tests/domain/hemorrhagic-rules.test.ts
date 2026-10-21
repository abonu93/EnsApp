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
      ivhLarge: "no",
      anticoag: "none",
      // FASTEST V10.5 excl. 2: richiesta ICH spontanea.
      secondaryCause: "None",
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
      ivhLarge: "no",
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

describe("FASTEST - criteri del protocollo V10.5 (Parte 2)", () => {
  const ok = {
    age: 65, premrs: 1, ltsw: 1, hemVolume: 20, gcs: 12,
    brainstem: "no", procoagulant: "no", ecg: "no", thrombosis: "no",
    pregnancy: "no", angioplasty: "no", ivhLarge: "no", anticoag: "none",
    secondaryCause: "None",
  } as const;

  test("entro 90 min lo spot sign non serve", () => {
    expect(fastest({ ...ok, ltsw: 1.5 }).eligible).toBe(true);
  });

  test("tra 91 e 120 min serve lo spot sign positivo", () => {
    expect(fastest({ ...ok, ltsw: 1.75 }).extraMissing).toBe(true);
    expect(fastest({ ...ok, ltsw: 1.75, spotSign: "no" }).eligible).toBe(false);
    expect(fastest({ ...ok, ltsw: 1.75, spotSign: "yes" }).eligible).toBe(true);
    expect(fastest({ ...ok, ltsw: 2, spotSign: "yes" }).eligible).toBe(true);
  });

  test("ICH secondaria esclusa (trauma, MAV, aneurisma, tumore)", () => {
    for (const cause of ["Traumatic", "AVM", "Aneurysm", "Tumor", "Other"] as const) {
      expect(fastest({ ...ok, secondaryCause: cause }).eligible).toBe(false);
    }
  });

  test("IVH estesa esclude; IVH non estesa no", () => {
    expect(fastest({ ...ok, ivhLarge: "yes" }).eligible).toBe(false);
    expect(fastest({ ...ok, ivhLarge: "" }).extraMissing).toBe(true);
  });

  test("anticoagulanti: escludono AVK, DOAC, eparina terapeutica, EBPM 24h; antiaggreganti no", () => {
    for (const a of ["warfarin", "doac", "heparin", "lmwh", ""] as const) {
      expect(fastest({ ...ok, anticoag: a }).eligible).toBe(false);
    }
    expect(fastest({ ...ok, anticoag: "antiplatelet" }).eligible).toBe(true);
  });
});

describe("TICH-3 - criteri del protocollo Final v3.1", () => {
  const ok = {
    age: 65, premrs: 3, ltsw: 3, hemVolume: 30, gcs: 10,
    ivh: "no", seizure: "no", secondaryCause: "None", anticoag: "none",
  } as const;

  test("warfarin/AVK ed eparina o EBPM terapeutica escludono", () => {
    expect(tich3({ ...ok, anticoag: "warfarin" })).toBe(false);
    expect(tich3({ ...ok, anticoag: "heparin" })).toBe(false);
  });

  test("DOAC, EBPM profilattica e antiaggreganti sono ammessi", () => {
    for (const a of ["doac", "lmwh", "antiplatelet", "none"] as const) {
      expect(tich3({ ...ok, anticoag: a })).toBe(true);
    }
  });

  test("eta' >= 18", () => {
    expect(tich3({ ...ok, age: 17 })).toBe(false);
    expect(tich3({ ...ok, age: 18 })).toBe(true);
    expect(tich3({ ...ok, age: 99 })).toBe(true);
  });
});

describe("TICH-3 al risveglio: finestra dalla scoperta dei sintomi", () => {
  const base = {
    age: 70, premrs: 1, gcs: 12, hemVolume: 20, ivh: "no", seizure: "no",
    secondaryCause: "None", anticoag: "none",
  };
  test("LSW 9 h fa ma sintomi scoperti 2 h fa: in finestra", async () => {
    const { tich3 } = await import("$lib/domain/hemorrhagic-rules");
    const { reasonTich3 } = await import("$lib/domain/hem-reasons");
    const input = { ...base, ltsw: 9, wakeupStroke: true, hoursSinceDiscovery: 2 } as unknown as Parameters<typeof tich3>[0];
    expect(tich3(input)).toBe(true);
    expect(reasonTich3(input).eligible).toBe(true);
    expect(tich3({ ...input, hoursSinceDiscovery: undefined })).toBe(false);
  });
});
