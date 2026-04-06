import { useState, useRef, useEffect } from 'react'
import type { Verse } from '../types/bible'

interface ShareVerseProps {
  verse: Verse
  bookAbbrev: string
  bookName?: string
  chapter: number
}

export function ShareVerse({ verse, bookAbbrev, bookName, chapter }: ShareVerseProps) {
  const [showCopied, setShowCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  async function handleShare() {
    const displayName = bookName || bookAbbrev
    const ref = `${displayName} ${chapter}:${verse.num}`

    const lines: string[] = [ref]

    if (verse.translations?.lxx) {
      lines.push(`LXX: ${verse.translations.lxx}`)
    }
    if (verse.translations?.kjv) {
      lines.push(`KJV: ${verse.translations.kjv}`)
    }
    if (!verse.translations?.lxx && !verse.translations?.kjv && verse.translation) {
      lines.push(verse.translation)
    }

    const text = lines.join('\n')

    // Build shareable URL with verse anchor
    const url = `${window.location.origin}/read/${bookAbbrev}/${chapter}/${verse.num}`
    const fullText = `${text}\n\n${url}`

    try {
      await navigator.clipboard.writeText(fullText)
      setShowCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setShowCopied(false), 2000)
    } catch {
      // Fallback: no clipboard API
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="p-1 text-text-faint hover:text-accent transition-colors cursor-pointer"
        title="Share verse"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {/* Copied tooltip */}
      {showCopied && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-accent text-bg
                     text-xs font-medium whitespace-nowrap animate-fade-in pointer-events-none"
        >
          Copied!
        </div>
      )}
    </div>
  )
}
