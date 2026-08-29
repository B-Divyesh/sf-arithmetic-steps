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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Explore addition and subtraction steps");
  await expect(page.getByText("For elementary children with a teacher or parent, move counters to explain how each answer changes.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try it with sample data" })).toBeVisible();
  await expect(page.getByAltText(/counter trains/)).toBeVisible();
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations).toEqual([]);
});

test("has no axe violations on the demo or completed-route screens", async ({ page }) => {
  await page.getByRole("button", { name: "Try it with sample data" }).click();
  expect((await new AxeBuilder({ page: page as never }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await page.getByRole("button", { name: "Finish the route" }).click();
  expect((await new AxeBuilder({ page: page as never }).analyze()).violations).toEqual([]);
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
  await page.getByRole("radio", { name: "Subtract" }).focus();
  await page.getByRole("radio", { name: "Subtract" }).press("Space");
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
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Explore addition and subtraction steps");
  await expect(page.getByText(/Offline route/)).toBeVisible();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("8 + 7");
});

test("@claim:demo-sandbox opens an isolated sample route and can return to real storage", async ({ page }) => {
  await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("arithmetic-steps");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction("settings", "readwrite");
    transaction.objectStore("settings").put({ key: "real-sentinel", value: "keep-real-data" });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    database.close();
  });
  await page.getByRole("button", { name: "Try it with sample data" }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle("Demo — Arithmetic Steps");
  await expect(page.getByText("Demo — sample data, nothing is saved.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("52 − 18");
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText(/Nothing is left to take away/)).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();

  const names = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(names).toContain("demo:arithmetic-steps");
  expect(names).toContain("arithmetic-steps");
  const realSentinel = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("arithmetic-steps");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const value = await new Promise<{ key: string; value: string } | undefined>((resolve, reject) => {
      const request = database.transaction("settings").objectStore("settings").get("real-sentinel");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return value?.value;
  });
  expect(realSentinel).toBe("keep-real-data");

  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/#learn$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Explore addition and subtraction steps");
  const namesAfterLeaving = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(namesAfterLeaving).not.toContain("demo:arithmetic-steps");
  expect(namesAfterLeaving).toContain("arithmetic-steps");
});

test("@claim:offline-reload works offline after the first visit from the demo entry point", async ({ page, context, isMobile }) => {
  test.skip(isMobile, "one Chromium offline run covers the same service worker");
  const workerRequests: string[] = [];
  page.on("request", (request) => workerRequests.push(new URL(request.url()).pathname));
  await page.goto("/demo");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("52 − 18");
  await expect(page.getByText("Demo — sample data, nothing is saved.", { exact: false })).toBeVisible();
  expect(workerRequests).not.toContain("/staticwebapp.config.json");
});

test("@claim:local-only keeps route activity local and has no account controls", async ({ page }) => {
  const requestOrigins = new Set<string>();
  page.on("request", (request) => requestOrigins.add(new URL(request.url()).origin));
  await page.getByRole("button", { name: "Try it with sample data" }).click();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText(/Nothing is left to take away/)).toBeVisible();
  expect([...requestOrigins].every((origin) => origin === "http://127.0.0.1:4173")).toBe(true);
  await expect(page.locator('input[type="password"], input[name*="email" i], iframe')).toHaveCount(0);
  await expect(page.getByText(/score/i)).toHaveCount(0);
});

test("@claim:tens-and-ones shows each quantity as labelled tens and ones", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByRole("img", { name: "First number: 8, shown as 0 tens and 8 ones" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Second number: 7, shown as 0 tens and 7 ones" })).toBeVisible();
});

test("@claim:narrated-steps records a sentence for each chosen chunk", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.locator(".route-ledger")).toContainText("Move 2 from 7 to 8");
  await expect(page.locator(".route-ledger")).toContainText("10 + 5");
});

test("@claim:replay-and-discussion replays a route and shows discussion prompts", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.locator(".replay-narration")).toContainText("Move 2 from 7 to 8");
  await expect(page.getByRole("heading", { name: "Talk at the station" })).toBeVisible();
  await expect(page.getByText("What stayed the same?")).toBeVisible();
});

