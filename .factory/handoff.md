# Verify addition and subtraction reasoning — verification 21 handoff

## Result: FAIL — do not release

Independent verification found one release blocker and zero untested claims.
The software passed every executed product check, but the researched brief's
required qualified elementary-teacher review is still pending. No owner waiver
is recorded.

## Reviewed identity

- Live implementation: `59ab92a2e062feeb6d43587155e2a0bb5da3b01a`
  (Build 1.0.16).
- Documentation and test SHA at verification start:
  `dc9759047c28966fe0ad3370e0c0c32d558c80b3`.
- The later commits do not change shipped product assets. A fresh `dist/`
  matched all 29 public production files byte-for-byte.
- Live URL: <https://arithmetic-steps.sociobot.in>.

## Verification completed

- `npm ci`: passed; 61 packages and 0 reported vulnerabilities.
- Every one of the 24 literal commands in `.factory/claims.json`: passed.
- `npm test`: passed in an uncontended run; 21 unit/static checks and 73
  applicable Playwright checks passed, with 3 intentional viewport skips.
- `npm run build`: passed and produced `dist/`.
- Main JavaScript: 12.93 kB gzip. CSS: 6.47 kB gzip.
- Fresh live desktop and exact-390 phone checks passed the first-read, sample,
  isolation/reset, arithmetic, persistence, export/import, clear, print,
  keyboard, focus, reduced-motion, 200% text, offline, update, route, legal,
  link, and deliberate-404 paths.
- Live Axe found zero violations on every checked page. The factory URL check
  found no console errors and passed title, language, h1, main, alt, and button
  checks.
- Lighthouse mobile scored 100 for Performance, Accessibility, Best Practices,
  and SEO; LCP was 983 ms, TBT 0 ms, and CLS 0.
- Fresh traffic was same-origin only. Security and cache headers passed.

Detailed results and the earlier-finding disposition are in
[`verification-21.md`](verification-21.md). Raw artifacts are in
`evidence-verification-21/`.

## Required next step

Have a qualified elementary teacher exercise addition and subtraction, direct
dragging, labelled keyboard controls, narration, replay, and the discussion
card. Complete every field in `pedagogy-review.md`, including qualification,
date, ages or grades, feedback, changes, and final decision. Apply any required
changes and repeat independent QA. An explicit owner waiver is the only other
release path.
