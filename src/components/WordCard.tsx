import { useState, memo } from 'react'
import type { Word } from '../types/bible'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { hasGeezScript } from '../lib/stub'
import { getGloss, dillmannSearchUrl } from '../lib/lexicon'

interface WordCardProps {
  word: Word
  showTransliteration: boolean
  fontSize: number
}

/**
 * Resolve an attributed gloss for a word, INTEGRITY-FIRST:
 * - a dataset gloss (`word.gl`) is shown and attributed to the transcription, then
 * - a sourced lexicon gloss (if a client lexicon is loaded), else
 * - `null` (no gloss exists — the UI must say so honestly).
 */
function resolveGloss(word: Word): { gloss: string; source: string } | null {
  if (word.gl && word.gl.trim()) {
    return { gloss: word.gl, source: 'Transcription' }
  }
  return getGloss(word.g)
}

export const WordCard = memo(function WordCard({ word, showTransliteration, fontSize }: WordCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const trapRef = useFocusTrap(showDetail, () => setShowDetail(false))

  const isGeez = hasGeezScript(word.g)
  const resolved = isGeez ? resolveGloss(word) : null

  // Honest aria-label: reflect what tapping actually reveals.
  const ariaLabel = !isGeez
    ? `${word.g} — section header`
    : resolved
      ? `${word.g} — ${resolved.gloss}`
      : `${word.g} — meaning not yet available`

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className="group flex flex-col items-center justify-center gap-1.5 px-2 py-1.5 min-h-[44px]
                   rounded hover:bg-surface-hover/50
                   transition-all duration-200 cursor-pointer select-none"
        aria-label={ariaLabel}
      >
        <span
          className="font-geez text-geez leading-tight geez-glow"
          lang="gez"
          style={{ fontSize: fontSize * 1.4 }}
        >
          {word.g}
        </span>
        {showTransliteration && isGeez && word.t && (
          <span className="font-body text-translit italic leading-tight" style={{ fontSize: '0.75rem' }}>
            {word.t}
          </span>
        )}
        {resolved && (
          <span className="text-gloss text-xs leading-tight opacity-70">
            {resolved.gloss}
          </span>
        )}
      </button>

      {showDetail && (
        <div
          ref={trapRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowDetail(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Word detail: ${word.g}`}
        >
          <div
            className="bg-surface-raised max-w-xs w-full
                       border-l-2 border-accent/30 pl-6 pr-5 py-6
                       shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-3">
              <p className="font-geez text-geez text-4xl leading-relaxed geez-glow" lang="gez">
                {word.g}
              </p>

              {!isGeez ? (
                /* Non-Ge'ez line (e.g. an English header in a stub book):
                   not a word to translate — label it honestly. */
                <p className="font-body text-text-muted text-sm italic pt-2">
                  Section header
                </p>
              ) : (
                <>
                  {word.t && (
                    <p className="font-body text-translit text-lg italic">
                      {word.t}
                    </p>
                  )}

                  {resolved ? (
                    <div
                      className="pt-2"
                      style={{ borderTop: '1px solid rgba(200,160,80,0.1)' }}
                    >
                      <p className="font-body text-accent/80 text-base">
                        {resolved.gloss}
                      </p>
                      <p className="text-text-faint text-xs font-body italic mt-1">
                        Source: {resolved.source}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="pt-2"
                      style={{ borderTop: '1px solid rgba(200,160,80,0.1)' }}
                    >
                      <p className="font-body text-text-muted text-sm italic">
                        Meaning not yet available
                      </p>
                      <a
                        href={dillmannSearchUrl(word.g)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-block mt-2 text-accent text-xs font-body
                                   hover:text-accent-bright transition-colors underline underline-offset-2"
                      >
                        Look up in Dillmann ↗
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="mt-5 text-text-faint text-xs font-body italic hover:text-text-muted
                         transition-colors cursor-pointer"
            >
              close
            </button>
          </div>
        </div>
      )}
    </>
  )
})
