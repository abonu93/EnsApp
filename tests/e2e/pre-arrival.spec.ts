import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession } from "./helpers";

/**
 * Pre-arrivo: chiamata del SEM -> paziente in arrivo con gli studi contati
 * all'ora di arrivo -> arrivato, il board parte con i dati del SEM.
 */

test.describe("pre-arrival", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await freshSession(page);
  });

  test("chiamata SEM -> in arrivo -> board", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /code stroke/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Pre-arrival/ }).click();
    await expect(page).toHaveURL(/\/pre-arrival$/);

    // Senza l'ultima volta visto bene non si salva.
    await expect(page.getByRole("button", { name: "Set last seen well to save" })).toBeDisabled();

    await page.getByRole("textbox", { name: "CIP" }).fill("roca 0480512001");
    await expect(page.getByRole("textbox", { name: "CIP" })).toHaveValue("ROCA0480512001");
    await page.getByRole("textbox", { name: "Age" }).fill("78");
    await page.locator("button.clock-btn").click();
    await page.getByRole("button", { name: "−1h", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await page.getByRole("group", { name: "Pre-stroke mRS" }).getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("group", { name: "RACE" }).getByRole("button", { name: "7", exact: true }).click();
    await expect(page.getByText("≥ 5 · LVO suspected")).toBeVisible();
    await page.getByRole("group", { name: "Antithrombotics" }).getByRole("button", { name: "DOAC", exact: true }).click();
    await page.getByRole("group", { name: "Arrival in" }).getByRole("button", { name: "15′", exact: true }).click();
    await page.getByRole("button", { name: "Save · incoming" }).click();

    await expect(page).toHaveURL(/\/incoming$/);
    await expect(page.locator(".eta")).toHaveText("15m");
    await expect(page.locator(".cip")).toHaveText("ROCA0480512001");
    await expect(page.locator("#inc-count")).toContainText("possible at arrival");
    await expect(page.getByText("Windows counted to arrival ≈ 12:15.")).toBeVisible();

    // FASTEST e' fuori per il DOAC
    await page.getByRole("button", { name: /out before arrival/ }).click();
    await expect(page.locator(".trial", { hasText: "FASTEST" })).toBeVisible();

    // Si riprende dalla home
    await page.goto("/");
    await page.getByRole("button", { name: /Incoming · SEM/ }).click();
    await expect(page).toHaveURL(/\/incoming$/);

    await page.getByRole("button", { name: "Patient arrived · open board" }).click();
    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator(".bar .cip")).toContainText("ROCA0480512001 · SEM · DOAC");
    await expect(page.locator(".elapsed")).toHaveText("1h 00m");
    await expect(page.getByRole("button", { name: /^Age: 78/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Pre-stroke mRS: 1/ })).toBeVisible();
  });

  test("dal board: + New patient -> In the ED svuota il board", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /code stroke/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
    await page.getByRole("button", { name: /^Age:/ }).click();
    await page.getByRole("slider", { name: "Age" }).fill("70");
    await page.getByRole("button", { name: "Set 70" }).click();
    await expect(page.getByRole("button", { name: /^Age: 70/ })).toBeVisible();

    await page.getByRole("button", { name: "+ New patient" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
    await expect(page.getByRole("button", { name: /^Age: —/ })).toBeVisible();

    await page.getByRole("button", { name: "+ New patient" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Pre-arrival/ }).click();
    await expect(page).toHaveURL(/\/pre-arrival$/);
  });
});
