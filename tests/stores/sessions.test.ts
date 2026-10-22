// Piu' pazienti in contemporanea: il paziente attivo si mette da parte e si
// riprende con tutti i suoi dati, selezione e condivisione comprese.

import { describe, test, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { clearPatient, postData, preData } from "$lib/stores/patient";
import { clearSelection, selectedStudies } from "$lib/stores/trialSelection";
import { liveLocal } from "$lib/stores/liveBoard";
import { discardSession, localLiveIds, parkCurrent, parkedSessions, resumeSession } from "$lib/stores/sessions";

beforeEach(() => {
  liveLocal.set(null);
  parkedSessions.set([]);
  clearPatient();
  clearSelection();
});

describe("sessioni di pazienti", () => {
  test("nuovo paziente: il primo resta da parte, poi si scambiano", () => {
    preData.set({ age: 64, patientId: "111" });
    postData.set({ strokeType: "ischemic" });
    selectedStudies.set(["ATHENA"]);
    parkCurrent();
    expect(get(preData)).toEqual({});
    expect(get(selectedStudies)).toEqual([]);
    expect(get(parkedSessions)).toHaveLength(1);

    preData.set({ age: 80 });
    resumeSession(get(parkedSessions)[0].key);
    expect(get(preData)).toEqual({ age: 64, patientId: "111" });
    expect(get(postData)).toEqual({ strokeType: "ischemic" });
    expect(get(selectedStudies)).toEqual(["ATHENA"]);
    // Quello di prima ora e' da parte.
    expect(get(parkedSessions).map((s) => s.pre)).toEqual([{ age: 80 }]);
  });

  test("board vuoto: niente da mettere da parte", () => {
    parkCurrent();
    expect(get(parkedSessions)).toEqual([]);
  });

  test("la condivisione live segue il paziente", () => {
    preData.set({ age: 64 });
    liveLocal.set({ id: "board-0001", stamps: { "pre.age": 1 }, base: { "pre.age": 64 }, pending: ["pre.age"] });
    parkCurrent();
    expect(get(liveLocal)).toBeNull();
    expect(get(localLiveIds).has("board-0001")).toBe(true);
    resumeSession(get(parkedSessions)[0].key);
    expect(get(liveLocal)).toMatchObject({ id: "board-0001", pending: ["pre.age"] });
    expect(get(preData)).toEqual({ age: 64 });
  });

  test("chiudere un paziente da parte", () => {
    preData.set({ age: 50 });
    parkCurrent();
    discardSession(get(parkedSessions)[0].key);
    expect(get(parkedSessions)).toEqual([]);
  });
});
