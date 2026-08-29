# Independent verification 2 — FAIL

Verified: 2026-08-29 UTC

Candidate: `36baa8cfba30bd127a29866751ef94583983d397`

Live URL: <https://arithmetic-steps.sociobot.in>

Artifact: static local-first PWA

## Decision

**FAIL — do not release.** The deployed product does not satisfy its tested
“Works offline after the first visit” claim. A fresh live service worker
becomes redundant during installation because its precache includes
`/staticwebapp.config.json`, while the deployed host returns 404 for that URL.
The page is never controlled and a fresh offline reload fails with
`net::ERR_INTERNET_DISCONNECTED`.

The claims inventory is also incomplete under the acceptance contract. The
landing page and README make several observable promises that have no entry
and no exactly tagged test in `.factory/claims.json`.

## Mandatory first-read and claims gates

### Cold first read

**PASS.** A fresh desktop Chromium visit, before inspecting implementation,
showed:

- What: “Explore addition and subtraction steps.”
- For whom: “For elementary children with a teacher or parent…”
- First click: “Try it with sample data.”

That one click opens `/demo`, shows the persistent sample-data banner, and
lands in a part-complete `52 − 18` route at `42 − 8`.

### Declared claim tests

The first pre-install invocation of each exact command stopped at
`tsc: not found`; no claim assertion ran. After the required `npm ci`, all
exact commands passed from the candidate checkout:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS — desktop and mobile |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — desktop; mobile intentionally skipped by the suite |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — desktop and mobile |

**Live contradiction / release blocker:** the local offline test runs against
Vite preview, which serves `dist/staticwebapp.config.json`. Azure Static Web
Apps consumes that deployment file and does not serve it. Therefore the local
test passes while the identical deployed worker fails to install.

### Claims cross-check

**FAIL / release-blocking.** Examples of public promises absent from
`.factory/claims.json` include:

- Landing: “The counters show tens and ones.”
- Landing: “Each choice becomes a sentence…”
- Landing: “Step through the route…”
- Landing: “Free…”
- README: replay, a print-ready discussion card, JSON export/import, unfinished
  route persistence, keyboard operation, reduced-motion behavior, and
  addition/subtraction bounds.

Independent QA observed most of these features working, but the claims
contract requires each public promise to be declared with one corresponding
`@claim:<id>` observable test. `.factory/copy-audit.md` likewise contains only
a subset of landing sentences rather than the required complete extraction.

## Defects

### P0 — release blockers

1. **The deployed offline claim is false.** Fresh-browser evidence:
   `sw.js` transitions `installing → redundant`; there are zero service-worker
   registrations and no controller. `/staticwebapp.config.json` returns HTTP
   404 but appears in the worker’s `PRECACHE`. Fresh offline reload then fails
   with `net::ERR_INTERNET_DISCONNECTED`. No worker can reach the update flow.
2. **Public claims are not fully registered/tested.** The examples above are
   absent from `.factory/claims.json`, which violates the explicit claims
   acceptance gate.

### P1 — must fix before release

1. **Two demo quick-choice buttons miss the mobile touch-target minimum.** At
   390 px, the visible `2` and `8` buttons measure 41 × 45 CSS px. The contract
   requires both dimensions to be at least 44 px.
2. **Required teacher review is not evidenced.** The researched brief requires
   teacher-reviewed pedagogy. No named review or review record exists, and the
   handoff/Terms acknowledge that pedagogy is still being reviewed.

### P2 — accessibility semantics

1. Axe reports one moderate `landmark-complementary-is-top-level` violation on
   landing/demo/completion: `.grownup-note` is an `aside` nested inside the
   main landmark. There are **zero serious or critical** axe findings.

## Local clean-checkout gates

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate identity | PASS | `HEAD` exactly `36baa8cfba30bd127a29866751ef94583983d397`; worktree initially clean |
| `npm ci` | PASS | 61 packages; 0 vulnerabilities |
| `npm run lint` | PASS | `tsc --noEmit` (also run by `npm test`) |
| `npm test` | PASS on unchanged rerun | 9 Vitest/static tests; 17 Playwright passed; 3 intentional skips |
| First `npm test` attempt | Infrastructure flake | Chromium headless shell crashed with SIGSEGV while creating one mobile context; the exact rerun passed |
| `npm run build` | PASS | Vite production build plus SW generation; `dist/` created with 25 precached URLs |
| Initial JS | PASS | 32,023 B raw / 9,504 B gzip |
| Initial CSS | PASS | 24,581 B raw / 5,762 B gzip |

No separate formatter or ESLint command is declared. Type checking is the
repository’s `lint` script.

