# Landing copy audit

Audited 2026-09-02. This is the complete visitor-facing copy from the landing
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
| Enter the first number before starting the problem. | 8 | Required-field error |
| Enter the second number before starting the problem. | 8 | Required-field error |
| Enter the starting number before starting the problem. | 8 | Required-field error |
| Enter how many to take away before starting the problem. | 10 | Required-field error |
| For the grown-up nearby | 5 | Adult guidance heading |
| Let the child choose the chunk, even when it is not the shortest path. | 14 | Adult guidance |
| Ask “What stayed the same?” before offering a strategy. | 10 | Adult guidance |
| Local checklist | 2 | Section label |
| Use four local checks before classroom use | 7 | `facilitator-checklist` |
| This self-guided checklist is guidance, not evidence of learning outcomes. | 10 | `self-guided-checklist-guidance` |
| Complete and reset its four local checks before classroom use. | 10 | `facilitator-checklist` |
| Checklist marks are not stored. | 5 | `facilitator-checklist` |
| Mark each check after you try it | 7 | Checklist instruction |
| Finish the sample. | 3 | Checklist item |
| Remove the final 8 in the supplied route. | 9 | Checklist instruction |
| Open 52 − 18 sample | 4 | Opens supplied sample |
| Try a child-chosen chunk. | 4 | Checklist item |
| Move a ten-frame or counter, then use a labelled chunk button. | 11 | Checklist instruction |
| Read the reasoning trail. | 4 | Checklist item |
| Finish a route, replay it, and read the discussion prompts. | 10 | Checklist instruction |
| Check access for your setting. | 6 | Checklist item |
| Use keyboard controls and decide how you will support the learner. | 11 | Checklist instruction |
| Reset local checks | 3 | Clears local checklist marks |
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

The footer contains the factory attribution and build identifier only. Generated
art provenance remains in `.factory/design.md`, so it is not an unregistered
visitor-facing product claim.

The active product copy labels the checklist as self-guided guidance. It makes
no outside-review, study, validation, or learning-outcome promise. The
researched brief retains only the testable four-check facilitator behavior and
executable learning-flow claims.

## README copy audit

Audited 2026-09-02 after the saved-problems route repair. The README uses the
same terms as the activity: **problem**, **chunk**, **step**, **counter**, and
**saved problems**. Implementation names appear only in the demo-storage note
for people verifying isolation.

| Copy | Words |
| --- | ---: |
| Arithmetic Steps is an offline addition and subtraction activity for children learning numbers to 100. | 15 |
| A child moves counters in chunks, explains each step, replays the work, and prints a discussion card. | 17 |
| It is for elementary teachers, parents, and children discussing the structure inside a calculation. | 15 |
| An adult can let the child choose each chunk, then ask what changed and what stayed the same. | 18 |
| Open the sample problem, or press Try it with sample data on the landing page. | 15 |
| It starts a part-complete 52 − 18 problem so a learner can finish the last chunk and replay the steps right away. | 21 |
| Completed problems stay in this browser. | 6 |
| Unfinished work remains after a refresh. | 6 |
| Install the activity and use it offline after the first visit. | 11 |
| npm test runs unit tests and Playwright in desktop Chromium and a 393 px mobile viewport. | 15 |
| It includes an offline reload and an Axe accessibility scan. | 10 |
| The exact production command is npm run build. | 9 |
| It creates dist/ with the app, legal pages, hashed assets, and offline service worker. | 14 |

No audited README sentence exceeds 22 words. No audited sentence contains a
banned marketing term. The prior storage and install jargon was replaced with
the useful result for a teacher, parent, or child.

## Catalog description

**Move counters to explain addition and subtraction steps with a child.** —
11 words, 69 characters, verb first, and no banned term.
