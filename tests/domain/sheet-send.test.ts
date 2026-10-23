import { describe, it, expect, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import {
  buildTrialsForSheet,
  rowMatchesPayload,
  sendToSheet,
  SHEET_TRIAL_KEYS_CSV,
} from "$lib/domain/sheet-payload";

const SENT = { Timestamp: "2026-10-21T10:00:00.000Z", N_patient: "P1", Age: 70, NIHSS: 12 };

describe("invio al foglio: verifica della riga scritta", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("riconosce la riga per paziente e orario (anche se il foglio la riformatta)", () => {
    expect(rowMatchesPayload({ timestamp: "2026-10-21T10:00:00.000Z", N_patient: "P1" }, SENT)).toBe(true);
    expect(rowMatchesPayload({ timestamp: "2026-10-21T10:03:00Z", N_patient: "P1" }, SENT)).toBe(true);
    expect(rowMatchesPayload({ timestamp: "2026-10-21T10:00:00.000Z", N_patient: "P2" }, SENT)).toBe(false);
    expect(rowMatchesPayload({ timestamp: "2026-10-20T10:00:00.000Z", N_patient: "P1" }, SENT)).toBe(false);
    // Senza ID paziente si confrontano eta' e NIHSS.
    const anon = { ...SENT, N_patient: "" };
    expect(rowMatchesPayload({ timestamp: SENT.Timestamp, Age: 70, NIHSS: 12 }, anon)).toBe(true);
    expect(rowMatchesPayload({ timestamp: SENT.Timestamp, Age: 71, NIHSS: 12 }, anon)).toBe(false);
  });

  function stubFetch(get: () => Promise<Response>) {
    vi.stubGlobal("fetch", vi.fn((_url: string, init?: RequestInit) =>
      init?.method === "POST" ? Promise.resolve(new Response(null)) : get()
    ));
  }

  it("confirmed quando la riga compare nel foglio", async () => {
    stubFetch(() => Promise.resolve(Response.json([{ timestamp: SENT.Timestamp, N_patient: "P1" }])));
    expect((await sendToSheet(SENT, [0])).status).toBe("confirmed");
  });

  it("not-found quando il foglio risponde senza la riga", async () => {
    stubFetch(() => Promise.resolve(Response.json([])));
    expect((await sendToSheet(SENT, [0, 0])).status).toBe("not-found");
  });

  it("unverified quando il foglio non si puo' rileggere", async () => {
    stubFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    expect((await sendToSheet(SENT, [0])).status).toBe("unverified");
  });

  it("failed quando la POST non parte", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new TypeError("Failed to fetch"))));
    expect((await sendToSheet(SENT, [0])).status).toBe("failed");
  });
});

// Simulazione dello script Apps Script (tools/apps-script/Code.gs) con un
// foglio finto: verifica che il payload dell'app finisca nelle colonne giuste.
describe("Apps Script: il payload dell'app finisce nelle colonne giuste", () => {
  function makeSheet(headers: string[]) {
    const rows: unknown[][] = [headers.slice()];
    return {
      rows,
      getLastColumn: () => rows[0].length,
      getLastRow: () => rows.length,
      getRange: (r: number, c: number, nr: number, nc: number) => ({
        getValues: () =>
          rows.slice(r - 1, r - 1 + nr).map((row) => Array.from({ length: nc }, (_, i) => row[c - 1 + i] ?? "")),
        setValues: (vals: unknown[][]) => {
          vals.forEach((v, i) => v.forEach((x, j) => (rows[r - 1 + i][c - 1 + j] = x)));
          return { setFontWeight: () => {} };
        },
        setFontWeight: () => {},
      }),
      appendRow: (row: unknown[]) => rows.push(row),
      setFrozenRows: () => {},
    };
  }

  it("riga del flusso guidato con trial, braccio e colonne nuove", () => {
    const headers = ["Timestamp", "N_patient", "Age", "NIHSS", "LTSW_h", "pre_mRS", "WeTrust", "TWIN2WIN", "DO  IT", "NiVO", "TEV", "Notes", "missed", "eligible", "source"];
    const sh = makeSheet(headers);
    const props: Record<string, string> = {};
    const ctx: Record<string, unknown> = {
      SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheets: () => [sh], getSheetByName: () => sh }) },
      PropertiesService: {
        getScriptProperties: () => ({ getProperty: (k: string) => props[k] ?? null, setProperty: (k: string, v: string) => (props[k] = v) }),
      },
      LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
      ContentService: { createTextOutput: (text: string) => ({ text, setMimeType() { return this; } }), MimeType: { JSON: "json" } },
    };
    vm.createContext(ctx);
    vm.runInContext(readFileSync("tools/apps-script/Code.gs", "utf8"), ctx);

    const trials = buildTrialsForSheet(["TWIN-2-WIN 2", "DO-IT", "TENACITY"], { "TWIN-2-WIN 2": "control" });
    const payload = {
      ...SENT, LTSW_h: 3.25, pre_mRS: 1, ...trials, "DO  IT": trials.DOIT, NiVO: trials.NIVO,
      trialKeys: SHEET_TRIAL_KEYS_CSV, TEV: "si", Notes: "-> TC =A1", missed_trials: "ATHENA",
      eligible_at_submit: "ATHENA,TWIN-2-WIN 2", source: "guided",
    };
    const doPost = ctx.doPost as (e: unknown) => { text: string };
    expect(doPost({ parameter: { payload: JSON.stringify(payload) } }).text).toBe("ok");

    const h = sh.rows[0] as string[];
    const row = sh.rows[1];
    const col = (k: string) => row[h.indexOf(k)];
    // Testo forzato (apostrofo): niente formule, niente zeri iniziali persi.
    expect(col("N_patient")).toBe("'P1");
    expect(col("Notes")).toBe("'-> TC =A1");
    expect(col("LTSW_h")).toBe(3.25);
    expect(col("TWIN2WIN")).toBe("control");
    expect(col("DO  IT")).toBe("intervention");
    expect(col("NiVO")).toBe("no");
    expect(col("TENACITY")).toBe("intervention"); // colonna creata dallo script
    expect(col("missed")).toBe("ATHENA");
    expect(col("source")).toBe("guided");
  });
});
