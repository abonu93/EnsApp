import { describe, test, expect } from "vitest";
import {
  weTrust,
  athena,
  vanish,
  computeVesselFlags,
  tenacity,
  sailMevo,
  remedy,
  pivotal,
  twin2win2,
  nivo,
  orion,
  doneSymple,
  doit,
  sovateltide,
} from "$lib/domain/acute-rules";
import {
  reasonSailMevo,
  reasonVanish,
  reasonRemedy,
  reasonPivotal,
  reasonTwin2win2,
  reasonNivo,
  reasonOrion,
  reasonTenacity,
  reasonDoneSymple,
  reasonDoit,
  reasonSovateltide,
  reasonWeTrust,
} from "$lib/domain/acute-reasons";

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
    // "m2-any" e' la M2 non dominante: e' un vaso NiVO (sinossi v2.0 p. 7).
    expect(flags.nivo).toBe(true);
    expect(computeVesselFlags(["m1", "m2-proxdom"]).nivo).toBe(false);
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
    // vanishCoreMismatch: criterio di perfusione del protocollo v1.2 (incl. 8-9).
    expect(vanish({ age: 50, nihss: 8, premrs: 1, ltsw: 5, lvo: "yes", targetVessels: ["m1"], aspects: 7, vanishCoreMismatch: "yes" })).toBe(true);
    expect(vanish({ age: 50, nihss: 8, premrs: 1, ltsw: 5, lvo: "yes", targetVessels: ["basilar"], aspects: 7, vanishCoreMismatch: "yes" })).toBe(false);
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

  test("centro con perfusione: l'opzione angio-TC + ASPECTS non vale", () => {
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m1"], aspects: 7 })
    ).toBe(false);
    expect(
      tenacity({ ...base, perfusionMismatch: "no", targetVessels: ["m2-any"], aspects: 9 })
    ).toBe(false);
    expect(tenacity({ ...base, targetVessels: ["m1"], aspects: 7 })).toBe(true);
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

describe("acute-rules - ATHENA (protocollo v2.3)", () => {
  const ok = {
    age: 60, nihss: 12, premrs: 1, ltsw: 5, lvo: "yes", tandem: "no",
    tortuosity: "no", targetVessels: ["m1"], aspects: 8,
  } as const;
  const run = (patch: Record<string, unknown>) => athena({ ...ok, ...patch } as unknown as Parameters<typeof athena>[0]);

  test("profilo tipico eleggibile", () => {
    expect(run({})).toBe(true);
  });

  test("finestra 16 h (non piu' 24 h)", () => {
    expect(run({ ltsw: 16 })).toBe(true);
    expect(run({ ltsw: 17 })).toBe(false);
  });

  test("NIHSS 6-25 (non piu' >= 8)", () => {
    expect(run({ nihss: 6 })).toBe(true);
    expect(run({ nihss: 5 })).toBe(false);
    expect(run({ nihss: 25 })).toBe(true);
    expect(run({ nihss: 26 })).toBe(false);
  });

  test("vaso: solo ICA terminale, M1, M2 prossimale/dominante", () => {
    expect(run({ targetVessels: ["ica-terminal"] })).toBe(true);
    expect(run({ targetVessels: ["m2-proxdom"] })).toBe(true);
    expect(run({ targetVessels: ["ica-terminal", "m1"] })).toBe(true); // occlusione a T
    expect(run({ targetVessels: ["m1", "m2-proxdom"] })).toBe(false); // possibile occlusione secondaria
    expect(run({ targetVessels: ["ica-terminal", "m1", "m2-proxdom"] })).toBe(false);
    expect(run({ targetVessels: ["basilar"] })).toBe(false);
    expect(run({ targetVessels: ["m2-any"] })).toBe(false);
    expect(run({ targetVessels: ["ica-intracranial"] })).toBe(false);
    expect(run({ targetVessels: ["m1", "basilar"] })).toBe(false);
    expect(run({ targetVessels: [] })).toBe(false);
  });

  test("ASPECTS 6-10 se indicato", () => {
    expect(run({ aspects: 6 })).toBe(true);
    expect(run({ aspects: 5 })).toBe(false);
    expect(run({ aspects: undefined })).toBe(true);
  });

  test("il tandem non esclude allo screening (valutato in sala)", () => {
    expect(run({ tandem: "yes" })).toBe(true);
  });
});

describe("acute-reasons - ATHENA concorda con la regola", () => {
  test("report e regola danno lo stesso esito", async () => {
    const { reasonAthena } = await import("$lib/domain/acute-reasons");
    const base = {
      age: 60, nihss: 12, premrs: 1, ltsw: 5, lvo: "yes", tandem: "no",
      tortuosity: "no", targetVessels: ["m1"], aspects: 8,
    };
    const variants = [
      {}, { ltsw: 17 }, { nihss: 5 }, { nihss: 30 }, { targetVessels: ["basilar"] },
      { targetVessels: ["m1", "p1"] }, { aspects: 4 }, { tandem: "yes" }, { tortuosity: "yes" },
      { tortuosity: "" }, { lvo: "no" }, { age: 90 },
    ];
    for (const v of variants) {
      const input = { ...base, ...v } as Parameters<typeof athena>[0];
      expect(reasonAthena(input).eligible).toBe(athena(input));
    }
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

describe("acute-rules - VANISH (protocollo v1.2 + decisioni del team)", () => {
  const ok = {
    age: 60, nihss: 10, premrs: 0, ltsw: 4, lvo: "yes", tandem: "no",
    targetVessels: ["m1"], aspects: 7,
  } as const;
  const run = (patch: Record<string, unknown>) =>
    vanish({ ...ok, ...patch } as unknown as Parameters<typeof vanish>[0]);

  test("finestra 9 h", () => {
    expect(run({ ltsw: 9, vanishCoreMismatch: "yes" })).toBe(true);
    expect(run({ ltsw: 9.5, vanishCoreMismatch: "yes" })).toBe(false);
  });

  test("ICA intracranica, M1 e M2 dominante ammesse; M2 non dominante no", () => {
    expect(run({ targetVessels: ["ica-intracranial"] })).toBe(true);
    expect(run({ targetVessels: ["ica-terminal"] })).toBe(true);
    expect(run({ targetVessels: ["m2-proxdom"] })).toBe(true);
    expect(run({ targetVessels: ["m2-any"] })).toBe(false);
  });

  test("ASPECTS > 4 richiesto", () => {
    expect(run({ aspects: 4 })).toBe(false);
    expect(run({ aspects: 5 })).toBe(true);
    expect(run({ aspects: undefined })).toBe(false);
  });

  test("tandem esclude", () => {
    expect(run({ tandem: "yes" })).toBe(false);
  });

  test("core/mismatch solo nei pazienti tardivi (oltre 4,5 h)", () => {
    expect(run({ ltsw: 4 })).toBe(true);
    expect(run({ ltsw: 6 })).toBe(false);
    expect(run({ ltsw: 6, vanishCoreMismatch: "no" })).toBe(false);
    expect(run({ ltsw: 6, vanishCoreMismatch: "yes" })).toBe(true);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { ltsw: 10 }, { ltsw: 6 }, { ltsw: 6, vanishCoreMismatch: "yes" }, { tandem: "yes" }, { aspects: 3 }, { targetVessels: ["basilar"] }, { lvo: "no" }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof vanish>[0];
      expect(reasonVanish(input).eligible).toBe(vanish(input));
    }
  });
});


describe("acute-rules - REMEDY (protocollo V6.2)", () => {
  const ok = {
    age: 70, nihss: 8, premrs: 1, ltsw: 3, candidate: "not eligible",
    targetVessels: [], aspects: 8, acei: "no",
  } as const;
  const run = (patch: Record<string, unknown>) =>
    remedy({ ...ok, ...patch } as unknown as Parameters<typeof remedy>[0]);

  test("entro 4,5 h con ASPECTS inserito e' proponibile", () => {
    expect(run({})).toBe(true);
  });

  test("occlusione di grosso vaso esclude anche se non candidato a EVT", () => {
    for (const v of ["ica-intracranial", "ica-terminal", "m1", "va", "basilar"]) {
      expect(run({ targetVessels: [v] })).toBe(false);
    }
    expect(run({ targetVessels: ["m2-any"] })).toBe(true);
  });

  test("ASPECTS 0-5 esclude", () => {
    expect(run({ aspects: 5 })).toBe(false);
    expect(run({ aspects: 6 })).toBe(true);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { aspects: 4 }, { targetVessels: ["m1"] }, { acei: "yes" }, { candidate: "eligible" }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof remedy>[0];
      expect(reasonRemedy(input).eligible).toBe(remedy(input));
    }
  });
});

describe("acute-rules - PIVOTAL (RapidPulse)", () => {
  const ok = {
    age: 65, nihss: 10, premrs: 1, ltsw: 5, lvo: "yes", tandem: "no",
    tortuosity: "no", targetVessels: ["m1"], aspects: 8,
  } as const;
  const run = (patch: Record<string, unknown>) =>
    pivotal({ ...ok, ...patch } as unknown as Parameters<typeof pivotal>[0]);

  test("caso tipico proponibile", () => {
    expect(run({})).toBe(true);
  });

  test("vasi ammessi: ICA, M1, M2, vertebrale, basilare", () => {
    for (const v of ["ica-intracranial", "ica-terminal", "m2-proxdom", "m2-any", "va", "basilar"]) {
      expect(run({ targetVessels: [v] })).toBe(true);
    }
    expect(run({ targetVessels: ["a2"] })).toBe(false);
    expect(run({ targetVessels: ["gt-m2"] })).toBe(false);
  });

  test("occlusioni multiple escludono, salvo ICA terminale + M1", () => {
    expect(run({ targetVessels: ["m1", "basilar"] })).toBe(false);
    expect(run({ targetVessels: ["ica-terminal", "m1"] })).toBe(true);
  });

  test("tandem e tortuosita' escludono", () => {
    expect(run({ tandem: "yes" })).toBe(false);
    expect(run({ tortuosity: "yes" })).toBe(false);
  });

  test("ASPECTS < 6 esclude solo in circolazione anteriore", () => {
    expect(run({ aspects: 5 })).toBe(false);
    expect(run({ aspects: 6 })).toBe(true);
    expect(run({ targetVessels: ["basilar"], aspects: 3 })).toBe(true);
  });

  test("finestra < 8 h ed eta' 18-80", () => {
    expect(run({ ltsw: 8 })).toBe(false);
    expect(run({ age: 81 })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { tandem: "yes" }, { tortuosity: "yes" }, { aspects: 4 }, { targetVessels: ["m1", "basilar"] }, { targetVessels: ["basilar"], aspects: 3 }, { targetVessels: ["a2"] }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof pivotal>[0];
      expect(reasonPivotal(input).eligible).toBe(pivotal(input));
    }
  });
});

describe("acute-rules - TWIN2WIN-2 (protocollo V2)", () => {
  const ok = {
    age: 18, nihss: 8, premrs: 2, ltsw: 24, lvo: "yes",
    targetVessels: ["m1"], aspects: 7,
  } as const;
  const run = (patch: Record<string, unknown>) =>
    twin2win2({ ...ok, ...patch } as unknown as Parameters<typeof twin2win2>[0]);

  test("eta' 18 ed entro 24 h proponibile", () => {
    expect(run({})).toBe(true);
    expect(run({ ltsw: 24.5 })).toBe(false);
  });

  test("solo ICA terminale, M1 o basilare", () => {
    expect(run({ targetVessels: ["ica-terminal"] })).toBe(true);
    expect(run({ targetVessels: ["basilar"] })).toBe(true);
    expect(run({ targetVessels: ["m2-proxdom"] })).toBe(false);
    expect(run({ targetVessels: ["ica-intracranial"] })).toBe(false);
  });

  test("occlusioni in piu' territori escludono", () => {
    expect(run({ targetVessels: ["m1", "basilar"] })).toBe(false);
  });

  test("ASPECTS < 6 esclude in anteriore, non in basilare", () => {
    expect(run({ aspects: 5 })).toBe(false);
    expect(run({ targetVessels: ["basilar"], aspects: 2 })).toBe(true);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { aspects: 5 }, { targetVessels: ["m1", "basilar"] }, { targetVessels: ["m2-any"] }, { ltsw: 30 }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof twin2win2>[0];
      expect(reasonTwin2win2(input).eligible).toBe(twin2win2(input));
    }
  });
});

describe("acute-rules - NiVO (sinossi v2.0)", () => {
  const ok = {
    age: 70, nihss: 8, premrs: 1, ltsw: 6, lvo: "yes", tandem: "no",
    targetVessels: ["m2-any"], aspects: 8,
  } as const;
  const run = (patch: Record<string, unknown>) =>
    nivo({ ...ok, ...patch } as unknown as Parameters<typeof nivo>[0]);

  test("M2 non dominante ammessa", () => {
    expect(run({})).toBe(true);
  });

  test("tandem esclude", () => {
    expect(run({ tandem: "yes" })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { tandem: "yes" }, { aspects: 5 }, { targetVessels: ["m1", "m2-any"] }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof nivo>[0];
      expect(reasonNivo(input).eligible).toBe(nivo(input));
    }
  });
});

describe("acute-rules - ORION (JX10)", () => {
  const ok = {
    age: 70, nihss: 8, premrs: 1, ltsw: 5, candidate: "not eligible",
    targetVessels: ["m1"], contraTpa: "no", largeCore: "no",
  } as const;
  const run = (patch: Record<string, unknown>) =>
    orion({ ...ok, ...patch } as unknown as Parameters<typeof orion>[0]);

  test("caso tipico 4,5-6 h senza perfusione", () => {
    expect(run({})).toBe(true);
    expect(run({ ltsw: 4.4 })).toBe(false);
  });

  test("oltre 6 h serve il mismatch di perfusione", () => {
    expect(run({ ltsw: 12 })).toBe(false);
    expect(run({ ltsw: 12, perfusionMismatch: "yes" })).toBe(true);
    expect(run({ ltsw: 25, perfusionMismatch: "yes" })).toBe(false);
  });

  test("vasi: ICA intracranica, M1, M2, rami distali; non posteriore prossimale", () => {
    for (const v of ["ica-intracranial", "m2-any", "gt-m2", "a2", "p2"]) {
      expect(run({ targetVessels: [v] })).toBe(true);
    }
    expect(run({ targetVessels: ["basilar"] })).toBe(false);
    expect(run({ targetVessels: [] })).toBe(false);
  });

  test("occlusione in piu' territori esclude", () => {
    expect(run({ targetVessels: ["m1", "a2"] })).toBe(false);
    expect(run({ targetVessels: ["m1", "m2-any"] })).toBe(true);
  });

  test("NIHSS >= 5 e mRS 0 oltre 85 anni", () => {
    expect(run({ nihss: 4 })).toBe(false);
    expect(run({ nihss: 5 })).toBe(true);
    expect(run({ age: 88, premrs: 1 })).toBe(false);
    expect(run({ age: 88, premrs: 0 })).toBe(true);
    expect(run({ age: 91, premrs: 0 })).toBe(false);
  });

  test("candidato a EVT: solo se la EVT inizia almeno 1 h dopo il farmaco", () => {
    expect(run({ candidate: "eligible" })).toBe(false);
    expect(run({ candidate: "eligible", evtWithin1h: "yes" })).toBe(false);
    expect(run({ candidate: "eligible", evtWithin1h: "no" })).toBe(true);
  });

  test("core esteso e controindicazioni ai trombolitici escludono", () => {
    expect(run({ largeCore: "yes" })).toBe(false);
    expect(run({ contraTpa: "yes" })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { ltsw: 12 }, { ltsw: 12, perfusionMismatch: "yes" }, { targetVessels: ["m1", "a2"] }, { age: 88 }, { candidate: "eligible" }, { candidate: "eligible", evtWithin1h: "no" }, { largeCore: "yes" }, { nihss: 4 }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof orion>[0];
      expect(reasonOrion(input).eligible).toBe(orion(input));
    }
  });
});

describe("acute-rules - TENACITY (protocollo V1.0, correzioni)", () => {
  const ok = {
    age: 70, nihss: 12, premrs: 1, ltsw: 20, candidate: "not eligible",
    ivtCandidate: "not eligible", perfusionMismatch: "yes", contraTpa: "no",
    targetVessels: ["m1"],
  } as const;
  const run = (patch: Record<string, unknown>) =>
    tenacity({ ...ok, ...patch } as unknown as Parameters<typeof tenacity>[0]);

  test("basilare e vertebrale escludono (solo sopratentoriale)", () => {
    expect(run({})).toBe(true);
    expect(run({ targetVessels: ["basilar"] })).toBe(false);
    expect(run({ targetVessels: ["va"] })).toBe(false);
  });

  test("tandem esclude", () => {
    expect(run({ tandem: "yes" })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { targetVessels: ["basilar"] }, { tandem: "yes" }, { diabetes: "yes" }, { aspects: 6 }, { perfusionMismatch: "no" }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof tenacity>[0];
      expect(reasonTenacity(input).eligible).toBe(tenacity(input));
    }
  });
});

describe("acute-rules - DONE SYMPLE (protocollo v4)", () => {
  const ok = {
    age: 70, nihss: 10, premrs: 1, ltsw: 30, candidate: "not eligible",
    targetVessels: ["m1"], coreGt70: "no",
  } as const;
  const run = (patch: Record<string, unknown>) =>
    doneSymple({ ...ok, ...patch } as unknown as Parameters<typeof doneSymple>[0]);

  test("la candidatura a EVT non conta oltre 24 h", () => {
    expect(run({})).toBe(true);
    expect(run({ candidate: "eligible" })).toBe(true);
  });

  test("solo ICA o M1 della circolazione anteriore", () => {
    expect(run({ targetVessels: ["ica-terminal"] })).toBe(true);
    expect(run({ targetVessels: ["basilar"] })).toBe(false);
    expect(run({ targetVessels: ["m2-any"] })).toBe(false);
    expect(run({ targetVessels: [] })).toBe(false);
  });

  test("core <= 70 cc va confermato; l'ipodensita' di TENACITY non conta", () => {
    expect(run({ coreGt70: "yes" })).toBe(false);
    expect(run({ coreGt70: undefined })).toBe(false);
    expect(run({ largeCore: "yes" })).toBe(true);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { targetVessels: ["basilar"] }, { coreGt70: "yes" }, { coreGt70: undefined }, { ltsw: 20 }, { candidate: "eligible" }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof doneSymple>[0];
      expect(reasonDoneSymple(input).eligible).toBe(doneSymple(input));
    }
  });
});

describe("acute-rules - DO-IT (protocollo v2.0)", () => {
  const ok = { age: 75, nihss: 6, premrs: 1, ltsw: 3, doac: "yes", ivtCandidate: "eligible" } as const;
  const run = (patch: Record<string, unknown>) =>
    doit({ ...ok, ...patch } as unknown as Parameters<typeof doit>[0]);

  test("non candidato solo per il DOAC: proponibile", () => {
    expect(run({ ivtCandidate: "not eligible" })).toBe(false);
    expect(run({ ivtCandidate: "not eligible", ivtExceptDoac: "yes" })).toBe(true);
    expect(run({ ivtCandidate: "not eligible", ivtExceptDoac: "no" })).toBe(false);
  });

  test("randomizzazione entro 4 h 15 min", () => {
    expect(run({ ltsw: 4.25 })).toBe(true);
    expect(run({ ltsw: 4.4 })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { ltsw: 4.4 }, { ivtCandidate: "not eligible" }, { ivtCandidate: "not eligible", ivtExceptDoac: "yes" }, { doac: "no" }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof doit>[0];
      expect(reasonDoit(input).eligible).toBe(doit(input));
    }
  });
});

describe("acute-rules - SOVATELTIDE (protocollo v3.1)", () => {
  const ok = { age: 60, nihss: 10, premrs: 1, ltsw: 10, candidate: "not eligible" } as const;
  const run = (patch: Record<string, unknown>) =>
    sovateltide({ ...ok, ...patch } as unknown as Parameters<typeof sovateltide>[0]);

  test("basta la diagnosi clinica: lesione all'imaging non richiesta", () => {
    expect(run({ lesionConfirmed: "no" })).toBe(true);
  });

  test("NIHSS 1a >= 2 esclude", () => {
    expect(run({ nihss1aGe2: "yes" })).toBe(false);
    expect(run({ nihss1aGe2: "no" })).toBe(true);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { nihss1aGe2: "yes" }, { lesionConfirmed: "no" }, { nihss: 20 }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof sovateltide>[0];
      expect(reasonSovateltide(input).eligible).toBe(sovateltide(input));
    }
  });
});

