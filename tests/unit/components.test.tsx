import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WordCard } from '../../src/components/WordCard'
import { VerseView } from '../../src/components/VerseView'
import { DEFAULT_SETTINGS } from '../../src/types/bible'
import type { Verse, ReaderSettings } from '../../src/types/bible'

const mockVerse: Verse = {
  num: 3,
  geez: '\u12C8\u1210\u12ED\u12C8 \u1361 \u12A0\u12F3\u121D',
  translation: '',
  translations: {
    lxx: 'And Adam lived two hundred and thirty years...',
    kjv: 'And Adam lived an hundred and thirty years...',
  },
  words: [
    { g: '\u12C8\u1210\u12ED\u12C8', t: 'w\u00E4h\u00E4y\u00E4w\u00E4', gl: '' },
    { g: '\u12A0\u12F3\u121D', t: '\u00E4dam\u00E4', gl: '' },
  ],
}

const mockSingleVerse: Verse = {
  num: 1,
  geez: '\u1218\u133D\u1210\u1348',
  translation: 'The book of the words of Enoch',
  words: [
    { g: '\u1218\u133D\u1210\u1348', t: 'mets\u2019hafe', gl: 'book' },
  ],
}

const noop = () => {}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('WordCard', () => {
  it('renders Ge\'ez text', () => {
    renderWithRouter(
      <WordCard
        word={mockVerse.words[0]}
        showTransliteration={true}
        fontSize={20}
      />,
    )
    expect(screen.getByText('\u12C8\u1210\u12ED\u12C8')).toBeInTheDocument()
  })

  it('renders transliteration when showTransliteration is true', () => {
    renderWithRouter(
      <WordCard
        word={mockVerse.words[0]}
        showTransliteration={true}
        fontSize={20}
      />,
    )
    expect(screen.getByText('w\u00E4h\u00E4y\u00E4w\u00E4')).toBeInTheDocument()
  })

  it('hides transliteration when showTransliteration is false', () => {
    renderWithRouter(
      <WordCard
        word={mockVerse.words[0]}
        showTransliteration={false}
        fontSize={20}
      />,
    )
    // The Ge'ez text should still be there
    expect(screen.getByText('\u12C8\u1210\u12ED\u12C8')).toBeInTheDocument()
    // The transliteration should not
    expect(screen.queryByText('w\u00E4h\u00E4y\u00E4w\u00E4')).not.toBeInTheDocument()
  })

  it('renders gloss when present', () => {
    renderWithRouter(
      <WordCard
        word={mockSingleVerse.words[0]}
        showTransliteration={true}
        fontSize={20}
      />,
    )
    expect(screen.getByText('book')).toBeInTheDocument()
  })
})

describe('VerseView', () => {
  it('renders verse number', () => {
    renderWithRouter(
      <VerseView
        verse={mockVerse}
        settings={DEFAULT_SETTINGS}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders dual translations with correct labels in study mode', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'study' }
    renderWithRouter(
      <VerseView
        verse={mockVerse}
        settings={settings}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText('LXX (Brenton)')).toBeInTheDocument()
    expect(screen.getByText('KJV')).toBeInTheDocument()
    expect(screen.getByText('And Adam lived two hundred and thirty years...')).toBeInTheDocument()
    expect(screen.getByText('And Adam lived an hundred and thirty years...')).toBeInTheDocument()
  })

  it('renders single translation without labels for books without dual sources', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'study' }
    renderWithRouter(
      <VerseView
        verse={mockSingleVerse}
        settings={settings}
        bookAbbrev="1En"
        chapter={1}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    expect(screen.getByText('The book of the words of Enoch')).toBeInTheDocument()
    // No LXX/KJV labels
    expect(screen.queryByText('LXX (Brenton)')).not.toBeInTheDocument()
    expect(screen.queryByText('KJV')).not.toBeInTheDocument()
  })

  it('in read mode shows only text, no word cards', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'read' }
    renderWithRouter(
      <VerseView
        verse={mockVerse}
        settings={settings}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    // Read mode should show primary text (lxx preferred)
    expect(screen.getByText('And Adam lived two hundred and thirty years...')).toBeInTheDocument()
    // Should NOT show word cards (no transliteration visible as cards)
    expect(screen.queryByText('w\u00E4h\u00E4y\u00E4w\u00E4')).not.toBeInTheDocument()
    // No LXX/KJV labels in read mode
    expect(screen.queryByText('LXX (Brenton)')).not.toBeInTheDocument()
  })

  it('in compare mode shows side-by-side layout', () => {
    const settings: ReaderSettings = { ...DEFAULT_SETTINGS, readingMode: 'compare' }
    const { container } = renderWithRouter(
      <VerseView
        verse={mockVerse}
        settings={settings}
        bookAbbrev="Gen"
        chapter={5}
        isBookmarked={false}
        onToggleBookmark={noop}
      />,
    )
    // Compare mode uses a grid layout
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    // Both translations shown
    expect(screen.getByText('And Adam lived two hundred and thirty years...')).toBeInTheDocument()
    expect(screen.getByText('And Adam lived an hundred and thirty years...')).toBeInTheDocument()
  })
})
