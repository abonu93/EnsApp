import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession, fillPreImaging, pickSegment, setSlider } from "./helpers";

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
 *  2) almeno N trial eligibili in Summary
 *  3) payload finale verso Apps Script ha la shape attesa (intercept)
 */

test.describe("ischemic flow - golden patient", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await freshSession(page);
  });

  test("end-to-end: pre-imaging -> share with intercept", async ({ page }) => {
    // -- Landing --
    await page.goto("/");
    await page.getByRole("button", { name: /new patient/i }).click();
    await expect(page).toHaveURL(/\/workflow$/);

    // -- WorkflowSelector --
    await page.getByText("Eligibility evaluation").click();
    await expect(page).toHaveURL(/\/pre-imaging$/);

    // -- PreImaging --
    await fillPreImaging(page, { patientId: "E2E-2025-001", age: 70, nihss: 14, mrs: 1, ltswHoursAgo: 3 });
    await page.getByRole("button", { name: /^next$/i }).click();
    await expect(page).toHaveURL(/\/pre-result$/);

    // -- PreResult: WeTrust deve essere eligible --
    await expect(page.locator(".status-label")).toHaveText("Eligible");
    // Continue al post-imaging
    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page).toHaveURL(/\/post-imaging$/);

    // -- PostImaging: ischemic + EVT --
    await pickSegment(page, "Stroke type", "Ischemic");
    await pickSegment(page, "Candidate for thrombectomy (EVT)?", "Eligible");
    await pickSegment(page, "Candidate for thrombolysis (IVT)?", "Eligible");
    await page.getByRole("tab", { name: "MCA" }).click();
    await page.getByRole("button", { name: "M1", exact: true }).click();
    await page.getByRole("button", { name: "ASPECTS 8", exact: true }).click();
    await page.getByRole("button", { name: /^next$/i }).click();
    await expect(page).toHaveURL(/\/summary$/);

    // -- Summary: deve elencare WeTrust e altri trial eligibili --
    const weTrust = page.locator("button.card-pick").filter({ hasText: "WeTrust" });
    await expect(weTrust).toBeVisible();
    await expect(page.locator("button.card-pick")).not.toHaveCount(1);
    // Seleziona WeTrust come trial principale
    await weTrust.click();

    // Persistenza: refresh non deve perdere la selezione
    await page.reload();
    await page.waitForSelector("main h1");
    await expect(page.locator("button.card-pick.on")).toHaveCount(1);

    // -- Procedi al Share --
    await page.getByRole("button", { name: /review.*1/i }).click();
    await expect(page).toHaveURL(/\/share$/);

    // -- Share: intercetta la POST verso Apps Script --
    // page.route serve sia a catturare il payload sia a simulare una risposta
    // immediata (in CI la rete esterna verso script.google.com non e' garantita).
    // La GET (?op=list) e' la rilettura di verifica: restituisce la riga appena
    // "scritta", come farebbe il foglio.
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

    await page.getByRole("button", { name: /send to sheet/i }).click();

    // Attende che la fetch sia partita e abbia popolato capturedBody.
    await expect.poll(() => capturedBody.length, { timeout: 5_000 }).toBeGreaterThan(0);

    expect(capturedBody).toContain("payload=");
    const params = new URLSearchParams(capturedBody);
    const payload = JSON.parse(params.get("payload") ?? "{}");
    // Le chiavi combaciano con le intestazioni di colonna del foglio EnsApp_Data.
    expect(payload.N_patient).toBe("E2E-2025-001");
    expect(payload.Age).toBe(70);
    expect(payload.NIHSS).toBe(14);
    expect(payload.WeTrust).toBe("intervention");

    // Feedback successo
    await expect(page.locator(".success").getByText(/saved successfully/i)).toBeVisible({ timeout: 10_000 });
  });

  test("persistence: refresh keeps wizard state mid-flow", async ({ page }) => {
    await page.goto("/#/pre-imaging");
    await page.getByRole("textbox", { name: /^age/i }).fill("55");
    await setSlider(page, "NIHSS", 7);
    await pickSegment(page, "pre-mRS", "0");

    await page.reload();
    await page.waitForSelector("main h1");
    await expect(page.getByRole("textbox", { name: /^age/i })).toHaveValue("55");
    await expect(page.getByRole("slider", { name: "NIHSS" })).toHaveValue("7");
    await expect(page.getByRole("radio", { name: "0", exact: true })).toHaveAttribute("aria-checked", "true");

    // Banner di resume su landing
    await page.goto("/#/");
    await expect(page.getByText(/active session/i)).toBeVisible();
    // Riprendi: si torna al paziente, non alla scelta del nuovo paziente.
    await page.getByRole("button", { name: /active session/i }).click();
    await expect(page).toHaveURL(/\/pre-imaging$/);
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
    // Lingua di default del prodotto: spagnolo. Il toggle cicla es -> ca -> en.
    await freshSession(page, "es");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.getByRole("button", { name: /nuevo paciente/i })).toBeVisible();

    await page.getByRole("button", { name: /^idioma/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ca");
    await page.getByRole("button", { name: /^idioma/i }).click();

    await expect(page.getByRole("button", { name: /new patient/i })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Persistenza locale
    await page.reload();
    await expect(page.getByRole("button", { name: /new patient/i })).toBeVisible();
  });
});
