# Clean verification — polish 1 retry

- Clone: `/tmp/arithmetic-steps-polish-1-retry1.da0dUk`
- Commit: `f2807f6`
- `npm ci`: PASS, 0 vulnerabilities
- `npm test`: PASS, 18 unit/static and 69 browser tests; 3 intended skips
- `npm run build`: PASS, `dist/` produced
- JavaScript: 44.36 kB raw / 12.93 kB gzip
- CSS: 28.53 kB raw / 6.47 kB gzip

Every literal `.factory/claims.json` command passed:

- `demo-sandbox`
- `offline-reload`
- `local-only`
- `installable-pwa`
- `visible-focus`
- `tens-and-ones`
- `direct-manipulation`
- `narrated-steps`
- `replay-and-discussion`
- `free-no-account`
- `arithmetic-bounds`
- `keyboard-controls`
- `unfinished-persistence`
- `completed-persistence`
- `json-export`
- `json-import`
- `clear-data`
- `print-card`
- `reduced-motion`
- `mobile-controls`
- `facilitator-checklist`
- `self-guided-checklist-guidance`
- `no-game-mechanics`

The updated `demo-sandbox` command, including the direct `?demo=1` assertions,
was repeated after the clean run and passed in desktop and mobile Chromium.
