# Arithmetic Steps — build handoff

Work order: `arithmetic-steps-build-1`
Completed: 2026-08-28

## What shipped

- A complete addition/subtraction-to-100 learning loop: choose a problem, move or subtract child-chosen chunks, state the strategy, finish, replay every intermediate state, and print or copy a discussion card.
- Quantity visuals made from labelled tens bars and one-counters. Every visual has an equivalent accessible description; no interaction requires dragging.
- Plain-language reasoning trails that preserve the invariant for addition and the remaining amount for subtraction.
- Local IndexedDB persistence for an unfinished route and completed route history, plus JSON export/import and a confirmed clear-all action. No child identifiers or accounts.
- First-class empty, loading, invalid-problem, storage-error, offline, install, and update states.
- Installable PWA: 192/512/maskable icons, matching splash colors, generated versioned app-shell precache, cache-first same-origin assets, navigation fallback, update prompt, and an offline page.
- Real `/privacy/` and `/terms/` pages; README, MIT license, sitemap, and robots file.
- A responsive art-deco transit-poster visual system documented in `.factory/design.md`. The original generated “Number Line Limited” illustration, prompt, review, and provenance live in `assets/src/`; AVIF, WebP, and JPEG delivery assets are in `public/assets/`.

## How to run

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

The deployment command is exactly `npm run build`. Static output is `dist/`, and `dist/index.html` is at its root.

## Verification

- `npm test`: pass. This includes strict TypeScript checking, 6 unit tests, and Playwright 1.58.2 journeys in desktop Chromium and a Pixel 5 viewport. Browser result: 12 passed, 2 intentionally skipped by device applicability (the offline worker is exercised once on desktop; the overflow/touch-size assertion once on mobile).
- End-to-end journeys cover addition, multi-step subtraction, narration, replay, history persistence, invalid input, offline reload, 393 px layout, legal pages, and serious/critical axe findings.
- Axe through Playwright: 0 serious or critical violations on the main experience, Privacy, and Terms.
- Factory `verify-url.sh`: pass at production preview. Title present, `lang="en"`, exactly one `h1`, main landmark present, 0 images missing alt text, 0 unlabeled buttons, and 0 console errors.
- Explicit offline test: pass after service-worker activation; reload, route setup, and IndexedDB saving work with the browser context offline.
- `npm run build`: pass. Initial application JS is 29.9 KB uncompressed (8.8 KB gzip); CSS is 23.4 KB uncompressed (5.6 KB gzip). The 720 px hero is 16 KB AVIF / 28 KB WebP; the 1200 px hero is 40 KB AVIF / 64 KB WebP; JPEG fallback is 119 KB.
- Lighthouse 12.8.2 mobile, local production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.96 s, LCP 1.58 s, TBT 0 ms, CLS 0.005. Lab Lighthouse does not report field INP; all local controls respond synchronously with no long tasks.
- `npm audit`: 0 vulnerabilities.

## Product decisions

- Addition preserves the total while moving chunks between addends; the finish step joins the transformed quantities.
- Subtraction tracks both the current number and the amount still to remove, so multiple valid decompositions remain visible.
- Strategy suggestions (“friendly ten,” “easier parts,” or “own route”) guide without grading a child’s chosen path.
- Replay defaults to a controllable 1.4-second cadence. With reduced motion enabled, the same button advances one station at a time instead of autoplaying.
- The product is entirely free; no billing integration or analytics was added.

## Known gaps and next steps

- The interaction and language follow established make-ten and decomposition patterns, but a formal teacher review and the brief’s three-session child outcome study cannot be performed inside this build container. Run that review before describing the pedagogy as classroom-validated; tune suggested chunks and wording from observations without adding scores or timers.
- The optional maintenance print pack remains outside this free v1. The built-in discussion card already prints cleanly.
- Lighthouse was measured against a local production server; production hosting and compression can be rechecked after factory deployment.
