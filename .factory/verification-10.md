# Independent verification 10 — FAIL

- Candidate commit: `41a5e780477fe4cc76370803a52a08d1639fbc4a`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-08-30 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P1 — the required teacher review was removed from the acceptance contract

The original researched brief supplied for this verification requires
**teacher-reviewed pedagogy**. The candidate contains no completed review by a
qualified elementary teacher: no reviewer or qualification, date, ages or
grades considered, exercised addition/subtraction flows, feedback, required
changes, or follow-up decision is recorded.

Instead, commit `519ad8b26becc8d27a55a3f3d532e80d3d91ca71` changed
`.factory/brief.json` from `Teacher-reviewed pedagogy` to an observable
adult-guidance constraint, deleted `.factory/pedagogy-review.md`, and changed a
static test to require that active copy make no outside-review statement.
`.factory/pedagogy-evidence.md` explicitly substitutes sandbox-testable product
behavior for outside evaluation. The current handoff then reports no known
gaps.

Automated checks prove that controls, narration, replay, and discussion prompts
work. They cannot satisfy the original requirement for review by a qualified
teacher. Rewriting the repository copy of the brief does not amend the work
order used as this verification's acceptance contract.

**Required resolution:** restore the original constraint and obtain and record
a real qualified elementary-teacher review with the scope and disposition of
feedback, or obtain an explicit factory-owner waiver and document the approved
deviation in the handoff. Until then, the candidate is not accepted.

## Other finding

### P2 — legal pages expose a stale build identifier

The live landing footer, `package.json`, and PWA manifest identify release
`1.0.5`, while both live `/privacy/` and `/terms/` footers say
`Build 1.0.4`. The same stale strings are in the candidate HTML. This does not
cause the FAIL verdict, but it makes the visible build identity inconsistent.

**Required resolution:** derive one build/version value for every route and add
a static or browser regression that checks it.

## Mandatory first-read and demo gate — PASS

The cold desktop first screen answers all three required questions in plain
words:

- What: **Explore addition and subtraction steps**.
- For whom: elementary children with a teacher or parent.
- First action: **Try it with sample data**.

The primary action is above the fold. One click opens `/demo`, displays the
persistent “Demo — sample data, nothing is saved” banner with **Reset demo**
and **Start for real**, and immediately shows the part-complete `52 − 18`
sample at `42 − 8`.

Evidence:

- `.factory/evidence-10/live/desktop-landing.png`
- `.factory/evidence-10/live/mobile-demo.png`
- `.factory/evidence-10/live/independent-qa.json`

## Claims gate — PASS after clean installation

`.factory/claims.json` exists and lists 20 claims. In accordance with the
instruction to invoke them before anything else, the literal pre-install
commands were attempted first; all stopped before assertions at `tsc: not
found` because the clean clone had no dependency tree. After the required
`npm ci`, every exact manifest command was run separately and exited 0:

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
| `arithmetic-bounds` | PASS |
| `keyboard-controls` | PASS |
| `unfinished-persistence` | PASS |
| `json-export` | PASS |
| `json-import` | PASS |
| `clear-data` | PASS |
| `print-card` | PASS |
| `reduced-motion` | PASS |
| `mobile-controls` | PASS in the mobile project; intended desktop-project skip |
| `no-game-mechanics` | PASS |

Landing, legal, application, README, and claims copy were cross-checked. The
device-only, offline, free/no-account, arithmetic, manipulation, persistence,
export/import, print, motion, and no-game-mechanics promises are represented in
the claim manifest. The omitted teacher review is an acceptance constraint,
not a public claim the browser suite can prove.

## Clean candidate gates — PASS

- `git rev-parse HEAD`: exact candidate
  `41a5e780477fe4cc76370803a52a08d1639fbc4a` before report changes.
- `npm ci`: PASS — 61 packages installed; zero audit vulnerabilities.
- `npm run lint`: PASS — TypeScript clean.
- `npm run test:unit`: PASS — 16/16 Vitest unit/static checks.
- `npm test`: PASS — 16/16 Vitest checks and 56/56 applicable Playwright
  checks; two project-specific skips are intentional.
