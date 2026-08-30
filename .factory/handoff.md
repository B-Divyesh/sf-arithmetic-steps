# Arithmetic Steps — repair 11 handoff

## Release disposition

**PASS — repaired, deployed, and ready for independent verification (2026-08-30 UTC).**

This work repairs the release blocker in verifier report commit
`798486ff692b64e0c663066b026e6ce1590b85f4` for candidate
`d35103815a4eda9487d57b5bbeb95176e5a71f80`. Repair commit `b72bc1c` is
pushed to `origin/main`. Build 1.0.5 is deployed at
<https://arithmetic-steps.sociobot.in> through the existing Static Web App
`sf-arithmetic-steps`.

## Finding repaired

The untouched candidate reproduced the controller's exact failure: clearing
**First number**, leaving **Second number** at `7`, and pressing **Start the
problem** opened `0 + 7` at `/#route` and persisted `first: 0`. The form read
the fields with `Number(value)`, so JavaScript changed `Number("")` to zero
before validation.

The form now checks raw strings before numeric conversion. A blank field:

- stays blank and never opens or stores a route;
- preserves the other entered value;
- shows a field-specific error through the assertive live region; and
- receives focus so keyboard and screen-reader users can correct it.

An explicitly entered `0` remains valid where the arithmetic rules allow it.
Both inputs reference the live error with `aria-describedby`. The setup draft
stores raw strings, so rerendering cannot turn a blank back into a number.

Exact regression coverage:

- Vitest checks blank and whitespace first operands, blank second operands,
  and explicit zero before route validation.
- `@claim:arithmetic-bounds` clears each field in turn on desktop and mobile,
  asserts the error, focus, retained values, and absence of a work route, then
  corrects the input and opens `8 + 7`.
- The independent browser harness repeats both blank flows against local SWA
  emulation and production before recovering to `99 + 1 = 100`.

Evidence:

- `.factory/evidence-repair-11/local/browser-swa/blank-first-rejected.png`
- `.factory/evidence-repair-11/local/verification-summary.json`
- `.factory/evidence-repair-11/live/browser/blank-first-rejected.png`
- `.factory/evidence-repair-11/live/verification-summary.json`

## Verification evidence

### Clean install, tests, claims, and build

- `npm ci`: PASS — 61 packages installed; zero audit vulnerabilities.
- `npm run lint`: PASS — TypeScript clean.
- `npm run test:unit`: PASS — 16/16 Vitest unit/static checks.
- `npm test`: PASS — 16/16 Vitest checks and 56 Playwright checks; two
  project-specific viewport skips are intentional.
- All 20 exact commands in `.factory/claims.json`: PASS independently. The
  repaired arithmetic-bounds claim passed in desktop and mobile projects.
- `npm run build`: PASS — `dist/` contains 30 files. Worker cache
  `arithmetic-steps-0be4cf63a607` precaches 24 URLs.
- Initial app JS is 37,580 bytes raw / 11,038 bytes gzip. CSS is 26,424 bytes
  raw / 6,192 bytes gzip. The mobile hero AVIF is 16,183 bytes.
- Library/package consumer testing is not applicable to this static PWA.

### Browser, keyboard, accessibility, privacy, and PWA

- Factory URL smoke: PASS locally and live with the correct title, `lang=en`,
  one `h1`, one `main`, complete alt text, named buttons, and no browser errors.
- Desktop: PASS for first-read/demo, `52 − 18 = 34`, narration, replay,
  discussion, bounds and blank recovery, `99 + 1 = 100`, JSON export, malformed
  import handling, clear confirmation, and empty history.
- Exact 390×844 mobile: `scrollWidth === clientWidth === 390`; no sampled
  visible control is below 44×44 px.
- Axe: zero total violations on landing, demo, completion, empty history,
  exact-390 demo, Privacy, Terms, and 404, locally and live.
- Keyboard: first Tab reaches the skip link; Enter focuses `main`; focus is a
  visible 3 px brass outline with 3 px offset. Blank fields receive focus.
- Reduced motion: effective animation duration is 0.01 ms, scrolling is
  instant, and replay advances one narrated step per activation.
- Privacy: the complete live exercise made same-origin requests only. There
  are no analytics, remote fonts/scripts, accounts, payments, model calls, or
  child identifiers.
- Offline: live worker cache `arithmetic-steps-0be4cf63a607` controls `/demo`;
  offline reload returns 200 with the sample state intact. The full browser
  suite also applies a waiting-worker update without losing demo state.

### Response policy, identity, and performance

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200. The styled unknown route
  returns 404, and every crawled link returns 2xx/3xx.
- Live CSP is self-only and sends `frame-ancestors 'none'` as a header. HSTS,
  `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, and restrictive
  Permissions Policy are present.
- HTML revalidates after 30 seconds. Hashed assets use one-year immutable
  caching. The manifest uses `no-cache`; `sw.js` uses `no-store`.
- SHA-256 identity: all 29 deployable local `dist/` files match production
  byte-for-byte. Deployment metadata is correctly not served as content.
- Live Lighthouse 13.4.1 mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.005, Speed
  Index 0.9 s.
- Backend response semantics, rate limiting, API persistence, billing, and
  Microsoft Entra checks are not applicable to this backend-free static PWA.
  No AI feature is appropriate to the brief's direct-manipulation job.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build

# Run each exact command listed in .factory/claims.json.
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in .factory/evidence-repair-11/live/url-smoke
node .factory/qa-artifacts/independent-live-qa.mjs \
  https://arithmetic-steps.sociobot.in .factory/evidence-repair-11/live/browser
```

Deployment used `swa deploy ./dist --env production` with a token read only
from the existing `sf-arithmetic-steps` resource. No provisioning, DNS, shared
service, database, key vault, or unrelated resource was read or changed.

## Known gaps

No release-blocking product or verification gaps remain.
