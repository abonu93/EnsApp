import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// In ambiente isolato i browser sono preinstallati qui.
// Default: bundled cloud sandbox path. Empty env var = Playwright installer (CI).
const ENV_PATH = process.env.CHROMIUM_PATH;
const EXECUTABLE_PATH =
  ENV_PATH !== undefined ? (ENV_PATH || undefined) : "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 20_000,

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    actionTimeout: 5_000,
    navigationTimeout: 10_000,
  },

  projects: [
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        launchOptions: {
          ...(EXECUTABLE_PATH ? { executablePath: EXECUTABLE_PATH } : {}),
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        },
      },
    },
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          ...(EXECUTABLE_PATH ? { executablePath: EXECUTABLE_PATH } : {}),
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        },
      },
    },
  ],

  webServer: {
    command: `npm run preview -- --host 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
