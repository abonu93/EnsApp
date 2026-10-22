// Condivisione del pre-arrivo: si invia solo con lo script nuovo, la lista
// mostra i pazienti degli altri, e un nostro paziente chiuso altrove si chiude.

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "svelte/store";
import {
  arrivePreArrival,
  preArrival,
  refreshShared,
  savePreArrival,
  shareSupported,
  sharedIncoming,
} from "$lib/stores/preArrival";
import type { PreArrival } from "$lib/domain/pre-arrival";

const NOW = Date.now();
const base: PreArrival = {
  cip: "ROCA0480512001",
  age: 80,
  anti: ["doac"],
  clock: { mode: "known", at: NOW - 3_600_000, found: null },
  eta: 10,
  arriveAt: NOW + 600_000,
};
const row = (over: Record<string, unknown>) => ({
  id: "remote-0001",
  updatedAt: new Date(NOW).toISOString(),
  status: "incoming",
  age: 70,
  premrs: "",
  race: 6,
  anti: "",
  clockMode: "known",
  at: new Date(NOW - 7_200_000).toISOString(),
  found: "",
  arriveAt: new Date(NOW + 1_200_000).toISOString(),
  eta: 20,
  ...over,
});

let items: unknown;
let posts: Record<string, unknown>[];
const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  preArrival.clear();
  shareSupported.set(null);
  sharedIncoming.set([]);
  posts = [];
  items = { v: 1, items: [] };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === "POST") {
        posts.push(JSON.parse(new URLSearchParams(String(init.body)).get("payload")!));
        return new Response("", { status: 200 });
      }
      return new Response(JSON.stringify(items), { status: 200 });
    })
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("condivisione pre-arrivo", () => {
  test("script vecchio: niente invio", async () => {
    items = [];
    savePreArrival(base);
    await flush();
    await flush();
    expect(get(shareSupported)).toBe(false);
    expect(posts).toEqual([]);
    expect(get(preArrival)?.id).toBeTruthy();
  });

  test("script nuovo: salvataggio e arrivo inviati, senza CIP", async () => {
    savePreArrival(base);
    await vi.waitFor(() => expect(posts.length).toBe(1));
    expect(posts[0]).toMatchObject({ kind: "prearrival", status: "incoming", age: 80, anti: "doac" });
    expect(JSON.stringify(posts[0])).not.toContain("ROCA");
    const p = get(preArrival)!;
    arrivePreArrival(p);
    await vi.waitFor(() => expect(posts.length).toBe(2));
    expect(posts[1]).toMatchObject({ id: p.id, status: "arrived" });
  });

  test("lista: solo gli altri in arrivo, ultima versione", async () => {
    items = {
      v: 1,
      items: [
        row({}),
        row({ id: "remote-0002", status: "incoming" }),
        row({ id: "remote-0002", status: "arrived", updatedAt: new Date(NOW + 1000).toISOString() }),
      ],
    };
    await refreshShared();
    expect(get(sharedIncoming).map((s) => s.id)).toEqual(["remote-0001"]);
    expect(get(sharedIncoming)[0]).toMatchObject({ age: 70, race: 6, eta: 20 });
  });

  test("il nostro chiuso da un collega si chiude anche qui", async () => {
    preArrival.set({ ...base, id: "local-00001", updatedAt: NOW - 1000 });
    items = { v: 1, items: [row({ id: "local-00001", status: "arrived" })] };
    await refreshShared();
    expect(get(preArrival)).toBeNull();
  });

  test("modificato da un collega: si aggiorna e tiene il CIP locale", async () => {
    preArrival.set({ ...base, id: "local-00001", updatedAt: NOW - 1000 });
    items = { v: 1, items: [row({ id: "local-00001", age: 81 })] };
    await refreshShared();
    expect(get(preArrival)).toMatchObject({ id: "local-00001", age: 81, cip: "ROCA0480512001" });
    expect(get(sharedIncoming)).toEqual([]);
  });
});
