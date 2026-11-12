// Revisione dei protocolli: stato e nota per ogni punto (protocol-review.ts).
// Salvata sul dispositivo e, se lo script del foglio ha la scheda "Review",
// condivisa con il team: per ogni punto vince la modifica piu' recente.

import { get, writable } from "svelte/store";
import { persisted } from "./persistence";
import {
  fetchReviews,
  mergeReviews,
  REVIEW_BY_MAX,
  REVIEW_NOTE_MAX,
  REVIEW_STATUSES,
  sendReview,
  type ReviewMark,
  type ReviewStatus,
} from "$lib/domain/protocol-review";

const POLL_MS = 30_000;

function validMarks(raw: unknown): Record<string, ReviewMark> | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const out: Record<string, ReviewMark> = {};
  for (const [id, m] of Object.entries(raw as Record<string, Partial<ReviewMark>>)) {
    if (m && REVIEW_STATUSES.includes(m.status as ReviewStatus) && typeof m.t === "number") {
      out[id] = { status: m.status as ReviewStatus, note: String(m.note ?? ""), by: String(m.by ?? ""), t: m.t };
    }
  }
  return out;
}

export const reviewMarks = persisted<Record<string, ReviewMark>>({
  key: "ensapp:review:v1",
  initial: {},
  validate: validMarks,
});

/** Punti modificati qui e non ancora inviati al foglio. */
const unsent = persisted<string[]>({
  key: "ensapp:review-unsent:v1",
  initial: [],
  validate: (raw) => (Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : null),
});

/** Nome o iniziali di chi rivede (solo su questo dispositivo). */
export const reviewer = persisted<string>({
  key: "ensapp:reviewer:v1",
  initial: "",
  validate: (raw) => (typeof raw === "string" ? raw.slice(0, REVIEW_BY_MAX) : null),
});

/** null = non ancora verificato; false = script senza revisione condivisa (solo locale). */
export const reviewShared = writable<boolean | null>(null);

async function flush(): Promise<void> {
  const ids = get(unsent);
  if (!ids.length || get(reviewShared) !== true) return;
  const marks = get(reviewMarks);
  const sent: string[] = [];
  for (const id of ids) {
    const m = marks[id];
    if (!m || (await sendReview(id, m))) sent.push(id);
  }
  unsent.update((l) => l.filter((id) => !sent.includes(id)));
}

export async function refreshReviews(): Promise<void> {
  const r = await fetchReviews();
  if (!r.ok) return;
  reviewShared.set(r.supported);
  if (!r.supported) return;
  reviewMarks.update((local) => mergeReviews(local, r.marks));
  await flush();
}

export function setReview(id: string, patch: Partial<Pick<ReviewMark, "status" | "note">>): void {
  const prev = get(reviewMarks)[id];
  const next: ReviewMark = {
    status: patch.status ?? prev?.status ?? "pending",
    note: (patch.note ?? prev?.note ?? "").slice(0, REVIEW_NOTE_MAX),
    by: get(reviewer).trim().slice(0, REVIEW_BY_MAX),
    t: Date.now(),
  };
  reviewMarks.update((m) => ({ ...m, [id]: next }));
  unsent.update((l) => (l.includes(id) ? l : [...l, id]));
  void flush();
}

let watchers = 0;
let timer: ReturnType<typeof setInterval> | null = null;

/** Da chiamare in un $effect della pagina: aggiorna ogni 30 s finche' e' aperta. */
export function watchReviews(): () => void {
  watchers++;
  if (watchers === 1) {
    void refreshReviews();
    timer = setInterval(() => void refreshReviews(), POLL_MS);
  }
  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    watchers--;
    if (watchers === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
