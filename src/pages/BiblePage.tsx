import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Book } from '../types/bible'
import { loadBooks, getBookSections } from '../lib/data'
import { isStubBook } from '../lib/stub'

// Translation status — detected at load time from chapter 1 data.
// 'stub' is a placeholder book (not yet transcribed) and is resolved from the
// Book record itself rather than from chapter data.
type TranslationStatus = 'dual' | 'single' | 'geez' | 'stub'

async function detectTranslationStatus(abbrev: string): Promise<TranslationStatus> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/chapters/${abbrev}/1.json`)
    if (!res.ok) return 'geez'
    const ch = await res.json()
    for (const v of ch.verses?.slice(0, 5) ?? []) {
      if (v.translations?.lxx || v.translations?.kjv) return 'dual'
      if (v.translation) return 'single'
    }
  } catch {
    // Network or parse failure — treat as Ge'ez-only.
  }
  return 'geez'
}

const STATUS_LABELS = {
  dual: { dot: 'bg-lxx', label: 'LXX + KJV' },
  single: { dot: 'bg-accent', label: 'English' },
  geez: { dot: 'bg-text-faint', label: 'Ge\u02bfez only' },
  stub: { dot: 'bg-amber-500', label: 'Placeholder \u2014 not yet transcribed' },
}

// A clearly-different pill used wherever a stub book is shown, so a placeholder
// is never mistaken for real scripture (unlike the subtle status dots).
function StubBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5
                  bg-amber-500/15 text-amber-400 border border-amber-500/30
                  text-[0.6875rem] font-ui font-medium tracking-wide
                  whitespace-nowrap flex-shrink-0 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
      {STATUS_LABELS.stub.label}
    </span>
  )
}

const SECTION_LABELS: Record<string, string> = {
  'Unique to Ethiopia': 'Unique to the Ethiopian Canon',
  'Deuterocanonical': 'Deuterocanonical Books',
  'Other': 'Shared with Western Bibles',
}

// Short scholarly one-liners explaining each canon section.
const SECTION_BLURBS: Record<string, string> = {
  'Unique to Ethiopia': "Books preserved complete only in Ge\u02bfez \u2014 1 Enoch, Jubilees, Meqabyan, and more.",
  'Deuterocanonical': 'Books in the Septuagint and Orthodox/Catholic canons but outside the Protestant Old Testament.',
  'Other': 'Books of the Old and New Testaments held in common with Western Bibles.',
}

export function BiblePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [statuses, setStatuses] = useState<Record<string, TranslationStatus>>({})
  const navigate = useNavigate()

  useEffect(() => {
    loadBooks().then(async (loadedBooks) => {
      setBooks(loadedBooks)
      // Detect translation status for all books in parallel. Stub
      // (placeholder) books are flagged directly from the Book record so they
      // are never mistaken for real Geʿez-only scripture.
      const entries = await Promise.all(
        loadedBooks.map(async (b) => {
          const status = isStubBook(b) ? 'stub' : await detectTranslationStatus(b.abbrev)
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
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {status === 'stub' ? (
              <StubBadge />
            ) : (
              <>
                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_LABELS[status].dot}`} />
                <span className="text-text-muted text-xs font-body">{STATUS_LABELS[status].label}</span>
              </>
            )}
            <span className="text-text-faint text-xs font-body">&middot; {selectedBook.chapters} chapters</span>
          </div>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
          {chapters.map(ch => (
            <Link
              key={ch}
              to={`/read/${selectedBook.abbrev}/${ch}`}
              className="aspect-square min-h-[44px] min-w-[44px]
                         flex items-center justify-center
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
          <h2 className="text-xs uppercase tracking-widest text-accent/40 mb-2 flex items-center gap-3 font-body">
            <svg viewBox="0 0 64 64" className="w-3 h-3 flex-shrink-0" aria-hidden="true">
              <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor"/>
            </svg>
            {SECTION_LABELS[section.label] || section.label}
          </h2>
          {SECTION_BLURBS[section.label] && (
            <p className="text-text-faint text-xs font-body italic mb-4 max-w-prose leading-relaxed">
              {SECTION_BLURBS[section.label]}{' '}
              <Link to="/about" className="not-italic text-accent/60 hover:text-accent transition-colors">
                Learn more
              </Link>
            </p>
          )}
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
                  {/* Status dot (hidden for stubs, which get an unmistakable pill) */}
                  {status !== 'stub' && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-60 ${sl.dot}`} />
                  )}

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

                  {/* Stub pill or chapter count */}
                  {status === 'stub' ? (
                    <StubBadge />
                  ) : (
                    <span className="text-text-faint text-xs flex-shrink-0 font-body italic">
                      {book.chapters}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
