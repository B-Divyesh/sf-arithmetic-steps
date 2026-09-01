# Arithmetic Steps — repair 16 handoff

## Release disposition

**Version 1.0.10 is repaired, published, and live.**
The artifact remains a local-first PWA. There is no backend, account, billing,
model, tracking, or third-party runtime service.

## Reproduction and root cause

The controller findings were reproduced before implementation with an exact
source check. It exited 1 and reported both failures:

```text
REPRODUCED 2 controller failure(s):
- brief still requires the unprovable “Teacher-reviewed pedagogy” study
- 404 heading is not the literal “Page not found”
```

The brief made an outside qualified review a release constraint even though a
sandbox cannot perform or prove that study. Public copy then made a negative
qualified-review statement to explain the gap. That statement was honest but
still outside what the product test suite can establish. The useful local
checklist itself was already observable and testable.

The 404 document had the correct title and status configuration, but its h1 was
the metaphorical “This stop is not on the line.” The existing static test only
asserted the title and did not lock the visible heading.

## Repair

- Replaced the brief constraint with `Optional facilitator review checklist
  with no learning-outcome claim`.
- Reworded the landing page, README, Terms, claims contract, and current
  guidance records to the testable statement: “This optional checklist is
  guidance, not evidence of learning outcomes.”
- Kept the four-item checklist as optional guidance. It remains resettable,
  does not persist marks, and links to the isolated `52 − 18` sample.
- Replaced the 404 h1 with the literal “Page not found.”
- Replaced `educator-review-boundary` with the exact
  `optional-review-guidance` claim and browser regression.
- Added static regressions that reject the old brief line and outside-review,
  study, approval, validation, and outcome claims across active sources.
- Added browser coverage for the exact 404 heading, return link, Axe scan, and
  200% text resizing at 390 px.
- Bumped the visible PWA/build identity to `1.0.10`.

Historical independent-verification reports are retained unchanged as audit
records. They are not current product claims or source-of-truth constraints.

## Local verification

All checks ran from `/work/repo` on 2026-09-01 UTC.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages; zero reported vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 17 unit/static tests |
| `npm test` | PASS — 17 unit/static tests; 67 browser tests passed; 3 intended viewport-specific skips |
| Every literal command in `.factory/claims.json` | PASS — 22/22 independently |
| Controller regressions | PASS — optional-guidance contract and literal 404 h1 |
| `npm run build` | PASS — `dist/index.html`; 24 precached URLs; version `1.0.10` |
| Asset budget | PASS — 41,158 B raw initial JS; 28,215 B CSS; no fonts |
| Factory `verify-url.sh` on SWA emulator | PASS — title/lang/one h1/main/alt/named controls; no console errors |
| Desktop and 390 px browser exercise | PASS — complete flow, invalid recovery, export, no overflow, all targets at least 44 px |
| Keyboard and 200% text | PASS — skip link first, visible 3 px focus ring, keyboard flow, primary action visible without overflow |
| Accessibility | PASS — Axe serious/critical 0 on landing, demo, completion, history, legal pages, and 404 |
| Privacy / response policy | PASS — same-origin GET-only observed traffic; CSP/frame/cache policies and real HTTP 404 pass in SWA emulator |
| PWA / offline / update | PASS — controlling worker, waiting-update flow, offline `/demo` reload with sample retained |
| Mobile Lighthouse | PASS — 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.735 s, CLS 0.00486, TBT 0 ms |
| Package / consumer | Not applicable — private static PWA, not a library or package |
| API / identity / 429 / concurrency | Not applicable — no backend, authentication, billing, model, or tenant path |

Evidence is under `.factory/evidence-repair-16/`. The reusable independent
browser run is `local-browser.json`; Lighthouse data is
`lighthouse-local.json`; factory smoke output is under `local-url/`.

## Deployment and live verification

Implementation commit `b81ff2a` was pushed to `main`. The scoped production
publish completed with:

```sh
swa deploy ./dist --app-name sf-arithmetic-steps \
  --resource-group sf-arithmetic-steps --env production \
  --swa-config-location ./dist --no-use-keychain
```

The CLI-created local `.env` credential file was removed unread immediately
after deployment and was not committed.

Live verification at <https://arithmetic-steps.sociobot.in> passed:

- the manifest start URL is `/?source=pwa&v=1.0.10`;
- all 24 precached files plus `sw.js` match the local production build by
  SHA-256 and byte equality;
- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, the manifest, and worker
  are available; an unknown route is HTTP 404 with h1 “Page not found”;
- root responses include self-only CSP with `frame-ancestors 'none'`, HSTS,
  nosniff, frame denial, strict referrer policy, and restrictive permissions;
- HTML revalidates, hashed assets are one-year immutable, the manifest is
  `no-cache`, and `sw.js` is `no-cache, no-store`;
- the independent desktop and exact-390 px browser run completed the sample,
  invalid recovery, export, keyboard, reduced-motion, route/link, and privacy
  checks with no browser errors or serious/critical Axe findings;
- the live worker controlled `/demo`, and the `52 − 18` sample remained usable
  after an offline reload; and
- live mobile Lighthouse scored 100 performance, 100 accessibility, 100 best
  practices, and 100 SEO; LCP 1.059 s, CLS 0.00486, and TBT 0 ms.

Live evidence is in `live-browser.json`, `live-identity.json`,
`lighthouse-live.json`, `live-headers/`, and `live-url/` under the repair
evidence directory. No other product, service, database, secret, DNS record,
storage account, or infrastructure resource was read or changed.

## Known gaps

None in the tested product scope. The checklist is optional product guidance;
the release makes no outside-review, study, validation, or learning-outcome
claim.
