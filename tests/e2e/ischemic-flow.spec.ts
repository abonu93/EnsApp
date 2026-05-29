import { test, expect } from "@playwright/test";
import { freshSession, fillNumber, selectRadio, toggleCheckbox } from "./helpers";

/**
 * Flusso ischemico golden end-to-end:
 * Landing -> Workflow -> PreImaging -> PreResult -> PostImaging -> Summary -> Share
 *
 * Profilo: paziente di 70 anni, NIHSS 14, mRS 1, LTSW 3h, M1 -> classico LVO M1.
 * Eligibility attesa (da golden-cases.json id ischemic-classic-lvo-m1-eligible):
 *   weTrust=true, athena=true, vanish=true, pivotal=true, promise=true, ...
 *
 * Il test verifica:
 *  1) navigazione completa con persistenza al refresh
 *  2) almeno N trial eligibili in Summary
 *  3) payload finale verso Apps Script ha la shape attesa (intercept)
 */

test.describe("ischemic flow - golden patient", () => {
  test.beforeEach(async ({ page }) => {
    await freshSession(page);
  });

  test("end-to-end: pre-imaging -> share with intercept", async ({ page }) => {
    // -- Landing --
    await page.goto("/");
    await page.getByRole("button", { name: /nuovo paziente/i }).click();
    await expect(page).toHaveURL(/\/workflow$/);

    // -- WorkflowSelector --
    await page.getByText("Valutazione eligibility").click();
    await expect(page).toHaveURL(/\/pre-imaging$/);

    // -- PreImaging --
    await page.locator("#pre-pid").fill("E2E-2025-001");
    await fillNumber(page, "pre-age", 70);
    await fillNumber(page, "pre-nihss", 14);
    await fillNumber(page, "pre-mrs", 1);
    await fillNumber(page, "pre-ltsw", 3);
    await selectRadio(page, "pre-angio", "yes");
    await selectRadio(page, "pre-doac", "no");
    await selectRadio(page, "pre-acei", "no");
    await page.getByRole("button", { name: /^avanti$/i }).click();
    await expect(page).toHaveURL(/\/pre-result$/);

    // -- PreResult: WeTrust deve essere eligible --
    await expect(page.locator("main").getByText(/eleggibile/i).first()).toBeVisible();
    // Continue al post-imaging
    await page.getByRole("button", { name: /^continua$/i }).click();
    await expect(page).toHaveURL(/\/post-imaging$/);

    // -- PostImaging: ischemic + EVT --
    await selectRadio(page, "post-stroke", "ischemic");
    await selectRadio(page, "post-candidate", "eligible");
    await selectRadio(page, "post-ivt", "eligible");
    await selectRadio(page, "post-tandem", "no");
    await selectRadio(page, "post-tort", "no");
    await toggleCheckbox(page, "post-vessels", "m1");
    await selectRadio(page, "post-contra", "no");
    await fillNumber(page, "post-aspects", 8);
    await page.getByRole("button", { name: /^avanti$/i }).click();
    await expect(page).toHaveURL(/\/summary$/);

    // -- Summary: deve elencare WeTrust e altri trial eligibili --
    await expect(page.getByText("WeTrust", { exact: true })).toBeVisible();
    // Seleziona WeTrust come trial principale
    await page.locator("label.row").filter({ hasText: "WeTrust" }).click();

    // Persistenza: refresh non deve perdere la selezione
    await page.reload();
    await page.waitForSelector("main h1");
    await expect(page.locator("label.row.checked")).toHaveCount(1);

    // -- Procedi al Share --
    await page.getByRole("button", { name: /procedi.*\(1\)/i }).click();
    await expect(page).toHaveURL(/\/share$/);

    // -- Share: intercetta la POST verso Apps Script --
    const sheetCall = page.waitForRequest(
      (req) => req.method() === "POST" && req.url().includes("script.google.com")
    );

    await page.getByRole("button", { name: /invia a sheet/i }).click();

    const req = await sheetCall;
    const body = req.postData() ?? "";
    expect(body).toContain("payload=");
    // Decodifica il payload x-www-form-urlencoded
    const params = new URLSearchParams(body);
    const payload = JSON.parse(decodeURIComponent(params.get("payload") ?? "{}"));
    expect(payload.patientId).toBe("E2E-2025-001");
    expect(payload.age).toBe(70);
    expect(payload.nihss).toBe(14);
    expect(payload.WeTrust).toBe("intervention");

    // Feedback successo
    await expect(page.getByText(/salvato con successo/i)).toBeVisible();
  });

  test("persistence: refresh keeps wizard state mid-flow", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillNumber(page, "pre-age", 55);
    await fillNumber(page, "pre-nihss", 7);
    await fillNumber(page, "pre-mrs", 0);

    await page.reload();
    await page.waitForSelector("main h1");
    await expect(page.locator("#pre-age")).toHaveValue("55");
    await expect(page.locator("#pre-nihss")).toHaveValue("7");
    await expect(page.locator("#pre-mrs")).toHaveValue("0");

    // Banner di resume su landing
    await page.goto("/#/");
    await expect(page.getByText(/in lavorazione/i)).toBeVisible();
  });

  test("language switch updates UI immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main h1")).toContainText("EnsApp");
    await expect(page.getByRole("button", { name: /nuovo paziente/i })).toBeVisible();

    // Apri menu lingue e seleziona English
    await page.getByRole("button", { name: /lingua/i }).click();
    await page.getByRole("menuitem", { name: /english/i }).click();

    await expect(page.getByRole("button", { name: /new patient/i })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Persistenza locale
    await page.reload();
    await expect(page.getByRole("button", { name: /new patient/i })).toBeVisible();
  });
});
