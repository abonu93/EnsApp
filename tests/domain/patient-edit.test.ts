// Modifica di un paziente gia' salvato: bozza, payload op=update, script
// (Code.gs, patientUpdate_) e merge con la sync del foglio.
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { get } from "svelte/store";
import {
  applyDraft,
  buildUpdatePayload,
  draftFromSaved,
  draftProblems,
  missedAfterEdit,
  savedLtswHours,
} from "$lib/domain/patient-edit";
import { buildSheetPayload } from "$lib/domain/patient-record";
import { sendUpdateToSheet } from "$lib/domain/sheet-payload";
import { savedPatients, mergeRemote, type SavedPatient } from "$lib/stores/savedPatients";

const TS = "2026-11-10T09:00:00.000Z";

function local(over: Partial<SavedPatient> = {}): SavedPatient {
  return {
    id: "1762765200000",
    savedAt: TS,
    sheetTs: TS,
    patientId: "2025-00123",
    strokeType: "ischemic",
    age: 70,
    nihss: 12,
    ltswH: 3.5,
    trials: ["WeTrust"],
    missed: ["ATHENA", "TENACITY"],
    snapshot: {
      pre: { patientId: "2025-00123", age: 70, nihss: 12, premrs: 1, ltswDate: "2026-11-10T05:30:00.000Z", race: 6 },
      post: { strokeType: "ischemic", aspects: 8 },
      hem: {},
      studies: ["WeTrust"],
      outcomes: { WeTrust: "control" },
      chronic: [],
      notes: "nota",
      extras: { tev: "Yes", mtici: "2b67", tiv: "No" },
    },
    ...over,
  };
}

describe("bozza di modifica", () => {
  it("parte dai dati salvati, braccio compreso", () => {
    const d = draftFromSaved(local());
    expect(d).toMatchObject({
      patientId: "2025-00123", age: 70, nihss: 12, premrs: 1, ltswH: 3.5, strokeType: "ischemic",
      studies: ["WeTrust"], outcomes: { WeTrust: "control" }, tev: "Yes", mtici: "2b67", tiv: "No", notes: "nota",
    });
  });

  it("LTSW dei salvataggi vecchi: dalla data LSW all'ora dell'invio", () => {
    expect(savedLtswHours(local({ ltswH: undefined }))).toBe(3.5);
  });

  it("record dal foglio: l'ID mascherato va riscritto completo e deve combaciare", () => {
    const remote = local({ remote: true, patientId: "xxxxxxx123" });
    const d = draftFromSaved(remote);
    expect(d.patientId).toBe("");
    expect(draftProblems(remote, d)).toEqual(["id-missing"]);
    expect(draftProblems(remote, { ...d, patientId: "2025-00999" })).toEqual(["id-mismatch"]);
    expect(draftProblems(remote, { ...d, patientId: "2025-00123" })).toEqual([]);
  });

  it("mTICI obbligatorio con TEV, come all'invio", () => {
    const d = { ...draftFromSaved(local()), mtici: "" };
    expect(draftProblems(local(), d)).toEqual(["mtici-missing"]);
    expect(draftProblems(local(), { ...d, strokeType: "hemorrhagic" as const })).toEqual([]);
  });

  it("cambio di studio: payload con le colonne trial e missed aggiornati", () => {
    const p = local();
    const d = { ...draftFromSaved(p), studies: ["TENACITY"], outcomes: { TENACITY: "intervention" as const }, age: 71 };
    const missed = missedAfterEdit(p, d);
    expect(missed).toEqual(["ATHENA"]);
    const payload = buildUpdatePayload(d, { timestamp: TS, patientId: "2025-00123" }, missed);
    expect(payload).toMatchObject({
      kind: "update", matchTimestamp: TS, matchId: "2025-00123", N_patient: "2025-00123",
      Age: 71, WeTrust: "no", TENACITY: "intervention", TEV: "Yes", mTICI: "2b67", missed_trials: "ATHENA",
    });
    // Le colonne cliniche di dettaglio non si toccano.
    expect(payload).not.toHaveProperty("ASPECTS");
    expect(payload).not.toHaveProperty("Timestamp");

    const next = applyDraft(p, d, missed, "2026-11-12T10:00:00.000Z");
    expect(next.trials).toEqual(["TENACITY"]);
    expect(next.snapshot.outcomes).toEqual({ TENACITY: "intervention" });
    expect(next.snapshot.pre.race).toBe(6); // resto dello snapshot intatto
    expect(next.snapshot.post.aspects).toBe(8);
    expect(next.age).toBe(71);
  });

  it("emorragia: niente TEV/TIV, reversione con l'etichetta del farmaco", () => {
    const d = { ...draftFromSaved(local()), strokeType: "hemorrhagic" as const, reversal: "Yes" as const, reversalAgent: "andexanet" };
    const payload = buildUpdatePayload(d, { timestamp: TS, patientId: "P" }, []);
    expect(payload).toMatchObject({ TEV: "", mTICI: "", TIV: "", Reversal: "Yes", Reversal_agent: "andexanet alfa" });
  });
});

