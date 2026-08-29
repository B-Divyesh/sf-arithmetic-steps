import { expect, test, type Browser, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

function failOnConsoleErrors(page: Page): void {
  page.on("console", (message) => {
    if (message.type() === "error") throw new Error(`Browser console error: ${message.text()}`);
  });
}

async function readSetting(page: Page, databaseName: string, key: string): Promise<unknown> {
  return page.evaluate(async ({ databaseName: name, settingKey }) => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const value = await new Promise<{ key: string; value: unknown } | undefined>((resolve, reject) => {
      const request = database.transaction("settings").objectStore("settings").get(settingKey);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return value?.value;
  }, { databaseName, settingKey: key });
}

type ExportedAttempt = {
  id: string;
  createdAt: string;
  schemaVersion: number;
  operation: string;
  first: number;
  second: number;
  result: number;
  frames: Array<{ kind: string; equation: string }>;
};

type ExportPayload = {
  product: string;
  exportedAt: string;
  attempts: ExportedAttempt[];
};

async function exportCompletedRouteFromFreshContext(browser: Browser): Promise<ExportPayload> {
  const isolatedContext = await browser.newContext({ acceptDownloads: true });
  const isolatedPage = await isolatedContext.newPage();
  failOnConsoleErrors(isolatedPage);

  try {
    await isolatedPage.goto("http://127.0.0.1:4173/#history");
    await expect(isolatedPage.getByRole("button", { name: "Export JSON" })).toBeDisabled();

    await isolatedPage.goto("http://127.0.0.1:4173/");
    await isolatedPage.getByRole("button", { name: "8 + 7" }).click();
    await isolatedPage.getByRole("button", { name: /Start the problem/ }).click();
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
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as ExportPayload;
  } finally {
    await isolatedContext.close();
  }
}

function stableExport(payload: ExportPayload): object {
  return {
    product: payload.product,
    exportedAt: "timestamp",
    attempts: payload.attempts.map(({ id: _id, createdAt: _createdAt, ...attempt }) => ({
      id: "route-id",
      createdAt: "timestamp",
      ...attempt
    }))
  };
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
  await page.getByRole("button", { name: "Finish the problem" }).click();
  expect((await new AxeBuilder({ page: page as never }).analyze()).violations).toEqual([]);
});

test("completes, narrates, replays, and saves an addition route", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("8 + 7");
  await expect(page.getByText(/total stays 15/)).toBeVisible();

  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.getByText("10 + 5", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/have the same total/)).toBeVisible();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The answer is 15.");
  await expect(page.getByRole("heading", { name: "8 + 7 = 15" })).toBeVisible();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.locator(".replay-narration")).toContainText("Move 2 from 7 to 8");

  await page.goto("/#history");
  await expect(page.getByText("8 + 7 = 15")).toBeVisible();
  await page.getByRole("button", { name: "Replay steps" }).click();
  await expect(page.getByRole("button", { name: "Play steps" })).toBeVisible();
});

