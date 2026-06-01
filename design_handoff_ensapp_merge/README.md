# Handoff: EnsApp — deep design merge into the Svelte app

## Overview
The goal is a **complete, deep merge**: take the **entire look AND the screen-level functionality** of the new EnsApp design (built as an interactive prototype) and bring it into the existing Svelte app, **keeping only the app's logic** (domain rules, stores, i18n data, routing, Google-Sheet payload). The visual layer and the screen flows become those of the prototype; the "brains" stay exactly as they are in the repo.

Target repo: **`abonu93/EnsApp`**, branch **`claude/github-branching-strategy-q1ChX`** (Svelte 5 + Vite + TypeScript, `svelte-spa-router`).

> Recommended execution: run this with **Claude Code** checked out on that branch. Create a working branch (e.g. `design/deep-merge`) off it. Claude Code can read the prototype design references in this bundle AND the existing source, then re-implement each route/component to match the prototype while wiring to the existing domain logic — verifying with `npm run dev`, `npm run check`, and the existing tests.

## About the design files
The files in `prototype/` are **design references created in HTML/React (Babel JSX)** — runnable prototypes that show the intended look and behavior. **They are NOT production code to copy verbatim.** The task is to **recreate them as Svelte 5 components/routes** in the target repo, using its existing patterns (`$lib/components/*`, token-driven CSS, `svelte-spa-router`, `$t` i18n store, Svelte stores).

Open `prototype/EnsApp Prototype.html` in a browser — it is the single source of truth for the full flow. Use the toolbar's **EN/ES** toggle and the **Transition** picker to see all states. The other three HTML files show side-by-side design explorations for specific screens (home variants, post-imaging vessel-picker variants, hemorrhagic + send variants).

## Fidelity
**High-fidelity (hifi).** Final colors, typography (IBM Plex), spacing, radii, shadows, and interactions are all decided. Recreate pixel-faithfully using the repo's token system. `tokens.css` in this bundle is the already-converted design-token file (drop-in replacement for `src/lib/styles/tokens.css`) — start from it.

---

## What to KEEP vs REBUILD

### KEEP (logic — do not change behavior)
- `src/lib/domain/*` — `acute-rules.ts`, `acute-reasons.ts`, `hemorrhagic-rules.ts`, `trials-info.ts`, `sheet-payload.ts`, `vessels.ts`
- `src/lib/stores/*` — `patient.ts`, `eligibility.ts`, `savedPatients.ts`, `trialSelection.ts`, `persistence.ts`, `theme.ts`
- `src/lib/i18n/*` — keep the en/es/it message **data**; add new keys where the prototype introduces new copy
- `src/lib/router/index.ts`, `src/lib/validation/rules.ts`, `src/lib/a11y/*`
- The Google-Sheet save flow and any analytics

### REBUILD (UI — match the prototype)
- `src/lib/styles/tokens.css` → replace with the bundled `tokens.css`
- Every file in `src/routes/*.svelte` → re-lay-out to match the prototype screens (mapping below)
- `src/lib/components/*.svelte` → restyle/extend to the prototype's component language; add the new custom controls listed under "New components to build"
- `src/App.svelte` shell (header + bottom nav) → minimal style: borderless airy header, **floating pill bottom-nav**

---

## Route → prototype screen mapping

