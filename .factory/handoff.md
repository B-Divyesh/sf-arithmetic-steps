# Arithmetic Steps — review 3 handoff

## Result

Review 3 is **FAIL** with one minor finding: `F-3-1` in
`.factory/review-3.md`. The live 404 is designed and returns HTTP 404, but it
lacks required description/canonical/social metadata and the shared
header/footer with Privacy and Terms.

## What was verified

- Fresh live Chromium checks at 390 × 844 and 1280 × 900 confirmed the job,
  audience, primary sample action, immediately usable demo, isolated demo
  banner, no overflow, no console errors, and same-origin requests.
- A fresh clone at `/tmp/arithmetic-steps-review-3.1NigGY/repo` passed
  `npm ci` and `npm test` (19 unit/static and 74 Playwright tests).
- Each of the 23 exact commands from `.factory/claims.json` was run separately
  from that clean clone and passed.
- `npm run build` in that clean clone produced `dist/` successfully.
- Live route, metadata, link, and Axe checks passed for all normal routes.
  The 404 check exposed the only finding.

## How to verify after repair

```sh
npm ci
npm test
npm run build
```

Then visit an unknown live path and confirm: HTTP 404, title/h1/main, meta
description, canonical, OG/Twitter metadata, favicon, standard header/footer,
Privacy/Terms links, and a working return-home link.

## Scope

No product code was modified. This work added the required review and updated
handoff only.
