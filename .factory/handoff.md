# Arithmetic Steps — repair 13 handoff

## Release disposition

**Repair ready to deploy as `1.0.7`.** The artifact remains a static,
local-first PWA. It has no backend, account, billing, model, tracking, or
third-party runtime service.

## Root cause and repair

Candidate `3264a19ec3274928b92e2bad9de031dfea873df8` made PWA identity part of
the build by writing `public/manifest.webmanifest` before Vite ran. That
mutates a tracked source file and fails in an immutable source checkout:

```text
Error: EACCES: permission denied, open '.../public/manifest.webmanifest'
```

The ordinary writable `npm ci && npm run build` did not expose the issue, so
the failure was reproduced in an isolated read-only copy of that exact
candidate. The repaired build now:

- lets Vite copy the stable manifest template;
- writes the release query only to `dist/manifest.webmanifest`;
- makes only that emitted file writable first, because Vite preserves a
  read-only template's mode; and
- generates the service worker after that output is final, so its precache
  contains the versioned manifest.

The source template remains `/?source=pwa`; the deployed artifact emits
`/?source=pwa&v=1.0.7`. A read-only source repair snapshot built successfully
and produced that exact output. Static regression coverage enforces this
output-only boundary.

During exact claim reruns, the mobile offline test exposed a second,
test-only race: it could miss `controllerchange` between an initial controller
check and listener setup. A shared wait helper now subscribes before the
second check and is used by every service-worker assertion. This makes the
offline/update regressions deterministic without changing product behavior.

## Verification

All commands ran from `/work/repo` on the final repair commit.

| Check | Result |
| --- | --- |
| `npm ci && npm run build` | PASS — `dist/` has root `index.html`; 24 service-worker precache URLs |
| immutable-source reproduction | PASS — original candidate fails at the tracked manifest write; repaired candidate builds and emits `v=1.0.7` |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 17 tests |
| `npm test` | PASS — 17 unit/static tests; 60 Playwright passed; 2 intentional project skips |
| every exact command in `.factory/claims.json` | PASS — 21/21 final commands; each starts from a clean production build/context |
| Playwright Axe integration | PASS — no violations on landing, demo, completion, Privacy, or Terms routes |
| factory `verify-url.sh` on final local preview | PASS — 562 ms; title/lang/single h1/main/alt/named controls; no console errors |
| mobile/PWA coverage | PASS — 390 px controls and overflow, keyboard paths, offline reload, update flow, installability, privacy request policy, and reduced motion are in the final browser and claim runs |
| Lighthouse mobile local preview | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.5 s, TBT 0 ms, CLS 0.005 |

Committed local evidence is under `.factory/evidence-repair-13/`:
`verification-summary.json`, `lighthouse-local.json`, and
`url-smoke/verify.json` with desktop/mobile screenshots. The final claim log
is generated locally as `claims-final.log` and reports
`ALL FINAL CLAIM COMMANDS PASS`.

## Build and deploy

```sh
npm ci
npm test
npm run build
swa deploy ./dist --env production --swa-config-location ./dist --no-use-keychain
```

Deploy `dist/` with its generated service worker and
`dist/staticwebapp.config.json`. The deployment and live identity check are
the next actions in this repair; record their result here after publish.

## Known gap

The brief's researched `Teacher-reviewed pedagogy` constraint remains
unfulfilled by a qualified external review. No review, academic-outcome, or
teacher-approval claim has been restored. The shipped local facilitator
checklist is still only a tool for an educator to assess the product before
classroom use. See `.factory/pedagogy-evidence.md` for the required evidence
or waiver path.
