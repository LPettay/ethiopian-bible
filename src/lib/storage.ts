import type { ReaderSettings, Bookmark, Annotation } from '../types/bible'
import { DEFAULT_SETTINGS } from '../types/bible'

const SETTINGS_KEY = 'ethiopian-bible-settings'
const BOOKMARKS_KEY = 'ethiopian-bible-bookmarks'
const ANNOTATIONS_KEY = 'ethiopian-bible-annotations'
const HISTORY_KEY = 'ethiopian-bible-history'

export function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch {}
  return { ...DEFAULT_SETTINGS }
}

export function saveSettings(settings: ReaderSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveBookmarks(bookmarks: Bookmark[]): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
}

export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  const bookmarks = loadBookmarks()
  const existing = bookmarks.find(
    b => b.book === bookmark.book && b.chapter === bookmark.chapter && b.verse === bookmark.verse
  )
  if (existing) return existing

  const newBookmark: Bookmark = {
    ...bookmark,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  bookmarks.unshift(newBookmark)
  saveBookmarks(bookmarks)
  return newBookmark
}

export function removeBookmark(id: string): void {
  const bookmarks = loadBookmarks().filter(b => b.id !== id)
  saveBookmarks(bookmarks)
}

export function isBookmarked(book: string, chapter: number, verse: number): boolean {
  return loadBookmarks().some(
    b => b.book === book && b.chapter === chapter && b.verse === verse
  )
}

export function loadAnnotations(): Annotation[] {
  try {
    const raw = localStorage.getItem(ANNOTATIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>): Annotation {
  const annotations = loadAnnotations()
  const existing = annotations.find(
    a => a.book === annotation.book && a.chapter === annotation.chapter && a.verse === annotation.verse
  )

  if (existing) {
    existing.text = annotation.text
    existing.updatedAt = new Date().toISOString()
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations))
    return existing
  }

  const newAnnotation: Annotation = {
    ...annotation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  annotations.unshift(newAnnotation)
  localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations))
  return newAnnotation
}

export function getAnnotation(book: string, chapter: number, verse: number): Annotation | undefined {
  return loadAnnotations().find(
    a => a.book === book && a.chapter === chapter && a.verse === verse
  )
}

export function removeAnnotation(id: string): void {
  const annotations = loadAnnotations().filter(a => a.id !== id)
  localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations))
}

export interface HistoryEntry {
  book: string
  chapter: number
  timestamp: string
}

export function addToHistory(book: string, chapter: number): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : []
    // Remove duplicate if exists
    const filtered = history.filter(h => !(h.book === book && h.chapter === chapter))
    filtered.unshift({ book, chapter, timestamp: new Date().toISOString() })
    // Keep last 50
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered.slice(0, 50)))
  } catch {}
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
