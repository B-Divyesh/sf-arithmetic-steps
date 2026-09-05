# Verify addition and subtraction reasoning — independent verification 21

## Verdict: FAIL — do not release

- Finding count: **1**
- Untested claim count: **0**
- Implementation reviewed: `59ab92a2e062feeb6d43587155e2a0bb5da3b01a`
- Documentation and test SHA reviewed: `dc9759047c28966fe0ad3370e0c0c32d558c80b3`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-05 UTC

The shipped PWA passed the functional, claims, accessibility, privacy,
offline, performance, and deployment checks below. Release still fails the
researched brief because the required qualified elementary-teacher review has
not happened and no explicit owner waiver is recorded.

## Finding

### P1 — the required qualified elementary-teacher review is still pending

The brief requires **teacher-reviewed pedagogy**. The current
`.factory/pedagogy-review.md` is an honest pending template. It contains no
reviewer name or elementary-teaching qualification, review date, grades or
ages, exercised addition and subtraction flows, observations, requested
changes, changes made, or final decision.

The self-guided facilitator checklist works and is accurately described as
guidance. Automated checks prove its observable behavior, but neither can
replace a qualified teacher's judgement. This is one release-blocking finding.

Required resolution: have a qualified elementary teacher review addition and
subtraction, direct dragging, labelled keyboard controls, narration, replay,
and the discussion card. Record their qualification, date, learner range,
feedback, required changes, completed changes, and final decision. An explicit
owner waiver of this brief constraint is the only alternative.

## First screen and sample

Fresh desktop and 390 px phone contexts answered the required questions before
scrolling:

- Job: **Explore addition and subtraction steps**.
- Audience: elementary children with a teacher or parent.
- First action: **Try it with sample data**.

The action opened `/demo` in one click. It showed the part-complete `52 − 18`
problem at `42 − 8`, the persistent **Demo — sample data, nothing is saved**
label, **Reset demo**, and **Start for real**. Completing the supplied last
chunk produced 34, accurate narration, replay controls, and a populated
discussion card.

A fresh live isolation probe placed sentinels in the real IndexedDB and local
storage namespaces. Changing and resetting the demo restored the supplied
route while both real sentinels remained unchanged. Leaving demo mode cleared
the demo state. The `/demo` and `/?demo=1` entry points both passed.

## Declared claims

After `npm ci`, every literal command in `.factory/claims.json` was run
separately from this clean checkout. All 24 passed; no claim was left untested.

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
| `completed-persistence` | PASS |
| `json-export` | PASS |
| `json-import` | PASS |
| `clear-data` | PASS |
| `print-card` | PASS |
| `reduced-motion` | PASS |
| `mobile-controls` | PASS |
| `facilitator-checklist` | PASS |
| `self-guided-checklist-guidance` | PASS |
| `no-game-mechanics` | PASS |
| `no-ai-grading` | PASS |

The live landing page, README, legal pages, and 404 copy were cross-checked
against the inventory. No false, incomplete, missing, or unlisted public claim
was found. Each claim ID appears exactly once in the browser suite.

## Clean-checkout quality gates

- `npm ci`: PASS; 61 packages installed and npm reported 0 vulnerabilities.
- `npm test`: PASS in an uncontended run; TypeScript passed, 21 Vitest/static
  checks passed, and 73 applicable Playwright checks passed with 3 intentional
  viewport skips.
- `npm run build`: PASS; `dist/` and a 24-URL service worker were produced.
- Initial main JavaScript: 44,448 bytes raw / 12.93 kB gzip.
- CSS: 28,534 bytes raw / 6.47 kB gzip.

One verifier-created run was invalid because a second full suite was started
while the first still owned the shared preview port. When the first runner
exited, the second runner received `ERR_CONNECTION_REFUSED`. No assertion
failed. After confirming no runner remained, the single uncontended command
above passed completely. This was QA orchestration, not a product failure.

## Live functional checks

- Normal paths: completed the sample subtraction and a `99 + 1 = 100`
  addition; replay, discussion prompts, save, JSON export, malformed-import
  error, clear cancellation, and confirmed clear all worked.
- Invalid and recovery paths: rejected sum over 100, decimal input, zero-total
  input, subtraction below zero, and each blank operand. Values remained for
  correction and blank fields received focus.
- Boundaries: `99 + 1 = 100` and `100 − 100 = 0` completed. The final
  subtraction narration says nothing remains; it does not say zero is waiting.
- Persistence: unfinished and completed checkpoint races passed. A completed
  problem remained visible after immediate Saved problems navigation while an
  IndexedDB write was held open.
- Input: direct counter and ten-frame dragging passed on desktop and touch;
  labelled keyboard controls produced the same moves.
- Print and transfer: print media isolated the complete discussion card; JSON
  export contained the ordered route and valid import restored it.
- Recovery states: empty Saved problems, malformed import, offline notice,
  invalid forms, update toast, and the missing-page route all provided a next
  action.

