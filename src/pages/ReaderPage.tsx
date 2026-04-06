import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import type { Chapter, Book, ReaderSettings } from '../types/bible'
import { loadChapter, loadBooks, getBookByAbbrev } from '../lib/data'
import {
  addBookmark,
  removeBookmark,
  loadBookmarks,
  addToHistory,
} from '../lib/storage'
import { VerseView } from '../components/VerseView'
import { useKeyboardNav } from '../hooks/useKeyboardNav'

interface LayoutContext {
  settings: ReaderSettings
  updateSetting: (patch: Partial<ReaderSettings>) => void
  closeModals: () => void
  openSearch: () => void
}

/** Skeleton shimmer shown while chapter data loads */
function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6" aria-busy="true" aria-label="Loading chapter">
      {/* Title skeleton */}
      <div className="mb-6 space-y-2">
        <div className="skeleton-line w-48 h-6" />
        <div className="skeleton-line w-32 h-4" />
      </div>
      {/* Verse skeletons */}
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="py-5 space-y-2">
          <div className="flex items-start gap-3">
            <div className="skeleton-line w-6 h-5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 + (i % 3) }, (_, j) => (
                  <div key={j} className="skeleton-line w-16 h-12 rounded-lg" />
                ))}
              </div>
              <div className="skeleton-line w-full h-4" />
              <div className="skeleton-line w-3/4 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ReaderPage() {
  const { book: bookParam, chapter: chapterParam, verse: verseParam } = useParams<{
    book: string
    chapter: string
    verse: string
  }>()
  const navigate = useNavigate()
  const { settings, closeModals, openSearch } = useOutletContext<LayoutContext>()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [bookInfo, setBookInfo] = useState<Book | null>(null)
  const [bookmarks, setBookmarks] = useState(loadBookmarks)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const bookAbbrev = bookParam ?? ''
  const chapterNum = Number(chapterParam) || 1
  const totalChapters = bookInfo?.chapters ?? chapterNum

  const handleToggleBookmark = useCallback(
    (verseNum: number) => {
      const existing = bookmarks.find(
        b => b.book === bookAbbrev && b.chapter === chapterNum && b.verse === verseNum
      )
      if (existing) {
        removeBookmark(existing.id)
      } else {
        addBookmark({ book: bookAbbrev, chapter: chapterNum, verse: verseNum })
      }
      setBookmarks(loadBookmarks())
    },
    [bookAbbrev, chapterNum, bookmarks]
  )

  const isVerseBookmarked = useCallback(
    (verseNum: number) =>
      bookmarks.some(
        b => b.book === bookAbbrev && b.chapter === chapterNum && b.verse === verseNum
      ),
    [bookmarks, bookAbbrev, chapterNum]
  )

  // Keyboard navigation
  useKeyboardNav({
    book: bookAbbrev,
    chapter: chapterNum,
    totalChapters,
    closeModals,
    openSearch,
    toggleBookmark: handleToggleBookmark,
  })

  // Load chapter data
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      loadChapter(bookAbbrev, chapterNum),
      loadBooks(),
    ])
      .then(([chData, books]) => {
        if (cancelled) return
        setChapter(chData)
        const info = getBookByAbbrev(books, bookAbbrev) ?? null
        setBookInfo(info)
        addToHistory(bookAbbrev, chapterNum)
        document.title = `${info?.name ?? bookAbbrev} ${chapterNum} — The Ethiopian Bible`
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load chapter')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [bookAbbrev, chapterNum])

  // Scroll to verse if specified
  useEffect(() => {
    if (!verseParam || loading) return
    const el = document.getElementById(`verse-${verseParam}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [verseParam, loading])

  // Smooth scroll to top on chapter change
  useEffect(() => {
    if (!verseParam) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [bookAbbrev, chapterNum, verseParam])

  // Back-to-top button visibility
  useEffect(() => {
    function handleScroll() {
      // Show after scrolling past ~verse 10 area (approx 800px)
      setShowBackToTop(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 gap-4">
        <p className="text-mt text-sm">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-accent text-sm hover:underline cursor-pointer"
        >
          Go back home
        </button>
      </div>
    )
  }

  if (!chapter) return null

  return (
    <div ref={scrollRef} className="max-w-3xl mx-auto px-4 py-6 animate-chapter-in">
      {/* Chapter heading */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">
          {bookInfo?.name ?? chapter.book}
          <span className="text-text-muted font-normal ml-2">Chapter {chapter.chapter}</span>
        </h1>
        {bookInfo?.geez_name && (
          <p className="font-geez text-accent/60 text-sm mt-1" lang="gez">{bookInfo.geez_name}</p>
        )}
        {chapter.note && (
          <p className="text-text-muted text-xs mt-2 italic border-l-2 border-accent/30 pl-3">
            {chapter.note}
          </p>
        )}
      </div>

      {/* Verses */}
      <div className="divide-y divide-border/50" aria-live="polite">
        {chapter.verses.map(verse => (
          <VerseView
            key={verse.num}
            verse={verse}
            settings={settings}
            bookAbbrev={bookAbbrev}
            bookName={bookInfo?.name}
            chapter={chapterNum}
            isBookmarked={isVerseBookmarked(verse.num)}
            onToggleBookmark={handleToggleBookmark}
          />
        ))}
      </div>

      {/* Chapter navigation */}
      <nav className="flex items-center justify-between py-8 mt-4 border-t border-border" aria-label="Chapter navigation">
        <button
          onClick={() => {
            if (chapterNum > 1) navigate(`/read/${bookAbbrev}/${chapterNum - 1}`)
          }}
          disabled={chapterNum <= 1}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent-bright
                     disabled:text-text-faint disabled:cursor-default transition-colors cursor-pointer"
          aria-label="Previous chapter"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <span className="text-text-faint text-xs">
          {chapterNum} / {totalChapters}
        </span>

        <button
          onClick={() => {
            if (chapterNum < totalChapters) navigate(`/read/${bookAbbrev}/${chapterNum + 1}`)
          }}
          disabled={chapterNum >= totalChapters}
          className="flex items-center gap-2 text-sm text-accent hover:text-accent-bright
                     disabled:text-text-faint disabled:cursor-default transition-colors cursor-pointer"
          aria-label="Next chapter"
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-20 p-3 rounded-full bg-surface-raised border border-border-strong
                     shadow-lg text-text-muted hover:text-accent hover:border-accent transition-all cursor-pointer
                     animate-simple-fade-in"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
