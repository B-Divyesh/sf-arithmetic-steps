# Arithmetic Steps

Arithmetic Steps is an offline addition and subtraction activity for children learning numbers to 100. A child moves counters in chunks, explains each step, replays the work, and prints a discussion card.

Live product: [arithmetic-steps.sociobot.in](https://arithmetic-steps.sociobot.in)

## Who it is for

It is for elementary teachers, parents, and children discussing the structure inside a calculation. An adult can let the child choose each chunk, then ask what changed and what stayed the same.

## Use four local checks before classroom use

This self-guided checklist is guidance, not evidence of learning outcomes. A
facilitator can complete and reset four local checks before classroom use.
Checklist marks are not stored. The checks cover the supplied sample,
child-chosen chunks, reasoning prompts, and keyboard controls.

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
- Completed problems stay in this browser. Unfinished work remains after a refresh.
- JSON export/import, confirmed clear controls, and no accounts or child identifiers
- Install the activity and use it offline after the first visit.
- Responsive 390 px layout, visible keyboard focus, reduced-motion behavior, and tested print styles

The product has no timer, score, streak, leaderboard, answer guessing, or AI grading. It has no third-party analytics.

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

`npm test` runs unit tests and Playwright in desktop Chromium and a 393 px mobile viewport. It includes an offline reload and an Axe accessibility scan.

Playwright 1.58.2 is pinned. If its browser is missing locally, run `npx playwright install chromium` once.

Every public product claim is declared in [.factory/claims.json](.factory/claims.json).
Each may be run from a clean demo context with its listed command, for example:

```sh
npm test -- --grep @claim:offline-reload
```

The exact production command is `npm run build`. It creates `dist/` with the app, legal pages, hashed assets, and offline service worker. Preview it with:

```sh
npm run preview
```

## Data and privacy

No problem data is sent to a server. The Privacy page explains browser storage and export behavior. The app has no runtime dependencies, remote fonts, third-party scripts, advertising, or tracking. Remove completed data from **Saved problems** or remove all site data in browser settings.

## Product and design notes

- [.factory/brief.json](.factory/brief.json) records the scoped opportunity.
- [.factory/design.md](.factory/design.md) records the art-deco transit-poster system and generated-art provenance.
- [.factory/pedagogy-evidence.md](.factory/pedagogy-evidence.md) records the checklist boundary and observable guidance safeguards.
- [.factory/facilitator-review.md](.factory/facilitator-review.md) documents the executable self-guided checklist.
- [.factory/handoff.md](.factory/handoff.md) records final verification and known gaps.

## License

MIT. See [LICENSE](LICENSE).
