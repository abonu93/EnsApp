// Wrapper minimale su IndexedDB per i documenti del chatbot.
// Il testo estratto e l'indice TF-IDF possono superare la quota di localStorage
// (~5MB), quindi vivono qui. I metadati leggeri restano invece in un persisted store.

import type { TfIdfIndex } from "./chunk";

const DB_NAME = "ensapp-chat";
const DB_VERSION = 1;
const STORE_DOCS = "documents";
const STORE_DATA = "docData";

export interface StoredDocMeta {
  docId: string;
  name: string;
  pageCount: number;
  chunkCount: number;
  addedAt: number;
}

export interface StoredDocData {
  docId: string;
  index: TfIdfIndex;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB non disponibile"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DOCS)) {
        db.createObjectStore(STORE_DOCS, { keyPath: "docId" });
      }
      if (!db.objectStoreNames.contains(STORE_DATA)) {
        db.createObjectStore(STORE_DATA, { keyPath: "docId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx<T>(
  storeName: string,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = run(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
      })
  );
}

export function putDocMeta(meta: StoredDocMeta): Promise<IDBValidKey> {
  return tx(STORE_DOCS, "readwrite", (s) => s.put(meta));
}

export function listDocMeta(): Promise<StoredDocMeta[]> {
  return tx<StoredDocMeta[]>(STORE_DOCS, "readonly", (s) => s.getAll());
}

export function putDocData(data: StoredDocData): Promise<IDBValidKey> {
  return tx(STORE_DATA, "readwrite", (s) => s.put(data));
}

export function getDocData(docId: string): Promise<StoredDocData | undefined> {
  return tx<StoredDocData | undefined>(STORE_DATA, "readonly", (s) => s.get(docId));
}

export async function deleteDoc(docId: string): Promise<void> {
  await tx(STORE_DOCS, "readwrite", (s) => s.delete(docId));
  await tx(STORE_DATA, "readwrite", (s) => s.delete(docId));
}