describe("acute-rules - WETRUST (protocollo Rev 09)", () => {
  const ok = { age: 60, nihss: 14, premrs: 1, ltsw: 3, angiograph: "yes" } as const;
  const run = (patch: Record<string, unknown>) =>
    weTrust({ ...ok, ...patch } as unknown as Parameters<typeof weTrust>[0]);

  test("limiti stretti: < 6 h e, al risveglio, < 12 h", () => {
    expect(run({ ltsw: 5.9 })).toBe(true);
    expect(run({ ltsw: 6 })).toBe(false);
    expect(run({ ltsw: 11.9, wakeupStroke: true, wakeupSymptomsWithin6h: true })).toBe(true);
    expect(run({ ltsw: 12, wakeupStroke: true, wakeupSymptomsWithin6h: true })).toBe(false);
  });

  test("al risveglio serve la risposta sui sintomi scoperti < 6 h", () => {
    expect(run({ ltsw: 9, wakeupStroke: true, wakeupSymptomsWithin6h: false })).toBe(false);
    expect(run({ ltsw: 9, wakeupStroke: true })).toBe(false);
  });

  test("motivi e regola concordano", () => {
    for (const v of [{}, { ltsw: 6 }, { ltsw: 9, wakeupStroke: true, wakeupSymptomsWithin6h: true }, { ltsw: 9, wakeupStroke: true }]) {
      const input = { ...ok, ...v } as unknown as Parameters<typeof weTrust>[0];
      expect(reasonWeTrust(input).eligible).toBe(weTrust(input));
    }
  });
});

