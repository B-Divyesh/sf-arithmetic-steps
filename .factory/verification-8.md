# Independent verification 8 — FAIL

- Candidate commit: `85a794a2baad81fb25b698ad0cdd70c2cbb01b6e`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-08-30 UTC
- Verifier verdict: **FAIL**

## Release-blocking finding

### P0 — required qualified elementary-teacher review is still absent

The researched brief makes **Teacher-reviewed pedagogy** a product constraint.
The candidate's `.factory/pedagogy-review.md` says, “No named elementary
teacher has reviewed this release in the repository,” and all eight fields in
its review record remain blank. Candidate `85a794a…` changes only repair-handoff
documentation and local QA artifacts; it does not add an external review.

Automation can verify arithmetic and accessibility, but cannot invent the
reviewer's qualification, classroom observations, requested changes, or
follow-up decision. The acceptance contract therefore remains unmet.

**Required resolution:** a qualified elementary teacher must exercise addition
and subtraction, direct drag and labelled keyboard controls, narration,
replay, and the discussion card. Record their name and qualification, date,
ages/grades, observations, required changes, and follow-up decision in
`.factory/pedagogy-review.md`; apply any changes and rerun independent QA.

## Other finding

### P2 — desktop hero word overflows into the illustration

At desktop widths the unbreakable word `SUBTRACTION` is wider than its grid
column and paints over the adjacent poster. At 1440 px, the heading has a
468 px client width and 586 px scroll width, so about 118 px of the word sits
on the multicolour illustration. The dark letters cross dark train artwork,
reducing the legibility and reliable contrast of the first-screen job
statement. The same overflow measured 53 px at 1280, 88 px at 1366, and
129 px at 1600. There is no page-level horizontal overflow.

Evidence: `.factory/evidence-8/desktop-landing.png` and
`.factory/evidence-8/live-first-read-1280.png`.

**Recommended resolution:** keep the whole headline on the paper background by
reducing its desktop maximum size, widening the text track, or allowing a
controlled break inside “subtraction.”

## Mandatory first-read and demo gate — PASS

In a fresh live browser, the first screen said:

- What: “Explore addition and subtraction steps.”
- For whom: “For elementary children with a teacher or parent.”
- First action: **Try it with sample data**.

One click opened `/demo` with the part-complete `52 − 18` route at `42 − 8`
and the persistent “Demo — sample data, nothing is saved” banner. The hard
plain-words/demo gate passes despite the separate visual-overlap finding.

## Claims gate — PASS after clean install

`.factory/claims.json` exists. After the required `npm ci`, every exact command
from the manifest was run separately; all 20 exited 0:

| Claim | Result |
| --- | --- |
| `demo-sandbox` | PASS — isolated `/demo`, reset and exit paths on desktop/mobile |
| `offline-reload` | PASS — offline demo reload on desktop/mobile |
| `local-only` | PASS — cold page/worker flow remained first-party |
| `installable-pwa` | PASS — manifest, icons, controlling worker, no installability errors |
| `visible-focus` | PASS — skip link and designed focus ring |
| `tens-and-ones` | PASS — exact accessible quantity labels |
| `direct-manipulation` | PASS — counters and ten-frames dragged for both operations |
| `narrated-steps` | PASS — chosen chunk produced equation and narration |
| `replay-and-discussion` | PASS — replay and discussion prompts |
| `free-no-account` | PASS — no payment, account, or score path |
| `arithmetic-bounds` | PASS — whole-number and 0–100 validation/recovery |
| `keyboard-controls` | PASS — non-drag route completed with keyboard controls |
| `unfinished-persistence` | PASS — immediate refresh restored the route |
| `json-export` | PASS — deterministic completed-route JSON |
| `json-import` | PASS — valid chosen file restored a problem |
| `clear-data` | PASS — cancel preserved data; confirmation removed it |
| `print-card` | PASS — print invoked and isolated the discussion card |
| `reduced-motion` | PASS — replay became manual |
| `mobile-controls` | PASS — 390 px mobile assertion; intended desktop skip only |
| `no-game-mechanics` | PASS — no timer, streak, leaderboard, or answer guesser |

For transparency, a literal pre-install invocation could not enter the tests
because the clean checkout had no `tsc` executable (`exit 127`). This was an
environment prerequisite, not a failed assertion. `npm ci` installed the
locked dependencies, after which every command above ran to completion.

The landing page, legal pages, and README were cross-checked against the
manifest. No additional material product promise lacked a corresponding
claim test.

## Clean checkout gates — PASS

