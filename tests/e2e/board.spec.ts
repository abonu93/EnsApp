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
    await page.getByRole("button", { name: /stroke code/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
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

    // Finestra non ancora aperta (DONE SYMPLE 24-72 h, qui 1 h): non e' fra i possibili
    await expect(page.locator("ul.trials").first().locator("button.trial", { hasText: "DONE SYMPLE" })).toHaveCount(0);

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
    // Dopo il dato si resta sulla scheda dello studio
    const weTrust = page.getByRole("dialog", { name: "WeTrust" });
    await expect(weTrust).toBeVisible();
    await expect(weTrust.getByText("Eligible", { exact: true })).toBeVisible();
    await weTrust.getByRole("button", { name: "Close" }).click();

    // Occlusione M1 + ICA/CCA extracranica = tandem
    await page.getByRole("button", { name: /^Occlusion on CTA:/ }).click();
    await page.getByRole("button", { name: "M1", exact: true }).click();
    await page.getByRole("button", { name: /Extracranial ICA\/CCA/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await expect(page.getByRole("button", { name: /^Occlusion on CTA: M1 \+ ICA\/CCA ext/ })).toBeVisible();
    // Dubbio aperto del vault con M1: TWIN-2-WIN 2 "check"
    await page.getByRole("button", { name: /^EVT candidate:/ }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Yes", exact: true }).click();
    await expect(page.locator("button.trial", { hasText: "TWIN-2-WIN 2" }).locator(".tag.check")).toBeVisible();
    // PIVOTAL esclude il tandem
    await expect(page.locator("ul.trials").first().locator("button.trial", { hasText: "PIVOTAL" })).toHaveCount(0);

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
    // Senza ID paziente non si invia
    await expect(page.getByRole("button", { name: /send to sheet/i })).toBeDisabled();
    await expect(page.getByText("Enter the patient ID to send.")).toBeVisible();
    await page.getByRole("textbox", { name: "Patient ID" }).fill("E2E-BOARD-1");
    // EVT gia' indicata nel board: niente domanda TEV, solo mTICI
    await expect(page.locator(".given", { hasText: "Thrombectomy (TEV)" })).toContainText("Yes");
    await page.locator("#share-mtici").selectOption("2b67");
    await expect(page.locator("pre.preview")).toContainText("Occlusion: M1 + extracranial ICA/CCA (tandem)");
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
    // Swipe verso il basso sulla scheda
    await page.locator("button.trial", { hasText: "PIVOTAL" }).click();
    await expect(dialog).toBeVisible();
    await dialog.evaluate((el) => {
      const touch = (y: number) => new Touch({ identifier: 1, target: el, clientX: 200, clientY: y });
      el.dispatchEvent(new TouchEvent("touchstart", { touches: [touch(300)], bubbles: true }));
      for (const y of [320, 360, 420, 480]) {
        el.dispatchEvent(new TouchEvent("touchmove", { touches: [touch(y)], bubbles: true, cancelable: true }));
      }
      el.dispatchEvent(new TouchEvent("touchend", { touches: [], bubbles: true }));
    });
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