test("@claim:free-no-account exposes no payment, account, or score path", async ({ page }) => {
  await expect(page.getByText("Free with no accounts or scores.")).toBeVisible();
  await expect(page.locator('input[type="password"], input[type="email"], [href*="login" i], [href*="signup" i], [href*="checkout" i]')).toHaveCount(0);
  await expect(page.getByText(/price|subscription|purchase|leaderboard/i)).toHaveCount(0);
});

test("@claim:arithmetic-bounds accepts only whole-number routes through 100", async ({ page }) => {
  await page.getByLabel("First number").fill("90");
  await page.getByLabel("Second number").fill("20");
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByText("Choose numbers with a total of 100 or less.")).toBeVisible();
  await page.getByLabel("First number").fill("1.5");
  await page.getByLabel("Second number").fill("2");
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByText("Use whole numbers from 0 to 100.")).toBeVisible();
  await page.getByRole("radio", { name: "Subtract" }).focus();
  await page.getByRole("radio", { name: "Subtract" }).press("Space");
  await page.getByLabel("Start at").fill("5");
  await page.getByLabel("Take away").fill("6");
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await expect(page.getByText("For this route, the number being taken away must be smaller than the starting number.")).toBeVisible();
});

test("@claim:keyboard-controls operates a route without dragging", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).focus();
  await page.getByRole("button", { name: "8 + 7" }).press("Enter");
  await page.getByRole("button", { name: /Begin the route/ }).focus();
  await page.getByRole("button", { name: /Begin the route/ }).press("Enter");
  await page.getByRole("button", { name: "2", exact: true }).focus();
  await page.getByRole("button", { name: "2", exact: true }).press("Space");
  await page.getByRole("button", { name: /Move the chunk/ }).press("Enter");
  await expect(page.getByText("10 + 5", { exact: true }).first()).toBeVisible();
  await expect(page.locator('[draggable="true"]')).toHaveCount(0);
});

