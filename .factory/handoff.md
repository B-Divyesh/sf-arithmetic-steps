# Arithmetic Steps — independent verification 13 handoff

## Release disposition: FAIL

Candidate `ccd38111adb752b13f2522644702f3b37819da63` was checked from a clean checkout against <https://arithmetic-steps.sociobot.in> on 2026-09-01 UTC. The live deployment matches the candidate build, but the release is not accepted because one required claim command failed when run independently from the clean checkout.

## Release-blocking finding

- **P0 — demo-sandbox claim command is not consistently reliable.** `npm test -- --grep @claim:demo-sandbox` ran its TypeScript and unit checks successfully, then failed its desktop Chromium case. The setup raised `NotFoundError: Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.` while opening the expected `settings` store. The mobile case in the same command passed. A later full suite passed, which shows the result depends on execution timing or order, but does not clear the required independent-command failure. The claims contract makes any failing declared command release-blocking.

## What was checked

- `npm ci`: pass (61 packages; audit reported zero vulnerabilities).
- Every literal command declared in `.factory/claims.json`: 20 passed and `demo-sandbox` failed as described above. The file contains 21 declared claims.
- `npm run lint`: pass.
- `npm test`: pass — 17 unit/static checks; 67 browser checks passed; 3 viewport-specific checks were intentionally skipped in the desktop project.
- `npm run build`: pass — generated `dist/`, manifest version `1.0.10`, and a service worker with 24 precached URLs.
- Candidate-to-live comparison: byte-identical SHA-256 values for `index.html`, `sw.js`, `manifest.webmanifest`, main JS, version JS, and CSS.
- Initial JS is 40,263 bytes raw (11,800 bytes gzip); initial CSS is 28,215 bytes raw (6,430 bytes gzip), within the static-product budgets.
- Cold first-read: pass. The first screen plainly describes addition and subtraction steps, names elementary children with a teacher or parent, and has a one-click **Try it with sample data** action.
- Functional coverage: normal addition and subtraction, multi-step routes, invalid values and correction, drag and labelled keyboard controls, replay, discussion card, local persistence, JSON export/import, confirmed clear, print layout, reduced motion, and the 390 px layout were covered by the suite and independent live checks.
- Accessibility: live desktop landing, live desktop demo, and live 390 px demo each had zero Axe serious/critical findings and zero browser errors. The first Tab reaches a visible 3 px brass focus ring on the skip link, and activation moves focus to `<main>`.
- Privacy and headers: a cold live request log contained same-origin GET traffic only. Root responses include a self-only CSP, `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, and a restrictive permissions policy. Hashed assets are immutable for one year; manifest and service worker have appropriate revalidation headers.
- PWA: the live `/demo` page received a controlling worker, reloaded while offline with the `52 − 18` sample still available, and preserved that demo after the in-app update path. No console or page errors were observed.
- Routes and links: `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, manifest, and worker returned 200. An unknown path returned HTTP 404.

## Verification note

Fresh Lighthouse measurement could not be completed in this worker: its browser tab stopped during the run. This is a verification-environment gap, not an additional product finding. Independent browser, Axe, mobile, cache, and bundle checks are recorded above.

## Product scope notes

This is a static local-first PWA. There is no backend endpoint, account, payment, model, or sign-in path; API request allowance, identity, concurrency, and consumer-package checks do not apply.

## Next step

Make the standalone `@claim:demo-sandbox` command reliable in desktop Chromium, then rerun every exact claims command from a fresh checkout before requesting release verification again. Full evidence is in `.factory/verification-13.md`.
