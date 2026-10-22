import { test, expect, type Page } from "@playwright/test";
import { FIXED_NOW, freshSession } from "./helpers";

/** Piu' pazienti in contemporanea: dal board e dalla Home si passa dall'uno all'altro. */

async function setAge(page: Page, age: number) {
  await page.getByRole("button", { name: /^Age:/ }).click();
  await page.getByRole("slider", { name: "Age" }).fill(String(age));
  await page.getByRole("button", { name: `Set ${age}` }).click();
}

test("due pazienti aperti insieme", async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);
  await freshSession(page);
  await page.goto("/#/board");
  await setAge(page, 64);

  // Secondo paziente: il primo resta aperto.
  await page.getByRole("button", { name: "+ New patient" }).click();
  await expect(page.getByText("The current patient stays open among the other patients.")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
  await expect(page.getByRole("button", { name: /^Age: —/ })).toBeVisible();
  await setAge(page, 80);

  // Dal board si torna al primo.
  await page.getByRole("button", { name: "+1 patients" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /64 years/ }).click();
  await expect(page.getByRole("button", { name: /^Age: 64/ })).toBeVisible();

  // In Home: il paziente attivo e l'altro, che si riprende con un tocco.
  await page.goto("/");
  await expect(page.getByText(/active session/i)).toBeVisible();
  const other = page.getByRole("region", { name: "Other open patients" });
  await other.locator(".shared-row", { hasText: "80 years" }).click();
  await expect(page).toHaveURL(/\/board$/);
  await expect(page.getByRole("button", { name: /^Age: 80/ })).toBeVisible();

  // Chiuso dalla Home, non c'e' piu'.
  await page.goto("/");
  await page.getByRole("button", { name: /^Close: 64 years/ }).click();
  await expect(page.getByRole("region", { name: "Other open patients" })).toHaveCount(0);
});
