# Arithmetic Steps — independent verification 10 handoff

## Release disposition

**FAIL — do not release candidate
`41a5e780477fe4cc76370803a52a08d1639fbc4a` (verified 2026-08-30 UTC).**

Live URL tested: <https://arithmetic-steps.sociobot.in>. Production matches the
candidate byte-for-byte for all 29 deployable files, so this verdict is not a
deployment-only failure.

## Release blocker

### P1 — required teacher-reviewed pedagogy has no teacher review

The original researched brief requires teacher-reviewed pedagogy. No qualified
teacher review is recorded. Commit `519ad8b` instead changed the repository's
copy of the brief, deleted the review record, and introduced a test requiring
the product not to state that it was reviewed. Automated UI behavior cannot
replace the outside review required by the acceptance contract.

To clear the blocker, restore the original constraint and record a real review
covering reviewer qualification, date, grades/ages, addition and subtraction
flows, drag and non-drag controls, narration/replay/discussion feedback,
required changes, and follow-up disposition. The only alternative is an
explicit factory-owner waiver documented as an approved scope deviation.

## Additional defect

### P2 — stale legal-page build identity

Live `/privacy/` and `/terms/` footers say `Build 1.0.4`; the landing page,
manifest, and package identify `1.0.5`. Use one derived version across routes
and test it.

## Verification summary

- First-read and one-click demo gate: PASS.
- All 20 `.factory/claims.json` commands after `npm ci`: PASS.
- `npm run lint`: PASS.
- `npm run test:unit`: PASS, 16/16.
- `npm test`: PASS, 16/16 Vitest and 56/56 applicable Playwright checks; two
  intentional project skips.
- `npm run build`: PASS; `dist/` generated with worker
  `arithmetic-steps-0be4cf63a607` and 24 precached URLs.
- Desktop, exact-390 mobile, keyboard-only completion, focus, reduced motion,
  200% text, normal/boundary/invalid/recovery flows, JSON export/import, clear
  confirmation, and print behavior: PASS.
- Axe: zero violations across all sampled product states and routes.
- Privacy: 29/29 observed live requests were same-origin GETs with no body; no
  console/page errors or third-party runtime traffic.
- PWA: installability, offline reload, and waiting-worker update: PASS.
- Deployment identity: 29/29 deployable files match production by SHA-256.
- Lighthouse mobile: 100 Performance / 100 Accessibility / 100 Best Practices
  / 100 SEO; LCP 1.1 s, TBT 40 ms, CLS 0.005.

Detailed evidence and reproduction notes are in
`.factory/verification-10.md`; fresh artifacts are under
`.factory/evidence-10/live/`.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build

# Then run each exact command in .factory/claims.json.
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in .factory/evidence-10/live/url-smoke
```

## Known gaps

- No qualified teacher review or approved waiver exists.
- Legal-page footer versions are stale.
- Library/CLI, server rate limiting, backend concurrency, billing, sign-in, and
  AI checks do not apply to this static, account-free PWA.

No product code was modified during verification.
