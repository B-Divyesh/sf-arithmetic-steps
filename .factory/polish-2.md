# Polish 2 — Arithmetic Steps

Implementation commit: `bee1b3502c9d51e26deb39fa13219f2ff12728f0`

Deployment: `fdf3c7b7-01a7-49fb-aee4-9902f05eafd9`

Live URL: <https://arithmetic-steps.sociobot.in>

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — Saved problems was hash-routed with a stale title and focus | Retained the previous real `/saved-problems`, `/saved-problems/<id>`, and `/practice` History API repair. | Live route crawl in `.factory/evidence-polish-2/live-qa/verification-summary.json`: route-specific titles, one h1/main, and working routes. `uses a real saved-problems route with a title, focused heading, and route announcement` passes in `npm test`. |
| F-1-2 — README sentences exceeded 22 words | Retained the short test/build wording and re-audited it. | `.factory/copy-audit.md` contains no audited README sentence over 22 words. |
| F-1-3 — README exposed storage and install jargon | Retained learner-facing wording about work staying in the browser, refresh persistence, and offline use. | `.factory/copy-audit.md`; clean-clone `@claim:completed-persistence`, `@claim:unfinished-persistence`, and `@claim:offline-reload` commands pass. |
| Controller-1 — completion could disappear during a delayed IndexedDB write | Retained the synchronous completion checkpoint and history merge. | Live QA completion race reports `checkpointedBeforeWrite`, `routeStayedOpen`, and `completedProblemVisible` as true. |
| Controller-2 — mobile Saved problems lacked Practice | Retained the three 44 px navigation stops. | Live mobile QA has no undersized targets and reaches `/practice`; screenshot: `.factory/evidence-polish-2/live-qa/mobile-saved-problems.png`. |
| Required demo path — direct `?demo=1` proof | Retained the isolated `?demo=1` and `/demo` entry points, banner, reset, and real-storage exit. | Live route crawl gives `/?demo=1` title `Demo — Arithmetic Steps`, h1 `52 − 18`, and zero Axe violations. Clean-clone `@claim:demo-sandbox` passes. |
| F-2-1 — `subtraction` broke inside the 390 px headline | Removed the authored `<wbr>` from the h1 and added an exact 390 × 844 browser regression that verifies every word has one rendered line and no horizontal overflow. | `keeps every hero headline word whole at exactly 390px` passes in desktop and mobile projects. Live measurement: `.factory/evidence-polish-2/live-mobile/headline-390.json`; live screenshot: `.factory/evidence-polish-2/live-mobile/first-screen-390.png`. |
| F-2-2 — footer artwork provenance was an unlisted public claim | Removed the footer statement. The design record retains generation provenance; a static regression ensures the public statement stays removed. | `keeps generated-art provenance in the design record, not as an unregistered footer claim` passes. Live cold-page measurement records `footerHasRemovedClaim: false` in `.factory/evidence-polish-2/live-mobile/headline-390.json`. |

## Verification

- Fresh clone: `/tmp/arithmetic-steps-polish-2.MoYBKa` at `bee1b35`.
  `npm ci` completed with 0 vulnerabilities. Every one of the 23 literal
  commands declared in `.factory/claims.json` passed separately.
- Working checkout: `npm test` passed TypeScript lint, 19 Vitest/static
  tests, and 74 Playwright tests. `test-results/.last-run.json` reports
  `passed`.
- `npm run build` created `dist/`: main JavaScript is 44.36 kB raw / 12.92 kB
  gzip and CSS is 28.53 kB raw / 6.47 kB gzip.
- Cold live `verify-url.sh` passed in 842 ms with a title, `lang=en`, one h1,
  main landmark, complete image alt attributes, labelled buttons, and no
  console errors. See `.factory/evidence-polish-2/live-root/verify.json`.
- Independent live QA passed desktop, 390 px mobile, keyboard/focus,
  reduced-motion, privacy request origin, PWA install/update, offline reload,
  delayed persistence, real routes, links, legal pages, and 404. Playwright
  Axe found zero violations on every audited route/state. See
  `.factory/evidence-polish-2/live-qa/verification-summary.json`.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.136 s and CLS 0. See
  `.factory/evidence-polish-2/lighthouse-live.json`.

No finding from review 1, polish 1, review 2, or the controller evidence is
open.
