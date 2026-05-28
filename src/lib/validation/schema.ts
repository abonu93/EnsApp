// Schema declarativo per form. Compone rules atomiche per ciascun campo.
// L'output `errors` e' { fieldName: messaggio | null }.

import type { ValidationRule } from "./rules";

export type Schema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type Errors<T> = {
  [K in keyof T]?: string;
};

export function validate<T extends object>(
  data: T,
  schema: Schema<T>
): Errors<T> {
  const errors: Errors<T> = {};
  for (const key of Object.keys(schema) as (keyof T)[]) {
    const rules = schema[key] ?? [];
    for (const rule of rules) {
      const err = rule(data[key]);
      if (err !== null) {
        errors[key] = err;
        break;
      }
    }
  }
  return errors;
}

export function isValid<T>(errors: Errors<T>): boolean {
  return Object.values(errors).every((v) => !v);
}
