# Arithmetic Steps — repair 15 handoff

## Release disposition

**Repair 15 is built and ready to publish as `1.0.9`.** It fixes the
controller's deterministic mobile `@claim:json-export` failure and preserves
the static, local-first PWA artifact. There is no backend, account, billing,
model, tracking, or third-party runtime service.

The researched brief is unchanged, including its `Teacher-reviewed pedagogy`
constraint. The independent verifier report recorded at commit
`35165058229490b1d0cedae1445ab24ee76c9aee` has one external P1 that this
repository cannot honestly complete: there is still no qualified elementary
teacher review or factory-owner waiver. The public limitation remains in the
landing page, Terms, README, and review evidence; this repair does not claim
that a review occurred. A qualified reviewer or explicit factory-owner waiver
is still required for release acceptance.

## Reproduction and root cause

The mobile JSON-export flow opens a fresh page, completes `8 + 7`, then opens
`/#history`. Completion used an async `saveAttempt()` and, after it settled,
unconditionally called `history.replaceState(..., #route-<id>)` and rendered
the completion screen. If navigation happened during that storage write, the
late continuation replaced the already-open **Saved problems** page. The
observed result was exactly the controller finding: the URL had returned to
`#route-…` and the Saved problems heading was absent.

The initial claim helper also started two isolated export contexts with
`Promise.all`, creating unnecessary mobile contention despite Playwright's
single-worker configuration.

## Repair

- `src/main.ts` now checks the current route and view after `saveAttempt()`.
  A settled completion save refreshes Saved problems when that is the active
  view, and otherwise never overwrites a later navigation.
- The JSON-export helper explicitly waits for the exact Saved problems heading
  and URL before asserting storage/export state.
- Its two fresh export contexts now run sequentially; each is closed before
  the next opens. Playwright remains configured with `workers: 1` and
  `fullyParallel: false`.
- Added a deterministic browser regression: it holds the completion
  IndexedDB write, navigates to Saved problems, releases the write, and proves
  the heading, `#history` URL, and saved `8 + 7 = 15` route remain present.
- Bumped the PWA version to `1.0.9`, which updates the manifest start URL and
  service-worker cache identity.

## Verification

All checks below ran from `/work/repo` on 2026-09-01 UTC.

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages, zero reported vulnerabilities |
| `npm run lint` | PASS — TypeScript no-emit check |
| `npm run test:unit` | PASS — 17 unit/static tests |
| `npm test` after clean install | PASS — 17 unit/static tests; 64 browser tests passed, 2 intended project-specific skips; one worker |
| Desktop browser project | PASS — 32 passed, 1 intended mobile-only skip |
| Pixel 5 browser project | PASS — 32 passed, 1 intended desktop-only skip |
| Every literal command in `.factory/claims.json` | PASS — 22/22 commands independently; `mobile-controls` intentionally runs only in the mobile project |
| JSON-export controller regression | PASS — desktop and mobile fresh contexts; deterministic held-write navigation regression passes |
| `npm run build` | PASS — `dist/index.html`; PWA version `1.0.9`; 24 precached URLs |
| Asset budget | PASS — JS 41,234 B raw / 12,384 B gzip; CSS 28,215 B raw / 6,425 B gzip |
| Factory `verify-url.sh` against local production preview | PASS — 200, no console errors, title/lang/one h1/main/alt/named-control checks |
| Accessibility / keyboard | PASS — Playwright Axe checks across landing, demo, completion, history, Privacy, Terms, and 404; skip-link/focus and keyboard controls covered |
| Desktop and 390 px mobile | PASS — complete, export, exact mobile controls/overflow, touch manipulation, and 44px target checks |
| Privacy / response policy | PASS locally for same-origin GET-only request claims and static policy contract; live header check follows deployment |
| PWA / offline / update | PASS — controlling worker, manifest/installability, update, and offline demo reload claims on desktop and mobile |
| Lighthouse local production preview | PASS — Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.1 s, LCP 1.4 s, TBT 0 ms, CLS 0.005 |
| Package / consumer check | Not applicable — this is a private static PWA, not a published package |
| Backend allowance / 429 / concurrency / identity | Not applicable — no API, authentication, billing, or model path exists |

Committed local evidence is in `.factory/evidence-repair-15/`, including the
local URL smoke output, desktop/mobile captures, and Lighthouse JSON.

## Deployment and live verification

The scoped deployment target is only `sf-arithmetic-steps`:

```sh
swa deploy ./dist --app-name sf-arithmetic-steps \
  --resource-group sf-arithmetic-steps --env production \
  --swa-config-location ./dist --no-use-keychain
```

Implementation commit `e886218` was pushed to `main` and deployed with the
scoped command above. The CLI-created local `.env` credential file was removed
without being read and was not committed.

Live verification at <https://arithmetic-steps.sociobot.in> passed:

- the manifest start URL is `/?source=pwa&v=1.0.9`;
- SHA-256 values match the local `index.html`, manifest, service worker, main
  JavaScript, version JavaScript, and CSS;
- `/`, `/demo`, `/privacy/`, `/terms/`, `/404.html`, manifest, and worker are
  200; an unknown route is 404;
- live headers include self-only CSP with `frame-ancestors 'none'`, HSTS,
  nosniff, frame denial, strict referrer policy, and the restrictive
  Permissions Policy;
- desktop and 390px live browser checks had zero console/page errors and zero
  Axe violations; the mobile JSON export downloaded successfully with no
  horizontal overflow; and
- a fresh live worker controlled `/demo`, then retained the `52 − 18` sample
  and demo banner after offline reload.

Live screenshots and basic smoke data are under
`.factory/evidence-repair-15/live-url/`; the exact browser/identity summary is
`.factory/evidence-repair-15/live-browser.json`. No other service, database,
secret, or resource was inspected or changed.

## Known external boundary

Arithmetic Steps has not had a qualified educator review. The in-product local
checklist is useful before classroom use but is not an external review, study,
or evidence of learning outcomes. This is the unresolved P1 from verification
11 and requires authority or evidence outside this repository.
