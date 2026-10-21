// Tipo e helper condivisi dai wrapper diagnostici "perche' questo trial NON e'
// eligibile" (acute-reasons.ts, hem-reasons.ts).
// NON contiene logica clinica: colleziona solo i check gia' definiti altrove.

export interface ReasonReport {
  /** Criteri soddisfatti (per audit). */
  meet: string[];
  /** Criteri NON soddisfatti. Lista vuota se il trial e' eligible. */
  fail: string[];
  eligible: boolean;
  /** Tutti i criteri nell'ordine del protocollo (Bedside Board). */
  labels: string[];
}

export interface Check {
  ok: boolean;
  label: string;
}

export function reduce(checks: Check[]): ReasonReport {
  const meet = checks.filter((c) => c.ok).map((c) => c.label);
  const fail = checks.filter((c) => !c.ok).map((c) => c.label);
  return { meet, fail, eligible: fail.length === 0, labels: checks.map((c) => c.label) };
}
