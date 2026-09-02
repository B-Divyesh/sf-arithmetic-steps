# Arithmetic Steps — independent verification 16

## Release disposition: PASS

Candidate `ec246b78c9363860f801aecfcbed0106858aa478` was independently verified
on 2026-09-02 UTC against the deployed product at
<https://arithmetic-steps.sociobot.in>.

This verdict evaluates the observable product contract. Per the owner's
acceptance clarification, the retired teacher-review study assertion is not a
release requirement. The shipped self-guided facilitator checks are evaluated
as the product claims they make: four local, resettable, non-persistent checks
that expressly do **not** claim learning-outcome evidence. They passed.

No P0, P1, P2, or P3 defects were found.

## Cold first read

A fresh Chromium context loaded the live home page without stored data. The
first screen says **“Explore addition and subtraction steps”**, identifies the
audience as “elementary children with a teacher or parent,” and explains that
they move counters to explain each answer change. Its first primary action is
**“Try it with sample data”**. It opened the isolated, part-complete `52 − 18`
demo in one click. This meets the plain-words and demo-sandbox first-read
requirement.

## Clean candidate checks

Commands were run from a detached checkout at the candidate:

```text
npm ci                                      PASS (61 packages; 0 vulnerabilities)
npm test -- --grep @claim:<id>              PASS for every one of 22 declared IDs
npm test                                    PASS (TypeScript; 17 Vitest tests; 70 Playwright tests)
npm run lint                                PASS
npm run test:unit                           PASS (17 tests)
npm run build                               PASS
```

Every exact `test` value in `.factory/claims.json` was run separately, through
the production demo entry point. Passing IDs: `demo-sandbox`,
`offline-reload`, `local-only`, `installable-pwa`, `visible-focus`,
`tens-and-ones`, `direct-manipulation`, `narrated-steps`,
`replay-and-discussion`, `free-no-account`, `arithmetic-bounds`,
`keyboard-controls`, `unfinished-persistence`, `json-export`, `json-import`,
`clear-data`, `print-card`, `reduced-motion`, `mobile-controls`,
`facilitator-checklist`, `self-guided-checklist-guidance`, and
`no-game-mechanics`.

The production build produced `dist/`. Its initial application JavaScript is
12.15 KB gzip plus a 0.51 KB version module; CSS is 6.43 KB gzip. These are
well within the static-product budgets.

The browser suite exercised addition and subtraction routes, child-selected
chunks, drag and labelled keyboard alternatives, narration, replay,
persistence, JSON export/import, print presentation, validation and recovery
(including invalid totals, decimals, blanks and below-zero subtraction),
clear-data confirmation, reduced motion, and demo namespace separation.

## Live deployment checks

The live page reports `Build 1.0.12`, which is the candidate package version.
After a clean candidate build, SHA-256 comparison found all 24 public deployable
files byte-for-byte identical to the live URL, including
`assets/main-CIr76rh0.js`; the only non-public build artifact,
`staticwebapp.config.json`, correctly returns 404 because Static Web Apps
consumes it as deployment configuration.

Fresh desktop and 390 px mobile live contexts had no console errors or page
errors, no horizontal overflow, and zero serious or critical results from the
Playwright Axe audit. The product's complete browser suite also has zero Axe
violations on landing, demo, and completion screens. The standalone
`@axe-core/cli` executable could not launch its Selenium ChromeDriver against
the worker image's Playwright Chromium even when given the browser path; this
is an environment-tool incompatibility, not a product finding. There is no
`verify-url.sh` in this repository. The Playwright Axe audit supplied the
equivalent live-page accessibility evidence.

Keyboard checks included the visible skip-link focus treatment and keyboard
counter controls. The `visible-focus` claim passed in both browser projects.
The live response has `lang=en`, one application `h1`, header/nav/main/footer,
titles, metadata, manifest, accessible names, and the expected legal pages.
All landing links returned 200, including `/demo`, `/privacy/`, `/terms/`, and
the source link.

An independent live PWA check installed a controlling `/sw.js`, loaded `/demo`,
went offline, reloaded, and retained the `52 − 18` sample. A separate live
update test registered `/sw.js?verify-update=16`, observed “An update is
ready,” applied it, confirmed the new controller URL, and confirmed the demo
banner and sample remained. The manifest supplies 192, 512, and maskable 512
icons. Hashed assets are served with one-year immutable caching; `sw.js` is
served `no-cache, no-store, must-revalidate`.

## Privacy, headers, and performance

Cold home and demo request logs recorded only same-origin GET requests for the
document and self-hosted JS/CSS/image assets. There were no third-party
runtime requests, accounts, child-identifying inputs, analytics, payment, or
frames. This confirms the local-only privacy promise for the exercised flow.

Live responses supplied HTTPS, HSTS, CSP with `default-src 'self'`,
`frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, strict-origin referrer policy, and a restrictive
permissions policy. `/`, `/demo`, `/privacy/`, and `/terms/` returned 200;
the deliberate missing route returned the styled 404. This is a static PWA
with no server-side API endpoint, so rate-limit/429 and sign-in checks are not
applicable.

Lighthouse mobile audit JSON recorded 100 for Performance, Accessibility, Best
Practices, and SEO; LCP was 1.14 s, CLS 0.005, and total blocking time 90 ms.
The Lighthouse process emitted a Chrome target-crash warning while collecting a
post-audit full-page screenshot, but the completed audit JSON contains these
valid category scores and metrics; independent Playwright checks had no page
or console errors.

## Handoff

The candidate is accepted. No product code was changed during verification.
