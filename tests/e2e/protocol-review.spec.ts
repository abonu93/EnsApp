import { test, expect } from "@playwright/test";
import { freshSession } from "./helpers";

test("revisione dei protocolli: segna un punto e lo ritrova dopo il reload", async ({ page }) => {
  await freshSession(page, "en");
  await page.goto("/#/review");
  await expect(page.getByRole("heading", { name: "Protocol review" })).toBeVisible();
  // Lo script finto risponde []: revisione solo su questo dispositivo.
  await expect(page.getByText("Saved on this device only", { exact: false })).toBeVisible();

  const item = page.locator('li[data-id="ten-diabetes"]');
  await expect(item).toContainText("Diabetes");
  await item.getByRole("radio", { name: "Confirmed" }).click();
  await item.getByRole("textbox").fill("Fix the summary");
  await item.getByRole("textbox").blur();
  await expect(item).toHaveAttribute("data-status", "agree");

  await page.reload();
  const again = page.locator('li[data-id="ten-diabetes"]');
  await expect(again).toHaveAttribute("data-status", "agree");
  await expect(again.getByRole("textbox")).toHaveValue("Fix the summary");

  // Filtro "da rivedere": il punto confermato sparisce.
  await page.getByRole("radio", { name: "To review" }).first().click();
  await expect(page.locator('li[data-id="ten-diabetes"]')).toHaveCount(0);
});

test("revisione dei protocolli: testi in spagnolo", async ({ page }) => {
  await freshSession(page, "es");
  await page.goto("/#/review");
  await expect(page.getByRole("heading", { name: "Revisión de los protocolos" })).toBeVisible();
  await expect(page.locator('li[data-id="ten-diabetes"]')).toContainText("Solo excluye ictus previo");
});
