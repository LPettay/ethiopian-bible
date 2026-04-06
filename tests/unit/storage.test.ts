import { describe, it, expect, beforeEach } from 'vitest'
import {
  loadSettings,
  saveSettings,
  addBookmark,
  removeBookmark,
  isBookmarked,
  loadBookmarks,
  saveAnnotation,
  removeAnnotation,
  loadAnnotations,
  addToHistory,
  loadHistory,
} from '../../src/lib/storage'
import { DEFAULT_SETTINGS } from '../../src/types/bible'

beforeEach(() => {
  localStorage.clear()
})

describe('loadSettings', () => {
  it('returns defaults when localStorage is empty', () => {
    const settings = loadSettings()
    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('returns a copy, not the same reference', () => {
    const a = loadSettings()
    const b = loadSettings()
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})

describe('saveSettings + loadSettings round-trip', () => {
  it('round-trips correctly', () => {
    const custom = {
      ...DEFAULT_SETTINGS,
      readingMode: 'read' as const,
      fontSize: 28,
      showTransliteration: false,
    }
    saveSettings(custom)
    const loaded = loadSettings()
    expect(loaded).toEqual(custom)
  })

  it('merges partial saved data with defaults', () => {
    // Simulate only some keys being in storage (e.g., from older version)
    localStorage.setItem(
      'ethiopian-bible-settings',
      JSON.stringify({ fontSize: 32 }),
    )
    const loaded = loadSettings()
    expect(loaded.fontSize).toBe(32)
    expect(loaded.readingMode).toBe(DEFAULT_SETTINGS.readingMode)
    expect(loaded.showTransliteration).toBe(DEFAULT_SETTINGS.showTransliteration)
  })
})

describe('addBookmark', () => {
  it('adds a bookmark and returns it with id and createdAt', () => {
    const bm = addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    expect(bm.id).toBeDefined()
    expect(typeof bm.id).toBe('string')
    expect(bm.createdAt).toBeDefined()
    expect(bm.book).toBe('Gen')
    expect(bm.chapter).toBe(1)
    expect(bm.verse).toBe(1)

    const all = loadBookmarks()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(bm.id)
  })

  it('returns existing bookmark for duplicate book/chapter/verse', () => {
    const first = addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    const second = addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    expect(second.id).toBe(first.id)
    expect(loadBookmarks()).toHaveLength(1)
  })

  it('allows bookmarks for different verses', () => {
    addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    addBookmark({ book: 'Gen', chapter: 1, verse: 2 })
    expect(loadBookmarks()).toHaveLength(2)
  })
})

describe('removeBookmark', () => {
  it('removes by id', () => {
    const bm = addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    expect(loadBookmarks()).toHaveLength(1)

    removeBookmark(bm.id)
    expect(loadBookmarks()).toHaveLength(0)
  })

  it('does not affect other bookmarks', () => {
    const bm1 = addBookmark({ book: 'Gen', chapter: 1, verse: 1 })
    const bm2 = addBookmark({ book: 'Gen', chapter: 1, verse: 2 })

    removeBookmark(bm1.id)
    const remaining = loadBookmarks()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe(bm2.id)
  })
})

describe('isBookmarked', () => {
  it('returns true when bookmarked', () => {
    addBookmark({ book: 'Gen', chapter: 1, verse: 3 })
    expect(isBookmarked('Gen', 1, 3)).toBe(true)
  })

  it('returns false when not bookmarked', () => {
    expect(isBookmarked('Gen', 1, 3)).toBe(false)
  })

  it('returns false after removing the bookmark', () => {
    const bm = addBookmark({ book: 'Gen', chapter: 1, verse: 3 })
    removeBookmark(bm.id)
    expect(isBookmarked('Gen', 1, 3)).toBe(false)
  })
})

describe('saveAnnotation', () => {
  it('creates new annotation with id and timestamps', () => {
    const ann = saveAnnotation({
      book: 'Gen',
      chapter: 1,
      verse: 1,
      text: 'My note',
    })
    expect(ann.id).toBeDefined()
    expect(ann.createdAt).toBeDefined()
    expect(ann.updatedAt).toBeDefined()
    expect(ann.text).toBe('My note')

    const all = loadAnnotations()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(ann.id)
  })

  it('updates existing annotation for same book/chapter/verse', () => {
    const first = saveAnnotation({
      book: 'Gen',
      chapter: 1,
      verse: 1,
      text: 'First note',
    })
    const second = saveAnnotation({
      book: 'Gen',
      chapter: 1,
      verse: 1,
      text: 'Updated note',
    })

    expect(second.id).toBe(first.id)
    expect(second.text).toBe('Updated note')
    expect(loadAnnotations()).toHaveLength(1)
  })
})

describe('removeAnnotation', () => {
  it('removes by id', () => {
    const ann = saveAnnotation({
      book: 'Gen',
      chapter: 1,
      verse: 1,
      text: 'My note',
    })
    expect(loadAnnotations()).toHaveLength(1)

    removeAnnotation(ann.id)
    expect(loadAnnotations()).toHaveLength(0)
  })
})

describe('addToHistory', () => {
  it('adds entry and retrieves it', () => {
    addToHistory('Gen', 1)
    const history = loadHistory()
    expect(history).toHaveLength(1)
    expect(history[0].book).toBe('Gen')
    expect(history[0].chapter).toBe(1)
    expect(history[0].timestamp).toBeDefined()
  })

  it('deduplicates by moving existing to front', () => {
    addToHistory('Gen', 1)
    addToHistory('Gen', 2)
    addToHistory('Gen', 1) // should move to front, not duplicate

    const history = loadHistory()
    expect(history).toHaveLength(2)
    expect(history[0].book).toBe('Gen')
    expect(history[0].chapter).toBe(1)
    expect(history[1].chapter).toBe(2)
  })

  it('keeps max 50 entries', () => {
    for (let i = 1; i <= 55; i++) {
      addToHistory('Gen', i)
    }
    const history = loadHistory()
    expect(history).toHaveLength(50)
    // Most recent should be first
    expect(history[0].chapter).toBe(55)
    // Oldest kept should be chapter 6 (1-5 trimmed)
    expect(history[49].chapter).toBe(6)
  })
})
