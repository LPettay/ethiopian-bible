import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Bookmark } from '../types/bible'
import { loadBookmarks, removeBookmark } from '../lib/storage'

export function BookmarksPage() {
  const navigate = useNavigate()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(loadBookmarks)

  const handleDelete = useCallback((id: string) => {
    removeBookmark(id)
    setBookmarks(loadBookmarks())
  }, [])

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 min-h-[60svh] gap-6">
        <div className="text-accent/30">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-text">No Bookmarks</h1>
          <p className="text-text-muted text-sm">
            Tap a verse number while reading to bookmark it.
          </p>
        </div>
        <Link
          to="/"
          className="text-accent text-sm hover:text-accent-bright transition-colors"
        >
          Start reading
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold text-text mb-6">Bookmarks</h1>

      <div className="space-y-2">
        {bookmarks.map(bm => (
          <div
            key={bm.id}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface border border-border
                       hover:border-border-strong transition-all group"
          >
            {/* Bookmark icon */}
            <svg
              className="w-4 h-4 text-accent flex-shrink-0 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
            </svg>

            {/* Reference — clickable */}
            <button
              onClick={() => navigate(`/read/${bm.book}/${bm.chapter}/${bm.verse}`)}
              className="flex-1 text-left min-w-0 cursor-pointer"
            >
              <p className="text-text text-sm font-medium">
                {bm.book} {bm.chapter}:{bm.verse}
              </p>
              {bm.note && (
                <p className="text-text-muted text-xs truncate mt-0.5">{bm.note}</p>
              )}
              {bm.label && (
                <p className="text-accent/60 text-xs mt-0.5">{bm.label}</p>
              )}
            </button>

            {/* Timestamp */}
            <span className="text-text-faint text-xs flex-shrink-0 hidden sm:block">
              {new Date(bm.createdAt).toLocaleDateString()}
            </span>

            {/* Delete */}
            <button
              onClick={() => handleDelete(bm.id)}
              className="p-1.5 text-text-faint hover:text-mt opacity-0 group-hover:opacity-100
                         transition-all cursor-pointer"
              title="Remove bookmark"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
