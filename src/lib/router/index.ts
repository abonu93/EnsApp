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
import RegisteredPatient from "../../routes/RegisteredPatient.svelte";
import SavedPatients from "../../routes/SavedPatients.svelte";
import SavedPatientDetail from "../../routes/SavedPatientDetail.svelte";
import Components from "../../routes/Components.svelte";
import FormDemo from "../../routes/FormDemo.svelte";
import NotFound from "../../routes/NotFound.svelte";
import OpenQuestions from "../../routes/OpenQuestions.svelte";
import Board from "../../routes/Board.svelte";

export const routes = {
  "/": Landing,
  "/workflow": WorkflowSelector,
  "/board": Board,
  "/trials": TrialsList,
  "/trial/:name": TrialDetail,
  "/pre-imaging": PreImaging,
  "/pre-result": PreResult,
  "/post-imaging": PostImaging,
  "/summary": Summary,
  "/share": Share,
  "/post-acute": PostAcute,
  "/registered": RegisteredPatient,
  // Vecchio indirizzo della registrazione rapida.
  "/trial-patient": RegisteredPatient,
  "/saved": SavedPatients,
  "/saved/:id": SavedPatientDetail,
  "/components": Components,
  "/form-demo": FormDemo,
  "/open-questions": OpenQuestions,
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
