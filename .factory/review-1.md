# Adversarial first-read review 1 — Arithmetic Steps

- Reviewed: 2026-09-02 UTC
- Live URL: <https://arithmetic-steps.sociobot.in>
- Viewports: fresh 390 × 844 Chromium context and fresh 1280 × 900 Chromium context
- Verdict: **FAIL**

## First read

Before scrolling, I understood that this is an activity where elementary
children move counters to explain addition and subtraction, that it is for a
child working with a teacher or parent, and that the first action is **Try it
with sample data**. The first screen makes all three points clear at both
tested widths. The button is visible without scrolling and says what it does.
This gate passes.

The distinct Number Line Limited art-deco transit-poster treatment is present
on the live site. It is visually specific to the product rather than a generic
SaaS layout: warm paper, ink rails, clipped geometric frames, counter-train
art, and station-like progress cues all support moving quantities through a
calculation.

## Findings

### F-1-1 — BLOCKING — Saved problems is a hash state with the wrong title and no route-change focus

- **Location / exact evidence:** On the live home page, activate **Saved
  problems**. The address becomes
  `https://arithmetic-steps.sociobot.in/#history`; the page has the h1 **Saved
  problems**, but its title remains **Arithmetic Steps — Explore addition and
  subtraction** and focus remains on the activating `<a>`, not the h1. A fresh
  direct visit to `/#history` has the same landing-page title. The implementation
  uses `#history`, `#route`, and `#route-<id>` in `src/main.ts` (including
  lines 505, 644, and 739).
- **Why this fails:** Saved problems is a real product place, not an in-page
  anchor. A browser tab, history entry, and screen reader all continue to name
  the landing page after the visitor has entered saved work. This violates the
  required real-URL, title, focus, and announcement behavior; routing failures
  are blocking under the review contract.
- **Concrete fix:** Give saved work a pathname such as `/saved-problems` and
  add its Static Web Apps rewrite. Route from `location.pathname` on cold load
  and `popstate`; set `document.title` to **Saved problems — Arithmetic
  Steps**; focus the new h1 and announce it after every route change. Replace
  the route/result hashes with real paths where those are navigable places.
  Add a browser regression that loads the deep link, clicks into saved
  problems, uses Back, and asserts pathname, title, h1 focus, and live
  announcement at every transition.

### F-1-2 — Minor — README has two sentences over the 22-word copy limit

- **Location / exact quotes:** README, **Test and build**:
  - “`npm test` runs unit tests plus Playwright flows in desktop Chromium and a
    393 px mobile viewport, including an offline reload and axe accessibility
    scan.” — 25 words.
  - “It creates the static deployment at `dist/`, with `dist/index.html` at its
    root, legal pages, immutable hashed application assets, and a versioned
    precache service worker.” — 24 words.
- **Why this fails:** The plain-words contract sets a hard 22-word maximum for
  README sentences. These sentences combine several technical facts and are
  harder to scan than necessary.
- **Concrete fix:** Replace them with: “`npm test` runs unit tests and
  Playwright in desktop Chromium and a 393 px mobile viewport. It includes an
  offline reload and an Axe accessibility scan.” Replace the second quote
  with: “`npm run build` creates `dist/`. It includes the app, legal pages,
  hashed assets, and the offline service worker.”

### F-1-3 — Minor — README uses unexplained storage and PWA jargon in the product list

- **Location / exact quotes:** README, **What v1 includes**:
  - “IndexedDB persistence for completed history, with a local checkpoint for
    unfinished work”
  - “Installable PWA with an app-shell cache and tested offline operation”
- **Why this fails:** “IndexedDB,” “PWA,” and “app-shell cache” describe an
  implementation, not the useful result for a teacher or parent. The README
  copy audit requires jargon to be flagged and rewritten in plain words.
- **Concrete fix:** Use “Completed problems stay in this browser. Unfinished
  work remains after a refresh.” and “Install the activity and use it offline
  after the first visit.” Keep implementation terms only in a clearly labelled
  developer/deployment note if they are needed.

## Copy audit

The tables list all visitor-facing landing and README copy units, including
headings, controls, and sentence fragments; code blocks are excluded. Counts
use whitespace-delimited words. No landing unit exceeds 22 words. The two
README overages are F-1-2. The jargon units are F-1-3. No banned marketing
adjective, inconsistent arithmetic term, metaphor-only heading, or
non-result-naming product button was found.

### Landing page

