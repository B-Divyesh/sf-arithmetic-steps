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

  it("ships a complete shared-shell 404 document and CSP-compatible error styling", async () => {
    const [notFound, offline] = await Promise.all([
      readFile(resolve(root, "public/404.html"), "utf8"),
      readFile(resolve(root, "public/offline.html"), "utf8")
    ]);
    expect(notFound).toContain("Page not found — Arithmetic Steps");
    expect(notFound).toContain("<h1>Page not found</h1>");
    expect(notFound).not.toContain("This stop is not on the line");
    expect(notFound).toContain('href="/"');
    expect(notFound).toContain('href="/error.css"');
    expect(notFound).toContain('name="description"');
    expect(notFound).toContain('rel="canonical" href="https://arithmetic-steps.sociobot.in/404.html"');
    expect(notFound).toContain('rel="apple-touch-icon" href="/assets/icon-192.png"');
    expect(notFound).toContain('property="og:title" content="Page not found — Arithmetic Steps"');
    expect(notFound).toContain('property="og:description"');
    expect(notFound).toContain('property="og:image" content="https://arithmetic-steps.sociobot.in/assets/social-preview.jpg"');
    expect(notFound).toContain('name="twitter:title" content="Page not found — Arithmetic Steps"');
    expect(notFound).toContain('name="twitter:description"');
    expect(notFound).toContain('name="twitter:image" content="https://arithmetic-steps.sociobot.in/assets/social-preview.jpg"');
    expect(notFound).toContain('<header class="site-header">');
    expect(notFound).toContain('<footer class="site-footer">');
    expect(notFound).toContain('href="/privacy/"');
    expect(notFound).toContain('href="/terms/"');
    expect(notFound).toContain('data-build-version>Build __ARITHMETIC_STEPS_VERSION__');
    expect(offline).toContain('href="/error.css"');
    expect(offline).not.toContain("<style");
  });

  it("does not emit inline styles that the production CSP blocks", async () => {
    const source = await readFile(resolve(root, "src/main.ts"), "utf8");
    expect(source).not.toContain('style="--i:');
  });

  it("keeps generated-art provenance in the design record, not as an unregistered footer claim", async () => {
    const [landing, design, claims] = await Promise.all([
      readFile(resolve(root, "index.html"), "utf8"),
      readFile(resolve(root, ".factory/design.md"), "utf8"),
      readFile(resolve(root, ".factory/claims.json"), "utf8")
    ]);
    expect(landing).not.toContain("Poster artwork was generated for this project.");
    expect(design).toContain("Generated with the factory `factory-image` deployment");
    expect(design).toContain("this design record preserves its provenance");
    expect(claims).not.toContain('"id":"artwork-provenance"');
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
    expect(liveChecker).toContain('This self-guided checklist is guidance, not evidence of learning outcomes.');
    expect(liveChecker).not.toContain('name: "Finish the route"');
    expect(liveChecker).not.toContain('name: "Begin the route"');
    expect(liveChecker).not.toContain('name: "You arrived at');
    expect(liveChecker).not.toContain('saved routes');
    expect(liveChecker).not.toContain('Keep routes');
    expect(liveChecker).not.toContain('Remove all routes');
    expect(liveChecker).not.toContain('No finished routes yet');
    expect(liveChecker).not.toContain('Play route');
    expect(liveChecker).not.toContain('one station at a time');
    expect(liveChecker).not.toContain('This optional checklist is guidance, not evidence of learning outcomes.');
  });

  it("keeps the qualified teacher-review release gate explicit without turning local checks into an outcome claim", async () => {
    const [briefText, review, evidence, facilitatorChecklist, app, readme, terms] = await Promise.all([
      readFile(resolve(root, ".factory/brief.json"), "utf8"),
      readFile(resolve(root, ".factory/pedagogy-review.md"), "utf8"),
      readFile(resolve(root, ".factory/pedagogy-evidence.md"), "utf8"),
      readFile(resolve(root, ".factory/facilitator-review.md"), "utf8"),
      readFile(resolve(root, "src/main.ts"), "utf8"),
      readFile(resolve(root, "README.md"), "utf8"),
      readFile(resolve(root, "terms/index.html"), "utf8")
    ]);
    const brief = JSON.parse(briefText) as { constraints: string[] };
    const guidanceBoundary = "This self-guided checklist is guidance, not evidence of learning outcomes.";
    const recordFields = [
      "Reviewer name and elementary-teaching qualification:",
      "Review date:",
      "Ages/grades considered:",
      "Problems exercised (include addition and subtraction):",
      "Direct-drag and keyboard-control observations:",
      "Narration, replay, and discussion-card feedback:",
      "Required changes:",
      "Changes made and follow-up decision:"
    ];

    expect(brief.constraints).toContain("Teacher-reviewed pedagogy");
    for (const field of recordFields) expect(review).toContain(field);
    const reviewLines = review.split(/\r?\n/);
    const completedRecord = recordFields.every((field) => {
      const line = reviewLines.find((candidate) => candidate.startsWith(`- ${field}`));
      return line !== undefined && line.slice(`- ${field}`.length).trim().length > 0;
    });
    if (!completedRecord) expect(review).toContain("Pending external review — do not treat this product as classroom-release");
    for (const reviewFacingSurface of [app, readme, terms]) expect(reviewFacingSurface).toContain(guidanceBoundary);
    expect([app, readme, terms].join("\n")).not.toMatch(/improves? (?:learning|achievement|outcomes?)|raises? (?:scores?|attainment)/i);
    expect(evidence).toContain(guidanceBoundary);
    expect(evidence).toContain("required qualified elementary-teacher review");
    expect(facilitatorChecklist).toContain(guidanceBoundary);
    expect(facilitatorChecklist).toContain("does not replace the qualified elementary-teacher review");
  });

  it("registers the README no-AI-grading statement with its own observable browser claim", async () => {
    const [claimsText, browserTests, readme] = await Promise.all([
      readFile(resolve(root, ".factory/claims.json"), "utf8"),
      readFile(resolve(root, "tests/e2e/app.spec.ts"), "utf8"),
      readFile(resolve(root, "README.md"), "utf8")
    ]);
    const claims = JSON.parse(claimsText) as Array<{ id: string; claim: string; test: string }>;
    const noAiGrading = claims.find((claim) => claim.id === "no-ai-grading");

    expect(readme).toContain("AI grading");
    expect(noAiGrading).toMatchObject({
      id: "no-ai-grading",
      claim: "The product has no AI grading control or model request.",
      test: "npm test -- --grep @claim:no-ai-grading"
    });
    expect(browserTests.match(/@claim:no-ai-grading/g)).toHaveLength(1);
    expect(browserTests).toContain("model feedback");
    expect(browserTests).toContain("/v1\\/responses");
  });

  it("derives every visible build identity and the PWA start URL from package.json", async () => {
    const [packageText, manifestText, main, legal, landing, privacy, terms, notFound, viteConfig, versionWriter] = await Promise.all([
      readFile(resolve(root, "package.json"), "utf8"),
      readFile(resolve(root, "public/manifest.webmanifest"), "utf8"),
      readFile(resolve(root, "src/main.ts"), "utf8"),
      readFile(resolve(root, "src/legal.ts"), "utf8"),
      readFile(resolve(root, "index.html"), "utf8"),
      readFile(resolve(root, "privacy/index.html"), "utf8"),
      readFile(resolve(root, "terms/index.html"), "utf8"),
      readFile(resolve(root, "public/404.html"), "utf8"),
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
    expect(versionWriter).toContain("../dist/404.html");
    expect(versionWriter).toContain('replaceAll("__ARITHMETIC_STEPS_VERSION__", packageInfo.version)');
    expect(versionWriter).not.toContain("../public/manifest.webmanifest");
    expect(versionWriter).toContain("await chmod(manifestUrl, 0o644)");
    expect(packageInfo.scripts.build).toMatch(/^vite build && node scripts\/sync-version\.mjs/);
    expect(viteConfig).toContain("package.json");
    expect(viteConfig).toContain("__ARITHMETIC_STEPS_VERSION__");
    expect(main).toContain("applyBuildVersion()");
    expect(legal).toContain("applyBuildVersion()");
    for (const document of [landing, privacy, terms]) {
      expect(document).toContain("data-build-version");
      expect(document).not.toMatch(/Build 1\.0\./);
    }
    expect(notFound).toContain("data-build-version>Build __ARITHMETIC_STEPS_VERSION__");
  });

  it("uses real product routes in install shortcuts", async () => {
    const manifest = JSON.parse(await readFile(resolve(root, "public/manifest.webmanifest"), "utf8")) as {
      shortcuts: Array<{ name: string; url: string }>;
    };
    expect(manifest.shortcuts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Start a problem", url: "/practice" }),
      expect.objectContaining({ name: "Saved problems", url: "/saved-problems" })
    ]));
    expect(manifest.shortcuts.every((shortcut) => !shortcut.url.includes("#"))).toBe(true);
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
