// Eligibility derived: ricalcola automaticamente quando preData/postData/hemData
// cambiano. NON contiene logica clinica - delega a src/lib/domain/*-rules.ts.

import { derived } from "svelte/store";
import { preData, postData, hemData, ltswHours, discoveryHours } from "./patient";
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
  tenacity: boolean;
  sailMevo: boolean;
}

export interface HemorrhagicEligibility {
  fastest: { baseCriteriaMet: boolean; extraMissing: boolean; eligible: boolean };
  tich3: boolean;
}

// `ltsw` viene sempre da `ltswHours`, che avanza con l'orologio dell'app:
// cosi' una finestra che scade mentre il paziente e' aperto fa sparire il
// trial dai risultati (prima restava il valore salvato in pre-imaging).
function mergedAcute(
  pre: Record<string, unknown>,
  post: Record<string, unknown>,
  ltsw: number | undefined,
  hoursSinceDiscovery: number | undefined
): AcuteInput {
  return { ...pre, ...post, ltsw, hoursSinceDiscovery } as unknown as AcuteInput;
}

// Le regole non leggono il tipo di ictus: i campi ischemici restano in
// postData anche se poi si sceglie "emorragico" (e viceversa). Il filtro sta
// qui, cosi' nessun trial ischemico viene proposto per un'emorragia e nessun
// trial emorragico per un ischemico.
function allFalse<T extends object>(shape: T): T {
  return Object.fromEntries(Object.keys(shape).map((k) => [k, false])) as T;
}

export const acuteEligibility = derived(
  [preData, postData, ltswHours, discoveryHours],
  ([$pre, $post, $h, $d]): AcuteEligibility => {
    const input = mergedAcute($pre, $post, $h, $d);
    const result: AcuteEligibility = {
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
      tenacity: safeBoolean(() => acute.tenacity(input)),
      sailMevo: safeBoolean(() => acute.sailMevo(input)),
    };
    // Tipo non ancora scelto: resta calcolato, perche' WeTrust si valuta in
    // PreResult prima dell'imaging.
    // WeTrust si randomizza prima dell'imaging: resta valido anche se poi
    // l'ictus risulta emorragico.
    return $post.strokeType === "hemorrhagic" ? { ...allFalse(result), weTrust: result.weTrust } : result;
  }
);

export const hemEligibility = derived(
  [hemData, preData, postData, ltswHours, discoveryHours],
  ([$hem, $pre, $post, $h, $d]): HemorrhagicEligibility => {
  if ($post.strokeType !== "hemorrhagic") {
    return {
      fastest: { baseCriteriaMet: false, extraMissing: true, eligible: false },
      tich3: false,
    };
  }
  const input = { ...$pre, ...$hem, ltsw: $h, hoursSinceDiscovery: $d } as HemorrhagicInput;
  return {
    fastest: safeFastest(() => hem.fastest(input)),
    tich3: safeBoolean(() => hem.tich3(input)),
  };
  }
);

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