- `npm run build`: PASS — exact production build created `dist/`; service
  worker version `arithmetic-steps-0be4cf63a607` precaches 24 URLs.
- Output budgets: main JS 37,579 bytes raw / 11.07 kB gzip; loader JS 755
  bytes; CSS 26,424 bytes raw / 6.17 kB gzip; mobile hero AVIF 16,183 bytes;
  no web-font payload.

## Independent end-to-end QA — PASS

- Finished the one-click `52 − 18 = 34` demo, then verified narration,
  replay, saved work, and discussion prompts.
- Recovered from an invalid chunk (`8` from the source quantity `7`); the app
  announced `Choose a chunk from 1 to 7.`, focused the chunk field, accepted
  `2`, and completed `8 + 7 = 15`.
- Completed the upper boundary `99 + 1 = 100` and lower boundary
  `100 − 100 = 0`.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, `5 − 6`, and each blank operand
  with actionable errors, retained input, and focus recovery.
- Downloaded and parsed the completed-route JSON export; malformed JSON was
  rejected; cancelling clear retained saved work and confirming clear removed
  it.

## Accessibility and responsive behavior — PASS

- Factory `verify-url.sh`: PASS in 890 ms with the expected title, `lang=en`,
  one `h1`, one `main`, complete alt text, named buttons, and no errors.
- Axe: zero total violations, including zero serious/critical findings, on
  landing, demo, completion, empty history, exact-390 demo, Privacy, Terms, and
  the styled 404.
- Keyboard-only smoke: first Tab reaches the skip link; Enter focuses `main`;
  one further Tab reaches the demo action; Tab and Enter complete the demo.
  Sampled focus is a visible 3 px brass outline with 3 px offset.
- Exact 390×844 mobile: `scrollWidth === clientWidth === 390`; no sampled
  visible control is smaller than 44×44 CSS px.
- At 200% root text size on a 1280 px viewport, document width remains 1280 px
  and no hidden/clip-overflow element clips text.
- With reduced motion, animations collapse to `0.01ms`, scrolling is instant,
  and replay advances one narrated step per activation.

## Privacy, headers, routing, and deployment identity — PASS

- A fresh live demo completion made 29 browser-observed requests. Every one
  was a same-origin GET with no body; there were no failed requests,
  console/page errors, analytics, remote fonts/scripts, model calls, accounts,
  payments, frames, or identifying inputs.
- Browser response headers include a self-only CSP with `frame-ancestors
  'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict referrer policy,
  and a restrictive Permissions Policy.
- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. The styled unknown route
  returns 404, and all crawled links return 2xx/3xx.
- HTML revalidates after 30 seconds. Hashed assets use one-year immutable
  caching, the manifest uses `no-cache`, and `sw.js` uses `no-store`.
- SHA-256 comparison found all 29 deployable `dist/` files identical to live
  production. `staticwebapp.config.json` is deployment metadata and is not
  served as product content.

## PWA and performance — PASS

- Chromium reports no manifest or installability errors. The live worker
  activates, controls `/demo`, uses cache `arithmetic-steps-0be4cf63a607`, and
  does not precache deployment metadata.
- Offline reload returns 200 and keeps the `52 − 18` sample.
- A fresh live waiting-worker update displays “An update is ready”; applying
  it changes the controller URL and preserves `42 − 8` plus the demo banner.
- Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 40 ms, CLS 0.005, Speed Index 0.9 s,
  and 39 KiB transferred.

## Applicability

This is a backend-free, local-first static PWA. It has no library/CLI package,
server endpoint, product-unlock call, authentication, billing, or model call.
Consumer packaging, backend concurrency/persistence, API 429 allowance, and
Microsoft Entra authority checks are therefore not applicable. An AI feature
would not improve the brief's direct-manipulation job.

## Evidence

Fresh machine-readable QA, screenshots, Lighthouse JSON, and the URL smoke
report are under `.factory/evidence-10/live/`. Temporary raw command logs were
captured under `/tmp/arithmetic-steps-qa/`. No product code was changed.
