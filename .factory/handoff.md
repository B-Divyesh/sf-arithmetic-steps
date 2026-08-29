# Arithmetic Steps — verification 4 handoff

- Work order: `arithmetic-steps-verify-4`
- Tested commit: `d0cc4bc4b49097539ce8aa35b4ebd0e28a7caa9b`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Artifact: static local-first PWA (`dist/`)

## Outcome: FAIL — release blocked

All 20 required claims commands, the full test suite (11 unit/static + 56
browser tests), exact production build, live desktop/mobile flows, offline
reload/update, privacy request log, headers, accessibility, and deployment
byte identity passed. See `.factory/verification-4.md` for exact evidence.

Release is nevertheless **FAIL** because the researched brief requires
teacher-reviewed pedagogy. `.factory/pedagogy-review.md` explicitly says that
no named elementary teacher has reviewed the release. This is the sole P0
release blocker; no code or deployment defect was found.

## Required next step

Before release, obtain and record a qualified elementary teacher's review in
`.factory/pedagogy-review.md`: reviewer/qualification, date, grades, addition
and subtraction scenarios, direct dragging and keyboard alternative feedback,
narration/replay/discussion-card feedback, required changes, and final
follow-up decision. Re-run independent verification after that evidence is
available.

## Previous repair evidence

## Verifier findings and regressions

### P0 — incomplete claim coverage

Root cause: README and legal copy promised installability, visible focus,
print output, and clearing data without one matching tagged claim each. The
privacy test also began after navigation and observed only page requests.

Repair:

- Added `installable-pwa`, `visible-focus`, and `clear-data` claim entries and
  exact Playwright cases.
- Strengthened `print-card` to emulate print media and assert that only the
  full-width, unbroken discussion card remains.
- Rebuilt `local-only` around a fresh browser context whose request listener
  starts before cold navigation. It waits for the worker, exercises the demo,
  and asserts all page and worker traffic is same-origin GET traffic.
- Each public claim now appears exactly once as `@claim:<id>` and every exact
  command in `.factory/claims.json` passes.

### P1 — no direct manipulation

Root cause: quantities were visual only; learners could make moves only with
the chunk controls.

Repair:

- Every available one-counter and ten-frame is now a native, labelled,
  draggable button.
- Addition has a marked destination; subtraction has a marked take-away
  target. Pointer handling supports touch at mobile widths.
- The existing labelled chunk controls remain as the complete keyboard and
  switch-device alternative.
- `@claim:direct-manipulation` drags a ten-frame and a one-counter in
  `38 + 27`, then a ten-frame in `52 − 18`, asserting the changed equations
  and narrated steps. Its mobile run exercises the touch-pointer path.

### P2 — metaphoric task copy

Root cause: several instructional headings reused the visual transit motif
instead of naming the learner's task.

Repair: replaced the reported phrases with literal problem, step, answer, and
discussion wording. `.factory/copy-audit.md` contains the current landing copy,
word counts, terminology, and banned-word check.

### External teacher review

The implementation now matches the brief's manipulation and non-drag-input
requirements, but a repository change cannot substitute for a qualified
human review. `.factory/pedagogy-review.md` contains the exact evidence and
fields the reviewer must complete. The UI makes no teacher-reviewed or
academic-outcome claim.

## Clean local verification

Run on 2026-08-29 UTC:

```sh
npm ci
npm test -- --fully-parallel --workers=4
npm run build
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/qa-artifacts/repair-5-local
```