test("supports a child-chosen multi-step subtraction route", async ({ page }) => {
  await page.getByRole("radio", { name: "Subtract" }).focus();
  await page.getByRole("radio", { name: "Subtract" }).press("Space");
  await page.getByRole("button", { name: "52 − 18" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();

  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "8", exact: true }).click();
  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText(/Nothing is left to take away/)).toBeVisible();
  await page.getByRole("button", { name: "Finish the problem" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("The answer is 34.");
  await expect(page.getByRole("heading", { name: "52 − 18 = 34" })).toBeVisible();
});

test("shows helpful validation without losing the entered problem", async ({ page }) => {
  await page.getByLabel("First number").fill("90");
  await page.getByLabel("Second number").fill("20");
  await page.getByRole("button", { name: /Start the problem/ }).click();
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
  await expect(page.getByText(/You are offline/)).toBeVisible();
  await page.getByRole("button", { name: /Start the problem/ }).click();
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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("52 − 18");
  await page.getByRole("button", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/#learn$/);

  // Regression: this used to pass only through the Start for real button.
  // Going directly to /demo, then following the normal home link, left the
  // demo database behind even though the visible demo had been exited.
  await page.goto("/demo");
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page).toHaveTitle("Demo — Arithmetic Steps");
  await expect(page.getByText("Demo — sample data, nothing is saved.", { exact: false })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("52 − 18");
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();

  const initialDemoRoute = await readSetting(page, "demo:arithmetic-steps", "active-route") as { first: number; second: number; frames: unknown[] };
  expect(initialDemoRoute).toMatchObject({ first: 52, second: 18 });
  expect(initialDemoRoute.frames).toHaveLength(2);
  expect(await readSetting(page, "arithmetic-steps", "real-sentinel")).toBe("keep-real-data");
  expect(await readSetting(page, "arithmetic-steps", "active-route")).toBeUndefined();

  await page.getByRole("button", { name: /Take away the chunk/ }).click();
  await expect(page.getByText(/Nothing is left to take away/)).toBeVisible();
  const changedDemoRoute = await readSetting(page, "demo:arithmetic-steps", "active-route") as { frames: Array<{ equation: string }> };
  expect(changedDemoRoute.frames.at(-1)).toMatchObject({ left: 34, right: 0, equation: "34" });
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText("The 52 − 18 sample problem is ready again.")).toBeVisible();
  const resetDemoRoute = await readSetting(page, "demo:arithmetic-steps", "active-route") as { frames: unknown[] };
  expect(resetDemoRoute.frames).toHaveLength(2);

  const names = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(names).toContain("demo:arithmetic-steps");
  expect(names).toContain("arithmetic-steps");
  expect(await readSetting(page, "arithmetic-steps", "real-sentinel")).toBe("keep-real-data");

  await page.getByRole("link", { name: "Arithmetic Steps home" }).click();
  await expect(page).toHaveURL(/\/#learn$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Explore addition and subtraction steps");
  const namesAfterLeaving = await page.evaluate(async () => (await indexedDB.databases()).map((database) => database.name));
  expect(namesAfterLeaving).not.toContain("demo:arithmetic-steps");
  expect(namesAfterLeaving).toContain("arithmetic-steps");
  expect(await readSetting(page, "arithmetic-steps", "real-sentinel")).toBe("keep-real-data");
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

test("@claim:local-only keeps the complete cold-load and worker flow first-party", async ({ browser }) => {
  const isolatedContext = await browser.newContext();
  const requests: Array<{ origin: string; path: string; method: string; postData: string | null; fromWorker: boolean }> = [];
  isolatedContext.on("request", (request) => requests.push({
    origin: new URL(request.url()).origin,
    path: new URL(request.url()).pathname,
    method: request.method(),
    postData: request.postData(),
    fromWorker: request.serviceWorker() !== null
  }));
  const isolatedPage = await isolatedContext.newPage();
  failOnConsoleErrors(isolatedPage);
  try {
    await isolatedPage.goto("http://127.0.0.1:4173/");
    await isolatedPage.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
    });
    await isolatedPage.getByRole("button", { name: "Try it with sample data" }).click();
    await isolatedPage.getByRole("button", { name: /Take away the chunk/ }).click();
    await expect(isolatedPage.getByText(/Nothing is left to take away/)).toBeVisible();
    expect(requests.length).toBeGreaterThan(10);
    expect(requests.some((request) => request.path === "/sw.js")).toBe(true);
    expect(requests.some((request) => request.fromWorker)).toBe(true);
    expect(requests.every((request) => request.origin === "http://127.0.0.1:4173")).toBe(true);
    expect(requests.every((request) => request.method === "GET" && request.postData === null)).toBe(true);
    await expect(isolatedPage.locator('input[type="password"], input[name*="email" i], iframe')).toHaveCount(0);
    await expect(isolatedPage.getByText(/score/i)).toHaveCount(0);
  } finally {
    await isolatedContext.close();
  }
});

test("@claim:installable-pwa ships a valid manifest and controlling offline worker", async ({ page, context }) => {
  const manifestResponse = await page.request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json() as {
    name: string;
    start_url: string;
    display: string;
    icons: Array<{ src: string; sizes: string; purpose: string }>;
  };
  expect(manifest).toMatchObject({ name: "Arithmetic Steps", display: "standalone" });
  expect(manifest.start_url).toMatch(/^\//);
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: "192x192", purpose: "any" }),
    expect.objectContaining({ sizes: "512x512", purpose: "any" }),
    expect.objectContaining({ sizes: "512x512", purpose: "maskable" })
  ]));
  for (const icon of manifest.icons) expect((await page.request.get(icon.src)).ok()).toBe(true);

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true }));
  });
  expect(await page.evaluate(() => navigator.serviceWorker.controller?.state)).toBe("activated");

  const session = await context.newCDPSession(page);
  const installability = await session.send("Page.getInstallabilityErrors");
  expect(installability.installabilityErrors).toEqual([]);
});

