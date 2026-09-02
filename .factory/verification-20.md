# Independent verification 20 — FAIL

- Candidate: `59ab92a2e062feeb6d43587155e2a0bb5da3b01a`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-02 UTC
- Verdict: **FAIL — do not release**

## Release blocker

### P1 — required teacher-reviewed pedagogy is still not evidenced

The original researched brief supplied for this verification lists
**“teacher-reviewed pedagogy”** as a constraint. Fresh repository inspection
found no named qualified elementary teacher, qualification, review date,
grades/ages, exercised flows, feedback, changes, or follow-up decision.

Instead, `.factory/pedagogy-evidence.md` explicitly describes the checklist as
“not evidence of learning outcomes or an outside endorsement,” and
`.factory/facilitator-review.md` calls it a self-guided local check. Those are
honest and useful product safeguards, but they are not a teacher review and do
not satisfy the work order. Automated tests cannot create this missing external
evidence.

Resolution: obtain and record a real qualified elementary-teacher review of
addition and subtraction, drag and keyboard paths, narration, replay, and the
discussion card. Record the reviewer’s qualification, date, scope/grades,
feedback, changes made, and final disposition; alternatively obtain an explicit
owner waiver of the original constraint.

## Mandatory first-read and demo gate — PASS

Fresh cold desktop navigation returned HTTP 200. The first screen says what it
does, who it is for, and what to do first in plain words:

- **What:** “Explore addition and subtraction steps.”
- **For whom:** elementary children with a teacher or parent.
- **First action:** “Try it with sample data,” which opens the seeded `52 − 18`
  route in one click.

`/demo` and `/?demo=1` both opened the isolated, part-complete `52 − 18`
sample at `42 − 8`, with the persistent “Demo — sample data, nothing is
saved” banner plus Reset demo and Start for real. Completing its final chunk
produced `42 − 8 = 34`.

## Declared claims — PASS

`.factory/claims.json` exists with 24 claims. From the clean checkout I ran
`npm ci`, then every literal `test` command in the manifest separately. The
fail-fast command reached and passed all 24 IDs:

`demo-sandbox`, `offline-reload`, `local-only`, `installable-pwa`,
`visible-focus`, `tens-and-ones`, `direct-manipulation`, `narrated-steps`,
`replay-and-discussion`, `free-no-account`, `arithmetic-bounds`,
`keyboard-controls`, `unfinished-persistence`, `completed-persistence`,
`json-export`, `json-import`, `clear-data`, `print-card`, `reduced-motion`,
`mobile-controls`, `facilitator-checklist`,
`self-guided-checklist-guidance`, `no-game-mechanics`, and `no-ai-grading`.

The repaired final-subtraction narration, valid `100 − 100 = 0` boundary,
corresponding recovery wording, and registered no-AI claim all passed fresh
regressions. No unlisted claim-like README issue was found in this candidate.

## Local quality gates — PASS

- `npm ci`: PASS; 61 packages installed and npm reported 0 vulnerabilities.
- `npm test`: PASS; TypeScript lint, 21 Vitest/static checks, and 76 Playwright
  desktop/mobile checks completed successfully.
- `npm run build`: PASS; generated `dist/` and the service worker.
- Built main JS: 44,448 bytes raw / 12,876 bytes gzip; CSS: 28,534 bytes raw /
  6,492 bytes gzip. Initial JS and CSS are within the required budgets.

## Independent live QA — PASS

- The normal and demo flows work on desktop and exact 390px mobile. Both have
  `scrollWidth === clientWidth`; all sampled visible buttons are at least
  44×44px.
- Live Axe Playwright scans found zero violations (therefore zero
  serious/critical) on desktop and mobile demo routes. The standalone
  `@axe-core/cli` could not locate a Chrome binary in this container; the
  project-pinned Playwright Chromium scan was used instead.
- No console errors or page errors occurred. The first Tab focused the visible
  skip link (3px brass outline plus ink ring); Enter focused `main`.
- Fresh demo traffic made 29 same-origin, GET-only requests and no third-party
  requests. The browser had a controlling `/sw.js` worker. After first visit,
  offline reload retained the demo heading, sample, and offline notice.
- A live waiting-worker simulation showed “An update is ready”; pressing Update
  changed the controller to `/sw.js?verify-update=1` while retaining the demo.
- Response headers provide a self-only CSP (including `frame-ancestors 'none'`),
  HSTS, `nosniff`, strict referrer policy, and restrictive permissions policy.
  HTML short-revalidates, hashed assets are one-year immutable, and `sw.js` is
  no-cache/no-store. Product routes and all crawled internal links returned
  200; an unknown route returned a styled 404.
- This is a static, local-first PWA: no server-side product endpoint,
  authentication, billing/unlock, or AI runtime exists. Rate-limit/429 and
  Entra checks are not applicable.

## Deployment identity — PASS

After the exact production build, SHA-256 comparison matched all 29 public
`dist/` files byte-for-byte against production. `staticwebapp.config.json` is
deployment metadata and correctly returns no public asset (404). The live app
is this candidate build (`1.0.16`).

## Conclusion

The PWA itself is release-quality in the tested functional, accessibility,
privacy, offline, and deployment dimensions. It nevertheless **fails the
acceptance contract** until the mandatory teacher-reviewed-pedagogy evidence is
obtained or explicitly waived.

No product code was modified during verification.
