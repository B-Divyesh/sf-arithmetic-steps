# Landing copy audit

Audited 2026-08-29. This is the complete visitor-facing copy from the landing
state, excluding repeated navigation, numeric example buttons, and arrow
glyphs. A **problem** is one arithmetic activity; a **chunk** is a chosen
quantity; a **step** is one recorded change; a **counter** is one movable unit.

| Copy | Words | Claim / purpose |
| --- | ---: | --- |
| Addition and subtraction to 100 | 5 | Scope label |
| Explore addition and subtraction steps | 5 | Plain job headline |
| For elementary children with a teacher or parent, move counters to explain how each answer changes. | 16 | Names audience and outcome |
| Try it with sample data | 5 | `demo-sandbox` |
| Choose your own problem | 4 | Real first step |
| Works offline after the first visit. | 6 | `offline-reload` |
| Problems stay only on this device. | 7 | `local-only` |
| Free with no accounts or scores. | 6 | `free-no-account` |
| Choose a problem | 3 | Planner label |
| Pick addition or subtraction | 4 | Planner heading |
| Which operation? | 2 | Form label |
| Add | 1 | Operation label |
| Subtract | 1 | Operation label |
| First number / Start at | 4 | Number field labels |
| Second number / Take away | 4 | Number field labels |
| Try a problem: | 3 | Example control label |
| Start the problem | 3 | Starts the selected problem |
| For the grown-up nearby | 5 | Adult guidance heading |
| Let the child choose the chunk, even when it is not the shortest path. | 14 | Adult guidance |
| Ask “What stayed the same?” before offering a strategy. | 10 | Adult guidance |
| How it works | 3 | Process label |
| Move, explain, and replay each step | 6 | Process heading |
| Move | 1 | Step one heading |
| Drag a counter or ten-frame, or use the labelled controls. | 10 | `direct-manipulation`, `keyboard-controls` |
| Explain | 1 | Step two heading |
| Each choice becomes a sentence, not a speed score. | 9 | `narrated-steps` |
| Replay | 1 | Step three heading |
| Step through the work and talk about why it works. | 9 | `replay-and-discussion` |

No sentence exceeds 22 words. None contains a banned plain-words term.
Public claims in the table each map to one exact tagged browser regression in
`.factory/claims.json`; operational labels describe controls.
