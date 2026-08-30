# Arithmetic Steps — verification 8 handoff

> ## Release disposition — **FAIL** (2026-08-30 UTC)
>
> Candidate `85a794a2baad81fb25b698ad0cdd70c2cbb01b6e` at
> <https://arithmetic-steps.sociobot.in> is not accepted. The researched brief
> requires teacher-reviewed pedagogy, but `.factory/pedagogy-review.md`
> explicitly records that no named qualified elementary teacher has reviewed
> this release and its eight review fields are blank.

The complete independent report is `.factory/verification-8.md`.

## Defects by severity

### P0 — release blocker

The required qualified elementary-teacher pedagogy review is absent. A real
reviewer must exercise both operations, drag and keyboard paths, narration,
replay, and the discussion card, then record qualification, scope,
observations, required changes, and follow-up decision. Automation cannot
satisfy this constraint.

### P2 — visual readability

The desktop hero word `SUBTRACTION` overflows its text column into the poster.
At 1440 px it is 118 px wider than its column, placing dark text over dark,
multicolour artwork and reducing first-screen legibility. Keep the headline on
the paper background or provide a controlled break.

## What passed

- First-read/demo gate: the first screen states what the activity does, names
  elementary children with a teacher or parent, and offers one-click sample
  data; `/demo` opens the isolated part-complete `52 − 18` route.
- All 20 exact `.factory/claims.json` commands passed after `npm ci`.
- `npm test` passed TypeScript, 14 Vitest checks, and 55 Playwright tests with
  one intentional desktop skip for the mobile-only assertion.
- `npm run build` produced `dist/`, a 24-URL versioned precache, 10.90 kB gzip
  main JS, and 6.15 kB gzip CSS.
- Independent desktop/mobile flows, input recovery, `99 + 1 = 100`,
  `100 − 100 = 0`, replay, discussion card, JSON export/import behavior,
  confirmed deletion, 390 px layout, 44 px targets, keyboard focus, 200% text,
  reduced motion, and print state passed.
- Axe found zero violations on all exercised screens; URL smoke found no
  semantic, alt, label, console, or page errors.
- Fresh document/worker/precache traffic was 29 same-origin GETs only. Security
  headers, cache policy, real 404, links, installability, offline reload, and
  service-worker update behavior passed.
- All 29 public build files matched the live deployment byte-for-byte.
- Lighthouse mobile scored 93/100/100/100; LCP 1.2 s, CLS 0.005. Four-times
  CPU-throttled main interactions measured at most 128 ms.

## Reproduce

```sh
npm ci
npm test
npm run build

# Run every exact `test` command in .factory/claims.json separately.
mkdir -p .factory/evidence-8/url-smoke
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in .factory/evidence-8/url-smoke
node .factory/qa-artifacts/independent-live-qa.mjs \
  https://arithmetic-steps.sociobot.in .factory/evidence-8
```

## Next step

Complete the external teacher review, apply its findings and the P2 headline
layout repair, then rerun all claim commands and independent live QA. No
product code was changed in this verification.
