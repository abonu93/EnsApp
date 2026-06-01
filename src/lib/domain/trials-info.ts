// TRIALS_INFO: catalogo dei trial clinici disponibili.
// I criteri chiave (window/age/mrs/nihss/aspects) sono PROSA, non logica.
// La logica di eligibility vive in src/lib/domain/{acute,hemorrhagic}-rules.ts.

export type TrialStatus = "active" | "paused" | "post-acute";
export type TrialCategory = string;

export interface TrialKeyCriteria {
  window: string;
  age: string;
  mrs: string;
  nihss: string;
  aspects: string;
}

export interface TrialInfo {
  status: TrialStatus;
  category: TrialCategory;
  key: TrialKeyCriteria;
  consent: string;
  imaging: string;
  thrombolytic: string;
  thrombectomy: string;
  preEvtLabs: string;
  intervention: string;
  notes: string[];
  visits: string[] | null;
}

export const TRIALS_INFO: Record<string, TrialInfo> = {
  WeTrust: {
    status: "active",
    category: "Imaging / Workflow",
    key: { window: "< 6 h OR wake-up stroke: LSW < 12 h (symptoms < 6 h)", age: ">= 18 y", mrs: "0-2", nihss: ">= 10", aspects: "-" },
    consent: "—",
    imaging: "Direct-to-angio OR multimodal CT pathway.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "Cone-beam CT software (vs standard).",
    notes: ["Exclusion examples noted elsewhere: low GCS, INR > 3, seizure at onset."],
    visits: null,
  },
  MOSTE: {
    status: "active",
    category: "EVT strategy",
    key: { window: "< 23 h", age: "No upper limit", mrs: "0-1", nihss: "0-5", aspects: "6-10" },
    consent: "Written & oral/phone consent.",
    imaging: "CTA showing occlusion: TICA, M1-M2 or tandem. CT + CTA at 24 h.",
    thrombolytic: "Optional.",
    thrombectomy: "Randomize: EVT yes/no.",
    preEvtLabs: "No.",
    intervention: "Thrombectomy vs No Thrombectomy (per protocol).",
    notes: ["Isolated ICA exclusion.", "Drip & Ship: re-image if > 1 h pre-randomization.", "24 h CT and CTA always."],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"],
  },
  ATHENA: {
    status: "paused",
    category: "EVT device",
    key: { window: "< 24 h", age: "22-85 y", mrs: "0-2", nihss: ">= 8", aspects: "6-10" },
    consent: "Written & oral/phone consent.",
    imaging: "TICA, M1 or M2 occlusion.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "Stent retriever + ANA vs Stent retriever + DAC.",
    notes: ["Thrombolysis per local practice (3 h limit removed)."],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (in-person)"],
  },
  PIVOTAL: {
    status: "paused",
    category: "EVT aspiration system",
    key: { window: "< 8 h", age: "18-80 y", mrs: "0-1", nihss: ">= 6", aspects: "6-10" },
    consent: "Written & oral/phone consent.",
    imaging: "ICA (including T), M1, M2, intracranial vertebral or basilar.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "RapidPulse aspiration pump + tubing/collection canister + RapidPulse 071 catheter.",
    notes: ["Initial treatment with a different thrombectomy device not allowed.", "Any CT/MR hemorrhage excludes."],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"],
  },
  PROMISE: {
    status: "active",
    category: "EVT device",
    key: { window: "< 24 h", age: ">= 18 y", mrs: "0-2", nihss: ">= 1", aspects: "-" },
    consent: "Written.",
    imaging: "Intracranial ICA (distal/T-ICA) or MCA M1/M2 occlusion suitable for EVT.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "PROMISE thrombectomy device (per protocol).",
    notes: [],
    visits: null,
  },
  Twin2Win2: {
    status: "active",
    category: "EVT technique",
    key: { window: "< 24 h", age: "> 18 y", mrs: "0-2", nihss: ">= 6", aspects: "-" },
    consent: "Written & oral/phone consent.",
    imaging: "Occlusion with TICI 0-1 flow at ICA-T, distal M1 MCA, or basilar.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "Double-stent (DS-EVT) technique.",
    notes: [],
    visits: ["Baseline (in-person)", "24 h (in-person)", "48 h (in-person)", "Day 3-10 / discharge (in-person)", "Day 30 (phone)", "Day 90 (phone)"],
  },
  ARTEMIS: {
    status: "active",
    category: "EVT device",
    key: { window: "< 24 h", age: "18-85 y", mrs: "0-2", nihss: "6-25", aspects: "6-10" },
    consent: "Written.",
    imaging: "Intracranial ICA; MCA M1; MCA M2 proximal/dominant segments.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "Stent retriever CONDA.",
    notes: [],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Discharge (in-person)", "Day 30 (phone)", "Day 90 (phone)"],
  },
  HYBERNIA: {
    status: "paused",
    category: "Neuroprotection / Cooling adjunct",
    key: { window: "< 24 h", age: "18-89 y", mrs: "0-1", nihss: ">= 6", aspects: "5-10" },
    consent: "Written & oral/phone consent.",
    imaging: "Intracranial ICA, M1 or any M2.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "Yes - blood gas incl. hematocrit.",
    intervention: "Stent retriever + Hybernia Delta H Brain Cooling System.",
    notes: [],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"],
  },
  DoneSymple: {
    status: "active",
    category: "Late-window EVT + IA tPA",
    key: { window: "24-72 h", age: "18-80 y", mrs: "0-1", nihss: ">= 8", aspects: "-" },
    consent: "Written & oral/phone consent.",
    imaging: "Presence of LVO.",
    thrombolytic: "Optional.",
    thrombectomy: "Randomize: IA tPA yes/no alongside EVT strategy.",
    preEvtLabs: "No.",
    intervention: "Intra-arterial tPA (per arm).",
    notes: [],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (phone)"],
  },
  VANISH: {
    status: "active",
    category: "Thrombolysis with EVT pathway",
    key: { window: "< 9 h (wake-up: <= 9 h from mid-sleep)", age: "> 18 y", mrs: "0-1", nihss: ">= 6", aspects: ">= 4" },
    consent: "—",
    imaging: "Occlusion (TICI 0-1) of ICA, M1, or weight-bearing M2 on CTA/MRA/DSA.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "tPA IA possible per protocol; EVT/stenting defer > 24 h after thrombolysis.",
    notes: [],
    visits: null,
  },
  SaferDoac: {
    status: "active",
    category: "Safety / Diagnostics",
    key: { window: "-", age: "-", mrs: "-", nihss: "-", aspects: "-" },
    consent: "—",
    imaging: "—",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "—",
    intervention: "Workflow for DOAC/NOAC patients: Chest CTA and drug levels.",
    notes: [],
    visits: null,
  },
  Shionogi: {
    status: "active",
    category: "Thrombolytic / Adjunct",
    key: { window: "< 25 h", age: "> 18 y", mrs: "0-1", nihss: "6-22", aspects: "-" },
    consent: "Written.",
    imaging: "CT or MRI post-thrombolysis to exclude ICH; MRI < 4 days after.",
    thrombolytic: "Yes - treatment allowed; if EVT/stent planned, wait > 24 h.",
    thrombectomy: "Optional in pathway after study drug timing.",
    preEvtLabs: "Yes - pre-dose.",
    intervention: "Elezanumab 1800 mg IV vs placebo (120 min infusion).",
    notes: ["If TEV/stent is planned, wait > 24 h after study drug."],
    visits: [
      "First in-person visit at 30 +/- 7 days from screening/randomization",
      "Second in-person visit at 90 +/- 14 days from screening/randomization",
    ],
  },
  Librexia: {
    status: "post-acute",
    category: "Antithrombotic (post-acute)",
    key: { window: "<= 48 h", age: ">= 40 y", mrs: "<= 2", nihss: "<= 7", aspects: "-" },
    consent: "Written.",
    imaging: "Non-cardioembolic / non-lacunar; CT/MR showing hypodensity, perfusion deficit, or vessel occlusion (anterior or posterior circulation).",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "Yes - pre-dose.",
    intervention: "Milvexian 25 mg vs placebo (q12h; first dose within 3 h of randomization).",
    notes: ["No prophylactic LMWH > 3 days.", "Exclude patients requiring therapeutic anticoagulation."],
    visits: [
      "First in-person visit at 28 +/- 7 days from screening/randomization",
      "Second in-person visit at 90 +/- 7 days from screening/randomization",
    ],
  },
  Sovateltide: {
    status: "active",
    category: "Neuroprotective",
    key: { window: "< 24 h", age: "18-80 y", mrs: "0-2", nihss: "8-19", aspects: "-" },
    consent: "Written (impartial witness permitted).",
    imaging: "Ischemic stroke only (non-AITS): CT confirmation by any of: hypodensity, perfusion deficit, or vessel occlusion (anterior or posterior circulation).",
    thrombolytic: "No.",
    thrombectomy: "No (non-EVT candidate cohort).",
    preEvtLabs: "Yes - pre-dose.",
    intervention: "Sovateltide vs placebo - 3 bolus doses (1-2 min) on Day 0 / Day 3 / Day 6.",
    notes: ["5-day treatment course (daily IV bag 90 min).", "Exclude: ICH, tandem occlusion, mass-effect lesion, cerebral vasculitis."],
    visits: ["Post-dose monitoring (0-72 h)", "Day 7 / discharge visit", "Day 30 (phone)", "Day 90 (phone)"],
  },
  Orion: {
    status: "active",
    category: "Thrombolytic",
    key: { window: "4.5-24 h", age: "18-90 y", mrs: "0-1", nihss: "> 5", aspects: "-" },
    consent: "Written (impartial witness permitted).",
    imaging: "Intracranial ICA, M1/M2 MCA, distal ACA branches occlusion confirmed on CTA.",
    thrombolytic: "Yes - administer study drug 1 h before EVT; ensure >= 1 h from end of infusion to femoral puncture.",
    thrombectomy: "Yes (EVT after study drug as per timing rule).",
    preEvtLabs: "Yes - pre-dose.",
    intervention: "JX10 at 1 mg/kg or 3 mg/kg vs placebo.",
    notes: ["Exclude: infarct core volume > 70 mL; occlusions in > 1 vascular territory; direct EVT or EVT before study drug."],
    visits: null,
  },
  FASTEST: {
    status: "active",
    category: "ICH hemostatic",
    key: { window: "<= 2 h", age: "18-80 y", mrs: "0-2", nihss: "-", aspects: "-" },
    consent: "—",
    imaging: "— (ICH pathway).",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "—",
    intervention: "—",
    notes: [],
    visits: null,
  },
  TICH3: {
    status: "active",
    category: "ICH hemostatic",
    key: { window: "< 4.5 h", age: "No upper limit", mrs: "-", nihss: "-", aspects: "-" },
    consent: "—",
    imaging: "— (ICH pathway).",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "—",
    intervention: "—",
    notes: [],
    visits: null,
  },
  NiVO: {
    status: "active",
    category: "EVT device - distal aspiration catheter (MeVO)",
    key: { window: "<= 24 h", age: ">= 18 y", mrs: "<= 2", nihss: ">= 5", aspects: ">= 6" },
    consent: "Per local practice.",
    imaging: "Isolated primary occlusion in a distal medium vessel (non-dominant/distal M2, M3/M4; A2/A3; P1/P2/P3) on CTA or MRA.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes (distal aspiration catheter strategy).",
    preEvtLabs: "No.",
    intervention: "NiVO distal aspiration catheter approach (per protocol).",
    notes: [
      "Target arteries (app logic): >M2; A2 or >A2; P1 or >P1.",
      "M2 proximal/dominant is not an inclusion vessel for NiVO.",
      "Requires ASPECTS >= 6.",
    ],
    visits: null,
  },
  DOIT: {
    status: "active",
    category: "Thrombolysis in anticoagulated patients",
    key: { window: "<= 4.5 h", age: ">= 18 y", mrs: "-", nihss: "-", aspects: "-" },
    consent: "Per local practice.",
    imaging: "Ischemic stroke pathway.",
    thrombolytic: "Required indication for IVT.",
    thrombectomy: "Optional (not required).",
    preEvtLabs: "No.",
    intervention: "IV thrombolysis strategy in DOAC-exposed patients (per protocol).",
    notes: [
      "Inclusion: DOAC in previous 48h, IVT indication, age >=18, LTSW <=4.5h.",
      "Contraindications: no IVT indication, reversal agent use, pregnancy.",
    ],
    visits: null,
  },
  REMEDY: {
    status: "active",
    category: "Neuroprotective (double-blind)",
    key: { window: "< 24 h", age: "18-90 y", mrs: "0-1", nihss: "5-15", aspects: ">= 6" },
    consent: "Per local practice.",
    imaging: "Exclude intracranial carotid, M1, vertebral, or basilar occlusion.",
    thrombolytic: "Allowed per protocol.",
    thrombectomy: "No (TEV excluded).",
    preEvtLabs: "No.",
    intervention: "Rinvecalinase alfa vs placebo (double-blind).",
    notes: [
      "Exclusions: intracranial carotid, M1, vertebral or basilar vessel; TEV; ASPECTS <6; ACE inhibitor (IECA) use.",
      "Practical note: post-IVT CT at 6h with <PH1.",
    ],
    visits: null,
  },
  "NORA HOME": {
    status: "active",
    category: "Home discharge (minor stroke / high-risk TIA)",
    key: { window: "-", age: ">= 18 y", mrs: "-", nihss: "< 5", aspects: "-" },
    consent: "Per local practice.",
    imaging: "Brain imaging per standard of care.",
    thrombolytic: "Per local practice.",
    thrombectomy: "Per local practice.",
    preEvtLabs: "No.",
    intervention: "Early home discharge with structured follow-up vs in-hospital pathway.",
    notes: [
      "Inclusion: age > 18 AND (high-risk TIA OR NIHSS < 5).",
      "Default pathway: virtually any patient who is clinically stable and safe to discharge home.",
      "High-risk TIA is a clinical judgement (no dedicated field in the app).",
    ],
    visits: null,
  },
};

