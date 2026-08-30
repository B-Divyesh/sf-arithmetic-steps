# Arithmetic Steps — repair 8 handoff

- Source finding report: commit `206d557599bb970faffdf063d4a0fd9334c486d9`
- Repaired implementation: `555f069c11406692f47eda2a94aff6618744858d`
- Original candidate: `f078cee4f7e1491ac984a2d689572d70c277d55d`
- Product version: `1.0.3`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Date: 2026-08-30 UTC

## Outcome

The release-blocking persistence flake is fixed and covered by a controlled
regression. All automated, claim, local production, accessibility, privacy,
offline/update, routing, response-policy, and performance checks pass.

Release acceptance still requires the brief's external pedagogy constraint.
No named qualified elementary teacher review exists in repository history,
remote branches, or project issues. This unattended worker cannot truthfully
create that human evidence. `.factory/pedagogy-review.md` therefore remains an
honest incomplete review record; no teacher-reviewed or learning-outcome claim
was added.

## Verifier findings

### P1 — full-suite persistence flake: fixed

Root cause: a move changed the arithmetic model immediately, but `src/main.ts`
waited for an IndexedDB transaction before rendering. Under the verifier's
mobile/parallel contention, the screen could remain at `38 + 27` longer than
the seven-second assertion even though the move itself had succeeded.

Repair:

- Render setup, move, and undo state immediately instead of waiting for the
  durable IndexedDB transaction.
- Add a synchronous, versioned local checkpoint for unfinished work, separated
  as `arithmetic-steps:active-route` and
  `demo:arithmetic-steps:active-route`.
- Keep IndexedDB as the durable store and recovery fallback.
- Validate checkpoint data before restoration and preserve demo/real deletion
  boundaries.
- Update privacy and demo documentation for the checkpoint.

Exact regression: `@claim:unfinished-persistence` now holds a real IndexedDB
write transaction open, requires `48 + 17` to render within one second, checks
the namespaced checkpoint, and reloads before releasing IndexedDB. Desktop and
mobile both restore the same intermediate equation. A 10-repeat, four-worker
stress run passed 20/20 cases. The full clean suite then passed twice without a
retry.

### P0 — qualified elementary-teacher review: external gate remains

The verifier explicitly requires a real qualified teacher to exercise both
operations, drag and keyboard paths, narration, replay, and the discussion
card, then record their name, qualification, date, grades/ages, observations,
changes, and follow-up decision. Automated QA, published research, or an
invented identity cannot satisfy this gate. The required record remains in
`.factory/pedagogy-review.md` for a real reviewer to complete.

## Verification evidence

| Gate | Result and evidence |
| --- | --- |
| Clean work-order pipeline | PASS — `npm ci && npm test && npm run build`; 61 packages, 0 audit vulnerabilities; TypeScript clean; 14 Vitest tests; 55 Playwright tests passed and one intentional desktop skip; `dist/` produced. |
| Independent claims | PASS — every exact command in `.factory/claims.json` ran separately; 20/20 claim IDs passed on their applicable desktop/mobile projects. |
| Persistence stress | PASS — `npx playwright test --grep '@claim:unfinished-persistence' --repeat-each=10 --workers=4`; 20/20 passed with blocked IndexedDB writes and immediate reloads. |
| Production bundle | PASS — app JS 36.90 kB raw / 10.90 kB gzip plus 0.76 kB loader; CSS 26.36 kB raw / 6.15 kB gzip; 24 precached URLs; cache `arithmetic-steps-6f613e180a4d`. |
| Desktop product flow | PASS — sample `52 − 18 = 34`, narration, replay, discussion prompt, validation cases, `99 + 1 = 100`, JSON download/import, and confirmed clear all passed. |
| Exact 390 px mobile | PASS — `scrollWidth === clientWidth === 390`; no visible control below 44×44 px; visual capture at `.factory/qa-artifacts/repair-8-local/mobile-demo.png`. |
| Keyboard and motion | PASS — first Tab reaches the skip link; Enter focuses `main`; controls have a 3 px brass outline and 3 px offset; reduced-motion replay advances once with status feedback. |
| Accessibility | PASS — axe found zero violations on landing, demo, completion, empty history, Privacy, Terms, and 404. URL smoke found `lang=en`, one h1, main, alt text, labelled buttons, and zero console/page errors. |
| Privacy | PASS — the full demo/product request trace contained only same-origin GET requests; no analytics, API, account, payment, iframe, or identifying-input surface. Demo IndexedDB and checkpoint namespaces were deleted without changing real sentinels. |
| Offline/update | PASS — activated controlling service worker; waiting-worker update preserved demo state; offline `/demo` reload returned 200 with `52 − 18`; deployment-only configuration is not precached. |
| Routes/links | PASS — `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; unknown route returned the styled 404; every crawled internal and source link returned 2xx/3xx. |
| Response policy | PASS live — CSP with response-header `frame-ancestors 'none'`, HSTS, DENY framing, nosniff, strict referrer policy, restrictive permissions policy, immutable hashed assets, short HTML caching, and no-store service worker. The styled unknown route returns HTTP 404 with the same security headers. |
| Lighthouse mobile | PASS live — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.0 s, TBT 30 ms, CLS 0.005, transfer 38 KiB. Local emulator scores were also 100/100/100/100. |
| Deployment and identity | PASS — Azure Static Web Apps deployment `2236842e-3da1-45d0-ab56-1bc373740d8e` completed. All 29 public files are SHA-256 byte-identical to the clean local `dist/`; host-only `staticwebapp.config.json` is intentionally excluded. |
| Package/consumer, backend, and auth policy | Not applicable — this remains a static local-first PWA with no package API, server endpoint, authentication, billing, or model integration. |

Local evidence is in `.factory/qa-artifacts/repair-8-local/`; live evidence is
in `.factory/qa-artifacts/repair-8-live/`. Each contains independent QA, URL
smoke, Lighthouse, and desktop/mobile screenshots. Live evidence also includes
the response headers and deployment identity result.

## Run and verify

```sh
npm ci
npm test
npm run build

# Run every exact `test` command in .factory/claims.json.
swa start dist --port 4280
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  http://localhost:4280 .factory/qa-artifacts/repair-8-local
node .factory/qa-artifacts/independent-live-qa.mjs \
  http://localhost:4280 .factory/qa-artifacts/repair-8-local
```

## Required next step

A qualified elementary teacher must complete the eight fields in
`.factory/pedagogy-review.md` after exercising the specified flows. Apply any
required changes, record the follow-up decision, then rerun the clean pipeline,
all claim commands, and live independent QA. Until that happens, do not label
the release teacher-reviewed or accepted against the full researched brief.
