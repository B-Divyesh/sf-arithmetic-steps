# Independent verification 19 — FAIL

- Candidate commit: `b58c9e7f488d90ad0b0efa6e129edc81af3dabc3`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-02 UTC
- Verifier verdict: **FAIL — do not release**

## Release-blocking findings

### P1 — the original teacher-review requirement is still unmet

The supplied acceptance contract requires **teacher-reviewed pedagogy**. The
candidate has no named elementary teacher, qualification, review date, grades
considered, exercised flows, feedback, disposition, or follow-up decision.

Repository history confirms that the requirement was replaced rather than
satisfied:

- Initial commit `6044ab9` recorded `Teacher-reviewed pedagogy` in
  `.factory/brief.json`.
- Commit `519ad8b` deleted `.factory/pedagogy-review.md`, whose own text said no
  named elementary teacher had reviewed the release.
- Commit `b81ff2a` replaced the requirement with an optional facilitator
  checklist; `ec246b7` then changed it to the current self-guided checklist.
- The current `.factory/pedagogy-evidence.md` explicitly says the release makes
  no outside-review claim. A local product checklist is useful QA, but it is
  not review by a qualified teacher.

Changing the repository copy of the brief does not amend the original work
order used for this verification. Obtain and record a real qualified
elementary-teacher review, including scope, feedback, changes, and follow-up
decision, or obtain an explicit owner waiver.

### P1 — the final subtraction explanation says unfinished work remains

In the live one-click `52 − 18` demo, taking away the final 8 correctly reaches
34, but the recorded sentence is:

> Take away 8 to land on a friendly ten. 42 − 8 = 34, and 0 is still waiting to
> be taken away.

The same defect occurs at the lower boundary `100 − 100 = 0`: after taking
away 100, the reasoning trail says that 0 is still waiting to be taken away.
The sentence is retained in replay and the discussion card. This is a core
correctness defect because the product's job is to preserve a child's accurate
intermediate explanation, not merely compute the final answer.

The existing `@claim:narrated-steps` test covers addition only. The subtraction
portion of `@claim:direct-manipulation` stops after the first, non-final chunk,
so all declared tests pass without detecting the faulty final sentence.

Evidence: [`subtraction-final-narration.png`](evidence-verification-19/subtraction-final-narration.png).

### P1 — README contains an unlisted claim

README line 39 says the product has no “AI grading.” No entry in
`.factory/claims.json` includes that claim, and no `@claim:` test checks it.
The `no-game-mechanics` claim covers timer, streak, leaderboard, and answer
guessing; `free-no-account` covers scores; `local-only` covers third-party
requests. None covers AI grading. The mandatory claims contract says an
unlisted public claim fails review until it is removed or receives its own
declared observable test.

The README copy audit also omits this sentence while describing its README
section as audited.

## Other finding

### P2 — subtraction recovery text contradicts a valid boundary

For `5 − 6`, the live form says, “The number being taken away must be smaller
than the starting number.” Equality is actually valid: `100 − 100` completes
successfully with result 0, as the documented 0–100 range requires. The error
should say the amount taken away cannot be greater than the starting number.

## Mandatory first-read and demo gate — PASS

A cold 1440 × 900 live visit returned HTTP 200 and immediately answered all
three questions:

- What: **Explore addition and subtraction steps**.
- For whom: elementary children with a teacher or parent.
- First action: **Try it with sample data**.

The action is above the fold and opens `/demo` in one click. The page then
shows the persistent “Demo — sample data, nothing is saved” banner, Reset demo
and Start for real controls, and the part-complete `52 − 18` route at `42 − 8`.

Evidence: [`desktop-landing.png`](evidence-verification-19/desktop-landing.png)
and [`mobile-demo.png`](evidence-verification-19/mobile-demo.png).

## Declared claims gate

`.factory/claims.json` exists and declares 23 claims. The literal commands were
attempted first in the dependency-free clone and stopped at `tsc: not found`,
as expected before package installation. After the work order's required
`npm ci`, every exact command was run separately and all 23 passed:

`demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`,
`visible-focus`, `tens-and-ones`, `direct-manipulation`, `narrated-steps`,
`replay-and-discussion`, `free-no-account`, `arithmetic-bounds`,
`keyboard-controls`, `unfinished-persistence`, `completed-persistence`,
`json-export`, `json-import`, `clear-data`, `print-card`, `reduced-motion`,
`mobile-controls`, `facilitator-checklist`,
`self-guided-checklist-guidance`, and `no-game-mechanics`.

Each declared ID has one tagged Playwright test definition. The claims
contract nevertheless fails overall because of the unlisted README claim and
because the broad narration promise is not accurate for a completed
subtraction transformation.

## Clean-checkout quality gates — PASS

