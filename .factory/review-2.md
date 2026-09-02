# Adversarial first-read review 2 — Arithmetic Steps

- Reviewed: 2026-09-02 UTC
- Live URL: <https://arithmetic-steps.sociobot.in>
- Evidence: fresh Chromium contexts at 390 × 844 and 1280 × 900, plus a
  clean clone at `/tmp/arithmetic-steps-review-2.F15veU`
- Verdict: **FAIL**

## First read

Before scrolling on desktop, the page says this is an activity for elementary
children working with a teacher or parent. It has children move counters to
explain addition and subtraction. The first action is **Try it with sample
data**. Those answers are visible without scrolling.

The same job, audience, and first action are discernible on a 390 px phone.
However, the headline renders the one word **SUBTRACTION** as **SUBTRAC** and
**TION** on separate lines. That damaged word is in the first thing a
first-time phone visitor must read, so the first-screen gate does not pass.

The visual identity is specific rather than a generic SaaS template: the warm
paper, dark transit rails, clipped poster frames, and original number-train
art all support the arithmetic-route idea.

## Findings

### F-2-1 — BLOCKING — The phone headline breaks “subtraction” inside a word

- **Location / exact evidence:** On a fresh 390 × 844 live visit, the h1
  **Explore addition and subtraction steps** is visually laid out as
  `EXPLORE / ADDITION / AND / SUBTRAC / TION STEPS`. The 390 px screenshot
  shows the split before any scrolling. The live CSS at
  `src/styles.css:556` uses `font-size: clamp(2.6rem, 13vw, 4rem)` while the
  headline remains limited to `max-width: 12ch` at `src/styles.css:172`.
- **Why this fails:** The first-screen headline is the primary explanation of
  the job. Splitting an everyday subject word without a hyphen makes it look
  broken and slows a first-time phone visitor. A mobile-first product must keep
  essential text legible, not merely avoid horizontal overflow.
- **Concrete fix:** At 390 px, reduce the h1 enough to keep whole words, or
  widen/remove the 12ch constraint and choose an intentional whole-word line
  layout such as `EXPLORE / ADDITION AND / SUBTRACTION / STEPS`. Add a
  390 px visual/browser regression that asserts no rendered h1 line is a
  partial word.

### F-2-2 — Minor — Footer provenance is an unlisted public claim

- **Location / exact quote:** Landing-page footer: **“Poster artwork was
  generated for this project.”**
- **Why this fails:** This is a public factual claim, but it has no
  `claims.json` entry or tagged test. The claim contract requires every
  claim-like landing-page sentence to have observable sandbox evidence or be
  removed. The product has provenance in `.factory/design.md`, but that does
  not make the visitor-facing statement testable.
- **Concrete fix:** Either remove this sentence from the footer (the design
  record can retain provenance), or add a narrowly scoped claim and tagged
  static-contract test that verifies the public disclosure and the committed
  source/sidecar provenance record.

## Copy audit

Counts below use whitespace-delimited words. Headings and controls are listed
as copy units because they must also be clear out of context. No item exceeds
22 words. The copy audit found no banned marketing adjective, inconsistent
arithmetic term, metaphor-only heading, or non-result-naming product button.
F-2-1 is a rendering failure rather than a wording failure; F-2-2 is the sole
unlisted claim.

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
| Add / Subtract / First number / Start at / Second number / Take away | 1 / 1 / 2 / 2 / 2 / 2 |
| Try a problem / 8 + 7 / 38 + 27 / 46 + 35 / Start the problem | 3 / 3 / 3 / 3 / 3 |
| Enter the first number before starting the problem. | 8 |
| Enter the second number before starting the problem. | 8 |
| Enter the starting number before starting the problem. | 8 |
| Enter how many to take away before starting the problem. | 10 |
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
| You are offline. This activity still works and saves on this device. | 3 / 9 |
| Demo — sample data, nothing is saved. / This sample stays separate from your problems. | 6 / 7 |
| Reset demo / Start for real | 2 / 3 |
| Explore addition and subtraction steps with a child. / No accounts or child profiles. | 8 / 5 |
| Privacy / Terms / Source | 1 / 1 / 1 |
| Built by Param Factory / Build 1.0.13 / Poster artwork was generated for this project. | 4 / 2 / 7 |

