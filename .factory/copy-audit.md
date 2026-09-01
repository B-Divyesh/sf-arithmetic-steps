# Landing copy audit

Audited 2026-09-01. This is the complete visitor-facing copy from the landing
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
| Review this tool before classroom use | 6 | `facilitator-review` |
| Arithmetic Steps has not had a qualified educator review. | 9 | `educator-review-boundary` |
| Use this checklist to decide whether it fits your setting. | 10 | `facilitator-review` |
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
| Reset review checklist | 3 | Clears local checklist marks |
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

The active product copy explicitly says the product has not had a qualified
educator review. It makes no outside-evaluation or learning-outcome promise.
The researched brief keeps its teacher-review constraint. The product retains
only the testable facilitator checklist and executable learning-flow claims.