| Check | Result |
| --- | --- |
| Clean install | PASS — 61 packages; `npm audit` reported 0 vulnerabilities. |
| Type/lint | PASS — `tsc --noEmit`. |
| Unit/static contracts | PASS — 11 Vitest tests. |
| Browser integration | PASS — 55 Playwright tests across desktop Chromium and mobile; one expected desktop skip for the mobile-only claim. |
| Claims | PASS — all 20 exact `.factory/claims.json` commands, including the five verifier-targeted regressions. |
| Production build | PASS — `dist/index.html`; JS 36,216 B raw / 10,620 B gzip; CSS 26,361 B raw / 6,150 B gzip. |
| Generated worker | PASS — cache `arithmetic-steps-e639b0426049`, 24 precache URLs, no host-only deployment config. |
| URL smoke | PASS — title, `lang=en`, one h1, main, alt text, labelled controls, and zero console errors. |
| Accessibility | PASS — Playwright Axe found zero violations; keyboard skip/focus, 200% text, reduced motion, exact 390 px layout, and 44 px targets passed. |
| Local Lighthouse 13.4.1 | PASS — Performance 1.00, Accessibility 1.00, Best Practices 1.00, SEO 1.00; FCP 1,097 ms, LCP 1,399 ms, TBT 0 ms, CLS 0.0049, 43,995 B transfer. |

The offline claim runs in independent desktop and mobile browser contexts.
Both retain the demo after `context.setOffline(true)` and reload. A real
replacement-worker test exposes the update toast, activates through
`SKIP_WAITING`, changes controller, reloads, and preserves the active problem.

Evidence is in `.factory/qa-artifacts/repair-5-local/`. Its captured
`index.html` has the same SHA-256 as `dist/index.html`.

## Deployment and live verification

Deployed with the work order's static deployment command:

```sh
/opt/fleet/lib/deploy-static.sh arithmetic-steps dist
```

- Azure Static Web Apps deployment:
  `cc183e5a-b4ab-43fa-9dca-2eff006cc89d`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Custom domain: HTTP 200
- Live Lighthouse: Performance 1.00, Accessibility 1.00, Best Practices
  1.00, SEO 1.00; FCP 915 ms, LCP 1,065 ms, TBT 0 ms, CLS 0.0049.
- Live desktop smoke: correct title/landmarks/labels and no console errors.
- Live exact-390 exercise: no overflow, no target below 44 px, zero Axe
  violations, touch-drag changed `42 − 8` to `41 − 7`, and the value survived
  offline reload and a replacement-worker update.
- The full live exercise recorded 65 same-origin GET requests, including 53
  worker requests, and no third-party traffic. The expected offline navigation
  rejection was served successfully by the worker.
- Response policy passed: CSP with `frame-ancestors 'none'`, HSTS,
  `X-Frame-Options: DENY`, Permissions Policy, Referrer Policy, nosniff,
  immutable hashed assets, non-cacheable `sw.js`, and a real HTTP 404.

Live and local artifact hashes match:

| File | SHA-256 |
| --- | --- |
| `index.html` | `dfcd751f2ea8166e15070f5ccbb17d1fac7db91826185fd55d0596820c633212` |
| `assets/main-DqGOVm7h.js` | `4f51acee345b727faaff7305de78c9c7f27aa1d20eb3037273417e88796a7e8c` |
| `assets/styles-C64zr1HK.css` | `f43754b1e663ecd1504f497270b773d88af338d4ec8e03ab3ae4fd1851fecf5a` |
| `sw.js` | `585ea488454e750239ca312ec96ba4e10a890e5fd4fbaaad97e0d5249e0e3e85` |

Live screenshots, URL smoke output, captured HTML, and Lighthouse JSON are in
`.factory/qa-artifacts/repair-5-live/`.

## Applicability

This remains the requested static PWA with local IndexedDB storage. It has no
backend, product/unlock API, authentication, billing, external AI call,
library, or CLI package. Backend response-policy/429, live identity/payment,
and package-consumer gates do not apply. The offline PWA, storage privacy, and
deployed static response-policy gates above are the applicable equivalents.

## Remaining action

Have a qualified elementary teacher exercise addition, subtraction, direct
dragging, keyboard alternatives, narration, replay, and the discussion card.
Record their name, date, scope, feedback, and resulting changes in
`.factory/pedagogy-review.md`. No other known software, test, privacy,
deployment, or release finding remains from verification 3.