// Foglio finto con piu' schede (DB + Edits).
function makeSheet(rows: unknown[][]) {
  return {
    rows,
    getLastColumn: () => rows[0]?.length ?? 0,
    getLastRow: () => rows.length,
    getRange: (r: number, c: number, nr = 1, nc = 1) => ({
      getValues: () =>
        rows.slice(r - 1, r - 1 + nr).map((row) => Array.from({ length: nc }, (_, i) => row[c - 1 + i] ?? "")),
      setValues: (vals: unknown[][]) => {
        vals.forEach((v, i) => v.forEach((x, j) => {
          rows[r - 1 + i] = rows[r - 1 + i] ?? [];
          rows[r - 1 + i][c - 1 + j] = x;
        }));
        return { setFontWeight: () => {} };
      },
      setValue: (v: unknown) => {
        rows[r - 1][c - 1] = v;
      },
      setFontWeight: () => {},
      setNumberFormat: () => {},
    }),
    appendRow: (row: unknown[]) => rows.push(row),
    setFrozenRows: () => {},
    getMaxRows: () => 1000,
  };
}

function loadScript(db: ReturnType<typeof makeSheet>) {
  const sheets: Record<string, ReturnType<typeof makeSheet>> = {};
  const ss = {
    getSheets: () => [db],
    getSheetByName: (n: string) => sheets[n] ?? null,
    insertSheet: (n: string) => (sheets[n] = makeSheet([])),
  };
  const props: Record<string, string> = {};
  const ctx: Record<string, unknown> = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: (k: string) => props[k] ?? null, setProperty: (k: string, v: string) => (props[k] = v) }),
    },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    ContentService: { createTextOutput: (text: string) => ({ text, setMimeType() { return this; } }), MimeType: { JSON: "json" } },
  };
  vm.createContext(ctx);
  vm.runInContext(readFileSync("tools/apps-script/Code.gs", "utf8"), ctx);
  return {
    sheets,
    doPost: ctx.doPost as (e: unknown) => { text: string },
    doGet: ctx.doGet as (e: unknown) => { text: string },
  };
}

