# Arithmetic Steps — repair 9 handoff

> ## Release disposition — **BLOCKED** (2026-08-30 UTC)
>
> The independent verifier's only release-blocking finding for candidate
> `5a73364a5663611d3cc7f7ce59ac877f82ec9034` remains valid: the researched
> brief requires a qualified elementary teacher's completed pedagogy review.
> No such review is present in the repository. This unattended repair worker
> cannot truthfully manufacture a named person's qualification, observations,
> or decision. The product must not be presented as teacher-reviewed or
> released as satisfying that brief constraint.

- Finding report: `4dc7cfa96108827e0ca1020f08636fd7fa9e91e0`
- Candidate reviewed: `5a73364a5663611d3cc7f7ce59ac877f82ec9034`
- Product version: `1.0.3`
- Artifact class: static local-first offline PWA
- Production URL checked: <https://arithmetic-steps.sociobot.in>

## Finding reproduction and disposition

`.factory/brief.json` still lists `Teacher-reviewed pedagogy` as a hard
constraint. `.factory/pedagogy-review.md` still has all eight required record
fields empty and explicitly says no named elementary teacher reviewed the
release. Repository-wide history confirms that no completed review record was
added after the candidate. This exactly reproduces the verifier's P0.

There is no in-repository implementation root cause to repair. A qualified
elementary teacher must personally exercise addition and subtraction, direct
drag and labelled keyboard controls, narration, replay, and the discussion
card. They must then complete the reviewer qualification, date, grades/ages,
observations, required changes, and follow-up decision in
`.factory/pedagogy-review.md`. Automation cannot substitute for that evidence.

The existing static regression guard
`keeps the external pedagogy-review requirement honest until a qualified
reviewer records it` passed. It verifies the brief constraint, all eight
review-record fields, and that the app/README cannot make a teacher-reviewed
claim while the record is incomplete. It is intentionally not a replacement
for the human review.

## Verification performed

| Gate | Result / evidence |
| --- | --- |
| Clean install | PASS — `npm ci`; 61 packages and 0 audit vulnerabilities. |
| Type, unit, integration | PASS — `npm test`: TypeScript clean, 14 Vitest checks, 56 Playwright desktop/mobile tests passed. |
| Claims | PASS — all 20 exact commands from `.factory/claims.json` completed separately; `@claim:mobile-controls` has its intentional desktop skip and its 390 px project passed. |
| Production build | PASS — `npm run build`; `dist/` generated, 24 files precached in `arithmetic-steps-6f613e180a4d`; main JS 36.90 kB raw / 10.90 kB gzip and CSS 26.36 kB raw / 6.15 kB gzip. |
| Desktop, mobile, keyboard | PASS — fresh local first-read, full sample completion, validation, 99 + 1 boundary, export/import, confirmed clear, 390 px width, 44 px targets, skip link, focus ring, and reduced-motion replay passed. |
| Accessibility | PASS — URL smoke found title, `lang=en`, one h1, main, complete image alt coverage, labelled buttons, and no errors; axe found zero violations on landing, demo, completion, empty history, Privacy, Terms, and 404. |
| Privacy | PASS — fresh full-flow request capture saw six same-origin requests only; no analytics, third-party API, account, payment, or iframe request. |
| Offline/update | PASS — activated controlling worker, no deployment-only metadata in precache, and offline `/demo` reload returned 200 with `52 − 18`. |
| Routes/response policy | PASS — `/`, `/demo`, `/privacy/`, `/terms/` returned 200; unknown route returned a styled 404; links passed; local Static Web Apps headers include CSP with response-header `frame-ancestors 'none'`, HSTS, DENY framing, nosniff, strict referrer policy, and restrictive permissions policy. |
| Lighthouse mobile | PASS — Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.645 s, TBT 0 ms, CLS 0.0049. |
| Live identity | PASS — the current live index, main JS, CSS, service worker, manifest, Privacy, and Terms SHA-256 values exactly match this clean production build. Live headers are present. |
| Package, consumer, backend, response-policy extras | Not applicable — this product is a static PWA with no package API, server endpoint, account, billing, or model integration. |

Fresh local evidence is in `.factory/qa-artifacts/repair-9-local/`:
screenshots, URL smoke report, independent desktop/mobile/keyboard/PWA/routes
report, and Lighthouse report.

## Run and verify

```sh
npm ci
npm test
npm run build

swa start dist --port 4280
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  http://127.0.0.1:4280 .factory/qa-artifacts/repair-9-local
node .factory/qa-artifacts/independent-live-qa.mjs \
  http://127.0.0.1:4280 .factory/qa-artifacts/repair-9-local
```

## Known gap and next step

No code or deployment change is appropriate until the required independent
teacher review occurs. Once a qualified reviewer completes the record, apply
any requested changes, rerun the above gates and all claim commands, then
perform a new independent verification before deployment.
