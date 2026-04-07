import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Book } from '../types/bible'
import { loadBooks, getBookSections } from '../lib/data'

// Translation status — detected at load time from chapter 1 data
type TranslationStatus = 'dual' | 'single' | 'geez'

async function detectTranslationStatus(abbrev: string): Promise<TranslationStatus> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/chapters/${abbrev}/1.json`)
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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => setSelectedBook(null)}
          className="text-accent/60 text-sm mb-6 hover:text-accent transition-colors cursor-pointer font-body italic"
        >
          &larr; all books
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-body font-semibold text-text">
            {selectedBook.name}
          </h1>
          {(selectedBook.geez_name || selectedBook.geez) && (
            <p className="font-geez text-geez/40 text-base mt-1 geez-glow" lang="gez">
              {selectedBook.geez_name || selectedBook.geez}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[status].dot}`} />
            <span className="text-text-muted text-xs font-body">{STATUS_LABELS[status].label}</span>
            <span className="text-text-faint text-xs font-body">&middot; {selectedBook.chapters} chapters</span>
          </div>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {chapters.map(ch => (
            <Link
              key={ch}
              to={`/read/${selectedBook.abbrev}/${ch}`}
              className="aspect-square flex items-center justify-center
                         text-text-muted text-sm font-body
                         hover:text-accent hover:bg-surface-hover/40
                         transition-all rounded-sm"
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-body font-semibold text-text">The Ethiopian Bible</h1>
        <p className="text-text-muted text-sm mt-1 font-body italic">
          36 books &middot; 1,076 chapters
        </p>

        {/* Legend */}
        <div className="flex gap-4 mt-3 text-xs text-text-muted font-body">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lxx" /> LXX + KJV
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" /> English
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-text-faint" /> Ge'ez only
          </span>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.label} className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-accent/40 mb-4 flex items-center gap-3 font-body">
            <svg viewBox="0 0 64 64" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
              <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor"/>
            </svg>
            {SECTION_LABELS[section.label] || section.label}
          </h2>
          <div className="space-y-0">
            {section.books.map((book, i) => {
              const status = statuses[book.abbrev] || 'geez'
              const sl = STATUS_LABELS[status]
              return (
                <button
                  key={book.abbrev}
                  onClick={() => book.chapters === 1
                    ? navigate(`/read/${book.abbrev}/1`)
                    : setSelectedBook(book)
                  }
                  className={`flex items-center gap-3 w-full px-3 py-3
                             hover:bg-surface-hover/40 transition-all text-left
                             cursor-pointer group
                             ${i < section.books.length - 1 ? 'border-b border-border/50' : ''}`}
                >
                  {/* Status dot */}
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60 ${sl.dot}`} />

                  {/* Book info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-body text-text group-hover:text-accent transition-colors truncate">
                      {book.name}
                    </div>
                    {(book.geez_name || book.geez) && (
                      <div className="font-geez text-geez/30 text-xs truncate" lang="gez">
                        {book.geez_name || book.geez}
                      </div>
                    )}
                  </div>

                  {/* Chapter count */}
                  <span className="text-text-faint text-xs flex-shrink-0 font-body italic">
                    {book.chapters}
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
