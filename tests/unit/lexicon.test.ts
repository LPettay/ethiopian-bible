import { describe, it, expect, beforeEach } from 'vitest'
import {
  dillmannSearchUrl,
  getGloss,
  setLexicon,
} from '../../src/lib/lexicon'

// A genuine Ge'ez lemma (mets'hafe — "book") used across cases.
const GEEZ = 'መጽሐፈ'

describe('dillmannSearchUrl', () => {
  it('returns a Beta Masaheft Dillmann search URL', () => {
    const url = dillmannSearchUrl(GEEZ)
    expect(url.startsWith('https://betamasaheft.eu/Dillmann/search?query=')).toBe(true)
  })

  it('URL-encodes the query so the Ge\'ez word travels safely', () => {
    const url = dillmannSearchUrl(GEEZ)
    expect(url).toBe(
      `https://betamasaheft.eu/Dillmann/search?query=${encodeURIComponent(GEEZ)}`,
    )
    // Raw multibyte Ge'ez must not appear unescaped in the query string.
    expect(url).toContain(encodeURIComponent(GEEZ))
  })

  it('escapes characters that would break a URL', () => {
    const url = dillmannSearchUrl('a b&c')
    expect(url).toBe('https://betamasaheft.eu/Dillmann/search?query=a%20b%26c')
  })
})

describe('getGloss', () => {
  beforeEach(() => {
    // Reset module cache to the "no lexicon loaded" state before each test.
    setLexicon(null)
  })

  it('returns null when no lexicon file/data is present', () => {
    expect(getGloss(GEEZ)).toBeNull()
  })

  it('returns null for an empty input', () => {
    expect(getGloss('')).toBeNull()
  })

  it('returns null for non-Ge\'ez input even if it matches a key', () => {
    setLexicon({ book: { gloss: 'book', source: 'Test' } })
    expect(getGloss('book')).toBeNull()
  })

  it('returns a sourced gloss when the loaded lexicon has an attributed entry', () => {
    setLexicon({ [GEEZ]: { gloss: 'book', source: 'Dillmann' } })
    expect(getGloss(GEEZ)).toEqual({ gloss: 'book', source: 'Dillmann' })
  })

  it('returns null when an entry lacks a source (unattributed glosses are rejected)', () => {
    // @ts-expect-error — intentionally malformed entry to verify integrity guard
    setLexicon({ [GEEZ]: { gloss: 'book', source: '' } })
    expect(getGloss(GEEZ)).toBeNull()
  })

  it('returns null when the loaded lexicon has no entry for the word', () => {
    setLexicon({ 'አዳም': { gloss: 'Adam', source: 'Dillmann' } })
    expect(getGloss(GEEZ)).toBeNull()
  })
})
