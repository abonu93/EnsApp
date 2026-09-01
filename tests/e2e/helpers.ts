import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/** Lingue effettivamente esposte dall'app (src/lib/i18n/index.ts). */
export type Locale = "ca" | "es" | "en";

/**
 * Blocca i webfont remoti (tokens.css importa Google Fonts). Senza questo la
 * suite dipende da una CDN esterna: dove non e' raggiungibile l'evento `load`
 * arriva solo dopo il timeout della richiesta (~13s), oltre il
 * navigationTimeout configurato, e ogni test fallisce su page.goto.
 * I fallback di sistema in --font-sans coprono il rendering.
 */
async function blockRemoteFonts(page: Page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
}

/**
 * Naviga alla home con storage pulito. Da chiamare in `beforeEach`
 * per garantire indipendenza dei test.
 *
 * Le lingue esposte dall'app sono ca/es/en (l'italiano e' stato rimosso):
 * un locale non riconosciuto verrebbe silenziosamente riportato al default es.
 *
 * La splash e' un overlay full-screen da ~2.25s che intercetterebbe i primi
 * click: la marchiamo come gia' vista (addInitScript, cosi' vale da subito).
 */
export async function freshSession(page: Page, locale: Locale = "es") {
  await blockRemoteFonts(page);
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("eligo:splash:seen", "1");
    } catch {
      /* storage non disponibile: la splash si chiude comunque da sola */
    }
  });
  await page.goto("/");
  await page.evaluate((l) => {
    localStorage.clear();
    localStorage.setItem("ensapp:locale:v1", l);
  }, locale);
  await page.goto("/");
}

/**
 * Congela Date.now() a mezzogiorno di una data fissa. Serve ai flussi che
 * impostano LTSW: il CalendarSheet parte da "adesso - 2h" e gli stepper orari
 * lavorano modulo 24, quindi vicino alla mezzanotte il calcolo cambierebbe
 * giorno. setFixedTime non tocca i timer (la splash continua a funzionare).
 */
export async function freezeClock(page: Page, iso = "2026-03-10T12:00:00") {
  await page.clock.setFixedTime(new Date(iso));
}

/** Verifica il pattern di a11y di un'app shell SPA: lang attr + skip link + main landmark. */
export async function assertAppShell(page: Page, lang: Locale = "es") {
  await expect(page.locator("html")).toHaveAttribute("lang", lang);
  await expect(page.locator("a.skip-link")).toBeAttached();
  await expect(page.locator("main#main")).toBeVisible();
}

/**
 * Contenuto della schermata corrente. Tutti gli helper cercano qui dentro:
 * header e bottom nav sono fuori da <main> e i loro nomi accessibili
 * altrimenti collidono (es. "Language: EN" intercetta una ricerca su /Age/i).
 */
export function screen(page: Page) {
  return page.locator("main");
}

/**
 * Attende la fine delle animazioni d'ingresso della schermata
 * (.ens-screen-in, .ens-rise: partono da opacity 0). Senza questa attesa axe
 * campiona i colori a meta' transizione e riporta contrasti falsati, con
 * risultati diversi a ogni run. Le animazioni infinite (spinner, shimmer)
 * sono escluse perche' non terminano mai.
 */
export async function waitForAnimations(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined))
    )
  );
}

/** Bottone primario della BottomBar (Avanti / Continua / Invia...). */
export async function clickNext(page: Page) {
  await page.locator(".bar .btn.next").click();
}

/** Compila un campo testuale identificato dalla sua label visibile. */
export async function fillLabeled(page: Page, label: string | RegExp, value: string | number) {
  await screen(page).getByRole("textbox", { name: label }).fill(String(value));
}

/**
 * Sceglie un'opzione in un Segmented, individuato dal nome accessibile del
 * suo radiogroup. `exact` sull'opzione evita che "Eligible" peschi anche
 * "Not eligible".
 */
export async function pickSegmented(
  page: Page,
  group: string | RegExp,
  option: string
) {
  await screen(page)
    .getByRole("radiogroup", { name: group })
    .getByRole("radio", { name: option, exact: true })
    .click();
}

/** Imposta un input range identificato dal suo aria-label (NIHSS, GCS, Volume mL). */
export async function setRange(page: Page, label: string, value: number) {
  await screen(page).getByRole("slider", { name: label, exact: true }).fill(String(value));
}

/** Seleziona il punteggio ASPECTS (celle 0-10). */
export async function pickAspects(page: Page, value: number) {
  await screen(page).getByRole("button", { name: `ASPECTS ${value}`, exact: true }).click();
}

/** Seleziona un vaso nel VesselPicker: prima la regione (tab), poi il vaso. */
export async function pickVessel(page: Page, region: string, vessel: string) {
  await screen(page).getByRole("tab", { name: region }).click();
  await screen(page).getByRole("button", { name: vessel, exact: true }).click();
}

/** Accende/spegne un ToggleRow o Switch identificato dalla sua label. */
export async function setSwitch(page: Page, label: string | RegExp, on: boolean) {
  const sw = screen(page).getByRole("switch", { name: label });
  if ((await sw.getAttribute("aria-checked")) !== String(on)) await sw.click();
}

/**
 * Imposta LTSW a N ore fa tramite il CalendarSheet. Il foglio parte da
 * "adesso - 2h": bastano gli stepper orari (+/-1h) per raggiungere il target.
 * Usare con freezeClock() per evitare il wrap di mezzanotte.
 */
export async function setLtswHoursAgo(page: Page, fieldId: string, hours: number) {
  await page.locator(`#${fieldId}`).click();
  const delta = 2 - hours; // +1h avvicina ad adesso, -1h allontana
  const step = screen(page).getByRole("button", { name: delta >= 0 ? "+1" : "-1", exact: true });
  for (let i = 0; i < Math.abs(delta); i++) await step.click();
  await page.locator("button.confirm").click();
}
