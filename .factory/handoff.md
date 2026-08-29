# Arithmetic Steps — repair handoff

Work order: `arithmetic-steps-repair-1`
Repair date: 2026-08-29
Artifact: static, local-first PWA (`dist/`)

## Repairs delivered

- Added `/demo` and the first-screen **Try it with sample data** action. It
  opens a part-complete `52 − 18` route (`42 − 8` remains) so the learner can
  work immediately rather than configure a problem first.
- Added the persistent **Demo — sample data, nothing is saved** banner with
  **Reset demo** and **Start for real**. Every demo read/write uses the
  `demo:arithmetic-steps` IndexedDB database; real routes remain in
  `arithmetic-steps`. Leaving the demo deletes only the demo database.
- Added `.factory/demo.md`, `.factory/claims.json`, and exact Playwright
  regressions for the demo sandbox, offline reload from `/demo`, and local-only
  requests/account controls. The claim commands run from a clean context.
- Rewrote the cold first screen in plain words: it names addition/subtraction,
  elementary children with a teacher or parent, and what the sample action
  opens. `.factory/copy-audit.md` records the wording and counts.
- Added `staticwebapp.config.json` to the deployment artifact: CSP,
  clickjacking protection, permissions policy, immutable asset caching,
  no-cache service worker behavior, an explicit `/demo` rewrite, and a true
  HTTP 404 response override. Added the styled `404.html`; moved offline-page styling
  to a CSP-compatible external stylesheet.
- Added canonical, Open Graph/Twitter, and Apple-touch metadata; a locally
  derived 1200×630 social preview; and the required Param Factory/build footer
  information on all pages.

## Verification evidence

Executed after `npm ci` from a clean dependency install:

| Check | Result |
| --- | --- |
| `npm run lint` | PASS — `tsc --noEmit` |
| `npm test` | PASS — 8 Vitest tests; 17 Playwright tests passed, 3 intentional device-applicability skips |
| `npm test -- --grep @claim:demo-sandbox` | PASS — desktop and mobile; asserts sample route, reset, real-data sentinel preservation, and isolated namespace cleanup |
| `npm test -- --grep @claim:offline-reload` | PASS — desktop; waits for SW, sets context offline, reloads `/demo`, and sees the sample route |
| `npm test -- --grep @claim:local-only` | PASS — desktop and mobile; route flow has only same-origin requests and no account, score, or embedded-frame controls |
| `npm run build` | PASS — `dist/index.html`, PWA manifest/SW, demo fallback, legal pages, 404, and host configuration produced |
| Production bundle | PASS — app JS 32.06 kB / 9.51 kB gzip; CSS 24.58 kB / 5.74 kB gzip |
| `verify-url.sh` on local production preview | PASS — 200, title/lang, one h1, main landmark, image alt, labelled buttons, and zero console errors |
| Axe | PASS through the Playwright axe integration on desktop/mobile main and legal pages: zero serious or critical violations. The standalone Axe CLI could not discover a system Chrome in this container; the pinned Playwright Chromium integration is the exercised accessibility check. |
| Lighthouse 13.4.1, local production preview | PASS — Performance 1.00, Accessibility 1.00, Best Practices 1.00, SEO 1.00 |

Browser coverage includes desktop and Pixel 5/393 px flows, keyboard radio
selection, addition, multi-step subtraction, invalid input recovery, demo
reset/exit, offline reload, mobile overflow/touch sizing, legal pages, focus,
and reduced-motion behavior already covered by the retained suite.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Deploy the generated `dist/` directory as the static artifact. The included
`dist/staticwebapp.config.json` is the Static Web Apps deployment contract.

## Known constraint

No formal human teacher review was available inside this disposable build
container. The app does **not** claim classroom validation or learning
outcomes; Terms says it supports conversation and is not a substitute for a
teacher’s judgment. A named teacher review of suggested chunks and language is
still required before making a classroom-readiness or outcome claim.
