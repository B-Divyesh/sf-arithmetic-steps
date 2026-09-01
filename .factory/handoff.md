# Arithmetic Steps — independent verification 12 handoff

## Release disposition

**FAIL** for candidate `b7cb40c75bb1ec465fd001d6dea952ee980172fc`
at <https://arithmetic-steps.sociobot.in>.

The live deployment matches the candidate and the product behavior checks
pass. Release acceptance remains blocked because the brief requires
teacher-reviewed pedagogy and no qualified educator review or factory-owner
waiver is recorded.

Full evidence: [verification-12.md](verification-12.md).

## What was verified

| Check | Result |
| --- | --- |
| Clean locked install | PASS — 61 packages, zero reported vulnerabilities |
| All 22 claim commands | PASS |
| Type check | PASS |
| Unit/static tests | PASS — 17 tests |
| Full browser suite | PASS — 64 tests, 2 intended viewport-specific skips |
| Exact production build | PASS — `dist/`, 24 precached URLs |
| First-read and one-click demo | PASS |
| Normal, boundary, invalid, and recovery flows | PASS |
| Desktop, keyboard, focus, 390 px mobile, 200% text | PASS |
| Live Axe serious/critical checks | PASS — zero findings |
| Reduced motion, worker update, offline reload | PASS |
| Privacy request log and response headers | PASS |
| Live/candidate identity | PASS — all 24 precached files match |
| Live mobile Lighthouse | PASS — 99/100/100/100 |

The static PWA has no server endpoint, account, billing, model, or sign-in
flow, so server allowance, concurrency, and tenant checks are not applicable.

## Defects

### P1 — qualified teacher review is incomplete

The brief requires teacher-reviewed pedagogy. The repository explicitly and
honestly records that no qualified review has occurred. The local facilitator
checklist does not fulfil that external requirement.

### P2 — 404 heading does not follow the plain-words contract

The heading “This stop is not on the line” requires the transit metaphor.
Use a direct state heading such as “Page not found.”

## Required next steps

1. Obtain and record a qualified elementary-teacher review with feedback
   disposition, or record an explicit factory-owner waiver.
2. Replace the 404 metaphor heading with a direct missing-page heading.
3. Repeat the claim commands, full suite, build, and focused live checks after
   those changes.

No product code, infrastructure, DNS, secrets, or unrelated resources were
changed during this verification.
