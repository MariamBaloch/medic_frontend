import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const envFile = fileURLToPath(new URL("./.env.e2e", import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);

const appOrigin = "http://127.0.0.1:5174";
const apiOrigin = process.env.E2E_API_BASE_URL || "http://localhost:8080";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  outputDir: "./test-results",
  use: {
    baseURL: appOrigin,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        timezoneId: "Asia/Riyadh",
        viewport: { width: 1100, height: 900 },
      },
    },
  ],
  webServer: {
    command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5174 --strictPort",
    url: appOrigin,
    env: {
      E2E_API_BASE_URL: apiOrigin,
      VITE_API_BASE_URL: `${appOrigin}/api`,
    },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
