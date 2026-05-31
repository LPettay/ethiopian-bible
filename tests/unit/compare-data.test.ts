import { describe, it, expect } from 'vitest'
import { TEXTUAL_VARIANTS, DSS_SCORECARD } from '../../src/lib/compare-data'

/**
 * Integrity guards for the educational redesign. These lock in the corrected,
 * sourced framing so a future edit cannot silently reintroduce the overstated
 * or conflated claims they replaced.
 */
describe('compare-data integrity: Genesis chronology variant', () => {
  const gen = TEXTUAL_VARIANTS.find(v => v.id === 'gen-chronology')

  it('still exists as a variant card', () => {
    expect(gen).toBeDefined()
  })

  it('does not claim Luke used the Septuagint genealogy as evidence for the Genesis 5 ages', () => {
    const all = `${gen!.dss ?? ''} ${gen!.whyItMatters}`
    // The old copy asserted "Luke used the Septuagint genealogy" and that the NT
    // "contradicts the Masoretic numbers" — a conflation of Genesis 11 (Cainan)
    // with the Genesis 5 ages. That claim must stay gone.
    expect(all).not.toMatch(/Luke used the Septuagint genealogy/i)
    expect(all).not.toMatch(/contradicts the Masoretic numbers/i)
  })

  it('frames Luke 3:36 Cainan as a Genesis 11 matter and states DSS silence', () => {
    const dss = gen!.dss ?? ''
    expect(dss).toMatch(/Genesis 11/i)
    expect(dss).toMatch(/Dead Sea Scrolls preserve no Genesis 5 numbers/i)
  })

  it('attributes the higher ages to the LXX (Codex Alexandrinus) and Josephus, the lower to MT/Samaritan', () => {
    const dss = gen!.dss ?? ''
    expect(dss).toMatch(/Codex Alexandrinus/i)
    expect(dss).toMatch(/Josephus/i)
    expect(dss).toMatch(/Samaritan/i)
  })
})

describe('compare-data integrity: DSS scorecard', () => {
  it('keeps the Genesis chronology row marked Debated / Mixed evidence', () => {
    const genRow = DSS_SCORECARD.find(r => /Genesis 5 & 11 chronology/i.test(r.passage))
    expect(genRow).toBeDefined()
    expect(genRow!.verdict).toBe('debated')
    expect(genRow!.support).toMatch(/Debated/i)
  })
})
