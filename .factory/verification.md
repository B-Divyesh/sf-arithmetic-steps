# Independent verification — FAIL

Verified 2026-08-29 against candidate commit
`c0ce7dd5084356b5df0b916dec17c26d92b4ec62` and the live deployment
<https://arithmetic-steps.sociobot.in>.

## Decision

**FAIL — do not release.** Two mandatory release gates fail before product
quality can be considered: the claims contract is absent, and the cold landing
screen has neither the required plain-words explanation nor a one-click sample
demo in an isolated sandbox.

## Mandatory claims and demo gate

- **FAIL / release-blocking:** `.factory/claims.json` does not exist. There
  were therefore no declared claim tests to run from the demo entry point. The
  factory contract makes a missing file itself a release blocker.
- **FAIL / release-blocking:** no `/demo`, `?demo=1`, or equivalent demo route
  exists. The first screen has no action named “Try it with sample data”, no
  “Demo — sample data, nothing is saved” banner, no Reset demo / Start for real
  controls, and no isolated `demo:` storage namespace.
- **FAIL:** `.factory/demo.md` is absent, so the sample, reset procedure, and
  sandbox storage namespace are not documented.

Cold live first-read evidence, in a fresh Chromium context at 1280 px:

- The page appears to be an arithmetic route planner, but the headline is
  “See the route. Not just the answer.” rather than the job in plain words.
- It does not say on the first screen that it is for elementary children,
  teachers, or parents. “For the grown-up nearby” appears only below the
  planner.
- The apparent first action is “Plan a number route”, then the user must choose
  or enter a problem. The sample chips (`8 + 7`, etc.) are not the required
  one-click sample demo and do not open a sandbox.

This fails the first-read rule independently of the otherwise functional
practice flow.

## Local clean-checkout verification

Executed from the requested commit after `npm ci`:

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 61 packages installed; `npm audit` reported 0 vulnerabilities. |
| TypeScript and unit tests | PASS | `npm test` ran `tsc --noEmit`; Vitest passed 6 tests in 1 file. |
| Browser suite | PASS | All 12 applicable Playwright cases passed when run in three focused batches; 2 device-specific cases were intentionally skipped. This covers desktop and Pixel 5 planner, addition, multi-step subtraction, invalid sum recovery, offline reload, 393 px layout, and legal pages. |
| `npm run build` | PASS | Vite build and SW generation succeeded; `dist/` was produced with 21 precached URLs. |
| Bundle budget | PASS | Initial app JS: 29,855 bytes / 8,894 bytes gzip; CSS: 23,414 bytes / 5,550 bytes gzip. Both are within the PWA budgets. |

There is no lint script in `package.json`; type-checking is included in the
test command. Lighthouse 13.4.1 against the local production preview recorded
0.99 performance, 1.00 accessibility, 1.00 best practices, and 1.00 SEO before
Chrome crashed while taking its final full-page screenshot. Treat those scores
as indicative rather than a clean Lighthouse completion.

## Independent product exercise

- **PASS:** Completed the supplied `8 + 7` route: move 2, preserve the total,
  finish at 15, replay, and save it. The repository’s desktop and mobile
  journeys passed this complete flow.
- **PASS:** Completed the supplied multi-step `52 − 18` route in both
  viewports; the test reaches 34 and records the intermediate trail.
- **PASS:** Invalid `90 + 20` shows “Choose numbers with a total of 100 or
  less.” without losing the entered number, in both viewports.
- **PASS:** Boundary `100 + 0` opens a usable route after 1.49 s and correctly
  selects the left-to-right direction. Boundary `100 − 100` opens with 10 and
  100 chunk choices. (The subtraction radio was activated through its native
  DOM control because the visually clipped radio is intentionally not
  Playwright-actionable by `check()`; the repository’s keyboard Space test
  covers the normal subtraction flow.)
- **PASS:** With `prefers-reduced-motion: reduce`, pressing “Play route” moved
  replay from station 3 to station 2 once and announced “Reduced motion is on,
  so replay advances one station at a time.”

## Live deployment, privacy, PWA, and accessibility

- **PASS:** Live `index.html`, `assets/main-D74LkpGA.js`, and `sw.js` are
  byte-identical to the locally built candidate. The deployed candidate is the
  requested commit’s build.
- **PASS:** Fresh-page request logs at 1280 px and 390 px contain only
  same-origin document, JS, CSS, and image requests. No console errors or page
  errors occurred. This supports the observed no-runtime-third-party-request
  behavior, but does **not** repair the missing required privacy claim test.
- **PASS:** the live service worker activated as
  `arithmetic-steps-a6d21c58d1ea`; after setting the context offline, reload
  returned 200, showed the main page, and announced the offline banner. The
  worker source includes versioned cache cleanup and `SKIP_WAITING`; no newer
  deployment was available to produce a real update prompt.
- **PASS:** live axe scans found 0 serious/critical violations at desktop and
  390 px. The mobile page had no horizontal overflow. Tab navigation begins
  with the skip link and each sampled focus target has a visible
  `rgb(214, 154, 45) solid 3px` outline with 3 px offset.
- **PASS:** `/`, `/privacy/`, `/terms/`, manifest, robots, sitemap, offline
  page, and the Source link returned 200.

## Defects

### P0 — release blockers

1. **Claims contract absent.** `.factory/claims.json` is missing, so none of
   the public claims — including offline use and local-only route data — has
   the required demo-entry observable test. Add the file and exactly one
   `@claim:<id>` test per claim; run every entry from a fresh demo context.
2. **No one-click demo sandbox; cold landing copy fails.** Add a visible “Try
   it with sample data” action on the first screen, a realistic preloaded
   route, persistent demo banner/reset/start-real controls, a separate storage
   namespace, direct demo URL, and `.factory/demo.md`. Replace the headline
   and supporting sentence with plain words that say this is an
   addition/subtraction reasoning activity for children with a teacher or
   parent, and state what the first click does.

### P1 — must fix before release

1. **Production security/cache headers do not meet the PWA deployment
   contract.** Live `/`, JS, CSS, SW, Privacy, and Terms responses provide
   HSTS, Referrer-Policy, and `X-Content-Type-Options`, but no
   `Content-Security-Policy`, `frame-ancestors`/`X-Frame-Options`,
   Permissions-Policy, or immutable caching for hashed assets. JS and CSS use
   `cache-control: public, must-revalidate, max-age=30`, not long-lived
   immutable caching. Add the appropriate static-host configuration and verify
   the deployed response headers.
2. **No real 404 route.**
   `https://arithmetic-steps.sociobot.in/404-does-not-exist` returns the app
   with HTTP 200. The repository also lacks `404.html` and
   `staticwebapp.config.json`. Ship a styled 404 with a return path and return
   HTTP 404 for unknown paths.
3. **Required metadata/skeleton items are incomplete.** The landing and legal
   HTML lack canonical, Open Graph/Twitter, and Apple-touch metadata; the
   footer lacks the required “Built by Param Factory” and build identifier.
   `.factory/copy-audit.md` is also absent. Complete these before release.
4. **Teacher-reviewed pedagogy is not evidenced.** This is a brief constraint
   and the builder handoff explicitly lists formal teacher review as a known
   gap. Obtain and record the review before representing this as ready for its
   classroom/home target.

## Out of scope / not applicable

This is a static PWA, with no server-side API, authentication, billing, or
product-unlock endpoint. Rate-limit/429 testing and Entra identity checks are
therefore not applicable. It is neither a library nor CLI, so package-consumer
testing is not applicable.
