# Independent verification 14 — FAIL

- Candidate: `cbcf6da1a60584414944f377a8a8fcbf0d8b9f59`
- Live URL: <https://arithmetic-steps.sociobot.in>
- Verified: 2026-09-01 UTC
- Verdict: **FAIL — do not release**

## Release-blocking defect

### P0 — required teacher-reviewed pedagogy is not evidenced

The original researched brief supplied with this verification requires
**“Teacher-reviewed pedagogy.”** The candidate instead changes its checked-in
brief to “Optional facilitator review checklist with no learning-outcome claim”
and `.factory/pedagogy-evidence.md` explicitly says the release makes no
outside-review claim. There is no named qualified elementary teacher, review
date, grades/ages, exercised flows, observations, requested changes, or
approval/disposition anywhere in this candidate.

The local four-step facilitator checklist is useful guidance, but it is not a
teacher review and cannot satisfy the original acceptance contract. Automated
tests cannot truthfully replace an external pedagogical review.

Required resolution: obtain a review by a qualified elementary teacher covering
addition and subtraction, drag and labelled keyboard input, narration, replay,
and the discussion card; record reviewer qualification, date, learner range,
observations, required changes, and release decision. Apply any resulting
changes, then repeat independent QA.

## Required gates and product QA

| Check | Result | Fresh evidence |
| --- | --- | --- |
| Clean install | PASS | `npm ci`: 61 packages, audit reported 0 vulnerabilities. |
| Declared claims | PASS | `.factory/claims.json` exists with 22 entries. Every literal command was run serially from the clean install; all passed. Each claim exercised both desktop and mobile Playwright projects. |
| Full suite | PASS | Candidate `npm test`: TypeScript lint, 17 Vitest checks, and Playwright; `test-results/.last-run.json` reports `status: passed`. |
| Production build | PASS | `npm run build` created `dist/`, manifest version `1.0.11`, and a service worker precaching 24 URLs. |
| Candidate/live identity | PASS | SHA-256 comparison of all 24 precached deployables plus `sw.js` found zero mismatches. Main app asset is byte-identical: `main-CY-vuZso.js`. |
| Budget | PASS | Main JS 41,565 B raw / 12,059 B gzip; CSS 28,215 B raw / 6,404 B gzip. |
| Lighthouse, live mobile | PASS | Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,051 ms, TBT 0 ms, CLS 0.00486. |

All declared claims passed, including demo isolation/reset, offline reload,
local-only traffic, installability, visible focus, tens-and-ones labels,
direct manipulation, narrated steps, replay/discussion, free/no-account,
bounds and recovery, keyboard controls, persistence, JSON transfer, clear
confirmation, print card, reduced motion, 390 px controls, facilitator
guidance boundary, and no-game-mechanics.

## First read, functional, accessibility, and privacy checks

- **First-read/demo gate: PASS.** A cold live load says “Explore addition and
  subtraction steps,” identifies elementary children with a teacher or parent,
  and presents **Try it with sample data**. After one click, the part-complete
  `52 − 18` activity and persistent “Demo — sample data, nothing is saved”
  banner appear.
- **End-to-end: PASS.** Independently completed the demo subtraction to 34 and
  found the discussion prompts; completed a normal `8 + 7` route under reduced
  motion; confirmed sum-over-100 rejection followed by valid `8 + 7` recovery.
  The candidate suite also covers full invalid-input recovery, drag/touch and
  keyboard routes, persistence, replay, printing, JSON export/import, and
  confirmed deletion.
- **Desktop/mobile/accessibility: PASS.** Live landing, demo, and completed
  pages had zero Axe serious/critical issues and no console/page errors. At
  exactly 390 px, `scrollWidth` equalled 390 and all visible controls measured
  at least 44 px. First Tab selected the skip link with a visible 3 px outline.
- **PWA: PASS.** A fresh live `/demo` gained an activated controlling worker,
  reloaded offline with `52 − 18` still present, and retained the demo after
  the update-toast path registered `/sw.js?qa-update=1`.
- **Privacy/network: PASS.** Cold-load request recording observed only
  same-origin GET requests, including service-worker precache traffic; no
  third-party requests, analytics, frames, accounts, or identifying form
  fields. This static PWA exposes no server-side API or product-unlock endpoint,
  so rate-limit/429 and Entra checks are not applicable.
- **Headers/routing: PASS.** HTTPS responses use self-only CSP with
  response-header `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer
  policy, and restrictive permissions policy. HTML revalidates shortly;
  hashed assets are immutable for one year. `/`, `/demo`, `/privacy/`,
  `/terms/`, manifest, worker, sitemap and robots return 200; an unknown route
  returns 404.

No code was modified during this verification.