export type TrialName = keyof typeof TRIALS_INFO;

export const randomizationLinks: Record<string, string> = {
  ATHENA: "https://www.randomize.net/Randomize/Set.aspx?id=ba510dbb-ab7d-42ee-ae95-d8a46394d6ec&token=0d0bff39-455b-4f60-a95a-154476064f2e",
  VANISH: "https://app.studyrandomizer.com/dashboard/",
  MOSTE: "https://ecrf.chru-lille.fr/EnnovClinical/login?lang=EN",
  "TWIN-2-WIN 2": "https://www.studyrandomizer.com/",
  "DONE SYMPLE": "https://www.studyrandomizer.com/",
};

export type TrialFilter = "all" | "ischemic" | "hemorrhagic" | "post-acute";

const HEMORRHAGIC_NAMES = new Set(["FASTEST", "TICH3"]);
const POST_ACUTE_NAMES = new Set(["Librexia"]);

export function getTrialCategory(name: string): "ischemic" | "hemorrhagic" | "post-acute" {
  if (HEMORRHAGIC_NAMES.has(name)) return "hemorrhagic";
  if (POST_ACUTE_NAMES.has(name)) return "post-acute";
  return "ischemic";
}

export function filterTrials(
  filter: TrialFilter,
  query: string = ""
): Array<{ name: string; info: TrialInfo }> {
  const q = query.trim().toLowerCase();
  return Object.entries(TRIALS_INFO)
    .filter(([name, info]) => {
      if (filter !== "all" && getTrialCategory(name) !== filter) return false;
      if (!q) return true;
      return (
        name.toLowerCase().includes(q) ||
        info.category.toLowerCase().includes(q) ||
        info.intervention.toLowerCase().includes(q)
      );
    })
    .map(([name, info]) => ({ name, info }));
}
