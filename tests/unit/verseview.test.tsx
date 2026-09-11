import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { VerseView } from '../../src/components/VerseView'
import { resolveVerseBody, readModeSource } from '../../src/components/verseView.helpers'
import { DEFAULT_SETTINGS } from '../../src/types/bible'
import type { Verse, ReaderSettings, TranslationSource } from '../../src/types/bible'

const noop = () => {}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// A dual-source verse whose generic `translation` is empty — the exact shape
// that produced blank verses before the fix.
const dualVerse: Verse = {
  num: 3,
  geez: 'ወሐይወ',
  translation: '',
  translations: {
    lxx: 'And Adam lived two hundred and thirty years.',
    kjv: 'And Adam lived an hundred and thirty years.',
  },
  words: [{ g: 'ወሐይወ', t: 'wähäyäwä', gl: '' }],
}

// A single-source verse missing `translation` but carrying lxx text — must fall
// back to the best available text rather than render blank.
const fallbackVerse: Verse = {
  num: 1,
  geez: 'መጽሐፈ',
  translation: '',
  translations: { lxx: 'In the beginning was the word.' },
  words: [],
}

describe('resolveVerseBody', () => {
  it('falls back to lxx when generic translation is empty', () => {
    const r = resolveVerseBody(dualVerse, true)
    expect(r).toEqual({ kind: 'text', text: 'And Adam lived two hundred and thirty years.' })
  })

  it('falls back through kjv → translation → ai.text in priority order', () => {
    const kjvOnly: Verse = { num: 1, geez: '', translation: '', translations: { kjv: 'KJV body.' }, words: [] }
    expect(resolveVerseBody(kjvOnly, true)).toEqual({ kind: 'text', text: 'KJV body.' })

    const genericOnly: Verse = { num: 1, geez: '', translation: 'Generic body.', words: [] }
    expect(resolveVerseBody(genericOnly, true)).toEqual({ kind: 'text', text: 'Generic body.' })

    const aiOnly: Verse = {
      num: 1,
      geez: '',
      translation: '',
      translations: { ai: { text: 'AI body.', tier: 'ai-draft' } },
      words: [],
    }
    expect(resolveVerseBody(aiOnly, true)).toEqual({ kind: 'text', text: 'AI body.' })
  })

  it('reports "hidden" (not blank) when every source is toggled off but text exists', () => {
    const r = resolveVerseBody(dualVerse, false)
    expect(r).toEqual({ kind: 'hidden' })
  })

  it('returns empty text (not hidden) when there is genuinely no text at all', () => {
    const blank: Verse = { num: 1, geez: '', translation: '', words: [] }
    expect(resolveVerseBody(blank, false)).toEqual({ kind: 'text', text: '' })
  })
})

describe('readModeSource', () => {
  it('uses translationSources metadata for an edition-attributed label', () => {
    const sources: Record<string, TranslationSource> = {
      lxx: { name: 'Brenton LXX', year: 1851, tradition: 'Septuagint' },
      kjv: { name: 'King James Version', year: 1611, tradition: 'Masoretic' },
    }
    expect(readModeSource(dualVerse, sources)).toEqual({
      key: 'lxx',
      label: 'Brenton LXX 1851 (Septuagint)',
    })
  })

  it('falls back to a constant edition map when metadata is absent', () => {
    expect(readModeSource(dualVerse)).toEqual({ key: 'lxx', label: 'Brenton 1851 (Septuagint)' })

    const kjvOnly: Verse = { num: 1, geez: '', translation: '', translations: { kjv: 'x' }, words: [] }
    expect(readModeSource(kjvOnly)).toEqual({ key: 'kjv', label: 'King James Version' })
  })

  it('returns null when no scholarly source is available', () => {
    const generic: Verse = { num: 1, geez: '', translation: 'plain', words: [] }
    expect(readModeSource(generic)).toBeNull()
  })
})

describe('VerseView blank-state behaviour', () => {
  it('study mode shows a muted hint instead of a blank verse when all sources are off', () => {
    const settings: ReaderSettings = {
      ...DEFAULT_SETTINGS,
      readingMode: 'study',
      showLxx: false,
      showKjv: false,
      showAiTranslation: false,
    }
    renderWithRouter(
      <VerseView
        verse={dualVerse}
        settings={settings}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText(/All translations hidden/i)).toBeInTheDocument()
  })

  it('study mode single-source verse falls back to lxx instead of rendering blank', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'study' }
    renderWithRouter(
      <VerseView
        verse={fallbackVerse}
        settings={settings}
        bookAbbrev="1En"
        chapter={1}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText('In the beginning was the word.')).toBeInTheDocument()
  })

  it('compare mode single-source verse (no lxx/kjv) falls back to best text instead of a blank paragraph', () => {
    // A single-source verse (no lxx/kjv → !hasDual) whose generic `translation`
    // is empty but which carries an AI draft. Before the fix, compare mode's
    // `!hasDual` branch rendered `verse.translation` directly → an empty <p>.
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'compare' }
    const aiOnly: Verse = {
      num: 1,
      geez: 'መጽሐፈ',
      translation: '',
      translations: { ai: { text: 'An AI-drafted reading.', tier: 'ai-draft' } },
      words: [],
    }
    renderWithRouter(
      <VerseView
        verse={aiOnly}
        settings={settings}
        bookAbbrev="1En"
        chapter={1}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText('An AI-drafted reading.')).toBeInTheDocument()
  })

  it('compare mode shows a hint instead of a blank verse when there is no text at all', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'compare' }
    const empty: Verse = { num: 1, geez: 'መጽሐፈ', translation: '', words: [] }
    renderWithRouter(
      <VerseView
        verse={empty}
        settings={settings}
        bookAbbrev="1En"
        chapter={1}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText(/All translations hidden/i)).toBeInTheDocument()
  })

  it('read mode shows an edition-attributed source label', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'read' }
    renderWithRouter(
      <VerseView
        verse={dualVerse}
        settings={settings}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
        translationSources={{ lxx: { name: 'Brenton LXX', year: 1851, tradition: 'Septuagint' } }}
      />,
    )
    expect(screen.getByText('Brenton LXX 1851 (Septuagint)')).toBeInTheDocument()
    expect(screen.getByText('And Adam lived two hundred and thirty years.')).toBeInTheDocument()
  })
})
