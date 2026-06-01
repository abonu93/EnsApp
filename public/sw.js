// Service worker minimo per PWA installability.
// Strategia: passthrough alla rete con cache stub.
// Chrome richiede un SW registrato per offrire "Installa app".

const VERSION = "v2-eligo";
const SHELL_CACHE = "ensapp-shell-" + VERSION;

self.addEventListener("install", (event) => {
  // Activate immediatamente, niente caching iniziale (mantiene la build leggera)
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Cleanup vecchie cache + claim dei client esistenti
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("ensapp-shell-") && k !== SHELL_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Passthrough: lascia al browser gestire il fetch normalmente.
// Manteniamo l'SW per il criterio "installabile" ma non interferiamo col routing.
self.addEventListener("fetch", () => {
  // no-op
});
