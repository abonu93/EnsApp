/**
 * Maschera il numero paziente per la condivisione (WhatsApp / copia).
 * Lascia visibili le ultime 3 cifre e sostituisce le altre con "x".
 * Esempi:
 *   "2025-00123" -> "xxxxxxx123"
 *   "12"         -> "12"   (<= 3 caratteri: niente da mascherare)
 * NB: usato solo nei messaggi condivisi. Nel DB/foglio resta il valore pieno.
 */
export function maskPatientId(id: string | undefined | null): string {
  if (!id) return "";
  const VISIBLE = 3;
  if (id.length <= VISIBLE) return id;
  return "x".repeat(id.length - VISIBLE) + id.slice(-VISIBLE);
}
