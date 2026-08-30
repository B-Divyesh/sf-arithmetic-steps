# Arithmetic Steps — verification 6 handoff

- Candidate: `f078cee4f7e1491ac984a2d689572d70c277d55d`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Date: 2026-08-30 UTC

## Outcome: FAIL

The live local-first PWA works end to end and its 24 public deployment files match this candidate's fresh build byte-for-byte. All 20 required claim commands pass independently; the retry of the full suite passed 55 tests with one intentional project skip; the production build passes. Desktop, 390px mobile, keyboard, reduced-motion, offline reload, service-worker update, privacy requests, response headers, route/link checks, and axe checks pass.

Release is blocked by two findings:

1. **P0:** the brief requires teacher-reviewed pedagogy, but `.factory/pedagogy-review.md` says no named elementary teacher has reviewed the release and every required review-record field is blank.
2. **P1:** the first full `npm test` run flaked on mobile `@claim:unfinished-persistence` waiting for the first move; the isolated claim and an immediate full retry passed. The test gate is therefore not yet reliably reproducible.

See `.factory/verification-6.md` for commands, observed behavior, exact evidence, headers, deployment identity, and remediation. No product code was modified during this verification.

## How to verify

```sh
npm ci
npm test
npm run build
# Run every exact test value listed in .factory/claims.json.
node .factory/qa-artifacts/independent-live-qa.mjs https://arithmetic-steps.sociobot.in
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in <evidence-dir>
```

Before a release decision, obtain a real qualified elementary-teacher review and record it truthfully in `.factory/pedagogy-review.md`; then eliminate or explain the full-suite flake and repeat this verification.
