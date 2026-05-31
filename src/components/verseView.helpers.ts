import type { Verse, TranslationSource } from '../types/bible'

/**
 * Canonical full provenance labels, format 'Tradition — Edition (year)'.
 *
 * These are the single source of truth used wherever a text source is named in
 * the reader's full-label contexts (read mode). They double as the fallback
 * when a chapter omits its `translationSources` metadata.
 *
 * - lxx: Brenton's 1851 English Septuagint, translated from Codex Vaticanus
 *   (public domain).
 * - kjv: the KJV Old Testament renders the Masoretic Hebrew; 'Masoretic' is
 *   used as a value-neutral tradition term (not 'Protestant').
 */
const DEFAULT_SOURCE_LABELS: Record<'lxx' | 'kjv', string> = {
  lxx: 'Septuagint — Brenton (1851)',
  kjv: 'Masoretic — King James (1611)',
}

/**
 * One-line provenance legend for the chapter header, shown only on chapters
 * that carry two textual traditions side by side. Calm orientation, not
 * marketing: it names what the reader is looking at and where the Geʿez comes
 * from. Sourced — Brenton (1851) for the LXX, the Masoretic Hebrew for the KJV
 * OT, and Beta Masaheft (Universität Hamburg, CC BY-SA 4.0) for the Geʿez.
 */
export const PROVENANCE_LEGEND =
  'Two textual traditions are shown side by side: Septuagint — Brenton (1851) ' +
  'and Masoretic — King James (1611). Geʿez is from Beta Masaheft.'

/**
 * Which translation source the read-mode primary text was drawn from, plus a
 * human-readable, edition-attributed label. Returns null when there is nothing
 * worth attributing (no scholarly source available).
 *
 * When chapter metadata is present the label is composed as
 * 'Tradition — Edition (year)'; absent metadata it falls back to the identical
 * canonical full label in DEFAULT_SOURCE_LABELS.
 */
export function readModeSource(
  verse: Verse,
  sources?: Record<string, TranslationSource>,
): { key: 'lxx' | 'kjv'; label: string } | null {
  let key: 'lxx' | 'kjv' | null = null
  if (verse.translations?.lxx) key = 'lxx'
  else if (verse.translations?.kjv) key = 'kjv'
  if (!key) return null

  const src = sources?.[key]
  const label = src
    ? `${src.tradition} — ${src.name} (${src.year})`
    : DEFAULT_SOURCE_LABELS[key]
  return { key, label }
}

/**
 * Resolve the verse body to display, never silently empty.
 * - 'text'  → render `text` as the verse body
 * - 'hidden' → user toggled off every source; show a muted hint instead
 *
 * `hasAnySourceOn` is true when at least one translation toggle is enabled.
 */
export function resolveVerseBody(
  verse: Verse,
  hasAnySourceOn: boolean,
): { kind: 'text'; text: string } | { kind: 'hidden' } {
  const best =
    verse.translations?.lxx ||
    verse.translations?.kjv ||
    verse.translation ||
    verse.translations?.ai?.text ||
    ''

  if (!hasAnySourceOn && best) {
    return { kind: 'hidden' }
  }
  return { kind: 'text', text: best }
}
