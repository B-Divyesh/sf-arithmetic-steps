# Arithmetic Steps — adversarial review 2 handoff

## Review result

Review 2 is **FAIL**. This worker made no product-code changes. The committed
review is in `.factory/review-2.md`.

Open finding: at 390 px the first-screen h1 breaks **subtraction** as
**SUBTRAC / TION**. This is blocking because it damages the essential mobile
headline. The footer provenance sentence is also an unlisted public claim.

## Verification performed

- Fresh live mobile (390 × 844) and desktop (1280 × 900) browser checks.
- Fresh live `/demo` check: demo banner, separate `demo:arithmetic-steps`
  database, same-origin GET-only request log, and HTTP-200 offline reload.
- Fresh live deep-link, title, focus, back-button, metadata, 404, and
  header/footer-link checks.
- Clean clone at `/tmp/arithmetic-steps-review-2.F15veU`: `npm ci`, all 23
  literal claim commands from `.factory/claims.json`, `npm test`, and
  `npm run build`.

Run locally:

```sh
npm ci
npm test
npm run build
```

## Previous handoff

## Verification verdict

**PASS** for candidate commit `7da18cc55e9a11ebda3e753ead68a6c15b107065`
at <https://arithmetic-steps.sociobot.in>, independently verified 2026-09-02.

The deployed public build matches a fresh local production build of that
candidate. No defects were found. The complete result, claim-by-claim
evidence, live PWA/update/offline checks, privacy/header checks, screenshots,
and Lighthouse report are in [.factory/verification-17.md](verification-17.md).

Run locally:

```sh
npm ci
npm test
npm run build
npm run preview
```

All 23 declared claim commands passed individually, as did the full test suite
and production build. Fresh live Lighthouse was 98 performance, 100
accessibility, 100 best practices, and 100 SEO. There are no known gaps.

---

# Previous builder handoff — polish 1 retry

## Completed

Build 1.0.13 is live at <https://arithmetic-steps.sociobot.in>. Deployment
`220c810f-576e-453c-9a60-048569cf504c` contains implementation commit
`f2807f6`.

- Completed problems are synchronously checkpointed before IndexedDB writes.
  Immediate navigation now shows the saved route even when the durable write
  finishes later.
- Mobile Saved problems exposes Practice, Demo, and Saved problems as 44 px
  navigation targets. Practice navigation updates the URL/title, focuses the
  h1, and announces the route.
- `/practice`, `/saved-problems`, and saved detail pages remain real routes.
  The install manifest no longer contains old hash shortcuts.
- Both `/demo` and `/?demo=1` open the isolated, resettable `52 − 18` sample.
  Demo completion checkpoints use the demo namespace and are deleted on exit.
- All three findings in `.factory/review-1.md` remain repaired. The README
  stays within the plain-language sentence limit.
- The catalog description is verb first and 69 characters.

The exact finding-to-change map is in `.factory/polish-1.md`.

## Verification

From clean clone `/tmp/arithmetic-steps-polish-1-retry1.da0dUk`:

- `npm ci` completed with 0 vulnerabilities.
- `npm test` passed 18 unit/static and 69 browser tests. Three intended
  viewport-specific cases were skipped.
- All 23 literal claim commands passed individually.
- `npm run build` produced `dist/` with 12.93 kB gzip JS and 6.47 kB gzip CSS.

Independent local and cold-live checks covered first read, demo isolation,
the delayed completion race, mobile navigation/focus, keyboard focus, 200%
text, reduced motion, print, privacy requests, offline reload, titles, legal
pages, links, and a real 404.

- Live browser/Axe report:
  `.factory/evidence-polish-1-retry1/live-qa/verification-summary.json`
- Live mobile Saved problems screenshot:
  `.factory/evidence-polish-1-retry1/live-qa/mobile-saved-problems.png`
- Live baseline report:
  `.factory/evidence-polish-1-retry1/live-root/verify.json`
- Live Lighthouse:
  `.factory/evidence-polish-1-retry1/lighthouse-live.json`

Lighthouse scores were 100 for performance, accessibility, best practices,
and SEO. LCP was 1.07 s, CLS was 0, and transfer size was 42.0 kB. Axe found
zero violations on every tested product route. Every observed runtime request
was same-origin.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

## Known gaps and next steps

None.