| Copy | Words |
| --- | ---: |
| Skip to main content | 4 |
| Arithmetic Steps | 2 |
| Practice / Demo / Saved problems / Install offline | 1 / 1 / 2 / 2 |
| Addition and subtraction to 100 | 5 |
| Explore addition and subtraction steps | 5 |
| For elementary children with a teacher or parent, move counters to explain how each answer changes. | 16 |
| Try it with sample data | 5 |
| Choose your own problem | 4 |
| Works offline after the first visit. | 6 |
| Problems stay only on this device. | 7 |
| Free with no accounts or scores. | 6 |
| Choose a problem / Pick addition or subtraction / Which operation? | 3 / 4 / 2 |
| Add / Subtract / First number / Second number / Try a problem | 1 / 1 / 2 / 2 / 3 |
| Start the problem | 3 |
| For the grown-up nearby | 5 |
| Let the child choose the chunk, even when it is not the shortest path. | 14 |
| Ask “What stayed the same?” before offering a strategy. | 10 |
| Local checklist / Use four local checks before classroom use | 2 / 7 |
| This self-guided checklist is guidance, not evidence of learning outcomes. | 10 |
| Complete and reset its four local checks before classroom use. | 10 |
| Checklist marks are not stored. | 5 |
| Mark each check after you try it | 7 |
| Finish the sample. / Remove the final 8 in the supplied route. | 3 / 9 |
| Open 52 − 18 sample | 4 |
| Try a child-chosen chunk. / Move a ten-frame or counter, then use a labelled chunk button. | 4 / 11 |
| Read the reasoning trail. / Finish a route, replay it, and read the discussion prompts. | 4 / 10 |
| Check access for your setting. / Use keyboard controls and decide how you will support the learner. | 6 / 11 |
| 0 of 4 local checks marked. Marks are not stored. | 10 / 5 |
| Reset local checks | 3 |
| How it works / Move, explain, and replay each step | 3 / 6 |
| Move / Drag a counter or ten-frame, or use the labelled controls. | 1 / 10 |
| Explain / Each choice becomes a sentence, not a speed score. | 1 / 9 |
| Replay / Step through the work and talk about why it works. | 1 / 9 |
| Explore addition and subtraction steps with a child. / No accounts or child profiles. | 8 / 5 |
| Privacy / Terms / Source | 1 / 1 / 1 |
| Built by Param Factory / Build 1.0.12 / Poster artwork was generated for this project. | 4 / 2 / 7 |
| Demo — sample data, nothing is saved. / This sample stays separate from your problems. | 6 / 7 |
| Reset demo / Start for real | 2 / 3 |

The product form’s conditional recovery text is also within the limit:
**Enter the first number before starting the problem.** (8), **Enter the
second number before starting the problem.** (8), **Enter the starting number
before starting the problem.** (8), and **Enter how many to take away before
starting the problem.** (10).

### README

| Copy | Words |
| --- | ---: |
| Arithmetic Steps is an offline addition and subtraction activity for children learning numbers to 100. | 15 |
| A child moves counters in chunks, explains each step, replays the work, and prints a discussion card. | 17 |
| Live product | 2 |
| It is for elementary teachers, parents, and children discussing the structure inside a calculation. | 15 |
| An adult can let the child choose each chunk, then ask what changed and what stayed the same. | 18 |
| This self-guided checklist is guidance, not evidence of learning outcomes. | 10 |
| A facilitator can complete and reset four local checks before classroom use. | 12 |
| Checklist marks are not stored. | 5 |
| The checks cover the supplied sample, child-chosen chunks, reasoning prompts, and keyboard controls. | 13 |
| Open the sample problem, or press Try it with sample data on the landing page. | 15 |
| It starts a part-complete 52 − 18 problem so a learner can finish the last chunk and replay the steps right away. | 21 |
| Demo data is isolated in demo:arithmetic-steps and is discarded by Reset demo, Start for real, or an ordinary link away from demo. | 22 |
| See .factory/demo.md for the sandbox details. | 6 |
| Addition and subtraction problems with whole numbers and results from 0 to 100 | 12 |
| Interactive ten-frames and one-counters with equivalent screen-reader descriptions | 8 |
| Direct counter dragging plus labelled keyboard controls for the same moves | 10 |
| Plain-language reasoning steps, replay, and a print-ready discussion card | 9 |
| IndexedDB persistence for completed history, with a local checkpoint for unfinished work | 11 |
| JSON export/import, confirmed clear controls, and no accounts or child identifiers | 10 |
| Installable PWA with an app-shell cache and tested offline operation | 10 |
| Responsive 390 px layout, visible keyboard focus, reduced-motion behavior, and tested print styles | 12 |
| The product intentionally has no timer, score, streak, leaderboard, answer guessing, AI grading, or third-party analytics. | 17 |
| Requirements: Node.js 22+ and npm. | 4 |
| Vite prints the local URL. | 5 |
| Problem data is stored only in that browser profile. | 9 |
| `npm test` runs unit tests plus Playwright flows in desktop Chromium and a 393 px mobile viewport, including an offline reload and axe accessibility scan. | 25 — F-1-2 |
| Playwright 1.58.2 is pinned; if its browser is missing locally, run `npx playwright install chromium` once. | 15 |
| Every public product claim is declared in .factory/claims.json. | 8 |
| Each may be run from a clean demo context with its listed command, for example: | 15 |
| The exact production command is `npm run build`. | 7 |
| It creates the static deployment at dist/, with dist/index.html at its root, legal pages, immutable hashed application assets, and a versioned precache service worker. | 24 — F-1-2 |
| Preview it with: | 4 |
| No problem data is sent to a server. | 8 |
| The Privacy page explains browser storage and export behavior. | 9 |
| The app has no runtime dependencies, remote fonts, third-party scripts, advertising, or tracking. | 13 |
| Remove completed data from Saved problems or remove all site data in browser settings. | 14 |
| .factory/brief.json records the scoped opportunity. | 5 |
| .factory/design.md records the art-deco transit-poster system and generated-art provenance. | 9 |
| .factory/pedagogy-evidence.md records the checklist boundary and observable guidance safeguards. | 9 |
| .factory/facilitator-review.md documents the executable self-guided checklist. | 7 |
| .factory/handoff.md records final verification and known gaps. | 7 |
| MIT. / See LICENSE. | 1 / 2 |

