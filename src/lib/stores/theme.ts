import { writable } from "svelte/store";

export type Theme = "light" | "dark" | "auto";

const STORAGE_KEY = "ensapp:theme:v1";

function readInitial(): Theme {
  if (typeof localStorage === "undefined") return "auto";
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "auto" ? raw : "auto";
}

function applyToDocument(value: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (value === "auto") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", value);
  }
}

export const theme = writable<Theme>(readInitial());

theme.subscribe((value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY, value);
  }
  applyToDocument(value);
});

export function cycleTheme(): void {
  theme.update((current) => {
    if (current === "auto") return "light";
    if (current === "light") return "dark";
    return "auto";
  });
}
