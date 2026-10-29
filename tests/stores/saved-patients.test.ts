import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import { savedPatients, mergeRemote, addSavedPatient, clearSaved, type SavedPatient } from "$lib/stores/savedPatients";

function remote(i: number): SavedPatient {
  return {
    id: "r" + i,
    savedAt: new Date(Date.UTC(2026, 0, 1) + i * 60_000).toISOString(),
    trials: [],
    snapshot: { pre: {}, post: {}, hem: {}, studies: [], outcomes: {}, chronic: [], notes: "", extras: {} },
  } as SavedPatient;
}

describe("savedPatients", () => {
  beforeEach(() => clearSaved());

  it("keeps every remote row, not just the latest 500", () => {
    mergeRemote(Array.from({ length: 750 }, (_, i) => remote(i)));
    expect(get(savedPatients)).toHaveLength(750);
  });

  it("a new local save does not drop remote rows past 500", () => {
    mergeRemote(Array.from({ length: 600 }, (_, i) => remote(i)));
    addSavedPatient({ trials: [], snapshot: remote(0).snapshot });
    expect(get(savedPatients)).toHaveLength(601);
  });
});
