# Independent verification 13 — Arithmetic Steps

## Scope and result

**FAIL — release not accepted.**

Checked candidate commit `ccd38111adb752b13f2522644702f3b37819da63` from a clean checkout on 2026-09-01 UTC against the acceptance contract in the researched brief. Live URL: <https://arithmetic-steps.sociobot.in>.

The live files match the candidate production build byte-for-byte for the HTML shell, service worker, manifest, main JS, version JS, and CSS. The product otherwise exercised successfully. It nevertheless fails the required claims gate because one exact claim command failed in the clean environment.

## First-read check — PASS

A cold live load says, in plain words:

- What it does: “Explore addition and subtraction steps.”
- Who it is for: elementary children with a teacher or parent.
- What to click first: **Try it with sample data**.

The action is visible on the first screen and opens the isolated `52 − 18` sample route in one click.

## Claims contract — FAIL

`.factory/claims.json` is present and declares 21 claim commands. After `npm ci`, every listed command was run individually from this clean checkout.

| Result | Count | Evidence |
| --- | ---: | --- |
| Pass | 20 | Offline reload, local-only traffic, installability, focus, quantities, direct and keyboard interaction, narration, replay, free/no-account, bounds/recovery, persistence, JSON transfer, clear confirmation, print, reduced motion, 390 px controls, facilitator guidance, and no game mechanics passed. |
| Fail | 1 | `npm test -- --grep @claim:demo-sandbox` failed the desktop Chromium case; mobile passed. |

### P0 release-blocking defect — standalone demo-sandbox check

The exact command began with successful TypeScript and unit checks. Its desktop browser case failed during setup with:

```text
NotFoundError: Failed to execute 'transaction' on 'IDBDatabase':
One of the specified object stores was not found.
```

The failure occurred when the test opened the expected `settings` store in the real local database. The mobile project in that same command completed. The full suite later completed successfully, including its desktop sample case, so the standalone command is timing/order-dependent. That still does not meet the claims requirement: a declared command must pass reliably when run independently from a clean state.

## Local build and regression checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm ci` | PASS | 61 packages installed; audit reported zero vulnerabilities. |
| `npm run lint` | PASS | TypeScript no-emit check completed. |
| `npm test` | PASS | 17 unit/static tests; 67 browser tests passed; 3 intended project-specific skips. |
| `npm run build` | PASS | `dist/` built; manifest `1.0.10`; 24 precached URLs. |
| Bundle budget | PASS | Main JS 40,263 B raw / 11,800 B gzip; CSS 28,215 B raw / 6,430 B gzip; no web-font payload. |

The successful full browser suite covered additions and subtractions to 100, input recovery for blank, decimal, below-zero, and over-100 values, direct counter/ten-frame moves, labelled keyboard equivalents, narration, replay, history, persistence, JSON export/import, confirmed deletion, print output, reduced motion, and mobile controls.

## Live functional and visual QA — PASS except stated claims gate

- Desktop and 390 px mobile landing/demo loads had no console or page errors and no horizontal overflow.
- The 390 px `/demo` route had a controlling service worker. After an online visit, an offline reload retained the `52 − 18` sample, demo banner, and offline notice.
- The live update action registered a waiting worker, updated the controller, and returned to the same demo sample without errors.
- First keyboard focus is the skip link with `rgb(214, 154, 45) solid 3px` outline and an ink ring; Enter moves focus to `main#main`.
- Axe on desktop landing, desktop demo, and exact-390 demo reported zero serious/critical issues (zero issues overall in these scans).
- Root, demo, privacy, terms, 404 document, manifest, and worker returned 200. A new unknown path returned HTTP 404. Internal routes and hash links resolved; the sole external source link points to the scoped repository.

## Privacy, headers, and deployment identity — PASS

A fresh live browser context recorded only same-origin GET requests for the landing/worker lifecycle. There were no account controls, identifier fields, or frame elements in that flow.

The root response has the following relevant policies:

- self-only CSP including `connect-src 'self'` and `frame-ancestors 'none'`;
- HSTS;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`; and
- restrictive `Permissions-Policy`.

The main hashed asset uses `public, max-age=31536000, immutable`; the manifest uses `no-cache`; and the worker uses `no-cache, no-store, must-revalidate`. SHA-256 comparisons of all selected shell and runtime files were exact matches between local `dist/` and the live deployment.

## Measurement note

An attempted fresh mobile Lighthouse run could not complete because its browser tab stopped in this worker. This leaves no fresh Lighthouse score for this verification. It is a QA-environment limitation, not a second product defect; the independent Axe, mobile layout, offline, header, and bundle checks above completed.

## Non-applicable checks

The candidate is a static PWA with browser-local data only. It has no server endpoint, account, billing, tenant, or library/CLI surface. API allowance, identity-provider, persistence-boundary, concurrency, and clean-consumer checks therefore do not apply.

## Required next action

Stabilize the independent desktop `@claim:demo-sandbox` path, then repeat all 21 literal claim commands from a fresh checkout. Do not mark the candidate accepted until each command passes.
