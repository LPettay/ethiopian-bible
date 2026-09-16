import { describe, it, expect } from 'vitest'
import { hasGeezScript, isStubBook, isPlaceholderVerse } from '../../src/lib/stub'
import type { Book, Verse } from '../../src/types/bible'

const stubBook: Book = {
  abbrev: 'Lef',
  name: 'Lefafa Sedq',
  section: 'Unique to Ethiopia',
  chapters: 7,
  source_id: 'LIT1758Lefafa',
  stub: true,
}

const realBook: Book = {
  abbrev: 'MysHE',
  name: 'Mysteries of Heaven & Earth',
  section: 'Unique to Ethiopia',
  chapters: 4,
  source_id: 'LIT1954Mashaf',
}

describe('hasGeezScript', () => {
  it('returns true for Ge\'ez text', () => {
    expect(hasGeezScript('መጽሐፈ')).toBe(true)
  })

  it('returns false for Latin text', () => {
    expect(hasGeezScript('First Prayer')).toBe(false)
  })

  it('returns false for an empty string', () => {
    expect(hasGeezScript('')).toBe(false)
  })

  it('returns true when Ge\'ez is mixed with Latin', () => {
    expect(hasGeezScript('Chapter 1\nበእንተ')).toBe(true)
  })
})

describe('isStubBook', () => {
  it('returns true when book.stub === true', () => {
    expect(isStubBook(stubBook)).toBe(true)
  })

  it('returns false when book.stub is absent', () => {
    expect(isStubBook(realBook)).toBe(false)
  })

  it('returns false when book.stub === false', () => {
    expect(isStubBook({ ...realBook, stub: false })).toBe(false)
  })
})

describe('isPlaceholderVerse', () => {
  it('returns true for an English placeholder line', () => {
    const verse: Pick<Verse, 'geez'> = { geez: 'First Prayer' }
    expect(isPlaceholderVerse(verse)).toBe(true)
  })

  it('returns false for a real Ge\'ez verse', () => {
    const verse: Pick<Verse, 'geez'> = { geez: 'ወሐይወ ፡ አዳም' }
    expect(isPlaceholderVerse(verse)).toBe(false)
  })

  it('returns true for an empty geez field', () => {
    expect(isPlaceholderVerse({ geez: '' })).toBe(true)
  })
})
