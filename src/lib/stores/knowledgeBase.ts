// Base di conoscenza condivisa: indice TF-IDF dei protocolli, preparato
// dall'admin e pubblicato come file statico public/protocols-index.json.
// Gli utenti normali non caricano nulla: l'app legge questo file e ci cerca dentro.

import { writable, get } from "svelte/store";
import { retrieve, type TfIdfIndex, type RetrievedChunk } from "$lib/chat/chunk";

export type KbStatus = "idle" | "loading" | "ready" | "empty" | "error";

export const kbStatus = writable<KbStatus>("idle");
export const kbDocNames = writable<string[]>([]);

interface KbFile {
  version?: number;
  builtAt?: number;
  docNames?: string[];
  index: TfIdfIndex;
}

let kbIndex: TfIdfIndex | null = null;

/** Carica la base di conoscenza dal file statico (una sola volta). */
export async function loadKnowledgeBase(): Promise<void> {
  if (kbIndex || get(kbStatus) === "loading") return;
  kbStatus.set("loading");
  try {
    const url = `${import.meta.env.BASE_URL}protocols-index.json`;
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      kbStatus.set("empty");
      return;
    }
    const data = (await res.json()) as KbFile;
    const index = data?.index;
    if (!index || !Array.isArray(index.chunks) || index.n === 0) {
      kbStatus.set("empty");
      return;
    }
    kbIndex = index;
    kbDocNames.set(data.docNames ?? []);
    kbStatus.set("ready");
  } catch {
    kbStatus.set("error");
  }
}

/**
 * Recupera i top-k frammenti rilevanti dalla base di conoscenza.
 * Se nessun match lessicale (domanda generica/altra lingua), ripiega
 * sull'inizio dei protocolli per dare comunque contesto al modello.
 */
export async function retrieveContext(query: string, k = 14): Promise<RetrievedChunk[]> {
  if (!kbIndex) return [];
  const results = retrieve(query, kbIndex, k);
  if (results.length > 0) return results;
  return kbIndex.chunks.slice(0, k).map((c) => ({ ...c, score: 0 }));
}
