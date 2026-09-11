# ADR 0007: Manuscript aesthetic as the design language

## Status

Accepted — 2026-04-06

(Permanent design language, per project owner.)

Primary commit: `f773460` ("Visual redesign: manuscript aesthetic").

## Context

The early v0.1 visual treatment was generic web-app: card borders, sans-serif body text, neutral grays, blue accents. Functional, but it framed the Ethiopian Bible as *content inside a software product*. The project's whole proposition — that this corpus is ancient, hand-copied for over a millennium in liturgical use, preserves what other traditions lost — is undermined by a UI that reads as a SaaS dashboard.

The Ge'ez script itself is calligraphic; the texts are scribal; the source manuscripts (Garima Gospels, c. 390–660 CE) are illuminated. A design language that *competes* with the source material loses; one that *frames* it wins.

## Decision

The visual treatment is **manuscript aesthetic**, applied across the app and treated as a load-bearing design choice, not a theme:

- **Palette.** Warm browns, parchment, ink. No card borders — sections are demarcated by subtle background shifts and parchment-grain gradients, not strokes.
- **Typography.** **Crimson Pro** serif for body reading. **Noto Sans Ethiopic** for Ge'ez, larger and with a soft text-glow effect to evoke gold-leaf illumination. **Inter** sans-serif reserved for UI chrome only (settings, navigation), never for reading text.
- **Ornaments.** Ethiopian **meskel cross** as a recurring motif — section dividers, welcome page door-entries, page ornaments. Restrained, not decorative kitsch.
- **Layout.** `WordCard` is borderless with larger Ge'ez and flowing layout. `VerseView` uses margin-set verse numbers (manuscript convention) and thinner translation borders. Settings panel reads as a margin note rather than a modal.
- **Mood.** "Reading a beautiful old book by candlelight" rather than "using software."

This is the design language going forward. Future visual changes work *with* it — not toward a "clean modern redesign" that would re-flatten the project into generic SaaS.

## Consequences

- **Pro:** The UI frames the corpus as ancient and sacred, which is what the corpus *is*. Tone matches subject matter.
- **Pro:** Borderless layout reduces visual noise around the Ge'ez, which is what the user is actually looking at.
- **Pro:** The text-glow on Ge'ez is a small but constant cue that this is the source, not a translation.
- **Pro:** The aesthetic is a moat. Other Bible apps look like Bible apps; this one doesn't.
- **Con:** Crimson Pro and Noto Sans Ethiopic are webfont loads — bundle/network cost not paid by Inter alone. Acceptable; they're load-bearing.
- **Con:** Manuscript aesthetic on small screens needs care — meskel cross ornaments and parchment gradients can crowd a phone viewport. Each new component has to pass a mobile review.
- **Con:** Designers/contributors who want to "modernize" or "clean up" the UI will read the warm-brown serif as outdated. The ADR exists in part to push back on that reading: it is not outdated, it is deliberate.

## Alternatives considered

- **Generic modern web-app aesthetic** (the pre-`f773460` state) — fast to build, recedes into the page, but flattens the subject matter. Rejected; this is what was replaced.
- **Maximalist illuminated-manuscript pastiche** — gold leaf, heavy borders, ornate frames. Rejected — competes with the Ge'ez instead of framing it; would also be exhausting to read for any length.
- **Dark mode as primary** — candlelight reading is evocative, but dark mode as default hurts daytime readability. The warm-brown light treatment captures the mood without the contrast cost.
