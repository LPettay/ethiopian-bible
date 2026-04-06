import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Book, Chapter } from '../types/bible'
import { loadBooks, loadChapter } from '../lib/data'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface SearchResult {
  book: string
  bookName: string
  chapter: number
  verse: number
  field: string // 'lxx' | 'kjv' | 'translation'
  text: string
}

interface SearchPanelProps {
  open: boolean
  onClose: () => void
}

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [progress, setProgress] = useState('')
  const [searched, setSearched] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const trapRef = useFocusTrap(open, onClose)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setSearched(false)
      setProgress('')
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([])
      setSearched(false)
      setProgress('')
      return
    }

    const timeout = setTimeout(() => {
      runSearch(query.trim())
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const runSearch = useCallback(async (q: string) => {
    // Abort previous search
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setSearching(true)
    setResults([])
    setSearched(false)

    const lowerQ = q.toLowerCase()
    const found: SearchResult[] = []

    try {
      const books = await loadBooks()
      const total = books.length

      for (let i = 0; i < books.length; i++) {
        if (controller.signal.aborted) return
        const book = books[i]
        setProgress(`Searching ${book.name}... (${i + 1}/${total})`)

        for (let ch = 1; ch <= book.chapters; ch++) {
          if (controller.signal.aborted) return
          if (found.length >= 50) break

          try {
            const chapter = await loadChapter(book.abbrev, ch)
            searchChapter(chapter, book, lowerQ, found)
          } catch {
            // Chapter file may not exist, skip
          }

          if (found.length >= 50) break
        }

        if (found.length >= 50) break
      }
    } catch {
      // loadBooks failed
    }

    if (!controller.signal.aborted) {
      setResults(found)
      setSearching(false)
      setSearched(true)
      setProgress('')
    }
  }, [])

  function searchChapter(chapter: Chapter, book: Book, lowerQ: string, found: SearchResult[]) {
    for (const verse of chapter.verses) {
      if (found.length >= 50) return

      const fields: { key: string; text: string | undefined }[] = [
        { key: 'lxx', text: verse.translations?.lxx },
        { key: 'kjv', text: verse.translations?.kjv },
        { key: 'translation', text: verse.translation },
      ]

      for (const { key, text } of fields) {
        if (text && text.toLowerCase().includes(lowerQ)) {
          found.push({
            book: book.abbrev,
            bookName: book.name,
            chapter: chapter.chapter,
            verse: verse.num,
            field: key,
            text,
          })
          break // One result per verse
        }
      }
    }
  }

  function handleResultClick(result: SearchResult) {
    onClose()
    navigate(`/read/${result.book}/${result.chapter}/${result.verse}`)
  }

  function highlightMatch(text: string, q: string): React.ReactNode {
    if (!q.trim()) return text
    const lowerText = text.toLowerCase()
    const lowerQ = q.toLowerCase()
    const idx = lowerText.indexOf(lowerQ)
    if (idx === -1) return text

    // Show a window around the match
    const contextBefore = 40
    const contextAfter = 80
    const start = Math.max(0, idx - contextBefore)
    const end = Math.min(text.length, idx + q.length + contextAfter)

    const prefix = start > 0 ? '...' : ''
    const suffix = end < text.length ? '...' : ''

    const before = text.slice(start, idx)
    const match = text.slice(idx, idx + q.length)
    const after = text.slice(idx + q.length, end)

    return (
      <>
        {prefix}{before}
        <span className="text-accent font-medium bg-accent-dim rounded px-0.5">{match}</span>
        {after}{suffix}
      </>
    )
  }

  if (!open) return null

  return (
    <div
      ref={trapRef}
      className="fixed inset-0 z-50 flex flex-col bg-bg/98 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search the Bible"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border max-w-3xl mx-auto w-full">
        {/* Search icon */}
        <svg className="w-5 h-5 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search across all books..."
          className="flex-1 bg-transparent text-text text-base outline-none placeholder:text-text-faint"
          aria-label="Search query"
        />
        <button
          onClick={onClose}
          className="p-1.5 text-text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Close search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full px-4 py-2" aria-live="polite">
        {/* Progress indicator */}
        {searching && (
          <div className="flex items-center gap-2 py-4 text-text-muted text-sm" role="status">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {progress}
          </div>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-1 py-2">
            <p className="text-text-faint text-xs mb-3">
              {results.length >= 50 ? '50+ results' : `${results.length} result${results.length === 1 ? '' : 's'}`}
            </p>
            {results.map((result, i) => (
              <button
                key={`${result.book}-${result.chapter}-${result.verse}-${i}`}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-hover
                           transition-colors cursor-pointer group"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-accent text-sm font-medium">
                    {result.bookName} {result.chapter}:{result.verse}
                  </span>
                  <span className="text-text-faint text-xs uppercase">
                    {result.field === 'lxx' ? 'LXX' : result.field === 'kjv' ? 'KJV' : ''}
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed group-hover:text-text transition-colors">
                  {highlightMatch(result.text, query)}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {searched && !searching && results.length === 0 && query.trim().length >= 2 && (
          <div className="text-center py-12 text-text-muted">
            <p className="text-sm">No results found for "{query}"</p>
          </div>
        )}

        {/* Initial state */}
        {!searching && !searched && query.trim().length < 2 && (
          <div className="text-center py-12 text-text-faint">
            <p className="text-sm">Type at least 2 characters to search</p>
          </div>
        )}
      </div>
    </div>
  )
}
