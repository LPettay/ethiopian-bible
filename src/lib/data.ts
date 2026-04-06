import type { Book, Chapter } from '../types/bible'

const DATA_BASE = `${import.meta.env.BASE_URL}data`

let booksCache: Book[] | null = null

export async function loadBooks(): Promise<Book[]> {
  if (booksCache) return booksCache
  const res = await fetch(`${DATA_BASE}/books.json`)
  if (!res.ok) throw new Error(`Failed to load books: ${res.status}`)
  booksCache = await res.json()
  return booksCache!
}

const chapterCache = new Map<string, Chapter>()

export async function loadChapter(book: string, chapter: number): Promise<Chapter> {
  const key = `${book}/${chapter}`
  const cached = chapterCache.get(key)
  if (cached) return cached

  const res = await fetch(`${DATA_BASE}/chapters/${book}/${chapter}.json`)
  if (!res.ok) throw new Error(`Failed to load ${key}: ${res.status}`)
  const data: Chapter = await res.json()
  chapterCache.set(key, data)
  return data
}

export function getBookByAbbrev(books: Book[], abbrev: string): Book | undefined {
  return books.find(b => b.abbrev === abbrev)
}

export function getBookSections(books: Book[]): { label: string; books: Book[] }[] {
  const sectionOrder = ['Unique to Ethiopia', 'Deuterocanonical', 'Other']
  const grouped: Record<string, Book[]> = {}

  for (const book of books) {
    const sec = book.section || 'Other'
    if (!grouped[sec]) grouped[sec] = []
    grouped[sec].push(book)
  }

  const result: { label: string; books: Book[] }[] = []
  for (const sec of sectionOrder) {
    if (grouped[sec]) {
      result.push({ label: sec, books: grouped[sec] })
      delete grouped[sec]
    }
  }
  for (const [label, books] of Object.entries(grouped)) {
    result.push({ label, books })
  }
  return result
}

export function hasDualTranslations(chapter: Chapter): boolean {
  return chapter.verses.some(v => v.translations && (v.translations.lxx || v.translations.kjv))
}
