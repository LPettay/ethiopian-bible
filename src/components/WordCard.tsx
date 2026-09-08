import { useId, useState, memo } from 'react'
import type { Word } from '../types/bible'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { hasGeezScript } from '../lib/stub'
import { getGloss, glossSourceUrl, type GlossEntry } from '../lib/lexicon'

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
function resolveGloss(word: Word): GlossEntry | null {
  if (word.gl && word.gl.trim()) {
    return { gloss: word.gl, source: 'Transcription' }
  }
  return getGloss(word.g)
}

/** The first sense only, for the one-line label under the Ge'ez. */
function shortGloss(gloss: string): string {
  return gloss.split(';')[0].trim()
}

const LANG_LABEL: Record<string, string> = {
  la: 'Latin, Dillmann 1865',
  en: 'English',
}

/**
 * Where the meaning came from, as one line: the gloss language when it is not
 * English, then the attribution, then a link to the exact entry (or a search
 * when we have no entry). Shared by the hover card and the modal.
 */
function SourceLine({ word, entry, compact }: { word: string; entry: GlossEntry | null; compact?: boolean }) {
  const url = glossSourceUrl(word, entry)
  return (
    <p className={`text-text-faint font-body italic ${compact ? 'text-[0.65rem]' : 'text-xs'} leading-snug`}>
      {entry ? (
        <>
          Source: {entry.source}
          {entry.lemma && entry.lemma !== word && (
            <>
              {' · headword '}
              <span className="font-geez not-italic" lang="gez">{entry.lemma}</span>
            </>
          )}
          {entry.id && (
            <>
              {' · '}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-accent hover:text-accent-bright underline underline-offset-2 not-italic"
              >
                entry ↗
              </a>
            </>
          )}
        </>
      ) : (
        <>
          Meaning not yet available ·{' '}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="text-accent hover:text-accent-bright underline underline-offset-2 not-italic"
          >
            Look up in Dillmann ↗
          </a>
        </>
      )}
    </p>
  )
}

/** Gloss text plus its language tag, honest about Latin vs English. */
function GlossLines({ entry, large }: { entry: GlossEntry; large?: boolean }) {
  const langLabel = entry.lang && entry.lang !== 'en' ? LANG_LABEL[entry.lang] : null
  return (
    <div className="space-y-0.5">
      <p className={`font-body text-accent/80 ${large ? 'text-base' : 'text-sm'} leading-snug`}>
        {entry.gloss}
        {langLabel && <span className="text-text-faint text-[0.65rem] italic ml-1.5">({langLabel})</span>}
      </p>
      {entry.latin && (
        <p className="font-body text-text-muted text-xs italic leading-snug">
          Dillmann 1865: {entry.latin}
        </p>
      )}
      {entry.pos && (
        <p className="text-text-faint text-[0.65rem] font-body italic">{entry.pos}</p>
      )}
    </div>
  )
}

export const WordCard = memo(function WordCard({ word, showTransliteration, fontSize }: WordCardProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [hover, setHover] = useState(false)
  const trapRef = useFocusTrap(showDetail, () => setShowDetail(false))
  const tipId = useId()

  const isGeez = hasGeezScript(word.g)
  const resolved = isGeez ? resolveGloss(word) : null

  // Honest aria-label: reflect what tapping actually reveals.
  const ariaLabel = !isGeez
    ? `${word.g} — section header`
    : resolved
      ? `${word.g} — ${resolved.gloss}`
      : `${word.g} — meaning not yet available`

  // The hover card is a mouse/keyboard affordance; touch readers get the same
  // content in the modal, so nothing is hover-only.
  const showTip = hover && isGeez && !showDetail

  return (
    <>
      <div
        className="relative inline-flex"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(false)
        }}
      >
        <button
          onClick={() => setShowDetail(true)}
          className="group flex flex-col items-center justify-center gap-1.5 px-2 py-1.5 min-h-[44px]
                     rounded hover:bg-surface-hover/50
                     transition-all duration-200 cursor-pointer select-none"
          aria-label={ariaLabel}
          aria-describedby={showTip ? tipId : undefined}
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
              {shortGloss(resolved.gloss)}
            </span>
          )}
        </button>

        {showTip && (
          <div
            id={tipId}
            role="tooltip"
            className="absolute left-1/2 top-full z-40 mt-1 w-64 -translate-x-1/2
                       bg-surface-raised border-l-2 border-accent/30 pl-3 pr-3 py-2.5
                       shadow-[0_8px_24px_rgba(0,0,0,0.4)] text-left"
          >
            <div className="space-y-1.5">
              {word.t && (
                <p className="font-body text-translit text-xs italic leading-snug">{word.t}</p>
              )}
              {resolved && <GlossLines entry={resolved} />}
              <SourceLine word={word.g} entry={resolved} compact />
            </div>
          </div>
        )}
      </div>

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
            className="bg-surface-raised w-[min(100%-2rem,20rem)] mx-auto
                       border-l-2 border-accent/30 pl-4 pr-4 sm:pl-6 sm:pr-5 py-6
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

                  <div
                    className="pt-2 space-y-2"
                    style={{ borderTop: '1px solid rgba(200,160,80,0.1)' }}
                  >
                    {resolved && <GlossLines entry={resolved} large />}
                    <SourceLine word={word.g} entry={resolved} />
                  </div>
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
