// Live region singleton per annunciare messaggi a screen reader.
// Usato per "Saved to sheet", errori di validazione, esito eligibility.

let region: HTMLElement | null = null;

function ensureRegion(): HTMLElement {
  if (region) return region;
  region = document.createElement("div");
  region.setAttribute("role", "status");
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  region.className = "sr-only";
  document.body.appendChild(region);
  return region;
}

export function announce(message: string): void {
  if (typeof document === "undefined") return;
  const r = ensureRegion();
  r.textContent = "";
  // forza il riannuncio anche se il messaggio e' identico
  setTimeout(() => {
    r.textContent = message;
  }, 50);
}
