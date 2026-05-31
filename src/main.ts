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
