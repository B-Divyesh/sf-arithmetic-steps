# Arithmetic Steps — repair 14 handoff

## Release disposition

**Repaired, published, and live as `1.0.8`.** This work repairs the P1 finding
in independent verification commit `35165058229490b1d0cedae1445ab24ee76c9aee`
for candidate `94ea6c6970d88e40c5a73a4b8f4b5f9f37c93f77`.

The artifact remains a static, local-first PWA. It has no backend, account,
billing, model, tracking, or third-party runtime service. The researched brief
and all previously passing arithmetic, accessibility, privacy, demo, storage,
and offline behavior remain in place.

## Finding reproduced before repair

The controller required the public product and brief-facing documentation to
say plainly that qualified educator review has not happened. Before edits, the
exact read-only audit failed:

```text
REPRODUCED: src/main.ts does not tell readers that the product has not had qualified educator review.
REPRODUCED: README.md does not tell readers that the product has not had qualified educator review.
EXIT_CODE=1
```

The old static review-boundary test still passed. It banned a few approval
phrases, but it did not require an explicit public limitation. That was the
regression gap.

## Root cause and repair

The prior release described the checklist as not being a completed external
review, and repository evidence said no review was recorded. That wording did
not directly tell a visitor whether the product itself had received qualified
review. The checklist label could also be read without its boundary.

The repair:

- shows **“Arithmetic Steps has not had a qualified educator review.”** in the
  landing-page checklist and Terms;
- uses the same sentence in `README.md`, `.factory/pedagogy-evidence.md`, and
  `.factory/facilitator-review.md`;
- renames the decorative “Educator review” label to “Local checklist”;
- preserves the brief's researched `Teacher-reviewed pedagogy` constraint
  unchanged and retains only observable learning-flow claims;
- registers `@claim:educator-review-boundary` in `.factory/claims.json`; and
- adds browser and static regressions that require the limitation and reject
  teacher-reviewed, educator-approved, validated-pedagogy, and learning-outcome
  claims.

The independent live checker now also fails if the deployed limitation is
missing.

## Verification

All final checks ran from `/work/repo` on 2026-09-01 UTC.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — lockfile install; 61 packages; zero reported vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 17 unit/static tests |
| `npm test` | PASS — 17 unit/static tests; 62 Playwright tests passed; 2 intended viewport skips |
| review-boundary reproduction after repair | PASS — landing, README, Terms, and evidence carry the exact limitation |
| every exact command in `.factory/claims.json` | PASS — 22/22, run independently in desktop/mobile projects where applicable |
| `npm run build` | PASS — root `dist/index.html`; versioned manifest; 24 service-worker precache URLs |
| asset budgets | PASS — initial JS 40,974 B raw / 12,253 B gzip; CSS 28,215 B raw / 6,425 B gzip |
| factory `verify-url.sh` | PASS locally and live — title, lang, one h1, main, image alt, named controls, and no console errors |
| accessibility and keyboard | PASS — zero axe violations on landing, demo, completion, saved-data, Privacy, Terms, and 404 states; designed focus and working skip link |
| desktop and 390 px browser QA | PASS — complete arithmetic/export flow; exact 390 px width; no overflow; no target below 44 px |
| privacy and response policy | PASS — observed requests were same-origin GETs; CSP, HSTS, nosniff, frame denial, referrer and permissions policy present |
| PWA/offline/update | PASS — worker activated and controlled `/demo`; 24-item cache excludes deployment config; offline reload retained `52 − 18`; update regression passed |
| route/link policy | PASS — `/`, `/demo`, `/privacy/`, `/terms/` returned 200; unknown route returned 404; no dead internal links |
| Lighthouse local | PASS — Performance 99, Accessibility 100, Best Practices 100, SEO 100; LCP 1.9 s, TBT 0 ms, CLS 0.005 |
| package/consumer check | Not applicable — this is a private static PWA, not a published package |
| backend allowance/429/concurrency/identity | Not applicable — the product has no API, auth, billing, or model path |

Committed evidence is under `.factory/evidence-repair-14/`, including local and
live browser summaries, Lighthouse reports, and visual captures. The browser
summary covers addition/subtraction, validation recovery, JSON export, desktop,
390 px mobile, keyboard, motion, accessibility, PWA, privacy, routes, and links.

## Deploy and live identity

Implementation commit `8e76bfe` was pushed to `main`. The scoped deployment
command was:

```sh
swa deploy ./dist --app-name sf-arithmetic-steps \
  --resource-group sf-arithmetic-steps --env production \
  --swa-config-location ./dist --no-use-keychain
```

The CLI-created local `.env` credential file was removed without being read
and was not committed. No other service or resource was inspected or changed.

Live verification at <https://arithmetic-steps.sociobot.in> reports build
`1.0.8`, manifest start URL `/?source=pwa&v=1.0.8`, the explicit qualified
review limitation, and zero console errors. SHA-256 values match the local
artifact for `index.html`, manifest, service worker, app JS, version JS, and
CSS. Live Lighthouse scored 100 for Performance, Accessibility, Best
Practices, and SEO, with 1.1 s LCP, 0 ms TBT, and 0.005 CLS.

## Known boundary

Arithmetic Steps has not had a qualified educator review. This release makes
that limitation explicit and test-protected. The local checklist proves only
that its controls and observable learning flow execute; it does not establish
classroom effectiveness or academic outcomes.
