# Arithmetic Steps — repair handoff

Work order: `arithmetic-steps-repair-4`
Base candidate: `d4036d4d4001662997220559450810eae8ca37fe`
Independent verifier report: `7ff781f15ff59a2486e46c352cd1cefc56ec64aa` (`.factory/verification.md`)

## Release-blocker repair

The report’s original P0 findings remain repaired in the candidate: the public
claim inventory, plain-language first screen, `/demo` sample route, isolated
`demo:arithmetic-steps` namespace, demo documentation, 404, metadata,
response policy, and offline precache were retained without changing the
researched scope or the passed arithmetic flows.

This repair closes the controller’s remaining demo-sandbox gap.

### Exact reproduced failure

Before changing code, against `d4036d4`, a fresh Chromium context opened
`/demo` and then followed the regular **Arithmetic Steps home** link. The
observed IndexedDB names were:

```json
{
  "before": ["demo:arithmetic-steps"],
  "url": "http://127.0.0.1:4173/#learn",
  "after": ["arithmetic-steps", "demo:arithmetic-steps"]
}
```

The existing **Start for real** path deleted sample data, but an ordinary
document navigation did not. That meant demo data could remain after leaving
the sandbox.

### Fix and regression coverage

- `src/main.ts` now centralizes disposal in `discardDemoStorage()`, restoring
  the real namespace even if IndexedDB deletion reports an error.
- **Start for real**, browser back/forward transitions, and normal primary
  link navigation out of demo await removal of `demo:arithmetic-steps` before
  entering the real app or following the link. A normal real-app bootstrap
  also removes an orphaned demo namespace before reading real routes.
- `@claim:demo-sandbox` now first proves the landing action, then opens direct
  `/demo`, reads the demo active route from IndexedDB, advances it, resets it,
  preserves a sentinel in `arithmetic-steps`, and follows the actual home
  link. It waits for the completed reset toast rather than racing IndexedDB.
- `@claim:json-export` now runs the same completed `8 + 7` export in two new
  browser contexts. Each starts with disabled export/history, exports exactly
  one attempt, and the normalized payloads are identical apart from deliberate
  route IDs and timestamps.
- `.factory/claims.json`, `.factory/demo.md`, and `README.md` record the
  expanded navigation-disposal behavior.

## Local verification

Executed from a clean install on 2026-08-29 UTC:

```sh
npm ci
npm test -- --fully-parallel --workers=4
npm run build
VERIFY_NODE_MODULES=/work/repo/node_modules /opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ .factory/qa-artifacts/repair-4-local
```

| Check | Result |
| --- | --- |
| Clean install | PASS — 61 packages installed; `npm audit` reported 0 vulnerabilities. |
| Type/lint | PASS — `tsc --noEmit`. |
| Unit/static contract | PASS — 11 Vitest tests. |
| Desktop + mobile browser suite | PASS — 46 Playwright tests across Chromium and Pixel 5, including every registered `@claim:` case; keyboard, 390 px controls, privacy-request, import/export, offline reload, reduced motion, and Axe coverage passed. |
| Demo-storage regression | PASS — direct `/demo` creates and updates `demo:arithmetic-steps`; a real sentinel remains untouched; the normal home link leaves only `arithmetic-steps`. |
| Fresh-context JSON regression | PASS — two isolated contexts each emitted one complete `8 + 7 = 15` payload with equal normalized JSON. |
| Production build | PASS — `dist/` emitted; app JS `32,941 B` raw / `9,740 B` gzip, CSS `24,596 B` raw / `5,742 B` gzip; generated worker `arithmetic-steps-c63b43b34415` precaches 24 public files and excludes `staticwebapp.config.json`. |
| URL/accessibility smoke | PASS — no console errors; title, `lang=en`, one h1, main landmark, image alt text, and labelled controls. Evidence: `.factory/qa-artifacts/repair-4-local/verify.json`. |
| Lighthouse 13.4.1 mobile | PASS — Performance 1.00, Accessibility 1.00, Best Practices 1.00, SEO 1.00; LCP 1,443 ms, TBT 0 ms, CLS 0.0049. The report skips only `full-page-screenshot`, which is unstable in this container; all scored audits completed. Evidence: `.factory/qa-artifacts/repair-4-local/lighthouse.json`. |

The product is a static PWA, not a package, CLI, backend, payment, or identity
service; package-consumer, 429, backend response-policy, and live identity
flows are not applicable.

## Deployment and live verification

Committed and pushed repair: `d9ecbd6 fix: isolate demo storage on navigation`.

Deployed the unchanged static artifact with:

```sh
/opt/fleet/lib/deploy-static.sh arithmetic-steps dist
```

Azure Static Web Apps deployment: `471af56f-82a3-448d-ba9f-180c1d019b6b`.
The existing Central US site was reused and
`https://arithmetic-steps.sociobot.in` returned 200.

Live checks completed at 2026-08-29T20:41:56Z:

- `/opt/fleet/lib/verify-url.sh` passed with no console errors. Evidence:
  `.factory/qa-artifacts/repair-4-live/verify.json` and its desktop/mobile
  screenshots.
- The independent browser exercise passed desktop flow, mobile 390 px layout,
  keyboard skip/focus, reduced motion, 404/links, JSON import/export, privacy
  request origins, and offline PWA reload. Axe found zero violations on
  landing, demo, completion, history, legal pages, and 404. The mobile page
  measured `390/390` with no target below 44 px.
- Fresh live demo lifecycle: during demo, databases were
  `["arithmetic-steps", "demo:arithmetic-steps"]`, demo active route was
  `52 − 18` with two frames, and real sentinel value was `preserved`; after
  clicking the ordinary home link, databases were `["arithmetic-steps"]` and
  the real sentinel was still `preserved`.
- Live PWA: worker is activated, controls the demo, has one registration and
  cache `arithmetic-steps-c63b43b34415`; it does not precache deployment-only
  config; offline `/demo` reload returned 200 with `52 − 18`.
- Live response policy: CSP includes `frame-ancestors 'none'`,
  `X-Frame-Options: DENY`, `Permissions-Policy`, `Referrer-Policy`, and
  `X-Content-Type-Options: nosniff`; hashed JS is immutable, `sw.js` is
  `no-cache, no-store, must-revalidate`, and an unknown path returns HTTP 404.
- Live identity hashes match `dist/`: index
  `271119513c8b81cce3e08f0eb63757876c49e260d38f62f9317522561639fa7b`,
  main JS `d01e1e9f16aeb007015ef42e277195e8bc374b894edbf11c82381a67639fd865`,
  service worker
  `84a4da81e450c3a73ab17d3b0309e42cdf97b5c862a3bb04c4c22d85594445a0`.

## Known external prerequisite

The researched brief requires a qualified, named elementary-teacher pedagogy
review. No such human review is available in this repository, and it has not
been fabricated. `.factory/pedagogy-review.md` accurately records the needed
name, date, scope, feedback, and resulting changes before any claim that the
activity is teacher-reviewed. There are no known code, deployment, privacy, or
test gaps from this repair.
