// i18n minimale: store reattivo + funzione t() derived.
// Persistito in localStorage. Default: italiano.

import { derived, writable } from "svelte/store";
import { it, type Dictionary } from "./it";
import { en } from "./en";
import { es } from "./es";

export type Locale = "it" | "en" | "es";

export const LOCALES: Array<{ code: Locale; label: string; flag: string }> = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Espanol", flag: "🇪🇸" },
];

const DICTS: Record<Locale, Dictionary> = { it, en, es };

const STORAGE_KEY = "ensapp:locale:v1";

function readInitial(): Locale {
  if (typeof localStorage === "undefined") return "it";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === "it" || raw === "en" || raw === "es") return raw;
  // Fallback al primo match con la lingua del browser
  if (typeof navigator !== "undefined") {
    const lang = navigator.language.slice(0, 2).toLowerCase();
    if (lang === "en" || lang === "es") return lang;
  }
  return "it";
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
