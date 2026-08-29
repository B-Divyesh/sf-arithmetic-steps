# Independent verification 4 — FAIL

Verified: 2026-08-29 UTC  
Candidate commit: `d0cc4bc4b49097539ce8aa35b4ebd0e28a7caa9b`  
Live URL: <https://arithmetic-steps.sociobot.in>  
Artifact: local-first offline PWA

## Decision

**FAIL — do not release yet.** All executable product, deployment, privacy,
accessibility, PWA, and claims gates passed from this clean checkout, and the
live static artifacts match the candidate byte-for-byte. The researched brief
still requires teacher-reviewed pedagogy. Freshly read
`.factory/pedagogy-review.md` says, “No named elementary teacher has reviewed
this release in the repository.” That makes the brief's teacher-reviewed
pedagogy constraint unfulfilled. No software defect was found.

## Mandatory first-read gate — PASS

Cold live desktop visit, before scrolling:

- **What:** “Explore addition and subtraction steps”; children move counters
  to explain how an answer changes.
- **Who:** elementary children with a teacher or parent.
- **First click:** **Try it with sample data**.

That action is on the first screen and opens the isolated `/demo` route in one
click. The demo immediately shows the partly completed `52 − 18` sample and
its persistent “Demo — sample data, nothing is saved” banner, Reset demo, and
Start for real controls. The required plain-words/demo gate passes.

## Clean-checkout and claims evidence

Started at the requested SHA with a clean worktree, then ran `npm ci` (61
packages, 0 audit vulnerabilities). `.factory/claims.json` exists, contains
20 claims, and every declared command passed from the demo entry point:

| Claim IDs with passing exact `npm test -- --grep @claim:<id>` command |
| --- |
| `demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`, `visible-focus` |
| `tens-and-ones`, `direct-manipulation`, `narrated-steps`, `replay-and-discussion`, `free-no-account` |
| `arithmetic-bounds`, `keyboard-controls`, `unfinished-persistence`, `json-export`, `json-import` |
| `clear-data`, `print-card`, `reduced-motion`, `mobile-controls`, `no-game-mechanics` |

Additional clean gates:

| Check | Fresh result |
| --- | --- |
| `npm test` | PASS — `tsc --noEmit`; 11 Vitest/static tests; 56 Playwright tests across desktop and mobile |
| `npm run build` | PASS — generated `dist/` and worker cache `arithmetic-steps-e639b0426049` with 24 precached URLs |
| Initial application JS | PASS — 36,216 B raw / 10,570 B gzip (under 200 KB) |
| Initial CSS | PASS — 26,361 B raw / 6,148 B gzip (under 50 KB) |
| Claim/tag inventory | PASS — 20 declarations and exactly 20 `@claim:` tags; no missing declared tag |

There is no separate formatter or ESLint command; `tsc --noEmit` is the
repository's available type/lint gate.

## Independent live exercise — PASS

- Completed the one-click sample `52 − 18 = 34`, including its narrated trail,
  replay, and discussion card.
- Rejected `90 + 20` while retaining entered values, then rejected decimal
  input; the recovery flow remained usable.
- Confirmed offline reload of `/demo` after an installed controlling worker.
- Simulated a replacement worker with `/sw.js?independent-qa=1`: the update
  notice appeared, Update reloaded the app, the controller changed, and the
  demo route remained intact.
- At the Pixel 5 393-CSS-pixel viewport (also covering the requested 390 px
  intent), there was no horizontal overflow and no visible link/button/input/
  select below 44 px in the demo flow.
- Keyboard begins at the visible skip link. Its measured focus styling was a
  3 px brass outline plus ink ring; Enter moved focus to `main`.
- Playwright Axe found no serious or critical violations on the live landing
  and completed demo. No console or page errors were recorded in these flows.
- Crawled live landing links: `/demo`, `/privacy/`, `/terms/`, and Source all
  returned 200; internal hash links were valid anchors; an unknown path gave a
  styled HTTP 404.

## Privacy, response policy, identity, and deployment — PASS

A fresh browser-context request log beginning before cold navigation recorded
only same-origin GET traffic to `arithmetic-steps.sociobot.in`, including the
service worker's precache work. No account, payment, analytics, third-party
runtime origin, server-side product endpoint, or sign-in flow exists. Thus
API allowance/429/`Retry-After`, backend concurrency/health, Entra authority,
and library/CLI consumer checks are not applicable.

Live headers include CSP with `frame-ancestors 'none'`, HSTS,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer Policy,
and Permissions Policy. HTML is short cached (30 seconds), hashed assets are
`public, max-age=31536000, immutable`, and `sw.js` is non-cacheable.

The candidate's freshly built live-referenced files exactly matched the live
deployment by SHA-256:

| File | SHA-256 |
| --- | --- |
| `assets/main-DqGOVm7h.js` | `4f51acee345b727faaff7305de78c9c7f27aa1d20eb3037273417e88796a7e8c` |
| `assets/styles-XQdYYnna.js` | `5fd0d58911c8eba8e7fd6a6014b70f191bb093018fa4e93ce53c226d4d6dbcfd` |
| `assets/styles-C64zr1HK.css` | `f43754b1e663ecd1504f497270b773d88af338d4ec8e03ab3ae4fd1851fecf5a` |
| `sw.js` | `585ea488454e750239ca312ec96ba4e10a890e5fd4fbaaad97e0d5249e0e3e85` |

Live Lighthouse (mobile) was Performance **94**, Accessibility **100**, Best
Practices **100**, SEO **100**; LCP 1,193 ms, CLS 0.0049, TBT 296 ms, and
36,237 B transfer.

## Defects by severity

### P0 — release blocker

1. **Teacher-reviewed pedagogy is not evidenced.** The original researched
   brief explicitly requires teacher-reviewed pedagogy. The current
   `.factory/pedagogy-review.md` expressly records no named elementary teacher
   review and supplies an empty record template. A clean test suite cannot
   substitute for that human acceptance gate.

   Required resolution: have a qualified elementary teacher exercise addition,
   subtraction, direct dragging, keyboard alternatives, narration, replay, and
   the discussion card; record their name/qualification, date, grades,
   feedback, required changes, and follow-up decision in that file.

### P1/P2

None found in this verification.

## Handoff status

The deployed candidate is technically healthy and matches this commit, but it
is **not release-acceptable** until the P0 pedagogy review record is complete.
