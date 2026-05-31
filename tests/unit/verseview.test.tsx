import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { VerseView, ProvenanceLegend } from '../../src/components/VerseView'
import { VariantIndicator } from '../../src/components/VariantIndicator'
import {
  resolveVerseBody,
  readModeSource,
  PROVENANCE_LEGEND,
} from '../../src/components/verseView.helpers'
import { KNOWN_VARIANTS } from '../../src/components/variantIndicator.helpers'
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
  it('composes the metadata label as "Tradition — Edition (year)"', () => {
    const sources: Record<string, TranslationSource> = {
      lxx: { name: 'Brenton LXX', year: 1851, tradition: 'Septuagint' },
      kjv: { name: 'King James Version', year: 1611, tradition: 'Masoretic' },
    }
    expect(readModeSource(dualVerse, sources)).toEqual({
      key: 'lxx',
      label: 'Septuagint — Brenton LXX (1851)',
    })
  })

  it('falls back to the canonical full labels when metadata is absent', () => {
    expect(readModeSource(dualVerse)).toEqual({ key: 'lxx', label: 'Septuagint — Brenton (1851)' })

    const kjvOnly: Verse = { num: 1, geez: '', translation: '', translations: { kjv: 'x' }, words: [] }
    expect(readModeSource(kjvOnly)).toEqual({ key: 'kjv', label: 'Masoretic — King James (1611)' })
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
    expect(screen.getByText('Septuagint — Brenton LXX (1851)')).toBeInTheDocument()
    expect(screen.getByText('And Adam lived two hundred and thirty years.')).toBeInTheDocument()
  })

  it('read mode uses the canonical full label when no chapter metadata is present', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'read' }
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
    expect(screen.getByText('Septuagint — Brenton (1851)')).toBeInTheDocument()
  })
})

describe('ProvenanceLegend', () => {
  it('renders the one calm orientation line naming both traditions and the Geʿez source', () => {
    render(<ProvenanceLegend />)
    expect(screen.getByText(PROVENANCE_LEGEND)).toBeInTheDocument()
    expect(PROVENANCE_LEGEND).toContain('Septuagint — Brenton (1851)')
    expect(PROVENANCE_LEGEND).toContain('Masoretic — King James (1611)')
    expect(PROVENANCE_LEGEND).toContain('Beta Masaheft')
  })
})

describe('VariantIndicator on-demand note', () => {
  it('renders nothing for a verse with no known variant', () => {
    const { container } = renderWithRouter(
      <VariantIndicator book="Gen" chapter={1} verse={1} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('is quiet by default — the note is not auto-opened', () => {
    renderWithRouter(<VariantIndicator book="Gen" chapter={5} verse={3} />)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens a three-part sourced note on click: what differs, witnesses, source + Compare link', () => {
    renderWithRouter(<VariantIndicator book="Gen" chapter={5} verse={3} />)
    fireEvent.click(screen.getByRole('button'))

    const tip = screen.getByRole('tooltip')
    expect(tip).toBeInTheDocument()
    expect(tip).toHaveTextContent('Adam’s age at begetting Seth: LXX reads 230 years, MT reads 130.')
    // Witnesses, stated only where verified.
    expect(tip).toHaveTextContent('Samaritan Pentateuch 130')
    expect(tip).toHaveTextContent('The Dead Sea Scrolls preserve no Genesis 5 numbers')
    // Source attribution + Compare link.
    expect(tip).toHaveTextContent('Associates for Biblical Research')
    const link = screen.getByRole('link', { name: /More on the Compare page/ })
    expect(link).toHaveAttribute('href', '/compare')
  })

  it('omits the witnesses line when none is verified for that verse', () => {
    renderWithRouter(<VariantIndicator book="Job" chapter={42} verse={17} />)
    fireEvent.click(screen.getByRole('button'))
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('identifying Job with Jobab')
    // Job 42:17 has no `witnesses` field — honest omission, not an invented witness.
    expect(KNOWN_VARIANTS['Job:42:17'].witnesses).toBeUndefined()
  })

  it('Genesis 5 note no longer claims DSS or Luke as witnesses (corrected, honest)', () => {
    const note = KNOWN_VARIANTS['Gen:5:3']
    expect(note.witnesses).toBeDefined()
    expect(note.witnesses).not.toMatch(/Luke/i)
    // It states the DSS *absence* rather than citing them as a supporting witness.
    expect(note.witnesses).toContain('preserve no Genesis 5 numbers')
  })
})
