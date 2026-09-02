# Arithmetic Steps — polish 1 retry handoff

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
