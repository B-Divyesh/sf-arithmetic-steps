# Independent verification 7 — FAIL

- Candidate commit: `5a73364a5663611d3cc7f7ce59ac877f82ec9034`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-08-30 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P0 — required qualified elementary-teacher pedagogy review is absent

The researched brief lists **Teacher-reviewed pedagogy** as a constraint. The
required record in `.factory/pedagogy-review.md` explicitly says, “No named
elementary teacher has reviewed this release in the repository,” and all eight
review-record fields are blank (reviewer/qualification, date, grades, flows,
drag/keyboard observations, narration/replay/discussion feedback, required
changes, and follow-up decision). This is not replaceable by automated testing
or an invented reviewer. The candidate therefore does not meet the acceptance
contract, despite the product QA below passing.

**Required resolution:** a qualified elementary teacher must use both addition
and subtraction flows, direct drag and labelled keyboard controls, narration,
replay, and the discussion card; then complete the named review record with
observations and resulting decision. Rerun this verification after any changes.

## First-read and demo gate — PASS

Opened the live landing page in a fresh browser context. The first screen says
“Explore addition and subtraction steps,” then says it is “For elementary
children with a teacher or parent” and that they move counters to explain how
each answer changes. The first primary control is **Try it with sample data**.
One click opened `/demo`, an isolated and part-complete `52 − 18` route at
`42 − 8`, with the persistent “Demo — sample data, nothing is saved” banner.
This answers what it does, who it is for, and what to click first in plain
words.

## Clean local gates — PASS

1. `npm ci` completed from the clean candidate: 61 packages installed; 0 audit
   vulnerabilities.
2. Every exact command registered in `.factory/claims.json` was run separately
   from the product demo entry point. All 20 claim IDs ran through completion:
   `demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`,
   `visible-focus`, `tens-and-ones`, `direct-manipulation`,
   `narrated-steps`, `replay-and-discussion`, `free-no-account`,
   `arithmetic-bounds`, `keyboard-controls`, `unfinished-persistence`,
   `json-export`, `json-import`, `clear-data`, `print-card`,
   `reduced-motion`, `mobile-controls`, and `no-game-mechanics`.
3. A fresh unfiltered `npm test` passed: TypeScript lint; 14 Vitest unit/static
   tests; 55 Playwright tests passed in 2.0 minutes, with one expected desktop
   mobile-layout skip. This includes the waiting-service-worker update test,
   offline reload, keyboard, touch, invalid-input recovery, data export/import,
   and print flows.
4. `npm run build` passed and generated `dist/`; it precached 24 URLs in
   `arithmetic-steps-6f613e180a4d`.

## Independent live product QA — PASS

The fresh Playwright check completed with no errors:

- Completed sample subtraction `52 − 18 = 34`, narration, manual replay, and
  discussion prompts. Invalid total-over-100, decimal, zero-plus-zero, and
  subtraction-below-zero inputs produced recovery messages while retaining
  input. Boundary `99 + 1 = 100`, JSON download, malformed-import recovery,
  cancel/confirm clear-data behavior all worked.
- At 390 px, `scrollWidth === clientWidth === 390`; no visible interactive
  target was under 44 px. Desktop and mobile had no page or console errors.
- Keyboard first focus was “Skip to main content”; both it and a main action
  had the designed `rgb(214, 154, 45) solid 3px` outline with 3 px offset.
  Reduced motion disabled motion and replay advanced one step with feedback.
- Axe found zero violations, including zero serious/critical issues, on
  landing, demo, completion, empty history, Privacy, Terms, and 404 routes.
  The separate `@axe-core/cli` binary could not launch because this container
  has no system Chrome; the repository's pinned Playwright browser and
  `@axe-core/playwright` scan completed successfully instead.
- The service worker was activated and controlling (`arithmetic-steps-6f613e180a4d`);
  offline `/demo` reload returned 200 and retained the `52 − 18` sample. The
  full suite also exercised a waiting worker update without losing demo data.
- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; an unknown route
  returned styled HTTP 404; all crawled links returned 2xx/3xx.

## Privacy, security, deployment, and budget — PASS

- The live cold-load and complete product flow issued six observed requests,
  all same-origin `https://arithmetic-steps.sociobot.in`; no third-party,
  analytics, account, payment, iframe, or API request was observed.
- Live response headers include a self-only CSP with response-header
  `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict
  referrer policy, and restrictive Permissions Policy. HTML uses 30-second
  revalidation, hashed JS is immutable for one year, and `sw.js` is no-store.
- All 30 locally built public files were fetched from live and compared
  byte-for-byte: zero mismatches. The static PWA exposes no server endpoint,
  authentication, package API, or billing path, so rate-limit and Entra checks
  are not applicable.
- Local `verify-url.sh` passed: title, `lang=en`, one h1, main landmark, image
  alt coverage, labelled buttons, no console errors; measured local load was
  763 ms. Initial application JavaScript is 36.90 kB raw / 10.90 kB gzip plus
  a 0.76 kB loader; CSS is 26.36 kB raw / 6.15 kB gzip, within the static-PWA
  budgets. The 1200-px AVIF hero is 40.7 kB.

## Evidence locations

- Live screenshots and independent run: `/tmp/arithmetic-steps-verify-7-final/`
- Local URL smoke evidence: `/tmp/arithmetic-steps-url-3fWGBG/`

No product-code changes were made during verification.
