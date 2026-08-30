import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

describe("static hosting contract", () => {
  it("ships security, cache, and real-404 settings for Static Web Apps", async () => {
    const config = JSON.parse(await readFile(resolve(root, "public/staticwebapp.config.json"), "utf8")) as {
      globalHeaders: Record<string, string>;
      routes: { route: string; rewrite?: string; headers?: Record<string, string> }[];
      responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
    };
    expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(config.globalHeaders["X-Frame-Options"]).toBe("DENY");
    expect(config.globalHeaders["Permissions-Policy"]).toContain("camera=()");
    expect(config.routes.find((route) => route.route === "/demo")).toMatchObject({ rewrite: "/index.html" });
    expect(config.routes.find((route) => route.route === "/assets/*")?.headers?.["Cache-Control"]).toContain("immutable");
    expect(config.responseOverrides["404"]).toEqual({ rewrite: "/404.html", statusCode: 404 });
  });

  it("ships a styled standalone 404 document and CSP-compatible error styling", async () => {
    const [notFound, offline] = await Promise.all([
      readFile(resolve(root, "public/404.html"), "utf8"),
      readFile(resolve(root, "public/offline.html"), "utf8")
    ]);
    expect(notFound).toContain("Page not found — Arithmetic Steps");
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('href="/error.css"');
    expect(offline).toContain('href="/error.css"');
    expect(offline).not.toContain("<style");
  });

  it("does not emit inline styles that the production CSP blocks", async () => {
    const source = await readFile(resolve(root, "src/main.ts"), "utf8");
    expect(source).not.toContain('style="--i:');
  });

  it("keeps deployment-only metadata out of the production precache", async () => {
    const generator = await readFile(resolve(root, "scripts/generate-sw.mjs"), "utf8");
    expect(generator).toContain('deploymentOnlyFiles');
    expect(generator).toContain('staticwebapp.config.json');

    expect(generator).toContain('!deploymentOnlyFiles.has');
  });

  it("keeps the independent live checker aligned with the current control and completion copy", async () => {
    const [app, liveChecker] = await Promise.all([
      readFile(resolve(root, "src/main.ts"), "utf8"),
      readFile(resolve(root, ".factory/qa-artifacts/independent-live-qa.mjs"), "utf8")
    ]);
    expect(app).toContain('id="finish-route">Finish the problem</button>');
    expect(app).toContain('type="submit">Start the problem');
    expect(app).toContain('>The answer is ${route.result}.</h1>');
    expect(app).toContain('>Clear saved problems…</button>');
    expect(app).toContain('>Keep problems</button>');
    expect(app).toContain('>Remove all problems</button>');
    expect(app).toContain('<h2>No finished problems yet</h2>');
    expect(app).toContain('state.replayTimer === null ? "Play steps" : "Pause"');
    expect(app).toContain('replay advances one step at a time.');
    expect(liveChecker).toContain('name: "Finish the problem"');
    expect(liveChecker).toContain('name: "Start the problem"');
    expect(liveChecker).toContain('name: "The answer is 34."');
    expect(liveChecker).toContain('name: "The answer is 100."');
    expect(liveChecker).toContain('name: "Clear saved problems…"');
    expect(liveChecker).toContain('name: "Keep problems"');
    expect(liveChecker).toContain('name: "Remove all problems"');
    expect(liveChecker).toContain('name: "No finished problems yet"');
    expect(liveChecker).toContain('name: "Play steps"');
    expect(liveChecker).toContain('replay advances one step at a time.');
    expect(liveChecker).not.toContain('name: "Finish the route"');
    expect(liveChecker).not.toContain('name: "Begin the route"');
    expect(liveChecker).not.toContain('name: "You arrived at');
    expect(liveChecker).not.toContain('saved routes');
    expect(liveChecker).not.toContain('Keep routes');
    expect(liveChecker).not.toContain('Remove all routes');
    expect(liveChecker).not.toContain('No finished routes yet');
    expect(liveChecker).not.toContain('Play route');
    expect(liveChecker).not.toContain('one station at a time');
  });

  it("preserves the research review constraint without inventing a completed review", async () => {
    const [briefText, evidence, facilitatorReview, app, readme, landing, privacy, terms, manifest] = await Promise.all([
      readFile(resolve(root, ".factory/brief.json"), "utf8"),
      readFile(resolve(root, ".factory/pedagogy-evidence.md"), "utf8"),
      readFile(resolve(root, ".factory/facilitator-review.md"), "utf8"),
      readFile(resolve(root, "src/main.ts"), "utf8"),
      readFile(resolve(root, "README.md"), "utf8"),
      readFile(resolve(root, "index.html"), "utf8"),
      readFile(resolve(root, "privacy/index.html"), "utf8"),
      readFile(resolve(root, "terms/index.html"), "utf8"),
      readFile(resolve(root, "public/manifest.webmanifest"), "utf8")
    ]);
    const brief = JSON.parse(briefText) as { constraints: string[] };
    const activeCopy = [briefText, app, readme, landing, privacy, terms, manifest].join("\n");

    expect(brief.constraints).toContain("Teacher-reviewed pedagogy");
    expect([app, readme, landing, privacy, terms, manifest].join("\n")).not.toMatch(/teacher[- ]reviewed|reviewed by (?:an?|the)|qualified (?:elementary )?teacher/i);
    expect(activeCopy).not.toMatch(/improves? (?:learning|achievement|outcomes?)|raises? (?:scores?|attainment)/i);
    expect(evidence).toContain("does **not** contain a completed qualified educator review");
    expect(evidence).toContain("No study, reviewer identity");
    expect(facilitatorReview).toContain("It is not a teacher study");
    expect(facilitatorReview).toContain("npm test -- --grep @claim:facilitator-review");
    expect(evidence).toContain("There is no answer-entry field, timer, score, streak, or leaderboard.");
    expect(app).toContain("For the grown-up nearby");
    expect(app).toContain("What stayed the same?");
    expect(app).toContain("Review this tool before classroom use");
    expect(app).toContain('name="facilitator-review"');
    expect(app).toContain("Reset review checklist");
    expect(app).toContain("Marks are not stored.");
  });

  it("derives every visible build identity and the PWA start URL from package.json", async () => {
    const [packageText, manifestText, main, legal, landing, privacy, terms, viteConfig, versionWriter] = await Promise.all([
      readFile(resolve(root, "package.json"), "utf8"),
      readFile(resolve(root, "public/manifest.webmanifest"), "utf8"),
      readFile(resolve(root, "src/main.ts"), "utf8"),
      readFile(resolve(root, "src/legal.ts"), "utf8"),
      readFile(resolve(root, "index.html"), "utf8"),
      readFile(resolve(root, "privacy/index.html"), "utf8"),
      readFile(resolve(root, "terms/index.html"), "utf8"),
      readFile(resolve(root, "vite.config.ts"), "utf8"),
      readFile(resolve(root, "scripts/sync-version.mjs"), "utf8")
    ]);
    const packageInfo = JSON.parse(packageText) as { version: string; scripts: Record<string, string> };
    const manifest = JSON.parse(manifestText) as { start_url: string };

    // The source template is safe for the dev server. The production version
    // query is written only after Vite emits dist/, so a build never edits a
    // tracked source file (which fails in immutable build workspaces).
    expect(manifest.start_url).toBe("/?source=pwa");
    expect(versionWriter).toContain("../dist/manifest.webmanifest");
    expect(versionWriter).not.toContain("../public/manifest.webmanifest");
    expect(packageInfo.scripts.build).toMatch(/^vite build && node scripts\/sync-version\.mjs/);
    expect(viteConfig).toContain("package.json");
    expect(viteConfig).toContain("__ARITHMETIC_STEPS_VERSION__");
    expect(main).toContain("applyBuildVersion()");
    expect(legal).toContain("applyBuildVersion()");
    for (const document of [landing, privacy, terms]) {
      expect(document).toContain("data-build-version");
      expect(document).not.toMatch(/Build 1\.0\./);
    }
  });

  it("gives every registered public claim one exactly tagged browser regression", async () => {
    const [claimsText, browserTests] = await Promise.all([
      readFile(resolve(root, ".factory/claims.json"), "utf8"),
      readFile(resolve(root, "tests/e2e/app.spec.ts"), "utf8")
    ]);
    const claims = JSON.parse(claimsText) as { id: string; test: string }[];
    expect(claims.length).toBeGreaterThan(3);
    for (const claim of claims) {
      expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
      expect(browserTests.match(new RegExp(`@claim:${claim.id}`, "g"))).toHaveLength(1);
    }
  });
});
