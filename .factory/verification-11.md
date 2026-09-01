# Independent verification 11 — FAIL

- Candidate commit: `94ea6c6970d88e40c5a73a4b8f4b5f9f37c93f77`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-01 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P1 — qualified teacher review remains uncompleted

The supplied researched brief lists **Teacher-reviewed pedagogy** as a product
constraint. The candidate's own
`.factory/pedagogy-evidence.md` says that it has no completed qualified
educator review, reviewer identity or qualification, date, classroom
observation, feedback, or disposition. `.factory/facilitator-review.md` also
states that its local checklist is not an external review. The checklist is a
useful pre-classroom aid, but it does not fulfil the required teacher review.

Required resolution: obtain and record a qualified elementary-teacher review
covering the addition/subtraction flows and feedback disposition, or obtain an
explicit factory-owner waiver for this brief constraint. Until then this
candidate cannot be accepted.

## Mandatory first-read and demo gate — PASS

Cold, uncached load of the live root page returned 200 with no console or page
errors. The first screen says what it does, who it is for, and what to do:

- **What:** “Explore addition and subtraction steps.”
- **For whom:** elementary children with a teacher or parent.
- **First action:** the above-the-fold **Try it with sample data** action.

That action opened `/demo` in one click and showed the `52 − 18` sample plus
the persistent “Demo — sample data, nothing is saved” banner, **Reset demo**,
and **Start for real**.

## Claims gate — PASS

`.factory/claims.json` is present and declares 21 claims. After clean
`npm ci`, every literal `test` command in the manifest was run separately via
the product's normal demo/browser entry point. All exited 0 (desktop and mobile
projects where applicable):

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `installable-pwa` | PASS |
| `visible-focus` | PASS |
| `tens-and-ones` | PASS |
| `direct-manipulation` | PASS |
| `narrated-steps` | PASS |
| `replay-and-discussion` | PASS |
| `free-no-account` | PASS |
| `arithmetic-bounds` | PASS |
| `keyboard-controls` | PASS |
| `unfinished-persistence` | PASS |
| `json-export` | PASS |
| `json-import` | PASS |
| `clear-data` | PASS |
| `print-card` | PASS |
| `reduced-motion` | PASS |
| `mobile-controls` | PASS |
| `facilitator-review` | PASS |
| `no-game-mechanics` | PASS |

## Clean candidate gates — PASS

- `npm ci`: PASS — locked install completed, zero reported vulnerabilities.
- `npm run lint`: PASS.
- `npm run test:unit`: PASS — 17 tests.
- `npm test`: PASS — 17 unit/static tests and 60 Playwright tests passed; two
  intentionally project-specific skips.
- `npm run build`: PASS — produced `dist/`.
- Initial JavaScript: 40,938 bytes raw / 12,243 bytes gzip across app and
  version modules, below the 200 KB budget. CSS: 28,215 bytes raw / 6,425
  bytes gzip, below the 50 KB budget.

## Independent live QA — PASS

- Completed the normal `8 + 7` route: moving 2 produced `10 + 5` and its
  plain-language narration; completion gave 15 and replay returned that step.
- Checked invalid `90 + 20`: its clear error remained visible and both values
  stayed in their inputs for correction.
- The full candidate browser suite additionally covered subtraction, invalid
  decimals/blanks/below-zero values, keyboard alternative controls, direct
  drag/touch controls, persistence, export/import, clear confirmation, print,
  and reduced-motion replay.
- At 390px, `scrollWidth === clientWidth === 390`; all demo controls were at
  least 44px. The operation choices have 163×64px labels. Desktop and mobile
  visual checks showed no clipped content.
- Keyboard smoke: Tab reached the skip link, whose computed focus treatment is
  a 3px brass outline with 3px offset and dark ink ring; Enter moved focus to
  main.
- Playwright axe checks on live demo and completed screens found zero
  serious/critical findings. The candidate suite's axe checks passed for
  landing, demo, completion, Privacy, and Terms.

## Privacy, PWA, deployment, and headers — PASS

- A fresh, live end-to-end browser flow observed 106 requests. Every request
  was a same-origin GET; 80 were worker-originated. There were no frames,
  console errors, page errors, account controls, payment controls, or external
  runtime requests.
- Live root response has self-only CSP (including `frame-ancestors 'none'`),
  HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, DENY frame
  protection, and a restrictive Permissions Policy. HTML revalidates at 30s;
  hashed assets have one-year immutable caching; manifest is no-cache; and
  `sw.js` is no-store.
- Internal `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, manifest, worker,
  robots, and sitemap routes returned 200. An unknown route returned 404.
- Live and candidate SHA-256 values match for `index.html`, main JS, version
  JS, CSS, manifest, and service worker.
- The live worker controlled `/demo`; an update registration showed “An update
  is ready,” applied successfully, and retained the demo. After first visit,
  offline reload retained `/demo`, `52 − 18`, the demo banner, and the offline
  notice.
- No server-side product endpoint, account flow, billing/product-unlock call,
  model call, or authentication flow exists, so allowance/429, concurrency,
  and Entra checks are not applicable.

## Performance

Fresh live Lighthouse mobile result: Performance **99**, Accessibility
**100**; FCP 0.9s, LCP 1.1s, CLS 0.005, TBT 150ms.

## Defects by severity

| Severity | Finding |
| --- | --- |
| P1 | Qualified teacher-reviewed pedagogy requirement is not fulfilled. |
| P2 | None found. |
| P3 | None found. |

## Evidence and scope

Temporary command logs and screenshots were retained under `/tmp` during this
verification, including the live cold desktop and 390px captures and
`arithmetic-steps-lighthouse-live.json`. This report changes documentation
only; no product code was modified.
