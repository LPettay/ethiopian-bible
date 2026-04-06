import { describe, it, expect } from 'vitest'
import { DEFAULT_SETTINGS } from '../../src/types/bible'

describe('DEFAULT_SETTINGS', () => {
  it('has all expected keys with correct default values', () => {
    expect(DEFAULT_SETTINGS).toEqual({
      readingMode: 'study',
      showTransliteration: true,
      showLxx: true,
      showKjv: true,
      showGeezSource: true,
      fontSize: 20,
    })
  })

  it('readingMode defaults to study', () => {
    expect(DEFAULT_SETTINGS.readingMode).toBe('study')
  })

  it('transliteration is enabled by default', () => {
    expect(DEFAULT_SETTINGS.showTransliteration).toBe(true)
  })

  it('fontSize defaults to 20', () => {
    expect(DEFAULT_SETTINGS.fontSize).toBe(20)
  })
})
