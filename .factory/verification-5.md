# Independent verification 5 — FAIL

Verified 2026-08-29 UTC against candidate commit
`4585b5872982db89aad80b4719493daf6bf14dc8` and live URL
<https://arithmetic-steps.sociobot.in>. Artifact: local-first offline PWA.

## Decision

**FAIL — do not release.** The candidate is technically healthy and the live
deployment exactly matches it, but the researched brief has an unmet hard
constraint: teacher-reviewed pedagogy. `.factory/pedagogy-review.md` says no
named, qualified elementary teacher has reviewed the release and leaves every
required review-record field blank. Automated QA cannot truthfully substitute
for that external acceptance evidence.

No additional product defect was found.

## Mandatory first-read and demo gate — PASS

In a cold live Chromium visit at 1440 px, before scrolling:

- **What:** “Explore addition and subtraction steps”; children move counters
  to explain how an answer changes.
- **Who:** “For elementary children with a teacher or parent.”
- **First action:** visible **Try it with sample data** button.

The first action opened `/demo` in one click, displayed the persistent
“Demo — sample data, nothing is saved” banner, and loaded a part-complete
`52 − 18` route. This meets the plain-words and isolated-demo gate.

## Clean checkout and claims evidence — PASS

Started at the requested SHA with a clean worktree and ran `npm ci` (61
packages; `npm audit` reported 0 vulnerabilities). `.factory/claims.json`
exists with 20 declared claims. Every exact listed command
`npm test -- --grep @claim:<id>` completed successfully from the shipped
browser demo flow:

| Passing claim IDs |
| --- |
| `demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`, `visible-focus` |
| `tens-and-ones`, `direct-manipulation`, `narrated-steps`, `replay-and-discussion`, `free-no-account` |
| `arithmetic-bounds`, `keyboard-controls`, `unfinished-persistence`, `json-export`, `json-import` |
| `clear-data`, `print-card`, `reduced-motion`, `mobile-controls`, `no-game-mechanics` |

Additional clean checks:

| Command/check | Result |
| --- | --- |
| `npm test` | PASS — `tsc --noEmit`; 12 Vitest/static tests; 56 Playwright desktop/mobile tests. |
| `npm run build` | PASS — generated `dist/` and `arithmetic-steps-e639b0426049` with 24 precached URLs. |
| Initial application JS | PASS — 36,216 B raw / 10,582 B gzip, below 200 KB. |
| Initial CSS | PASS — 26,361 B raw / 6,178 B gzip, below 50 KB. |
| `/opt/fleet/lib/verify-url.sh` against live URL | PASS — HTTP 200; title, `lang=en`, exactly one h1, main landmark, alt text and labelled buttons; zero load errors. |

There is no separate ESLint or formatter command; the available type/lint
gate is `tsc --noEmit` within `npm test`.

## Independent live exercise — PASS

- Completed the sample `52 − 18 = 34`; the completed route exposed replay and
  the “What stayed the same?” discussion prompt.
- Exercised invalid `90 + 20`, decimal addition, zero-plus-zero, and
  subtraction below zero; the UI retained invalid input and presented the
  corresponding recovery error. Completed boundary `99 + 1 = 100`, exported
  its JSON, rejected malformed JSON import, and tested both keep/remove paths
  for saved problems.
- At exactly 390 CSS px, `scrollWidth` and `clientWidth` were both 390; all
  visible buttons, links, inputs and selects measured at least 44 px.
- Desktop landing/completion and mobile demo Axe scans had zero serious or
  critical violations. The claim suite independently covers keyboard-only
  controls, focus visibility, reduced motion, drag/touch controls, print,
  persistence, and mobile controls.
- The installed worker precached the shell. After a reload established its
  controller, offline reload of `/demo` returned HTTP 200 and retained
  `52 − 18`. The worker uses versioned caches, `SKIP_WAITING`, and the app
  presents an “An update is ready.” action on `updatefound`; no newer live
  build existed to exercise a real deployment update.

## Privacy, headers, and deployment identity — PASS

A fresh live browser context recorded 30 requests through landing, demo, and
completion. Every request was a same-origin GET to
`https://arithmetic-steps.sociobot.in`; there were no console errors, page
errors, frames, accounts, payments, analytics, or third-party runtime calls.
This supports the local-only/privacy claims.

Live responses provide same-origin CSP (including response-header
`frame-ancestors 'none'`), HSTS, `X-Frame-Options: DENY`, nosniff, strict
referrer policy, and permissions policy. HTML is short cached; hashed JS/CSS
are `public, max-age=31536000, immutable`; `sw.js` is no-store. Unknown
routes return styled HTTP 404.

Fresh local build and live SHA-256 values are identical:

| File | SHA-256 |
| --- | --- |
| `assets/main-DqGOVm7h.js` | `4f51acee345b727faaff7305de78c9c7f27aa1d20eb3037273417e88796a7e8c` |
| `assets/styles-XQdYYnna.js` | `5fd0d58911c8eba8e7fd6a6014b70f191bb093018fa4e93ce53c226d4d6dbcfd` |
| `assets/styles-C64zr1HK.css` | `f43754b1e663ecd1504f497270b773d88af338d4ec8e03ab3ae4fd1851fecf5a` |
| `sw.js` | `585ea488454e750239ca312ec96ba4e10a890e5fd4fbaaad97e0d5249e0e3e85` |

This is a static PWA with no backend/API, billing, identity, product-unlock,
library, or CLI surface. Therefore rate-limit/429, persistence-concurrency,
Entra identity, and clean-consumer package checks are not applicable.

## Defects by severity

### P0 — release blocker

1. **Teacher-reviewed pedagogy is not evidenced.** The brief requires
   teacher-reviewed pedagogy. `.factory/pedagogy-review.md` explicitly states
   that no named elementary teacher reviewed this release. A qualified
   elementary teacher must review the scoped addition/subtraction flows,
   direct drag and keyboard alternatives, narration, replay, and discussion
   card; record their name/qualification, date, grades/ages, findings,
   required changes, and follow-up decision. Then rerun independent
   verification.

### P1/P2

None found.
