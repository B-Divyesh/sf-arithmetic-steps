import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  // Chromium's headless shell is unstable in this worker image when the two
  // device projects launch simultaneously. The product suite is intentionally
  // serial so its fresh storage, service-worker, and Axe checks stay reliable.
  workers: 1,
  reporter: "list",
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    // Separate origins give each project an independent IndexedDB and service
    // worker partition, even if a browser process is unexpectedly reused.
    { name: "chromium", use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:4173" } },
    { name: "mobile", use: { ...devices["Pixel 5"], baseURL: "http://localhost:4173" } }
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 30_000
  }
});
