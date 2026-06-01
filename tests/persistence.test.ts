import { describe, test, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { persisted } from "$lib/stores/persistence";

beforeEach(() => {
  window.localStorage.clear();
});

describe("persisted store", () => {
  test("reads initial when storage empty", () => {
    const s = persisted({ key: "test:a", initial: { count: 0 } });
    expect(get(s)).toEqual({ count: 0 });
  });

  test("writes to localStorage on update", () => {
    const s = persisted({ key: "test:b", initial: 0 });
    s.set(42);
    const raw = window.localStorage.getItem("test:b");
    expect(raw).not.toBeNull();
    const envelope = JSON.parse(raw!);
    expect(envelope.data).toBe(42);
    expect(envelope.v).toBe(1);
  });

  test("restores from localStorage on next mount", () => {
    const s1 = persisted({ key: "test:c", initial: { n: 0 } });
    s1.set({ n: 7 });
    const s2 = persisted({ key: "test:c", initial: { n: 0 } });
    expect(get(s2)).toEqual({ n: 7 });
  });

  test("clear() removes from storage and resets to initial", () => {
    const s = persisted({ key: "test:d", initial: "x" });
    s.set("y");
    s.clear();
    expect(get(s)).toBe("x");
    expect(window.localStorage.getItem("test:d")).toBeNull();
  });

  test("TTL: discards expired payload and reinitializes", () => {
    const expired = { v: 1, ts: Date.now() - 1000 * 60 * 60 * 25, data: "old" };
    window.localStorage.setItem("test:ttl", JSON.stringify(expired));
    const s = persisted({
      key: "test:ttl",
      initial: "fresh",
      ttlMs: 24 * 60 * 60 * 1000,
    });
    expect(get(s)).toBe("fresh");
    // dopo init lo store riscrive l'iniziale via subscribe: il vecchio payload non c'e' piu'
    const raw = window.localStorage.getItem("test:ttl");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).data).toBe("fresh");
  });

  test("schema version mismatch falls back to initial", () => {
    const oldFmt = { v: 0, ts: Date.now(), data: "ignore-me" };
    window.localStorage.setItem("test:ver", JSON.stringify(oldFmt));
    const s = persisted({ key: "test:ver", initial: "new" });
    expect(get(s)).toBe("new");
  });
});
