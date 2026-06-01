// Eligibility derived: ricalcola automaticamente quando preData/postData/hemData
// cambiano. NON contiene logica clinica - delega a src/lib/domain/*-rules.ts.

import { derived } from "svelte/store";
import { preData, postData, hemData } from "./patient";
import * as acute from "$lib/domain/acute-rules";
import * as hem from "$lib/domain/hemorrhagic-rules";
import type { AcuteInput, VesselCode } from "$lib/domain/acute-rules";
import type { HemorrhagicInput } from "$lib/domain/hemorrhagic-rules";

export interface AcuteEligibility {
  weTrust: boolean;
  athena: boolean;
  vanish: boolean;
  pivotal: boolean;
  promise: boolean;
  nivo: boolean;
  moste: boolean;
  twin2win2: boolean;
  artemis: boolean;
  hybernia: boolean;
  doneSymple: boolean;
  shionogi: boolean;
  sovateltide: boolean;
  orion: boolean;
  doit: boolean;
  remedy: boolean;
  noraHome: boolean;
}

export interface HemorrhagicEligibility {
  fastest: { baseCriteriaMet: boolean; extraMissing: boolean; eligible: boolean };
  tich3: boolean;
}

function mergedAcute(pre: Record<string, unknown>, post: Record<string, unknown>): AcuteInput {
  return { ...pre, ...post } as unknown as AcuteInput;
}

export const acuteEligibility = derived(
  [preData, postData],
  ([$pre, $post]): AcuteEligibility => {
    const input = mergedAcute($pre, $post);
    return {
      weTrust: safeBoolean(() => acute.weTrust(input)),
      athena: safeBoolean(() => acute.athena(input)),
      vanish: safeBoolean(() => acute.vanish(input)),
      pivotal: safeBoolean(() => acute.pivotal(input)),
      promise: safeBoolean(() => acute.promise(input)),
      nivo: safeBoolean(() => acute.nivo(input)),
      moste: safeBoolean(() => acute.moste(input)),
      twin2win2: safeBoolean(() => acute.twin2win2(input)),
      artemis: safeBoolean(() => acute.artemis(input)),
      hybernia: safeBoolean(() => acute.hybernia(input)),
      doneSymple: safeBoolean(() => acute.doneSymple(input)),
      shionogi: safeBoolean(() => acute.shionogi(input)),
      sovateltide: safeBoolean(() => acute.sovateltide(input)),
      orion: safeBoolean(() => acute.orion(input)),
      doit: safeBoolean(() => acute.doit(input)),
      remedy: safeBoolean(() => acute.remedy(input)),
      noraHome: safeBoolean(() => acute.noraHome(input)),
    };
  }
);

export const hemEligibility = derived([hemData, preData], ([$hem, $pre]): HemorrhagicEligibility => {
  const input = { ...$pre, ...$hem } as HemorrhagicInput;
  return {
    fastest: safeFastest(() => hem.fastest(input)),
    tich3: safeBoolean(() => hem.tich3(input)),
  };
});

export const vesselFlags = derived(postData, ($post) =>
  acute.computeVesselFlags(($post.targetVessels ?? []) as VesselCode[])
);

export const acuteEligibleCount = derived(acuteEligibility, ($e) =>
  Object.values($e).filter(Boolean).length
);

function safeBoolean(fn: () => boolean): boolean {
  try {
    return fn() === true;
  } catch {
    return false;
  }
}

function safeFastest(fn: () => { baseCriteriaMet: boolean; extraMissing: boolean; eligible: boolean }) {
  try {
    return fn();
  } catch {
    return { baseCriteriaMet: false, extraMissing: true, eligible: false };
  }
}
