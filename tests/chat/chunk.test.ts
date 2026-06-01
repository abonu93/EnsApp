import { describe, test, expect } from "vitest";
import {
  tokenize,
  chunkPages,
  buildIndex,
  retrieve,
  mergeIndexes,
  type PageText,
} from "$lib/chat/chunk";

describe("tokenize", () => {
  test("lowercases, splits on non-alphanumerics, drops short tokens/stopwords", () => {
    const toks = tokenize("The ASPECTS score is 7, and NIHSS!");
    expect(toks).toContain("aspects");
    expect(toks).toContain("score");
    expect(toks).toContain("nihss");
    expect(toks).not.toContain("the"); // stopword
    expect(toks).not.toContain("a"); // troppo corto
  });
});

describe("chunkPages", () => {
  test("keeps a short page as a single chunk and preserves page number", () => {
    const pages: PageText[] = [{ page: 3, text: "Breve testo di protocollo." }];
    const chunks = chunkPages("doc1", "Protocollo", pages);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].page).toBe(3);
    expect(chunks[0].docId).toBe("doc1");
    expect(chunks[0].chunkId).toBe("doc1#0");
  });

  test("splits long pages into overlapping chunks with stable ids", () => {
    const long = "parola ".repeat(400); // ~2800 char
    const chunks = chunkPages("doc1", "P", [{ page: 1, text: long }], 700, 120);
    expect(chunks.length).toBeGreaterThan(1);
    chunks.forEach((c, i) => {
      expect(c.chunkId).toBe(`doc1#${i}`);
      expect(c.text.length).toBeLessThanOrEqual(700);
    });
  });

  test("skips empty pages", () => {
    const chunks = chunkPages("d", "n", [{ page: 1, text: "   " }]);
    expect(chunks).toHaveLength(0);
  });
});

describe("buildIndex", () => {
  test("computes per-chunk tf and global df", () => {
    const chunks = chunkPages("d", "n", [
      { page: 1, text: "trombectomia trombectomia EVT" },
      { page: 2, text: "trombolisi EVT" },
    ]);
    const idx = buildIndex(chunks);
    expect(idx.n).toBe(2);
    expect(idx.tf[0].trombectomia).toBe(2);
    expect(idx.df.evt).toBe(2); // presente in entrambi i chunk
    expect(idx.df.trombolisi).toBe(1);
  });
});

describe("retrieve", () => {
  const pages: PageText[] = [
    { page: 1, text: "Il criterio di inclusione ATHENA richiede ASPECTS maggiore o uguale a 6." },
    { page: 2, text: "Il follow-up prevede una visita a 90 giorni con scala mRS." },
    { page: 3, text: "La randomizzazione avviene tramite app dedicata." },
  ];
  const index = buildIndex(chunkPages("doc", "Protocollo", pages));

  test("returns the chunk containing the answer as top-1", () => {
    const res = retrieve("Qual è il valore ASPECTS per ATHENA?", index);
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].text).toContain("ASPECTS");
    expect(res[0].page).toBe(1);
  });

  test("out-of-corpus query returns no results", () => {
    const res = retrieve("ricetta della carbonara guanciale", index);
    expect(res).toHaveLength(0);
  });

  test("empty index yields no results", () => {
    expect(retrieve("qualsiasi cosa", buildIndex([]))).toHaveLength(0);
  });
});

describe("mergeIndexes", () => {
  test("merges chunks and df across documents", () => {
    const a = buildIndex(chunkPages("a", "A", [{ page: 1, text: "alfa comune" }]));
    const b = buildIndex(chunkPages("b", "B", [{ page: 1, text: "beta comune" }]));
    const merged = mergeIndexes([a, b]);
    expect(merged.n).toBe(2);
    expect(merged.df.comune).toBe(2);
    const res = retrieve("beta", merged);
    expect(res[0].docId).toBe("b");
  });
});
