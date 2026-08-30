# Independent verification 9 — FAIL

- Candidate commit: `d35103815a4eda9487d57b5bbeb95176e5a71f80`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-08-30 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P1 — a blank addition field is silently changed to zero

On a fresh live landing page:

1. Clear **First number**.
2. Leave **Second number** as `7`.
3. Press **Start the problem**.

The product opens a `0 + 7` route at `/#route`. It shows no validation error.
The child did not enter zero: the empty string is coerced with `Number("")`.
The form is marked `novalidate`, so its `required` attributes do not protect
this path.

This violates the public claim that routes use whole numbers from 0 to 100,
the accessibility expectation that required fields are enforced, and the
work order's explicit invalid-input and recovery requirement. It is especially
misleading in a product whose job is to preserve a child's chosen arithmetic
steps. The declared `@claim:arithmetic-bounds` test checks an excessive sum, a
decimal, and a negative subtraction result, but misses empty numeric fields.

Fresh evidence:

- `.factory/evidence-9/live/boundary-invalid-inp.json`
- `.factory/evidence-9/live/blank-first-accepted-as-zero.png`

**Required resolution:** inspect the raw input strings before numeric
conversion. Reject either blank field with a plain, announced error, preserve
the other entered value, and focus the first blank field. Extend the existing
`@claim:arithmetic-bounds` test to clear each field in turn and prove that no
route opens, then prove recovery after entering a valid number.

## Mandatory first-read and demo gate — PASS

A cold live browser showed, above the fold:

- What: **Explore addition and subtraction steps**.
- For whom: “For elementary children with a teacher or parent.”
- First action: **Try it with sample data**.
- Facts: works offline after first visit, device-only problems, and free with
  no accounts or scores.

The primary action is visible without scrolling. One click opened `/demo`,
showed the persistent “Demo — sample data, nothing is saved” banner, and loaded
the part-complete `52 − 18` sample at `42 − 8`. The first-read/demo hard gate
passes.

## Claims gate — declared tests PASS, independent claim probe FAIL

`.factory/claims.json` exists and lists 20 claims. After `npm ci`, every exact
manifest command was run separately from the demo entry point and exited 0:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `installable-pwa` | PASS |
| `visible-focus` | PASS |
| `tens-and-ones` | PASS |
| `direct-manipulation` | PASS |
| `narrated-steps` | PASS |
| `replay-and-discussion` | PASS |
| `free-no-account` | PASS |
| `arithmetic-bounds` | PASS in the declared suite; FAIL for blank input in independent QA |
| `keyboard-controls` | PASS |
| `unfinished-persistence` | PASS |
| `json-export` | PASS |
| `json-import` | PASS |
| `clear-data` | PASS |
| `print-card` | PASS |
| `reduced-motion` | PASS |
| `mobile-controls` | PASS in mobile; intended desktop-project skip only |
| `no-game-mechanics` | PASS |

For transparency, the required literal pre-install invocations all stopped at
`tsc: not found` (`exit 127`) because a clean clone has no dependency tree.
That is an installation prerequisite, not an assertion result. After the
locked install, all 20 commands entered and passed their tests. Raw outputs are
in `.factory/evidence-9/claims/`.

Landing, legal, README, and application copy were cross-checked against the
manifest. No separate material promise was found without a claim entry. The
problem is inadequate coverage of the existing arithmetic-bounds claim.

## Clean candidate gates — PASS

- `git rev-parse HEAD`: exact candidate
  `d35103815a4eda9487d57b5bbeb95176e5a71f80`.
- `npm ci`: PASS — 61 packages installed, 0 audit vulnerabilities.
- `npm run lint`: PASS — TypeScript clean.
- `npm run test:unit`: PASS — 14/14 Vitest checks.
- `npm test`: PASS — 14/14 Vitest checks and 56 Playwright checks; two
  project-specific skips were intentional.
- `npm run build`: PASS — exact production build created `dist/`; worker
  version `arithmetic-steps-3041ebf6ce4f` precaches 24 URLs.
