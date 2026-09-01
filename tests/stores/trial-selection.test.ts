// Guardie di selezione: i trial non arruolabili (status "closed"/"inactive",
// es. SHIONOGI, MOSTE, Librexia) non devono poter entrare nella selezione
// inviata al Sheet, ne' restarci se disattivati dopo la selezione.

import { describe, it, expect, beforeEach } from "vitest";
import { get } from "svelte/store";
import {
  selectedStudies,
  studyOutcomes,
  selectedChronic,
  toggleStudy,
  pruneUnselectableStudies,
  clearSelection,
} from "$lib/stores/trialSelection";

describe("toggleStudy", () => {
  beforeEach(() => {
    clearSelection();
  });

  it("aggiunge e rimuove un trial arruolabile", () => {
    toggleStudy("WeTrust");
    expect(get(selectedStudies)).toEqual(["WeTrust"]);
    toggleStudy("WeTrust");
    expect(get(selectedStudies)).toEqual([]);
  });

  it("non aggiunge MOSTE ne' Librexia (inattivi)", () => {
    toggleStudy("MOSTE");
    toggleStudy("Librexia");
    expect(get(selectedStudies)).toEqual([]);
  });

  it("non aggiunge SHIONOGI (reclutamento chiuso)", () => {
    toggleStudy("SHIONOGI");
    expect(get(selectedStudies)).toEqual([]);
  });

  it("rimuove comunque un trial non arruolabile gia' selezionato", () => {
    selectedStudies.set(["MOSTE", "WeTrust"]);
    toggleStudy("MOSTE");
    expect(get(selectedStudies)).toEqual(["WeTrust"]);
  });
});

describe("pruneUnselectableStudies", () => {
  beforeEach(() => {
    clearSelection();
  });

  it("scarta i trial disattivati da studies, outcomes e chronic", () => {
    selectedStudies.set(["WeTrust", "MOSTE", "Librexia", "SHIONOGI"]);
    studyOutcomes.set({ WeTrust: "intervention", MOSTE: "control" });
    selectedChronic.set(["Librexia"]);

    pruneUnselectableStudies();

    expect(get(selectedStudies)).toEqual(["WeTrust"]);
    expect(get(studyOutcomes)).toEqual({ WeTrust: "intervention" });
    expect(get(selectedChronic)).toEqual([]);
  });

  it("lascia invariata una selezione gia' valida", () => {
    const studies = ["WeTrust", "PROMISE"];
    selectedStudies.set(studies);
    pruneUnselectableStudies();
    expect(get(selectedStudies)).toBe(studies);
  });
});
