# Arithmetic Steps — repair 10 handoff

## Release disposition

**PASS — ready for independent verification (2026-08-30 UTC).**

This repair addresses every finding in report commit
`1061c084faff0e22906c526fbe9b4eb65253236b` for candidate
`85a794a2baad81fb25b698ad0cdd70c2cbb01b6e`, including the controller's
required claim correction and exact 1440px hero regression. The implementation
is in commits `519ad8b` and `5797db7` and is pushed to `origin/main`.

Production build 1.0.4 is deployed to
<https://arithmetic-steps.sociobot.in> through the existing Azure Static Web
App `sf-arithmetic-steps` (`dist/`, production environment).

## Findings repaired

### Unsupported outside-review promise

- Replaced the brief's untestable external-review constraint with observable
  requirements: adult-guided discussion prompts, no timed or scored drills,
  and no academic-outcome claims.
- Removed the blank outside-review certification template. The replacement
  `.factory/pedagogy-evidence.md` maps the active constraint to behavior that
  the sandbox exercises.
- Added a static regression that scans the brief and all active product copy
  for unsupported outside-review and learning-outcome language. It also checks
  the actual adult guidance and discussion prompt.
- Public product behavior and all previously passing claims are unchanged.

### Desktop `SUBTRACTION` overflow

- Reproduced the untouched candidate at exactly 1440×1000: the heading had a
  468px client width, 586px scroll width, and 118px overflow into the poster.
- Capped the desktop hero type at 68px and added one controlled break
  opportunity inside the longest operation word for text-zoom fallbacks.
- Added an exact 1440px Playwright regression. It asserts the full accessible
  heading text, no internal overflow, and that the heading stays at or before
  both the copy edge and artwork edge.
- Repaired geometry is 468px client width, 468px scroll width, 0px overflow;
  heading right, copy right, and artwork left are all 651.953125px.
- At 200% root text size on a 1280px viewport, document width remains 1280px,
  heading scroll width equals client width, and no hidden/clip-overflow element
  clips text.

Before/after evidence:

- `.factory/evidence-repair-10/before/desktop-1440-overflow.png`
- `.factory/evidence-repair-10/after/desktop-1440-fixed.png`
- `.factory/evidence-repair-10/live/desktop-1440-fixed.png`
- `.factory/evidence-repair-10/live/text-200-percent.png`

## Verification evidence

### Clean install, type, unit, browser, build

- `npm ci`: PASS — 61 packages installed, 0 audit vulnerabilities.
- `npm run lint`: PASS — TypeScript `tsc --noEmit` clean.
- `npm run test:unit`: PASS — 14/14 Vitest checks.
- `npm test`: PASS — 14/14 Vitest checks and 56 Playwright checks passed;
  two project-specific viewport skips were intentional.
- Every one of the 20 exact `.factory/claims.json` commands: PASS from the
  demo entry point. The isolated JSON-export run exposed a same-document
  navigation race in its locator; the test now waits for the Saved problems
  view and scopes the assertion to the history list. Its standalone rerun and
  the complete suite both pass.
- `npm run build`: PASS — `dist/` contains the static PWA and versioned worker
  `arithmetic-steps-3041ebf6ce4f`, with 24 precached URLs.
- Bundle sizes: main JS 36,907 bytes raw / 10.91kB gzip; CSS 26,424 bytes raw /
  6.17kB gzip; mobile hero AVIF 16,183 bytes. All are below contract budgets.
- Package/consumer checks are not applicable: this is a static PWA, not a
  published library or CLI.

### Browser, keyboard, accessibility, privacy, and PWA

- Factory `verify-url.sh`: PASS in 1,010ms with the correct title, `lang=en`,
  one `h1`, one `main`, no missing alt text, no unlabelled buttons, and no
  browser errors. Evidence: `.factory/evidence-repair-10/live/url-smoke/`.
- Independent desktop flow: PASS for first-read copy, one-click demo,
  `52 − 18 = 34`, narration/replay/discussion, invalid-input recovery,
  `99 + 1 = 100`, JSON export/malformed import handling, and confirmed clear.
- Exact 390×844 mobile: `scrollWidth === clientWidth === 390`; no visible
  target is below 44×44px. Evidence:
  `.factory/evidence-repair-10/live/mobile-demo.png`.
- Axe: zero total violations on landing, demo, completed work, empty history,
  390px demo, Privacy, Terms, and 404.
- Keyboard: first Tab reaches the skip link; Enter focuses `main`; sampled
  focus rings are brass 3px solid with 3px offset. Labelled non-drag controls
  complete a problem in the claim suite.
- Reduced motion: effective animation duration is 0.01ms, scrolling is instant,
  and replay advances one narrated step per activation.
- Privacy: the full live exercise recorded only same-origin requests; no
  analytics, remote fonts/scripts, account, payment, model call, or identifying
  input path exists.
- Offline/update: the live worker controls the page, uses cache
  `arithmetic-steps-3041ebf6ce4f`, excludes deployment configuration, and
  reloads `/demo` offline with the sample intact. The full suite also applies a
  simulated waiting-worker update without losing demo state.

### Deployment, response policy, identity, and performance

- `/`, `/demo`, `/privacy/`, and `/terms/` return 200; the unknown-route smoke
  returns the styled page with HTTP 404; every crawled link returns 2xx/3xx.
- Live CSP is self-only and carries `frame-ancestors 'none'` as a response
  header. `X-Frame-Options: DENY`, `nosniff`, strict referrer policy, HSTS, and
  the restrictive Permissions Policy are present.
- HTML uses 30-second revalidation; hashed assets use one-year immutable
  caching; the manifest uses `no-cache`; `sw.js` uses `no-store`.
- All 29 deployable files in local `dist/` match the live responses by SHA-256.
  The page identifies Build 1.0.4 and loads `main-Dcot4Q9D.js` and
  `styles-BQoYZnj1.css`.
- Live Lighthouse 13.4.1: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9s, LCP 1.1s, TBT 40ms, CLS 0.005, Speed Index 0.9s.
  Evidence: `.factory/evidence-repair-10/live/lighthouse.json`.
- Backend response semantics, rate limiting, billing, API persistence, and
  Microsoft Entra identity are not applicable to this backend-free static PWA.
  Live build identity is established by the 29-file hash comparison above.
- An AI runtime feature is not appropriate to this arithmetic-manipulation
  job; no model or gateway call was added.

## Reproduce

```sh
npm ci
npm run lint
npm run test:unit
npm test
npm run build

# Then run every exact command listed in .factory/claims.json.
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh \
  https://arithmetic-steps.sociobot.in .factory/evidence-repair-10/live/url-smoke
node .factory/qa-artifacts/independent-live-qa.mjs \
  https://arithmetic-steps.sociobot.in .factory/evidence-repair-10/live
```

Deploy command (the token is obtained from the existing Static Web App and is
never written to the repository):

```sh
swa deploy ./dist --env production
```

## Known gaps and next steps

No release-blocking product or verification gaps remain. A later independent
review may add evidence, but the product does not promise outside evaluation
or academic outcomes.
