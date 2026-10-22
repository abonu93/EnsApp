import { test, expect } from "@playwright/test";
import { FIXED_NOW, freshSession } from "./helpers";

/**
 * Pre-arrivo: chiamata del SEM -> paziente in arrivo con gli studi contati
 * all'ora di arrivo -> arrivato, il board parte con i dati del SEM.
 */

test.describe("pre-arrival", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    // Script del foglio senza pre-arrivi (risponde [] come quello vecchio).
    await page.route("**/script.google.com/**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "[]" }));
    await freshSession(page);
  });

  test("chiamata SEM -> in arrivo -> board", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /stroke code/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Pre-arrival/ }).click();
    await expect(page).toHaveURL(/\/pre-arrival$/);

    // Senza l'ultima volta visto bene non si salva.
    await expect(page.getByRole("button", { name: "Set last seen well to save" })).toBeDisabled();

    await page.getByRole("textbox", { name: "CIP" }).fill("roca 0480512001");
    await expect(page.getByRole("textbox", { name: "CIP" })).toHaveValue("ROCA0480512001");
    await page.getByRole("textbox", { name: "Age" }).fill("78");
    await page.locator("button.clock-btn").click();
    await page.getByRole("button", { name: "−1h", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await page.getByRole("group", { name: "Pre-stroke mRS" }).getByRole("button", { name: "1", exact: true }).click();
    await page.getByRole("group", { name: "RACE" }).getByRole("button", { name: "7", exact: true }).click();
    await expect(page.getByText("≥ 5 · LVO suspected")).toBeVisible();
    await page.getByRole("group", { name: "Antithrombotics" }).getByRole("button", { name: "DOAC", exact: true }).click();
    await page.getByRole("group", { name: "Arrival in" }).getByRole("button", { name: "15′", exact: true }).click();
    await page.getByRole("button", { name: "Save · incoming" }).click();

    await expect(page).toHaveURL(/\/incoming$/);
    await expect(page.locator(".eta")).toHaveText("15m");
    await expect(page.locator(".cip")).toHaveText("ROCA0480512001");
    await expect(page.locator("#inc-count")).toContainText("possible at arrival");
    await expect(page.getByText("Windows counted to arrival ≈ 12:15.")).toBeVisible();

    // FASTEST e' fuori per il DOAC
    await page.getByRole("button", { name: /out before arrival/ }).click();
    await expect(page.locator(".trial", { hasText: "FASTEST" })).toBeVisible();

    // Si riprende dalla home
    await page.goto("/");
    await page.getByRole("button", { name: /Incoming · SEM/ }).click();
    await expect(page).toHaveURL(/\/incoming$/);

    await page.getByRole("button", { name: "Patient arrived · open board" }).click();
    await expect(page).toHaveURL(/\/board$/);
    await expect(page.locator(".bar .cip")).toContainText("ROCA0480512001 · SEM · DOAC");
    await expect(page.locator(".elapsed")).toHaveText("1h 00m");
    await expect(page.getByRole("button", { name: /^Age: 78/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Pre-stroke mRS: 1/ })).toBeVisible();
  });

  test("dal board: + New patient -> In the ED svuota il board", async ({ page }) => {
    await page.getByRole("button", { name: /new patient/i }).click();
    await page.getByRole("button", { name: /stroke code/i }).click();
    await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
    await page.getByRole("button", { name: /^Age:/ }).click();
    await page.getByRole("slider", { name: "Age" }).fill("70");
    await page.getByRole("button", { name: "Set 70" }).click();
    await expect(page.getByRole("button", { name: /^Age: 70/ })).toBeVisible();

    await page.getByRole("button", { name: "+ New patient" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /In the ED/ }).click();
    await expect(page.getByRole("button", { name: /^Age: —/ })).toBeVisible();

    await page.getByRole("button", { name: "+ New patient" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Pre-arrival/ }).click();
    await expect(page).toHaveURL(/\/pre-arrival$/);
  });

  test("WhatsApp: studi all'arrivo, senza CIP", async ({ page }) => {
    await page.goto("/#/pre-arrival");
    await page.getByRole("textbox", { name: "CIP" }).fill("ROCA0480512001");
    await page.getByRole("textbox", { name: "Age" }).fill("78");
    await page.locator("button.clock-btn").click();
    await page.getByRole("button", { name: "−1h", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Set", exact: true }).click();
    await page.getByRole("group", { name: "Arrival in" }).getByRole("button", { name: "15′", exact: true }).click();
    await page.getByRole("button", { name: "Save · incoming" }).click();
    await expect(page).toHaveURL(/\/incoming$/);
    await expect(page.getByText("Not shared: the sheet script needs an update")).toBeVisible();

    await page.evaluate(() => {
      window.open = ((u: string) => {
        (window as unknown as { __wa: string }).__wa = u;
        return null;
      }) as typeof window.open;
    });
    await page.getByRole("button", { name: "Send to WhatsApp" }).click();
    const url = await page.evaluate(() => (window as unknown as { __wa: string }).__wa);
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    const msg = decodeURIComponent(url.slice("https://wa.me/?text=".length));
    expect(msg).toContain("Stroke code pre-arrival (SEM)");
    expect(msg).toContain("ETA 15m");
    expect(msg).toContain("Age 78");
    expect(msg).not.toContain("ROCA");
  });
});

test.describe("pre-arrival condiviso", () => {
  test("lista del team in home -> si prende -> arrivato", async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    const at = new Date(FIXED_NOW.getTime() - 3_600_000).toISOString();
    const arriveAt = new Date(FIXED_NOW.getTime() + 20 * 60_000).toISOString();
    const posts: Record<string, unknown>[] = [];
    await page.route("**/script.google.com/**", async (route) => {
      const req = route.request();
      if (req.method() === "POST") {
        posts.push(JSON.parse(new URLSearchParams(req.postData() ?? "").get("payload")!));
        return route.fulfill({ status: 200, body: "ok" });
      }
      const items = [
        { id: "remote-0001", updatedAt: new Date(FIXED_NOW).toISOString(), status: "incoming", age: 71, premrs: 0, race: 6,
          anti: "none", clockMode: "known", at, found: "", arriveAt, eta: 20 },
      ];
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ v: 1, items }) });
    });
    await freshSession(page);

    const row = page.getByRole("region", { name: "Incoming from the team" }).getByRole("button");
    await expect(row).toContainText("20m");
    await expect(row).toContainText("71 years · mRS 0 · RACE 6");
    await row.click();
    await expect(page).toHaveURL(/\/incoming$/);
    await expect(page.locator(".eta")).toHaveText("20m");
    await expect(page.getByText("Shared with the team (no CIP)")).toBeVisible();

    await page.getByRole("button", { name: "Patient arrived · open board" }).click();
    await expect(page).toHaveURL(/\/board$/);
    await expect.poll(() => posts.map((p) => `${p.id}:${p.status}`)).toContain("remote-0001:arrived");
  });
});

