# Landing copy audit

Audited 2026-08-29. This is the complete visitor-facing copy from the landing
state, excluding repeated navigation and button arrow glyphs. A **route** is
one arithmetic activity; a **chunk** is a chosen quantity; a **step** is one
recorded change; a **counter** is the visual quantity.

| Copy | Words | Claim / purpose |
| --- | ---: | --- |
| Line A Addition and subtraction to 100 | 7 | Scope label |
| Explore addition and subtraction steps | 5 | Plain job headline |
| For elementary children with a teacher or parent, move counters to explain how each answer changes. | 16 | Names audience and outcome |
| Try it with sample data | 5 | `demo-sandbox` |
| Plan your own route | 5 | Real first step |
| Works offline after the first visit. | 6 | `offline-reload` |
| Routes stay only on this device. | 7 | `local-only` |
| Free with no accounts or scores. | 6 | `free-no-account` |
| Route office | 2 | Planner label |
| Choose a journey | 3 | Planner heading |
| Which kind of route? | 5 | Form label |
| Add | 1 | Operation label |
| Subtract | 1 | Operation label |
| First number / Start at | 4 | Number field label |
| Second number / Take away | 4 | Number field label |
| Try a route: | 3 | Example control label |
| Begin the route | 3 | Starts the selected route |
| For the grown-up nearby | 5 | Adult guidance heading |
| Let the child choose the chunk, even when it is not the shortest path. | 14 | Adult guidance |
| Ask “What stayed the same?” before offering a strategy. | 10 | Adult guidance |
| How it works | 3 | Process label |
| A thought becomes a route | 5 | Process heading |
| Move | 1 | Step one heading |
| Choose a useful chunk. | 5 | Step one instruction |
| The counters show tens and ones. | 6 | `tens-and-ones` |
| Explain | 1 | Step two heading |
| Each choice becomes a sentence, not a speed score. | 9 | `narrated-steps` |
| Replay | 1 | Step three heading |
| Step through the route and talk about why it works. | 9 | `replay-and-discussion` |

No sentence exceeds 22 words. None contains a banned plain-words term.
Claims in the table each map to an exact tagged browser regression in
`.factory/claims.json`; operational labels describe controls rather than make
unverified promises.
