import { describe, test, expect } from "vitest";
import { required, min, max, range, integer } from "$lib/validation/rules";
import { validate, isValid } from "$lib/validation/schema";

describe("validation rules", () => {
  test("required: rejects empty values", () => {
    expect(required()("")).toBe("Campo obbligatorio");
    expect(required()(null as unknown as string)).toBe("Campo obbligatorio");
    expect(required()([])).toBe("Campo obbligatorio");
    expect(required()("ok")).toBe(null);
  });

  test("min / max / range", () => {
    expect(min(18)(17)).toBe("Valore minimo 18");
    expect(min(18)(18)).toBe(null);
    expect(max(80)(81)).toBe("Valore massimo 80");
    expect(range(18, 80)(17)).toMatch(/18.*80/);
    expect(range(18, 80)(50)).toBe(null);
    expect(range(0, 42)(null)).toBe(null); // null e' valido per range
  });

  test("integer", () => {
    expect(integer()(1.5)).toBe("Valore intero richiesto");
    expect(integer()(7)).toBe(null);
  });

  test("validate composes per-field rules and stops at first failure", () => {
    type Form = { age: number | null; nihss: number | null };
    const errors = validate<Form>(
      { age: 15, nihss: null },
      {
        age: [required(), range(18, 100)],
        nihss: [required(), range(0, 42)],
      }
    );
    expect(errors.age).toMatch(/18.*100/);
    expect(errors.nihss).toBe("Campo obbligatorio");
    expect(isValid(errors)).toBe(false);
  });

  test("validate passes when all rules satisfied", () => {
    const errors = validate(
      { age: 65, nihss: 12 },
      {
        age: [required(), range(18, 100)],
        nihss: [required(), range(0, 42)],
      }
    );
    expect(isValid(errors)).toBe(true);
  });
});
