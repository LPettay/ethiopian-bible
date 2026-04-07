import { useState, memo } from 'react'
import type { Word } from '../types/bible'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface WordCardProps {
  word: Word
  showTransliteration: boolean
  fontSize: number
}

export const WordCard = memo(function WordCard({ word, showTransliteration, fontSize }: WordCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const trapRef = useFocusTrap(showDetail, () => setShowDetail(false))

  return (
    <>
      <button
        onClick={() => setShowDetail(true)}
        className="group flex flex-col items-center gap-1.5 px-2 py-1.5
                   rounded hover:bg-surface-hover/50
                   transition-all duration-200 cursor-pointer select-none"
        aria-label={`${word.g}${word.gl ? ` — ${word.gl}` : ''}`}
      >
        <span
          className="font-geez text-geez leading-tight geez-glow"
          lang="gez"
          style={{ fontSize: fontSize * 1.4 }}
        >
          {word.g}
        </span>
        {showTransliteration && (
          <span className="font-body text-translit italic leading-tight" style={{ fontSize: '0.75rem' }}>
            {word.t}
          </span>
        )}
        {word.gl && (
          <span className="text-gloss text-xs leading-tight opacity-70">
            {word.gl}
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
              <p className="font-body text-translit text-lg italic">
                {word.t}
              </p>
              {word.gl && (
                <p className="font-body text-accent/80 text-base pt-2" style={{ borderTop: '1px solid rgba(200,160,80,0.1)' }}>
                  {word.gl}
                </p>
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
