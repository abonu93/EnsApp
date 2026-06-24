import { mount } from "svelte";
import "$lib/styles/global.css";
import App from "./App.svelte";

const target = document.getElementById("app");
if (!target) throw new Error("Mount target #app not found");

mount(App, { target });

// Registra il service worker per soddisfare il criterio "installabile" di Chrome.
// La registrazione e' best-effort: se fallisce, l'app continua a funzionare.
// In dev (Vite serve i file da localhost senza HTTPS) il SW viene saltato.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    // BASE_URL e' "/EnsApp/" su GitHub Pages, "/" in locale.
    const swUrl = import.meta.env.BASE_URL + "sw.js";
    navigator.serviceWorker.register(swUrl, { scope: import.meta.env.BASE_URL })
      .catch((e) => console.warn("SW registration failed:", e));
  });
}

// Auto-update PWA: confronta il build id corrente con quello pubblicato in
// version.json. Se differiscono, una nuova versione e' online: ricarica
// (reload silenzioso). Il SW e' passthrough, quindi un reload basta a
// prendere i nuovi asset con hash. Lo stato del paziente vive in
// localStorage (TTL 24h) e sopravvive al reload.
if (import.meta.env.PROD) {
  const VERSION_URL = import.meta.env.BASE_URL + "version.json";
  // Evita loop di reload se l'index.html servito e' temporaneamente stale:
  // ricarica al massimo una volta per ogni nuovo build id nella sessione.
  const GUARD_KEY = "ensapp:reloadedFor";

  async function checkForUpdate(): Promise<void> {
    try {
      const res = await fetch(VERSION_URL, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { buildId?: string };
      const latest = data?.buildId;
      if (!latest || latest === __BUILD_ID__) return;
      if (sessionStorage.getItem(GUARD_KEY) === latest) return;
      sessionStorage.setItem(GUARD_KEY, latest);
      window.location.reload();
    } catch {
      // offline o fetch fallito: riprova al prossimo check
    }
  }

  // Check all'avvio, al rientro in foreground e periodicamente (ogni 30 min).
  window.addEventListener("load", () => void checkForUpdate());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void checkForUpdate();
  });
  setInterval(() => void checkForUpdate(), 30 * 60 * 1000);
}