describe("Apps Script: modifica di una riga esistente (op=update)", () => {
  const HEADERS = ["Timestamp", "N_patient", "Age", "NIHSS", "LTSW_h", "pre_mRS", "Ischemic/Haemorragic", "WeTrust", "TENACITY", "TEV", "mTICI", "TIV", "Notes", "missed", "eligible", "source", "ASPECTS"];

  function setup() {
    const db = makeSheet([HEADERS.slice()]);
    const script = loadScript(db);
    const first = buildSheetPayload(
      {
        patientId: "2025-00123", age: 70, nihss: 12, ltswHours: 3.5, strokeType: "ischemic", selected: ["WeTrust"],
        outcomes: { WeTrust: "control" }, notes: "nota", tev: "Yes", mtici: "2b67", tiv: "No",
        sheetData: { post: { aspects: 8 } },
      },
      ["WeTrust", "ATHENA", "TENACITY"], "guided", TS
    ).payload;
    expect(script.doPost({ parameter: { payload: JSON.stringify(first) } }).text).toBe("ok");
    return { db, ...script };
  }

  const col = (db: ReturnType<typeof makeSheet>, row: number, k: string) => db.rows[row][(db.rows[0] as string[]).indexOf(k)];

  it("caps: lo script dichiara di saper modificare", () => {
    const { doGet } = loadScript(makeSheet([HEADERS.slice()]));
    expect(JSON.parse(doGet({ parameter: { op: "caps" } }).text)).toEqual({ v: 1, update: true });
  });

  it("corregge la riga (studio, eta', note), non ne aggiunge una, e registra le modifiche", () => {
    const { db, doPost, doGet, sheets } = setup();
    const p = local();
    const d = { ...draftFromSaved(p), studies: ["TENACITY"], outcomes: { TENACITY: "intervention" as const }, age: 71, notes: "=corretta" };
    const payload = buildUpdatePayload(d, { timestamp: TS, patientId: "2025-00123" }, missedAfterEdit(p, d));
    expect(doPost({ parameter: { op: "update", payload: JSON.stringify(payload) } }).text).toBe("ok");

    expect(db.rows).toHaveLength(2);
    expect(col(db, 1, "Age")).toBe(71);
    expect(col(db, 1, "WeTrust")).toBe("no");
    expect(col(db, 1, "TENACITY")).toBe("intervention");
    expect(col(db, 1, "Notes")).toBe("'=corretta");
    expect(col(db, 1, "missed")).toBe("ATHENA");
    // Invariati: ora d'invio, colonne cliniche, eleggibili, origine.
    expect(col(db, 1, "Timestamp")).toBe(TS);
    expect(col(db, 1, "ASPECTS")).toBe(8);
    expect(col(db, 1, "eligible")).toBe("WeTrust,ATHENA,TENACITY");
    expect(col(db, 1, "source")).toBe("guided");
    expect(String(col(db, 1, "Updated_at"))).toMatch(/^\d{4}-/);

    const edits = sheets.Edits.rows;
    expect(edits[0]).toEqual(["edited_at", "row_timestamp", "column", "old", "new"]);
    const changed = edits.slice(1).map((r) => r[2]);
    expect(changed).toEqual(expect.arrayContaining(["Age", "WeTrust", "TENACITY", "Notes", "missed"]));
    expect(changed).not.toContain("N_patient");

    const listed = JSON.parse(doGet({ parameter: { op: "list" } }).text);
    expect(listed[0].Updated_at).toBe(col(db, 1, "Updated_at"));
  });

  it("senza l'ID completo (solo quello mascherato pubblico) la riga non si tocca", () => {
    const { db, doPost } = setup();
    const before = JSON.stringify(db.rows[1]);
    const d = { ...draftFromSaved(local()), age: 99 };
    for (const matchId of ["xxxxxxx123", "2025-00999", ""]) {
      const payload = buildUpdatePayload(d, { timestamp: TS, patientId: matchId }, []);
      expect(doPost({ parameter: { op: "update", payload: JSON.stringify(payload) } }).text).toMatch(/^error/);
    }
    // ID nuovo mascherato: rifiutato.
    const masked = buildUpdatePayload({ ...d, patientId: "xxxxxxx123" }, { timestamp: TS, patientId: "2025-00123" }, []);
    expect(doPost({ parameter: { op: "update", payload: JSON.stringify(masked) } }).text).toMatch(/^error/);
    expect(JSON.stringify(db.rows[1])).toBe(before);
    expect(db.rows).toHaveLength(2);
  });

  it("cambio di ID paziente", () => {
    const { db, doPost } = setup();
    const d = { ...draftFromSaved(local()), patientId: "2025-00456" };
    doPost({ parameter: { op: "update", payload: JSON.stringify(buildUpdatePayload(d, { timestamp: TS, patientId: "2025-00123" }, [])) } });
    expect(col(db, 1, "N_patient")).toBe("'2025-00456");
  });
});

