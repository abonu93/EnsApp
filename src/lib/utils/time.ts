/**
 * Formatta ore decimali in stringa "Xh YYm" (o "YYm" se < 1h).
 * Esempi:
 *   1.5  -> "1h 30m"
 *   0.5  -> "30m"
 *   5.32 -> "5h 19m"
 *   0    -> "0m"
 */
export function fmtHoursAsClock(hours: number | undefined | null): string {
  if (hours == null || Number.isNaN(hours) || hours < 0) return "—";
  const totalMin = Math.round(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}