describe("acute-rules - REMEDY tronco e cervelletto", () => {
  const ok = {
    age: 70, nihss: 8, premrs: 1, ltsw: 3, candidate: "not eligible",
    targetVessels: [], aspects: 8, acei: "no",
  } as const;
  test("ictus del tronco o del cervelletto esclude", () => {
    const input = { ...ok, posteriorFossa: "yes" } as unknown as Parameters<typeof remedy>[0];
    expect(remedy(input)).toBe(false);
    expect(reasonRemedy(input).eligible).toBe(false);
    expect(remedy({ ...ok, posteriorFossa: "no" } as unknown as Parameters<typeof remedy>[0])).toBe(true);
  });
});

describe("correzioni dall'audit", () => {
  test("ORION: tra 4,5 e 6 h una perfusione negativa esclude, se fatta", () => {
    const ok = {
      age: 70, nihss: 8, premrs: 1, ltsw: 5, candidate: "not eligible",
      targetVessels: ["m1"], contraTpa: "no", largeCore: "no",
    };
    const input = (p: Record<string, unknown>) =>
      ({ ...ok, ...p }) as unknown as Parameters<typeof orion>[0];
    expect(orion(input({}))).toBe(true);
    expect(orion(input({ perfusionMismatch: "yes" }))).toBe(true);
    expect(orion(input({ perfusionMismatch: "no" }))).toBe(false);
    expect(reasonOrion(input({ perfusionMismatch: "no" })).eligible).toBe(false);
  });

  test("REMEDY: ASPECTS non richiesto nell'ictus della sola ACP", () => {
    const ok = {
      age: 70, nihss: 8, premrs: 1, ltsw: 3, candidate: "not eligible", acei: "no",
    };
    const input = (p: Record<string, unknown>) =>
      ({ ...ok, ...p }) as unknown as Parameters<typeof remedy>[0];
    expect(remedy(input({ targetVessels: ["p2"] }))).toBe(true);
    expect(reasonRemedy(input({ targetVessels: ["p2"] })).eligible).toBe(true);
    expect(remedy(input({ targetVessels: ["m2-any"] }))).toBe(false);
    expect(remedy(input({ targetVessels: [] }))).toBe(false);
  });
});

