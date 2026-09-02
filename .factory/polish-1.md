# Polish 1 — Arithmetic Steps

Repair commit: `4b5e2f8`  
Deployment: `9883e23a-2d23-4116-af85-f724d9fb5efe`  
Live URL: <https://arithmetic-steps.sociobot.in>

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Replaced saved-work hashes with `/saved-problems` and individual `/saved-problems/<id>` routes. Added `/practice`, Static Web Apps rewrites, route-specific titles/canonicals, focus transfer to the h1, a polite route announcement, and Back-button support. | Browser regression: `uses a real saved-problems route with a title, focused heading, and route announcement`; live cold route check returned `200`; live interaction checked title, h1 focus, announcement, and Back. Screenshot: `.factory/evidence-polish-1/live-saved-mobile.png`. |
| F-1-2 | Split the two overlong README sentences into short test/build sentences. | `.factory/copy-audit.md` README audit records the revised word counts; no sentence exceeds 22 words. |
| F-1-3 | Replaced product-list storage/PWA implementation jargon with the learner-facing outcomes. | `README.md` now says completed work stays in the browser, unfinished work remains after refresh, and the activity works offline after first visit. `.factory/copy-audit.md` records the terminology audit. |

Additional repair discovered by claim verification: the skip link now explicitly
moves keyboard focus to the main landmark. `@claim:visible-focus` passes in
desktop and mobile Chromium.

## Final evidence

- Clean clone: `/tmp/arithmetic-steps-clean.v2XYjV`; `npm ci`, `npm test`, and
  `npm run build` completed. The full suite ran 17 unit and 72 browser tests.
- All 22 literal commands from `.factory/claims.json` were re-run from that
  clean clone. Output: `/tmp/arithmetic-steps-clean-claims.log`.
- Production `verify-url.sh` report: `.factory/evidence-polish-1/root/verify.json`.
  It reports HTTP 200, no console/page errors, title/lang/main/alt checks, and
  a 790 ms cold load. Desktop and mobile captures are in the same directory.
- Live Axe checks on `/`, `/demo`, and `/saved-problems`: 0 violations each.
- Live route status checks: `/saved-problems`, `/practice`, `/demo`,
  `/privacy/`, and `/terms/` returned 200; `/not-a-route` returned 404.
