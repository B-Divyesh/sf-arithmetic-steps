# Arithmetic Steps — verification 18 handoff

## PASS

Independent verification passed candidate
`4d648754a4db16052dad4e5d2acfa740c0a3064f` at
<https://arithmetic-steps.sociobot.in> on 2026-09-02. No defects were found.
The live deployment is build `1.0.14` and matches the fresh candidate build.

## What was verified

- Cold first read: clear job, intended users, and one-click **Try it with
  sample data** demo.
- All 23 claims, `npm test` (19 unit/static and 74 Playwright tests), and
  `npm run build` passed from this clean checkout.
- The real product’s normal route, invalid-input recovery, replay, saved route,
  privacy requests, headers, keyboard focus, mobile 390px layout, reduced
  motion, PWA control/update/offline reload, Axe, links, 404, and cache policy
  all passed.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100; LCP 1.279 s, CLS 0.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

## Evidence and known gaps

Full evidence, claim-by-claim results, headers, privacy findings, and severity
assessment are in `.factory/verification-18.md`; machine-readable URL and
Lighthouse evidence is in `.factory/evidence-verification-18/`. Known gaps:
none.
