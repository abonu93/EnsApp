// Screenshot helper - apre l'app servita da Vite preview e cattura
// 4 viewport (mobile/desktop x light/dark) per code review visiva.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "screenshots");
mkdirSync(outDir, { recursive: true });

const URL = process.env.URL ?? "http://127.0.0.1:4173/";
const EXECUTABLE = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const shots = [
  { name: "01-landing-es", route: "/", viewport: { width: 390, height: 844 }, theme: "light", locale: "es" },
  { name: "02-landing-ca", route: "/", viewport: { width: 390, height: 844 }, theme: "light", locale: "ca" },
  { name: "03-landing-en", route: "/", viewport: { width: 390, height: 844 }, theme: "light", locale: "en" },
  { name: "04-workflow-en", route: "/workflow", viewport: { width: 390, height: 844 }, theme: "light", locale: "en" },
  { name: "05-post-imaging-en", route: "/post-imaging", viewport: { width: 390, height: 1600 }, theme: "light", locale: "en" },
  { name: "06-summary-en", route: "/summary", viewport: { width: 390, height: 1200 }, theme: "light", locale: "en" },
  { name: "07-share-es-dark", route: "/share", viewport: { width: 390, height: 1400 }, theme: "dark", locale: "es" },
];

for (const shot of shots) {
  const ctx = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    colorScheme: shot.theme === "dark" ? "dark" : "light",
  });
  const page = await ctx.newPage();
  await page.addInitScript(
    ({ theme, locale }) => {
      localStorage.setItem("ensapp:theme:v1", theme);
      if (locale) localStorage.setItem("ensapp:locale:v1", locale);
    },
    { theme: shot.theme, locale: shot.locale ?? "es" }
  );
  await page.goto(URL + "#" + shot.route, { waitUntil: "networkidle" });
  await page.evaluate(
    ({ theme, locale }) => {
      document.documentElement.setAttribute("data-theme", theme);
      if (locale) document.documentElement.setAttribute("lang", locale);
    },
    { theme: shot.theme, locale: shot.locale ?? "es" }
  );
  await page.waitForTimeout(250);

  const file = join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Saved ${file}`);
  await ctx.close();
}

await browser.close();
