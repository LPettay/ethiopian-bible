import { useState, useRef, useEffect, useId } from 'react'

interface ConfidenceBadgeProps {
  confidence: number
  verifiedWords?: number
  totalWords?: number
  source?: string
}

function confidenceColor(confidence: number): string {
  if (confidence > 0.8) return '#5cb85c'
  if (confidence >= 0.5) return '#d4943a'
  return '#c76b6b'
}

export function ConfidenceBadge({
  confidence,
  verifiedWords,
  totalWords,
  source,
}: ConfidenceBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipId = useId()
  const pct = Math.round(confidence * 100)
  const color = confidenceColor(confidence)

  // Close tooltip on outside click
  useEffect(() => {
    if (!showTooltip) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showTooltip])

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Focusable trigger: opens on hover (mouse) and focus/click (keyboard). */}
      <button
        type="button"
        className="inline-flex items-center gap-2 bg-transparent border-0 p-0 m-0 cursor-help"
        aria-expanded={showTooltip}
        aria-describedby={showTooltip ? tooltipId : undefined}
        aria-label={`Translation confidence: ${pct}% verified. Show details.`}
        onClick={() => setShowTooltip(v => !v)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
      >
        {/* Confidence bar */}
        <div
          className="rounded-full overflow-hidden"
          style={{ width: 100, height: 4, backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>

        {/* Percentage label */}
        <span className="text-text-faint" style={{ fontSize: 11 }}>
          {pct}% verified
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 bottom-full mb-2 z-50 animate-simple-fade-in"
          style={{ minWidth: 220 }}
        >
          <div className="bg-surface-raised border border-border-strong rounded-lg shadow-lg px-3 py-2.5 space-y-1.5">
            {verifiedWords != null && totalWords != null && (
              <p className="text-xs text-text-muted">
                {verifiedWords}/{totalWords} words verified against Dillmann lexicon
              </p>
            )}
            {source && (
              <p className="text-xs text-text-muted">
                Source: {source}
              </p>
            )}
            <p className="text-xs text-text-faint italic">
              This translation has not been reviewed by a scholar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/** Inline pill badge for compact display (read/compare modes) */
export function ConfidencePill({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100)
  const color = confidenceColor(confidence)

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-text-muted"
      style={{ fontSize: 10, backgroundColor: 'rgba(212, 148, 58, 0.1)' }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      AI {pct}%
    </span>
  )
}
