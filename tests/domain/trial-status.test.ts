import { describe, it, expect } from "vitest";
import { TRIALS_INFO, isTrialOpen, findTrialInfo, findTrialKey, randomizationLinks } from "$lib/domain/trials-info";

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

  it("i display name con trattini e spazi trovano la chiave", () => {
    expect(findTrialKey("TWIN-2-WIN 2")).toBe("Twin2Win2");
    expect(findTrialKey("DONE SYMPLE")).toBe("DoneSymple");
    expect(findTrialKey("DO-IT")).toBe("DOIT");
    expect(findTrialKey("TICH-3")).toBe("TICH3");
    expect(findTrialKey("SAFER-DOAC")).toBe("SaferDoac");
    expect(findTrialKey("ORION")).toBe("Orion");
    expect(findTrialKey("")).toBeUndefined();
  });

  it("lo stato dei display name viene rispettato (es. HYBERNIA in pausa)", () => {
    expect(findTrialInfo("TWIN-2-WIN 2")).toBe(TRIALS_INFO.Twin2Win2);
    expect(findTrialInfo("TICH-3")).toBe(TRIALS_INFO.TICH3);
  });

  it("i link di randomizzazione usano le chiavi di TRIALS_INFO", () => {
    for (const k of Object.keys(randomizationLinks)) expect(TRIALS_INFO[k]).toBeDefined();
  });
});

describe("co-arruolamento: DO-IT, REMEDY e SOVATELTIDE esclusivi", () => {
  it("ogni studio del gruppo esclude gli altri due", async () => {
    const { exclusiveWith } = await import("$lib/domain/trials-info");
    expect(exclusiveWith("DO-IT").sort()).toEqual(["REMEDY", "SOVATELTIDE"]);
    expect(exclusiveWith("REMEDY").sort()).toEqual(["DO-IT", "SOVATELTIDE"]);
    expect(exclusiveWith("Sovateltide").sort()).toEqual(["DO-IT", "REMEDY"]);
    expect(exclusiveWith("TENACITY")).toEqual([]);
  });
});