test("@claim:visible-focus shows a designed focus ring during keyboard use", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to the number workshop" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  const focusStyle = await skipLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineOffset: style.outlineOffset,
      boxShadow: style.boxShadow
    };
  });
  expect(focusStyle).toMatchObject({
    outlineColor: "rgb(214, 154, 45)",
    outlineStyle: "solid",
    outlineWidth: "3px",
    outlineOffset: "3px"
  });
  expect(focusStyle.boxShadow).toContain("rgb(23, 59, 63)");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("@claim:tens-and-ones shows each quantity as labelled tens and ones", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await expect(page.getByRole("img", { name: "First number: 8, shown as 0 ten-frames and 8 ones" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Second number: 7, shown as 0 ten-frames and 7 ones" })).toBeVisible();
});

test("@claim:direct-manipulation drags one-counters and ten-frames for both operations", async ({ page, isMobile }) => {
  const dragToken = async (sourceName: string, targetName: string, nativeDesktop = false): Promise<void> => {
    const amount = sourceName.includes("ten-frame") ? "10" : "1";
    const source = page.locator(`[data-counter-amount="${amount}"][aria-label="${sourceName}"]`).first();
    const target = page.locator(`[data-drop-target][aria-label="${targetName}"]:visible`).last();
    await expect(source).toHaveAttribute("draggable", "true");
    if (isMobile) {
      await page.evaluate(({ sourceName: wantedSource, targetName: wantedTarget }) => {
        const source = [...document.querySelectorAll<HTMLElement>("[data-counter-amount]")].find((element) => element.getAttribute("aria-label") === wantedSource);
        const targets = [...document.querySelectorAll<HTMLElement>("[data-drop-target]")].filter((element) => element.getAttribute("aria-label") === wantedTarget && getComputedStyle(element).display !== "none");
        const target = targets.find((element) => element.hasAttribute("data-mobile-drop-target")) ?? targets[0];
        if (!source || !target) throw new Error("Direct-move controls are missing.");
        const from = source.getBoundingClientRect();
        source.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerId: 1, pointerType: "touch", clientX: from.x + from.width / 2, clientY: from.y + from.height / 2 }));
        document.documentElement.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "center" });
        const to = target.getBoundingClientRect();
        window.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerId: 1, pointerType: "touch", clientX: to.x + to.width / 2, clientY: to.y + to.height / 2 }));
      }, { sourceName, targetName });
    } else if (nativeDesktop) {
      await source.dragTo(target);
    } else {
      await page.evaluate(({ sourceName: wantedSource, targetName: wantedTarget, amount: movedAmount }) => {
        const source = [...document.querySelectorAll<HTMLElement>("[data-counter-amount]")].find((element) => element.getAttribute("aria-label") === wantedSource);
        const target = [...document.querySelectorAll<HTMLElement>("[data-drop-target]")].find((element) => element.getAttribute("aria-label") === wantedTarget && getComputedStyle(element).display !== "none");
        if (!source || !target) throw new Error("Direct-move controls are missing.");
        const transfer = new DataTransfer();
        transfer.setData("text/plain", movedAmount);
        source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer: transfer }));
        target.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer: transfer }));
        target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
      }, { sourceName, targetName, amount });
    }
  };

  await page.getByRole("button", { name: "38 + 27" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await dragToken("Choose one ten-frame (10) from Second number to move", "Move counters to First number", true);
  await expect(page.getByText("48 + 17", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".route-ledger")).toContainText("Move 10 from 27 to 38");
  await dragToken("Choose one counter (1) from Second number to move", "Move counters to First number");
  await expect(page.getByText("49 + 16", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".route-ledger")).toContainText("Move 1 from 17 to 48");

  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.getByRole("button", { name: "Start another problem" }).click();
  await page.getByRole("radio", { name: "Subtract" }).focus();
  await page.getByRole("radio", { name: "Subtract" }).press("Space");
  await page.getByRole("button", { name: "52 − 18" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await dragToken("Choose one ten-frame (10) from Still to subtract to move", "Drop counters here to take them away");
  await expect(page.getByText("42 − 8", { exact: true }).first()).toBeVisible();
  await expect(page.locator(".route-ledger")).toContainText("Take away 10");
});

test("@claim:narrated-steps records a sentence for each chosen chunk", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.locator(".route-ledger")).toContainText("Move 2 from 7 to 8");
  await expect(page.locator(".route-ledger")).toContainText("10 + 5");
});

