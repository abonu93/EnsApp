import { describe, it, expect } from "vitest";
import { OPEN_QUESTIONS, questionsFor, selectionAlerts } from "$lib/domain/open-questions";
import { findTrialKey } from "$lib/domain/trials-info";
import type { AcuteInput } from "$lib/domain/acute-rules";

const patient = (p: Partial<AcuteInput>) =>
  ({ age: 75, nihss: 10, premrs: 1, ltsw: 30, targetVessels: ["m1"], ...p }) as AcuteInput;

describe("dubbi aperti sui protocolli", () => {
  it("ogni dubbio ha id unico e studi presenti nel catalogo", () => {
    const ids = OPEN_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const q of OPEN_QUESTIONS) for (const tr of q.trials) expect(findTrialKey(tr), tr).toBeDefined();
  });

  it("si trovano dal nome del Riepilogo e dalla chiave del catalogo", () => {
    expect(questionsFor("DONE SYMPLE").length).toBeGreaterThan(0);
    expect(questionsFor("DoneSymple")).toEqual(questionsFor("DONE SYMPLE"));
  });

  it("DONE SYMPLE: il dubbio sull'mRS riguarda il paziente di 75 anni con mRS 1", () => {
    const a = selectionAlerts(["DONE SYMPLE"], patient({}));
    const mrs = a.find((x) => x.title.includes("mRS"));
    expect(mrs?.relevant).toBe(true);
    expect(a[0].relevant).toBe(true); // i rilevanti vengono prima
    const young = selectionAlerts(["DONE SYMPLE"], patient({ age: 60 }));
    expect(young.find((x) => x.title.includes("mRS"))?.relevant).toBe(false);
  });

  it("co-arruolamento: avvisa per le coppie non decise, non per il gruppo esclusivo", () => {
    const pair = selectionAlerts(["TENACITY", "DONE SYMPLE"]).filter((x) => x.kind === "coenrolment");
    expect(pair).toHaveLength(1);
    expect(pair[0].relevant).toBe(true);
    const decided = selectionAlerts(["DO-IT", "REMEDY"]).filter((x) => x.kind === "coenrolment");
    expect(decided).toHaveLength(0);
    expect(selectionAlerts(["TICH-3"]).filter((x) => x.kind === "coenrolment")).toHaveLength(0);
    expect(selectionAlerts(["FASTEST", "TICH-3"]).filter((x) => x.kind === "coenrolment")).toHaveLength(1);
  });
});
