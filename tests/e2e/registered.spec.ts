import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession } from "./helpers";

/**
 * Paziente registrato (ex Direct enrollment): paziente gia' arruolato,
 * registrato dopo la fase acuta. LTSW alla visita, studi con braccio, invio.
 */
test.describe("registered patient", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await freshSession(page);
  });

  test("dati -> LTSW riferito -> studio con braccio -> salvataggio", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /registered patient/i }).click();
    await expect(page).toHaveURL(/\/registered$/);
    await expect(page.locator("main h1")).toHaveText("Registered patient");

    // ID ed eta' (obbligatori)
    await expect(page.locator(".save")).toBeDisabled();
    await page.getByRole("button", { name: /^Patient ID:/ }).click();
    await page.getByRole("textbox", { name: "Patient ID" }).fill("REG-001");
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await page.getByRole("button", { name: /^Age:/ }).click();
    await page.getByRole("slider", { name: "Age" }).fill("68");
    await page.getByRole("button", { name: "Set 68" }).click();

    // LTSW alla visita, riferito in ore
    await page.locator("button.ltsw").click();
    await page.getByRole("radio", { name: "Hours from onset" }).click();
    await page.getByRole("button", { name: "4.5h", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await expect(page.locator(".ltsw-v")).toHaveText("4h 30m");

    // Studio con braccio: senza braccio non si salva
    await page.getByRole("button", { name: "+ Add trial" }).click();
    await page.getByRole("button", { name: /^ATHENA/ }).click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.getByText(/Needs arm for ATHENA/)).toBeVisible();
    await expect(page.locator(".save")).toBeDisabled();
    await page.getByRole("radio", { name: "Intervention" }).click();
    await expect(page.locator(".save")).toBeEnabled();

    let capturedBody = "";
    await page.route("**/script.google.com/**", async (route) => {
      if (route.request().method() === "GET") {
        const sent = JSON.parse(new URLSearchParams(capturedBody).get("payload") ?? "{}");
        const rows = capturedBody ? [{ timestamp: sent.Timestamp, N_patient: sent.N_patient }] : [];
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(rows) });
        return;
      }
      capturedBody = route.request().postData() ?? "";
      await route.fulfill({ status: 200, contentType: "text/plain", body: "OK" });
    });
    await page.locator(".save").click();
    await expect.poll(() => capturedBody.length, { timeout: 5_000 }).toBeGreaterThan(0);
    const payload = JSON.parse(new URLSearchParams(capturedBody).get("payload") ?? "{}");
    expect(payload.source).toBe("quick-patient");
    expect(payload.N_patient).toBe("REG-001");
    expect(payload.Age).toBe(68);
    expect(payload.LTSW_h).toBe(4.5);
    expect(payload.ATHENA).toBe("intervention");
    expect(payload.Seen_at).toBeTruthy();

    const saved = page.getByRole("dialog", { name: "Saved to the sheet" });
    await expect(saved).toBeVisible({ timeout: 10_000 });
    await expect(saved.locator("pre.msg")).toContainText("LTSW at evaluation: 4h 30m (reported)");
  });

  test("studio in doppio cieco: nessun braccio richiesto", async ({ page }) => {
    await page.goto("/#/registered");
    await page.getByRole("button", { name: "+ Add trial" }).click();
    await page.getByRole("button", { name: /^SOVATELTIDE/ }).click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(page.getByText(/double-blind vs placebo: no arm/)).toBeVisible();
    await expect(page.getByRole("radio", { name: "Intervention" })).toHaveCount(0);
  });
});