test("@claim:unfinished-persistence restores a route after a refresh", async ({ page }) => {
  await page.getByRole("button", { name: "38 + 27" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.getByText("48 + 17", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("38 + 27");
  await expect(page.getByText("48 + 17", { exact: true }).first()).toBeVisible();
});

test("@claim:json-export deterministically downloads one completed route as JSON", async ({ browser }) => {
  // This deliberately does not use the test page/context: a new browser
  // context has no saved routes, caches, or IndexedDB state from another
  // claim. That makes the expected one-route export unambiguous.
  const isolatedContext = await browser.newContext({ acceptDownloads: true });
  const isolatedPage = await isolatedContext.newPage();
  failOnConsoleErrors(isolatedPage);

  try {
    await isolatedPage.goto("http://127.0.0.1:4173/#history");
    await expect(isolatedPage.getByRole("button", { name: "Export JSON" })).toBeDisabled();

    await isolatedPage.goto("http://127.0.0.1:4173/");
    await isolatedPage.getByRole("button", { name: "8 + 7" }).click();
    await isolatedPage.getByRole("button", { name: /Begin the route/ }).click();
    await isolatedPage.getByRole("button", { name: "2", exact: true }).click();
    await isolatedPage.getByRole("button", { name: /Move the chunk/ }).click();
    await isolatedPage.getByRole("button", { name: /Join the numbers and finish/ }).click();
    await isolatedPage.goto("http://127.0.0.1:4173/#history");

    const exportButton = isolatedPage.getByRole("button", { name: "Export JSON" });
    await expect(isolatedPage.getByText("8 + 7 = 15", { exact: true })).toHaveCount(1);
    await expect(exportButton).toBeEnabled();

    // Subscribe before the activation. Waiting after click loses the browser
    // event because a Blob URL download is dispatched synchronously.
    const downloadPromise = isolatedPage.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^arithmetic-steps-\d{4}-\d{2}-\d{2}\.json$/);
    expect(await download.failure()).toBeNull();
    const stream = await download.createReadStream();
    expect(stream).not.toBeNull();
    const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
    const payload = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
      product: string;
      exportedAt: string;
      attempts: Array<{ schemaVersion: number; operation: string; first: number; second: number; result: number; frames: Array<{ kind: string; equation: string }> }>;
    };

    expect(payload.product).toBe("arithmetic-steps");
    expect(Number.isNaN(Date.parse(payload.exportedAt))).toBe(false);
    expect(payload.attempts).toHaveLength(1);
    expect(payload.attempts[0]).toMatchObject({
      schemaVersion: 1,
      operation: "add",
      first: 8,
      second: 7,
      result: 15,
      frames: [
        { kind: "start", equation: "8 + 7" },
        { kind: "move", equation: "10 + 5" },
        { kind: "finish", equation: "8 + 7 = 15" }
      ]
    });
  } finally {
    await isolatedContext.close();
  }
});

test("@claim:json-import restores valid routes chosen by the user", async ({ page }) => {
  await page.goto("/#history");
  await page.getByLabel("Import JSON").setInputFiles({
    name: "routes.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ attempts: [{
      schemaVersion: 1,
      id: "imported-route",
      operation: "add",
      first: 8,
      second: 7,
      result: 15,
      createdAt: "2026-08-29T00:00:00.000Z",
      frames: [
        { left: 8, right: 7, equation: "8 + 7", narration: "Start with 8 and 7.", kind: "start" },
        { left: 15, right: 0, equation: "8 + 7 = 15", narration: "Join the numbers.", kind: "finish" }
      ]
    }] }))
  });
  await expect(page.getByText("8 + 7 = 15")).toBeVisible();
  await expect(page.getByText("1 route imported.")).toBeVisible();
});

test("@claim:print-card opens the browser print action for the discussion card", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.evaluate(() => {
    const sandboxWindow = window as Window & { printed?: boolean };
    sandboxWindow.print = () => { sandboxWindow.printed = true; };
  });
  await page.getByRole("button", { name: "Print discussion card" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { printed?: boolean }).printed)).toBe(true);
});

test("@claim:reduced-motion makes replay manual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Begin the route/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.getByRole("button", { name: "Play route" }).click();
  await expect(page.getByText("Reduced motion is on, so replay advances one station at a time.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play route" })).toBeVisible();
});

test("@claim:no-game-mechanics has no timer, streak, leaderboard, or answer guesser", async ({ page }) => {
  await expect(page.locator('[data-timer], [data-streak], [data-leaderboard], input[placeholder*="answer" i]')).toHaveCount(0);
  await expect(page.getByText(/timer|streak|leaderboard|guess the answer/i)).toHaveCount(0);
});

test("@claim:mobile-controls fits the 390px viewport with 44px controls", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only viewport check");
  const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  const begin = page.getByRole("button", { name: /Begin the route/ });
  const box = await begin.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await page.getByRole("button", { name: "8 + 7" }).click();
  await begin.click();
  const addQuickChoice = await page.getByRole("button", { name: "2", exact: true }).boundingBox();
  expect(addQuickChoice?.width).toBeGreaterThanOrEqual(44);
  expect(addQuickChoice?.height).toBeGreaterThanOrEqual(44);
  await page.goto("/demo");
  const subtractQuickChoice = await page.getByRole("button", { name: "8", exact: true }).boundingBox();
  expect(subtractQuickChoice?.width).toBeGreaterThanOrEqual(44);
  expect(subtractQuickChoice?.height).toBeGreaterThanOrEqual(44);
});

test("legal pages keep the same accessible shell", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  }
});
