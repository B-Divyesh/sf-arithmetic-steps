# Independent verification 6 — FAIL

- Candidate commit: `f078cee4f7e1491ac984a2d689572d70c277d55d`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Date: 2026-08-30 UTC
- Verifier: independent factory QA

## Verdict

**FAIL.** The deployed product is functionally strong and matches the candidate build, but it cannot meet the researched brief's explicit `Teacher-reviewed pedagogy` constraint. No named qualified elementary teacher, date, exercised scenarios, observations, or decision is recorded in `.factory/pedagogy-review.md`. That file explicitly says it does not certify the product as teacher-reviewed.

## First-read live check

Cold desktop load returned 200 with no console or page errors. The first screen says **“Explore addition and subtraction steps”**, identifies its audience as elementary children with a teacher or parent, says that moving counters explains how an answer changes, and presents **“Try it with sample data”** as the primary action. That action opens `/demo` in one click with a part-complete `52 − 18` sample and the persistent “Demo — sample data, nothing is saved.” banner. The first-read/demo acceptance check passes.

## Required claim preflight

After `npm ci` (61 packages, 0 audit vulnerabilities), I ran every exact command declared in `.factory/claims.json` separately from the demo entry point. All passed: `demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`, `visible-focus`, `tens-and-ones`, `direct-manipulation`, `narrated-steps`, `replay-and-discussion`, `free-no-account`, `arithmetic-bounds`, `keyboard-controls`, `unfinished-persistence`, `json-export`, `json-import`, `clear-data`, `print-card`, `reduced-motion`, `mobile-controls`, and `no-game-mechanics`.

No declared claim failed when executed by its exact command.

## Local build and test evidence

| Check | Evidence | Result |
| --- | --- | --- |
| Type/unit/static | `tsc --noEmit`; 13 Vitest assertions | PASS |
| Full suite, retry | `npm test`: 55 passed, 1 expected project skip, 2.1 min | PASS |
| Full suite, first run | 54 passed, 1 failed, 1 expected project skip. Mobile `@claim:unfinished-persistence` timed out waiting for `48 + 17` after clicking Move the chunk. The same claim then passed alone and in the full retry. | FLAKY — see P1 |
| Production build | `npm run build`; `dist/` produced; SW precached 24 URLs | PASS |
| Budget | initial app JS 36,216 B raw / 10,570 B gzip plus 755 B / 457 B loader; CSS 26,361 B raw / 6,148 B gzip | PASS |

## Independent live product evidence

- End-to-end desktop: completed the sample `52 − 18 = 34`, replayed a step, saw the discussion prompt, returned to real mode; validated sum-over-100, decimals, zero-plus-zero, and subtraction-below-zero recovery; completed boundary `99 + 1 = 100`; verified JSON export, invalid JSON recovery, and cancel/confirm clearing saved problems.
- 390 px mobile: `scrollWidth === clientWidth === 390`; every visible control measured at least 44 px in each dimension.
- Keyboard/reduced motion: first Tab reached the skip link with a brass 3 px outline and 3 px offset; Enter moved focus to `main`; the focused action had the same visible ring; reduced-motion replay advanced one step and announced the change.
- Accessibility: axe reported zero serious/critical (in fact zero total) violations on landing, demo, completion, empty history, privacy, terms, and 404. `verify-url.sh` also passed: `lang=en`, title, one h1, main, all images have alt attributes, no unlabeled buttons, zero console/page errors; cold load was 760 ms.
- Privacy: request recording across the live demo and full route showed only same-origin GETs. No analytics, third-party origins, account/payment forms, iframes, or API calls were observed. This static PWA has no server-side endpoint, authentication, billing, or API allowance to test; 429/Retry-After and Entra checks are not applicable.
- PWA: an activated controlling worker (`arithmetic-steps-e639b0426049`) was registered; the update banner/update path completed without losing demo state; `/demo` reloaded offline with 200 and `52 − 18` present. The worker excludes deployment-only `staticwebapp.config.json` from precache.
- HTTP: HTTPS 200 supplied HSTS, CSP with response-header `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and restrictive permissions policy. HTML is short cached, hashed assets are immutable, and `sw.js` is no-store.
- Deployment identity: SHA-256 comparison found all 24 public deployable files byte-identical to this candidate's fresh `dist/`. The sole excluded build file, `staticwebapp.config.json`, intentionally returns 404 because Static Web Apps consumes it as deployment metadata rather than serving it.

## Defects

### P0 — required elementary-teacher pedagogy review is absent

The brief lists `Teacher-reviewed pedagogy` as a product constraint. `.factory/pedagogy-review.md` explicitly says no named elementary teacher has reviewed the release and leaves all eight required review-record fields blank. This cannot be satisfied by automated testing or a fabricated sign-off. A qualified elementary teacher must exercise both operations, drag and keyboard paths, narration, replay, and discussion card, then record their qualification, date, grades/ages, observations, required changes, and follow-up decision.

### P1 — full parallel test suite is flaky

The first `npm test` run failed the mobile `@claim:unfinished-persistence` scenario at `tests/e2e/app.spec.ts:484`: after the Move the chunk click, `48 + 17` did not appear within 7 seconds. Its page snapshot remained at `38 + 27`. Running the exact claim alone passed, and the immediately following whole-suite retry passed. This does not prove a user-facing persistence defect, but it makes the required quality gate nondeterministic. Stabilize the test or the async move completion before release.

## Release path

Do not release this candidate until the P0 external review is recorded and the full suite is reliable. Re-run `npm test`, `npm run build`, every exact claim command in `.factory/claims.json`, and the live independent QA after those changes.
