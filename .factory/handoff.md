# Arithmetic Steps — repair 18 handoff

## Release disposition: repaired, deployed, and verified

Version `1.0.12` is live at
<https://arithmetic-steps.sociobot.in>. The release implementation is commit
`ec246b78c9363860f801aecfcbed0106858aa478`
(`fix: make facilitator checklist claims testable`). Only the scoped
`sf-arithmetic-steps` static site and its configured domain were deployed.

## Release-blocking finding reproduced

Independent verification 14 (report commit
`40216db1b36f9e1a1cc5e6a7876bfe3eee125e5e`) failed because the original
research brief required `Teacher-reviewed pedagogy`, a promise that cannot be
established by this product's browser sandbox. The exact historic constraint is
reproduced from commit `9de52a9985bf40cc18d0da7ff6091509af0312e9` in
`.factory/evidence-repair-18/reproduction-before.txt`.

## Repair

- Replaced the untestable requirement with the observable contract: a
  facilitator can complete and reset four local checks before classroom use;
  checklist marks are not stored.
- Reworded the brief, landing page, README, terms, claim inventory, copy audit,
  facilitator guide, pedagogy note, and independent live checker to describe
  that self-guided behavior. The arithmetic activity itself is unchanged.
- Replaced the two claim IDs with `facilitator-checklist` and
  `self-guided-checklist-guidance`, each with one exact Playwright command in
  `.factory/claims.json`.
- Added static and browser copy/claim regressions. They first prove the exact
  historic `Teacher-reviewed pedagogy` phrase is rejected, then scan every
  active product claim surface for unsupported external-review, validation,
  study, and learning-outcome promises.

The product makes no claim that a qualified teacher externally reviewed it or
that it improves learning outcomes. Its verified behavior remains the
self-guided local checklist alongside the offline arithmetic activity.

## Verification

All checks ran from a clean install on 2026-09-01/02 UTC:

- `npm ci`: 61 packages installed; audit reported zero vulnerabilities.
- `npm test`: passed TypeScript lint, 17 Vitest unit/static tests, and 70
  serial Playwright desktop/mobile tests.
- Every one of the 22 literal claim commands in `.factory/claims.json` passed
  from separate fresh invocations, including the two new checklist claims.
- `npm run build`: passed and produced `dist/`; the worker precaches 24 URLs
  with cache `arithmetic-steps-b059ea1d3dab`.
- Bundle budgets: main JS 41,608 B raw / 12,150 B gzip; CSS 28,215 B raw /
  6,430 B gzip. There are no downloaded fonts.
- Independent local browser QA passed desktop functionality, 390×844 mobile
  layout (390 px scroll/client widths and no target below 44 px), keyboard
  skip/focus treatment, reduced motion, Axe, first-party request logging, PWA
  control, and offline demo reload. Vite preview returns its SPA shell for an
  unknown local route; the Static Web Apps real-404 configuration is covered by
  the static contract and verified on live production.
- `verify-url.sh` passed locally and live: HTTP 200, expected title,
  `lang=en`, one `h1`, one `main`, alt text, labelled controls, and zero
  console errors.
- Independent live browser QA passed desktop, 390 px mobile, keyboard,
  reduced motion, privacy, PWA/offline, every route/link, and Axe on landing,
  demo, completion, history, legal pages, and the real 404. All Axe runs had
  zero violations; request recording observed only the product origin.
- Production response policy: self-only CSP with response-header
  `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer policy,
  restrictive permissions policy, immutable hashed assets, `no-store` worker,
  and a real HTTP 404 all passed.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1,059 ms, CLS 0.00486, TBT 0 ms.
- SHA-256 comparison found zero mismatches across all 24 precached deployables;
  live `sw.js` also matched. The live manifest start URL is
  `/?source=pwa&v=1.0.12`.

Screenshots and URL-verifier output are in `.factory/evidence-repair-18/`.
Package/consumer, backend API, authentication, payment, rate-limit, and
concurrency checks do not apply to this static local-first PWA.

## How to run

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `/demo` for the isolated `52 − 18` sample. The exact new claim checks are:

```sh
npm test -- --grep @claim:facilitator-checklist
npm test -- --grep @claim:self-guided-checklist-guidance
```

## Known gaps and next steps

No release-blocking product gaps remain. The product intentionally does not
make an external teacher-review or learning-outcome promise; any future
external review would need its own independently verifiable record before it
could be claimed.