| Existing route (`src/routes`) | Prototype screen | Notes for the merge |
|---|---|---|
| `Landing.svelte` (`/`) | **Home** ("Assign a patient to a trial") | One hero action (New patient), an "Active session" resume card with live timer + window bar, and two quiet footer links (Trials catalog, Past patients). |
| `WorkflowSelector.svelte` (`/workflow`) | **Choice bivio** | Two big option cards: **Check eligibility** (guided) and **Direct enrollment** (fast). Entered via an animated **Zoom** transition from the Home hero. |
| `PreImaging.svelte` (`/pre-imaging`) | **Pre-imaging** | Identification (PRN), Clinical (Age, **NIHSS large scale slider 0–42 with severity band**, **mRS segmented 0–5**), **Last seen well = calendar picker** (date+time, presets, auto window classification), **Wake-up stroke** checkbox w/ computed note, **Operational context** radios (Philips angiograph, DOAC 48h, ACE inhibitor). |
| `PreResult.svelte` (`/pre-result`) | **Pre-imaging result** | Interstitial checkpoint card (e.g. WeTrust eligible/not) → Continue. |
| `PostImaging.svelte` (`/post-imaging`) | **Post-imaging** | Stroke type radio-cards; **candidacy "Eligible" turns GREEN**; **IVT candidate** question below thrombectomy. Ischemic→ EVT params with the **region drill-down vessel picker** (ICA/MCA/ACA/Posterior tabs → segment buttons, removable selected chips), **Tandem/Tortuosity = iOS switches**, **ASPECTS 0–10 colored cells**. Hemorrhagic→ **live ICH score card**, **radial volume dial with "Not available" toggle**, GCS slider, pattern/cause, eligibility factors. |
| `Summary.svelte` (`/summary`) | **Results (multi-select)** + **Enrollment summary** | Results: eligible trials are **multi-select** (green checkbox cards); non-eligible greyed with reason. Bottom button "Review enrollment · N" → Summary screen listing patient + all chosen trials → "Confirm enrollment". A patient can enroll in **multiple** trials. |
| `Share.svelte` (`/share`) | **Send record** | Receipt of patient + enrolled trials, **Acute treatments TEV/TIV toggles**, Notes, **WhatsApp-style green message preview**, actions **Send to Google Sheet / Copy / WhatsApp** → "Record sent" success. Wire to existing `sheet-payload.ts`. |
| `TrialsList.svelte` (`/trials`) | **Trials catalog** | Title + count, search, category filter pills (All/Ischemic/Hemorrhagic/Post-acute), clean trial cards (name, category chip, **active/paused** status pill, intervention label, Window/NIHSS). |
| `TrialDetail.svelte` (`/trial/:name`) | **Trial detail** | "‹ Catalog" back, name + status/category/intervention chips, cards: **Key criteria** (Window/Age/pre-mRS/NIHSS/ASPECTS), Imaging, Intervention, Treatment (Thrombolytic/Thrombectomy/Pre-EVT labs/Consent), Notes. Pull real content from `trials-info.ts`. |
| `TrialPatient.svelte` (`/trial-patient`) | **Direct enrollment** | Trial-first: minimal patient ID (PRN, Age optional, Stroke type), then **multi-select trial picker with search, grouped by pathway**. Feeds the same Summary → Send chain. |
| `SavedPatients.svelte` (`/saved`) | **Past patients** | Segmented **Patients / Statistics**. Patients: review-status list (To review / Reviewed), enrolled-trial chips, amber "N missed" badge. Case detail: **Enrolled in**, **Eligible — not enrolled** (amber, informational), **Not eligible**, "Mark as reviewed". Statistics: metric cards (Screened/Enrolled/Missed eligible/Enrollment rate), **"Enrollment by trial" stacked bars (enrolled green + missed amber)**, "Missed opportunities" callout. |
| `PostAcute.svelte` (`/post-acute`) | *(no direct prototype screen)* | Keep existing logic/flow; restyle to the new tokens + component language for consistency. |
| `Components.svelte`, `FormDemo.svelte`, `NotFound.svelte` | dev/demo | Restyle only; not part of the clinical flow. |

---

## Design tokens
Use the bundled **`tokens.css`** verbatim (it already maps the app to the prototype). Key values:

- **Type:** `--font-sans: "IBM Plex Sans"`, `--font-mono: "IBM Plex Mono"` (loaded via `@import` at top of the file; or move to a `<link>` in `index.html`). Mono is used for all clinical numerals (NIHSS, timers, PRN, ASPECTS, dates).
- **Surfaces:** `--bg:#f5f6f8` (cool canvas), `--surface`/`--surface-elevated:#ffffff`, `--border:#e3e7ed`.
- **Brand:** `--primary:#2d5bd7` (cobalt), `--primary-hover:#1e45b0`, `--primary-soft:#eaf0fd`.
- **Semantic:** success `#0b8457` / soft `#e6f4ee`; danger `#c4403e` / soft `#fbeceb`; warn `#b5740c` / soft `#fbf1e2`.
- **Pathways:** ischemic `#2d5bd7`, hemorrhagic `#b23b5e` (text `#8f2547`, soft `#fbebf0`), post-acute teal `#0e8c8c` (text `#0a6e6e`, soft `#e4f4f4`).
- **Radius:** sm 8 / md 12 / lg 16 / xl 20 / pill 999. **Shadows:** soft, diffuse (`--shadow-sm/md/lg`). Full **dark mode** + reduced-motion already defined.

