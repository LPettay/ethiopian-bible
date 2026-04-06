import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseKeyboardNavOptions {
  /** Current book abbreviation (e.g. "Gen") */
  book: string
  /** Current chapter number */
  chapter: number
  /** Total chapters in current book */
  totalChapters: number
  /** Close any open modal (BookPicker, Settings, SearchPanel) */
  closeModals: () => void
  /** Open the search panel */
  openSearch: () => void
  /** Toggle bookmark on a verse number */
  toggleBookmark: (verseNum: number) => void
}

/**
 * Keyboard navigation for the Ethiopian Bible reader.
 *
 * Shortcuts:
 *   Left Arrow  — previous chapter
 *   Right Arrow — next chapter
 *   Escape      — close any open modal
 *   / or Ctrl+K — open search
 *   b           — toggle bookmark on the currently visible verse
 *
 * All shortcuts are suppressed when an input or textarea is focused.
 */
export function useKeyboardNav({
  book,
  chapter,
  totalChapters,
  closeModals,
  openSearch,
  toggleBookmark,
}: UseKeyboardNavOptions) {
  const navigate = useNavigate()

  // Track which verse is currently most visible via IntersectionObserver
  const visibleVerseRef = useRef<number>(1)

  // Set up IntersectionObserver to track the "current" verse
  useEffect(() => {
    const verseElements = document.querySelectorAll<HTMLElement>('[id^="verse-"]')
    if (verseElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the largest intersection ratio
        let bestEntry: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry
            }
          }
        }
        if (bestEntry) {
          const id = bestEntry.target.id // "verse-3"
          const num = parseInt(id.replace('verse-', ''), 10)
          if (!isNaN(num)) {
            visibleVerseRef.current = num
          }
        }
      },
      {
        // Observe verses in the top half of the viewport
        rootMargin: '0px 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    )

    verseElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [book, chapter]) // Re-observe when chapter changes

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept when typing in an input or textarea
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          if (chapter > 1) {
            e.preventDefault()
            navigate(`/read/${book}/${chapter - 1}`)
          }
          break

        case 'ArrowRight':
          if (chapter < totalChapters) {
            e.preventDefault()
            navigate(`/read/${book}/${chapter + 1}`)
          }
          break

        case 'Escape':
          e.preventDefault()
          closeModals()
          break

        case '/':
          e.preventDefault()
          openSearch()
          break

        case 'k':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            openSearch()
          }
          break

        case 'b':
          e.preventDefault()
          toggleBookmark(visibleVerseRef.current)
          break
      }
    },
    [book, chapter, totalChapters, navigate, closeModals, openSearch, toggleBookmark]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
