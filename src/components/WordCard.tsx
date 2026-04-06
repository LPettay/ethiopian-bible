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
        className="group flex flex-col items-center gap-1 rounded-lg bg-surface px-3 py-2.5
                   border border-border hover:border-border-strong hover:bg-surface-hover
                   transition-all duration-200 cursor-pointer select-none min-w-[4rem]"
        aria-label={`${word.g}${word.gl ? ` — ${word.gl}` : ''}`}
      >
        <span
          className="font-geez text-geez leading-tight"
          lang="gez"
          style={{ fontSize: fontSize * 1.3 }}
        >
          {word.g}
        </span>
        {showTransliteration && (
          <span className="text-translit text-xs italic leading-tight">
            {word.t}
          </span>
        )}
        {word.gl && (
          <span className="text-gloss text-xs leading-tight">
            {word.gl}
          </span>
        )}
      </button>

      {showDetail && (
        <div
          ref={trapRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowDetail(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Word detail: ${word.g}`}
        >
          <div
            className="bg-surface-raised rounded-xl p-6 max-w-sm w-full border border-border-strong
                       shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center space-y-3">
              <p className="font-geez text-geez text-4xl leading-relaxed" lang="gez">
                {word.g}
              </p>
              <p className="text-translit text-lg italic">
                {word.t}
              </p>
              {word.gl && (
                <p className="text-accent text-base font-medium pt-2 border-t border-border">
                  {word.gl}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowDetail(false)}
              className="mt-6 w-full py-2 rounded-lg bg-surface hover:bg-surface-hover
                         text-text-muted text-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
})
