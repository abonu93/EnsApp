import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession, fillPreImaging, pickSegment, setSlider } from "./helpers";

/**
 * Flusso emorragico golden end-to-end.
 *
 * Profilo: 65 anni, NIHSS 5, mRS 1, LTSW 1.5h, GCS 12, hemVolume 20 mL.
 * Atteso (golden-cases id hem-fastest-eligible): FASTEST = eligible.
 */

test.describe("hemorrhagic flow - FASTEST eligible", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await freshSession(page);
  });

  test("end-to-end: hemorrhagic with FASTEST eligible", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillPreImaging(page, { patientId: "E2E-HEM-001", age: 65, nihss: 5, mrs: 1, ltswHoursAgo: 1.5 });
    await page.getByRole("button", { name: /^next$/i }).click();

    // Continua al post-imaging dal pre-result
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page).toHaveURL(/\/post-imaging$/);

    // Hemorrhagic path (IVH isolata e crisi restano spente = "no")
    await pickSegment(page, "Stroke type", "Hemorrhagic");
    await setSlider(page, "Volume mL", 20);
    await setSlider(page, "GCS", 12);
    await pickSegment(page, "Secondary cause", "None");
    await pickSegment(page, "Anticoagulants (ongoing or in the last 7 days; for TICH-3 only ongoing therapy counts)", "None (antiplatelets allowed)");

    // FASTEST extra (LTSW=1.5h < 2h e mRS=1 <= 2 -> sezione visibile)
    await expect(page.getByText("FASTEST - Additional questions")).toBeVisible();
    await pickSegment(page, "Brainstem hemorrhage?", "No");
    await pickSegment(page, "Procoagulant drugs in last 24h?", "No");
    await pickSegment(page, "ECG: ST elevation consistent with acute myocardial ischemia?", "No");
    await pickSegment(page, "Symptomatic thrombo-embolic event in the past 90 days (ischemic stroke, MI, PE, DVT, unstable angina)?", "No");
    await pickSegment(page, "Pregnant, within 12 weeks post-partum, or lactating?", "No");
    await pickSegment(page, "Endarterectomy, angioplasty or stenting (carotid, coronary, cerebral) in the past 90 days?", "No");
    await pickSegment(page, "Extensive IVH: >= 2/3 of one lateral ventricle or >= 1/3 of both?", "No");

    await page.getByRole("button", { name: /^next$/i }).click();
    await expect(page).toHaveURL(/\/summary$/);

    // FASTEST + TICH-3 devono essere eligible
    const eligible = page.locator("button.card-pick");
    await expect(eligible.filter({ hasText: "FASTEST" })).toBeVisible();
    await expect(eligible.filter({ hasText: "TICH-3" })).toBeVisible();
  });

  test("FASTEST extra section hidden when LTSW too long", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillPreImaging(page, { age: 65, nihss: 5, mrs: 1, ltswHoursAgo: 5 });
    await page.getByRole("button", { name: /^next$/i }).click();
    await page.getByRole("button", { name: /^continue$/i }).click();

    await pickSegment(page, "Stroke type", "Hemorrhagic");
    // FASTEST extra non deve apparire
    await expect(page.getByText("Secondary cause")).toBeVisible();
    await expect(page.getByText("FASTEST - Additional questions")).toHaveCount(0);
  });
});
