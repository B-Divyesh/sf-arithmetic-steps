# Arithmetic Steps — visual thesis

## Direction: the Number Line Limited

Arithmetic is presented as an art-deco transit journey: quantities are stations, transformations are stops, and a child’s reasoning is the route worth preserving. The visual reference is a 1930s civic transit poster rather than a school worksheet. Strong geometric tracks, stepped corners, ticket-like labels, and deliberately flat color make the hidden route through a problem feel public, legible, and worth explaining.

This is a single-mode, warm-paper product. The explicit cream canvas keeps the ten-frames materially consistent and avoids a theme switch changing counter identity mid-lesson. Chrome is dark ink; decoration only marks route, grouping, or progress.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#F5EBD5` | page background |
| Paper raised | `#FFF9EB` | work surfaces |
| Rail ink | `#173B3F` | primary text, track, outlines |
| Ink muted | `#4B625F` | secondary copy (7.1:1 on paper) |
| Signal coral | `#C74332` | primary action and first quantity |
| Coral dark | `#8F2F24` | interactive hover / accessible text |
| Brass | `#D69A2D` | second quantity and route markers |
| Brass dark | `#76500B` | brass label text |
| Teal | `#16766F` | success / completed route |
| Teal dark | `#0E514D` | success text |
| Danger | `#A62D37` | errors with icon and wording |

All normal-size text combinations target WCAG AA ≥4.5:1; color never carries meaning without a label, number, shape, or pattern.

## Type

- Display: `Arial Narrow`, `Roboto Condensed`, `Aptos Narrow`, sans-serif. All-caps, slightly tracked station headings evoke transit enamel signs without a font download.
- Reading and controls: `Atkinson Hyperlegible`, `Verdana`, `Arial`, sans-serif. Installed-system fallbacks avoid a runtime font request and keep numerals highly distinguishable.
- Scale: 16px body; 18/22px supporting headings; fluid 30–54px display; tabular numerals throughout the workbench.

## Spacing and shape

- 4px base rhythm; major spacing: 8, 12, 16, 24, 32, 48, 64px.
- A 1120px content rail; reading measure ≤68ch.
- 44px minimum targets and 8px separation.
- Corners are clipped or modest (0–12px), never pill-card dashboards. Double-line borders, offset shadows, station circles, and stepped frames build the poster identity.
- On phones, the route ledger stacks beneath the workbench; secondary header copy drops; the manipulation controls become full-width. No fixed bottom bar obscures content.

## Interaction grammar

- **Choose a route:** addition or subtraction, then a problem. The primary action is always a verb: “Begin the route,” “Move the chunk,” “Finish the route.”
- **Manipulate:** large plus/minus steppers are the keyboard and switch-device equivalent to dragging. Optional quick chips suggest meaningful chunks without dictating one correct method.
- **See:** quantities render as labelled ten-bars and one-counters. Grouping is spatial and patterned, not color-only.
- **Narrate:** every action appends a plain-language station to the route ledger immediately.
- **Replay:** a single play/pause control advances through the recorded states; previous/next enables self-paced explanation.
- **Discuss:** the final ticket asks “What changed?” and “What stayed the same?” and can print cleanly.

## Motion policy

Counters move only when their quantity changes (220ms transform/opacity); route stations enter from their originating track (180ms). Replay advances every 1.4 seconds and is always pausable. No loop runs indefinitely. Under `prefers-reduced-motion: reduce`, all movement and smooth scrolling become immediate opacity/state changes; replay remains manual unless the user explicitly presses play.

## Original asset plan and provenance

- Hero illustration: a wide, flat art-deco railway map where coral and brass counter-trains merge through ten-frame stations into a teal destination. It explains the product metaphor and contains no people or literal UI.
- App icons: hand-authored SVG geometry derived from the station/ten-frame mark, exported locally to PNG sizes.
- UI symbols: CSS geometry and text glyphs only; no icon library.

### Generation prompt sheet

**Shared direction:** 1930s art-deco transit poster, educational number railway, flat screen-printed shapes, geometric rails and round counters, warm cream paper grain, deep petrol ink, signal coral, brass gold, destination teal, clean negative space, crisp hard edges, limited five-color palette, landscape composition. **Negative list:** no words, no letters, no numerals, no watermark, no logos, no brands, no people, no photorealism, no gradients, no faux UI, no tiny illegible markings.

**Hero prompt:** “Wide landscape 1930s art-deco transit poster for a children’s arithmetic journey. Two small geometric counter trains, one signal coral and one brass gold, travel on distinct deep-petrol rails through square ten-frame station grids and merge into a single teal destination station. Warm cream paper grain, rhythmic stepped skyline shapes, flat screen-printed ink, precise circles and rectangles, generous clear center-left negative space, optimistic civic design, limited five-color palette. No words, no letters, no numerals, no watermark, no logos, no brands, no people, no photorealism, no gradients, no faux interface, no illegible markings.”

Generated with the factory `factory-image` deployment on 2026-08-28. The selected output and prompt sidecar live in `assets/src/`; optimized WebP derivatives live in `public/assets/`. Generated imagery is original to this product and disclosed in the footer.

The social preview at `public/assets/social-preview.jpg` is a 1200×630,
center-cropped derivative of the selected hero illustration. It introduces no
new imagery or text and is used only for Open Graph/Twitter metadata.

## Accessibility intent

The interface does not require dragging. Quantity controls are native buttons with visible labels, track steps are an ordered list, replay state is announced politely, and every ten-frame has a concise accessible text equivalent. Focus uses a high-contrast brass/ink double ring. The final discussion card remains intelligible in grayscale print.
