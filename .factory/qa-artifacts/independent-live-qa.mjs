import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = "https://arithmetic-steps.sociobot.in";
const evidence = { base, startedAt: new Date().toISOString(), checks: {}, errors: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function observe(page) {
  const requests = [];
  const failures = [];
  const consoleErrors = [];
  const pageErrors = [];
  page.on("request", request => requests.push(request.url()));
  page.on("requestfailed", request => failures.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", error => pageErrors.push(error.message));
  return { requests, failures, consoleErrors, pageErrors };
}

async function axe(page, label) {
  const result = await new AxeBuilder({ page }).analyze();
  const blocking = result.violations.filter(item => item.impact === "serious" || item.impact === "critical");
  assert(blocking.length === 0, `${label}: axe found ${blocking.map(item => item.id).join(", ")}`);
  return { totalViolations: result.violations.length, seriousCritical: blocking.length };
}

async function runDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  const observed = await observe(page);
  const response = await page.goto(base, { waitUntil: "networkidle" });
  assert(response?.status() === 200, "desktop landing did not return 200");
  const firstRead = {
    title: await page.title(),
    h1: await page.locator("h1").allTextContents(),
    sentence: await page.locator(".lede").innerText(),
    primaryAction: await page.getByRole("button", { name: "Try it with sample data" }).innerText(),
    facts: await page.locator(".hero-facts li").allTextContents()
  };
  assert(firstRead.h1.length === 1, "landing must have one h1");
  assert(firstRead.sentence.includes("elementary children") && firstRead.sentence.includes("teacher or parent"), "first screen does not name audience");
  await page.screenshot({ path: ".factory/qa-artifacts/live-desktop-landing.png", fullPage: true });
  const landingAxe = await axe(page, "desktop landing");

  await page.getByRole("button", { name: "Try it with sample data" }).click();
  await page.waitForURL(/\/demo\/?$/);
  assert(new URL(page.url()).pathname.replace(/\/$/, "") === "/demo", "sample action did not open /demo");
  await page.getByText("Demo — sample data, nothing is saved.", { exact: false }).waitFor();
  assert((await page.locator("h1").innerText()) === "52 − 18", "demo did not open 52 − 18");
  assert(await page.getByText("42 − 8", { exact: true }).first().isVisible(), "demo is not part complete");
  const demoAxe = await axe(page, "desktop demo");
  await page.getByRole("button", { name: "Take away the chunk" }).click();
  await page.getByRole("button", { name: "Finish the problem" }).click();
  await page.getByRole("heading", { name: "The answer is 34." }).waitFor();
  assert(await page.getByRole("heading", { name: "52 − 18 = 34" }).isVisible(), "final equation missing");
  assert(await page.getByText("What stayed the same?").isVisible(), "discussion prompt missing");
  const completeAxe = await axe(page, "desktop completion");
  await page.screenshot({ path: ".factory/qa-artifacts/live-desktop-complete.png", fullPage: true });

  await page.getByRole("button", { name: "Previous" }).click();
  assert((await page.locator(".replay-narration").innerText()).includes("Take away"), "manual replay did not expose narration");

  await page.getByRole("button", { name: "Start for real" }).click();
  await page.waitForURL(/\/#learn$/);
  assert(page.url().endsWith("/#learn"), "Start for real did not leave demo");

  const invalidCases = [
    { op: "add", first: "90", second: "20", expected: "total of 100 or less" },
    { op: "add", first: "1.5", second: "2", expected: "whole numbers from 0 to 100" },
    { op: "add", first: "0", second: "0", expected: "at least one counter" }
  ];
  for (const item of invalidCases) {
    await page.getByRole("radio", { name: "Add" }).check({ force: true });
    await page.getByLabel("First number").fill(item.first);
    await page.getByLabel("Second number").fill(item.second);
    await page.getByRole("button", { name: "Start the problem" }).click();
    const error = await page.locator("#form-error").innerText();
    assert(error.includes(item.expected), `invalid case ${item.first}+${item.second} gave: ${error}`);
    assert((await page.getByLabel("First number").inputValue()) === item.first, "invalid input was not retained");
  }

  await page.getByRole("radio", { name: "Subtract" }).check({ force: true });
  await page.getByLabel("Start at").fill("5");
  await page.getByLabel("Take away").fill("6");
  await page.getByRole("button", { name: "Start the problem" }).click();
  assert((await page.locator("#form-error").innerText()).includes("smaller than the starting number"), "invalid subtraction was accepted");

  await page.getByRole("radio", { name: "Add" }).check({ force: true });
  await page.getByLabel("First number").fill("99");
  await page.getByLabel("Second number").fill("1");
  await page.getByRole("button", { name: "Start the problem" }).click();
  await page.getByRole("button", { name: "Move the chunk" }).click();
  await page.getByRole("button", { name: "Join the numbers and finish" }).click();
  await page.getByRole("heading", { name: "The answer is 100." }).waitFor();

  await page.goto(`${base}/#history`);
  await page.getByText("99 + 1 = 100").waitFor();
  const exportButton = page.getByRole("button", { name: "Export JSON" });
  await exportButton.waitFor({ state: "visible" });
  assert(await exportButton.isEnabled(), "JSON export control is disabled despite a completed route");
  const downloadPromise = page.waitForEvent("download");
  await exportButton.click();
  const download = await downloadPromise;
  assert(await download.failure() === null, "JSON export failed");
  const downloadStream = await download.createReadStream();
  assert(downloadStream, "JSON export did not produce readable content");
  const downloadChunks = [];
  for await (const chunk of downloadStream) downloadChunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(downloadChunks).toString("utf8"));
  assert(exported.product === "arithmetic-steps", "JSON export has the wrong product identifier");
  assert(Array.isArray(exported.attempts) && exported.attempts.length === 1, "JSON export did not contain exactly the completed route");
  assert(exported.attempts[0]?.operation === "add" && exported.attempts[0]?.first === 99 && exported.attempts[0]?.second === 1 && exported.attempts[0]?.result === 100, "JSON export content did not contain 99 + 1 = 100");
  await page.getByLabel("Import JSON").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{bad") });
  await page.locator(".form-error").filter({ hasText: /Expected property|Unexpected token|JSON/ }).waitFor();
  await page.getByRole("button", { name: "Clear saved problems…" }).click();
  await page.getByRole("button", { name: "Keep problems" }).click();
  await page.getByText("99 + 1 = 100").waitFor();
  await page.getByRole("button", { name: "Clear saved problems…" }).click();
  await page.getByRole("button", { name: "Remove all problems" }).click();
  await page.getByRole("heading", { name: "No finished problems yet" }).waitFor();
  const historyAxe = await axe(page, "desktop history empty");

  const origins = [...new Set(observed.requests.map(url => new URL(url).origin))];
  assert(origins.every(origin => origin === base), `third-party origin observed: ${origins.join(", ")}`);
  assert(observed.failures.length === 0, `request failures: ${observed.failures.join("; ")}`);
  assert(observed.consoleErrors.length === 0, `console errors: ${observed.consoleErrors.join("; ")}`);
  assert(observed.pageErrors.length === 0, `page errors: ${observed.pageErrors.join("; ")}`);

  await context.close();
  return { firstRead, landingAxe, demoAxe, completeAxe, historyAxe, requestCount: observed.requests.length, origins, invalidCases: invalidCases.length + 1, boundary: "99 + 1 = 100", exportDownload: true, exportPayload: "99 + 1 = 100" };
}

async function runMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(`${base}/demo`, { waitUntil: "networkidle" });
  const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert(layout.scrollWidth <= layout.clientWidth + 1, `mobile horizontal overflow ${layout.scrollWidth}/${layout.clientWidth}`);
  const targetSizes = await page.locator("button:visible, a:visible, input:visible, select:visible").evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    return { text: element.getAttribute("aria-label") || element.textContent?.trim().replace(/\s+/g, " ").slice(0, 60), tag: element.tagName, width: Math.round(box.width), height: Math.round(box.height) };
  }));
  const undersized = targetSizes.filter(item => item.width < 44 || item.height < 44);
  assert(undersized.length === 0, `390px target below 44px: ${JSON.stringify(undersized)}`);
  const mobileAxe = await axe(page, "390px demo");
  await page.screenshot({ path: ".factory/qa-artifacts/live-mobile-demo.png", fullPage: true });
  assert(observed.consoleErrors.length === 0 && observed.pageErrors.length === 0, "mobile emitted browser errors");
  await context.close();
  return { layout, mobileAxe, undersized, requestOrigins: [...new Set(observed.requests.map(url => new URL(url).origin))] };
}

