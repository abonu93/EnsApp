// Wrapper attorno a svelte-spa-router per centralizzare:
// - mappa route -> componente
// - focus management su route change (a11y: focus su h1[tabindex=-1])
// - scroll-to-top su route change

import { location } from "svelte-spa-router";
import Landing from "../../routes/Landing.svelte";
import Components from "../../routes/Components.svelte";
import FormDemo from "../../routes/FormDemo.svelte";
import NotFound from "../../routes/NotFound.svelte";

export const routes = {
  "/": Landing,
  "/components": Components,
  "/form-demo": FormDemo,
  "*": NotFound,
};

let initialized = false;

export function setupRouterA11y(): void {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;

  location.subscribe(() => {
    queueMicrotask(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (h1) {
        if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    });
  });
}
