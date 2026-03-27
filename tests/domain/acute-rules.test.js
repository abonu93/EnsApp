const test = require("node:test");
const assert = require("node:assert/strict");
const rules = require("../../js/domain/acute-rules.js");

test("weTrust: eligible when all criteria are met", () => {
  const ok = rules.weTrust({ age: 70, nihss: 12, premrs: 2, ltsw: 4, angiograph: "yes" });
  assert.equal(ok, true);
});

test("weTrust: not eligible when NIHSS is too low", () => {
  const ok = rules.weTrust({ age: 70, nihss: 8, premrs: 2, ltsw: 4, angiograph: "yes" });
  assert.equal(ok, false);
});

test("weTrust: allows wake-up stroke up to 12h", () => {
  const ok = rules.weTrust({
    age: 70,
    nihss: 12,
    premrs: 1,
    ltsw: 11,
    wakeupStroke: true,
    wakeupSymptomsWithin6h: true,
    angiograph: "yes",
  });
  assert.equal(ok, true);
});

test("computeVesselFlags: maps target vessels correctly", () => {
  const flags = rules.computeVesselFlags(["m1", "m2-any"]);
  const nivoAllowed = rules.computeVesselFlags(["p2"]);
  assert.equal(flags.vanish, true);
  assert.equal(flags.promise, true);
  assert.equal(flags.nivo, false);
  assert.equal(nivoAllowed.nivo, true);
});

test("athena: returns false when tortuosity is missing", () => {
  const ok = rules.athena({
    age: 50,
    nihss: 12,
    premrs: 1,
    ltsw: 3,
    lvo: "yes",
    tandem: "no",
    tortuosity: "",
    targetVessels: ["m1"],
  });
  assert.equal(ok, false);
});

test("nivo: requires ASPECTS >= 6", () => {
  const common = {
    age: 65,
    nihss: 7,
    premrs: 1,
    ltsw: 5,
    lvo: "yes",
    targetVessels: ["gt-m2"],
  };
  assert.equal(rules.nivo({ ...common, aspects: 6 }), true);
  assert.equal(rules.nivo({ ...common, aspects: 5 }), false);
  assert.equal(rules.nivo({ ...common, aspects: 6, targetVessels: ["gt-m2", "p2"] }), false);
  assert.equal(rules.nivo({ ...common, aspects: 6, targetVessels: ["m2-any"] }), false);
  assert.equal(rules.nivo({ ...common, aspects: 6, targetVessels: ["m2-proxdom"] }), false);
});

test("sovateltide: requires not-eligible EVT candidate", () => {
  const input = {
    age: 60,
    nihss: 10,
    premrs: 1,
    ltsw: 10,
    lesionConfirmed: "yes",
  };
  assert.equal(rules.sovateltide({ ...input, candidate: "not eligible" }), true);
  assert.equal(rules.sovateltide({ ...input, candidate: "eligible" }), false);
});

test("vanish: does not depend on thrombolysis contraindication", () => {
  const ok = rules.vanish({
    age: 65,
    nihss: 12,
    premrs: 1,
    lvo: "yes",
    contraTpa: "yes",
    targetVessels: ["m1"],
  });
  assert.equal(ok, true);
});

test("orion: requires at least one occluded vessel", () => {
  const base = {
    age: 70,
    nihss: 8,
    premrs: 1,
    ltsw: 8,
    contraTpa: "no",
  };
  assert.equal(rules.orion({ ...base, targetVessels: [] }), false);
  assert.equal(rules.orion({ ...base, targetVessels: ["m1"] }), true);
});

test("doit: requires IVT indication, DOAC <=48h context, age >=18, LTSW <=4.5h", () => {
  const base = { age: 70, ltsw: 3.5, doac: "yes", ivtCandidate: "eligible" };
  assert.equal(rules.doit(base), true);
  assert.equal(rules.doit({ ...base, ivtCandidate: "not eligible" }), false);
  assert.equal(rules.doit({ ...base, doac: "no" }), false);
  assert.equal(rules.doit({ ...base, ltsw: 6 }), false);
});

test("remedy: eligible when all criteria are met", () => {
  const ok = rules.remedy({
    age: 66,
    nihss: 10,
    premrs: 1,
    ltsw: 8,
    candidate: "not eligible",
    targetVessels: ["gt-m2"],
    aspects: 7,
    acei: "no",
  });
  assert.equal(ok, true);
});

test("remedy: excludes TEV, excluded vessels, ASPECTS < 6, and IECA use", () => {
  const base = {
    age: 66,
    nihss: 10,
    premrs: 1,
    ltsw: 8,
    targetVessels: ["gt-m2"],
    aspects: 7,
    acei: "no",
    candidate: "not eligible",
  };
  assert.equal(rules.remedy({ ...base, candidate: "eligible" }), false);
  assert.equal(rules.remedy({ ...base, targetVessels: ["m1"] }), false);
  assert.equal(rules.remedy({ ...base, targetVessels: ["basilar"] }), false);
  assert.equal(rules.remedy({ ...base, aspects: 5 }), false);
  assert.equal(rules.remedy({ ...base, acei: "yes" }), false);
});
