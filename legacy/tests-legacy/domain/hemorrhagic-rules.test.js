const test = require("node:test");
const assert = require("node:assert/strict");
const rules = require("../../js/domain/hemorrhagic-rules.js");

test("fastest: eligible with complete valid profile", () => {
  const result = rules.fastest({
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
  assert.equal(result.eligible, true);
  assert.equal(result.baseCriteriaMet, true);
  assert.equal(result.extraMissing, false);
});

test("fastest: fails when additional questions are missing", () => {
  const result = rules.fastest({
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
  assert.equal(result.extraMissing, true);
  assert.equal(result.eligible, false);
});

test("tich3: eligible only when all criteria match", () => {
  const eligible = rules.tich3({
    ltsw: 2,
    hemVolume: 30,
    ivh: "no",
    gcs: 10,
    seizure: "no",
    secondaryCause: "None",
  });
  const notEligible = rules.tich3({
    ltsw: 5,
    hemVolume: 30,
    ivh: "no",
    gcs: 10,
    seizure: "no",
    secondaryCause: "None",
  });
  assert.equal(eligible, true);
  assert.equal(notEligible, false);
});
