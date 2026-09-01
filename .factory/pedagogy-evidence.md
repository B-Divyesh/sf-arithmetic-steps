# Pedagogy review boundary

The researched brief retains its `Teacher-reviewed pedagogy` constraint.
Arithmetic Steps has not had a qualified educator review. This release does
not claim that one occurred. No study, reviewer identity, qualification, date,
classroom observation, or academic outcome has been invented to fill that gap.

Arithmetic Steps is therefore presented as a tool for educator review before
classroom use. The landing page includes an executable local checklist, and
`.factory/facilitator-review.md` documents the same checks and expected
observations. Its tagged browser regression proves the checklist can be
completed and reset from a clean browser context; it does not represent an
external pedagogical evaluation.

The observable safeguards implemented in the product are:

- The first screen names a teacher or parent alongside the child.
- The adult note asks what stayed the same before offering a strategy.
- Each learner-chosen chunk creates an equation and a plain-language sentence.
- Finished work can be replayed and includes discussion prompts.
- There is no answer-entry field, timer, score, streak, or leaderboard.
- Addition, subtraction, direct manipulation, keyboard controls, narration,
  replay, the discussion card, and the facilitator checklist have browser
  regressions.

The exact public claims and their sandbox commands remain in
`.factory/claims.json`. The public review-boundary claim has its own regression.
It requires the explicit limitation on each review-facing public surface and
rejects educator-approval or learning-outcome wording.
