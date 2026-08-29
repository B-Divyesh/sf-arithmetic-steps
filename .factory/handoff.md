# Arithmetic Steps — repair 6 handoff

- Work order: `arithmetic-steps-repair-6`
- Verifier report: `7985208c766353af83eafc990160e09e095b1904`
- Verified candidate: `d0cc4bc4b49097539ce8aa35b4ebd0e28a7caa9b`
- QA-harness repair: `460bd01` (`test: repair independent live QA harness`)
- Artifact: static local-first offline PWA (`dist/`)
- Live URL: <https://arithmetic-steps.sociobot.in>

## Outcome: technical QA PASS; release remains blocked

The verifier's only documented product-QA blocker is still real: the researched
brief requires **teacher-reviewed pedagogy**, while
`.factory/pedagogy-review.md` truthfully records that no named qualified
elementary teacher has reviewed this release. The brief and current product
behavior were preserved. A repository worker cannot honestly manufacture a
human qualification, review date, observations, or approval, so this P0 is
not claimed as repaired.

All executable product, PWA, privacy, accessibility, response-policy,
deployment, and claims checks pass. The deployment is technically healthy but
must not be treated as release-acceptable until the external review below is
recorded.

## P0 reproduction and required resolution

Reproduced by reading both sources of truth:

- `.factory/brief.json` lists `Teacher-reviewed pedagogy` as a constraint.
- `.factory/pedagogy-review.md` says no named elementary teacher has reviewed
  this release; the required-review fields are empty. Git history contains no
  earlier completed review record.

Root cause: missing external human acceptance evidence, not a software defect.
There is no truthful automated regression that can prove a person performed a
review. Do not replace this requirement with an AI-generated or invented
sign-off.

Required next step: a qualified elementary teacher must exercise addition and
subtraction, direct dragging and keyboard alternatives, narrated steps,
replay, and the discussion card. Record their name and qualification, date,
grades/ages, scenarios, observations, feedback, required changes, completed
changes, and follow-up decision in `.factory/pedagogy-review.md`; then rerun
independent verification.

## Repair completed: independent live QA harness

While rerunning the required live verification, the independent checker itself
failed before it could validate the healthy product. Its selectors still used
14 retired copy strings, including `Finish the route`, `You arrived at`,
`Begin the route`, `Clear saved routes`, `Play route`, and `one station`.
The shipped PWA correctly uses `Finish the problem`, `The answer is …`, and
`Play steps`.

- Updated `.factory/qa-artifacts/independent-live-qa.mjs` for all current
  completion, validation, saved-problems, keyboard, and reduced-motion names.
- Added a static regression contract in `tests/static-contract.test.ts`. It
  asserts source and checker agreement on all corrected copy and rejects all
  retired strings. This is exact coverage for the reproduced harness defect.
- The corrected live checker passes desktop, 390px mobile, keyboard/reduced
  motion, offline PWA, routes, links, privacy origins, and Axe checks.

## Clean verification evidence

Run on 2026-08-29 UTC from a clean install:

```sh
npm ci
npm test -- --fully-parallel --workers=4
npm run build
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in/ <temporary-evidence-dir>
```

| Check | Result |
| --- | --- |
| Clean install | PASS — 61 packages; 0 audit vulnerabilities. |
| Type/lint | PASS — `tsc --noEmit`. |
| Unit/static contracts | PASS — 12 tests, including the new live-checker regression. |
| Browser integration | PASS — 55 passed; 1 expected desktop skip for the mobile-only assertion. |
| Claims | PASS — all 20 exact `npm test -- --grep @claim:<id>` commands. |
| Production build | PASS — JS 36,216 B raw / 10,620 B gzip; CSS 26,361 B raw / 6,150 B gzip. |
| Service worker | PASS — `arithmetic-steps-e639b0426049`, 24 precached URLs; no deployment config precached. |
| Local URL smoke | PASS — title, `lang=en`, one h1, main, alt text, labelled controls, and zero console errors. |

Corrected live matrix results:

- Completed `52 − 18 = 34`; invalid input stayed available for recovery;
  `99 + 1 = 100` exported correctly; invalid JSON and clear-data paths worked.
- At exactly 390 CSS px, `scrollWidth` = `clientWidth` = 390, all measured
  controls were at least 44 px, and Axe found zero violations.
- Keyboard starts at a 3 px brass/ink focus ring on the skip link; Enter moves
  focus to `main`. Reduced motion advances one replay step and announces it.
- Axe found zero total violations on landing, demo, completion, history, legal
  pages, and 404; no console/page errors occurred.
- Cold live requests were same-origin only; there are no account, payment,
  child-identifier, analytics, iframe, third-party runtime, or API requests.
- The activated worker controlled `/demo`, excluded `staticwebapp.config.json`
  from precache, and offline reload returned HTTP 200 with `52 − 18`.
- Internal links passed; the unknown route is a styled HTTP 404 with one h1
  and main landmark.

Post-deployment mobile Lighthouse: Performance **100**, Accessibility **100**,
Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.1 s**, TBT **20
ms**, CLS **0.005**, transfer **43 KiB**.

## Deployment and identity

Deployed with the work-order configuration:

```sh
/opt/fleet/lib/deploy-static.sh arithmetic-steps dist
```

- Azure Static Web Apps deployment: `91139341-129e-46d5-a23e-8ba442b0e513`
- Default host: `nice-sand-031e48f10.7.azurestaticapps.net`
- Custom domain: `https://arithmetic-steps.sociobot.in` returned HTTP 200.
- Post-deploy URL smoke passed with zero console errors and required
  title/lang/h1/main/alt/label checks.
- Response policy passed: CSP including response-header `frame-ancestors 'none'`,
  HSTS, `X-Frame-Options: DENY`, nosniff, strict referrer policy,
  permissions policy, short HTML cache, and non-cacheable `sw.js`.

Post-deploy artifacts exactly match `dist/`:

| File | SHA-256 |
| --- | --- |
| `index.html` | `dfcd751f2ea8166e15070f5ccbb17d1fac7db91826185fd55d0596820c633212` |
| `assets/main-DqGOVm7h.js` | `4f51acee345b727faaff7305de78c9c7f27aa1d20eb3037273417e88796a7e8c` |
| `assets/styles-XQdYYnna.js` | `5fd0d58911c8eba8e7fd6a6014b70f191bb093018fa4e93ce53c226d4d6dbcfd` |
| `assets/styles-C64zr1HK.css` | `f43754b1e663ecd1504f497270b773d88af338d4ec8e03ab3ae4fd1851fecf5a` |
| `sw.js` | `585ea488454e750239ca312ec96ba4e10a890e5fd4fbaaad97e0d5249e0e3e85` |

## Applicability and known gap

This remains the requested static PWA with local IndexedDB data. It has no
backend, account/identity system, billing, product API, AI call, CLI, or
published package; backend response/429, payment/identity, and package-
consumer checks do not apply. Applicable local-first privacy, offline/update,
browser, response-policy, and deployed-artifact checks above were run.

Known release gap: the named elementary-teacher review remains outstanding.
