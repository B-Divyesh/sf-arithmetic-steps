# Arithmetic Steps — review 1 handoff

## Disposition

**FAIL.** This reviewer changed no product code. The committed review is in
`.factory/review-1.md`.

## What was verified

- Cold live first-read at 390 px and desktop; the purpose, audience, and
  one-click sample action are clear.
- Live one-click demo, reset, start-for-real cleanup, isolated
  `demo:arithmetic-steps` storage, and untouched real namespace.
- Fresh live request log and offline reload: 34 same-origin GET requests only,
  no browser errors, and the demo remained available offline after the worker
  controlled the page.
- Every one of the 22 literal commands in `.factory/claims.json` passed after
  `npm ci`.
- `npm test` passed: 67 tests passed and 3 intended viewport-specific tests
  were skipped. `npm run build` passed and generated `dist/`.
- Public routes, headers, metadata, 404, and crawled links were checked.

## Remaining work

1. **Blocking:** Replace `#history` / other navigable hash states with real
   path routes. On saved-problems navigation, set **Saved problems — Arithmetic
   Steps**, move focus to its h1, and announce the new page. Add a deep-link
   and Back-button regression.
2. Split the two README sentences over the 22-word copy limit.
3. Replace `IndexedDB`, `PWA`, and `app-shell cache` product-list jargon with
   plain user outcomes.

## How to reproduce

```sh
npm ci
npm test
npm run build
```

For the blocking issue, open the live root, activate **Saved problems**, and
inspect the URL, document title, and active element. The review contains the
expected corrected behavior and test requirements.
