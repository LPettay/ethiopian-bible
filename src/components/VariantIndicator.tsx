import { useState } from 'react'

interface VariantIndicatorProps {
  book: string
  chapter: number
  verse: number
}

interface VariantInfo {
  description: string
}

/**
 * Known significant textual variants between LXX and MT/KJV traditions.
 * Key format: "BookAbbrev:Chapter:Verse"
 */
const KNOWN_VARIANTS: Record<string, VariantInfo> = {
  // Genesis 5 patriarchal chronology: LXX adds 100 years to each patriarch's age at begetting
  'Gen:5:3': { description: 'Patriarch chronology: LXX reads 230 years, MT reads 130' },
  'Gen:5:6': { description: 'Patriarch chronology: LXX reads 205 years, MT reads 105' },
  'Gen:5:9': { description: 'Patriarch chronology: LXX reads 170 years, MT reads 70' },
  'Gen:5:12': { description: 'Patriarch chronology: LXX reads 165 years, MT reads 65' },
  'Gen:5:15': { description: 'Patriarch chronology: LXX reads 162 years, MT reads 62' },
  'Gen:5:21': { description: 'Patriarch chronology: LXX reads 165 years, MT reads 65' },

  // Genesis 11 post-flood chronology
  'Gen:11:12': { description: 'Post-flood chronology: LXX includes Cainan, adds 100+ years' },
  'Gen:11:13': { description: 'Post-flood chronology: LXX reads 330 years, MT reads 403' },

  // Deuteronomy
  'Deut:32:8': { description: 'LXX: "angels of God" / DSS: "sons of God"; MT: "sons of Israel"' },
  'Deut:32:43': { description: 'LXX has expanded text with "sons of God" and additional clauses' },

  // 1 Samuel
  '1Sam:17:4': { description: 'Goliath\'s height: LXX reads "four cubits and a span" (~6\'6"), MT reads "six cubits" (~9\'6")' },

  // Isaiah
  'Isa:7:14': { description: 'LXX: "parthenos" (virgin); MT: "almah" (young woman)' },

  // Job
  'Job:42:17': { description: 'LXX adds extensive colophon identifying Job with Jobab, absent in MT' },
}

function getVariantKey(book: string, chapter: number, verse: number): string {
  return `${book}:${chapter}:${verse}`
}

export function VariantIndicator({ book, chapter, verse }: VariantIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const key = getVariantKey(book, chapter, verse)
  const variant = KNOWN_VARIANTS[key]

  if (!variant) return null

  return (
    <span
      className="relative inline-flex items-center cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Diamond icon */}
      <svg className="w-3 h-3 text-accent" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1l4 7-4 7-4-7z" />
      </svg>

      {/* Tooltip */}
      {showTooltip && (
        <span
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

/** Check if a verse has a known variant (for external use) */
export function hasVariant(book: string, chapter: number, verse: number): boolean {
  return !!KNOWN_VARIANTS[getVariantKey(book, chapter, verse)]
}