### README

| Copy | Words |
| --- | ---: |
| Arithmetic Steps | 2 |
| Arithmetic Steps is an offline addition and subtraction activity for children learning numbers to 100. | 15 |
| A child moves counters in chunks, explains each step, replays the work, and prints a discussion card. | 17 |
| Live product | 2 |
| Who it is for | 5 |
| It is for elementary teachers, parents, and children discussing the structure inside a calculation. | 15 |
| An adult can let the child choose each chunk, then ask what changed and what stayed the same. | 18 |
| Use four local checks before classroom use | 7 |
| This self-guided checklist is guidance, not evidence of learning outcomes. | 10 |
| A facilitator can complete and reset four local checks before classroom use. | 12 |
| Checklist marks are not stored. | 5 |
| The checks cover the supplied sample, child-chosen chunks, reasoning prompts, and keyboard controls. | 13 |
| Try the demo | 3 |
| Open the sample problem, or press Try it with sample data on the landing page. | 15 |
| It starts a part-complete 52 − 18 problem so a learner can finish the last chunk and replay the steps right away. | 21 |
| Demo data is isolated in demo:arithmetic-steps and is discarded by Reset demo, Start for real, or an ordinary link away from demo. | 22 |
| See .factory/demo.md for the sandbox details. | 6 |
| What v1 includes | 4 |
| Addition and subtraction problems with whole numbers and results from 0 to 100 | 12 |
| Interactive ten-frames and one-counters with equivalent screen-reader descriptions | 8 |
| Direct counter dragging plus labelled keyboard controls for the same moves | 10 |
| Plain-language reasoning steps, replay, and a print-ready discussion card | 9 |
| Completed problems stay in this browser. / Unfinished work remains after a refresh. | 6 / 6 |
| JSON export/import, confirmed clear controls, and no accounts or child identifiers | 10 |
| Install the activity and use it offline after the first visit. | 11 |
| Responsive 390 px layout, visible keyboard focus, reduced-motion behavior, and tested print styles | 12 |
| The product intentionally has no timer, score, streak, leaderboard, answer guessing, AI grading, or third-party analytics. | 17 |
| Run locally / Requirements: Node.js 22+ and npm. | 2 / 4 |
| Vite prints the local URL. / Problem data is stored only in that browser profile. | 5 / 9 |
| Test and build | 3 |
| npm test runs unit tests and Playwright in desktop Chromium and a 393 px mobile viewport. | 15 |
| It includes an offline reload and an Axe accessibility scan. | 10 |
| Playwright 1.58.2 is pinned. / If its browser is missing locally, run npx playwright install chromium once. | 4 / 14 |
| Every public product claim is declared in .factory/claims.json. | 8 |
| Each may be run from a clean demo context with its listed command, for example: | 15 |
| npm test -- --grep @claim:offline-reload | 5 |
| The exact production command is npm run build. | 9 |
| It creates dist/ with the app, legal pages, hashed assets, and offline service worker. | 14 |
| Preview it with: / npm run preview | 4 / 3 |
| Data and privacy | 3 |
| No problem data is sent to a server. | 8 |
| The Privacy page explains browser storage and export behavior. | 9 |
| The app has no runtime dependencies, remote fonts, third-party scripts, advertising, or tracking. | 13 |
| Remove completed data from Saved problems or remove all site data in browser settings. | 14 |
| Product and design notes | 4 |
| .factory/brief.json records the scoped opportunity. | 5 |
| .factory/design.md records the art-deco transit-poster system and generated-art provenance. | 9 |
| .factory/pedagogy-evidence.md records the checklist boundary and observable guidance safeguards. | 9 |
| .factory/facilitator-review.md documents the executable self-guided checklist. | 7 |
| .factory/handoff.md records final verification and known gaps. | 7 |
| License / MIT. / See LICENSE. | 1 / 1 / 2 |

## Demo and sandbox

