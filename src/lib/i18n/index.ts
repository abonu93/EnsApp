// i18n minimale: store reattivo + funzione t() derived.
// Persistito in localStorage. Default: spagnolo.
// Lingue esposte: catalano, spagnolo, inglese.
// (it.ts resta come master del Dictionary type ma non e' selezionabile)

import { derived, writable } from "svelte/store";
import { it, type Dictionary } from "./it";
import { en } from "./en";
import { es } from "./es";
import { ca } from "./ca";

export type Locale = "ca" | "es" | "en";

export const LOCALES: Array<{ code: Locale; label: string; flag: string }> = [
  { code: "es", label: "Espanol", flag: "🇪🇸" },
  { code: "ca", label: "Catala", flag: "🏴󠁥󠁳󠁣󠁴󠁿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

const DICTS: Record<Locale, Dictionary> = { ca, es, en };

const STORAGE_KEY = "ensapp:locale:v1";
const DEFAULT_LOCALE: Locale = "es";

function readInitial(): Locale {
  if (typeof localStorage === "undefined") return DEFAULT_LOCALE;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "ca" || raw === "es" || raw === "en") return raw;
  // Fallback al primo match con la lingua del browser (mappa it->es per compat retroattiva)
  if (typeof navigator !== "undefined") {
    const lang = navigator.language.slice(0, 2).toLowerCase();
    if (lang === "ca") return "ca";
    if (lang === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

function applyToDocument(value: Locale): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("lang", value);
}

export const locale = writable<Locale>(readInitial());

locale.subscribe((value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, value);
  }
  applyToDocument(value);
});

/** Store derivato: ad ogni cambio di locale, espone il dizionario. */
export const t = derived(locale, ($locale) => DICTS[$locale]);

export function setLocale(value: Locale): void {
  locale.set(value);
}

/** Ciclo locale -> next per il toggle. */
export function cycleLocale(): void {
  locale.update((curr) => {
    const idx = LOCALES.findIndex((l) => l.code === curr);
    const next = LOCALES[(idx + 1) % LOCALES.length];
    return next.code;
  });
}

// Avoid tree-shaking it.ts away (it's our type schema)
void it;
