import { test, expect } from "@playwright/test";
import {
  freshSession,
  freezeClock,
  clickNext,
  screen,
  fillLabeled,
  pickSegmented,
  setRange,
  pickAspects,
  pickVessel,
  setLtswHoursAgo,
} from "./helpers";

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
 *  2) i trial eligibili compaiono in Summary e sono selezionabili
 *  3) payload finale verso Apps Script ha la shape attesa (intercept)
 *
 * I test girano in inglese: le asserzioni sui testi usano il dizionario en.
 */

test.describe("ischemic flow - golden patient", () => {
  test.beforeEach(async ({ page }) => {
    await freshSession(page, "en");
    await freezeClock(page);
  });

  test("end-to-end: pre-imaging -> share with intercept", async ({ page }) => {
    // -- Landing --
    await page.goto("/");
    await screen(page).getByRole("button", { name: /new patient/i }).click();
    await expect(page).toHaveURL(/\/workflow$/);

    // -- WorkflowSelector --
    await screen(page).getByText("Eligibility evaluation").click();
    await expect(page).toHaveURL(/\/pre-imaging$/);

    // -- PreImaging --
    await fillLabeled(page, /Patient record number/i, "E2E-2025-001");
    await fillLabeled(page, /Age/i, 70);
    await setRange(page, "NIHSS", 14);
    await pickSegmented(page, "pre-mRS", "1");
    await setLtswHoursAgo(page, "pre-ltsw", 3);
    await pickSegmented(page, /angiograph/i, "Yes");
    await pickSegmented(page, /DOAC/i, "No");
    await pickSegmented(page, /ACE/i, "No");
    await clickNext(page);
    await expect(page).toHaveURL(/\/pre-result$/);

    // -- PreResult: WeTrust deve essere eligible --
    await expect(page.locator("main").getByText(/eligible/i).first()).toBeVisible();
    await clickNext(page);
    await expect(page).toHaveURL(/\/post-imaging$/);

    // -- PostImaging: ischemic + EVT --
    await pickSegmented(page, "Stroke type", "Ischemic");
    await pickSegmented(page, /thrombectomy \(EVT\)/i, "Eligible");
    await pickSegmented(page, /thrombolysis \(IVT\)/i, "Eligible");
    await pickVessel(page, "MCA", "M1");
    await pickAspects(page, 8);
    await clickNext(page);
    await expect(page).toHaveURL(/\/summary$/);

    // -- Summary: deve elencare WeTrust e altri trial eligibili --
    const weTrust = page.locator(".card-pick").filter({ hasText: "WeTrust" });
    await expect(weTrust).toBeVisible();
    await weTrust.click();

    // Persistenza: refresh non deve perdere la selezione
    await page.reload();
    await page.waitForSelector("main h1");
    await expect(page.locator(".card-pick.on")).toHaveCount(1);

    // -- Procedi al Share --
    await clickNext(page);
    await expect(page).toHaveURL(/\/share$/);

    // -- Share: intercetta la POST verso Apps Script --
    // page.route serve sia a catturare il payload sia a simulare una risposta
    // immediata (in CI la rete esterna verso script.google.com non e' garantita).
    let capturedBody = "";
    await page.route("**/script.google.com/**", async (route) => {
      capturedBody = route.request().postData() ?? "";
      await route.fulfill({ status: 200, contentType: "text/plain", body: "OK" });
    });

    await screen(page).getByRole("button", { name: /send to sheet/i }).click();

    // Attende che la fetch sia partita e abbia popolato capturedBody.
    await expect.poll(() => capturedBody.length, { timeout: 5_000 }).toBeGreaterThan(0);

    expect(capturedBody).toContain("payload=");
    const params = new URLSearchParams(capturedBody);
    const payload = JSON.parse(decodeURIComponent(params.get("payload") ?? "{}"));
    // Le chiavi combaciano con le intestazioni di colonna del foglio EnsApp_Data.
    expect(payload.N_patient).toBe("E2E-2025-001");
    expect(payload.Age).toBe(70);
    expect(payload.NIHSS).toBe(14);
    expect(payload.WeTrust).toBe("intervention");

    // Feedback successo
    await expect(screen(page).getByText(/saved successfully/i)).toBeVisible();
  });

  test("persistence: refresh keeps wizard state mid-flow", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await fillLabeled(page, /Age/i, 55);
    await setRange(page, "NIHSS", 7);
    await pickSegmented(page, "pre-mRS", "0");

    await page.reload();
    await page.waitForSelector("main h1");
    await expect(screen(page).getByRole("textbox", { name: /Age/i })).toHaveValue("55");
    await expect(screen(page).getByRole("slider", { name: "NIHSS" })).toHaveValue("7");
    await expect(
      screen(page).getByRole("radiogroup", { name: "pre-mRS" }).getByRole("radio", { name: "0", exact: true })
    ).toHaveAttribute("aria-checked", "true");

    // Banner di resume su landing
    await page.goto("/#/");
    await expect(screen(page).getByText(/active session/i)).toBeVisible();
  });

  test("saved patients list persists across refresh", async ({ page }) => {
    // freshSession (beforeEach) ha gia' fatto clear; inietta lo snapshot ORA
    // e poi reload per far creare lo store con il valore presente in storage.
    const entry = {
      id: "test-123",
      savedAt: new Date().toISOString(),
      patientId: "TEST-001",
      strokeType: "ischemic",
      age: 72,
      nihss: 10,
      trials: ["WeTrust"],
      snapshot: {
        pre: { patientId: "TEST-001", age: 72, nihss: 10 },
        post: {},
        hem: {},
        studies: ["WeTrust"],
        outcomes: {},
        chronic: [],
        notes: "",
        extras: {},
      },
    };
    await page.evaluate((e) => {
      const envelope = { v: 1, ts: Date.now(), data: [e] };
      localStorage.setItem("ensapp:saved:v1", JSON.stringify(envelope));
    }, entry);
    await page.goto("/#/saved");
    await page.reload();
    await expect(page.getByText("TEST-001")).toBeVisible();
    // Refresh ulteriore: la lista persiste
    await page.reload();
    await expect(page.getByText("TEST-001")).toBeVisible();
  });

  test("language switch updates UI immediately", async ({ page }) => {
    await page.goto("/");
    await expect(screen(page).getByRole("button", { name: /new patient/i })).toBeVisible();

    // Il toggle in header cicla es -> ca -> en: da "en" il giro riparte da "es".
    await page.locator("button.lang-btn").click();
    await expect(screen(page).getByRole("button", { name: /nuevo paciente/i })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    // Persistenza locale
    await page.reload();
    await expect(screen(page).getByRole("button", { name: /nuevo paciente/i })).toBeVisible();
  });
});
