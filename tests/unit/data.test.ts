import { describe, it, expect } from 'vitest'
import { getBookSections, getBookByAbbrev, hasDualTranslations } from '../../src/lib/data'
import type { Book, Chapter } from '../../src/types/bible'

const sampleBooks: Book[] = [
  { abbrev: '1En', name: '1 Enoch', section: 'Unique to Ethiopia', chapters: 108, source_id: 'enoch' },
  { abbrev: 'Jub', name: 'Jubilees', section: 'Unique to Ethiopia', chapters: 50, source_id: 'jub' },
  { abbrev: 'Tob', name: 'Tobit', section: 'Deuterocanonical', chapters: 14, source_id: 'tob' },
  { abbrev: 'Sir', name: 'Sirach', section: 'Deuterocanonical', chapters: 51, source_id: 'sir' },
  { abbrev: 'Gen', name: 'Genesis', section: 'Other', chapters: 50, source_id: 'gen' },
]

describe('getBookSections', () => {
  it('groups books by section in correct order', () => {
    const sections = getBookSections(sampleBooks)

    expect(sections).toHaveLength(3)
    expect(sections[0].label).toBe('Unique to Ethiopia')
    expect(sections[0].books).toHaveLength(2)
    expect(sections[1].label).toBe('Deuterocanonical')
    expect(sections[1].books).toHaveLength(2)
    expect(sections[2].label).toBe('Other')
    expect(sections[2].books).toHaveLength(1)
  })

  it('places unknown sections after the known ones', () => {
    const booksWithExtra: Book[] = [
      ...sampleBooks,
      { abbrev: 'Ps', name: 'Psalms', section: 'Wisdom', chapters: 151, source_id: 'ps' },
    ]
    const sections = getBookSections(booksWithExtra)

    const labels = sections.map(s => s.label)
    expect(labels).toEqual(['Unique to Ethiopia', 'Deuterocanonical', 'Other', 'Wisdom'])
  })
})

describe('getBookByAbbrev', () => {
  it('finds book by abbreviation', () => {
    const book = getBookByAbbrev(sampleBooks, '1En')
    expect(book).toBeDefined()
    expect(book!.name).toBe('1 Enoch')
  })

  it('returns undefined for unknown abbreviation', () => {
    const book = getBookByAbbrev(sampleBooks, 'UNKNOWN')
    expect(book).toBeUndefined()
  })
})

describe('hasDualTranslations', () => {
  it('returns true when chapter has translations.lxx', () => {
    const chapter: Chapter = {
      book: 'Gen',
      chapter: 5,
      verses: [
        {
          num: 1,
          geez: 'test',
          translation: '',
          translations: { lxx: 'LXX text' },
          words: [],
        },
      ],
    }
    expect(hasDualTranslations(chapter)).toBe(true)
  })

  it('returns true when chapter has translations.kjv', () => {
    const chapter: Chapter = {
      book: 'Gen',
      chapter: 5,
      verses: [
        {
          num: 1,
          geez: 'test',
          translation: '',
          translations: { kjv: 'KJV text' },
          words: [],
        },
      ],
    }
    expect(hasDualTranslations(chapter)).toBe(true)
  })

  it('returns false for chapter without translations object', () => {
    const chapter: Chapter = {
      book: '1En',
      chapter: 1,
      verses: [
        {
          num: 1,
          geez: 'test',
          translation: 'English text',
          words: [],
        },
      ],
    }
    expect(hasDualTranslations(chapter)).toBe(false)
  })

  it('returns false when translations exists but has no lxx or kjv', () => {
    const chapter: Chapter = {
      book: '1En',
      chapter: 1,
      verses: [
        {
          num: 1,
          geez: 'test',
          translation: 'English text',
          translations: {},
          words: [],
        },
      ],
    }
    expect(hasDualTranslations(chapter)).toBe(false)
  })
})
