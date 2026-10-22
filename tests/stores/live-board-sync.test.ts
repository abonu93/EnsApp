// Stroke code condiviso fra due dispositivi simulati: un foglio finto che
// unisce i campi come Code.gs (vince l'ora piu' recente).

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "svelte/store";
import { clearPatient, postData, preData } from "$lib/stores/patient";
import { clearSelection } from "$lib/stores/trialSelection";
import { closeLive, joinLive, liveBoards, liveLocal, liveSupported, pullLive, startLive } from "$lib/stores/liveBoard";

type Field = { v: unknown; t: number };
let rows: Record<string, { id: string; updatedAt: string; status: string; fields: Record<string, Field> }>;
let supported: boolean;

beforeEach(() => {
  rows = {};
  supported = true;
  liveLocal.set(null);
  liveSupported.set(null);
  liveBoards.set([]);
  clearPatient();
  clearSelection();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === "POST") {
        const p = JSON.parse(new URLSearchParams(String(init.body)).get("payload")!);
        const row = rows[p.id] ?? { id: p.id, updatedAt: "", status: "open", fields: {} };
        for (const [k, f] of Object.entries(p.fields as Record<string, Field>)) {
          if (!row.fields[k] || row.fields[k].t < f.t) row.fields[k] = f;
        }
        row.status = p.status === "closed" || row.status === "closed" ? "closed" : "open";
        row.updatedAt = new Date().toISOString();
        rows[p.id] = row;
        return new Response("ok");
      }
      return new Response(JSON.stringify(supported ? { v: 1, items: Object.values(rows) } : []));
    })
  );
});
afterEach(() => vi.unstubAllGlobals());

const sent = () => vi.waitFor(() => expect(get(liveLocal)?.pending ?? []).toEqual([]), { timeout: 3000 });

describe("stroke code condiviso", () => {
  test("script vecchio: niente invio", async () => {
    supported = false;
    preData.set({ age: 64 });
    startLive("board-0001");
    await new Promise((r) => setTimeout(r, 1000));
    expect(get(liveSupported)).toBe(false);
    expect(rows).toEqual({});
  });

  test("due dispositivi modificano campi diversi senza sovrascriversi", async () => {
    // Dispositivo A apre il paziente.
    preData.set({ age: 64, patientId: "12345678", cip: "ROCA0480512001" });
    startLive("board-0001");
    await sent();
    expect(rows["board-0001"].fields["pre.age"].v).toBe(64);
    expect(JSON.stringify(rows)).not.toContain("ROCA");
    expect(JSON.stringify(rows)).not.toContain("12345678");

    // Dispositivo B (stessa memoria, simulato): esce, poi entra dalla lista.
    clearPatient();
    expect(get(liveLocal)).toBeNull();
    await pullLive();
    expect(get(liveBoards).map((r) => r.id)).toEqual(["board-0001"]);
    joinLive(get(liveBoards)[0]);
    expect(get(preData)).toEqual({ age: 64 });

    // B inserisce NIHSS; nel frattempo "A" ha cambiato l'eta' sul foglio.
    await new Promise((r) => setTimeout(r, 5));
    preData.update((p) => ({ ...p, nihss: 8 }));
    rows["board-0001"].fields["pre.age"] = { v: 65, t: Date.now() + 1000 };
    await sent();
    expect(rows["board-0001"].fields["pre.nihss"].v).toBe(8);
    await pullLive();
    expect(get(preData)).toEqual({ age: 65, nihss: 8 });
    // Il campo preso dal foglio non riparte come modifica locale.
    expect(get(liveLocal)?.pending).toEqual([]);

    // Un campo tolto si toglie anche per gli altri.
    postData.set({ strokeType: "ischemic" });
    await sent();
    postData.set({});
    await sent();
    expect(rows["board-0001"].fields["post.strokeType"].v).toBeNull();
  });

  test("registrato: chiuso per tutti", async () => {
    preData.set({ age: 70 });
    startLive("board-0002");
    await sent();
    await pullLive();
    await closeLive();
    expect(rows["board-0002"].status).toBe("closed");
    expect(get(liveLocal)).toBeNull();
    // Chi lo aveva aperto smette di condividerlo.
    liveLocal.set({ id: "board-0002", stamps: {}, base: { "pre.age": 70 }, pending: [] });
    await pullLive();
    expect(get(liveLocal)).toBeNull();
    expect(get(preData)).toEqual({ age: 70 });
    expect(get(liveBoards)).toEqual([]);
  });
});
