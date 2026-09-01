# Independent verification 12 — FAIL

- Candidate commit: `b7cb40c75bb1ec465fd001d6dea952ee980172fc`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-01 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P1 — qualified teacher review is not complete

The researched brief requires **Teacher-reviewed pedagogy**. The candidate's
`.factory/pedagogy-evidence.md` states that no qualified educator review has
occurred. There is no reviewer identity, qualification, review date, classroom
observation, feedback record, or disposition. The local facilitator checklist
is useful, but its own documentation correctly says it is not an external
review or evidence of learning outcomes.

Required resolution: obtain and record a qualified elementary-teacher review
of the addition and subtraction flows, including the feedback disposition, or
record an explicit factory-owner waiver for this brief constraint.

## Mandatory first-read and demo gate — PASS

A cold live visit returned 200 with no console or page errors. The first screen
answers the three required questions in plain words:

- **What it does:** “Explore addition and subtraction steps.”
- **Who it is for:** elementary children working with a teacher or parent.
- **What to click first:** **Try it with sample data**.

That action opened `/demo` in one click and showed the part-complete `52 − 18`
sample. The persistent banner said “Demo — sample data, nothing is saved” and
provided **Reset demo** and **Start for real**.

## Claims gate — PASS

`.factory/claims.json` is present with 22 entries. After `npm ci`, every literal
`test` command was run separately through the product's demo/browser entry
point. All 22 commands exited 0. Every claim has one executable tagged browser
test.

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
| `educator-review-boundary` | PASS |
| `no-game-mechanics` | PASS |

The mobile-controls command produced one pass in its intended mobile project
and one intended desktop-project skip. No unlisted product claim was found on
the landing page or in the README.

## Clean candidate gates — PASS

- `npm ci`: PASS — 61 packages installed; zero reported vulnerabilities.
- `npm run lint`: PASS — TypeScript no-emit check.
- `npm run test:unit`: PASS — 17 tests.
- `npm test`: PASS — 17 unit/static tests and 64 Playwright tests; two
  intended viewport-specific skips.
- `npm run build`: PASS — exact production build created `dist/` and a worker
  with 24 precached URLs.
- Initial JavaScript: 41,234 bytes raw, about 12.4 KB gzip. CSS: 28,215 bytes
  raw, 6.43 KB gzip. No web fonts ship. The mobile hero AVIF is 16,183 bytes.

## Independent live product QA — PASS

- Completed the supplied `52 − 18` route from `42 − 8` to 34. Completion
  showed the full reasoning route and the discussion card.
- Entered invalid `90 + 20`; the page explained the 100 limit and retained the
  values. Correcting the inputs to `8 + 7` opened the valid problem.
- The candidate suite separately completed `8 + 7`, a child-chosen multi-step
  subtraction route, direct pointer moves, keyboard moves, save/reload,
  import/export, clear confirmation, print, and recovery from every documented
  invalid-input boundary.
- All discovered links returned 200, including the repository link. Both
  slash forms of Privacy and Terms returned 200. An unknown route returned
  404.
- The factory URL smoke script returned 200, one `<h1>`, one `<main>`, `lang`
  and title values, complete image alt text, labelled buttons, and no browser
  errors.

## Accessibility and responsive checks — PASS with one copy finding

- Live Axe checks found zero serious or critical findings on the landing,
  demo, completed route, 390 px landing, Privacy, Terms, and 404 pages.
- Keyboard-only use reached the visible skip link first. Its computed focus
  treatment was a 3 px solid brass outline with 3 px offset. Enter moved focus
  to `main`, and keyboard controls moved the addition route to `10 + 5`.
- At exactly 390 CSS px, both landing and demo had
  `scrollWidth === clientWidth === 390`; no visible link, button, text input,
  or select measured below 44 px in either state.
- At 200% text size, the 390 px landing page remained 390 px wide and retained
  a visible heading and demo action.
- Reduced-motion replay advanced one step and kept the manual play control.
- Visual review of desktop and mobile captures found no clipped or overlapping
  product controls.

### P2 — the 404 heading is not plain-language copy

The 404 title is clear, but its `<h1>` says “This stop is not on the line.” The
plain-words contract says headings must name the section or state without
requiring a metaphor. Change the heading to a direct missing-page description,
such as “Page not found.”

## Privacy, deployment identity, and response policy — PASS

- A fresh live landing-to-demo-to-completion flow recorded 30 requests,
  including 25 worker requests. Every request was a same-origin GET with no
  request body. The page created no child-identity field or frame. No analytics,
  remote font, third-party script, or other external runtime request appeared.
- Root headers include a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict referrer
  policy, and the documented restrictive Permissions Policy.
- HTML revalidates after 30 seconds. Hashed assets have one-year immutable
  caching. The manifest is `no-cache`; `sw.js` is `no-cache, no-store`.
- SHA-256 values matched between the production build and live deployment for
  every one of the worker's 24 precached files. The live build is the tested
  candidate, and there is no current deployment-only failure.
- This static PWA has no product API, account, billing, product-unlock, model,
  or sign-in path. Request-allowance, 429, concurrency, persistence-service,
  and tenant-authority checks are therefore not applicable.

## PWA and performance — PASS

- The live worker controlled `/demo`. A waiting update displayed its notice,
  applied after **Update**, and retained the `52 − 18` demo and sandbox banner.
- After the first visit, an offline reload retained `/demo`, the sample, and
  the offline notice.
- Fresh live mobile Lighthouse: Performance **99**, Accessibility **100**,
  Best Practices **100**, SEO **100**; FCP 0.8 s, LCP 1.1 s, CLS 0.005, TBT
  100 ms, Speed Index 1.6 s. INP was not measured in this navigation audit.

## Defects by severity

| Severity | Finding |
| --- | --- |
| P1 | The qualified teacher-review requirement remains incomplete. |
| P2 | The 404 heading uses a transit metaphor instead of naming the missing-page state plainly. |
| P3 | None found. |

## Scope and evidence

This verification changed documentation only; no product code was modified.
Fresh evidence included independent claim runs, full candidate gates, live
desktop and 390 px captures, browser request and error logs, response-header
checks, a complete precache-file hash comparison, the factory URL smoke, and a
fresh Lighthouse report.
