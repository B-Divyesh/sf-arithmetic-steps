# Independent verification 3 — FAIL

Verified: 2026-08-29 UTC

Candidate: `d0cfa7448b6fbd5f3ef81fede8bc6e0a2360c8dc`

Live URL: <https://arithmetic-steps.sociobot.in>

Artifact: static local-first PWA

## Decision

**FAIL — do not release.** The earlier deployment-only offline failure is
fixed: the live worker activates, controls the page, updates, and reloads the
demo offline on desktop and 390 px mobile. The deployed runtime is
byte-identical to this candidate's production build.

Release is still blocked by the claims contract and the researched brief. The
README makes product promises with no matching entry in
`.factory/claims.json`, and some registered tests do not prove the full claim
they are assigned. The repository also explicitly records that the required
named elementary-teacher review has not happened.

## Mandatory first-read gate

**PASS.** In fresh desktop and 390 px browser contexts, before scrolling:

- What it does: “Explore addition and subtraction steps,” supported by “move
  counters to explain how each answer changes.”
- For whom: elementary children working with a teacher or parent.
- First action: **Try it with sample data**.

The action is visible in the initial viewport and opens `/demo` in one click.
The first demo screen is already a part-complete `52 − 18` route at `42 − 8`,
with a persistent “Demo — sample data, nothing is saved” banner, **Reset
demo**, and **Start for real**.

Evidence:

- `.factory/qa-artifacts/live/first-read-desktop.png`
- `.factory/qa-artifacts/live/first-read-mobile-390.png`
- `.factory/qa-artifacts/live-desktop-complete.png`

## Declared claim tests

The first invocation, before dependency installation, stopped at
`tsc: not found`; no claim assertion ran. After the clean-checkout prerequisite
`npm ci`, every exact command from `.factory/claims.json` passed. Each ID
appears exactly once as an `@claim:<id>` tag, and there are no undeclared tags.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — desktop and mobile |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — Chromium; mobile intentionally skipped by the suite |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — desktop and mobile |
| `tens-and-ones` | `npm test -- --grep @claim:tens-and-ones` | PASS — desktop and mobile |
| `narrated-steps` | `npm test -- --grep @claim:narrated-steps` | PASS — desktop and mobile |
| `replay-and-discussion` | `npm test -- --grep @claim:replay-and-discussion` | PASS — desktop and mobile |
| `free-no-account` | `npm test -- --grep @claim:free-no-account` | PASS — desktop and mobile |
| `arithmetic-bounds` | `npm test -- --grep @claim:arithmetic-bounds` | PASS — desktop and mobile |
| `keyboard-controls` | `npm test -- --grep @claim:keyboard-controls` | PASS — desktop and mobile |
| `unfinished-persistence` | `npm test -- --grep @claim:unfinished-persistence` | PASS — desktop and mobile |
| `json-export` | `npm test -- --grep @claim:json-export` | PASS — desktop and mobile |
| `json-import` | `npm test -- --grep @claim:json-import` | PASS — desktop and mobile |
| `print-card` | `npm test -- --grep @claim:print-card` | PASS — desktop and mobile |
| `reduced-motion` | `npm test -- --grep @claim:reduced-motion` | PASS — desktop and mobile |
| `mobile-controls` | `npm test -- --grep @claim:mobile-controls` | PASS — mobile; desktop intentionally skipped |
| `no-game-mechanics` | `npm test -- --grep @claim:no-game-mechanics` | PASS — desktop and mobile |

Logs are under `.factory/qa-artifacts/claims/` in the verification workspace.

### Claims cross-check — FAIL

The passing commands do not complete the claims contract:

1. README line 29 promises an **installable PWA**, but there is no
   `installable-pwa` (or equivalent) claim entry and no tagged installability
   test. Independent CDP inspection found no live manifest/installability
   errors, but an independent check does not replace the required claim entry.
2. README line 30 promises **focus states** and **print styles**. The
   `keyboard-controls` test operates focused controls but never asserts a
   visible focus indicator. The `print-card` test replaces `window.print` and
   checks only that it was called; it does not inspect print media output or
   prove that the discussion card is print-ready.
3. README line 28 promises **explicit clear controls**, and the Privacy page
   tells users that Saved routes can clear all route data. No claim entry or
   tagged test covers cancellation and deletion. Independent live QA found
   both paths working, but the public promise remains unregistered.
4. The `local-only` tagged test attaches `page.on("request")` only after the
   `beforeEach` landing navigation and records page requests, not the full
   browser-context service-worker precache. It therefore cannot prove its
   whole-runtime “no third-party requests” wording. Independent context-level
   live capture observed 30 requests, including 25 worker requests, all
   same-origin, with zero failures.

Under the supplied claims contract, an unlisted public claim fails review even
when independent QA observes the current implementation working.

## Defects

### P0 — release blocker

1. **The claims inventory and tagged tests do not cover all public promises.**
   Add exact claims/tests for PWA installability, visible focus, print-media
   output, and clear-data behavior; make the privacy request test start before
   cold navigation and observe browser-context/service-worker requests.

### P1 — acceptance blockers

1. **Required teacher review is absent.** `.factory/pedagogy-review.md` says no
   named elementary teacher has reviewed the release. The researched brief
   makes teacher-reviewed pedagogy a constraint. Record the reviewer, date,
   scope, feedback, and resulting changes before release.
2. **The core manipulation differs from the supplied researched brief.** The
   work order asks children to drag counters/ten-frames while retaining a
   non-drag alternative. The shipped activity has only steppers, quick-choice
   buttons, and a numeric field; it contains no drag/drop interaction. Its
   quantity view renders ten-bars and one-counters rather than an interactive
   ten-frame. Either implement the direct manipulation plus keyboard path or
   obtain an explicit scope change and document it.