## Demo and sandbox

**PASS.** From a fresh 390 px context, the one-click primary action opened
`/demo` and immediately showed a realistic, part-complete `52 − 18` route at
`42 − 8`. The persistent banner reads **Demo — sample data, nothing is
saved**, with working **Reset demo** and **Start for real** controls. The demo
created only `demo:arithmetic-steps` storage and its demo checkpoint; the real
`arithmetic-steps` database remained separate. Reset restored the sample.
Start for real removed the demo database and checkpoint and returned to the
real setup state.

## Claims and sandbox behavior

**PASS.** `.factory/claims.json` has 22 entries. After a clean `npm ci`, each
literal listed command passed from this checkout:

`demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`,
`visible-focus`, `tens-and-ones`, `direct-manipulation`, `narrated-steps`,
`replay-and-discussion`, `free-no-account`, `arithmetic-bounds`,
`keyboard-controls`, `unfinished-persistence`, `json-export`, `json-import`,
`clear-data`, `print-card`, `reduced-motion`, `mobile-controls`,
`facilitator-checklist`, `self-guided-checklist-guidance`, and
`no-game-mechanics`.

A separate fresh live `/demo` context observed 34 requests across first load,
service-worker setup, and offline reload. Every request was a same-origin GET;
there were no external requests, request bodies, or page/console errors. Once
the worker controlled the page, `context.setOffline(true)` followed by reload
returned 200 and preserved the demo title, h1, banner, and `52 − 18` sample.
No unlisted reliance claim was found on the live landing page; the landing,
footer, and demo statements map to the listed sandbox claims.

## History

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files to
recheck. The existing `.factory/handoff.md` recorded a prior PASS and no
open finding. This review independently found F-1-1, which that handoff did
not exercise; the claim and demo assertions it recorded were re-run and pass.

## Structure and quality checks

- **PASS:** root, demo, Privacy, and Terms use the expected route-specific
  titles; the root has one h1, a main landmark, `lang=en`, description,
  canonical, Open Graph/Twitter image metadata, favicon, manifest, robots, and
  sitemap. The unknown-route response is a styled HTTP 404 with a return link.
- **PASS:** `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, and every
  crawled internal/external link returned 2xx. The root and 404 response
  headers include the expected self-only CSP, `frame-ancestors 'none'`,
  `nosniff`, referrer policy, frame denial, and Permissions Policy.
- **PASS:** the live cold screens at 390 px and desktop had no console errors.
  The product’s own suite passed axe coverage, keyboard focus, reduced motion,
  390 px controls, print, offline, and legal-page checks.
- **FAIL:** F-1-1 is the remaining route/deep-link/title/focus failure.
- **PASS:** `npm test` completed with 67 passing and 3 intended
  viewport-specific skips; `npm run build` completed and produced `dist/`.
  The main application JavaScript is 41.61 kB raw / 12.15 kB gzip.

## Missed leverage

No additional AI feature is expected. The brief calls for direct local
manipulation and conversation, and explicitly lists AI grading as a non-goal.
The useful import, export, replay, print, offline, and local-storage behavior
is already present and claim-tested.

## What would make this perfect

Implement the real saved-problems route and its title/focus/live-announcement
test, then apply the two short README rewrites and replace the storage/PWA
jargon. Re-run the route check from a fresh context, every declared claim, the
full suite, and the build. With those items resolved and no new finding, the
next review can pass.
