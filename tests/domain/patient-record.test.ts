// Messaggio e riga del foglio condivisi da Share e Bedside Board: devono
// restare identici a quelli che Share costruiva prima dell'estrazione.

import { describe, test, expect } from "vitest";
import { buildShareMessage, buildSheetPayload, type PatientRecord } from "$lib/domain/patient-record";
import { buildTrialsForSheet, SHEET_TRIAL_KEYS_CSV } from "$lib/domain/sheet-payload";

const rec: PatientRecord = {
  patientId: "2025-00123",
  age: 72,
  nihss: 14,
  premrs: 1,
  ltswHours: 2.5,
  strokeType: "ischemic",
  selected: ["ATHENA", "NiVO"],
  outcomes: { ATHENA: "control" },
  notes: "  note  ",
  tev: "Yes",
  mtici: "2b67",
  tiv: "No",
};

describe("patient-record", () => {
  test("messaggio WhatsApp", () => {
    expect(buildShareMessage(rec)).toBe(
      [
        "Patient ID: xxxxxxx123",
        "Age: 72",
        "NIHSS: 14",
        "pre-mRS: 1",
        "LTSW: 2h 30m",
        "Stroke type: ischemic",
        "",
        "Selected trials:",
        "- ATHENA: control",
        "- NiVO",
        "",
        "Acute treatments:",
        "- TEV: Yes",
        "- mTICI: 2b67",
        "- TIV: No",
        "",
        "Notes: note",
      ].join("\n")
    );
  });

  test("righe extra dopo i dati del paziente", () => {
    const m = buildShareMessage({ age: 70, selected: [], outcomes: {}, notes: "" }, ["Eligible: WeTrust"]);
    expect(m).toBe("Age: 70\nEligible: WeTrust");
  });

  test("riga del foglio", () => {
    const { payload, missed } = buildSheetPayload(rec, ["ATHENA", "PIVOTAL"], "guided", "2026-10-21T10:00:00.000Z");
    const trials = buildTrialsForSheet(rec.selected, rec.outcomes);
    expect(missed).toEqual(["PIVOTAL"]);
    expect(payload).toEqual({
      Timestamp: "2026-10-21T10:00:00.000Z",
      N_patient: "2025-00123",
      Age: 72,
      NIHSS: 14,
      LTSW_h: 2.5,
      pre_mRS: 1,
      ...trials,
      "DO  IT": trials.DOIT,
      NiVO: trials.NIVO,
      trialKeys: SHEET_TRIAL_KEYS_CSV,
      TEV: "Yes",
      mTICI: "2b67",
      TIV: "No",
      Notes: "  note  ",
      missed_trials: "PIVOTAL",
      eligible_at_submit: "ATHENA,PIVOTAL",
      source: "guided",
    });
    expect(payload.ATHENA).toBe("control");
  });
});
