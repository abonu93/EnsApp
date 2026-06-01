// Crea uno store writable sincronizzato con localStorage.
// Versionato per migrazioni future (es: "ensapp:patient:v1").
// Se lo storage non e' disponibile (SSR / privacy mode), funziona in-memory.

import { writable, type Writable } from "svelte/store";

export interface PersistedStoreOptions<T> {
  key: string;
  initial: T;
  /** Validatore: ritorna null se il payload e' corrotto/da scartare. */
  validate?: (raw: unknown) => T | null;
  /** TTL in ms; oltre, il valore viene scartato. Omesso = nessun TTL. */
  ttlMs?: number;
}

interface Envelope<T> {
  v: number;
  ts: number;
  data: T;
}

const SCHEMA_VERSION = 1;

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const t = "__ensapp_probe__";
    window.localStorage.setItem(t, t);
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

const storageOK = isStorageAvailable();

function readFromStorage<T>(opts: PersistedStoreOptions<T>): T {
  if (!storageOK) return opts.initial;
  try {
    const raw = window.localStorage.getItem(opts.key);
    if (!raw) return opts.initial;
    const envelope = JSON.parse(raw) as Envelope<unknown>;
    if (envelope.v !== SCHEMA_VERSION) return opts.initial;
    if (opts.ttlMs && Date.now() - envelope.ts > opts.ttlMs) {
      window.localStorage.removeItem(opts.key);
      return opts.initial;
    }
    if (opts.validate) {
      const valid = opts.validate(envelope.data);
      return valid ?? opts.initial;
    }
    return envelope.data as T;
  } catch {
    return opts.initial;
  }
}

export function persisted<T>(opts: PersistedStoreOptions<T>): Writable<T> & { clear: () => void } {
  const store = writable<T>(readFromStorage(opts));

  if (storageOK) {
    store.subscribe((value) => {
      try {
        const envelope: Envelope<T> = { v: SCHEMA_VERSION, ts: Date.now(), data: value };
        window.localStorage.setItem(opts.key, JSON.stringify(envelope));
      } catch {
        // quota piena o storage rotto: ignora silenziosamente
      }
    });
  }

  return {
    ...store,
    clear() {
      store.set(opts.initial);
      if (storageOK) {
        try {
          window.localStorage.removeItem(opts.key);
        } catch {
          // ignora
        }
      }
    },
  };
}