test("@claim:replay-and-discussion replays a route and shows discussion prompts", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.getByRole("button", { name: "Previous" }).click();
  await expect(page.locator(".replay-narration")).toContainText("Move 2 from 7 to 8");
  await expect(page.getByRole("heading", { name: "Discuss the steps" })).toBeVisible();
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
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await expect(page.getByText("Choose numbers with a total of 100 or less.")).toBeVisible();
  await page.getByLabel("First number").fill("1.5");
  await page.getByLabel("Second number").fill("2");
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await expect(page.getByText("Use whole numbers from 0 to 100.")).toBeVisible();
  await page.getByRole("radio", { name: "Subtract" }).focus();
  await page.getByRole("radio", { name: "Subtract" }).press("Space");
  await page.getByLabel("Start at").fill("5");
  await page.getByLabel("Take away").fill("6");
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await expect(page.getByText("The number being taken away must be smaller than the starting number.")).toBeVisible();
});

test("@claim:keyboard-controls provides the same move without dragging", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).focus();
  await page.getByRole("button", { name: "8 + 7" }).press("Enter");
  await page.getByRole("button", { name: /Start the problem/ }).focus();
  await page.getByRole("button", { name: /Start the problem/ }).press("Enter");
  await page.getByRole("button", { name: "2", exact: true }).focus();
  await page.getByRole("button", { name: "2", exact: true }).press("Space");
  await page.getByRole("button", { name: /Move the chunk/ }).press("Enter");
  await expect(page.getByText("10 + 5", { exact: true }).first()).toBeVisible();
  expect(await page.locator('[draggable="true"]').count()).toBeGreaterThan(0);
});

