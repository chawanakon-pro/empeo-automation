import { defineConfig, devices } from "@playwright/test";

const desktop = { ...devices["Desktop Chrome"] };

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: 1, // the test data (phone, promo) is fixed, so run serially
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "https://portal.uat.gofive.co.th",
    locale: "th-TH", // Thai UI only
    viewport: { width: 1920, height: 1080 },
    video: "on", // record every run to demonstrate the execution
    screenshot: "on",
    trace: "retain-on-failure",
    launchOptions: {
      slowMo: process.env.SLOWMO ? Number(process.env.SLOWMO) : 0,
    },
  },
  // Projects run in this order with one worker: safe tests first, data-consuming tests (@consumes-data) last.
  projects: [
    { name: "validation", use: desktop, grepInvert: /@consumes-data/ },
    { name: "consumes-data", use: desktop, grep: /@consumes-data/ },
  ],
});
