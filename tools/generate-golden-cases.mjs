// Generatore di golden cases per la suite di regressione clinica.
// Esegue le regole LEGACY (legacy/js/domain/*.js) su un set di pazienti
// realistici, cattura l'output e lo salva come fixture JSON.
// La fixture sara' usata da tests/domain/golden-cases.test.ts per
// verificare che il porting TS produca esattamente lo stesso comportamento.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Legacy modules are UMD-wrapped CommonJS. With "type":"module" in package.json,
// .js files are treated as ESM and the UMD module.exports assignment fails.
// We mirror them to .cjs purely for this oracle-generation tool.
const acute = require("../legacy/js/domain/acute-rules.cjs");
const hem = require("../legacy/js/domain/hemorrhagic-rules.cjs");

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "tests", "domain", "fixtures");
const outFile = join(outDir, "golden-cases.json");

const ACUTE_RULES = [
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
];

const acuteCases = [
  {
    id: "ischemic-classic-lvo-m1-eligible",
    description: "LVO M1, NIHSS 14, 3h, mRS 1, ASPECTS 8 - candidato classico",
    input: {
      age: 68,
      nihss: 14,
      premrs: 1,
      ltsw: 3,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 8,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-wakeup-12h",
    description: "Wake-up stroke, 11h, NIHSS 12, sintomi <6h",
    input: {
      age: 72,
      nihss: 12,
      premrs: 1,
      ltsw: 11,
      wakeupStroke: true,
      wakeupSymptomsWithin6h: true,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["ica-terminal"],
      aspects: 7,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "not eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-late-window-24h",
    description: "Tardivo 22h, ASPECTS 6, mRS 1, NIHSS 8",
    input: {
      age: 60,
      nihss: 8,
      premrs: 1,
      ltsw: 22,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 6,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "not eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-distal-m2-nivo",
    description: "Distal M2, mRS 1, NIHSS 7, ASPECTS 9 (NiVO target)",
    input: {
      age: 55,
      nihss: 7,
      premrs: 1,
      ltsw: 6,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["gt-m2"],
      aspects: 9,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-low-nihss-moste",
    description: "Low NIHSS (4), M1, mRS 0 (MOSTE target)",
    input: {
      age: 64,
      nihss: 4,
      premrs: 0,
      ltsw: 10,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 9,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-no-lvo-not-eligible",
    description: "No LVO, NIHSS 10 - candidato sovateltide/remedy",
    input: {
      age: 70,
      nihss: 10,
      premrs: 1,
      ltsw: 8,
      angiograph: "yes",
      lvo: "no",
      tandem: "no",
      tortuosity: "no",
      targetVessels: [],
      aspects: 8,
      lesionConfirmed: "yes",
      candidate: "not eligible",
      ivtCandidate: "not eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-doit-doac-positive",
    description: "DOAC positive, LTSW 3h, IVT candidate (DOiT)",
    input: {
      age: 75,
      nihss: 9,
      premrs: 1,
      ltsw: 3,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 8,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "eligible",
      doac: "yes",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-done-simple-late",
    description: "DONE-Simple: 48h, NIHSS 10, LVO M1",
    input: {
      age: 65,
      nihss: 10,
      premrs: 1,
      ltsw: 48,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 7,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "not eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-elderly-90-orion",
    description: "Elderly 88y, late 6h, mRS 1, NIHSS 6 (ORION)",
    input: {
      age: 88,
      nihss: 6,
      premrs: 1,
      ltsw: 6,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "no",
      targetVessels: ["m1"],
      aspects: 7,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "not eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
  {
    id: "ischemic-tortuosity-missing",
    description: "Tortuosity non specificata: athena deve fallire",
    input: {
      age: 50,
      nihss: 12,
      premrs: 1,
      ltsw: 3,
      angiograph: "yes",
      lvo: "yes",
      tandem: "no",
      tortuosity: "",
      targetVessels: ["m1"],
      aspects: 8,
      lesionConfirmed: "yes",
      candidate: "eligible",
      ivtCandidate: "eligible",
      doac: "no",
      acei: "no",
      contraTpa: "no",
    },
  },
];

const hemCases = [
  {
    id: "hem-fastest-eligible",
    description: "FASTEST eligible: 1.5h, 20mL, GCS 12, no exclusioni",
    input: {
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
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    },
  },
  {
    id: "hem-fastest-missing-info",
    description: "FASTEST con info mancanti (brainstem vuoto)",
    input: {
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
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    },
  },
  {
    id: "hem-fastest-too-late",
    description: "FASTEST LTSW 3h (oltre finestra 2h)",
    input: {
      age: 65,
      premrs: 1,
      ltsw: 3,
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
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    },
  },
  {
    id: "hem-tich3-eligible",
    description: "TICH-3 eligible: 2h, 30mL, no IVH, GCS 10",
    input: {
      age: 65,
      premrs: 1,
      ltsw: 2,
      hemVolume: 30,
      gcs: 10,
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    },
  },
  {
    id: "hem-tich3-large-volume",
    description: "TICH-3 con volume >= 60mL (escluso)",
    input: {
      age: 65,
      premrs: 1,
      ltsw: 2,
      hemVolume: 65,
      gcs: 10,
      ivh: "no",
      seizure: "no",
      secondaryCause: "None",
    },
  },
];

const goldenCases = {
  generatedAt: new Date().toISOString(),
  source: "legacy/js/domain/{acute-rules,hemorrhagic-rules}.js",
  acute: acuteCases.map((c) => {
    const expected = {};
    for (const rule of ACUTE_RULES) {
      expected[rule] = acute[rule](c.input);
    }
    const vesselFlags = acute.computeVesselFlags(c.input.targetVessels);
    return { ...c, expected, vesselFlags };
  }),
  hemorrhagic: hemCases.map((c) => {
    return {
      ...c,
      expected: {
        fastest: hem.fastest(c.input),
        tich3: hem.tich3(c.input),
      },
    };
  }),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(goldenCases, null, 2) + "\n");

const total = goldenCases.acute.length + goldenCases.hemorrhagic.length;
const eligibleAcute = goldenCases.acute.reduce(
  (n, c) => n + Object.values(c.expected).filter(Boolean).length,
  0
);
console.log(`Wrote ${total} cases to ${outFile}`);
console.log(`  Acute: ${goldenCases.acute.length} pazienti, ${eligibleAcute} match trial-cumulative`);
console.log(`  Hemorrhagic: ${goldenCases.hemorrhagic.length} pazienti`);