## Accessibility, mobile, and performance

- The factory URL check passed: HTTPS 200, descriptive title, `lang=en`, one
  h1, one main landmark, complete image alt coverage, named buttons, and no
  console errors.
- Playwright Axe found zero violations on landing, demo, completion, empty
  Saved problems, phone demo, Privacy, Terms, and the HTTP 404 page.
- The first Tab focused the skip link. Its focus style was a 3 px brass outline
  with a 3 px offset, and Enter moved focus to `main`.
- At exactly 390 px, `scrollWidth === clientWidth === 390`; no checked visible
  control was below 44 by 44 CSS px. At 200% text size, the first action stayed
  visible and the page still had no horizontal overflow.
- Reduced motion changed animation duration to `0.01ms`, used automatic rather
  than smooth scrolling, and advanced replay one step per activation.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 908 ms, LCP 983 ms, TBT 0 ms, CLS 0, transfer 38,984 bytes.

## Privacy, PWA, routes, and deployment

- Fresh live traffic was same-origin GET-only traffic. No third-party runtime
  origin, failed request, console error, page error, frame, account field,
  payment path, or model request appeared.
- The service worker activated and controlled `/demo`; its cache was
  `arithmetic-steps-31d19a9daebd`. It does not precache deployment metadata.
  Offline reload returned 200 and kept the sample available.
- A fresh waiting-worker simulation showed **An update is ready**. Applying it
  changed the controller to `/sw.js?verification-update=21`, reloaded cleanly,
  and retained the sample and demo label.
- `/`, `/practice`, `/demo`, `/?demo=1`, `/saved-problems`, `/privacy/`, and
  `/terms/` returned 200 with route titles, one h1, and one main landmark. All
  nine crawled landing links resolved. The deliberate unknown route returned a
  designed HTTP 404 with **Page not found** and a return action.
- Live responses send a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and restrictive
  permissions policy. Hashed assets are one-year immutable; the worker is
  no-cache/no-store.
- A fresh production build matched all 29 public live files byte-for-byte.
  `staticwebapp.config.json` is deployment metadata and was correctly excluded.
  Therefore the reviewed implementation is `59ab92a`; commits `03395c7` and
  `dc97590` only changed documentation, tests, and verification material.

## Earlier finding disposition

| Earlier finding | Current evidence |
| --- | --- |
| Missing claims inventory and one-click isolated sample | Closed: 24 exact commands passed; both demo URLs, reset, deletion, and real-data sentinels passed. |
| Broken offline worker caused by deployment config in precache | Closed: controlling worker, clean precache, offline 200 reload, and live update passed. |
| Missing security/cache headers, metadata, and real 404 | Closed: live headers, route metadata, links, 404 status, shared shell, and visual inspection passed. |
| Mobile quick choices below 44 px and nested complementary landmark | Closed: exact-390 target scan and zero-violation Axe scans passed. |
| No direct drag or ten-frame manipulation | Closed: desktop mouse and mobile touch drag claims passed with keyboard alternatives. |
| Metaphor headings and README copy length/jargon | Closed: current plain task headings and copy audit have no flagged sentence or banned term. |
| Flaky full suite and standalone demo schema race | Closed: all 24 standalone commands and the uncontended 76-case suite completed; schema setup is deterministic. |
| Desktop hero overlap and phone headline word split | Closed: desktop/390 regressions passed and fresh screenshots show intact words and layout. |
| Blank operand became zero and subtraction error contradicted equality | Closed: blank focus/recovery and greater-than wording passed; `100 − 100` passed live. |
| Stale legal/404 build identifier | Closed: app, legal, manifest, and 404 identity regression passed; live shows Build 1.0.16. |
| Saved problems hash route, stale title, missing focus/announcement | Closed: real URLs, titles, focused h1, announcement, back navigation, and phone Practice link passed. |
| Completion could disappear during delayed persistence | Closed: synchronous checkpoint race passed live and in both local projects. |
| Final subtraction sentence said zero remained | Closed: demo and `100 − 100` now end with accurate wording in trail, replay, and discussion output. |
| README AI-grading statement and footer provenance were unlisted | Closed: `no-ai-grading` passed; public provenance text remains removed. |
| Qualified elementary-teacher review | **Open: this report's sole finding.** |

## Applicability and evidence

This is a static local-first PWA. It has no product backend, tenant, health
endpoint, authentication, billing, unlock API, or server-side persistence.
Backend restart, tenant-isolation, and 429/`Retry-After` checks do not apply.
It is not a CLI, library, or desktop installer. The brief does not imply a
useful AI feature, so no missed-AI-leverage finding applies.

Raw evidence is in `.factory/evidence-verification-21/`, including the browser
summary, desktop and phone screenshots, 404 screenshot, factory URL check, and
Lighthouse JSON.

## Conclusion

**FAIL — do not release.** There is exactly one finding and zero untested
claims. The software and live deployment passed, but the required qualified
elementary-teacher review or explicit owner waiver is still absent.
