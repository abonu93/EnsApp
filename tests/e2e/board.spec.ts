import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession } from "./helpers";

/**
 * Bedside Board: ingresso dal workflow, dati inseriti in ordine libero,
 * dettaglio di uno studio e invio al foglio con source "board".
 */

test.describe("bedside board", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await freshSession(page);
  });

  test("dati parziali -> selezione -> riepilogo -> invio al foglio", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /bedside board/i }).click();
    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator("main h1")).toHaveText("Bedside board");

    // Orologio: esordio noto, 1 h fa
    await page.locator("button.clock").click();
    await page.getByRole("button", { name: "−1h", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await expect(page.locator(".elapsed")).toHaveText("1h 00m");

    // Dati in ordine libero
    await page.getByRole("button", { name: /^NIHSS:/ }).click();
    await page.getByRole("slider", { name: "NIHSS" }).fill("14");
    await page.getByRole("button", { name: "Set 14" }).click();
    await page.getByRole("button", { name: /^Age:/ }).click();
    await page.getByRole("slider", { name: "Age" }).fill("70");
    await page.getByRole("button", { name: "Set 70" }).click();
    await page.getByRole("button", { name: /^Pre-stroke mRS:/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "1", exact: true }).click();

    // Prima della TC: tutto "possibile", il prossimo dato e' l'imaging
    await expect(page.locator("#board-count")).toContainText("possible");
    await expect(page.getByRole("button", { name: /^Next: Imaging/ })).toBeVisible();

    await page.getByRole("button", { name: /^Imaging:/ }).click();
    await page.getByRole("button", { name: "Ischemic", exact: true }).click();
    await expect(page.getByRole("button", { name: /^Imaging: Ischemic/ })).toBeVisible();

    // Dubbi aperti del vault (open-questions.ts): DONE SYMPLE con mRS 1 a 70 anni
    await expect(page.locator("button.trial", { hasText: "DONE SYMPLE" }).locator(".tag.check")).toBeVisible();

    // Dettaglio studio: i criteri si aprono come dialog
    await page.locator("button.trial", { hasText: "PIVOTAL" }).click();
    const dialog = page.getByRole("dialog", { name: "PIVOTAL" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("LTSW < 8 h")).toBeVisible();
    await page.keyboard.press("Escape");

    // WeTrust: manca solo l'angiografo, si risponde dal suo criterio
    await page.locator("button.trial", { hasText: "WeTrust" }).click();
    await page.getByRole("dialog", { name: "WeTrust" }).getByRole("button", { name: /Philips angiograph available/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Yes", exact: true }).click();
    await page.keyboard.press("Escape");

    // Studio eleggibile -> selezione -> Avanti -> schermata di invio
    await page.getByRole("button", { name: "Select WeTrust" }).click();
    await page.getByRole("button", { name: /^Next · 1/ }).click();
    await expect(page).toHaveURL(/\/share$/);

    // Share con source "board"
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
    await page.getByRole("textbox", { name: "Patient ID" }).fill("E2E-BOARD-1");
    // Il primo radiogroup e' la trombectomia (TEV); poi la TIV.
    await page.getByRole("radiogroup").first().getByText("Yes", { exact: true }).click();
    await page.locator("#share-mtici").selectOption("2b67");
    await page.locator("textarea.notes").fill("board e2e");
    await page.getByRole("button", { name: /send to sheet/i }).click();
    await expect.poll(() => capturedBody.length, { timeout: 5_000 }).toBeGreaterThan(0);
    const payload = JSON.parse(new URLSearchParams(capturedBody).get("payload") ?? "{}");
    expect(payload.source).toBe("board");
    expect(payload.N_patient).toBe("E2E-BOARD-1");
    expect(payload.NIHSS).toBe(14);
    expect(payload.WeTrust).toBe("intervention");
    expect(payload.TEV).toBe("Yes");
    expect(payload.mTICI).toBe("2b67");
    expect(payload.Notes).toBe("board e2e");
  });

  test("le schede si chiudono: indietro del telefono e pulsante X", async ({ page }) => {
    await page.goto("/#/board");
    await page.locator("button.trial", { hasText: "PIVOTAL" }).click();
    const dialog = page.getByRole("dialog", { name: "PIVOTAL" });
    await expect(dialog).toBeVisible();
    await page.goBack();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/board$/);

    await page.locator("button.trial", { hasText: "PIVOTAL" }).click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/\/board$/);
    // La voce aggiunta per il foglio e' stata tolta: indietro lascia il board.
    await page.goBack();
    await expect(page).not.toHaveURL(/\/board$/);
  });

  test("lingua: i criteri sono tradotti (spagnolo)", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("ensapp:locale:v1", "es"));
    await page.goto("/#/board");
    await page.reload();
    await page.locator("button.trial", { hasText: "PIVOTAL" }).click();
    const dialog = page.getByRole("dialog", { name: "PIVOTAL" });
    await expect(dialog.getByText("sin oclusión en tándem")).toBeVisible();
    await expect(dialog.getByText("no occlusione tandem")).toHaveCount(0);
  });
});
