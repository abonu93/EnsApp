// Colonne cliniche del foglio DB: tutti i parametri registrati, in coda.
import { describe, test, expect } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { buildClinicalColumns, CLINICAL_COL_DEFS, SHEET_CLINICAL_COLS } from "$lib/domain/sheet-columns";
import { buildSheetPayload } from "$lib/domain/patient-record";
import { BOARD_FIELDS } from "$lib/domain/board";

describe("sheet-columns", () => {
  test("stesso elenco di colonne nell'app e nello script (CLINICAL_COLS)", () => {
    const ctx: Record<string, unknown> = {};
    vm.createContext(ctx);
    vm.runInContext(readFileSync("tools/apps-script/Code.gs", "utf8") + "\nthis.__cols = CLINICAL_COLS;", ctx);
    expect([...(ctx.__cols as string[])]).toEqual([...SHEET_CLINICAL_COLS]);
    expect(new Set(SHEET_CLINICAL_COLS).size).toBe(SHEET_CLINICAL_COLS.length);
  });

  test("ogni campo clinico del board ha la sua colonna", () => {
    const covered = new Set(CLINICAL_COL_DEFS.map((d) => `${d.store}.${d.key}`));
    // Gia' nelle colonne storiche: tipo di ictus, NIHSS, pre-mRS, eta'.
    const base = new Set(["post.strokeType", "pre.nihss", "pre.premrs", "pre.age"]);
    const missing = BOARD_FIELDS.map((f) => `${f.store}.${f.key}`).filter((k) => !base.has(k) && !covered.has(k));
    expect(missing).toEqual([]);
  });

  test("il CIP e l'ID paziente non finiscono mai nelle colonne cliniche", () => {
    const cols = buildClinicalColumns({ pre: { cip: "ABCD1234", patientId: "P1", race: 5 } }, "ischemic", {});
    expect(JSON.stringify(cols)).not.toContain("ABCD1234");
    expect(Object.values(cols)).not.toContain("P1");
    expect(cols.RACE).toBe(5);
  });

  test("ischemico: vasi, ASPECTS, criteri; i campi dell'emorragia restano vuoti", () => {
    const cols = buildClinicalColumns(
      {
        pre: { wakeupStroke: true, ltswDate: "2026-11-03T08:00", antithrombotics: ["antiplatelet", "doac"], doac: "yes" },
        post: { targetVessels: ["m1", "ica-terminal"], aspects: 8, candidate: "eligible", tmaxGt30: "na", diabetes: "no" },
        hem: { gcs: 12, hemVolume: 30 },
      },
      "ischemic",
      { Reversal: "" }
    );
    expect(cols.Wakeup).toBe("yes");
    expect(cols.LTSW_datetime).toBe("2026-11-03T08:00");
    expect(cols.Antithrombotics).toBe("antiplatelet + doac");
    expect(cols.Occlusion).toBe("M1 + Terminal ICA (ICA-T)");
    expect(cols.ASPECTS).toBe(8);
    expect(cols.EVT_candidate).toBe("eligible");
    expect(cols.Tmax_gt30).toBe("na");
    expect(cols.Diabetes).toBe("no");
    expect(cols.GCS).toBe("");
    expect(cols.Hematoma_mL).toBe("");
  });

  test("emorragia: GCS, volume, anticoagulazione; i campi ischemici restano vuoti", () => {
    const cols = buildClinicalColumns(
      { post: { targetVessels: ["m1"], aspects: 8 }, hem: { gcs: 12, hemVolume: 30, anticoag: "doac", spotSign: "yes", ivh: "no" } },
      "hemorrhagic",
      { Reversal: "Yes", Reversal_agent: "PCC" }
    );
    expect(cols).toMatchObject({ GCS: 12, Hematoma_mL: 30, Anticoagulation: "doac", Spot_sign: "yes", IVH: "no", Reversal: "Yes", Reversal_agent: "PCC" });
    expect(cols.Occlusion).toBe("");
    expect(cols.ASPECTS).toBe("");
  });

  test("nella riga del foglio, con le chiavi nell'ordine delle colonne", () => {
    const { payload } = buildSheetPayload(
      { strokeType: "ischemic", selected: [], outcomes: {}, notes: "", sheetData: { post: { targetVessels: [] } } },
      [],
      "guided"
    );
    expect(payload.Occlusion).toBe("none");
    const keys = Object.keys(payload).filter((k) => SHEET_CLINICAL_COLS.includes(k));
    expect(keys).toEqual([...SHEET_CLINICAL_COLS]);
  });
});
