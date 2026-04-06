import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Book } from '../types/bible'
import { loadBooks, getBookSections } from '../lib/data'

// Translation status — detected at load time from chapter 1 data
type TranslationStatus = 'dual' | 'single' | 'geez'

async function detectTranslationStatus(abbrev: string): Promise<TranslationStatus> {
  try {
    const res = await fetch(`/ethiopian-bible/data/chapters/${abbrev}/1.json`)
    if (!res.ok) return 'geez'
    const ch = await res.json()
    for (const v of ch.verses?.slice(0, 5) ?? []) {
      if (v.translations?.lxx || v.translations?.kjv) return 'dual'
      if (v.translation) return 'single'
    }
  } catch {}
  return 'geez'
}

const STATUS_LABELS = {
  dual: { dot: 'bg-lxx', label: 'LXX + KJV' },
  single: { dot: 'bg-accent', label: 'English' },
  geez: { dot: 'bg-text-faint', label: 'Ge\u02bfez only' },
}

const SECTION_LABELS: Record<string, string> = {
  'Unique to Ethiopia': 'Unique to the Ethiopian Canon',
  'Deuterocanonical': 'Deuterocanonical Books',
  'Other': 'Shared with Western Bibles',
}

export function BiblePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [statuses, setStatuses] = useState<Record<string, TranslationStatus>>({})
  const navigate = useNavigate()

  useEffect(() => {
    loadBooks().then(async (loadedBooks) => {
      setBooks(loadedBooks)
      // Detect translation status for all books in parallel
      const entries = await Promise.all(
        loadedBooks.map(async (b) => {
          const status = await detectTranslationStatus(b.abbrev)
          return [b.abbrev, status] as const
        })
      )
      setStatuses(Object.fromEntries(entries))
    })
  }, [])

  const sections = getBookSections(books)

  // Chapter grid view
  if (selectedBook) {
    const status = statuses[selectedBook.abbrev] || 'geez'
    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1)

    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => setSelectedBook(null)}
          className="text-accent text-sm mb-4 hover:text-accent-bright transition-colors cursor-pointer"
        >
          &larr; All books
        </button>

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-text">
            {selectedBook.name}
          </h1>
          {(selectedBook.geez_name || selectedBook.geez) && (
            <p className="font-geez text-geez/60 text-sm mt-0.5" lang="gez">
              {selectedBook.geez_name || selectedBook.geez}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${STATUS_LABELS[status].dot}`} />
            <span className="text-text-muted text-xs">{STATUS_LABELS[status].label}</span>
            <span className="text-text-faint text-xs">&middot; {selectedBook.chapters} chapters</span>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {chapters.map(ch => (
            <Link
              key={ch}
              to={`/read/${selectedBook.abbrev}/${ch}`}
              className="aspect-square flex items-center justify-center rounded-lg
                         bg-surface border border-border text-text text-sm font-medium
                         hover:border-accent hover:bg-surface-hover hover:text-accent
                         transition-all"
            >
              {ch}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Book list view
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">The Ethiopian Bible</h1>
        <p className="text-text-muted text-sm mt-1">
          36 books &middot; 1,076 chapters &middot; tap any book to start reading
        </p>

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-lxx" /> LXX + KJV
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" /> English
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-text-faint" /> Ge'ez only
          </span>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.label} className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-text-muted mb-3 px-1">
            {SECTION_LABELS[section.label] || section.label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {section.books.map(book => {
              const status = statuses[book.abbrev] || 'geez'
              const sl = STATUS_LABELS[status]
              return (
                <button
                  key={book.abbrev}
                  onClick={() => book.chapters === 1
                    ? navigate(`/read/${book.abbrev}/1`)
                    : setSelectedBook(book)
                  }
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border
                             hover:border-accent hover:bg-surface-hover transition-all text-left
                             cursor-pointer group"
                >
                  {/* Status dot */}
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${sl.dot}`} />

                  {/* Book info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text group-hover:text-accent-bright transition-colors truncate">
                      {book.name}
                    </div>
                    {(book.geez_name || book.geez) && (
                      <div className="font-geez text-geez/40 text-xs truncate" lang="gez">
                        {book.geez_name || book.geez}
                      </div>
                    )}
                  </div>

                  {/* Chapter count */}
                  <span className="text-text-faint text-xs flex-shrink-0">
                    {book.chapters} ch
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
