import { describe, it, expect } from "vitest";
import { maskPatientId } from "$lib/utils/mask";

describe("maskPatientId", () => {
  it("lascia visibili solo le ultime 3 cifre", () => {
    expect(maskPatientId("2025-00123")).toBe("xxxxxxx123");
    expect(maskPatientId("987654")).toBe("xxx654");
  });

  it("non maschera valori di 3 o meno caratteri", () => {
    expect(maskPatientId("123")).toBe("123");
    expect(maskPatientId("12")).toBe("12");
  });

  it("gestisce input vuoto / mancante", () => {
    expect(maskPatientId("")).toBe("");
    expect(maskPatientId(undefined)).toBe("");
    expect(maskPatientId(null)).toBe("");
  });

  it("preserva la lunghezza dell'identificativo", () => {
    const id = "AB-2025-000999";
    expect(maskPatientId(id)).toHaveLength(id.length);
    expect(maskPatientId(id).endsWith("999")).toBe(true);
  });
});
