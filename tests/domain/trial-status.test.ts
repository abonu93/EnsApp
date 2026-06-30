import { describe, it, expect } from "vitest";
import { TRIALS_INFO, isTrialOpen, findTrialInfo } from "$lib/domain/trials-info";

describe("trial recruitment status", () => {
  it("SHIONOGI ha il reclutamento chiuso ma resta nel catalogo", () => {
    expect(TRIALS_INFO.Shionogi).toBeDefined();
    expect(TRIALS_INFO.Shionogi.status).toBe("closed");
  });

  it("isTrialOpen e' false per SHIONOGI (chiave e display name)", () => {
    expect(isTrialOpen("Shionogi")).toBe(false);
    expect(isTrialOpen("SHIONOGI")).toBe(false);
  });

  it("isTrialOpen e' true per i trial attivi", () => {
    expect(isTrialOpen("WeTrust")).toBe(true);
    expect(isTrialOpen("PROMISE")).toBe(true);
  });

  it("isTrialOpen ritorna true (default sicuro) per nomi sconosciuti", () => {
    expect(isTrialOpen("NON_ESISTE")).toBe(true);
  });

  it("findTrialInfo risolve i display name case-insensitive", () => {
    expect(findTrialInfo("shionogi")).toBe(TRIALS_INFO.Shionogi);
    expect(findTrialInfo("zzz")).toBeUndefined();
  });
});
