# Adversarial first-read review 3 — Arithmetic Steps

- Reviewed: 2026-09-02 UTC
- Live URL: <https://arithmetic-steps.sociobot.in>
- Evidence: fresh Chromium contexts at 390 × 844 and 1280 × 900; a clean
  clone at `/tmp/arithmetic-steps-review-3.1NigGY/repo`; live route, request,
  link, and Axe checks
- Verdict: **FAIL**

## First read

Before scrolling, at both widths, I understood this as an activity for an
elementary child and a teacher or parent. The child moves counters to explain
addition or subtraction steps. The first action is **Try it with sample
data**. All three answers are visible without scrolling. The 390 px headline
keeps whole words and the action has no overflow.

The Number Line Limited treatment is distinct rather than a generic product
template: warm paper, transit-poster geometry, counter-train artwork, dark
rail ink, clipped frames, and brass route marks all explain the arithmetic
journey.

## Findings

### F-3-1 — Minor — The live 404 omits required metadata and the shared site shell

- **Location / exact evidence:** A fresh visit to
  `https://arithmetic-steps.sociobot.in/nothing-here` returns HTTP 404, title
  **Page not found — Arithmetic Steps**, and h1 **Page not found**. It has no
  `<meta name="description">`, canonical link, or Open Graph/Twitter metadata.
  It also has no `<header>` or `<footer>`, so there are no consistent
  navigation links or Privacy/Terms links. This is directly visible in
  `public/404.html:3–18`.
- **Why this fails:** The visitor can return home, so the 404 is not a broken
  route. However, it is still a real page without the required route metadata
  or the product's consistent header/footer. A visitor who reaches it cannot
  reach Privacy or Terms, and the page does not meet the documented page
  structure.
- **Concrete fix:** Add a short 404 description, canonical URL for
  `/404.html`, the same social image/title/description metadata used by the
  product, apple-touch icon, and the standard skip link, header, and footer
  (including Privacy and Terms). Keep `noindex`, the existing HTTP 404
  override, the one h1, and the clear home link. Add a static/browser
  regression for a missing path that checks 404 status, metadata, header,
  footer, Privacy/Terms links, h1, and return link.

## Copy audit

Whitespace-delimited word counts follow. Headings and controls are included
because they are visitor-facing copy. No sentence exceeds 22 words. I found
no banned marketing adjective, unexplained jargon, inconsistent arithmetic
term, metaphor-only heading, or non-result-naming product button. Therefore
there is no copy finding.

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
| Try a problem: / 8 + 7 / 38 + 27 / 46 + 35 / Start the problem | 3 / 3 / 3 / 3 / 3 |
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
| Built by Param Factory / Build 1.0.14 | 4 / 2 |

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

**PASS.** On both fresh live widths, the first-screen action opened `/demo` in
one click and immediately rendered a realistic, part-complete `52 − 18`
route at `42 − 8`. The screen was already in use rather than a setup page.
The persistent banner reads **Demo — sample data, nothing is saved.** It has
working **Reset demo** and **Start for real** controls.

The declared clean-clone `@claim:demo-sandbox` test passed. It asserts an
isolated `demo:arithmetic-steps` store, untouched real-data sentinel, reset,
and disposal when leaving demo. The live fresh request log had same-origin
GETs only. The live demo contained no account or storage prompt.

## Claims and sandbox behavior

**PASS.** `.factory/claims.json` has 23 claims. The complete clean-clone
suite passed (19 unit/static tests and 74 Playwright tests). Each literal
declared test command was also run independently from the clean clone and
passed: `demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`,
`visible-focus`, `tens-and-ones`, `direct-manipulation`, `narrated-steps`,
`replay-and-discussion`, `free-no-account`, `arithmetic-bounds`,
`keyboard-controls`, `unfinished-persistence`, `completed-persistence`,
`json-export`, `json-import`, `clear-data`, `print-card`, `reduced-motion`,
`mobile-controls`, `facilitator-checklist`, `self-guided-checklist-guidance`,
and `no-game-mechanics`.

The fresh live landing and demo request logs contained only same-origin GET
requests and no console errors. The landing and README claim-like statements
all map to a declared claim; no unlisted claim was found.

## History

I read `review-1.md`, `review-2.md`, `polish-1.md`, `polish-2.md`, and the
previous handoff, then rechecked each earlier finding live and in code.

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 — hash-only Saved problems, stale title, and stale focus | **Fixed.** `/saved-problems` is a real route, has title **Saved problems — Arithmetic Steps**, focuses the h1, and announces the route. Back returns to the landing h1. |
| F-1-2 — README sentences over 22 words | **Fixed.** The complete README audit above has no item over 22 words. |
| F-1-3 — unexplained storage/PWA jargon | **Fixed.** The product list describes browser-stored work, refresh persistence, and offline use in visitor language. |
| Controller-1 — a completed route could disappear during delayed persistence | **Fixed.** The independent `@claim:completed-persistence` command passed. |
| Controller-2 — mobile Saved problems lacked Practice | **Fixed.** The fresh 390 px header exposes 44 px Practice, Demo, and Saved problems actions. |
| Required direct `?demo=1` path | **Fixed.** A fresh live `/?demo=1` opens the isolated `52 − 18` sample and demo banner. |
| F-2-1 — `subtraction` split inside the phone headline | **Fixed.** The fresh 390 px screenshot renders whole words without horizontal overflow; its exact-390 regression passed. |
| F-2-2 — footer artwork provenance was an unlisted claim | **Fixed.** The footer now contains only the factory attribution and build identifier; provenance remains in the design record. |

## Structure and quality checks

- **PASS:** `/`, `/practice`, `/demo`, `/?demo=1`, `/saved-problems`,
  `/privacy/`, and `/terms/` return 200 with route-appropriate titles, one
  h1, one main landmark, description, canonical, social metadata, favicon,
  and shared header/footer. Axe found zero violations at 390 px on each.
- **PASS:** The live route/title/focus/announcement behavior works for
  practice, demo, and saved problems; the prior route regression passed.
- **PASS:** All landing internal links and the GitHub source link return 200.
  `robots.txt` and `sitemap.xml` are present. The fresh mobile screen has no
  horizontal overflow. Cold landing/demo flows have no console errors.
- **PASS:** The live CSP and request log permit only self-hosted runtime
  assets. The page has no remote font, script, or tracking request.
- **FAIL:** F-3-1. An unknown path is a designed HTTP 404 with a home link and
  zero Axe violations, but it lacks metadata and the consistent header/footer.

## Missed leverage

No missing AI feature is expected: the brief explicitly excludes AI grading.
The useful implied additions—demo, local storage, import/export, replay,
printing, and offline use—are present and claim-tested. No provider key or
decorative AI control was found.

## What would make this perfect

Repair F-3-1, add its regression, then rerun the clean-clone claim commands,
build, and fresh 404 route crawl. With the 404 using the same complete route
shell and metadata as the other pages, no finding in this review would remain.