## Independent live product exercise

### Working behavior

- Completed the one-click `52 − 18` sample to 34, replayed narration, and saw
  the discussion card.
- Completed `99 + 1 = 100`, `100 + 0 = 100`, and `100 − 100 = 0`.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, and `5 − 6` with specific errors;
  entered values remained available for correction.
- Preserved an unfinished `38 + 27` route at `40 + 25` across reload in the
  `arithmetic-steps` IndexedDB namespace.
- Print invoked the browser print action. Copy produced a plain-text equation,
  narrated steps, and discussion prompts.
- Exported a 1,006-byte JSON route file, cleared history, imported it, and
  restored `8 + 7 = 15`. Malformed JSON produced an announced error. Clear
  cancellation preserved data; confirmation removed it.
- Desktop and 390 px layouts had no horizontal overflow. Backed routes,
  privacy, terms, demo, and a true 404 all returned the expected status/title,
  one `<h1>`, and one `<main>`. Every rendered link returned 2xx/3xx.
- Keyboard navigation starts with the skip link. After style settlement, focus
  uses a 3 px brass outline, 3 px offset, and 5 px ink ring. Enter operates the
  sample and route controls. No keyboard trap was observed.
- Reduced motion changes replay to one manual station per activation and
  reports that behavior; computed animation duration is 0.01 ms and scrolling
  is immediate.

### Privacy and browser health

- The full live flow made six observed requests, all to
  `https://arithmetic-steps.sociobot.in`; no third-party runtime request was
  seen.
- No console errors, uncaught page errors, or failed requests occurred during
  normal online desktop/mobile flows.
- Root/live assets send CSP with `frame-ancestors 'none'`, `X-Frame-Options:
  DENY`, `Permissions-Policy`, `Referrer-Policy`, and
  `X-Content-Type-Options: nosniff`.
- Hashed JS uses `Cache-Control: public, max-age=31536000, immutable`; `sw.js`
  uses `no-cache, no-store, must-revalidate`; HTML uses a 30-second cache.

### Accessibility and performance

- Axe on landing, demo, completed route, saved-route empty state, Privacy,
  Terms, and 404: 0 serious/critical findings. The moderate aside finding is
  listed above.
- Lighthouse 13.4.1 mobile: Performance 0.99, Accessibility 1.00, Best
  Practices 1.00, SEO 1.00. Measured LCP 1,158 ms, TBT 100 ms, CLS 0.0049.
- Bundle limits pass by a wide margin; no font payload or runtime third-party
  dependency was observed.

## Live/candidate identity

The deployed `index.html`, hashed main JavaScript, hashed CSS, and `sw.js` are
byte-identical to the fresh candidate build:

| File | SHA-256 |
| --- | --- |
| `index.html` | `b8c16f238d3814c7b0ce16eb819041a7c6535d527c932836a15fe8f698bbd3f1` |
| `main-BrvRDXhV.js` | `7ef7788f196df4e51381f9c834ff560dae4ccca66e1766b69edf6120446d85f6` |
| `styles-DU4PPhpV.css` | `bee88e3175283285608e4a2dc56575790e411b2fe82cb8d34ce3468e13905da1` |
| `sw.js` | `300aaa5281c19dd4dc8a45c40a4a40b6fca6173d11fc758ed21e63fae44e350f` |

This is not a stale-deployment finding; the candidate itself generates the
broken live precache list.

## Not applicable

This static PWA has no server-side product endpoint, unlock call,
authentication, billing, library package, or CLI. API allowance/429,
`Retry-After`, Entra authority, backend concurrency/health, and consumer-package
checks are not applicable. No missed AI feature is implied by this arithmetic
manipulative brief.

## Evidence and reproduction

- `.factory/qa-artifacts/independent-live-qa.mjs`
- `.factory/qa-artifacts/lighthouse-live.json`
- `.factory/qa-artifacts/live-cold-desktop.png`
- `.factory/qa-artifacts/live-desktop-landing.png`
- `.factory/qa-artifacts/live-desktop-complete.png`
- `.factory/qa-artifacts/live-mobile-demo.png`

Run the independent browser exercise with:

```sh
node .factory/qa-artifacts/independent-live-qa.mjs
```

Minimal offline reproduction:

1. Open `/demo` in a fresh Chromium context.
2. Observe worker state change from `installing` to `redundant`.
3. Confirm `GET /staticwebapp.config.json` is 404 and that path is in
   `sw.js` `PRECACHE`.
4. Set the browser context offline and reload; navigation fails with
   `ERR_INTERNET_DISCONNECTED`.
