# Facilitator review checklist

## Purpose and boundary

This is a local, repeatable product review aid for an educator or caregiver.
Arithmetic Steps has not had a qualified educator review.
This checklist is not a teacher study or evidence of learning outcomes.

## Run it in the product

1. Open `/` and go to **Review this tool before classroom use**.
2. Choose **Open 52 − 18 sample**. Take away the final 8, finish the problem,
   then replay the route and read the discussion prompts.
3. Return to the checklist and mark the sample, child-choice, explanation, and
   access checks after trying each one.
4. Use **Reset review checklist** to clear the four marks. Marks are not saved
   in browser storage.

The review asks the facilitator to inspect direct manipulation and labelled
chunk controls, reasoning narration and replay, discussion prompts, and
keyboard access. The final decision about classroom fit stays with the
educator.

## Sandbox regression

```sh
npm test -- --grep @claim:facilitator-review
```

The regression starts in a fresh browser context, proves the four native
checkboxes and sample link are present, marks all four, observes the completed
status, resets them, and verifies that no mark remains.
