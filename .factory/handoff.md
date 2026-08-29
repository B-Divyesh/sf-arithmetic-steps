# Arithmetic Steps — repair handoff

Work order: `arithmetic-steps-repair-3`
Base verified candidate: `36baa8cfba30bd127a29866751ef94583983d397`
Verifier report: `.factory/verification-2.md`

## Repairs retained and verified

- The service-worker generator excludes Azure Static Web Apps' deployment-only
  `staticwebapp.config.json`. The current production build precaches 24 public
  files, so a 404 for that host-consumed file cannot make installation
  redundant. The generated worker keeps `SKIP_WAITING` and `clients.claim()`
  for the in-app update path.
- The public-claim inventory contains 16 claims. Each has one exact tagged
  Playwright regression, and the static contract test enforces that mapping.
- The 390 px quick choices meet the 44 px minimum, and the previous nested
  complementary landmark was removed. Axe is clean on the landing, demo,
  completed-route, history, Privacy, and Terms screens.

## JSON-export flake repair

The controller's exact historical race was reproduced against a production
preview before the change: clicking **Export JSON** and then registering
`page.waitForEvent("download")` timed out after 750 ms because the browser had
already emitted the synchronous Blob download event.

- The export implementation now appends the temporary link, activates it,
  removes it, then releases its Blob URL on the next task. This prevents a
  browser from consuming a revoked URL.
- `@claim:json-export` creates an explicit fresh browser context with download
  acceptance. It proves that history starts empty, waits for **Export JSON** to
  be enabled after exactly one completed `8 + 7 = 15` route, subscribes to the
  download before clicking, and parses the downloaded JSON. The regression
  checks the product id, timestamp, one exported attempt, operation, operands,
  result, and all three route frames.
- The independent live verifier now applies the same enabled-control and
  parsed-content checks to its exported `99 + 1 = 100` route.
- The exact claim was stress-run five times per desktop/mobile project (10
  isolated executions) with no failures.

## Local verification

Executed from a clean install on 2026-08-29 UTC:

```sh
npm ci
npm test -- --fully-parallel --workers=4
npm run build
```

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages; 0 vulnerabilities |
| `npm run lint` | PASS — `tsc --noEmit` |
| Unit/static tests | PASS — 11 tests |
| Complete Playwright suite | PASS — 43 passed across desktop Chromium and Pixel 5; 3 intentional device-scope skips |
| `@claim:json-export` stress run | PASS — 10 isolated runs; parsed route payload each time |
| `npm run build` | PASS — `dist/index.html` and PWA assets generated |
| Bundle budget | PASS — app JS 32,168 B raw / 9,523 B gzip; CSS 24,596 B raw / 5,742 B gzip |
| PWA offline/update contract | PASS — 24 precached public files, host config absent, `SKIP_WAITING` and `clients.claim()` present |
| `verify-url.sh` | PASS — title, `lang=en`, one h1, main, image alt text, labelled controls, and zero console errors |
| Playwright Axe | PASS — zero violations on app and legal-page coverage |
| Lighthouse 13.4.1 mobile | PASS — Performance 1.00, Accessibility 1.00, Best Practices 1.00, SEO 1.00; LCP 1,432 ms, TBT 0 ms, CLS 0.0049 |

Local URL evidence, screenshots, URL verification, and Lighthouse report are
in `.factory/qa-artifacts/repair-3-local/`.

## Deployment and live checks

The artifact remains the original `pwa-offline` static deployment (`dist/`).
Commit `ff70fb9d95bc491d197e130c31bc367330bb46bb` was pushed to `main` and
deployed with:

```sh
/opt/fleet/lib/deploy-static.sh arithmetic-steps dist
```

Azure Static Web Apps deployment: `c6ac386d-1122-4977-8d98-927f5a8f956f`.
The existing Central US static site was reused and
`https://arithmetic-steps.sociobot.in` returned 200 after deployment.

Independent live verification passed at 2026-08-29T20:09:54Z:

- The live `index.html`, all five referenced app assets, and `sw.js` are
  byte-identical to `dist/`. Index SHA-256:
  `1306d023d4b37ca2e9ceeb359185c05c48dbcc19223f1c208698d4f3cc419405`.
  Worker SHA-256:
  `0b5aae1ad7583e3502cb0ee9e3851cbfa02652862bcaffba8355e9ab35224b20`.
- Response policy passes: CSP includes `frame-ancestors 'none'`,
  `X-Frame-Options: DENY`, `Permissions-Policy`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and
  `X-Content-Type-Options: nosniff`. `sw.js` returns
  `Cache-Control: no-cache, no-store, must-revalidate`. The consumed
  deployment config and an unknown route both return HTTP 404.
- A fresh `/demo` worker is activated and controls the page (one registration,
  cache `arithmetic-steps-02a0a6aecc7e`); it has no deployment-config URL in
  its precache. With networking disabled, reload returns 200 and `52 − 18`.
- Desktop and 390 px mobile exercise passed. Mobile width is 390/390 with no
  undersized visible target. Keyboard starts at the skip link; focus uses a
  3 px brass outline and 3 px offset. Reduced-motion replay advances one
  station and reports that state.
- Axe reported zero violations on landing, demo, completion, history, Privacy,
  Terms, and the real 404. The live flow made six requests, all to the product
  origin; it recorded no failed requests, console errors, or uncaught errors.
- The hardened export check waited for the enabled control and parsed exactly
  one live `99 + 1 = 100` JSON route. All rendered internal and repository
  links returned 2xx/3xx.

## Known external prerequisite

The researched brief requires teacher-reviewed pedagogy. No qualified named
elementary teacher review is available in this repository. The product does not
claim academic outcomes or a completed teacher review, and
`.factory/pedagogy-review.md` records the evidence still needed. This human
review cannot be truthfully supplied by code, tests, or deployment.
