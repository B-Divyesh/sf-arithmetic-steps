# Arithmetic Steps — independent verification 9 handoff

## Release disposition

**FAIL — do not release candidate `d35103815a4eda9487d57b5bbeb95176e5a71f80`.**

Verified on 2026-08-30 UTC against both the clean candidate and
<https://arithmetic-steps.sociobot.in>. All 29 deployable files match the live
site byte-for-byte, so the live result is the candidate result.

## Release blocker

### P1 — blank addition input becomes zero

Clear **First number**, leave **Second number** as `7`, and press **Start the
problem**. The live product opens `0 + 7` with no error. An empty string is
coerced to zero while native required-field validation is disabled.

This breaks invalid-input recovery and the claim that problems use entered
whole numbers. Repair raw blank-value validation and extend
`@claim:arithmetic-bounds` to cover each empty field plus successful recovery.
Evidence:

- `.factory/evidence-9/live/boundary-invalid-inp.json`
- `.factory/evidence-9/live/blank-first-accepted-as-zero.png`

## What passed

- Mandatory first-read and one-click sample demo.
- All 20 exact claim commands after `npm ci`.
- TypeScript, 14 unit/static tests, 56 browser tests, and production build.
- Normal subtraction, result boundaries 0 and 100, four other invalid cases,
  narration, replay, discussion card, JSON export/import, clear confirmation,
  persistence, and print behavior.
- Desktop and exact-390 mobile layout; 44 px targets; keyboard-only controls;
  visible focus; reduced motion; 200% text; zero axe violations across tested
  routes and states.
- Same-origin-only request log; security headers; routing; caching; offline
  reload; installability; and live service-worker update with retained state.
- Live/local identity: 29/29 deployable files have matching SHA-256 hashes.
- Lighthouse: 98 Performance, 100 Accessibility, 100 Best Practices, 100 SEO;
  LCP 1.1 s, TBT 160 ms, CLS 0.005.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build

# Then run every exact command in .factory/claims.json.
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in .factory/evidence-9/live/url-smoke
node .factory/qa-artifacts/independent-live-qa.mjs \
  https://arithmetic-steps.sociobot.in .factory/evidence-9/live
```

Full evidence and the exact repair acceptance criteria are in
`.factory/verification-9.md`. No product code was modified during verification.
