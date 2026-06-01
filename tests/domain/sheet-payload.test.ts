// Blinda il formato del payload Google Sheets: deve restare byte-identico
// al comportamento legacy per non rompere il backend Apps Script.
// Confronto contro l'implementazione legacy CJS.

import { describe, test, expect } from "vitest";
import { createRequire } from "node:module";
import {
  buildTrialsForSheet,
  normalizeStudyName,
  hasKnownStudyArm,
  type StudyOutcomes,
} from "$lib/domain/sheet-payload";

const require = createRequire(import.meta.url);

// Carichiamo il sorgente legacy come stringa e lo eseguiamo via Function:
// il file legacy/js/app-data.js non e' un modulo, e' codice top-level
// con TRIALS_INFO/SHEET_TRIAL_KEYS/buildTrialsForSheet in scope locale.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const legacyPath = join(__dirname, "..", "..", "legacy", "js", "app-data.js");
const legacySrc = readFileSync(legacyPath, "utf8");

// Espone le funzioni e le costanti come export tramite return della Function.
const legacyAPI = new Function(`
  ${legacySrc}
  return { buildTrialsForSheet, normalizeStudyName, hasKnownStudyArm, SHEET_TRIAL_KEYS };
`)();

describe("sheet payload - parity with legacy", () => {
  test("SHEET_TRIAL_KEYS shape identical", () => {
    expect(legacyAPI.SHEET_TRIAL_KEYS).toEqual([
      "WeTrust", "MARSS", "ATHENA", "VANISH", "PIVOTAL", "MOSTE", "FASTEST",
      "TICH3", "LIBREXIA", "TWIN2WIN", "ARTEMIS", "HYBERNIA", "DONESYMPLE",
      "SAFERDOAC", "SHIONOGI", "SOVATELTIDE", "ORION", "DOIT", "REMEDY",
      "PROMISE", "NIVO",
    ]);
  });

  test("normalizeStudyName: same outputs", () => {
    for (const name of ["SaferDoac", "DOIT", "TICH3", "WeTrust", "ATHENA", "Librexia", ""]) {
      expect(normalizeStudyName(name)).toBe(legacyAPI.normalizeStudyName(name));
    }
  });

  test("hasKnownStudyArm: same outputs", () => {
    for (const name of ["SAFER-DOAC", "FASTEST", "TICH-3", "NiVO", "REMEDY", "ATHENA", "WeTrust"]) {
      expect(hasKnownStudyArm(name)).toBe(legacyAPI.hasKnownStudyArm(name));
    }
  });

  const scenarios: Array<{ name: string; selected: string[]; outcomes: StudyOutcomes }> = [
    { name: "empty", selected: [], outcomes: {} },
    { name: "single ATHENA intervention", selected: ["ATHENA"], outcomes: { ATHENA: "intervention" } },
    { name: "single ATHENA control", selected: ["ATHENA"], outcomes: { ATHENA: "control" } },
    { name: "study without arm (FASTEST)", selected: ["FASTEST"], outcomes: {} },
    { name: "mixed: SAFER-DOAC + ATHENA", selected: ["SAFER-DOAC", "ATHENA"], outcomes: { ATHENA: "intervention" } },
    { name: "all post-acute Librexia", selected: ["Librexia"], outcomes: {} },
    {
      name: "many trials",
      selected: ["WeTrust", "VANISH", "PROMISE", "NiVO"],
      outcomes: { WeTrust: "intervention", VANISH: "control", PROMISE: "intervention" },
    },
    {
      name: "unknown name silently ignored",
      selected: ["UNKNOWN_TRIAL", "WeTrust"],
      outcomes: { WeTrust: "intervention" },
    },
  ];

  for (const s of scenarios) {
    test(`buildTrialsForSheet: ${s.name}`, () => {
      const ours = buildTrialsForSheet(s.selected, s.outcomes);
      const theirs = legacyAPI.buildTrialsForSheet(s.selected, s.outcomes);
      // Le nostre estensioni (es. NORAHOME) sono colonne che il legacy
      // non aveva: il test parity verifica solo le colonne in comune.
      const oursLegacyOnly: Record<string, string> = {};
      for (const k of Object.keys(theirs)) {
        oursLegacyOnly[k] = (ours as Record<string, string>)[k];
      }
      expect(oursLegacyOnly).toEqual(theirs);
    });
  }
});
