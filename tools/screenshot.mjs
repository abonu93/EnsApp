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
  { name: "01-landing-mobile-light", route: "/", viewport: { width: 390, height: 844 }, theme: "light" },
  { name: "02-landing-mobile-dark", route: "/", viewport: { width: 390, height: 844 }, theme: "dark" },
  { name: "03-components-mobile-light", route: "/components", viewport: { width: 390, height: 1400 }, theme: "light" },
  { name: "04-components-mobile-dark", route: "/components", viewport: { width: 390, height: 1400 }, theme: "dark" },
  { name: "05-form-demo-mobile", route: "/form-demo", viewport: { width: 390, height: 844 }, theme: "light" },
  { name: "06-landing-desktop", route: "/", viewport: { width: 1280, height: 900 }, theme: "light" },
  { name: "07-components-desktop-dark", route: "/components", viewport: { width: 1280, height: 1400 }, theme: "dark" },
];

for (const shot of shots) {
  const ctx = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    colorScheme: shot.theme === "dark" ? "dark" : "light",
  });
  const page = await ctx.newPage();
  // Set theme before navigation (storageState pattern is overkill for this)
  await page.addInitScript((t) => {
    localStorage.setItem("ensapp:theme:v1", t);
  }, shot.theme);
  await page.goto(URL + "#" + shot.route, { waitUntil: "networkidle" });
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
  }, shot.theme);
  await page.waitForTimeout(250);

  const file = join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`Saved ${file}`);
  await ctx.close();
}

await browser.close();
