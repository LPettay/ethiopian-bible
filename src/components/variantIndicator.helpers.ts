export interface VariantInfo {
  description: string
}

/**
 * Known significant textual variants between LXX and MT/KJV traditions.
 * Key format: "BookAbbrev:Chapter:Verse"
 */
export const KNOWN_VARIANTS: Record<string, VariantInfo> = {
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

export function getVariantKey(book: string, chapter: number, verse: number): string {
  return `${book}:${chapter}:${verse}`
}

/** Check if a verse has a known variant (for external use) */
export function hasVariant(book: string, chapter: number, verse: number): boolean {
  return !!KNOWN_VARIANTS[getVariantKey(book, chapter, verse)]
}
