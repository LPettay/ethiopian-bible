import { useState, useEffect } from 'react'
import { Outlet, Link, useParams, useNavigate } from 'react-router-dom'
import { BookPicker } from './BookPicker'
import { Settings } from './Settings'
import { SearchPanel } from './SearchPanel'
import { useSettings } from '../hooks/useSettings'

export function Layout() {
  const [bookPickerOpen, setBookPickerOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [settings, updateSetting] = useSettings()
  const params = useParams<{ book?: string; chapter?: string }>()
  const navigate = useNavigate()

  // Listen for custom event from WelcomePage's "Explore a Text" door
  useEffect(() => {
    const handler = () => setBookPickerOpen(true)
    window.addEventListener('open-book-picker', handler)
    return () => window.removeEventListener('open-book-picker', handler)
  }, [])

  const isReading = !!params.book

  return (
    <div className="flex flex-col min-h-svh">
      {/* Skip-to-content link for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border">
        <nav className="flex items-center justify-between px-4 py-2.5 max-w-4xl mx-auto" aria-label="Main navigation">
          {/* Left: book name / home */}
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="text-accent hover:text-accent-bright transition-colors flex-shrink-0" aria-label="Home">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>

            {isReading ? (
              <button
                onClick={() => setBookPickerOpen(true)}
                aria-expanded={bookPickerOpen}
                aria-haspopup="dialog"
                className="text-text font-medium text-sm truncate hover:text-accent transition-colors cursor-pointer"
              >
                {params.book}
                {params.chapter && <span className="text-text-muted ml-1">Ch. {params.chapter}</span>}
              </button>
            ) : (
              <button
                onClick={() => setBookPickerOpen(true)}
                aria-expanded={bookPickerOpen}
                aria-haspopup="dialog"
                className="text-text-muted text-sm hover:text-text transition-colors cursor-pointer"
              >
                Select a book...
              </button>
            )}

            {/* Chapter navigation arrows (when reading) */}
            {isReading && params.chapter && (
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => {
                    const ch = Number(params.chapter)
                    if (ch > 1) navigate(`/read/${params.book}/${ch - 1}`)
                  }}
                  disabled={Number(params.chapter) <= 1}
                  className="p-1 text-text-muted hover:text-text disabled:opacity-30
                             transition-colors cursor-pointer disabled:cursor-default"
                  aria-label="Previous chapter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const ch = Number(params.chapter)
                    navigate(`/read/${params.book}/${ch + 1}`)
                  }}
                  className="p-1 text-text-muted hover:text-text transition-colors cursor-pointer"
                  aria-label="Next chapter"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-expanded={searchOpen}
              aria-haspopup="dialog"
              aria-label="Search"
              className="p-2 text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              to="/compare"
              className="p-2 text-text-muted hover:text-text transition-colors"
              aria-label="Compare translations"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
            </Link>
            <Link
              to="/bookmarks"
              className="p-2 text-text-muted hover:text-text transition-colors"
              aria-label="Bookmarks"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </Link>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-expanded={settingsOpen}
              aria-haspopup="dialog"
              aria-label="Settings"
              className="p-2 text-text-muted hover:text-text transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1">
        <Outlet context={{
          settings,
          updateSetting,
          closeModals: () => {
            setBookPickerOpen(false)
            setSettingsOpen(false)
            setSearchOpen(false)
          },
          openSearch: () => setSearchOpen(true),
        }} />
      </main>

      {/* Modals / overlays */}
      <BookPicker
        open={bookPickerOpen}
        onClose={() => setBookPickerOpen(false)}
        
      />
      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSetting}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
