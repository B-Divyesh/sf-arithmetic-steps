# Arithmetic Steps

Arithmetic Steps is an offline addition and subtraction activity for children learning numbers to 100. A child moves counters in chunks, explains each step, replays the work, and prints a discussion card.

Live product: [arithmetic-steps.sociobot.in](https://arithmetic-steps.sociobot.in)

## Who it is for

It is for elementary teachers, parents, and children discussing the structure inside a calculation. An adult can let the child choose each chunk, then ask what changed and what stayed the same.

## Review before classroom use

This optional checklist is guidance, not evidence of learning outcomes. It lets
educators and caregivers inspect the supplied sample before classroom use. It
covers child-chosen chunks, reasoning prompts, and keyboard controls. Checklist
marks stay only on the open page.

## Try the demo

Open [the sample problem](https://arithmetic-steps.sociobot.in/demo), or press
**Try it with sample data** on the landing page. It starts a part-complete
`52 − 18` problem so a learner can finish the last chunk and replay the
steps right away. Demo data is isolated in `demo:arithmetic-steps` and is
discarded by **Reset demo**, **Start for real**, or an ordinary link away from
demo. See
[.factory/demo.md](.factory/demo.md) for the sandbox details.

## What v1 includes

- Addition and subtraction problems with whole numbers and results from 0 to 100
- Interactive ten-frames and one-counters with equivalent screen-reader descriptions
- Direct counter dragging plus labelled keyboard controls for the same moves
- Plain-language reasoning steps, replay, and a print-ready discussion card
- IndexedDB persistence for completed history, with a local checkpoint for unfinished work
- JSON export/import, confirmed clear controls, and no accounts or child identifiers
- Installable PWA with an app-shell cache and tested offline operation
- Responsive 390 px layout, visible keyboard focus, reduced-motion behavior, and tested print styles

The product intentionally has no timer, score, streak, leaderboard, answer guessing, AI grading, or third-party analytics.

## Run locally

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Problem data is stored only in that browser profile.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests plus Playwright flows in desktop Chromium and a 393 px mobile viewport, including an offline reload and axe accessibility scan. Playwright 1.58.2 is pinned; if its browser is missing locally, run `npx playwright install chromium` once.

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

No problem data is sent to a server. The Privacy page explains browser storage and export behavior. The app has no runtime dependencies, remote fonts, third-party scripts, advertising, or tracking. Remove completed data from **Saved problems** or remove all site data in browser settings.

## Product and design notes

- [.factory/brief.json](.factory/brief.json) records the scoped opportunity.
- [.factory/design.md](.factory/design.md) records the art-deco transit-poster system and generated-art provenance.
- [.factory/pedagogy-evidence.md](.factory/pedagogy-evidence.md) records the checklist boundary and observable guidance safeguards.
- [.factory/facilitator-review.md](.factory/facilitator-review.md) documents the executable local review checklist.
- [.factory/handoff.md](.factory/handoff.md) records final verification and known gaps.

## License

MIT. See [LICENSE](LICENSE).
