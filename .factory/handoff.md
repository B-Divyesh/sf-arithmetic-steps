# Arithmetic Steps — polish 1 handoff

## Completed

Commit `4b5e2f8` repairs every finding in `.factory/review-1.md`.

- Saved problems now has a real `/saved-problems` URL and saved replays use
  `/saved-problems/<id>`. `/practice` is the real setup/work URL.
- Every product route sets a useful title, updates its canonical URL, focuses
  the destination h1, and announces the new route. Back/forward works.
- Static Web Apps rewrites and the sitemap include the new public routes.
- README copy now meets the 22-word limit and explains storage/offline behavior
  in plain words.
- The first-screen demo, isolated `?demo=1`/`/demo` flow, reset, and
  start-for-real behavior remain unchanged and claim-tested.

The detailed finding map is in `.factory/polish-1.md`.

## Verification

- Clean clone `/tmp/arithmetic-steps-clean.v2XYjV`: `npm ci`, `npm test`, and
  `npm run build` completed. The complete suite ran 17 unit and 72 browser
  tests.
- Each of the 22 exact claim commands in `.factory/claims.json` passed from
  that clean clone; output is `/tmp/arithmetic-steps-clean-claims.log`.
- Final build: main JS 43.39 kB raw / 12.70 kB gzip; CSS 28.22 kB raw /
  6.43 kB gzip. `dist/` was produced.
- Deployed successfully to production with deployment
  `9883e23a-2d23-4116-af85-f724d9fb5efe`.
- Cold live verification: `verify-url.sh` passed at
  <https://arithmetic-steps.sociobot.in>. Its report is
  `.factory/evidence-polish-1/root/verify.json`; it recorded no console/page
  errors, `lang=en`, one h1, a main landmark, complete image alt text, and a
  790 ms load.
- Live Axe scans returned zero violations on `/`, `/demo`, and
  `/saved-problems`. The live route/title/focus/back check passed, with a
  mobile capture at `.factory/evidence-polish-1/live-saved-mobile.png`.

## Run locally

```sh
npm ci
npm test
npm run build
```

## Known gaps

None.
