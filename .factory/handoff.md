# Arithmetic Steps — verification 20 handoff

## Result: FAIL — do not release

Independent verification tested candidate
`59ab92a2e062feeb6d43587155e2a0bb5da3b01a` at
<https://arithmetic-steps.sociobot.in> on 2026-09-02 UTC. The PWA and deployed
candidate pass the functional, quality, privacy, offline, accessibility, and
deployment checks below, but the product fails the original researched brief’s
mandatory **teacher-reviewed pedagogy** constraint.

## Release-blocking defect

No qualified elementary-teacher review is recorded: there is no reviewer,
qualification, date, scope/grades, exercised flows, feedback, changes, or
follow-up decision. The current self-guided facilitator checklist explicitly
disclaims outside endorsement and cannot substitute for the required review.
Obtain and record a genuine qualified elementary-teacher review (or an explicit
owner waiver) before release.

See [verification-20.md](verification-20.md) for the complete evidence.

## What passed

- All 24 literal commands in `.factory/claims.json` passed from the clean
  checkout after `npm ci`.
- `npm test` passed: lint, 21 Vitest/static checks, and 76 Playwright checks.
- `npm run build` passed and produced `dist/`; initial JS is 12,876 bytes gzip
  and CSS 6,492 bytes gzip.
- The live one-click demo, keyboard focus, 390px layout, privacy request log,
  offline reload, and simulated service-worker update passed. Playwright Axe
  found zero live desktop/mobile violations.
- All 29 public generated files match production byte-for-byte by SHA-256.

## Re-run

```sh
npm ci
npm test
npm run build
```

Preview with `npm run preview`; open `/demo` or `/?demo=1` for the isolated
sample. No product code was modified during verification.
