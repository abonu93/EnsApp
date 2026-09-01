import { describe, it, expect } from "vitest";
import {
  TRIALS_INFO,
  isTrialOpen,
  isNonRecruitingStatus,
  findTrialInfo,
} from "$lib/domain/trials-info";

describe("trial recruitment status", () => {
  it("SHIONOGI ha il reclutamento chiuso ma resta nel catalogo", () => {
    expect(TRIALS_INFO.Shionogi).toBeDefined();
    expect(TRIALS_INFO.Shionogi.status).toBe("closed");
  });

  it("MOSTE e Librexia sono inattivi ma restano nel catalogo", () => {
    expect(TRIALS_INFO.MOSTE).toBeDefined();
    expect(TRIALS_INFO.MOSTE.status).toBe("inactive");
    expect(TRIALS_INFO.Librexia).toBeDefined();
    expect(TRIALS_INFO.Librexia.status).toBe("inactive");
  });

  it("isTrialOpen e' false per SHIONOGI (chiave e display name)", () => {
    expect(isTrialOpen("Shionogi")).toBe(false);
    expect(isTrialOpen("SHIONOGI")).toBe(false);
  });

  it("isTrialOpen e' false per i trial inattivi (chiave e display name)", () => {
    expect(isTrialOpen("MOSTE")).toBe(false);
    expect(isTrialOpen("moste")).toBe(false);
    expect(isTrialOpen("Librexia")).toBe(false);
    expect(isTrialOpen("LIBREXIA")).toBe(false);
  });

  it("isTrialOpen e' true per i trial attivi", () => {
    expect(isTrialOpen("WeTrust")).toBe(true);
    expect(isTrialOpen("PROMISE")).toBe(true);
  });

  it("isTrialOpen e' true per i trial in pausa (restano arruolabili)", () => {
    expect(TRIALS_INFO.ATHENA.status).toBe("paused");
    expect(isTrialOpen("ATHENA")).toBe(true);
  });

  it("isTrialOpen ritorna true (default sicuro) per nomi sconosciuti", () => {
    expect(isTrialOpen("NON_ESISTE")).toBe(true);
  });

  it("isNonRecruitingStatus copre closed e inactive", () => {
    expect(isNonRecruitingStatus("closed")).toBe(true);
    expect(isNonRecruitingStatus("inactive")).toBe(true);
    expect(isNonRecruitingStatus("active")).toBe(false);
    expect(isNonRecruitingStatus("paused")).toBe(false);
    expect(isNonRecruitingStatus("post-acute")).toBe(false);
  });

  it("findTrialInfo risolve i display name case-insensitive", () => {
    expect(findTrialInfo("shionogi")).toBe(TRIALS_INFO.Shionogi);
    expect(findTrialInfo("zzz")).toBeUndefined();
  });
});
