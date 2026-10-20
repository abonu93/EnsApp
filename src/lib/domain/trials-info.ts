// TRIALS_INFO: catalogo dei trial clinici disponibili.
// I criteri chiave (window/age/mrs/nihss/aspects) sono PROSA, non logica.
// La logica di eligibility vive in src/lib/domain/{acute,hemorrhagic}-rules.ts.

export type TrialStatus = "active" | "paused" | "post-acute" | "closed";
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
    // Reclutamento chiuso (foglio "Esquema ensayos", set. 2026): info consultabili,
    // ma il trial non e' selezionabile per l'arruolamento.
    status: "closed",
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
    // Testi dal protocollo v2.3 (25-11-2025) e CI v4.0: vedi vault/ensayos/ATHENA.md.
    status: "active",
    category: "EVT device",
    key: { window: "<= 16 h (to arterial puncture)", age: "22-85 y", mrs: "0-2", nihss: "6-25", aspects: "6-10 (or core <= 50 mL on CTP/MRP)" },
    consent: "Written (patient, representative or witness). Oral/remote only if approved by the Ethics Committee.",
    imaging: "Single occlusion of terminal ICA, M1, or dominant/proximal M2.",
    thrombolytic: "Optional, per local practice.",
    thrombectomy: "Yes.",
    preEvtLabs: "No.",
    intervention: "Stent retriever + ANA vs stent retriever +/- intermediate catheter (DAC). Solitaire, Trevo or pRESET only.",
    notes: [
      "Assessed in the angio suite: tandem lesion requiring treatment or preventing access to thrombus excludes; tortuosity preventing access excludes.",
      "Not allowed: balloon guide catheter, double stent, radial or carotid access; another thrombectomy device already used.",
    ],
    visits: ["Baseline (in-person)", "24 h (in-person)", "Day 5 / discharge (in-person)", "Day 90 (in-person, phone if not possible)"],
  },
  PIVOTAL: {
    status: "active",
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
    // In pausa (foglio "Esquema ensayos", set. 2026): come i chiusi,
    // non viene proposto per l'arruolamento finche' non riapre.
    status: "paused",
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
    // Reclutamento chiuso (foglio "Esquema ensayos", set. 2026): info consultabili,
    // ma il trial non e' selezionabile per l'arruolamento.
    status: "closed",
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
    // Testi dal protocollo v1.2, sinossi e CI: vedi vault/ensayos/VANISH.md.
    status: "active",
    category: "Thrombolysis with EVT pathway",
    key: { window: "<= 9 h (wake-up: 9 h from mid-sleep)", age: ">= 18 y", mrs: "0-1", nihss: ">= 6", aspects: "- (stratification only, not a criterion in protocol v1.2)" },
    consent: "Written; oral by the patient with later signature; representative also by phone, with written ratification.",
    imaging: "Occlusion (TICI 0-1) of the intracranial ICA or M1 on CTA/MRA. Core <= 70 mL and perfusion mismatch > 1.2 with absolute difference > 10 mL (Tmax > 6 s). Tandem occlusion of any cause excludes.",
    thrombolytic: "Optional.",
    thrombectomy: "Yes (randomized before the procedure).",
    preEvtLabs: "Pregnancy test in women of childbearing potential.",
    intervention: "Intra-arterial alteplase 0.3 mg/kg (max 30 mg) over 30 min during thrombectomy vs thrombectomy alone. No heparin or antiplatelets during EVT and for 24 h after alteplase, unless needed for stenting.",
    notes: [
      "Exclude: any absolute contraindication to IV or IA tPA; mass effect or tumour; vasculitis; pregnancy; known renal disease; contrast/nickel/titanium allergy; life expectancy < 90 days.",
    ],
    visits: ["Enrolment", "24 h (CT)", "Discharge (NIHSS, mRS)", "Day 90 (mRS, in-person or phone)"],
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
    // Reclutamento chiuso: le info restano consultabili nel catalogo,
    // ma il trial non e' selezionabile per l'arruolamento.
    status: "closed",
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
    // Chiuso (foglio "Esquema ensayos", set. 2026): info consultabili,
    // ma il trial non e' selezionabile per l'arruolamento.
    status: "closed",
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
    // Testi dal protocollo V10.5 (Parte 2) e CI v1.5: vedi vault/ensayos/FASTEST.md.
    status: "active",
    category: "ICH hemostatic",
    key: { window: "<= 2 h (91-120 min only if spot sign +)", age: "18-80 y", mrs: "0-2", nihss: "GCS >= 8", aspects: "-" },
    consent: "Written; emergency inclusion without prior consent allowed in Spain.",
    imaging: "Baseline CT + CTA (mandatory). Spontaneous ICH 2-59 mL, no brainstem ICH, no extensive IVH. CT at 24 h.",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "ECG and troponin at baseline; troponin at 24 h.",
    intervention: "rFVIIa 80 mcg/kg (max 10 mg) vs placebo, IV bolus over 2 min.",
    notes: [
      "Part 2: after 90 min from onset, positive spot sign on baseline CTA required.",
      "Exclude: secondary ICH (trauma, AVM, aneurysm, tumour, coagulopathy); VKA or DOAC in last 7 days; LMWH in last 24 h; UFH with abnormal PTT.",
      "Exclude: ST elevation consistent with acute MI; thrombo-embolic event in last 90 days; endarterectomy/angioplasty/stent in last 90 days; pregnancy, < 12 weeks post-partum or lactating.",
      "Exclude: tranexamic acid or other procoagulants in last 24 h; another investigational study in last 30 days (incl. TICH-3).",
    ],
    visits: ["1 h", "24 h", "Day 4 / discharge", "Day 30 (remote)", "Day 90 (in-person)", "Day 180 (remote)"],
  },
  TICH3: {
    // Testi dal protocollo Final v3.1 (25-04-2024): vedi vault/ensayos/TICH-3.md.
    status: "active",
    category: "ICH hemostatic",
    key: { window: "< 4.5 h (unknown onset: from discovery)", age: ">= 18 y, no upper limit", mrs: "-", nihss: "GCS >= 5", aspects: "-" },
    consent: "Emergency oral consent from patient or relative (phone allowed), then written within ~24 h; independent physician if nobody available.",
    imaging: "Routine CT or MRI. Volume < 60 mL (ABC/2) or max diameter <= 5 cm. IVH is not an exclusion.",
    thrombolytic: "—",
    thrombectomy: "—",
    preEvtLabs: "None required.",
    intervention: "Tranexamic acid 2 g IV (1 g bolus over 10 min + 1 g over 8 h) vs placebo.",
    notes: [
      "DOACs allowed. Exclude therapeutic anticoagulation with warfarin/VKA or LMWH.",
      "Exclude: known indication or contraindication for TXA; secondary ICH (trauma, AVM, aneurysm, tumour); palliative care already decided.",
      "FASTEST excludes patients who received TXA in the last 24 h or another study in the last 30 days: the two trials are alternatives.",
    ],
    visits: ["Day 1", "Day 7 / discharge", "Day 180 (central postal or phone follow-up)"],
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
    // Testi dal protocollo V6.2 e CI v2.1: vedi vault/ensayos/REMEDY.md.
    status: "active",
    category: "Tissue kallikrein (double-blind)",
    key: { window: "< 24 h", age: "18-90 y", mrs: "0-1", nihss: "5-15", aspects: ">= 6 (0-5 excluded)" },
    consent: "Written (patient or legal representative); exceptionally, phone consent of the representative with written ratification. Impartial witness allowed.",
    imaging: "Exclude symptomatic large vessel occlusion: intracranial carotid (I/T/L), M1, vertebral or basilar. Exclude brainstem or cerebellar stroke.",
    thrombolytic: "Allowed: evaluate >= 6 h after the end of fibrinolysis (NIHSS still 5-15, improvement < 4 points, repeat imaging without PH1/PH2).",
    thrombectomy: "Excluded (diagnostic angiography without MT is allowed).",
    preEvtLabs: "Serum pregnancy test before randomization in women of childbearing potential; eGFR for the ACE inhibitor washout.",
    intervention: "Rinvecalinase alfa (DM199) vs placebo: one IV dose, then subcutaneous injections up to day 21.",
    notes: [
      "ACE inhibitors: exclude if last dose < 24 h before the IV dose (< 48 h if eGFR < 45) or if they cannot be switched until day 29.",
      "Exclude: participation in another drug or device study in the last 30 days.",
    ],
    visits: ["Day 1 (IV dose, first SC)", "Day 2", "Days 4, 7, 11, 14, 18 (SC; clinic, home or phone)", "Day 21 (last SC, in-person)", "Day 30 (phone allowed)", "Day 90 (mRS, primary endpoint)"],
  },
  TENACITY: {
    status: "active",
    category: "Thrombolytic (late window)",
    key: { window: "> 4.5 h and <= 72 h", age: ">= 18 y", mrs: "0-1", nihss: "6-25", aspects: ">= 7 (M1) / 9-10 (M2)" },
    consent: "Written & oral/phone consent.",
    imaging:
      "Acute ischemic stroke (wake-up included) of the supratentorial circulation (ACA, MCA or PCA). Option 1 - CT perfusion: perfusion/core mismatch >= 20% (ratio >= 1.2) AND mismatch volume > 10 mL. Option 2 - no MRI/CTP: M1 or M2 MCA occlusion on CTA with small core on NCCT (ASPECTS >= 7 for M1; ASPECTS 9-10 for M2, max one region distal to the occlusion).",
    thrombolytic: "Yes - tenecteplase (TNK) vs standard care in the > 4.5 h window.",
    thrombectomy: "No - patients treated with mechanical thrombectomy are excluded.",
    preEvtLabs: "No.",
    intervention: "Tenecteplase (TNK) beyond 4.5 h and up to 72 h from LSW.",
    notes: [
      "Exclusion - imaging: internal carotid artery occlusion; high hemorrhagic risk (DWI >= 70 mL, CTP ischemic core >= 70 mL, ASPECTS 0-6, intense hypo-attenuation on NCCT vs contralateral white matter).",
      "Exclusion - clinical: NIHSS <= 5 or rapidly improving; NIHSS > 25; imaging not suggestive of acute ischemic stroke or suggestive of stroke > 72 h; patient receiving thrombolysis as routine clinical practice.",
      "Exclusion: contraindications to tenecteplase; diabetes.",
      "App logic: 'treated with thrombectomy' = EVT candidate; 'thrombolysis as routine practice' = IVT candidate.",
    ],
    visits: null,
  },
  "SAIL-MeVO": {
    status: "active",
    category: "EVT in medium vessel occlusion (randomized EVT + BMT vs BMT)",
    key: { window: "< 12 h (onset / LKW to randomization)", age: "18-80 y", mrs: "0-1", nihss: "9-17", aspects: ">= 6" },
    consent: "Written consent from the patient or legal representative; emergency consent where approved by the ethics committee, with deferred written consent.",
    imaging:
      "Isolated MeVO on CTA/MRA: non-dominant M2-M3 (MCA), A2-A3 (ACA) or P2-P3 (PCA). NCCT ASPECTS >= 6. AI-estimated core on NCCT < 10 mL (if available). CT perfusion Tmax > 6 s volume > 30 mL (if available). If several studies were done, the most recent one counts.",
    thrombolytic: "Allowed when indicated (part of best medical treatment). After IVT the NIHSS must still be 9-17 at 30 min from IVT start.",
    thrombectomy: "Randomized 1:1 - EVT arm: ADAPT first line (max 2 passes), then SAIL (stent-retriever-assisted intra-arterial lysis) as rescue or first line with unfavorable anatomy.",
    preEvtLabs: "Pregnancy test if applicable.",
    intervention: "EVT (ADAPT / SAIL) + best medical treatment vs best medical treatment alone. Sponsor: VHIR - FlowCat Lab (PI: Marc Ribo).",
    notes: [
      "Exclusion: proximal LVO (ICA, M1) or tandem cervical ICA stenosis > 70%; intracranial hemorrhage on baseline imaging; pregnancy; life expectancy < 3 months; severe allergy to iodinated contrast.",
      "Wake-up stroke: < 12 h from the sleep midpoint. Unwitnessed onset: < 12 h from last known well.",
      "NIHSS: the last one before randomization counts (before sedation/intubation if sedated).",
      "App logic: the EVT candidacy answer is not used (EVT is randomized); 'non-dominant M2' = 'Any M2' (not 'M2 proximal/dominant'), M3 = '>M2'; isolated = only one vessel selected; tandem > 70% = tandem flag. AI core / Tmax 'not available' do not exclude.",
    ],
    visits: ["Baseline", "24 h (12-48 h)", "Day 5 +/- 1 / discharge", "Day 30 +/- 7", "Day 90 (mRS, EQ-5D-5L, blinded)"],
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
  // Chiavi = chiavi di TRIALS_INFO (TrialDetail cerca per chiave di route).
  Twin2Win2: "https://www.studyrandomizer.com/",
  DoneSymple: "https://www.studyrandomizer.com/",
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

/**
 * Forma canonica di un nome di trial per i confronti: minuscolo, senza
 * spazi, trattini o altri separatori. Es. "TWIN-2-WIN 2" e "Twin2Win2"
 * diventano entrambi "twin2win2".
 */
export function canonicalTrialName(name: string): string {
  return (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Trova la chiave di TRIALS_INFO dato un nome che puo' essere la chiave
 * stessa oppure il display name usato altrove (maiuscole, spazi e trattini
 * ignorati). Es. "SHIONOGI" -> Shionogi, "TWIN-2-WIN 2" -> Twin2Win2,
 * "DO-IT" -> DOIT, "TICH-3" -> TICH3.
 */
export function findTrialKey(name: string): string | undefined {
  if (TRIALS_INFO[name]) return name;
  const canon = canonicalTrialName(name);
  if (!canon) return undefined;
  return Object.keys(TRIALS_INFO).find((k) => canonicalTrialName(k) === canon);
}

export function findTrialInfo(name: string): TrialInfo | undefined {
  const key = findTrialKey(name);
  return key ? TRIALS_INFO[key] : undefined;
}

/**
 * True se il trial e' arruolabile (reclutamento non chiuso ne' in pausa).
 * I trial sconosciuti sono considerati aperti (default sicuro).
 */
export function isTrialOpen(name: string): boolean {
  const info = findTrialInfo(name);
  return info ? info.status !== "closed" && info.status !== "paused" : true;
}
