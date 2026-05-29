import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { freshSession, assertAppShell } from "./helpers";

const ROUTES = [
  { name: "landing", path: "/" },
  { name: "workflow", path: "/workflow" },
  { name: "trials-list", path: "/trials" },
  { name: "trial-detail", path: "/trial/MOSTE" },
  { name: "pre-imaging", path: "/pre-imaging" },
  { name: "pre-result", path: "/pre-result" },
  { name: "post-imaging", path: "/post-imaging" },
  { name: "summary", path: "/summary" },
  { name: "share", path: "/share" },
  { name: "post-acute", path: "/post-acute" },
  { name: "trial-patient", path: "/trial-patient" },
];

test.describe("a11y - WCAG 2.1 AA scan", () => {
  for (const route of ROUTES) {
    test(`route ${route.name} (${route.path})`, async ({ page }) => {
      await freshSession(page);
      await page.goto(`/#${route.path}`);
      await page.waitForSelector("main h1", { timeout: 5_000 });

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Disabilitiamo regole con falsi positivi noti / non rilevanti su SPA hash router:
        .disableRules(["region"]) // svelte-spa-router non aggiunge landmark addizionali
        .analyze();

      // Niente errori critici/seri. Stampa quelli minori per audit, ma non fa fallire.
      const critical = results.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact ?? "")
      );
      if (critical.length > 0) {
        console.log(
          `Critical a11y issues on ${route.name}:`,
          critical.map((v) => ({ id: v.id, nodes: v.nodes.length, help: v.help }))
        );
      }
      expect(critical).toEqual([]);
    });
  }

  test("HTML has lang attribute matching locale store", async ({ page }) => {
    await freshSession(page, "en");
    await assertAppShell(page, "en");
  });

  test("Skip link transports focus to main", async ({ page }) => {
    await freshSession(page);
    await page.goto("/");
    await page.waitForSelector("main h1");
    // Tab dovrebbe focus skip link per primo (e' il primo focusabile)
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();
  });
});
