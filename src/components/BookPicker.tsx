import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book } from '../types/bible'
import { loadBooks, getBookSections } from '../lib/data'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface BookPickerProps {
  open: boolean
  onClose: () => void
  /** When provided, the picker opens with this book's section expanded */
  currentBook?: string
}

export function BookPicker({ open, onClose, currentBook }: BookPickerProps) {
  const navigate = useNavigate()
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const trapRef = useFocusTrap(open, onClose)

  useEffect(() => {
    if (open) {
      loadBooks().then(setBooks).catch(console.error)
    }
  }, [open])

  // When opening, if currentBook is set, auto-select it to show chapter grid
  useEffect(() => {
    if (!open) {
      setSelectedBook(null)
      return
    }
    if (currentBook && books.length > 0) {
      const match = books.find(b => b.abbrev === currentBook)
      if (match && match.chapters > 1) {
        setSelectedBook(match)
      }
    }
  }, [open, currentBook, books])

  if (!open) return null

  const sections = getBookSections(books)

  function handleBookClick(book: Book) {
    if (book.chapters === 1) {
      navigate(`/read/${book.abbrev}/1`)
      onClose()
    } else {
      setSelectedBook(book)
    }
  }

  function handleChapterClick(chapter: number) {
    if (!selectedBook) return
    navigate(`/read/${selectedBook.abbrev}/${chapter}`)
    onClose()
  }

  return (
    <div
      ref={trapRef}
      className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a book"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          {selectedBook && (
            <button
              onClick={() => setSelectedBook(null)}
              className="text-text-muted hover:text-text transition-colors cursor-pointer"
              aria-label="Back to book list"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-lg font-semibold text-text">
            {selectedBook ? selectedBook.name : 'Choose a Book'}
          </h2>
          {selectedBook?.geez_name && (
            <span className="font-geez text-accent text-sm" lang="gez">{selectedBook.geez_name}</span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 text-text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Close book picker"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!selectedBook ? (
          <div className="space-y-6 max-w-2xl mx-auto">
            {sections.map(section => (
              <div key={section.label}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  {section.label}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.books.map(book => (
                    <button
                      key={book.abbrev}
                      onClick={() => handleBookClick(book)}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                                 bg-surface hover:bg-surface-hover border border-border
                                 hover:border-border-strong transition-all text-left cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-text font-medium truncate">{book.name}</p>
                        {book.geez_name && (
                          <p className="font-geez text-accent/70 text-sm truncate" lang="gez">
                            {book.geez_name}
                          </p>
                        )}
                      </div>
                      <span className="text-text-faint text-xs flex-shrink-0">
                        {book.chapters} ch
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <p className="text-text-muted text-sm mb-4">
              {selectedBook.chapters} chapters
            </p>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(ch => (
                <button
                  key={ch}
                  onClick={() => handleChapterClick(ch)}
                  className="aspect-square flex items-center justify-center rounded-lg
                             bg-surface hover:bg-surface-hover border border-border
                             hover:border-accent text-text hover:text-accent
                             transition-all text-sm font-medium cursor-pointer"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
