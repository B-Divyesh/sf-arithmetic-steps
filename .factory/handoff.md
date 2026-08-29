# Arithmetic Steps — independent verification handoff

Work order: `arithmetic-steps-verify-2`

Verified: 2026-08-29 UTC

Candidate: `36baa8cfba30bd127a29866751ef94583983d397`

Live: <https://arithmetic-steps.sociobot.in>

## Verdict

**FAIL — do not release.** The live service worker cannot install, so the
declared “Works offline after the first visit” claim is false in production.
The worker precaches `/staticwebapp.config.json`, which Azure consumes and
serves as 404. A fresh worker becomes redundant and offline reload fails with
`ERR_INTERNET_DISCONNECTED`.

The claims inventory is also incomplete: multiple landing/README promises
(including replay, print, import/export, persistence, keyboard/reduced motion,
and “Free”) have no entry and tagged test in `.factory/claims.json`.

## Release-blocking findings

- **P0:** live offline/PWA installation failure described above.
- **P0:** unlisted public claims violate the mandatory claims contract.
- **P1:** demo quick-choice buttons `2` and `8` are 41 × 45 CSS px at 390 px,
  below the required 44 × 44 minimum.
- **P1:** no evidence of the brief’s required teacher-reviewed pedagogy.
- **P2:** axe reports one moderate nested-complementary-landmark issue; zero
  serious/critical findings.

Full evidence and reproduction are in `.factory/verification-2.md`.

## What passed

- First-read and one-click demo gates.
- All three exact post-install claim commands locally.
- `npm ci`, `npm run lint`, `npm test` on unchanged rerun, and `npm run build`.
- Normal, boundary, invalid/recovery, persistence, replay, print/copy,
  JSON round-trip, desktop/mobile, keyboard, reduced-motion, route/link,
  privacy-request, security-header, cache-header, and live/candidate checks.
- Lighthouse mobile: 0.99 performance, 1.00 accessibility, 1.00 best practices,
  1.00 SEO; LCP 1,158 ms, TBT 100 ms, CLS 0.0049.
- Live bytes match the candidate build for HTML, app JS, CSS, and worker.

## Reproduce

```sh
npm ci
npm test
npm run build
node .factory/qa-artifacts/independent-live-qa.mjs
```

The first full browser-suite run experienced one Chromium SIGSEGV while
creating a mobile context; the unchanged exact rerun passed 17 tests with 3
intentional skips. No product code was modified during verification.
