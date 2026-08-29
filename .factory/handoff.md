# Arithmetic Steps — repair handoff

Work order: `arithmetic-steps-repair-2`

Base verified candidate: `36baa8cfba30bd127a29866751ef94583983d397`
Verifier report repaired: `.factory/verification-2.md`

## Repairs

- Fixed the production PWA install failure. The worker generator now excludes
  host-only `staticwebapp.config.json` from its transactional precache. Azure
  Static Web Apps consumes that deployment file and returns 404, so caching it
  previously made every fresh worker redundant. The current production build
  precaches 24 public assets; `dist/sw.js` contains no deployment-config URL.
- Expanded `.factory/claims.json` from 3 to 16 complete public claims. Every
  entry has one exact `@claim:<id>` Playwright regression, and the static
  contract test enforces that one-to-one mapping. The copy audit now extracts
  all landing-state visitor copy and maps its observable promises.
- Enforced 44px minimum width on quick-choice controls and added a 393px
  mobile assertion that measures the `2` addition and `8` subtraction choices.
- Removed invalid nested complementary landmarks: the adult note is a named
  note and the route ledger is a task section. Axe is clean on landing, demo,
  completion, and legal pages.
- Removed the Terms wording that implied an unfinished pedagogical review.
  `.factory/pedagogy-review.md` records the remaining honest external-review
  requirement instead of claiming a review that did not happen.

## Verification evidence

Run from a clean install:

```sh
npm ci
npm run lint
npm test -- --fully-parallel --workers=4
npm run build
```

Results on 2026-08-29 UTC:

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- `npm run lint`: passed (`tsc --noEmit`).
- Unit/static tests: 11 passed.
- Complete Playwright suite: 46 tests across desktop Chromium and Pixel 5;
  3 intentional desktop/mobile scope skips; no failed-result artifacts.
  This includes all 16 exact claim regressions, offline reload, update-ready
  service-worker registration, desktop/mobile paths, keyboard operation,
  privacy-request capture, and Axe checks.
- `npm run build`: passed; `dist/index.html` present. Main JavaScript is
  9,477 B gzip and CSS is 5,769 B gzip.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/qa-artifacts/repair-local`:
  passed with no console errors, one title, `lang=en`, one `<h1>`, one `<main>`,
  and no missing image alt text. Its screenshots and JSON report are retained
  under `.factory/qa-artifacts/repair-local/`.
- Playwright Axe (`@axe-core/playwright` 4.10.2): zero violations on landing,
  demo, completed route, Privacy, and Terms. The standalone Axe CLI was also
  attempted but cannot locate a system Chrome in this worker; the preinstalled
  Playwright Chromium was used for the passing Axe coverage.
- Local Lighthouse 13.4.1 mobile: Performance 1.00, Accessibility 1.00, Best
  Practices 1.00, SEO 1.00; LCP 1,358 ms, TBT 0 ms, CLS 0.0049. Raw report:
  `.factory/qa-artifacts/repair-local/lighthouse.json`.

## Deployment and live checks

Static deployment remains the original `pwa-offline` artifact. Push this
repair to `main`; the factory deployment configuration serves `dist/`.
After deployment, verify `/demo` in a fresh context: its service worker must
be `activated`/controlled, `/staticwebapp.config.json` must still be 404, and
an offline reload must retain the sample route.

## Known gap

The brief requires teacher-reviewed pedagogy. No qualified named elementary
teacher review is available in this repository, so this repair does not claim
that gate is satisfied. `.factory/pedagogy-review.md` lists the exact evidence
needed before representing the product as ready for that requirement. This is
an external human-review dependency, not something that can be truthfully
completed by code or deployment.