## New components to build (prototype-specific, token-driven)
1. **NihssScale** — slider 0–42 + big mono value + severity band (No deficit / Minor / Moderate / Mod–severe / Severe).
2. **Segmented** — mRS 0–5, stroke type, yes/no segmented control.
3. **DatetimeField + CalendarSheet** — LTSW date+time bottom sheet with quick presets (Now / −1h / −3h / −6h) and auto therapeutic-window chip (within IV thrombolysis / thrombectomy / window closed).
4. **VesselPicker** — region drill-down (ICA/MCA/ACA/Posterior tabs with count badges → big segment buttons) + removable selected chips. Vessel list and "large-vessel" set from `vessels.ts`.
5. **Switch / ToggleRow** — iOS-style switch for Tandem, Tortuosity, treatment toggles.
6. **AspectsCells** — 0–10 colored cells (red ≤5 / amber ≤7 / green ≥8) with label.
7. **IchScoreCard + radial VolumeDial** — live ICH score (range when volume unknown) + circular volume gauge with a "Not available" toggle that disables it.
8. **TrialPickerMulti** — searchable, pathway-grouped, multi-select trial cards (green checkbox).
9. **StatsBars** — horizontal stacked bars (enrolled + missed) + metric cards + missed-opportunities callout.
10. **SendRecord** — receipt + treatment toggles + notes + WhatsApp-style preview + channel buttons.

## Interactions & behavior
- **New patient → choice:** animated **Zoom** reveal overlay from the hero (origin = hero center). Other transitions (Sheet/Reveal/Split) exist in the prototype but Zoom is the chosen default.
- **Eligibility recompute** is live as fields change — wire inputs to the existing `eligibility` store + `acute-rules`/`hemorrhagic-rules`; do not reimplement the rules.
- **Multi-trial enrollment:** Results selection drives `trialSelection` store; Summary lists all; Confirm → Share.
- **Window classification** from LTSW uses minutes-since thresholds (≤270 IV thrombolysis, ≤360 EVT, ≤1440 EVT-selected, else closed) — keep consistent with existing domain logic if present.
- **Press states:** subtle scale(0.97) + brightness on tap; cards lift on hover. Respect `prefers-reduced-motion`.
- **i18n:** every label via `$t`; the prototype is bilingual EN/ES (the repo also has IT) — add missing keys, keep the toggle.

## State management (existing stores to wire to)
- `patient.ts` — current patient fields (PRN, age, NIHSS, mRS, LTSW, wake-up, imaging params, vessels, hemorrhagic params).
- `eligibility.ts` — computed eligible/ineligible trials + reasons.
- `trialSelection.ts` — multi-select set of trials to enroll.
- `savedPatients.ts` — past patients + review status + enrolled/eligible sets (for Past patients + statistics).
- `persistence.ts` — keep state across reloads.
- `theme.ts` — dark/light (ThemeToggle already wired).

## Files in this bundle
- `prototype/EnsApp Prototype.html` — **the full interactive prototype** (all flows; EN/ES + transition picker). Primary reference.
- `prototype/EnsApp Home redesign.html` — home direction explorations (the "Minimal / Focus" one is the chosen Home).
- `prototype/EnsApp Post-imaging.html` — vessel-picker variants (chosen: **B · Region drill-down**).
- `prototype/EnsApp Hemorrhagic and Send.html` — hemorrhagic param variants (chosen: live ICH score + radial volume dial) and Send variants (chosen: receipt + preview).
- `tokens.css` — drop-in replacement for `src/lib/styles/tokens.css`.

## Suggested execution order (for Claude Code)
1. Replace `src/lib/styles/tokens.css` with bundled `tokens.css`; load IBM Plex. Sanity-check `npm run dev`.
2. Restyle `App.svelte` shell (header + floating pill BottomNav).
3. Rebuild leaf components (Button/Card/Field/RadioGroup/Pill already token-driven — verify), then add the new components list above.
4. Rebuild routes in flow order: Landing → WorkflowSelector → PreImaging → PreResult → PostImaging → Summary → Share; then TrialsList/TrialDetail; then TrialPatient; then SavedPatients (+ statistics). Wire each to existing stores/domain — never reimplement clinical rules.
5. Add new i18n keys (EN/ES/IT). Run `npm run check`, `npm test`, and `npm run test:e2e`; fix regressions.
6. Manual pass against the prototype screen-by-screen for visual parity.
```
