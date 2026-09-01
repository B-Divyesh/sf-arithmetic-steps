# Arithmetic Steps — repair 17 handoff

## Release disposition: repaired and deployed

The verifier's only release-blocking finding from report commit
`3a6f3a260a7ce7cfee11ab61f36072877e9f99` is fixed. Version `1.0.11` is live at
<https://arithmetic-steps.sociobot.in>. The implementation commit is
`cbcf6da` (`fix: make demo storage initialization deterministic`).

## Finding reproduced before repair

The candidate could let the desktop claim test open `arithmetic-steps` before
application bootstrap. An unversioned open created an empty version-1 database;
the application's own version-1 open then had no upgrade event. Its first
`settings` transaction failed with the verifier's exact error:

> NotFoundError: Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.

The timing was made deterministic on the unchanged candidate by creating the
empty database from `/offline.html` before navigation. The complete procedure
is recorded in `.factory/evidence-repair-17/reproduction-before.txt`.

## Root-cause repair

- IndexedDB schema version 2 creates both `attempts` and `settings` during the
  upgrade transaction. Every open validates the schema and advances malformed
  or legacy databases before returning.
- Application bootstrap, demo entry, demo reset, and the switch back to real
  data await `ensureStorageReady()`. The page exposes
  `data-storage-ready="<database>"` only after the schema exists.
- Each async operation captures its real or demo namespace before awaiting, so
  a mode change cannot redirect an in-flight operation.
- Blocked and version-change connections are closed safely.
- Desktop and mobile projects use separate origins (`127.0.0.1` and
  `localhost`), isolating their IndexedDB and service-worker state.
- The `@claim:demo-sandbox` test now creates the malformed version-1 database,
  waits for readiness, checks both stores, and proves demo reset/exit cannot
  expose or delete the project-specific real-data sentinel.
- Offline and update regressions wait for first-load service-worker control,
  removing an independent navigation/install race found during the full run.

The brief, visual system, product behavior, artifact class, and static PWA
deployment class are unchanged.

## Clean local verification

All commands ran on 2026-09-01 UTC after `npm ci`:

- Install: 61 packages, zero audit vulnerabilities.
- `npm run lint`: pass.
- `npm run test:unit`: 17/17 pass.
- `npm run build`: pass; `dist/` created with 24 precache entries.
- `npm test`: 17 unit/static tests and 67 Playwright tests pass; three
  desktop-only skips are intentional viewport exclusions.
- Every one of the 22 commands in `.factory/claims.json` passed independently
  in desktop and mobile projects, except the documented desktop exclusion for
  the mobile-controls claim.
- The literal `npm test -- --grep @claim:demo-sandbox` passed five independent
  repetitions: 10/10 project runs.
- The offline claim passed three independent repetitions: 6/6 project runs.
- The update regression passed three independent repetitions: 6/6 project
  runs.
- Desktop and exact 390 by 844 mobile browser checks passed. There was no
  horizontal overflow and no interactive target below 44 CSS pixels.
- Axe reported zero violations on landing, demo, completion, history, mobile,
  privacy, terms, and 404 states. Keyboard-only use, the 3 px focus treatment,
  skip link, control labels, and reduced-motion behavior passed.
- Privacy recording observed only the tested origin. There are no analytics,
  third-party scripts, fonts, runtime APIs, accounts, or payments.
- PWA installation/control, update handling, and offline reload with the
  `52 − 18` demo state passed. The unknown route returned HTTP 404.
- Local Lighthouse mobile scores: Performance 99, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1,810 ms, CLS 0.0049, TBT 0 ms.
- Initial main JS is 41,565 bytes raw (12,140 bytes gzip). CSS is 28,215 bytes
  raw (6,455 bytes gzip). There are no font downloads. All remain within the
  product budgets.
- `git diff --check`: pass. The copy audit has no public sentence over 22 words
  and no banned term.

Primary command logs are under `.factory/evidence-repair-17/`, including
`clean-full-test.txt`, `all-claims.txt`, `demo-sandbox-repeated.txt`,
`offline-repeated.txt`, `update-repeated.txt`, `build.txt`, and browser
screenshots/results. Package/consumer, API, concurrency, authentication, and
payment checks do not apply to this static local-first PWA.

## Deployment and live verification

The current `dist/` was deployed to the production environment of the scoped
`sf-arithmetic-steps` Static Web App. No unrelated service, setting, secret,
storage account, staging slot, DNS record, or infrastructure was read or
changed. The deployment CLI's temporary `.env` was removed unread.

- `verify-url.sh`: HTTP 200; correct title, `lang=en`, one `<h1>`, `<main>`, alt
  text, labelled buttons, and zero console errors.
- Independent browser QA: PASS on desktop and exact 390 px mobile. Functional,
  keyboard, reduced-motion, Axe, privacy, PWA/offline, routes, and link checks
  all passed.
- Live Lighthouse mobile scores: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1,126 ms, CLS 0.0049, TBT 22 ms.
- Root headers include a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, strict referrer policy, restrictive permissions policy, and frame
  denial. Hashed assets are immutable for one year; the worker is `no-store`;
  the manifest revalidates.
- Live `index.html`, `sw.js`, `manifest.webmanifest`, main JS, version JS, and
  CSS are byte-identical to the repaired local build. Exact SHA-256 values are
  in `.factory/evidence-repair-17/live-identity.json`.

Live results are in `live-browser.json`, `live-url/verify.json`,
`lighthouse-live.json`, `live-*-headers.txt`, and `live-identity.json`.

## Known gaps and next steps

No known release-blocking product gaps remain. Request independent verification
against the repaired main branch and version `1.0.11` deployment.
