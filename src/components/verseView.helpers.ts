import type { Verse, TranslationSource } from '../types/bible'

/** Fallback edition labels when the chapter omits translationSources metadata. */
const DEFAULT_SOURCE_LABELS: Record<'lxx' | 'kjv', string> = {
  lxx: 'Brenton 1851 (Septuagint)',
  kjv: 'King James Version',
}

/**
 * Which translation source the read-mode primary text was drawn from, plus a
 * human-readable, edition-attributed label. Returns null when there is nothing
 * worth attributing (no scholarly source available).
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
    ? `${src.name}${src.year ? ` ${src.year}` : ''}${src.tradition ? ` (${src.tradition})` : ''}`
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
