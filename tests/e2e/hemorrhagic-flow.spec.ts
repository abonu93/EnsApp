import { test, expect } from "@playwright/test";
import { freshSession, fillNumber, selectRadio } from "./helpers";

/**
 * Flusso emorragico golden end-to-end.
 *
 * Profilo: 65 anni, NIHSS 5, mRS 1, LTSW 1.5h, GCS 12, hemVolume 20 mL.
 * Atteso (golden-cases id hem-fastest-eligible): FASTEST = eligible.
 */

test.describe("hemorrhagic flow - FASTEST eligible", () => {
  test.beforeEach(async ({ page }) => {
    await freshSession(page);
  });

  test("end-to-end: hemorrhagic with FASTEST eligible", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await page.locator("#pre-pid").fill("E2E-HEM-001");
    await fillNumber(page, "pre-age", 65);
    await fillNumber(page, "pre-nihss", 5);
    await fillNumber(page, "pre-mrs", 1);
    // LTSW datetime: 1.5 ore fa
    {
      const dt = new Date(Date.now() - 1.5 * 3600 * 1000).toISOString().slice(0, 16);
      await page.locator("#pre-ltsw").fill(dt);
    }
    await selectRadio(page, "pre-angio", "yes");
    await selectRadio(page, "pre-doac", "no");
    await selectRadio(page, "pre-acei", "no");
    await page.getByRole("button", { name: /^avanti$/i }).click();

    // Continua al post-imaging dal pre-result
    await page.getByRole("button", { name: /^continua$/i }).click();
    await expect(page).toHaveURL(/\/post-imaging$/);

    // Hemorrhagic path
    await selectRadio(page, "post-stroke", "hemorrhagic");
    await fillNumber(page, "post-hemvol", 20);
    await fillNumber(page, "post-gcs", 12);
    await selectRadio(page, "post-ivh", "no");
    await selectRadio(page, "post-sec", "None");
    await selectRadio(page, "post-seizure", "no");
    await selectRadio(page, "post-anti", "none");

    // FASTEST extra (LTSW=1.5h < 2h e mRS=1 <= 2 -> sezione visibile)
    await expect(page.getByText(/FASTEST/i).first()).toBeVisible();
    await selectRadio(page, "post-brain", "no");
    await selectRadio(page, "post-proco", "no");
    await selectRadio(page, "post-ecg", "no");
    await selectRadio(page, "post-thrombosis", "no");
    await selectRadio(page, "post-pregn", "no");
    await selectRadio(page, "post-angio", "no");
    await selectRadio(page, "post-ivhscore", "yes");

    await page.getByRole("button", { name: /^avanti$/i }).click();
    await expect(page).toHaveURL(/\/summary$/);

    // FASTEST + TICH-3 devono essere eligible
    await expect(page.getByText("FASTEST", { exact: true })).toBeVisible();
    await expect(page.getByText("TICH-3", { exact: true })).toBeVisible();
  });

  test("FASTEST extra section hidden when LTSW too long", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillNumber(page, "pre-age", 65);
    await fillNumber(page, "pre-nihss", 5);
    await fillNumber(page, "pre-mrs", 1);
    {
      // LTSW 5h fa: oltre la finestra FASTEST extra
      const dt = new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 16);
      await page.locator("#pre-ltsw").fill(dt);
    }
    await selectRadio(page, "pre-angio", "yes");
    await selectRadio(page, "pre-doac", "no");
    await selectRadio(page, "pre-acei", "no");
    await page.getByRole("button", { name: /^avanti$/i }).click();
    await page.getByRole("button", { name: /^continua$/i }).click();

    await selectRadio(page, "post-stroke", "hemorrhagic");
    // FASTEST extra non deve apparire
    await expect(page.getByText(/FASTEST - Domande aggiuntive/i)).toHaveCount(0);
  });
});