**PASS.** The above-the-fold primary action opened `/demo` in one click and
immediately rendered the part-complete, realistic `52 − 18` route at
`42 − 8`; it was already in use rather than an empty setup screen. The
persistent banner reads **Demo — sample data, nothing is saved.** and exposes
working **Reset demo** and **Start for real** controls.

The clean-clone `@claim:demo-sandbox` test passed. It verifies the separate
`demo:arithmetic-steps` store, an untouched real-data sentinel, reset, and
leaving demo. A fresh live `/demo` context observed only the
`demo:arithmetic-steps` database. After service-worker control, an offline
reload returned HTTP 200 and preserved title **Demo — Arithmetic Steps**, h1
**52 − 18**, and the banner.

## Claims and sandbox behavior

**PASS.** `.factory/claims.json` contains 23 entries. From the clean clone,
every literal declared command passed: `demo-sandbox`, `offline-reload`,
`local-only`, `installable-pwa`, `visible-focus`, `tens-and-ones`,
`direct-manipulation`, `narrated-steps`, `replay-and-discussion`,
`free-no-account`, `arithmetic-bounds`, `keyboard-controls`,
`unfinished-persistence`, `completed-persistence`, `json-export`,
`json-import`, `clear-data`, `print-card`, `reduced-motion`, `mobile-controls`,
`facilitator-checklist`, `self-guided-checklist-guidance`, and
`no-game-mechanics`.

The fresh live Playwright request log recorded same-origin GET requests only;
there were no third-party origins, request bodies, or console errors on the
normal landing and demo flows. The separate live offline reload described
above confirms the offline claim. F-2-2 is the only unlisted claim-like
landing sentence.

## History

Verified each prior finding on both the live site and code:

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 — hash-only Saved problems, stale title, and stale focus | **Fixed.** `/saved-problems` returns 200, has title **Saved problems — Arithmetic Steps**, focuses its h1 after navigation, and has a polite route-announcement update. Back returns to `/` and focuses the landing h1. |
| F-1-2 — two README sentences over 22 words | **Fixed.** The complete README audit above has no item over 22 words. |
| F-1-3 — README storage/PWA jargon | **Fixed.** The product list now says what visitors get: completed work stays in the browser, unfinished work survives refresh, and it works offline after the first visit. |
| Controller-1 — completed route lost during delayed persistence | **Fixed.** `@claim:completed-persistence` passed in the clean clone. |
| Controller-2 — mobile Saved problems lacked Practice | **Fixed.** The fresh 390 px header has separate 44 px **Practice**, **Demo**, and **Saved problems** controls. |
| Required `?demo=1` path | **Fixed.** A fresh live `/?demo=1` renders the isolated `52 − 18` demo and its banner. |

## Structure and quality checks

- **PASS:** `/`, `/practice`, `/demo`, `/?demo=1`, `/saved-problems`,
  `/privacy/`, and `/terms/` return the appropriate route states. The unknown
  path returns the designed **Page not found** page with HTTP 404.
- **PASS:** Each checked route has an appropriate title, a single h1, `main`,
  `lang=en`, description, canonical URL, social metadata/image, favicon, and
  consistent header/footer links. The live route and Back checks focused the
  h1 and exercised the polite route announcer.
- **PASS:** The 390 px check has no horizontal document overflow and normal
  landing/demo load has no console errors. All crawled internal links named in
  the header/footer returned 2xx; the explicit unknown route correctly returns
  404 rather than pretending to be a valid link.
- **PASS:** Full clean-clone `npm test` passed (18 unit/static tests and 72
  browser tests); `npm run build` produced `dist/`.
- **FAIL:** The word-breaking failure in F-2-1 means the mobile first screen
  is not acceptable even though controls fit in the viewport.

## Missed leverage

No missing AI feature is expected: the brief explicitly excludes AI grading,
and the product’s useful import, export, replay, print, local storage, and
offline behavior are already implemented and claim-tested. No provider key is
embedded and no decorative AI control is present.

## What would make this perfect

Keep whole words in the 390 px hero heading and cover that rendering rule with
a regression. Then either test or remove the unlisted footer provenance
sentence. Re-run the complete clean-clone claim list, full suite, build, and
fresh live mobile first-read check. At that point no finding in this review
would remain.
