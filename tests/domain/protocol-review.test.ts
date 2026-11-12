import { describe, it, expect } from "vitest";
import {
  REVIEW_ITEMS,
  mergeReviews,
  parseReviewRow,
  reviewByTrial,
  statusOf,
  type ReviewMark,
} from "$lib/domain/protocol-review";

const LOCALES = ["es", "ca", "en"] as const;

describe("revisione dei protocolli", () => {
  it("ogni punto ha id unico e testi in tutte le lingue dell'app", () => {
    const ids = REVIEW_ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of REVIEW_ITEMS) {
      expect(item.id).toMatch(/^[a-z0-9-]{3,64}$/);
      for (const l of LOCALES) {
        expect(item.finding[l].trim(), `${item.id} ${l}`).not.toBe("");
        if (item.protocol) expect(item.protocol[l].trim(), `${item.id} ${l}`).not.toBe("");
      }
    }
  });

  it("nessun problema trasversale (credenziali, password)", () => {
    const all = REVIEW_ITEMS.flatMap((i) => [...LOCALES.map((l) => i.finding[l]), ...LOCALES.map((l) => i.protocol?.[l] ?? "")]);
    expect(all.join(" ").toLowerCase()).not.toMatch(/password|contraseña|contrasenya/);
  });

  it("legge le righe del foglio e scarta quelle non valide", () => {
    expect(parseReviewRow({ id: "ten-diabetes", status: "agree", note: "ok", by: "AB", updatedAt: "2026-11-12T10:00:00Z" }))
      .toEqual(["ten-diabetes", { status: "agree", note: "ok", by: "AB", t: Date.parse("2026-11-12T10:00:00Z") }]);
    expect(parseReviewRow({ id: "unknown", status: "agree", updatedAt: "2026-11-12T10:00:00Z" })).toBeNull();
    expect(parseReviewRow({ id: "ten-diabetes", status: "maybe", updatedAt: "2026-11-12T10:00:00Z" })).toBeNull();
    expect(parseReviewRow({ id: "ten-diabetes", status: "done", updatedAt: "" })).toBeNull();
  });

  it("unisce le revisioni: vince la modifica piu' recente", () => {
    const m = (status: ReviewMark["status"], t: number): ReviewMark => ({ status, note: "", by: "", t });
    const merged = mergeReviews({ a: m("agree", 2), b: m("done", 5) }, { a: m("disagree", 3), b: m("pending", 4), c: m("done", 1) });
    expect(merged).toEqual({ a: m("disagree", 3), b: m("done", 5), c: m("done", 1) });
    expect(statusOf(merged, "zzz")).toBe("pending");
  });

  it("raggruppa per studio nell'ordine dell'elenco", () => {
    const groups = reviewByTrial();
    expect(groups[0][0]).toBe("DONE SYMPLE");
    expect(groups.reduce((n, [, items]) => n + items.length, 0)).toBe(REVIEW_ITEMS.length);
  });
});
