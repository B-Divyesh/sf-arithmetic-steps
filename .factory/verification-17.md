# Independent verification 17 — PASS

Verified candidate commit `7da18cc55e9a11ebda3e753ead68a6c15b107065` against
<https://arithmetic-steps.sociobot.in> on 2026-09-02.

## Verdict

**PASS.** No release-blocking, critical, high, medium, or low defects were
found. The live deployment matches the freshly built candidate for every
publicly retrievable product artifact.

## First-read result

Cold-loading the live landing page answered all required questions in plain
words: it is an addition/subtraction activity for elementary children with a
teacher or parent; children move counters to explain how an answer changes;
and the first action is **Try it with sample data**. That action is a button
and opens the isolated, part-complete `52 − 18` demo in one click. The cold
load had HTTP 200 and no console or page errors. Screenshot:
[`live-cold.png`](evidence-verification-17/live-cold.png).

## Clean-clone checks

- `npm ci` completed successfully (0 reported vulnerabilities).
- Every one of the 23 literal commands in `.factory/claims.json` was run as
  declared from its demo entry point and passed. Each browser claim ran in its
  required fresh context; the viewport-specific `mobile-controls` command
  contains one applicable mobile assertion, all other claim commands contain
  two desktop/mobile assertions.
- `npm test` passed: TypeScript lint, 18 Vitest/static-contract tests, and the
  complete Playwright run (`test-results/.last-run.json` records `passed`).
- `npm run build` passed and produced `dist/`. The initial bundle is 12.93 kB
  gzip JavaScript and 6.47 kB gzip CSS, within the static/PWA budgets.

| Claim ID | Result |
| --- | --- |
| demo-sandbox | PASS |
| offline-reload | PASS |
| local-only | PASS |
| installable-pwa | PASS |
| visible-focus | PASS |
| tens-and-ones | PASS |
| direct-manipulation | PASS |
| narrated-steps | PASS |
| replay-and-discussion | PASS |
| free-no-account | PASS |
| arithmetic-bounds | PASS |
| keyboard-controls | PASS |
| unfinished-persistence | PASS |
| completed-persistence | PASS |
| json-export | PASS |
| json-import | PASS |
| clear-data | PASS |
| print-card | PASS |
| reduced-motion | PASS |
| mobile-controls | PASS |
| facilitator-checklist | PASS |
| self-guided-checklist-guidance | PASS |
| no-game-mechanics | PASS |

## Independent live product QA

The live-browser script and raw result are at
[`verification-summary.json`](evidence-verification-17/verification-summary.json).

- Normal flow: completed the sample `52 − 18 = 34`, checked narrated replay
  and discussion prompts, then left the demo without carrying sample data
  into real storage.
- Boundary and recovery: rejected over-100 addition, decimals, empty first or
  second operands, zero-plus-zero, and subtraction below zero without losing
  entered values; then completed the upper boundary `99 + 1 = 100` and
  exported its JSON.
- Storage: verified the completed-route checkpoint/navigation race on mobile,
  saved-problem visibility, invalid JSON recovery, cancellation and confirmed
  clear-data paths.
- Mobile: at an exact 390 CSS px viewport, `scrollWidth === clientWidth ===
  390`; every measured visible target was at least 44 px in both dimensions.
- Keyboard and motion: the skip link is first in tab order and moves focus to
  `main`; the main action has a 3 px visible focus outline; reduced-motion
  replay advances exactly one step and announces that behavior.
- Accessibility: Axe found zero violations, including zero serious/critical
  findings, on landing, demo, completion, history, mobile, legal pages, and
  the real 404. Every tested route returned one `h1` and one `main`.
- PWA: the live worker activates and controls the page, cache
  `arithmetic-steps-fd6a8ef314e7` is present, and `/demo` reloads offline with
  HTTP 200 and the `52 − 18` sample. A live update test registered
  `/sw.js?verification-update=17`, displayed **An update is ready**, accepted
  **Update**, changed controller, reloaded, and retained `/demo` without
  browser errors.
- Routing: `/`, `/practice`, `/demo`, `/?demo=1`, `/saved-problems`,
  `/privacy/`, and `/terms/` all returned 200; a nonexistent route returned a
  styled 404; all rendered links returned success.

## Privacy, headers, deployment identity, and performance

- The cold/demo/completion request log observed only the first-party origin
  `https://arithmetic-steps.sociobot.in` (10 requests in the independent
  desktop flow), no request failures, no console/page errors, frames, accounts,
  payment controls, or third-party runtime traffic. This independently agrees
  with the passing `local-only` claim test.
- Live headers include a self-only CSP (including `connect-src 'self'` and
  `frame-ancestors 'none'`), HSTS, `nosniff`, `DENY` framing, strict referrer
  policy, and restrictive permissions policy. Hashed assets are immutable for
  one year; `sw.js` is `no-cache, no-store, must-revalidate`; the manifest is
  `no-cache`.
- This is a static PWA with no product server-side endpoint, sign-in, billing,
  or product-unlock API. A 429 allowance test is therefore not applicable.
- A fresh `npm run build` was compared with live files: all 24 publicly served,
  non-source-map artifacts were SHA-256 identical. The only generated file not
  fetchable is `staticwebapp.config.json` (expected HTTP 404); its live header
  behavior was independently verified.
- Fresh mobile Lighthouse:
  **Performance 98, Accessibility 100, Best Practices 100, SEO 100**;
  LCP 1.1 s, CLS 0, and total transfer 41 KiB. Raw report:
  [`lighthouse-live.json`](evidence-verification-17/lighthouse-live.json).

## Evidence

- [`desktop-landing.png`](evidence-verification-17/desktop-landing.png)
- [`desktop-complete.png`](evidence-verification-17/desktop-complete.png)
- [`mobile-demo.png`](evidence-verification-17/mobile-demo.png)
- [`mobile-saved-problems.png`](evidence-verification-17/mobile-saved-problems.png)
- [`blank-first-rejected.png`](evidence-verification-17/blank-first-rejected.png)

## Defects by severity

None found.