- Output sizes: main JS 36,907 bytes raw / 10.91 kB gzip; loader JS 755 bytes;
  CSS 26,424 bytes raw / 6.17 kB gzip; mobile AVIF 16,183 bytes; no fonts.
  These are comfortably below the static-PWA budgets.

## Independent end-to-end QA

The useful core works apart from the blank-input blocker:

- Completed the one-click sample `52 − 18 = 34`, then verified narration,
  replay, saved work, and discussion prompts.
- Completed the upper result boundary `99 + 1 = 100` and lower result boundary
  `100 − 100 = 0`.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, and `5 − 6` with actionable errors
  while retaining entered values.
- Downloaded and parsed a completed-route JSON export; malformed JSON was
  rejected; cancel preserved saved work and confirmation removed it.
- The independent blank-field case failed as described above.
- At exactly 390 CSS px, document width was exactly 390 px and no sampled
  visible link, button, input, select, quick choice, or direct counter was
  below 44×44 px.

## Accessibility and interaction — PASS except the blocker

- Factory `verify-url.sh`: PASS in 708 ms with the expected title, `lang=en`,
  one `h1`, one `main`, no missing alt text, no unnamed buttons, and no browser
  errors.
- Axe found zero total violations, including zero serious/critical findings,
  on landing, demo, completion, empty history, exact-390 demo, Privacy, Terms,
  and the styled 404.
- Keyboard: first Tab reached the skip link; Enter focused `main`; sampled
  focus indicators were a visible 3 px brass outline with 3 px offset.
- Labelled keyboard controls completed arithmetic in the claim suite.
- Reduced motion changed animations to `0.01ms`, made scroll instant, and
  advanced replay by one step per activation.
- At 200% root text size on a 1280 px viewport, document width remained 1280
  px and no hidden/clip-overflow element clipped text.
- The blank-field defect defeats the intended required-field behavior even
  though labels and error live regions otherwise pass.

## Privacy, security, routing, and deployment — PASS

- A fresh complete live demo and worker install made 30 requests: all were
  same-origin GETs, 25 came from the service worker, none had a body, and no
  console/page errors occurred. No analytics, third-party font/script, model,
  account, payment, iframe, or identifying-input path exists.
- Live CSP is self-only and sends `frame-ancestors 'none'` as a response
  header. HSTS, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and
  restrictive Permissions Policy are present.
- HTML uses 30-second revalidation; hashed assets use one-year immutable
  caching; the manifest uses `no-cache`; `sw.js` uses `no-store`.
- `/`, `/demo`, `/privacy/`, and `/terms/` return 200; the styled unknown route
  returns HTTP 404; every crawled link returned 2xx/3xx.
- All 29 deployable files in fresh local `dist/` matched their live responses
  byte-for-byte by SHA-256. `staticwebapp.config.json` is correctly
  deployment-only. Production therefore matches the candidate exactly.

## PWA and performance — PASS

- The live worker activated, controlled `/demo`, and used cache
  `arithmetic-steps-3041ebf6ce4f`; its precache excludes deployment metadata.
- Live offline reload returned 200 and retained the `52 − 18` sample.
- A fresh live waiting-worker update displayed “An update is ready”; applying
  it switched the controller to the new worker URL without losing `42 − 8` or
  the demo banner.
- Chromium reported no installability errors.
- Lighthouse 13.4.1 mobile: Performance 98, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 160 ms, CLS 0.005, Speed Index 0.9 s,
  and 43 KiB transferred.
- A fresh four-times CPU-throttled Event Timing run across three main demo
  interactions measured a worst interaction duration of 80 ms.

## Applicability notes

This is a backend-free, local-first static PWA. It has no library/CLI package,
server endpoint, product-unlock call, authentication, billing, or model call.
Consumer install, backend concurrency/persistence, API 429 allowance, and
Microsoft Entra authority checks are not applicable. No AI runtime feature is
warranted for the brief's direct-manipulation learning job.

## Evidence

Fresh machine-readable results, screenshots, headers, hashes, Lighthouse JSON,
URL smoke output, privacy log, PWA-update result, and claim logs are under
`.factory/evidence-9/`. No product code was changed.
