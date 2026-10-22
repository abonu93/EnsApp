// Piu' pazienti in contemporanea sullo stesso dispositivo. Il paziente
// "attivo" vive negli store di sempre (preData, postData, hemData, selezione):
// gli altri sono messi da parte qui, con la loro condivisione live, e si
// riprendono scambiandoli con quello attivo.

import { derived, get } from "svelte/store";
import { persisted } from "./persistence";
import { clearPatient, hasPatientInProgress, hemData, postData, preData, type HemData, type PostData, type PreData } from "./patient";
import { clearSelection, notesText, selectedChronic, selectedStudies, studyOutcomes } from "./trialSelection";
import { liveLocal, restoreLive, type LiveLocal } from "./liveBoard";

const TTL_24H = 24 * 60 * 60 * 1000;

export interface PatientSession {
  key: string;
  parkedAt: number;
  pre: PreData;
  post: PostData;
  hem: HemData;
  studies: string[];
  outcomes: Record<string, "intervention" | "control">;
  chronic: string[];
  notes: string;
  live: LiveLocal | null;
}

export const parkedSessions = persisted<PatientSession[]>({
  key: "ensapp:sessions:v1",
  initial: [],
  ttlMs: TTL_24H,
  validate: (raw) => (Array.isArray(raw) ? (raw as PatientSession[]).filter((s) => s && typeof s.key === "string" && s.pre) : []),
});

/** Id degli stroke code condivisi che sono gia' su questo dispositivo. */
export const localLiveIds = derived([parkedSessions, liveLocal], ([$p, $l]) => {
  const ids = new Set($p.map((s) => s.live?.id).filter((x): x is string => !!x));
  if ($l) ids.add($l.id);
  return ids;
});

const newKey = () => `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function snapshot(): PatientSession {
  return {
    key: newKey(),
    parkedAt: Date.now(),
    pre: { ...get(preData) },
    post: { ...get(postData) },
    hem: { ...get(hemData) },
    studies: [...get(selectedStudies)],
    outcomes: { ...get(studyOutcomes) },
    chronic: [...get(selectedChronic)],
    notes: get(notesText),
    live: get(liveLocal),
  };
}

/** Mette da parte il paziente attivo (se c'e') e lascia gli store vuoti. */
export function parkCurrent(): void {
  if (get(hasPatientInProgress)) parkedSessions.update((list) => [snapshot(), ...list]);
  // Prima di svuotare: la condivisione resta nel paziente messo da parte.
  liveLocal.set(null);
  clearPatient();
  clearSelection();
}

/** Riprende un paziente messo da parte; quello attivo prende il suo posto. */
export function resumeSession(key: string): void {
  const s = get(parkedSessions).find((x) => x.key === key);
  if (!s) return;
  parkedSessions.update((list) => list.filter((x) => x.key !== key));
  parkCurrent();
  preData.set({ ...s.pre });
  postData.set({ ...s.post });
  hemData.set({ ...s.hem });
  selectedStudies.set([...s.studies]);
  studyOutcomes.set({ ...s.outcomes });
  selectedChronic.set([...s.chronic]);
  notesText.set(s.notes);
  restoreLive(s.live);
}

/** Toglie un paziente messo da parte (per i colleghi lo stroke code resta aperto). */
export function discardSession(key: string): void {
  parkedSessions.update((list) => list.filter((x) => x.key !== key));
}
