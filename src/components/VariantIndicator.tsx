import { useState, useId } from 'react'
import { KNOWN_VARIANTS, getVariantKey } from './variantIndicator.helpers'

interface VariantIndicatorProps {
  book: string
  chapter: number
  verse: number
}

export function VariantIndicator({ book, chapter, verse }: VariantIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const tooltipId = useId()
  const key = getVariantKey(book, chapter, verse)
  const variant = KNOWN_VARIANTS[key]

  if (!variant) return null

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Focusable trigger: opens on hover (mouse) and focus/click (keyboard). */}
      <button
        type="button"
        className="inline-flex items-center bg-transparent border-0 p-0 m-0 cursor-help text-accent"
        aria-expanded={showTooltip}
        aria-describedby={showTooltip ? tooltipId : undefined}
        aria-label="Textual variant. Show details."
        onClick={() => setShowTooltip(v => !v)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {/* Diamond icon */}
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1l4 7-4 7-4-7z" />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg
                     bg-surface-raised border border-border-strong text-text text-xs leading-relaxed
                     whitespace-normal w-56 text-center shadow-xl pointer-events-none z-20"
        >
          {variant.description}
          <span
            className="absolute top-full left-1/2 -translate-x-1/2 -mt-px
                       border-4 border-transparent border-t-surface-raised"
          />
        </span>
      )}
    </span>
  )
}
