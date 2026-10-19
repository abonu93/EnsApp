import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

export type Locale = "ca" | "es" | "en";

/**
 * Ora fissa usata dai flussi: il picker LTSW parte da "adesso - 2h", quindi
 * con un orario di mezzogiorno i bump +/- non scavalcano mai la mezzanotte.
 */
export const FIXED_NOW = new Date("2025-06-15T12:00:00");

/**
 * Naviga alla home con storage pulito. Da chiamare in `beforeEach`
 * per garantire indipendenza dei test. Lo splash viene marcato come gia'
 * visto per non coprire la UI durante i test.
 */
export async function freshSession(page: Page, locale: Locale = "en") {
  await page.goto("/");
  await page.evaluate((l) => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem("ensapp:locale:v1", l);
    sessionStorage.setItem("eligo:splash:seen", "1");
  }, locale);
  await page.goto("/");
}

/** Verifica il pattern di a11y di un'app shell SPA: lang attr + skip link + main landmark. */
export async function assertAppShell(page: Page, lang: Locale = "en") {
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await expect(page.locator("a.skip-link")).toBeAttached();
  await expect(page.locator("main#main")).toBeVisible();
}

/**
 * Seleziona un'opzione in un Segmented control. Il gruppo e' trovato per nome
 * accessibile (prop `label`) oppure, se il nome manca, tramite l'etichetta
 * `.lbl` del `.field` che lo contiene.
 */
export async function pickSegment(page: Page, groupLabel: string, option: string) {
  const named = page.getByRole("radiogroup", { name: groupLabel, exact: true });
  const group =
    (await named.count()) > 0
      ? named
      : page
          .locator(".field")
          .filter({ has: page.locator(".lbl").getByText(groupLabel, { exact: true }) })
          .getByRole("radiogroup");
  await group.getByRole("radio", { name: option, exact: true }).click();
}

/** Imposta un input range (NIHSS, GCS, volume) tramite il suo nome accessibile. */
export async function setSlider(page: Page, name: string, value: number) {
  await page.getByRole("slider", { name, exact: true }).fill(String(value));
}

/**
 * Imposta l'LTSW dal picker: il calendario parte da FIXED_NOW - 2h, poi
 * aggiusta ore e minuti per arrivare a `hoursAgo`.
 * Richiede `page.clock.setFixedTime(FIXED_NOW)`.
 */
export async function setLtswHoursAgo(page: Page, hoursAgo: number) {
  await page.locator("#pre-ltsw").click();
  const deltaMin = Math.round((2 - hoursAgo) * 60);
  const hours = Math.trunc(deltaMin / 60);
  const minutes = deltaMin - hours * 60;
  for (let i = 0; i < Math.abs(hours); i++) {
    await page.getByRole("button", { name: hours > 0 ? "+1" : "-1", exact: true }).click();
  }
  for (let i = 0; i < Math.abs(minutes) / 5; i++) {
    await page.getByRole("button", { name: minutes > 0 ? "+5" : "-5", exact: true }).click();
  }
  await page.getByRole("button", { name: /^confirm/i }).click();
}

/** Compila la schermata pre-imaging con i dati minimi richiesti. */
export async function fillPreImaging(
  page: Page,
  p: { patientId?: string; age: number; nihss: number; mrs: number; ltswHoursAgo: number }
) {
  if (p.patientId) await page.getByRole("textbox", { name: /patient record/i }).fill(p.patientId);
  await page.getByRole("textbox", { name: /^age/i }).fill(String(p.age));
  await setSlider(page, "NIHSS", p.nihss);
  await pickSegment(page, "pre-mRS", String(p.mrs));
  await setLtswHoursAgo(page, p.ltswHoursAgo);
  await pickSegment(page, "Philips angiograph available?", "Yes");
  await pickSegment(page, "DOAC (NOAC) in the previous 48h?", "No");
  await pickSegment(page, "ACE inhibitor (IECA) in therapy?", "No");
}