test("@claim:unfinished-persistence restores a route after a refresh", async ({ page }) => {
  await page.getByRole("button", { name: "38 + 27" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await expect(page.getByText("48 + 17", { exact: true }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("38 + 27");
  await expect(page.getByText("48 + 17", { exact: true }).first()).toBeVisible();
});

test("@claim:json-export deterministically downloads one completed route as JSON", async ({ browser }) => {
  // Run the same action in two entirely new browser contexts. This catches a
  // history leak from another demo/claim while making the route data and JSON
  // key order deterministic apart from intentional route/timestamp metadata.
  const [firstExport, secondExport] = await Promise.all([
    exportCompletedRouteFromFreshContext(browser),
    exportCompletedRouteFromFreshContext(browser)
  ]);

  for (const payload of [firstExport, secondExport]) {
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
  }

  expect(stableExport(firstExport)).toEqual(stableExport(secondExport));
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
  await expect(page.getByText("1 problem imported.")).toBeVisible();
});

test("@claim:clear-data keeps saved problems on cancel and deletes them on confirmation", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.goto("/#history");
  await expect(page.getByRole("heading", { name: "Saved problems" })).toBeVisible();
  await expect(page.getByText("8 + 7 = 15", { exact: true })).toHaveCount(1);

  await page.getByRole("button", { name: "Clear saved problems…" }).click();
  await page.getByRole("button", { name: "Keep problems" }).click();
  await expect(page.getByText("8 + 7 = 15", { exact: true })).toHaveCount(1);

  await page.getByRole("button", { name: "Clear saved problems…" }).click();
  await page.getByRole("button", { name: "Remove all problems" }).click();
  await expect(page.getByRole("heading", { name: "No finished problems yet" })).toBeVisible();
  await expect(page.getByText("All saved problems were removed.")).toBeVisible();
  const savedCount = await page.evaluate(async () => {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("arithmetic-steps");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const count = await new Promise<number>((resolve, reject) => {
      const request = database.transaction("attempts").objectStore("attempts").count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    database.close();
    return count;
  });
  expect(savedCount).toBe(0);
});

test("@claim:print-card opens print and isolates a readable discussion card in print media", async ({ page }) => {
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.evaluate(() => {
    const sandboxWindow = window as Window & { printed?: boolean };
    sandboxWindow.print = () => { sandboxWindow.printed = true; };
  });
  await page.getByRole("button", { name: "Print discussion card" }).click();
  await expect.poll(() => page.evaluate(() => (window as Window & { printed?: boolean }).printed)).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#discussion-card")).toBeVisible();
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.locator(".replay-layout")).toBeHidden();
  await expect(page.locator(".completion-actions")).toBeHidden();
  const printStyle = await page.locator("#discussion-card").evaluate((element) => {
    const style = getComputedStyle(element);
    return { breakInside: style.breakInside, boxShadow: style.boxShadow, width: element.getBoundingClientRect().width, viewport: document.documentElement.clientWidth };
  });
  expect(printStyle.breakInside).toBe("avoid");
  expect(printStyle.boxShadow).toBe("none");
  expect(printStyle.width).toBeGreaterThanOrEqual(printStyle.viewport * 0.95);
});

test("@claim:reduced-motion makes replay manual", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "8 + 7" }).click();
  await page.getByRole("button", { name: /Start the problem/ }).click();
  await page.getByRole("button", { name: "2", exact: true }).click();
  await page.getByRole("button", { name: /Move the chunk/ }).click();
  await page.getByRole("button", { name: /Join the numbers and finish/ }).click();
  await page.getByRole("button", { name: "Play steps" }).click();
  await expect(page.getByText("Reduced motion is on, so replay advances one step at a time.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Play steps" })).toBeVisible();
});

test("@claim:no-game-mechanics has no timer, streak, leaderboard, or answer guesser", async ({ page }) => {
  await expect(page.locator('[data-timer], [data-streak], [data-leaderboard], input[placeholder*="answer" i]')).toHaveCount(0);
  await expect(page.getByText(/timer|streak|leaderboard|guess the answer/i)).toHaveCount(0);
});

test("@claim:mobile-controls fits the 390px viewport with 44px controls", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only viewport check");
  const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  const begin = page.getByRole("button", { name: /Start the problem/ });
  const box = await begin.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await page.getByRole("button", { name: "8 + 7" }).click();
  await begin.click();
  const addQuickChoice = await page.getByRole("button", { name: "2", exact: true }).boundingBox();
  expect(addQuickChoice?.width).toBeGreaterThanOrEqual(44);
  expect(addQuickChoice?.height).toBeGreaterThanOrEqual(44);
  const directCounter = await page.getByRole("button", { name: "Choose one counter (1) from Second number to move" }).first().boundingBox();
  expect(directCounter?.width).toBeGreaterThanOrEqual(44);
  expect(directCounter?.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator("[data-mobile-drop-target]")).toBeVisible();
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
