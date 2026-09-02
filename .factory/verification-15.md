# Independent verification 15 — FAIL

- Candidate: `ec246b78c9363860f801aecfcbed0106858aa478`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-02 UTC
- Verdict: **FAIL — do not release**

## Release-blocking defect

### P0 — teacher-reviewed pedagogy remains unevidenced

The original researched brief supplied as this verification's acceptance
contract lists **“Teacher-reviewed pedagogy”** as a product constraint. This
candidate does not provide it. Its checked-in `.factory/brief.json` replaces
that requirement with a self-guided four-check facilitator checklist;
`.factory/facilitator-review.md` calls the checklist local guidance; and
`.factory/pedagogy-evidence.md` says the release makes no outside-review,
classroom-study, approval, validation, or learning-outcome claim.

The checklist is working and honestly bounded, but it is not evidence that a
qualified elementary teacher reviewed the pedagogy. There is no reviewer,
qualification, date, age/grade range, exercised flows, observations, requested
changes, or release decision. Renaming the local brief cannot alter the
original acceptance contract.

Required resolution: obtain and record a qualified elementary teacher review
of the addition and subtraction flows, direct manipulation and labelled
keyboard path, narrated steps, replay, and discussion card. Include reviewer
qualification, review date, learner range, observations, required changes, and
release decision; implement resulting changes and repeat independent QA.

## Required checks

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci` installed 61 packages; audit reported 0 vulnerabilities. |
| Claims file | PASS | `.factory/claims.json` exists with 22 entries. |
| Every literal claim command | PASS | Each `npm test -- --grep @claim:<id>` command was run serially from the clean install. All 22 passed in both Chromium desktop and mobile projects. |
| Full tests | PASS | A clean standalone `npm test` passed: TypeScript lint, 17 Vitest checks, 67 Playwright checks; 3 viewport-inapplicable tests skipped. Runtime: 2.9 minutes. |
| Production build | PASS | `npm run build` created `dist/`, PWA manifest 1.0.12, and a versioned worker precaching 24 URLs. |
| Candidate/deployment identity | PASS | All 24 public production artifacts from local `dist/` (excluding deployment-only `staticwebapp.config.json` and source maps) byte-matched live. Main asset: `main-CIr76rh0.js`; live footer: Build 1.0.12. |
| Budget | PASS | Main JS 41,608 B raw / 12,090 B gzip; CSS 28,215 B raw / 6,455 B gzip — well under static-PWA budgets. |

All declared claims passed: isolated sample demo/reset, offline reload,
local-only request behavior, PWA installation, focus, tens-and-ones labels,
drag and keyboard moves, narration, replay/discussion, free/no-account,
arithmetic validation and recovery, persistence, JSON export/import,
confirmed clear, print, reduced motion, 390 px controls, facilitator-checklist
behavior, its guidance boundary, and no game mechanics.

## Product QA

- **First-read/demo: PASS.** Cold live `/` reads “Explore addition and
  subtraction steps,” names elementary children with a teacher or parent, and
  offers the one-click **Try it with sample data** action. `/demo` immediately
  shows the part-complete `52 − 18` route and its persistent isolated-demo
  banner.
- **End to end and recovery: PASS.** The live demo exposed its remaining
  chunk, narration, and reasoning trail. The automated suite independently
  completes addition and subtraction routes, replays and prints them, exports
  and imports JSON, confirms deletion, and exercises blank/decimal/out-of-range
  errors followed by successful recovery. A separate live `99 + 2` check kept
  values, announced “Choose numbers with a total of 100 or less,” and focused
  the first-number field.
- **Desktop, mobile, keyboard, accessibility: PASS.** Visual inspection found
  the product-specific transit-poster system intact at 1440 px and the demo
  usable at 390 px with no horizontal overflow. Live `/demo` Axe returned zero
  violations (therefore zero serious/critical); no console or page errors were
  observed. Invalid-input focus had a visible `rgb(214, 154, 45)` 3 px outline
  with 3 px offset. The test suite also verified skip-link keyboard use,
  labelled keyboard counter controls, exact-390 control sizes, 200% text, and
  reduced-motion replay.
- **PWA/offline/update: PASS.** Fresh live mobile `/demo` gained a controlling
  `/sw.js`, then reloaded while offline with `52 − 18` still available and no
  errors. The candidate suite passed the waiting-service-worker update path.
- **Privacy/network: PASS.** Cold live load and live demo observation made
  same-origin GET requests only (document, first-party JS/CSS/artwork, and
  worker); no analytics, third-party runtime request, frame, account, or
  identifying input was observed. This static PWA has no server endpoint or
  product-unlock API, so 429/rate-limit and Entra checks are not applicable.
- **Headers/cache/routing: PASS.** Live responses send self-only CSP including
  response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer
  policy, and restrictive permissions policy. HTML uses 30-second
  revalidation; hashed JS/CSS are `max-age=31536000, immutable`; worker is
  `no-cache, no-store, must-revalidate`. `/`, `/demo`, `/privacy/`, `/terms/`,
  `/404.html`, manifest, worker, and assets returned 200.

No product code was modified during this verification.