describe("correzioni dal secondo controllo", () => {
  test("DO-IT: antagonizzazione del DOAC prevista esclude", () => {
    const ok = { age: 75, nihss: 6, premrs: 1, ltsw: 3, doac: "yes", ivtCandidate: "eligible" };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof doit>[0];
    expect(doit(input({ doacReversal: "yes" }))).toBe(false);
    expect(reasonDoit(input({ doacReversal: "yes" })).eligible).toBe(false);
    expect(doit(input({ doacReversal: "no" }))).toBe(true);
  });

  test("WETRUST: entro 6 h la domanda wake-up vuota non esclude", () => {
    const ok = { age: 60, nihss: 14, premrs: 1, ltsw: 4, angiograph: "yes", wakeupStroke: true };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof weTrust>[0];
    expect(weTrust(input({}))).toBe(true);
    expect(reasonWeTrust(input({})).eligible).toBe(true);
    expect(weTrust(input({ ltsw: 8 }))).toBe(false);
  });

  test("ORION: perfusione 'non eseguita' non esclude entro 6 h, oltre si'", () => {
    const ok = {
      age: 70, nihss: 8, premrs: 1, ltsw: 5, candidate: "not eligible",
      targetVessels: ["m1"], contraTpa: "no", largeCore: "no", perfusionMismatch: "na",
    };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof orion>[0];
    expect(orion(input({}))).toBe(true);
    expect(orion(input({ ltsw: 8 }))).toBe(false);
  });
});

