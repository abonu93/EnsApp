// Wrapper attorno a svelte-spa-router: route map + focus management a11y.

import { location } from "svelte-spa-router";
import Landing from "../../routes/Landing.svelte";
import WorkflowSelector from "../../routes/WorkflowSelector.svelte";
import TrialsList from "../../routes/TrialsList.svelte";
import TrialDetail from "../../routes/TrialDetail.svelte";
import PreImaging from "../../routes/PreImaging.svelte";
import PreResult from "../../routes/PreResult.svelte";
import PostImaging from "../../routes/PostImaging.svelte";
import Summary from "../../routes/Summary.svelte";
import Share from "../../routes/Share.svelte";
import PostAcute from "../../routes/PostAcute.svelte";
import TrialPatient from "../../routes/TrialPatient.svelte";
import SavedPatients from "../../routes/SavedPatients.svelte";
import Components from "../../routes/Components.svelte";
import FormDemo from "../../routes/FormDemo.svelte";
import NotFound from "../../routes/NotFound.svelte";

export const routes = {
  "/": Landing,
  "/workflow": WorkflowSelector,
  "/trials": TrialsList,
  "/trial/:name": TrialDetail,
  "/pre-imaging": PreImaging,
  "/pre-result": PreResult,
  "/post-imaging": PostImaging,
  "/summary": Summary,
  "/share": Share,
  "/post-acute": PostAcute,
  "/trial-patient": TrialPatient,
  "/saved": SavedPatients,
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
