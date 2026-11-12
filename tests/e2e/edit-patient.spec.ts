import { test, expect } from "@playwright/test";
import { freshSession } from "./helpers";

/**
 * Modifica di un paziente gia' salvato: dal dettaglio si apre la pagina di
 * modifica, si cambiano dati e studio, e il foglio riceve una modifica
 * (op=update) sulla riga esistente invece di una riga nuova.
 */
const TS = "2026-11-10T09:00:00.000Z";
const entry = {
  id: "edit-1",
  savedAt: TS,
  sheetTs: TS,
  patientId: "EDIT-001",
  strokeType: "ischemic",
  age: 72,
  nihss: 10,
  ltswH: 3,
  trials: ["WeTrust"],
  missed: ["TENACITY"],
  snapshot: {
    pre: { patientId: "EDIT-001", age: 72, nihss: 10, premrs: 1 },
    post: { strokeType: "ischemic" },
    hem: {},
    studies: ["WeTrust"],
    outcomes: { WeTrust: "intervention" },
    chronic: [],
    notes: "",
    extras: { tev: "No", tiv: "Yes" },
  },
};

test("modifica di studio e dati di un paziente salvato", async ({ page }) => {
  const posts: { url: string; body: string }[] = [];
  let updatedAt = "";
  await page.route("**/script.google.com/**", (route) => {
    const req = route.request();
    if (req.method() === "POST") {
      posts.push({ url: req.url(), body: req.postData() ?? "" });
      updatedAt = new Date().toISOString();
      return route.fulfill({ status: 200, contentType: "text/plain", body: "ok" });
    }
    if (req.url().includes("op=caps")) return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ v: 1, update: true }) });
    if (req.url().includes("op=list") && updatedAt) {
      const row = { timestamp: TS, Timestamp: TS, N_patient: "xxxxx001", Age: 73, TENACITY: "control", Updated_at: updatedAt };
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([row]) });
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });
  await freshSession(page, "en", { mockSheet: false });
  await page.evaluate((e) => {
    localStorage.setItem("ensapp:saved:v1", JSON.stringify({ v: 1, ts: Date.now(), data: [e] }));
  }, entry);
  await page.goto("/#/saved/edit-1");
  await page.reload();

  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await expect(page).toHaveURL(/\/saved\/edit-1\/edit$/);
  await expect(page.getByRole("textbox", { name: "Patient ID" })).toHaveValue("EDIT-001");

  await page.getByRole("textbox", { name: "Age" }).fill("73");
  // Studio: via WeTrust, dentro TENACITY con braccio controllo.
  await page.getByRole("button", { name: "Remove WeTrust" }).click();
  await page.getByRole("button", { name: "Change studies" }).click();
  await page.getByRole("dialog").getByRole("button", { name: /^TENACITY/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("radiogroup", { name: "Arm TENACITY" }).getByRole("radio", { name: "Control" }).click();

  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page).toHaveURL(/\/saved\/edit-1$/, { timeout: 10_000 });
  await expect(page.locator(".chip.enrolled")).toHaveText(["TENACITY · Control"]);
  await expect(page.getByText("73", { exact: true })).toBeVisible();

  expect(posts).toHaveLength(1);
  expect(posts[0].url).toContain("op=update");
  const payload = JSON.parse(new URLSearchParams(posts[0].body).get("payload") ?? "{}");
  expect(payload).toMatchObject({ kind: "update", matchTimestamp: TS, matchId: "EDIT-001", Age: 73, WeTrust: "no", TENACITY: "control", missed_trials: "" });

  // Niente doppioni nella lista.
  await page.goto("/#/saved");
  await expect(page.getByText("EDIT-001")).toHaveCount(1);
});