describe("invio della modifica dall'app", () => {
  afterEach(() => vi.unstubAllGlobals());
  const payload = { ...buildUpdatePayload(draftFromSaved(local()), { timestamp: TS, patientId: "2025-00123" }, []), matchTimestamp: TS, N_patient: "2025-00123" };

  it("script vecchio (caps -> []): non manda nulla, la modifica resta sul telefono", async () => {
    const f = vi.fn((url: string) => Promise.resolve(Response.json(url.includes("caps") ? [] : [])));
    vi.stubGlobal("fetch", f);
    expect((await sendUpdateToSheet(payload, [0])).status).toBe("unsupported");
    expect(f.mock.calls.some(([, init]) => (init as RequestInit | undefined)?.method === "POST")).toBe(false);
  });

  it("confirmed quando la riga ha Updated_at nuovo", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(new Response(null));
      if (url.includes("caps")) return Promise.resolve(Response.json({ v: 1, update: true }));
      return Promise.resolve(Response.json([{ timestamp: TS, N_patient: "xxxxxxx123", Updated_at: new Date().toISOString() }]));
    }));
    expect((await sendUpdateToSheet(payload, [0])).status).toBe("confirmed");
  });

  it("not-found se la riga non risulta aggiornata", async () => {
    vi.stubGlobal("fetch", vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === "POST") return Promise.resolve(new Response(null));
      if (url.includes("caps")) return Promise.resolve(Response.json({ v: 1, update: true }));
      return Promise.resolve(Response.json([{ timestamp: TS, N_patient: "xxxxxxx123", Updated_at: "2026-01-01T00:00:00Z" }]));
    }));
    expect((await sendUpdateToSheet(payload, [0])).status).toBe("not-found");
  });
});

describe("sync: un paziente salvato qui e la sua riga del foglio sono uno solo", () => {
  beforeEach(() => savedPatients.set([]));

  const remoteOf = (p: SavedPatient, over: Partial<SavedPatient> = {}): SavedPatient => ({
    ...p, id: TS, remote: true, patientId: "xxxxxxx123", sheetTs: TS, snapshot: { ...p.snapshot, pre: { age: p.age } }, ...over,
  });

  it("niente doppione: resta il record locale con l'ID completo", () => {
    savedPatients.set([local()]);
    mergeRemote([remoteOf(local())]);
    const list = get(savedPatients);
    expect(list).toHaveLength(1);
    expect(list[0].patientId).toBe("2025-00123");
    expect(list[0].snapshot.pre.race).toBe(6);
  });

  it("salvataggi vecchi (senza sheetTs): riconosciuti per ora e ID, e il doppione remoto gia' presente sparisce", () => {
    const old = local({ sheetTs: undefined, savedAt: "2026-11-10T09:00:04.000Z" });
    savedPatients.set([remoteOf(local()), old]);
    mergeRemote([remoteOf(local())]);
    const list = get(savedPatients);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(old.id);
    expect(list[0].sheetTs).toBe(TS);
  });

  it("modificato su un altro dispositivo: si prendono i campi della riga", () => {
    savedPatients.set([local()]);
    const r = remoteOf(local(), { trials: ["TENACITY"], updatedAt: "2026-11-11T09:00:00.000Z" });
    r.snapshot = { ...r.snapshot, studies: ["TENACITY"], outcomes: { TENACITY: "intervention" } };
    mergeRemote([r]);
    const [p] = get(savedPatients);
    expect(p.trials).toEqual(["TENACITY"]);
    expect(p.snapshot.outcomes).toEqual({ TENACITY: "intervention" });
    expect(p.patientId).toBe("2025-00123");
  });
});