- `git rev-parse HEAD`: exact candidate `85a794a2baad81fb25b698ad0cdd70c2cbb01b6e`.
- `npm ci`: 61 packages installed; 0 audit vulnerabilities.
- `npm test`: TypeScript clean; 14/14 Vitest checks passed; Playwright
  55 passed with one intended desktop skip for the mobile-only assertion.
- `npm run build`: passed and produced `dist/`; service worker
  `arithmetic-steps-6f613e180a4d` precaches 24 URLs.
- Bundle output: main JS 36.90 kB raw / 10.90 kB gzip, loader JS 0.76 kB raw,
  CSS 26.36 kB raw / 6.15 kB gzip, no downloaded fonts, and 16.18 kB mobile
  AVIF hero. These are below the static-PWA budgets.

## Independent end-to-end QA — PASS

Fresh live Playwright sessions independently verified:

- Completed the sample subtraction `52 − 18 = 34`; narration, manual replay,
  saved route, and discussion prompts were present.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, and `5 − 6` with actionable errors
  while retaining inputs.
- Completed both result boundaries: `99 + 1 = 100` and `100 − 100 = 0`.
- Downloaded and parsed the JSON export, rejected malformed JSON, preserved
  saved work when clearing was cancelled, then removed it after confirmation.
  The separate claim run also exercised a valid JSON import.
- At exactly 390 CSS px, `scrollWidth === clientWidth === 390`; no visible
  button, link, input, select, direct counter, or quick choice was under
  44×44 px.
- Keyboard focus began on “Skip to main content”; Enter moved focus to main.
  The skip link and a primary work control used a visible 3 px brass outline
  with 3 px offset. Keyboard-only arithmetic passed in the claim suite.
- At 200% root text size on a 1280 px viewport, page width remained 1280 px
  and no element with hidden overflow clipped text.
- With reduced motion, animation duration was effectively zero, scroll was
  instant, and replay advanced exactly one step with feedback.

## Accessibility — PASS except the P2 visual finding

- The factory URL smoke check passed: 200 response, descriptive title,
  `lang=en`, exactly one `h1`, one `main`, no missing image alt text, no
  unlabelled buttons, and no browser errors; measured load was 652 ms.
- Playwright axe scans reported zero violations, including zero serious or
  critical findings, on landing, demo, completion, empty Saved problems,
  Privacy, Terms, and the styled 404.
- Semantic shells, form labels, error messages, native controls, live status,
  keyboard operation, touch sizing, print state, and reduced motion passed.
- The only accessibility/design concern is the image-backed desktop heading
  overlap described as P2; automated contrast tools cannot evaluate variable
  text contrast over a raster image.

## Privacy, security, and deployment — PASS

- A fresh context recorded the complete cold `/demo` document, service-worker
  install/precache, and completion flow: 29 requests, all same-origin GETs,
  with no request body. There were no analytics, third-party scripts/fonts,
  API calls, iframes, account, payment, or identifying-input paths.
- Live response headers include a self-only CSP with response-header
  `frame-ancestors 'none'`, HSTS, `X-Frame-Options: DENY`, `nosniff`, strict
  referrer policy, and restrictive Permissions Policy.
- HTML uses 30-second revalidation, hashed assets use one-year immutable
  caching, the manifest uses `no-cache`, and `sw.js` uses `no-store`.
- All 29 public files from the fresh local `dist/` matched live byte-for-byte
  by SHA-256. `staticwebapp.config.json` is correctly deployment-only.
- `/`, `/demo`, `/privacy/`, and `/terms/` returned 200; the unknown route
  returned a styled HTTP 404; all crawled links returned 2xx/3xx.

## PWA and performance — PASS

- Chromium reported no manifest or installability errors.
- The live worker activated, controlled the page, used cache
  `arithmetic-steps-6f613e180a4d`, omitted deployment metadata, and reloaded
  `/demo` offline with `52 − 18` intact.
- The full suite applied a simulated waiting service-worker update on desktop
  and mobile without losing demo state.
- Lighthouse 13.4.1 mobile: Performance 93, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.2 s, CLS 0.005, TBT 310 ms, max potential
  input delay 181 ms. A fresh four-times CPU-throttled Event Timing run across
  the main demo interactions measured a worst interaction of 128 ms.

## Applicability notes

This is a static, local-first PWA. It has no library/CLI distribution, backend
endpoint, product-unlock endpoint, authentication, billing, or model call.
Consumer-package testing, API concurrency/persistence, 429 allowance, and
Microsoft Entra authority checks are therefore not applicable. The brief does
not benefit from an AI runtime feature; local manipulation and discussion are
the core job.

## Evidence

Fresh screenshots, URL-smoke output, and Lighthouse JSON are in
`.factory/evidence-8/`. No product code was changed during verification.
