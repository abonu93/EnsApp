// Stroke code condiviso: chiavi piatte senza ID paziente e CIP, unione campo
// per campo con l'ora di modifica.

import { describe, test, expect } from "vitest";
import { applyLive, changedKeys, flattenLive, newerRemote } from "$lib/domain/live-board";

const src = {
  pre: { patientId: "12345678", cip: "ROCA0480512001", age: 64, nihss: 8, antithrombotics: [] as string[] },
  post: { strokeType: "ischemic", aspects: 8 },
  hem: {},
  studies: ["ATHENA"],
};

describe("live board", () => {
  test("ID paziente e CIP non escono, i vuoti nemmeno", () => {
    const flat = flattenLive(src);
    expect(flat).toEqual({ "pre.age": 64, "pre.nihss": 8, "post.strokeType": "ischemic", "post.aspects": 8, "sel.studies": ["ATHENA"] });
    expect(JSON.stringify(flat)).not.toContain("ROCA");
    expect(JSON.stringify(flat)).not.toContain("12345678");
  });

  test("campi cambiati, anche tolti", () => {
    expect(changedKeys({ "pre.age": 64, "pre.nihss": 8 }, { "pre.age": 65, "post.aspects": 7 }).sort()).toEqual([
      "post.aspects",
      "pre.age",
      "pre.nihss",
    ]);
  });

  test("vince l'ora piu' recente; i campi locali sono ignorati", () => {
    const remote = { "pre.age": { v: 70, t: 200 }, "pre.nihss": { v: 3, t: 50 }, "pre.cip": { v: "X", t: 999 } };
    expect(newerRemote(remote, { "pre.age": 100, "pre.nihss": 100 })).toEqual({ "pre.age": { v: 70, t: 200 } });
  });

  test("applica valori e cancellazioni, tiene i campi locali", () => {
    const next = applyLive(src, { "pre.nihss": { v: null, t: 1 }, "post.aspects": { v: 6, t: 1 }, "sel.studies": { v: [], t: 1 } });
    expect(next.pre).toEqual({ patientId: "12345678", cip: "ROCA0480512001", age: 64, antithrombotics: [] });
    expect(next.post.aspects).toBe(6);
    expect(next.studies).toEqual([]);
  });
});
