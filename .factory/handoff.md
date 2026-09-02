# Arithmetic Steps — polish 2 handoff

## Delivered

Commit `bee1b3502c9d51e26deb39fa13219f2ff12728f0` is pushed to `main` and
deployed as Static Web Apps deployment
`fdf3c7b7-01a7-49fb-aee4-9902f05eafd9`.

The live product is <https://arithmetic-steps.sociobot.in>.

- Removed the forced headline word break. At an exact 390 px width,
  `subtraction` stays whole and the h1 has no horizontal overflow.
- Removed the unregistered footer provenance claim. Generated-art provenance
  remains recorded in `.factory/design.md` and the source sidecar.
- Kept and reverified the prior real routing, focused route changes, isolated
  `/demo` and `?demo=1` sample paths, privacy, persistence, and mobile-nav
  repairs.
- Updated the catalog sentence to: “Move counters to explain addition and
  subtraction with a child.”

The full finding-to-change-to-evidence map is in `.factory/polish-2.md`.

## Exact verification evidence

- Clean clone `/tmp/arithmetic-steps-polish-2.MoYBKa` at `bee1b35`: `npm ci`
  completed with 0 vulnerabilities. All 23 literal commands from
  `.factory/claims.json` passed independently.
- `npm test`: passed TypeScript lint, 19 Vitest/static tests, and 74
  Playwright tests. The browser status is `passed` in
  `test-results/.last-run.json`.
- `npm run build`: passed and generated `dist/`. App JavaScript is 12.92 kB
  gzip; CSS is 6.47 kB gzip.
- Cold live `verify-url.sh`: passed in 842 ms; title, language, one h1, main,
  alt text, labelled buttons, and console state are recorded in
  `.factory/evidence-polish-2/live-root/verify.json`.
- Live independent QA: PASS with zero Playwright Axe violations, same-origin
  requests only, keyboard focus, reduced motion, PWA/offline reload, demo
  isolation, all routes/titles/legal links, real 404, and persistence race
  coverage. See `.factory/evidence-polish-2/live-qa/verification-summary.json`.
- Live 390 px first screen: whole-word measurement and screenshot are
  `.factory/evidence-polish-2/live-mobile/headline-390.json` and
  `.factory/evidence-polish-2/live-mobile/first-screen-390.png`.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.136 s and CLS 0 in
  `.factory/evidence-polish-2/lighthouse-live.json`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

## Known gaps

None.
