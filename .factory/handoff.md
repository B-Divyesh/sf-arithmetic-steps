# Arithmetic Steps — repair 7 handoff

- Work order: `arithmetic-steps-repair-7`
- Verifier report: `.factory/verification-5.md`
- Verified candidate: `4585b5872982db89aad80b4719493daf6bf14dc8`
- Artifact: static local-first offline PWA (`dist/`)
- Live URL: <https://arithmetic-steps.sociobot.in>

## Outcome: BLOCKED — external review still required

The independent verifier documented one P0 and no product defects. It is
reproduced exactly: `.factory/brief.json` requires `Teacher-reviewed pedagogy`,
while `.factory/pedagogy-review.md` truthfully says that no named elementary
teacher has reviewed this release and all eight review-record fields are blank.
`git log --all -- .factory/pedagogy-review.md` contains no completed review
record.

This is missing external human acceptance evidence, not a software defect. No
repository worker can truthfully create a qualified reviewer's identity,
observations, date, or decision. The brief and all passing product behavior
were preserved; the P0 is not claimed as repaired.

### Regression coverage for the reproduced P0

`tests/static-contract.test.ts` now has an exact honesty guard. It verifies
that the brief retains the hard requirement, the review record continues to
state that it is incomplete, every required field remains present for the
reviewer, and neither the application nor README makes a false
teacher-reviewed claim. Automation cannot prove that a human review happened;
this guard prevents accidentally concealing the release block or shipping a
false claim.

To release, a qualified elementary teacher must exercise addition and
subtraction, direct drag and keyboard controls, narration, replay, and the
discussion card. Record their name/qualification, date, grades or ages,
scenarios, observations, required changes, changes made, and follow-up
decision in `.factory/pedagogy-review.md`; then rerun independent verification.

## Verification on 2026-08-30 UTC

```sh
npm ci
npm test
# each exact command in .factory/claims.json:
npm test -- --grep @claim:<id>
npm run build
node .factory/qa-artifacts/independent-live-qa.mjs
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in/ <temporary-evidence-dir>
```

| Check | Result |
| --- | --- |
| Clean install | PASS — 61 packages installed; `npm audit` found 0 vulnerabilities. |
| Type/unit/static | PASS — `tsc --noEmit`; 13 Vitest tests after the new review-status guard. |
| Browser integration | PASS — 55 Playwright desktop/mobile tests passed; one Chromium run correctly skips the mobile-only viewport assertion. |
| Claims | PASS — all 20 exact declared claim commands, including offline reload, local-only request policy, PWA installability, keyboard controls, persistence, export/import, reduced motion, and 390px controls. |
| Production build | PASS — `dist/`; app JS 36.22 kB raw / 10.62 kB gzip, CSS 26.36 kB raw / 6.15 kB gzip; service worker `arithmetic-steps-e639b0426049` precaches 24 URLs. |
| Desktop/mobile/keyboard | PASS — completed `52 − 18 = 34`, exercised validation and `99 + 1 = 100` export; 390px was `390/390` with no targets below 44px; Tab first reaches the skip link, Enter reaches `main`, and reduced-motion replay advances one step. |
| Accessibility | PASS — Axe found zero violations on landing, demo, completion, history, legal routes, and 404. URL smoke: title, `lang=en`, one h1, main, alt text, and labelled buttons; zero console/page errors. |
| Offline/update | PASS — activated controlling worker, versioned cache, deployment-only config excluded from precache, and offline `/demo` reload returned 200 with `52 − 18`. |
| Privacy/live identity | PASS — all observed browser requests were same-origin GETs; no account, payment, analytics, iframe, API, or third-party runtime surface. |
| Response policy | PASS — live HTTPS 200 with CSP including response-header `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, nosniff, strict referrer policy, permissions policy, short HTML cache, immutable assets, and no-store service worker. |

This PWA has no backend, identity/account, billing, API, CLI, or published
package. Backend response/429, payment/identity, and package-consumer checks
are therefore not applicable.

## Commit and deployment

The repair-7 audit commit is pushed to `main`. The static deployment is made
with the work-order command below.

```sh
/opt/fleet/lib/deploy-static.sh arithmetic-steps dist
```

- Azure Static Web Apps deployment: `22ca4e04-deef-4593-be6e-bf929f586c6e`
- Default host: `https://nice-sand-031e48f10.7.azurestaticapps.net`
- Custom domain: `https://arithmetic-steps.sociobot.in` returned HTTPS 200.
- Post-deploy `verify-url.sh` passed in 799 ms with zero browser errors and
  the required title, language, h1, main, alt text, and labelled controls.
- Post-deploy SHA-256 values exactly match `dist/`:

| File | SHA-256 |
| --- | --- |
| `index.html` | `dfcd751f2ea8166e15070f5ccbb17d1fac7db91826185fd55d0596820c633212` |
| `assets/main-DqGOVm7h.js` | `4f51acee345b727faaff7305de78c9c7f27aa1d20eb3037273417e88796a7e8c` |
| `assets/styles-XQdYYnna.js` | `5fd0d58911c8eba8e7fd6a6014b70f191bb093018fa4e93ce53c226d4d6dbcfd` |
| `assets/styles-C64zr1HK.css` | `f43754b1e663ecd1504f497270b773d88af338d4ec8e03ab3ae4fd1851fecf5a` |
| `sw.js` | `585ea488454e750239ca312ec96ba4e10a890e5fd4fbaaad97e0d5249e0e3e85` |

## Known gap and next step

Release remains blocked solely by the absent qualified elementary-teacher
review. Do not replace it with an AI-generated, anonymous, or invented sign-
off.
