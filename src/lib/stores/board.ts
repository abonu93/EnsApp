// Bedside Board: stato derivato dagli store del paziente. Il board non ha
// dati suoi: legge e scrive preData/postData/hemData, cosi' quanto inserito
// qui vale anche per il flusso guidato (Summary, Share) e viceversa.

import { derived } from "svelte/store";
import { preData, postData, hemData, acuteInput, hemInput, now } from "./patient";
import { CLOCK, FIELD_BY_KEY, isMissing, judgeBoard } from "$lib/domain/board";

export type ClockMode = "known" | "wakeup";

export interface BoardClock {
  mode: ClockMode;
  /** Ultima volta visto bene / esordio (ms), null se non inserito. */
  at: number | null;
  /** Risveglio: ora in cui e' stato trovato con i sintomi (ms). */
  found: number | null;
}

const parse = (iso: string | undefined): number | null => {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
};

/** "YYYY-MM-DDTHH:MM" in ora locale, come DateTimeField / CalendarSheet. */
export function toLocalIso(ms: number): string {
  const d = new Date(ms);
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export const boardClock = derived(preData, ($pre): BoardClock => ({
  mode: $pre.wakeupStroke ? "wakeup" : "known",
  at: parse($pre.ltswDate),
  found: $pre.wakeupStroke ? parse($pre.discoveryDate) : null,
}));

/** Tutti i valori del paziente in un solo oggetto (per la griglia e i fogli). */
export const boardValues = derived([preData, postData, hemData], ([$pre, $post, $hem]) => ({
  ...$pre,
  ...$post,
  ...$hem,
}) as Record<string, unknown>);

export const boardResult = derived(
  [acuteInput, hemInput, postData, preData],
  ([$acute, $hem, $post, $pre]) =>
    judgeBoard({
      acute: $acute,
      hem: $hem,
      strokeType: $post.strokeType,
      clockSet: !!$pre.ltswDate || typeof $pre.ltsw === "number",
    })
);

/** Minuti dall'ultima volta visto bene, aggiornati con l'orologio dell'app. */
export const boardElapsedMin = derived([boardClock, now], ([$c, $now]) =>
  $c.at == null ? null : ($now - $c.at) / 60_000
);

/** Imposta (o cancella con undefined) un dato nello store a cui appartiene. */
export function setBoardField(key: string, value: unknown): void {
  const field = FIELD_BY_KEY[key];
  if (!field || key === CLOCK) return;
  const store = field.store === "pre" ? preData : field.store === "post" ? postData : hemData;
  (store as typeof postData).update((s) => {
    const next = { ...s } as Record<string, unknown>;
    if (isMissing(value)) delete next[key];
    else next[key] = value;
    // LVO segue la candidatura EVT, come in PostImaging.svelte.
    if (key === "candidate") {
      if (value === "eligible") next.lvo = "yes";
      else if (value === "not eligible") next.lvo = "no";
      else delete next.lvo;
    }
    return next as typeof s;
  });
}

/** Scrive l'orologio negli stessi campi di PreImaging (ltswDate, wakeupStroke, discoveryDate). */
export function setBoardClock(c: BoardClock): void {
  preData.update((s) => {
    const next = { ...s };
    next.ltswDate = c.at != null ? toLocalIso(c.at) : undefined;
    next.wakeupStroke = c.mode === "wakeup";
    next.discoveryDate = c.mode === "wakeup" && c.found != null ? toLocalIso(c.found) : undefined;
    if (c.mode !== "wakeup") delete next.wakeupSymptomsWithin6h;
    // Il valore in ore (pazienti ricaricati dal foglio) non deve prevalere.
    if (c.at != null) delete next.ltsw;
    return next;
  });
}
