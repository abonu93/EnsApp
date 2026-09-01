import { test, expect } from "@playwright/test";
import {
  freshSession,
  freezeClock,
  clickNext,
  screen,
  fillLabeled,
  pickSegmented,
  setRange,
  setSwitch,
  setLtswHoursAgo,
} from "./helpers";

/**
 * Flusso emorragico golden end-to-end.
 *
 * Profilo: 65 anni, NIHSS 5, mRS 1, LTSW 1h, GCS 12, hemVolume 20 mL.
 * Atteso (golden-cases id hem-fastest-eligible): FASTEST = eligible.
 *
 * I test girano in inglese: le asserzioni sui testi usano il dizionario en.
 */

test.describe("hemorrhagic flow - FASTEST eligible", () => {
  test.beforeEach(async ({ page }) => {
    await freshSession(page, "en");
    await freezeClock(page);
  });

  test("end-to-end: hemorrhagic with FASTEST eligible", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillLabeled(page, /Patient record number/i, "E2E-HEM-001");
    await fillLabeled(page, /Age/i, 65);
    await setRange(page, "NIHSS", 5);
    await pickSegmented(page, "pre-mRS", "1");
    // LTSW 1h fa: dentro la finestra FASTEST (< 2h)
    await setLtswHoursAgo(page, "pre-ltsw", 1);
    await pickSegmented(page, /angiograph/i, "Yes");
    await pickSegmented(page, /DOAC/i, "No");
    await pickSegmented(page, /ACE/i, "No");
    await clickNext(page);

    // Continua al post-imaging dal pre-result
    await clickNext(page);
    await expect(page).toHaveURL(/\/post-imaging$/);

    // Hemorrhagic path
    await pickSegmented(page, "Stroke type", "Hemorrhagic");
    await setRange(page, "Volume mL", 20);
    await setRange(page, "GCS", 12);
    await setSwitch(page, /Isolated IVH/i, false);
    await pickSegmented(page, /Secondary cause/i, "None");
    await setSwitch(page, /TXA exclusion/i, false);
    await pickSegmented(page, /Anticoagulant therapy/i, "None");

    // FASTEST extra (LTSW=1h < 2h e mRS=1 <= 2 -> sezione visibile)
    await expect(screen(page).getByText(/FASTEST - Additional questions/i)).toBeVisible();
    await pickSegmented(page, /Brainstem hemorrhage/i, "No");
    await pickSegmented(page, /Procoagulant drugs/i, "No");
    await pickSegmented(page, /ECG abnormalities/i, "No");
    await pickSegmented(page, /acute thrombosis/i, "No");
    await pickSegmented(page, /Pregnancy/i, "No");
    await pickSegmented(page, /angioplasty/i, "No");
    await pickSegmented(page, /IVH score/i, "Yes");

    await clickNext(page);
    await expect(page).toHaveURL(/\/summary$/);

    // FASTEST + TICH-3 devono essere eligible
    await expect(page.locator(".card-pick").filter({ hasText: "FASTEST" })).toBeVisible();
    await expect(page.locator(".card-pick").filter({ hasText: "TICH-3" })).toBeVisible();
  });

  test("FASTEST extra section hidden when LTSW too long", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillLabeled(page, /Age/i, 65);
    await setRange(page, "NIHSS", 5);
    await pickSegmented(page, "pre-mRS", "1");
    // LTSW 5h fa: oltre la finestra FASTEST extra
    await setLtswHoursAgo(page, "pre-ltsw", 5);
    await pickSegmented(page, /angiograph/i, "Yes");
    await pickSegmented(page, /DOAC/i, "No");
    await pickSegmented(page, /ACE/i, "No");
    await clickNext(page);
    await clickNext(page);

    await pickSegmented(page, "Stroke type", "Hemorrhagic");
    // FASTEST extra non deve apparire
    await expect(screen(page).getByText(/FASTEST - Additional questions/i)).toHaveCount(0);
  });
});
