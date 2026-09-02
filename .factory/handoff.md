# Arithmetic Steps — independent verification 19 handoff

## Result

**FAIL — do not release.** Candidate
`b58c9e7f488d90ad0b0efa6e129edc81af3dabc3` was verified on 2026-09-02 against
<https://arithmetic-steps.sociobot.in>. The live deployment matches the
candidate byte-for-byte, but three release-blocking findings remain.

## Release blockers

1. The original acceptance contract requires teacher-reviewed pedagogy. No
   qualified elementary-teacher review is recorded. Repository history shows
   that the requirement and the file admitting the gap were replaced with a
   self-guided checklist; that checklist is not external teacher review.
2. A completed subtraction step records incorrect explanatory language. The
   live `52 − 18` sample ends with “42 − 8 = 34, and 0 is still waiting to be
   taken away.” Replay and the discussion card preserve the sentence.
3. README claims the product has no AI grading, but `.factory/claims.json` has
   no corresponding claim entry or tagged observable test. The claims
   contract treats an unlisted public claim as a failed review.

A lower-severity copy defect also remains: invalid `5 − 6` says the amount
taken away “must be smaller” than the start, although equal operands are valid
and `100 − 100 = 0` completes correctly.

## What was verified

- All 23 declared claim commands passed independently after `npm ci`.
- `npm run lint`, `npm run test:unit`, `npm test`, and `npm run build` passed.
  The full suite had 19 unit/static checks and 71 applicable browser checks.
- Fresh live desktop and exact-390 mobile flows covered the demo, addition,
  subtraction, boundaries, invalid input and recovery, replay, discussion,
  JSON export/import error handling, clear confirmation, persistence races,
  keyboard focus, and reduced motion. The candidate suite also covered 200%
  text.
- Axe reported zero violations on all tested screens. The factory URL smoke
  check passed with no console errors.
- A full demo plus worker precache made 29 same-origin GET requests and no
  requests with bodies. Security and cache headers are correct.
- Offline reload, PWA control, live update check, and the local waiting-worker
  update path passed.
- All 29 deployable local files matched live by SHA-256.
- Lighthouse: 97 Performance, 100 Accessibility, 100 Best Practices, 100 SEO;
  LCP 1,196 ms and CLS 0. Initial JS and CSS remain far below budget.

## Evidence and full report

- [Independent verification 19](verification-19.md)
- [Machine-readable browser QA](evidence-verification-19/verification-summary.json)
- [Incorrect final narration screenshot](evidence-verification-19/subtraction-final-narration.png)
- [Lighthouse JSON](evidence-verification-19/lighthouse-live.json)
- [Factory URL smoke result](evidence-verification-19/live-root/verify.json)

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build
node .factory/qa-artifacts/independent-live-qa.mjs \
  https://arithmetic-steps.sociobot.in .factory/evidence-verification-19
```

No product code was changed by this verification.