- `npm ci`: 61 packages installed; 0 audit vulnerabilities.
- `npm run lint`: PASS (`tsc --noEmit`).
- `npm run test:unit`: PASS, 19/19 Vitest/static checks.
- `npm test`: PASS, 19/19 Vitest/static checks and 71/71 applicable
  Playwright checks; three viewport-specific skips were intentional.
- `npm run build`: PASS; `dist/` was produced and service worker
  `arithmetic-steps-0dde57833ae5` precaches 24 URLs.
- Main JS: 44,357 bytes raw / 12,860 bytes gzip. Other initial JS: 895 and 85
  bytes raw. CSS: 28,534 bytes raw / 6,462 bytes gzip. Mobile AVIF: 16,183
  bytes. There are no downloaded fonts. All are within the stated budgets.

## Independent live product QA

- Completed the one-click `52 − 18 = 34` route and exercised replay,
  discussion prompts, and Start for real. This exposed the final-narration
  defect above.
- Completed `99 + 1 = 100` and exported the resulting saved route as valid
  JSON. Completed `100 − 100 = 0`, proving the lower result boundary.
- Rejected `90 + 20`, `1.5 + 2`, `0 + 0`, `5 − 6`, and both blank-operand
  cases. Values were retained, blank fields received focus, and correction
  recovered successfully, apart from the inaccurate subtraction wording.
- Malformed JSON import produced an error. Clear-data cancellation retained
  the saved route; confirmation removed it.
- A deliberately blocked IndexedDB completion write was recovered from the
  synchronous checkpoint after immediate Saved problems navigation.
- At exactly 390 CSS px, `scrollWidth === clientWidth === 390`; no sampled
  visible link, button, input, or select was under 44 × 44 px.

Machine-readable results: [`verification-summary.json`](evidence-verification-19/verification-summary.json).

## Accessibility and browser behavior — PASS

- Factory `verify-url.sh` passed: title, `lang=en`, exactly one h1, main
  landmark, complete alt text, labelled buttons, and zero console errors.
- Live Axe scans found zero violations, including zero serious/critical
  findings, on landing, demo, completion, empty Saved problems, exact-390
  demo, Privacy, Terms, and the 404 page.
- The first Tab focuses the skip link. Its visible focus treatment is a 3 px
  brass outline with 3 px offset; Enter moves focus to `main`.
- Keyboard controls complete the arithmetic flow in the claim suite.
- Reduced motion changes animations to `0.01ms`, makes scrolling immediate,
  and advances replay one step per activation.
- The 200% narrow-screen text regression passed in the full suite.

Factory smoke evidence: [`verify.json`](evidence-verification-19/live-root/verify.json).

## Privacy, security, caching, and routing — PASS

- A fresh live demo flow, including service-worker installation and precache,
  made 29 requests. Every request was a same-origin GET with no request body;
  no third-party request, frame, console error, or page error occurred.
- The root response sends a self-only CSP with `frame-ancestors 'none'`, HSTS,
  `nosniff`, `X-Frame-Options: DENY`, strict referrer policy, and restrictive
  Permissions Policy.
- HTML uses 30-second revalidation. Hashed assets use one-year immutable
  caching. `/sw.js` is `no-cache, no-store`; the manifest is `no-cache`.
- `/`, `/practice`, `/demo`, `/?demo=1`, `/saved-problems`, `/privacy/`, and
  `/terms/` return 200. The styled unknown route returns HTTP 404. All nine
  crawled landing links returned 200.

## Deployment identity, PWA, and performance — PASS

- All 29 deployable files in fresh local `dist/` match their live responses
  byte-for-byte by SHA-256. `staticwebapp.config.json` is deployment metadata
  and was correctly excluded. The live deployment matches the candidate.
- The live worker activated, controlled `/demo`, and used cache
  `arithmetic-steps-0dde57833ae5`. Offline reload returned 200 and retained the
  sample. A live `registration.update()` completed with the same active worker
  and no waiting update; the full local suite passed the waiting-worker toast
  and apply-update path without losing demo state.
- Lighthouse 12.8.2 mobile: Performance 97, Accessibility 100, Best Practices
  100, SEO 100; FCP 985 ms, LCP 1,196 ms, CLS 0, TBT 204 ms, and 41,976 bytes
  transferred. A separate 4× CPU-throttled Event Timing run measured a worst
  interaction duration of 96 ms.

Raw Lighthouse report: [`lighthouse-live.json`](evidence-verification-19/lighthouse-live.json).

## Applicability

This is a backend-free static PWA. It has no product API endpoint, unlock call,
authentication, billing, or AI runtime. API allowance/429, persistence
concurrency on a server, consumer-package installation, and Microsoft Entra
checks are not applicable.

No product code was modified during verification.
