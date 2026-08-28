import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

function failOnConsoleErrors(page: Page): void {
  page.on("console", (message) => {
    if (message.type() === "error") throw new Error(`Browser console error: ${message.text()}`);
  });
}

test.beforeEach(async ({ page }) => {
  failOnConsoleErrors(page);
  await page.goto("/");
});

test("has a clear, accessible route planner", async ({ page }) => {
  await expect(page).toHaveTitle(/Arithmetic Steps/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See the route");
  await expect(page.getByAltText(/counter trains/)).toBeVisible();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
});

test("completes, narrates, replays, and saves an addition route", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("8 + 7");
  await expect(page.getByText(/total stays 15/)).toBeVisible();

  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.getByText("10 + 5", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/have the same total/)).toBeVisible();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("You arrived at 15.");
  await expect(page.getByRole("heading", { name: "8 + 7 = 15" })).toBeVisible();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.locator(".replay-narration")).toContainText("Move 2 from 7 to 8");

  await page.goto("/#history");
  await expect(page.getByText("8 + 7 = 15")).toBeVisible();
  await page.getByRole("button", { name: "Replay route" }).click();
  await expect(page.getByRole("button", { name: "Play route" })).toBeVisible();
});

test("supports a child-chosen multi-step subtraction route", async ({ page }) => {
  await page.getByLabel("Subtract").focus();
  await page.getByLabel("Subtract").press("Space");
  await page.getByRole("button", { name: "52 − 18" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();

  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "8", exact: true }).click();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText(/Nothing is left to take away/)).toBeVisible();
  await page.getByRole("button", { name: "Finish the route" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("You arrived at 34.");
  await expect(page.getByRole("heading", { name: "52 − 18 = 34" })).toBeVisible();
});

test("shows helpful validation without losing the entered problem", async ({ page }) => {
  await page.getByLabel("First number").fill("90");
  await page.getByLabel("Second number").fill("20");
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByText("Choose numbers with a total of 100 or less.")).toBeVisible();
  await expect(page.getByLabel("First number")).toHaveValue("90");
});

test("works from the installed cache while offline", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "one Chromium offline run covers the same service worker");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See the route");
  await expect(page.getByText(/Offline route/)).toBeVisible();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("8 + 7");
});

test("fits the phone viewport and retains keyboard-sized controls", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only viewport check");
  const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  const begin = page.getByRole("button", { name: /Begin the route/ });
  const box = await begin.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("legal pages keep the same accessible shell", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
});