async function runKeyboardAndMotion(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(base);
  await page.keyboard.press("Tab");
  await page.waitForTimeout(50);
  const firstFocus = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), outline: getComputedStyle(document.activeElement).outline, offset: getComputedStyle(document.activeElement).outlineOffset }));
  assert(firstFocus.text?.includes("Skip to"), "first keyboard focus is not skip link");
  assert(firstFocus.outline !== "none", "skip link has no visible outline");
  await page.keyboard.press("Enter");
  assert((await page.evaluate(() => document.activeElement?.id)) === "main", "skip link did not move focus to main");
  await page.goto(`${base}/demo`);
  await page.getByRole("button", { name: "Take away the chunk" }).focus();
  await page.waitForTimeout(50);
  const focused = await page.evaluate(() => ({ outline: getComputedStyle(document.activeElement).outline, offset: getComputedStyle(document.activeElement).outlineOffset }));
  assert(focused.outline !== "none", "focused main action has no outline");
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Finish the problem" }).press("Enter");
  await page.getByRole("button", { name: "Previous" }).click();
  const before = await page.locator(".platform-label span").innerText();
  await page.getByRole("button", { name: "Play steps" }).click();
  const after = await page.locator(".platform-label span").innerText();
  assert(before !== after, "reduced-motion replay did not advance one station");
  assert(await page.getByText("Reduced motion is on, so replay advances one step at a time.").isVisible(), "reduced-motion feedback missing");
  const reducedCss = await page.evaluate(() => ({ animationDuration: getComputedStyle(document.body).animationDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior }));
  await context.close();
  return { firstFocus, focused, reducedCss, replayAdvancedOneStep: true };
}

