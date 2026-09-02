# Arithmetic Steps — repair 19 handoff

## Result

Repair release **1.0.16** is buildable and ready to deploy. It repairs every
code/copy blocker in independent verification 19 without claiming outside
research, endorsement, or learning outcomes.

## Fixed

1. The exact final `52 − 18` demo step now says: “Take away 8 to land on a
   friendly ten. 42 − 8 = 34. Nothing is left to take away.” The shared model
   supplies that text to the reasoning ledger, replay, discussion card, copied
   steps, saved JSON, and print card. The same rule covers `100 − 100 = 0`.
2. Invalid subtraction now says the amount taken away **cannot be greater**
   than the starting number. Equal operands remain valid.
3. README’s no-AI-grading statement is registered as `no-ai-grading` in
   `.factory/claims.json`. Its exact browser regression completes a route,
   finds no grading UI, and records no model request.
4. The active brief and pedagogy record now name sandbox-verifiable rules:
   child-chosen chunks, accurate equations/sentences, replay prompts, and a
   non-persistent adult checklist. They do not represent research or outcome
   evidence.

## Evidence

- Pre-fix reproduction: [reproduction-before.txt](evidence-repair-19/reproduction-before.txt).
- Post-fix desktop/mobile browser result: [reproduction-after.json](evidence-repair-19/reproduction-after.json).
- Local URL smoke: [verify.json](evidence-repair-19/local-url/verify.json) — correct title/lang, one h1/main, complete alt text, no unnamed buttons, and no console errors.
- Lighthouse local mobile: [lighthouse-local.json](evidence-repair-19/lighthouse-local.json) — Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1,705 ms, CLS 0, TBT 0 ms.
- `npm ci`: 61 packages installed; audit reported 0 vulnerabilities.
- `npm test`: PASS — TypeScript lint, 21 Vitest/static checks, and 76 serial desktop/mobile Playwright checks. This includes Axe integration, exact-390 layout, keyboard focus, demo isolation, local-only traffic, offline reload, and waiting-worker update checks.
- `npm run build`: PASS — `dist/` contains build 1.0.16 and service-worker cache `arithmetic-steps-31d19a9daebd` with 24 precached URLs. Main JS is 44.45 KB raw / 12.93 KB gzip; CSS is 28.53 KB raw / 6.47 KB gzip.

The standalone Axe CLI could not start Chrome in this worker. The repository’s
Playwright Axe integration ran successfully in both browser projects and the
post-build direct scan recorded zero violations on desktop and 390 px mobile.

## Re-run

```sh
npm ci
npm test
npm run build
npm test -- --grep @claim:narrated-steps
npm test -- --grep @claim:arithmetic-bounds
npm test -- --grep @claim:no-ai-grading
```

Serve `dist/` with `npm run preview` to inspect the PWA. The one-click demo is
`/demo` or `/?demo=1`.

## Deployment

Static Web App target: `sf-arithmetic-steps` in resource group `sociobot`.
Deployment and live identity verification are recorded below after upload.

## Known gaps

No known product gaps. The product intentionally makes no outside-review or
learning-outcome claim; its documented pedagogy rules are executable product
behavior only.
