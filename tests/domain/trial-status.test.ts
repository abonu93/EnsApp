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
    expect(isTrialOpen("ATHENA")).toBe(true);
    expect(isTrialOpen("PIVOTAL")).toBe(true);
  });

  it("stati allineati al foglio 'Esquema ensayos' (set. 2026)", () => {
    expect(TRIALS_INFO.MOSTE.status).toBe("closed");
    expect(TRIALS_INFO.ARTEMIS.status).toBe("closed");
    expect(TRIALS_INFO.Librexia.status).toBe("closed");
    expect(TRIALS_INFO.ATHENA.status).toBe("active");
    expect(TRIALS_INFO.PIVOTAL.status).toBe("active");
    expect(TRIALS_INFO.PROMISE.status).toBe("paused");
  });

  it("isTrialOpen e' false per i trial chiusi e in pausa", () => {
    expect(isTrialOpen("MOSTE")).toBe(false);
    expect(isTrialOpen("ARTEMIS")).toBe(false);
    expect(isTrialOpen("LIBREXIA")).toBe(false);
    expect(isTrialOpen("PROMISE")).toBe(false);
    expect(isTrialOpen("HYBERNIA")).toBe(false);
  });

  it("isTrialOpen ritorna true (default sicuro) per nomi sconosciuti", () => {
    expect(isTrialOpen("NON_ESISTE")).toBe(true);
  });

  it("findTrialInfo risolve i display name case-insensitive", () => {
    expect(findTrialInfo("shionogi")).toBe(TRIALS_INFO.Shionogi);
    expect(findTrialInfo("zzz")).toBeUndefined();
  });
});