### P2 — language contract

1. **Several headings use the transit metaphor instead of naming the task in
   plain words.** Examples include “Choose a journey,” “A thought becomes a
   route,” “You arrived at …,” and “Talk at the station.” The mandatory first
   screen is clear, but these later labels conflict with the supplied
   plain-words rule against metaphor/brand-lore copy.

## Clean-checkout gates

| Check | Result |
| --- | --- |
| Candidate identity | PASS — exact requested SHA; worktree was clean before QA artifacts |
| `npm ci` | PASS — 61 packages; 0 vulnerabilities |
| `npm run lint` | PASS — `tsc --noEmit` |
| `npm test` | PASS — 11 Vitest/static tests; 43 Playwright passed, 3 intentional device skips |
| `npm run build` | PASS — exact Vite build and service-worker generation produced `dist/` |
| Initial JS | PASS — 32,941 B raw / 9,740 B gzip |
| Initial CSS | PASS — 24,596 B raw / 5,742 B gzip |

There is no separate formatter or ESLint command. The repository's `lint`
script is the available type/lint gate.

## Independent live exercise

- Completed the one-click `52 − 18` sample to 34, stepped backward through its
  narration, and verified the discussion prompts.
- Completed `99 + 1 = 100`, `100 + 0 = 100`, and `100 − 100 = 0`.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, and `5 − 6` with specific errors;
  the form retained values and accepted a later valid problem.
- Preserved `38 + 27` at `48 + 17` across reload.
- Invoked print, exported a valid JSON route, rejected malformed JSON with an
  announced error, then imported a valid `8 + 7 = 15` route.
- Cancelled and confirmed saved-route deletion in the full live exercise.
- Confirmed demo reset and normal-home exit delete only
  `demo:arithmetic-steps`; a sentinel in `arithmetic-steps` remained
  `preserved`.
- All rendered links returned 2xx/3xx. `/demo`, `/privacy/`, and `/terms/`
  return 200; an unknown route returns a styled HTTP 404.
- No console errors, page errors, failed requests, horizontal overflow, or
  controls below 44 px were observed in the tested desktop/390 px flows.

## Accessibility and performance

- The supplied `verify-url.sh` passed: title, `lang=en`, one `<h1>`, `<main>`,
  image alt text, labelled buttons, and zero browser errors. Evidence:
  `.factory/qa-artifacts/verification-3-live/verify.json`.
- Axe reported zero violations (not merely zero serious/critical findings) on
  landing, demo, completion, empty Saved routes, Privacy, Terms, and 404.
- Keyboard navigation begins at the skip link and moves focus to `<main>`.
  Sample controls work with Enter/Space. Focus measured a 3 px brass outline
  with 3 px offset. No trap was observed.
- Reduced motion makes replay advance one station per activation; computed
  animation duration was `0.01 ms` and scroll behavior was immediate.
- Visible heading outlines have no skipped levels. A 200% zoom smoke test had
  no horizontal overflow on landing or demo and kept the primary action and
  demo banner available.
- Lighthouse 13.4.1 mobile: Performance **0.99**, Accessibility **1.00**, Best
  Practices **1.00**, SEO **1.00**; FCP 1,009 ms, LCP 1,038 ms, TBT 113 ms,
  CLS 0.0049, total transfer 37,585 B, and no third-party bytes. Evidence:
  `.factory/qa-artifacts/lighthouse-live-3.json`.

## Privacy, headers, identity, and PWA

- A fresh browser-context request log covering cold load, worker installation,
  sample entry, movement, and completion observed 30 requests: all were to
  `https://arithmetic-steps.sociobot.in`; 25 were service-worker requests;
  none failed.
- Live HTML/assets send CSP with `frame-ancestors 'none'`,
  `X-Frame-Options: DENY`, `Permissions-Policy`, `Referrer-Policy`, and
  `X-Content-Type-Options: nosniff`.
- Hashed assets use `public, max-age=31536000, immutable`; `sw.js` uses
  `no-cache, no-store, must-revalidate`; HTML uses a 30-second cache.
- Chrome reports no manifest parsing or installability errors. The manifest has
  192 px, 512 px, and 512 px maskable icons, standalone display, scoped start
  URL, and matching theme/background colors.
- The live worker activates, controls `/demo`, uses cache
  `arithmetic-steps-c63b43b34415`, and does not precache deployment-only
  configuration. Offline reload returns 200 with the sample on desktop and
  390 px mobile.
- A real replacement-worker simulation against the unchanged production build
  displayed “A fresh route map is ready,” exposed the **Update** action,
  activated via `SKIP_WAITING`, changed controller, and reloaded without
  errors.
- Live and local files are byte-identical:

| File | SHA-256 |
| --- | --- |
| `index.html` | `271119513c8b81cce3e08f0eb63757876c49e260d38f62f9317522561639fa7b` |
| `assets/main-73KUytVM.js` | `d01e1e9f16aeb007015ef42e277195e8bc374b894edbf11c82381a67639fd865` |
| `assets/styles-CMbv29nK.css` | `24f7c594c97f064711307045dde1e11eb798216ac84c8de4a718c104493b0c31` |
| `sw.js` | `84a4da81e450c3a73ab17d3b0309e42cdf97b5c862a3bb04c4c22d85594445a0` |

## Not applicable

This product has no backend or server-side product/unlock endpoint, no
authentication or billing, and no library/CLI package. API allowance/429,
`Retry-After`, persistence concurrency/health/build endpoints, Entra authority,
and clean-consumer package checks are not applicable. The researched job does
not imply an AI feature, so there is no missed-AI-leverage finding.