describe("decisioni del team (2026-10-20)", () => {
  test("DO-IT: ictus al risveglio escluso (niente RM DWI-FLAIR)", () => {
    const ok = { age: 75, nihss: 6, premrs: 1, ltsw: 3, doac: "yes", ivtCandidate: "eligible" };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof doit>[0];
    expect(doit(input({ wakeupStroke: true }))).toBe(false);
    expect(reasonDoit(input({ wakeupStroke: true })).eligible).toBe(false);
    expect(doit(input({ wakeupStroke: false }))).toBe(true);
  });
});

describe("ictus al risveglio: ora della scoperta e REMEDY dopo trombolisi", () => {
  test("VANISH al risveglio conta dal punto medio fra LSW e scoperta", () => {
    const ok = {
      age: 60, nihss: 10, premrs: 0, lvo: "yes", tandem: "no", targetVessels: ["m1"], aspects: 7,
      vanishCoreMismatch: "yes", wakeupStroke: true,
    };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof vanish>[0];
    // LSW 14 h fa, scoperta 2 h fa: punto medio 8 h fa -> in finestra.
    expect(vanish(input({ ltsw: 14, hoursSinceDiscovery: 2 }))).toBe(true);
    expect(reasonVanish(input({ ltsw: 14, hoursSinceDiscovery: 2 })).eligible).toBe(true);
    // Senza l'ora della scoperta si usa l'LSW: fuori finestra.
    expect(vanish(input({ ltsw: 14 }))).toBe(false);
  });

  test("REMEDY dopo trombolisi richiede la conferma delle condizioni a >= 6 h", () => {
    const ok = {
      age: 70, nihss: 8, premrs: 1, ltsw: 10, candidate: "not eligible", ivtCandidate: "eligible",
      targetVessels: [], aspects: 8, acei: "no",
    };
    const input = (p: Record<string, unknown>) => ({ ...ok, ...p }) as unknown as Parameters<typeof remedy>[0];
    expect(remedy(input({}))).toBe(false);
    expect(remedy(input({ remedyPostIvt: "yes" }))).toBe(true);
    expect(reasonRemedy(input({})).eligible).toBe(false);
    expect(remedy(input({ ivtCandidate: "not eligible" }))).toBe(true);
  });
});
