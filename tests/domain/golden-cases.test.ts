// Suite di regressione clinica.
// Per ogni paziente in fixtures/golden-cases.json (generato da
// tools/generate-golden-cases.mjs sul codice LEGACY), verifica che le
// regole TS portate producano IDENTICO output.
// Failure qui = porting del dominio rotto, NON modificare il fixture
// per far passare il test: indagare la regressione.

import { describe, test, expect } from "vitest";
import goldenCases from "./fixtures/golden-cases.json";
import * as acuteRules from "$lib/domain/acute-rules";
import * as hemRules from "$lib/domain/hemorrhagic-rules";
import type { AcuteInput, VesselCode } from "$lib/domain/acute-rules";
import type { HemorrhagicInput } from "$lib/domain/hemorrhagic-rules";

const ACUTE_RULE_NAMES = [
  "weTrust",
  "athena",
  "vanish",
  "pivotal",
  "promise",
  "nivo",
  "moste",
  "twin2win2",
  "artemis",
  "hybernia",
  "doneSymple",
  "shionogi",
  "sovateltide",
  "orion",
  "doit",
  "remedy",
] as const;

type AcuteRuleName = (typeof ACUTE_RULE_NAMES)[number];

interface AcuteGoldenCase {
  id: string;
  description: string;
  input: AcuteInput;
  expected: Record<AcuteRuleName, boolean>;
  vesselFlags: ReturnType<typeof acuteRules.computeVesselFlags>;
}

interface HemGoldenCase {
  id: string;
  description: string;
  input: HemorrhagicInput;
  expected: {
    fastest: ReturnType<typeof hemRules.fastest>;
    tich3: boolean;
  };
}

interface GoldenCases {
  generatedAt: string;
  source: string;
  acute: AcuteGoldenCase[];
  hemorrhagic: HemGoldenCase[];
}

const data = goldenCases as unknown as GoldenCases;

describe("golden cases - acute eligibility (porting parity vs legacy)", () => {
  for (const c of data.acute) {
    describe(c.id, () => {
      test("computeVesselFlags matches legacy", () => {
        const flags = acuteRules.computeVesselFlags(c.input.targetVessels as VesselCode[]);
        expect(flags).toEqual(c.vesselFlags);
      });

      for (const ruleName of ACUTE_RULE_NAMES) {
        test(`${ruleName} matches legacy`, () => {
          const fn = acuteRules[ruleName];
          const result = fn(c.input);
          expect(result).toBe(c.expected[ruleName]);
        });
      }
    });
  }
});

describe("golden cases - hemorrhagic eligibility", () => {
  for (const c of data.hemorrhagic) {
    describe(c.id, () => {
      test("fastest matches legacy", () => {
        expect(hemRules.fastest(c.input)).toEqual(c.expected.fastest);
      });
      test("tich3 matches legacy", () => {
        expect(hemRules.tich3(c.input)).toBe(c.expected.tich3);
      });
    });
  }
});
