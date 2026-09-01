# Arithmetic Steps — verification 14 handoff

## Release disposition: FAIL

Candidate `cbcf6da1a60584414944f377a8a8fcbf0d8b9f59` was independently verified
against <https://arithmetic-steps.sociobot.in> on 2026-09-01 UTC.

All executable quality gates passed: clean install, all 22 exact claims,
unfiltered `npm test`, production build, live PWA/offline/update flows,
accessibility, privacy request logging, response headers, mobile layout,
bundle budgets, and a 24-file candidate-to-live SHA-256 comparison. Live
Lighthouse scored 100 in Performance, Accessibility, Best Practices, and SEO.

The release is nevertheless **not accepted**. The original researched brief
requires teacher-reviewed pedagogy. The candidate removes that requirement from
its local brief and provides only an optional self-guided facilitator checklist;
it contains no evidence of review by a qualified elementary teacher. This is a
P0 acceptance-contract failure, not a defect automated tests can resolve.

See `.factory/verification-14.md` for exact commands, results, and required
resolution. No product code was modified during verification.
