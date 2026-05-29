import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Naviga alla home con storage pulito. Da chiamare in `beforeEach`
 * per garantire indipendenza dei test.
 */
export async function freshSession(page: Page, locale: "it" | "en" | "es" = "it") {
  await page.goto("/");
  await page.evaluate((l) => {
    localStorage.clear();
    localStorage.setItem("ensapp:locale:v1", l);
  }, locale);
  await page.goto("/");
}

/** Verifica il pattern di a11y di un'app shell SPA: lang attr + skip link + main landmark. */
export async function assertAppShell(page: Page, lang = "it") {
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await expect(page.locator("a.skip-link")).toBeAttached();
  await expect(page.locator("main#main")).toBeVisible();
}

/** Compila un NumberField identificato dal suo id input. */
export async function fillNumber(page: Page, id: string, value: number | string) {
  await page.locator(`#${id}`).fill(String(value));
}

/** Seleziona un'opzione in un RadioGroup tramite click sul label visibile. */
export async function selectRadio(page: Page, groupId: string, value: string) {
  await page.locator(`label[for="${groupId}-${value}"]`).click();
}

/** Toggle di una checkbox in CheckboxGroup. */
export async function toggleCheckbox(page: Page, groupId: string, value: string) {
  await page.locator(`label[for="${groupId}-${value}"]`).click();
}
