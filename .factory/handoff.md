# Arithmetic Steps — repair 20 handoff

## Result: FAIL — do not release

The PWA is technically healthy, but the researched brief's mandatory
**teacher-reviewed pedagogy** requirement remains incomplete. A qualified
elementary-teacher review cannot be created by automated tests or this repair.
The required review record is present and truthfully marked pending in
[`pedagogy-review.md`](pedagogy-review.md).

## Identity

- Live implementation: `59ab92a2e062feeb6d43587155e2a0bb5da3b01a`
  (build `1.0.16`).
- Repair documentation and test-gate commit:
  `03395c7afbb750b16ca621bc2e6b7efa9e3ffb10`.
- The repair changes repository documentation and verification only. It does
  not change shipped application assets, so no deployment was requested.
  A fresh local `dist/` matches all public production files byte-for-byte.

## Repair made

- Restored `Teacher-reviewed pedagogy` to the researched brief.
- Restored a review record with the reviewer qualification, date, grade range,
  exercised-flow, feedback, change, and disposition fields needed for a real
  review.
- Removed the prior verifier rule that rejected any mention of an external
  teacher review. The local facilitator checklist remains a separate,
  tested, non-persistent product check and does not claim a learning outcome.
- Corrected the independent HTTPS QA script to expect the current accurate
  subtraction recovery wording: the amount taken away cannot be greater than
  the starting number.

## Verification

From the documented clean setup on 2026-09-05 UTC:

```sh
npm ci
npm test
npm run build
```

- `npm ci`: passed; npm reported 0 vulnerabilities.
- `npm test`: passed; TypeScript, 21 Vitest/static checks, and 76 Playwright
  checks.
- All 24 literal commands declared in `.factory/claims.json` passed
  individually after `npm ci`.
- `npm run build`: passed and produced `dist/`. Initial JavaScript is
  12.93 kB gzip and CSS is 6.47 kB gzip.
- Fresh HTTPS desktop and 390 px phone contexts passed the first-read check:
  the job is exploring addition/subtraction steps, the audience is elementary
  children with a teacher or parent, and the first action is **Try it with
  sample data**.
- The live sample opened in one click with its persistent demo label, reset,
  and real-data exit. Normal, invalid, boundary, recovery, persistence,
  export, offline reload, update, keyboard, reduced-motion, mobile, legal,
  link, and 404 paths passed.
- Live Playwright Axe found zero violations on landing, demo, completion,
  history, legal routes, phone demo, and 404. `verify-url.sh` also passed:
  HTTPS 200, title, `lang`, one h1, main landmark, image alt coverage, named
  buttons, and no browser errors.
- The standalone Axe CLI could not start ChromeDriver with this worker's
  Playwright Chromium. The pinned Playwright Axe audit completed successfully
  and is the accessibility evidence for this environment.
- Fresh live traffic was same-origin only. The service worker controlled the
  demo, reloaded it offline with HTTP 200, and the update path retained the
  sample. HTTPS response policy and cache headers were present.

## Earlier finding disposition

The prior software findings remain closed: real saved-problem routes and focus,
headline wrapping, 404 shell, persistence race, blank input recovery,
subtraction narration and boundary text, and the no-AI claim are covered by
the current suite and live check. The sole open finding is the absent qualified
elementary-teacher review.

## Required next step

Have a qualified elementary teacher review addition and subtraction, direct
dragging, labelled keyboard controls, narration, replay, and the discussion
card. Record their qualification, date, grades/ages, observations, required
changes, changes made, and final decision in
[`pedagogy-review.md`](pedagogy-review.md). Then rerun the checks above and
independent live QA. An explicit owner waiver is the only alternative release
path.
