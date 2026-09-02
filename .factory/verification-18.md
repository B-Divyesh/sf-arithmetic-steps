# Independent verification 18 — PASS

Verified candidate commit `4d648754a4db16052dad4e5d2acfa740c0a3064f` against
<https://arithmetic-steps.sociobot.in> on 2026-09-02.

## Verdict

**PASS.** No release-blocking, critical, high, medium, or low defects were
found. The current live app is build `1.0.14`; its served JS and CSS asset
names, byte sizes, and contents match a fresh production build of this
candidate.

## First-read result

Cold-opening the live landing page made the job clear in plain words: it lets
elementary children, with a teacher or parent, move counters to explain how an
addition or subtraction answer changes. The first action is the visible button
**Try it with sample data**, which opens the isolated part-complete `52 − 18`
demo in one click. The page also states its offline, local-only, free/no-account
facts. Cold HTTP status was 200; there were no console or page errors and no
third-party requests.

## Clean-checkout quality gates

- `npm ci` completed with 0 reported vulnerabilities.
- All 23 literal test commands declared by `.factory/claims.json` were run
  independently and passed. Each command included TypeScript checking and the
  unit suite, then exercised the tagged Playwright claim from the demo entry
  point.
- `npm test` passed: TypeScript lint, 19 Vitest/static-contract tests, and all
  74 Playwright tests (`test-results/.last-run.json` is `passed`).
- `npm run build` passed and generated `dist/`. Production main JS is 12.92 kB
  gzip and CSS is 6.47 kB gzip, well inside the static PWA budgets.

| Claim ID | Result |
| --- | --- |
| demo-sandbox | PASS |
| offline-reload | PASS |
| local-only | PASS |
| installable-pwa | PASS |
| visible-focus | PASS |
| tens-and-ones | PASS |
| direct-manipulation | PASS |
| narrated-steps | PASS |
| replay-and-discussion | PASS |
| free-no-account | PASS |
| arithmetic-bounds | PASS |
| keyboard-controls | PASS |
| unfinished-persistence | PASS |
| completed-persistence | PASS |
| json-export | PASS |
| json-import | PASS |
| clear-data | PASS |
| print-card | PASS |
| reduced-motion | PASS |
| mobile-controls | PASS |
| facilitator-checklist | PASS |
| self-guided-checklist-guidance | PASS |
| no-game-mechanics | PASS |

## Independent live QA

- The supplied `verify-url.sh` passed in 714 ms: title, `lang=en`, exactly one
  h1, main landmark, complete image alt text, labelled buttons, and no console
  errors. Raw result: [`verify.json`](evidence-verification-18/live-root/verify.json).
- Normal flow: completed `8 + 7 = 15`, checked the `10 + 5` narration and
  replay wording, and confirmed the finished route appears in Saved problems.
- Recovery: an invalid `90 + 20` shows “Choose numbers with a total of 100 or
  less.” and retains both entered values. The corrected route then completes.
  The complete claim suite additionally covers decimals, blanks, below-zero
  subtraction, persistence races, import/export, clear confirmation, printing,
  keyboard operation, direct manipulation, and both desktop/mobile contexts.
- At exactly 390 CSS px, `scrollWidth === clientWidth === 390`. The focused
  skip link has a visibly rendered brass outline (captured in the verifier's
  mobile screenshot), it moves keyboard focus to `main`, and Axe found zero
  violations on the live `/demo` screen (therefore zero serious/critical).
- With reduced motion, the live demo worked without browser errors. The passed
  reduced-motion claim confirms replay advances one step at a time rather than
  animating automatically.
- PWA: `/demo` installed and was controlled by `/sw.js`; while offline it
  reloaded and retained the `52 − 18` sample. `registration.update()` completed
  cleanly with the same active controller and no waiting worker. The passed
  full Playwright suite also checks the update toast/skip-waiting path.
- Links from the live landing page all resolved: `/`, `/practice`, `/demo`,
  `/saved-problems`, `/privacy/`, `/terms/`, the source link, and anchors all
  returned 200. A nonexistent live route returned a CSP-protected 404.

## Privacy, headers, identity, and performance

- The cold landing and live demo request logs contained only same-origin GET
  requests to `https://arithmetic-steps.sociobot.in`; there were no frames,
  third-party runtime requests, account/payment controls, or browser errors.
  This independently agrees with the passing `local-only` claim.
- Live responses send a self-only CSP (`connect-src 'self'` and
  `frame-ancestors 'none'`), HSTS, `nosniff`, `DENY` framing, strict referrer
  policy, and restrictive permissions policy. Hashed assets use one-year
  immutable caching; `/sw.js` is no-store/no-cache.
- This is a static PWA with no product server endpoint, sign-in, billing, or
  unlock API. A request-allowance/429 test is therefore not applicable.
- Fresh mobile Lighthouse was **99 Performance, 100 Accessibility, 100 Best
  Practices, and 100 SEO**; LCP was 1.279 s, CLS 0, TBT 118 ms. Raw report:
  [`lighthouse-live.json`](evidence-verification-18/lighthouse-live.json).

## Defects by severity

None found.
