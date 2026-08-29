# Arithmetic Steps

Arithmetic Steps is a deliberately slow, offline-friendly number game for children learning addition and subtraction to 100. Instead of rewarding a fast answer, it lets a child move quantities in chunks, describes every transformation in plain language, replays the reasoning trail, and makes a print-ready discussion card.

Live product: [arithmetic-steps.sociobot.in](https://arithmetic-steps.sociobot.in)

## Who it is for

Elementary teachers, parents, and children who want to discuss the structure inside a calculation—making a ten, splitting a quantity, regrouping—not only whether the final answer is correct. An adult can sit nearby, let the child choose each chunk, then ask what changed and what stayed the same.

## Try the demo

Open [the sample route](https://arithmetic-steps.sociobot.in/demo), or press
**Try it with sample data** on the landing page. It starts a part-complete
`52 − 18` route so a learner can finish the last chunk and replay the
reasoning right away. Demo data is isolated in `demo:arithmetic-steps` and is
discarded by **Reset demo**, **Start for real**, or an ordinary link away from
demo. See
[.factory/demo.md](.factory/demo.md) for the sandbox details.

## What v1 includes

- Addition and subtraction routes with whole numbers and results from 0 to 100
- Visual tens bars and one-counters, with an equivalent screen-reader description
- Fully labelled stepper and quick-chunk controls; dragging is never required
- Plain-language route ledger, self-paced or automatic replay, and printable conversation prompts
- IndexedDB persistence for an unfinished route and completed local history
- JSON export/import, explicit clear controls, and no accounts or child identifiers
- Installable PWA with an app-shell cache and tested offline operation
- Responsive 390 px layout, keyboard operation, focus states, reduced-motion behavior, and print styles

The product intentionally has no timer, score, streak, leaderboard, answer guessing, AI grading, or third-party analytics.

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Route data is stored only in that browser profile.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests plus Playwright journeys in desktop Chromium and a 393 px mobile viewport, including an offline reload and axe accessibility scan. Playwright 1.58.2 is pinned; if its browser is missing locally, run `npx playwright install chromium` once.

Every public product claim is declared in [.factory/claims.json](.factory/claims.json).
Each may be run from a clean demo context with its listed command, for example:

```sh
npm test -- --grep @claim:offline-reload
```

The exact production command is `npm run build`. It creates the static deployment at `dist/`, with `dist/index.html` at its root, legal pages, immutable hashed application assets, and a versioned precache service worker. Preview it with:

```sh
npm run preview
```

## Data and privacy

No route data is sent to a server. The Privacy page explains IndexedDB storage and export behavior. The app has no runtime dependencies, remote fonts, third-party scripts, advertising, or tracking. Remove data from **Saved routes** or the browser’s site-data settings.

## Product and design notes

- [.factory/brief.json](.factory/brief.json) records the scoped opportunity.
- [.factory/design.md](.factory/design.md) records the art-deco transit-poster system and generated-art provenance.
- [.factory/handoff.md](.factory/handoff.md) records final verification and known gaps.

## License

MIT. See [LICENSE](LICENSE).
