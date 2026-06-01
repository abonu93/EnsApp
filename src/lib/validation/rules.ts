// Regole di validazione atomiche. Una rule ritorna `null` se valido,
// altrimenti un messaggio d'errore localizzato.

export type ValidationRule<T> = (value: T) => string | null;

export const required =
  <T>(message = "Campo obbligatorio"): ValidationRule<T> =>
  (value) => {
    if (value === null || value === undefined) return message;
    if (typeof value === "string" && value.trim() === "") return message;
    if (Array.isArray(value) && value.length === 0) return message;
    return null;
  };

export const min =
  (n: number, message?: string): ValidationRule<number | null> =>
  (value) => {
    if (value === null || value === undefined) return null;
    if (value < n) return message ?? `Valore minimo ${n}`;
    return null;
  };

export const max =
  (n: number, message?: string): ValidationRule<number | null> =>
  (value) => {
    if (value === null || value === undefined) return null;
    if (value > n) return message ?? `Valore massimo ${n}`;
    return null;
  };

export const range = (
  lo: number,
  hi: number,
  message?: string
): ValidationRule<number | null> => (value) => {
  if (value === null || value === undefined) return null;
  if (value < lo || value > hi) return message ?? `Valore fra ${lo} e ${hi}`;
  return null;
};

export const integer =
  (message = "Valore intero richiesto"): ValidationRule<number | null> =>
  (value) => {
    if (value === null || value === undefined) return null;
    if (!Number.isInteger(value)) return message;
    return null;
  };
