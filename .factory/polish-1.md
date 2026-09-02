# Polish 1 — Arithmetic Steps

Implementation commit: `f2807f6`

Deployment: `220c810f-576e-453c-9a60-048569cf504c`

Live URL: <https://arithmetic-steps.sociobot.in>

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — Saved problems used a hash, landing title, and stale focus | Kept `/saved-problems`, `/saved-problems/<id>`, and `/practice` as real History API routes. Preserved route titles, canonicals, h1 focus, polite announcements, Back behavior, and Static Web Apps rewrites. Replaced the last stale `/#learn` and `/#history` install shortcuts. | `uses a real saved-problems route with a title, focused heading, and route announcement`; `uses real product routes in install shortcuts`; live route/title/Axe crawl in `.factory/evidence-polish-1-retry1/live-qa/verification-summary.json`. |
| F-1-2 — Two README sentences exceeded 22 words | Kept the repaired test/build copy as short sentences. | `.factory/copy-audit.md` records every revised README sentence at 22 words or fewer. |
| F-1-3 — README used storage and PWA jargon | Kept the learner-facing wording: completed work stays in this browser, unfinished work remains after refresh, and the activity works offline after first visit. | `.factory/copy-audit.md`; `@claim:completed-persistence`, `@claim:unfinished-persistence`, and `@claim:offline-reload`. |
| Controller-1 — A completed route disappeared when its IndexedDB write finished after navigation | Added a synchronous, storage-mode-namespaced completion checkpoint. Saved problems merges the checkpoint with IndexedDB by route id until the durable write commits. Demo reset and clear-data remove the matching checkpoint. | `@claim:completed-persistence keeps Saved problems open when completion storage finishes after navigation` passes in desktop and mobile Chromium. The cold live check reports `checkpointedBeforeWrite`, `routeStayedOpen`, and `completedProblemVisible` as true in `.factory/evidence-polish-1-retry1/live-qa/verification-summary.json`. |
| Controller-2 — Mobile Saved problems had no visible Practice action | Reworked the narrow header into a three-stop Practice/Demo/Saved problems strip. Every link remains at least 44 px, with no horizontal overflow. Navigation focuses the Practice h1. | `uses a real saved-problems route with a title, focused heading, and route announcement`; `@claim:mobile-controls`; live screenshot `.factory/evidence-polish-1-retry1/live-qa/mobile-saved-problems.png`. |
| Required demo path — `?demo=1` needed direct proof | Added `/?demo=1` to the isolated demo claim and live route crawl. It loads the part-complete `52 − 18` sample, shows the persistent banner, resets only demo storage, and leaves real data untouched. | `@claim:demo-sandbox opens an isolated sample route and can return to real storage`; live route crawl in `.factory/evidence-polish-1-retry1/live-qa/verification-summary.json`. |

## Additional acceptance work

- Updated `.factory/claims.json` to 23 one-to-one claim tests.
- Updated the catalog line to: “Move counters to explain addition and
  subtraction steps with a child.” It is verb first and 69 characters.
- Updated `.factory/demo.md`, `.factory/design.md`, and the independent live QA
  script for the completion checkpoint, mobile navigation, and query demo.
- Released build 1.0.13 without changing the Number Line Limited visual system.

## Verification

- Clean clone: `/tmp/arithmetic-steps-polish-1-retry1.da0dUk`.
- `npm ci`: 0 vulnerabilities.
- `npm test`: 18 unit/static tests and 69 browser tests passed; the three
  viewport-specific skips were expected.
- `npm run build`: `dist/` produced; main JS 44.36 kB raw / 12.93 kB gzip;
  CSS 28.53 kB raw / 6.47 kB gzip.
- Every literal command in `.factory/claims.json` passed individually from the
  clean clone. See `.factory/evidence-polish-1-retry1/clean-verification.md`.
- Local independent QA: PASS, zero Axe violations, no console errors, no
  third-party requests, offline reload passed, and 390 px had no overflow or
  undersized targets.
- Live independent QA: PASS with the same checks plus the delayed-write race.
- Live Lighthouse: performance 100, accessibility 100, best practices 100,
  SEO 100; LCP 1.07 s and CLS 0.
- Live `verify-url.sh`: HTTP 200, 857 ms cold load, one h1, `lang=en`, main
  landmark, complete alt text, labelled buttons, and no console errors.

No finding from `.factory/review-1.md`, the earlier polish record, or the
controller evidence remains open.
