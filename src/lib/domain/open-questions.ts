// Dubbi aperti sui protocolli: punti che i documenti non chiariscono (o in
// cui si contraddicono) e che vanno chiesti al promotore o decisi dal team.
// Fonte: vault/comparativas/Valutazione EnsApp — criteri vs protocolli.md
// (sezione 6) e le schede in vault/ensayos/. Quando un dubbio si risolve, va
// tolto da qui e la decisione va riportata nella scheda del vault.
//
// I testi sono in inglese come il catalogo TRIALS_INFO.

import type { AcuteInput } from "./acute-rules";
import { canonicalTrialName, EXCLUSIVE_GROUPS } from "./trials-info";

export type QuestionOwner = "sponsor" | "team";

export interface OpenQuestion {
  id: string;
  /** Nomi degli studi come nel Riepilogo (confronto con canonicalTrialName). */
  trials: string[];
  owner: QuestionOwner;
  question: string;
  /** Cosa dicono i documenti e cosa fa oggi l'app. */
  detail: string;
  /** Vero se il dubbio cambia l'esito per il paziente inserito. */
  appliesTo?: (input: AcuteInput) => boolean;
}

export const OPEN_QUESTIONS: readonly OpenQuestion[] = [
  {
    id: "donesymple-mrs",
    trials: ["DONE SYMPLE"],
    owner: "sponsor",
    question: "Pre-stroke mRS at 70-80 years: 0 only, or 0-1?",
    detail:
      "Protocol v4 contradicts itself: the synopsis (p. 14) requires mRS 0 at 70-80 y, section 4.5 (p. 36) says mRS 0-1 at any age. The app uses 0-1.",
    appliesTo: (i) => i.age >= 70 && i.age <= 80 && i.premrs === 1,
  },
  {
    id: "donesymple-m2",
    trials: ["DONE SYMPLE"],
    owner: "sponsor",
    question: "Is an M2 occlusion eligible?",
    detail:
      "Protocol v4 speaks of anterior-circulation LVO (p. 12, 32) and starts time zero from an ICA or M1 occlusion (p. 43); M2 is never mentioned. The app accepts only ICA and M1.",
    appliesTo: (i) => (i.targetVessels ?? []).some((v) => v === "m2-proxdom" || v === "m2-any"),
  },
  {
    id: "twin2win2-m1",
    trials: ["TWIN-2-WIN 2"],
    owner: "sponsor",
    question: "Is a proximal M1 occlusion excluded (\"M1 distal\" in the protocol)?",
    detail: "Protocol V2 (p. 5) says distal M1. The app has a single M1 code and accepts any M1.",
    appliesTo: (i) => (i.targetVessels ?? []).includes("m1"),
  },
  {
    id: "nivo-protocol",
    trials: ["NiVO"],
    owner: "team",
    question: "Only the synopsis is available",
    detail: "Criteria come from synopsis v2.0. The full protocol is not in Drive, and NiVO is not in the team sheet.",
  },
  {
    id: "wetrust-section14",
    trials: ["WeTrust"],
    owner: "team",
    question: "Protocol section 14 (consent, labs) not read",
    detail: "The protocol PDF could not be downloaded in full; consent and pre-procedure labs are taken from the CI only.",
  },
];

/** Dubbi aperti che riguardano uno studio (nome di display o chiave del catalogo). */
export function questionsFor(trial: string): OpenQuestion[] {
  const key = canonicalTrialName(trial);
  return OPEN_QUESTIONS.filter((q) => q.trials.some((n) => canonicalTrialName(n) === key));
}

/**
 * Regole dei protocolli sulla partecipazione ad altri studi (schede del vault,
 * sezione "Co-arruolamento"). `strict`: esclude qualunque altro studio
 * sperimentale; `conditional`: solo quelli che interferiscono con l'endpoint.
 */
export const COENROLMENT_RULES: Readonly<Record<string, { strict: boolean; text: string }>> = {
  "FASTEST": { strict: true, text: "excludes another drug/device study in the last 30 days and procoagulants such as tranexamic acid in the last 24 h (excl. 12, 16)" },
  "REMEDY": { strict: true, text: "excludes another drug/device study, ongoing or in the last 30 days (excl. 17)" },
  "SOVATELTIDE": { strict: true, text: "excludes any other therapeutic trial (excl. 6)" },
  "TENACITY": { strict: true, text: "excludes another interventional drug/device study, or one ended < 30 days ago" },
  "ORION": { strict: true, text: "excludes any investigational device or drug study in the last 90 days or planned (excl. 25)" },
  "NiVO": { strict: true, text: "excludes patients enrolled in any clinical trial" },
  "PIVOTAL": { strict: false, text: "excludes another interventional study that may confound the results; the consent form forbids any other study" },
  "ATHENA": { strict: false, text: "excludes a drug/device study that would impact its primary endpoint, and prior use of another thrombectomy device (excl. 12, 20)" },
  "TWIN-2-WIN 2": { strict: false, text: "excludes a drug/device study that may affect it, and prior use of another thrombectomy device (excl. 2, 12)" },
  "DONE SYMPLE": { strict: false, text: "excludes another RCT that could affect its evaluation (excl. 13) and thrombolysis > 4.5 h after LKW (excl. 7)" },
  "WeTrust": { strict: false, text: "excludes a drug/device study that could cause confusion (excl. 18)" },
};

export interface SelectionAlert {
  kind: "coenrolment" | "question";
  trials: string[];
  title: string;
  detail: string;
  /** Il dubbio cambia l'esito per questo paziente. */
  relevant: boolean;
}

function ruleFor(trial: string) {
  const key = canonicalTrialName(trial);
  const name = Object.keys(COENROLMENT_RULES).find((n) => canonicalTrialName(n) === key);
  return name ? { name, ...COENROLMENT_RULES[name] } : undefined;
}

function decidedTogether(a: string, b: string): boolean {
  const ka = canonicalTrialName(a);
  const kb = canonicalTrialName(b);
  return EXCLUSIVE_GROUPS.some(
    (g) => g.some((n) => canonicalTrialName(n) === ka) && g.some((n) => canonicalTrialName(n) === kb)
  );
}

/**
 * Avvisi da mostrare quando si scelgono gli studi: combinazioni che un
 * protocollo vieta (o limita) e dubbi aperti sugli studi selezionati.
 */
export function selectionAlerts(selected: string[], input?: AcuteInput): SelectionAlert[] {
  const alerts: SelectionAlert[] = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];
      if (decidedTogether(a, b)) continue;
      const rules = [ruleFor(a), ruleFor(b)].filter((r) => r !== undefined);
      if (rules.length === 0) continue;
      alerts.push({
        kind: "coenrolment",
        trials: [a, b],
        title: `${a} + ${b}`,
        detail: rules.map((r) => `${r.name} ${r.text}.`).join(" "),
        relevant: rules.some((r) => r.strict),
      });
    }
  }
  for (const trial of selected) {
    for (const q of questionsFor(trial)) {
      const relevant = input && q.appliesTo ? safe(() => q.appliesTo!(input)) : false;
      alerts.push({ kind: "question", trials: [trial], title: `${trial}: ${q.question}`, detail: q.detail, relevant });
    }
  }
  return alerts.sort((x, y) => Number(y.relevant) - Number(x.relevant));
}

function safe(fn: () => boolean): boolean {
  try {
    return fn() === true;
  } catch {
    return false;
  }
}
