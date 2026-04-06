import { useState, useCallback, memo } from 'react'
import type { Verse, ReaderSettings } from '../types/bible'
import { WordCard } from './WordCard'
import { ShareVerse } from './ShareVerse'
import { AnnotationEditor } from './AnnotationEditor'
import { VariantIndicator } from './VariantIndicator'

interface VerseViewProps {
  verse: Verse
  settings: ReaderSettings
  bookAbbrev: string
  bookName?: string
  chapter: number
  isBookmarked: boolean
  onToggleBookmark: (verseNum: number) => void
}

export const VerseView = memo(function VerseView({
  verse,
  settings,
  bookAbbrev,
  bookName,
  chapter,
  isBookmarked,
  onToggleBookmark,
}: VerseViewProps) {
  const { readingMode, showTransliteration, showLxx, showKjv, fontSize } = settings
  const hasLxx = verse.translations?.lxx
  const hasKjv = verse.translations?.kjv
  const hasDual = hasLxx || hasKjv
  const [, setAnnotationKey] = useState(0)
  const handleAnnotationChange = useCallback(() => setAnnotationKey(k => k + 1), [])

  return (
    <div
      id={`verse-${verse.num}`}
      className="group py-5 scroll-mt-20"
      style={{ fontSize }}
    >
      {/* Verse number + bookmark + variant + actions */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center gap-1 mt-0.5">
          <button
            onClick={() => onToggleBookmark(verse.num)}
            className="flex items-center gap-1 cursor-pointer select-none"
            aria-label={isBookmarked ? `Remove bookmark from verse ${verse.num}` : `Bookmark verse ${verse.num}`}
          >
            <span className="text-accent font-semibold text-sm tabular-nums">
              {verse.num}
            </span>
            {isBookmarked && (
              <svg
                className="w-3.5 h-3.5 text-accent fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
              </svg>
            )}
          </button>
          <VariantIndicator book={bookAbbrev} chapter={chapter} verse={verse.num} />
        </div>

        <div className="flex-1 space-y-3">
          {/* Study mode: word cards */}
          {readingMode === 'study' && verse.words.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {verse.words.map((word, i) => (
                <WordCard
                  key={i}
                  word={word}
                  showTransliteration={showTransliteration}
                  fontSize={fontSize}
                />
              ))}
            </div>
          )}

          {/* Translation lines */}
          {readingMode === 'study' && (
            <TranslationBlock
              verse={verse}
              hasDual={!!hasDual}
              showLxx={showLxx}
              showKjv={showKjv}
              fontSize={fontSize}
            />
          )}

          {readingMode === 'read' && (
            <ReadModeBlock verse={verse} fontSize={fontSize} />
          )}

          {readingMode === 'compare' && (
            <CompareModeBlock
              verse={verse}
              hasDual={!!hasDual}
              fontSize={fontSize}
            />
          )}

          {/* Hover actions: share + annotate */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
            <ShareVerse
              verse={verse}
              bookAbbrev={bookAbbrev}
              bookName={bookName}
              chapter={chapter}
            />
            <AnnotationEditor
              book={bookAbbrev}
              chapter={chapter}
              verse={verse.num}
              onAnnotationChange={handleAnnotationChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

/* ---- Sub-blocks ---- */

function TranslationBlock({
  verse,
  hasDual,
  showLxx,
  showKjv,
  fontSize,
}: {
  verse: Verse
  hasDual: boolean
  showLxx: boolean
  showKjv: boolean
  fontSize: number
}) {
  if (!hasDual) {
    // Single-source book (e.g., 1 Enoch)
    return (
      <p className="text-text leading-relaxed" style={{ fontSize: fontSize * 0.85 }}>
        {verse.translation}
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {showLxx && verse.translations?.lxx && (
        <div className="border-l-2 border-lxx-border pl-3">
          <span className="text-lxx text-xs font-medium uppercase tracking-wide">
            LXX (Brenton)
          </span>
          <p
            className="text-text leading-relaxed mt-0.5 bg-lxx-bg rounded px-2 py-1"
            style={{ fontSize: fontSize * 0.85 }}
          >
            {verse.translations.lxx}
          </p>
        </div>
      )}
      {showKjv && verse.translations?.kjv && (
        <div className="border-l-2 border-mt-border pl-3">
          <span className="text-mt text-xs font-medium uppercase tracking-wide">
            KJV
          </span>
          <p
            className="text-text leading-relaxed mt-0.5 bg-mt-bg rounded px-2 py-1"
            style={{ fontSize: fontSize * 0.85 }}
          >
            {verse.translations.kjv}
          </p>
        </div>
      )}
      {/* Fallback if neither source toggled on but we have the generic translation */}
      {!showLxx && !showKjv && verse.translation && (
        <p className="text-text leading-relaxed" style={{ fontSize: fontSize * 0.85 }}>
          {verse.translation}
        </p>
      )}
    </div>
  )
}

function ReadModeBlock({ verse, fontSize }: { verse: Verse; fontSize: number }) {
  // Clean reading: just the primary English text
  const text = verse.translations?.lxx || verse.translations?.kjv || verse.translation
  return (
    <p className="text-text leading-relaxed" style={{ fontSize: fontSize * 0.9 }}>
      {text}
    </p>
  )
}

function CompareModeBlock({
  verse,
  hasDual,
  fontSize,
}: {
  verse: Verse
  hasDual: boolean
  fontSize: number
}) {
  if (!hasDual) {
    return (
      <p className="text-text leading-relaxed" style={{ fontSize: fontSize * 0.85 }}>
        {verse.translation}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {verse.translations?.lxx && (
        <div className="border-l-2 border-lxx-border pl-3">
          <span className="text-lxx text-xs font-medium uppercase tracking-wide">
            LXX (Brenton)
          </span>
          <p
            className="text-text leading-relaxed mt-0.5"
            style={{ fontSize: fontSize * 0.85 }}
          >
            {verse.translations.lxx}
          </p>
        </div>
      )}
      {verse.translations?.kjv && (
        <div className="border-l-2 border-mt-border pl-3">
          <span className="text-mt text-xs font-medium uppercase tracking-wide">
            KJV
          </span>
          <p
            className="text-text leading-relaxed mt-0.5"
            style={{ fontSize: fontSize * 0.85 }}
          >
            {verse.translations.kjv}
          </p>
        </div>
      )}
    </div>
  )
}
