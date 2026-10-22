// Messaggio e riga del foglio di Share: devono restare identici a quelli che
// Share costruiva prima dell'estrazione.

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

  test("dettagli clinici: occlusione, tandem, ASPECTS, candidature, emorragia", () => {
    const m = buildShareMessage({
      age: 70, selected: [], outcomes: {}, notes: "", wakeup: true,
      targetVessels: ["m1"], tandem: "yes", aspects: 8, evtCandidate: "eligible", ivtCandidate: "not eligible",
      gcs: 13, hemVolume: 18, anticoag: "none", secondaryCause: "None", spotSign: "no",
    });
    expect(m).toBe([
      "Age: 70",
      "Onset: wake-up / unknown (LTSW from last seen well)",
      "Occlusion: M1 + extracranial ICA/CCA (tandem)",
      "ASPECTS: 8",
      "EVT candidate: yes",
      "IVT candidate: no",
      "GCS: 13",
      "Hematoma volume: 18 mL",
      "Anticoagulation: none",
      "Secondary cause: None",
      "Spot sign: no",
    ].join("\n"));
  });

  test("antitrombotici: dal SEM, oppure il DOAC", () => {
    expect(buildShareMessage({ ...rec, antithrombotics: ["antiplatelet", "doac"] })).toContain("Antithrombotics: antiplatelet + DOAC");
    expect(buildShareMessage({ ...rec, doac: "yes" })).toContain("DOAC: yes");
    expect(buildShareMessage({ ...rec, anticoag: "doac", doac: "yes" })).not.toContain("DOAC: yes");
  });

  test("emorragia: reversione nel messaggio e nel foglio", () => {
    const r = { age: 70, selected: [], outcomes: {}, notes: "", reversal: "Yes", reversalAgent: "pcc" };
    expect(buildShareMessage(r)).toBe("Age: 70\n\nAcute treatments:\n- Anticoagulation reversal: Yes (PCC)");
    const { payload } = buildSheetPayload(r, [], "board", "2026-10-21T10:00:00.000Z");
    expect(payload.Reversal).toBe("Yes");
    expect(payload.Reversal_agent).toBe("PCC");
  });

  test("paziente registrato: visto il, LTSW alla valutazione", () => {
    const m = buildShareMessage({ age: 70, ltswHours: 3.5, seen: "20 Oct 2026 14:00", ltswDetail: "reported", selected: [], outcomes: {}, notes: "" });
    expect(m).toBe("Age: 70\nSeen: 20 Oct 2026 14:00\nLTSW at evaluation: 3h 30m (reported)");
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
      Reversal: "",
      Reversal_agent: "",
      Seen_at: "",
      Notes: "  note  ",
      missed_trials: "PIVOTAL",
      eligible_at_submit: "ATHENA,PIVOTAL",
      source: "guided",
    });
    expect(payload.ATHENA).toBe("control");
  });
});
