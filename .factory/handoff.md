# Arithmetic Steps — polish 3 handoff

## Result

Released **1.0.15** at <https://arithmetic-steps.sociobot.in>. The review 3
404 finding is repaired. No finding from reviews 1–3, earlier polish records,
or the controller evidence remains open.

Implementation commit: `6f61f60f2f61b59aecde820b333a2b0b5f648deb`.

Deployment: `f2b729d1-84a7-4879-8c2c-9d6e8bfbdccd`.

## What changed

- The HTTP 404 now uses the Number Line Limited header, footer, legal links,
  focusable skip link, transport-poster visual treatment, and return-home link.
- It has a route description, `/404.html` canonical, Open Graph/Twitter image
  metadata, SVG/favicon and apple-touch icons, `noindex`, and a build id.
- The local static preview now mirrors deployed routes and returns the real
  404 document and status for unknown paths.
- The exact `/nothing-here` browser regression checks status, metadata,
  header/footer, Privacy/Terms, accessibility, and the working home action.

## Verification

- Fresh clone: `/tmp/arithmetic-steps-polish-3.3tKOOS/repo` at `6f61f60`.
  `npm ci` reported 0 vulnerabilities.
- In that clone, `npm test` passed 19 unit/static tests and 71 browser tests;
  3 viewport-specific skips were expected. `npm run build` produced `dist/`.
- Every literal command in `.factory/claims.json` passed independently: all
  23 `@claim:` entries. The log is
  `/tmp/arithmetic-steps-polish-3.3tKOOS/verification.log`.
- Built output: main JavaScript 44.36 kB raw / 12.93 kB gzip; CSS 28.53 kB
  raw / 6.47 kB gzip. Initial JavaScript remains well below 200 kB.
- Live cold root check passed in 657 ms with a title, `lang=en`, one h1,
  main landmark, alt text, labels, and no console errors. See
  `.factory/evidence-polish-3/live-root/verify.json`.
- Live independent browser QA passed desktop, 390 px mobile, keyboard/focus,
  reduced motion, local-only requests, demo isolation, offline reload, PWA,
  persistence race, routes, legal links, and Axe. See
  `.factory/evidence-polish-3/live-qa/verification-summary.json`.
- Live unknown-route QA confirms HTTP 404, all metadata, shared shell, legal
  links, no overflow, 44 px links, zero Axe violations, and working home
  action at desktop and 390 px. See
  `.factory/evidence-polish-3/live-404/verification.json` and its screenshots.
- A final cold-live regression pass rechecked Saved problems title/focus/live
  announcements and Back, `?demo=1`, the exact 390 px whole-word headline,
  and the removed footer provenance claim. See
  `.factory/evidence-polish-3/live-regressions/verification.json` and
  `mobile-landing-390.png`.
- Live Lighthouse 12.8.2: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,585 ms and CLS 0. See
  `.factory/evidence-polish-3/lighthouse-live.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

The static output is `dist/`. Deploy it with
`/opt/fleet/lib/deploy-static.sh arithmetic-steps ./dist` from this repository.

## Known gaps

None.
