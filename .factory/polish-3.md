# Polish 3 — Arithmetic Steps

Implementation commit: `6f61f60f2f61b59aecde820b333a2b0b5f648deb`.

Deployment: `f2b729d1-84a7-4879-8c2c-9d6e8bfbdccd`.

Live URL: <https://arithmetic-steps.sociobot.in>.

## Finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 — hash-routed saved problems, stale title, and focus | Retained real `/practice`, `/saved-problems`, and saved-detail paths with route-specific titles, h1 focus, and polite route announcements. | `uses a real saved-problems route with a title, focused heading, and route announcement`; live Back/focus/announcement evidence in `.factory/evidence-polish-3/live-regressions/verification.json`. |
| F-1-2 — README sentences exceeded 22 words | Retained the short test/build sentences and re-audited them. | `.factory/copy-audit.md` README audit: no sentence exceeds 22 words. |
| F-1-3 — README exposed storage/install jargon | Retained visitor language about browser-stored work, refresh persistence, and offline use. | `.factory/copy-audit.md`; `@claim:completed-persistence`, `@claim:unfinished-persistence`, and `@claim:offline-reload` all pass from the clean clone. |
| Controller-1 — completed work could disappear during delayed persistence | Retained the namespaced synchronous completion checkpoint and saved-work merge. | `@claim:completed-persistence keeps Saved problems open when completion storage finishes after navigation`; live race evidence reports all three checks true. |
| Controller-2 — phone Saved problems lacked Practice | Retained the three-stop narrow header and 44 px targets. | `@claim:mobile-controls`; live 390 px route evidence and `mobile-saved-problems.png`. |
| Required `?demo=1` sample path | Retained the separate demo namespace, persistent banner, reset, and Start for real disposal. | `@claim:demo-sandbox`; `.factory/evidence-polish-3/live-regressions/verification.json` records the live `52 − 18` banner path. |
| F-2-1 — `subtraction` split on the 390 px first screen | Retained the whole-word hero sizing rule and exact 390 px browser regression. | `keeps every hero headline word whole at exactly 390px`; `live-regressions/verification.json` and `mobile-landing-390.png`. |
| F-2-2 — footer artwork provenance was an unlisted claim | Kept public provenance out of the footer; the design record keeps the generated-art provenance. | `keeps generated-art provenance in the design record, not as an unregistered footer claim`; `live-regressions/verification.json`; `.factory/copy-audit.md`. |
| F-3-1 — 404 lacked metadata and shared shell | Rebuilt `404.html` with canonical, description, social metadata, SVG/apple icons, shared Number Line Limited header/footer, Privacy/Terms, build id, and return-home action. Added a static-host-faithful preview plus exact unknown-route regression. | `returns the full shared 404 page for the exact unknown route`; `.factory/evidence-polish-3/live-404/verification.json`; screenshots `unknown-route-desktop.png` and `unknown-route-mobile.png`; <https://arithmetic-steps.sociobot.in/nothing-here>. |

## Verification

- Fresh clone `/tmp/arithmetic-steps-polish-3.3tKOOS/repo`: `npm ci` passed
  with 0 vulnerabilities; `npm test` passed 19 unit/static and 71 browser
  tests, with 3 intended skips; `npm run build` produced `dist/`.
- All 23 exact commands declared in `.factory/claims.json` passed separately
  from that clean clone. The log is
  `/tmp/arithmetic-steps-polish-3.3tKOOS/verification.log`.
- Live `verify-url.sh` passes with 657 ms cold load and no console errors.
  Live independent QA passes every named route, demo, PWA/offline, local-only
  request, keyboard, mobile, completion-race, link, and Axe check.
- Live 404 QA passes at desktop and 390 px with HTTP 404, zero Axe violations,
  no unexpected console errors, full metadata, legal links, and return home.
- Lighthouse 12.8.2 on the deployed landing page: Performance 99,
  Accessibility 100, Best Practices 100, SEO 100; LCP 1,585 ms, CLS 0.

No review finding remains unresolved.
