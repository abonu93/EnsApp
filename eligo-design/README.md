# Eligo — Design Package

Brand & UI design system for **Eligo**, a stroke clinical-trial matching app
(patient ↔ trial eligibility). This folder is a self-contained design handoff:
open any `.html` file directly in a browser — no build step, no dependencies.

```
eligo-design/
├── README.md                      ← you are here
├── tokens.css                     design tokens as CSS custom properties
├── tokens.json                    same tokens, machine-readable
├── app/
│   └── Eligo App.html             full interactive prototype (iOS frame)
└── brand/
    ├── Eligo Logo.html            logo sheet — mark, lockups, colour, sizes
    └── Eligo Pathway System.html  the 3 stroke-pathway colour families
```

---

## Brand

**Name** — *Eligo* (Latin, “I select / I choose”).
**Wordmark** — Hanken Grotesk, 800, letter-spacing −0.05em.
**Tagline** — “Trial eligibility, in seconds”.

### The mark — *Overlap / Bold*
Two overlapping circles (sets); the **intersection is filled** — the matching
cohort where patient meets trial. Built on a 24×24 grid:

```html
<svg viewBox="0 0 24 24" fill="none">
  <!-- filled lens (the cohort) -->
  <path d="M12 7.45 A5.25 5.25 0 0 1 12 16.55 A5.25 5.25 0 0 1 12 7.45 Z" fill="#fff" fill-opacity="0.92"/>
  <circle cx="9.375"  cy="12" r="5.25" stroke="#fff" stroke-width="2.4"/>
  <circle cx="14.625" cy="12" r="5.25" stroke="#fff" stroke-width="2.4"/>
</svg>
```

On a brand tile the mark is white (`reverse`); on light it is two-tone
(`primary` + `primaryDk`, lens in `deep`). Minimum clear space = the circle
radius on every side. See **brand/Eligo Logo.html** for lockups (horizontal /
stacked / icon), colour treatments, and the favicon-down-to-16px size ramp.

---

## Colour — “Glacier”

A mature, cool pastel blue (soft-tech). Primary is `#4F8FBC`; the app canvas
is a glacier-tinted near-white, not pure grey.

| Token        | Hex       | Use                              |
|--------------|-----------|----------------------------------|
| `primary`    | `#4F8FBC` | brand, primary actions, links    |
| `primaryDk`  | `#1C4E6C` | gradient end, pressed, headings  |
| `primaryBg`  | `#E5F1F8` | tinted fills, selected surfaces  |
| `bg`         | `#EFF5F8` | app canvas                       |
| `bgSunken`   | `#E5EFF4` | recessed areas                   |
| `surface`    | `#FFFFFF` | cards                            |
| `line`       | `#DBEBF1` | hairlines / borders              |
| `ink`        | `#0F212A` | primary text                     |
| `ink2`       | `#44606E` | secondary text                   |
| `ink3`       | `#7F97A3` | tertiary text                    |

**Status** — ok `#2E9E7B` / bg `#E4F4EE` · warn `#B5832C` / bg `#F7EFDE` ·
danger `#C8524C` / bg `#F8E9E8`.

### Stroke pathways
One harmonised triad — equal weight & saturation, distinct hue — so the three
clinical pathways read as a family alongside the blue brand.

| Pathway        | Accent    | Surface   | Icon                         |
|----------------|-----------|-----------|------------------------------|
| Ischemic       | `#3F82AE` | `#E7F1F8` | occlusion (ring + core)      |
| Hemorrhagic    | `#C0675C` | `#F8EAE7` | droplet                      |
| Post-acute     | `#4A9A86` | `#E6F3EF` | recovery (rising trend)      |

These are wired into the stroke-type RadioCards and the trials catalog.
See **brand/Eligo Pathway System.html**.

---

## Type
- **Hanken Grotesk** (700/800) — wordmark & display headings only.
- **IBM Plex Sans** (400–700) — all UI text.
- **IBM Plex Mono** (400–600) — labels, codes, metadata, timers.

---

## App
**app/Eligo App.html** is the full clickable prototype inside an iOS frame:
home, guided new-patient intake, stroke-type selection, post-imaging
eligibility results, trials catalog (filterable by pathway), and past patients.
EN/IT bilingual. All design tokens live in the `ENS` object near the top of the
file; `tokens.css` / `tokens.json` mirror them for a production codebase.

> Implementation note: the prototype is a single self-contained HTML file using
> React + Babel from CDN for fast design iteration — treat it as a **visual spec**,
> not production architecture.
