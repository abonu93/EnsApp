import { test, expect, type Page } from "@playwright/test";
import { FIXED_NOW } from "./helpers";

/**
 * Stroke code condiviso: due dispositivi (due contesti del browser) sullo
 * stesso foglio finto, che unisce i campi come Code.gs. A apre il paziente,
 * B lo prende dalla Home, ognuno inserisce un dato e lo vede anche l'altro.
 */

type Field = { v: unknown; t: number };
const rows: Record<string, { id: string; updatedAt: string; status: string; fields: Record<string, Field> }> = {};

async function device(page: Page) {
  await page.clock.install({ time: FIXED_NOW });
  await page.route("**/script.google.com/**", async (route) => {
    const req = route.request();
    if (req.method() === "POST") {
      const p = JSON.parse(new URLSearchParams(req.postData() ?? "").get("payload")!);
      if (p.kind === "board") {
        const row = rows[p.id] ?? { id: p.id, updatedAt: "", status: "open", fields: {} };
        for (const [k, f] of Object.entries(p.fields as Record<string, Field>)) {
          if (!row.fields[k] || row.fields[k].t < f.t) row.fields[k] = f;
        }
        row.updatedAt = new Date(FIXED_NOW).toISOString();
        rows[p.id] = row;
      }
      return route.fulfill({ status: 200, body: "ok" });
    }
    const url = req.url();
    const body = url.includes("op=boards") ? { v: 1, items: Object.values(rows) } : url.includes("op=prearrivals") ? { v: 1, items: [] } : [];
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("ensapp:locale:v1", "en");
    sessionStorage.setItem("eligo:splash:seen", "1");
  });
  await page.goto("/");
}

async function setSliderField(page: Page, name: string, value: number) {
  await page.getByRole("button", { name: new RegExp(`^${name}:`) }).click();
  await page.getByRole("slider", { name }).fill(String(value));
  await page.getByRole("button", { name: `Set ${value}` }).click();
}

test("stroke code: due dispositivi sullo stesso paziente", async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  await device(a);
  await device(b);

  // A: nuovo stroke code in PS, eta' 64 e ID paziente (che resta su A).
  await a.goto("/#/board");
  await setSliderField(a, "Age", 64);
  await expect(a.getByText("Live · shared with the team")).toBeVisible();
  await expect.poll(() => Object.values(rows)[0]?.fields["pre.age"]?.v).toBe(64);

  // B: lo vede in Home e ci entra.
  await b.clock.runFor(31_000);
  const row = b.getByRole("region", { name: "Stroke codes in progress" }).getByRole("button");
  await expect(row).toContainText("64 years");
  await row.click();
  await expect(b).toHaveURL(/\/board$/);
  await expect(b.getByRole("button", { name: /^Age: 64/ })).toBeVisible();

  // B inserisce l'NIHSS, A lo vede al prossimo aggiornamento.
  await setSliderField(b, "NIHSS", 8);
  await expect.poll(() => Object.values(rows)[0]?.fields["pre.nihss"]?.v).toBe(8);
  await a.clock.runFor(6_000);
  await expect(a.getByRole("button", { name: /^NIHSS: 8/ })).toBeVisible();
  await expect(a.getByRole("button", { name: /^Age: 64/ })).toBeVisible();
});