async function runPwa(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${base}/demo`, { waitUntil: "networkidle" });
  const online = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js");
    const worker = registration.installing || registration.waiting || registration.active;
    const states = [worker?.state];
    if (worker && !["activated", "redundant"].includes(worker.state)) await new Promise(resolve => {
      const timer = setTimeout(resolve, 10_000);
      worker.addEventListener("statechange", () => {
        states.push(worker.state);
        if (["activated", "redundant"].includes(worker.state)) { clearTimeout(timer); resolve(); }
      });
    });
    const workerSource = await fetch("/sw.js", { cache: "no-store" }).then(response => response.text());
    return { states, final: worker?.state, registrations: (await navigator.serviceWorker.getRegistrations()).length, caches: await caches.keys(), controlled: Boolean(navigator.serviceWorker.controller), precachesDeploymentConfig: workerSource.includes("staticwebapp.config.json") };
  });
  await context.setOffline(true);
  let offline;
  try {
    const response = await page.reload({ waitUntil: "domcontentloaded", timeout: 15_000 });
    offline = { status: response?.status(), h1: await page.locator("h1").allTextContents() };
  } catch (error) {
    offline = { error: error instanceof Error ? error.message.split("\n")[0] : String(error) };
  }
  await context.close();
  assert(online.final === "activated" && online.controlled && online.registrations > 0, `service worker did not activate/control: ${JSON.stringify(online)}`);
  assert(!online.precachesDeploymentConfig, "service worker precaches deployment-only Static Web Apps configuration");
  assert(offline.status === 200 && offline.h1?.includes("52 − 18"), `offline demo reload failed: ${JSON.stringify(offline)}`);
  return { ...online, offline };
}

async function runRoutes(browser) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const routes = ["/", "/demo", "/privacy/", "/terms/", "/definitely-not-a-route"];
  const results = [];
  for (const route of routes) {
    const response = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    results.push({ route, status: response?.status(), title: await page.title(), h1Count: await page.locator("h1").count(), mainCount: await page.locator("main").count(), axe: await axe(page, route) });
  }
  assert(results.at(-1).status === 404, "unknown route is not a real 404");
  assert(results.every(item => item.h1Count === 1 && item.mainCount === 1), "route shell semantics failed");
  const links = await page.goto(base).then(async () => [...new Set(await page.locator("a[href]").evaluateAll(links => links.map(link => link.href)))]);
  const linkStatuses = [];
  for (const link of links) {
    if (link.startsWith("mailto:")) continue;
    const response = await context.request.get(link, { timeout: 15_000 });
    linkStatuses.push({ link, status: response.status() });
  }
  assert(linkStatuses.every(item => item.status >= 200 && item.status < 400), `dead links: ${JSON.stringify(linkStatuses)}`);
  await context.close();
  return { routes: results, links: linkStatuses };
}

const browser = await chromium.launch({ headless: true });
try {
  console.error("qa: desktop");
  evidence.checks.desktop = await runDesktop(browser);
  console.error("qa: mobile");
  evidence.checks.mobile = await runMobile(browser);
  console.error("qa: keyboard-motion");
  evidence.checks.keyboardMotion = await runKeyboardAndMotion(browser);
  console.error("qa: pwa");
  evidence.checks.pwa = await runPwa(browser);
  console.error("qa: routes-links");
  evidence.checks.routes = await runRoutes(browser);
  evidence.verdict = "PASS";
  evidence.findings = [];
} catch (error) {
  evidence.errors.push(error instanceof Error ? `${error.message}\n${error.stack}` : String(error));
  process.exitCode = 1;
} finally {
  await browser.close();
  evidence.finishedAt = new Date().toISOString();
  console.log(JSON.stringify(evidence, null, 2));
}
