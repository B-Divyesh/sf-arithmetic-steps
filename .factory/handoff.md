# Arithmetic Steps — repair 12 handoff

## Release disposition

**Transparent repair ready to deploy as `1.0.6`.**

This repair restores the researched brief instead of rewriting it. The brief
still requires `Teacher-reviewed pedagogy`. No qualified external educator
review is recorded or claimed, and no study has been fabricated. The product is
therefore presented as a tool for educator review before classroom use. It must
not be represented as having satisfied the original teacher-review constraint
until a real qualified review is recorded or a factory-owner waiver is granted.

## What changed

- Restored `Teacher-reviewed pedagogy` in `.factory/brief.json`.
- Replaced the prior substitution narrative with an explicit review boundary in
  `.factory/pedagogy-evidence.md`; it records the missing external review as a
  known dependency rather than inventing one.
- Added the landing-page **Review this tool before classroom use** checklist.
  It opens the supplied `52 − 18` demo, has four native labelled checks, an
  announced completion state, and a reset control. Marks are deliberately
  ephemeral and do not touch real or demo storage.
- Added `.factory/facilitator-review.md`, the `facilitator-review` public claim,
  and its exact Playwright regression. The test opens the sample, completes all
  checks, proves a refresh does not retain marks, and resets the checklist.
- Derived all visible build labels from `package.json` through Vite. The app,
  Privacy, Terms, and manifest now share `1.0.6`; the build sync step updates
  the PWA `start_url` version before Vite builds.
- Added static and browser regressions for the restored brief boundary and
  cross-route version identity.
- Fixed a checklist accessible-name collision with the arithmetic `Take away`
  field discovered during the claim run.
- Set Playwright to one worker. A two-worker full run produced a Chromium
  headless-shell SIGSEGV while launching one mobile Axe test; the serial run
  passes the same suite and avoids concurrent Chromium launch instability in
  this worker image.

## Reproduced findings

Before the repair, a source reproduction reported all three relevant states:

- the original `Teacher-reviewed pedagogy` brief constraint was absent;
- no qualified review record existed; and
- landing/versioned PWA were `1.0.5` while both legal pages displayed `1.0.4`.

The new static contract test fails if the brief is changed again, if active copy
claims outside review, if the review checklist disappears, or if a route
hard-codes a divergent build label. The browser test verifies the actual app,
legal routes, and manifest use one `1.0.6` identity.

## Verification

All commands ran from `/work/repo` after a clean `npm ci` (61 packages, zero
audit vulnerabilities).

| Check | Result |
| --- | --- |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 17 tests |
| `npm test` | PASS — 17 unit/static tests; 60 Playwright passed; 2 intentional project skips |
| every exact command in `.factory/claims.json` | PASS — 21/21 commands, each in fresh browser contexts |
| `npm run build` | PASS — `dist/` with root `index.html`; 24 service-worker precache URLs |
| factory `verify-url.sh` on local production preview | PASS — 652 ms; title/lang/one h1/main/alt/named controls; no console errors |
| Playwright Axe integration | PASS — zero violations on landing, demo, completed route, and legal routes |
| desktop and 390×844 browser smoke | PASS — no console errors or overflow; demo banner and `Build 1.0.6` visible |
| Lighthouse mobile local preview | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.005 |

Committed local artifacts are under `.factory/evidence-repair-12/`, including
the verification summary, Lighthouse JSON, and factory URL-smoke output.

### Product behavior covered

- Fresh demo isolation, local-only request policy, no accounts or child IDs,
  offline reload, installability, service-worker update, and real/demo storage
  separation.
- Addition and subtraction, bounds and blank-input recovery, drag and keyboard
  alternatives, narration, replay, print, JSON import/export, persistence,
  reset/clear controls, reduced motion, and the 390 px layout.
- Privacy, CSP/static-hosting response policy, routing, legal shell, and PWA
  manifest/version identity are covered by static and browser regressions.

## Build and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Deployment remains the existing static/PWA class: publish `dist/` using the
repository’s `public/staticwebapp.config.json`. No backend, account, billing,
model, tracking, or third-party runtime service is introduced.

`main` was pushed at commit `9de52a9`. The standard `swa deploy ./dist --env
production --swa-config-location ./dist --no-use-keychain` command authenticated
in this worker and completed its local process, but the repository supplies no
static-app identifier or deployment-token configuration and the public edge was
still serving `Build 1.0.5` during the final check. Treat live propagation as
pending; the factory deployment controller should publish this commit’s `dist/`
to the existing `sf-arithmetic-steps` static app, then verify the live footer
reports `Build 1.0.6`.

## Known gap / next step

The restored researched constraint has not been fulfilled by this worker:
obtain a real qualified elementary-educator review that records reviewer
qualification, date, grades/ages, addition/subtraction and drag/non-drag
flows, narration/replay/discussion feedback, required changes, and the follow-
up disposition. Alternatively, record an explicit factory-owner waiver. Until
then, use the shipped checklist for local educator review and do not make a
completed-review or academic-outcome claim.

Live publication also remains pending at handoff: GitHub push succeeded, but
the public URL had not advanced from `1.0.5` when checked.
