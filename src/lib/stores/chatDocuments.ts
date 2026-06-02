// Store dei documenti (PDF) caricati dall'utente: la "memoria" del chatbot.
// I metadati leggeri (nome, stato) stanno qui e in un persisted store per
// sopravvivere al reload; testo estratto e indice TF-IDF vivono in IndexedDB.

import { writable, get } from "svelte/store";
import { persisted } from "./persistence";
import { extractPdfText } from "$lib/chat/pdf";
import { chunkPages, buildIndex, mergeIndexes, retrieve, type TfIdfIndex } from "$lib/chat/chunk";
import type { RetrievedChunk } from "$lib/chat/chunk";
import {
  putDocMeta,
  putDocData,
  getDocData,
  deleteDoc as idbDeleteDoc,
  listDocMeta,
} from "$lib/chat/idb";

export type DocStatus = "extracting" | "indexing" | "ready" | "error";

export interface ChatDocument {
  docId: string;
  name: string;
  status: DocStatus;
  pageCount: number;
  chunkCount: number;
}

function isDoc(d: unknown): d is ChatDocument {
  if (!d || typeof d !== "object") return false;
  const x = d as Record<string, unknown>;
  return typeof x.docId === "string" && typeof x.name === "string";
}

// Lista persistita (solo metadati). Gli stati transitori (extracting/indexing)
// vengono normalizzati a "ready" al reload: i dati sono gia' in IndexedDB.
const persistedDocs = persisted<ChatDocument[]>({
  key: "ensapp:chatdocs:v1",
  initial: [],
  validate: (raw) =>
    Array.isArray(raw) && raw.every(isDoc)
      ? (raw as ChatDocument[]).map((d) => ({
          ...d,
          status: d.status === "error" ? "error" : "ready",
        }))
      : null,
});

export const chatDocuments = persistedDocs;

// Cache in-memory degli indici per evitare riletture continue da IndexedDB.
const indexCache = new Map<string, TfIdfIndex>();

function newDocId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function patchDoc(docId: string, patch: Partial<ChatDocument>): void {
  persistedDocs.update((list) =>
    list.map((d) => (d.docId === docId ? { ...d, ...patch } : d))
  );
}

/** Estrae, chunk-a, indicizza e persiste un PDF caricato dall'utente. */
export async function addDocument(file: File): Promise<void> {
  const docId = newDocId();
  const name = file.name.replace(/\.pdf$/i, "");

  persistedDocs.update((list) => [
    ...list,
    { docId, name, status: "extracting", pageCount: 0, chunkCount: 0 },
  ]);

  try {
    const pages = await extractPdfText(file);
    if (pages.length === 0) {
      patchDoc(docId, { status: "error" });
      return;
    }
    patchDoc(docId, { status: "indexing", pageCount: pages.length });

    const chunks = chunkPages(docId, name, pages);
    const index = buildIndex(chunks);

    await putDocData({ docId, index });
    await putDocMeta({
      docId,
      name,
      pageCount: pages.length,
      chunkCount: chunks.length,
      addedAt: Date.now(),
    });

    indexCache.set(docId, index);
    patchDoc(docId, { status: "ready", chunkCount: chunks.length });
  } catch (e) {
    console.warn("addDocument error:", e);
    patchDoc(docId, { status: "error" });
  }
}

export async function removeDocument(docId: string): Promise<void> {
  indexCache.delete(docId);
  persistedDocs.update((list) => list.filter((d) => d.docId !== docId));
  try {
    await idbDeleteDoc(docId);
  } catch (e) {
    console.warn("removeDocument error:", e);
  }
}

async function indexFor(docId: string): Promise<TfIdfIndex | null> {
  const cached = indexCache.get(docId);
  if (cached) return cached;
  const data = await getDocData(docId);
  if (!data) return null;
  indexCache.set(docId, data.index);
  return data.index;
}

/**
 * Recupera i top-k chunk rilevanti su tutti i documenti pronti.
 * E' la fase di "retrieval" del RAG: il risultato va inviato al modello.
 */
export async function retrieveContext(query: string, k = 14): Promise<RetrievedChunk[]> {
  const ready = get(persistedDocs).filter((d) => d.status === "ready");
  const indexes: TfIdfIndex[] = [];
  for (const doc of ready) {
    const idx = await indexFor(doc.docId);
    if (idx) indexes.push(idx);
  }
  if (indexes.length === 0) return [];
  const merged = mergeIndexes(indexes);
  const results = retrieve(query, merged, k);
  if (results.length > 0) return results;
  // Fallback: nessun match lessicale (domanda generica, di sintesi, o in una
  // lingua diversa dal PDF). Invia l'inizio dei documenti (titolo/abstract/
  // introduzione) cosi' il modello ha comunque contesto su cui rispondere.
  return merged.chunks.slice(0, k).map((c) => ({ ...c, score: 0 }));
}

/**
 * Indice unito di tutti i documenti pronti, con i nomi. Usato dalla pagina
 * admin per esportare la base di conoscenza (public/protocols-index.json).
 */
export async function exportMergedIndex(): Promise<{ index: TfIdfIndex; docNames: string[] } | null> {
  const ready = get(persistedDocs).filter((d) => d.status === "ready");
  const indexes: TfIdfIndex[] = [];
  for (const doc of ready) {
    const idx = await indexFor(doc.docId);
    if (idx) indexes.push(idx);
  }
  if (indexes.length === 0) return null;
  return { index: mergeIndexes(indexes), docNames: ready.map((d) => d.name) };
}

/** Riallinea la lista persistita con IndexedDB (pulizia metadati orfani). */
export async function reconcileDocuments(): Promise<void> {
  try {
    const metas = await listDocMeta();
    const ids = new Set(metas.map((m) => m.docId));
    persistedDocs.update((list) => list.filter((d) => ids.has(d.docId) || d.status === "error"));
  } catch {
    // IndexedDB non disponibile: lascia invariato
  }
}

export const hasReadyDoc = writable(false);
persistedDocs.subscribe((list) => hasReadyDoc.set(list.some((d) => d.status === "ready")));
