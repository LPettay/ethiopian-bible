# ADR 0005: Confidence-aware AI translation as a separate tier

## Status

Accepted — 2026-04-06

Primary commit: `ef1775d` ("Add confidence-aware AI translation system").

## Context

Translation coverage is uneven: at v0.1 the corpus has 36 books in Ge'ez, but only ~20 with dual published English (LXX + KJV). For the books and chapters with no published English translation in the public domain, the choices are:

1. Leave them Ge'ez-only — accurate but useless to most readers.
2. Hand-translate from scratch — accurate but doesn't scale; would block v0.2.
3. Use an LLM to draft a translation — scales, but conflates AI output with scholarly translation in a way that misleads readers.

Option 3 is the only one that closes coverage on a useful timeline, but only if the UI makes the AI provenance unmistakable and the translation's quality is *measurable*, not vibes-based.

## Decision

AI-drafted translations are a **separate tier** alongside published translations, with three properties:

1. **Schema separation.** `Verse.translations.ai` is a distinct field of type `TranslationEntry` (`src/types/bible.ts`), with `tier: 'published' | 'lexicon' | 'ai-draft'`, `confidence: number` (0–1), `source: string` ("AI (Claude)"), `verifiedWords: number`, and `totalWords: number`. It is never merged into `lxx` or `kjv`.

2. **Measurable confidence.** The score is computed by cross-referencing the AI's output against the **Dillmann lexicon** (the standard scholarly Ge'ez–Latin/German lexicon). The pipeline (`research/tools/ai_translate.py`):
   - Looks up each Ge'ez word in Dillmann.
   - Drafts a translation with Claude, given the verse and the lexicon hits as context.
   - Scores how many Dillmann-verified word glosses appear in the draft.
   - `confidence = verifiedWords / totalWords`.

3. **Visible UI signaling.** AI drafts get amber borders, a `ConfidenceBadge` (visual bar + tooltip), and a `ConfidencePill` for compact views. Hover shows "9/12 words verified against Dillmann lexicon" plus a scholar disclaimer. A user setting (`showAiTranslation`) toggles them off entirely.

## Consequences

- **Pro:** Closes translation coverage on books that would otherwise stay Ge'ez-only, without misrepresenting AI output as scholarship.
- **Pro:** Confidence is *measurable* (Dillmann lookup hit-rate), not asserted. Readers can calibrate trust per-verse.
- **Pro:** The tier is opt-in via `showAiTranslation`; readers who want only published translations get them.
- **Pro:** The pipeline (`ai_translate.py`) lives in `research/`, not `app/` — runtime cost is paid once at content-generation time, not per page load.
- **Con:** Even with badges and disclaimers, a casual screenshot strips the signaling. A reader who shares an AI-translated verse loses the confidence context.
- **Con:** Dillmann coverage isn't uniform across the Ethiopian corpus — words from later books or Ethiopic-only vocabulary score lower not because the AI is wrong but because Dillmann doesn't cover them. The score is a floor, not a ceiling.
- **Con:** Adds a third translation column to `study` and `compare` modes (ADR-0004), increasing visual density.

## Alternatives considered

- **No AI translations** — keeps the corpus honest but leaves ~16 books Ge'ez-only at v0.2. Rejected — translation pending markers without actual translations help no one.
- **Merge AI output into `translation` field with no badging** — fastest, dishonest, rejected outright.
- **Single confidence number with no Dillmann grounding** — vibes-based confidence is worse than no confidence. Rejected.
