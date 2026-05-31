export interface VariantInfo {
  /**
   * One calm sentence naming what differs between the textual traditions.
   * This is the only field a closed diamond ever needs.
   */
  description: string
  /**
   * Optional. Manuscript/textual witnesses, stated only where verified. Honest
   * omission beats an invented witness, so this is left undefined whenever the
   * surviving evidence does not clearly support a claim.
   */
  witnesses?: string
  /**
   * Optional. A real, citable source for the claim above (scholar/edition).
   */
  source?: string
}

/**
 * Known significant textual variants between LXX and MT/KJV traditions.
 * Key format: "BookAbbrev:Chapter:Verse"
 *
 * Each entry is a quiet, on-demand sourced note: `description` says what
 * differs, `witnesses` names manuscript support only where verified, and
 * `source` cites a real reference. Witnesses are deliberately omitted where the
 * surviving evidence does not support a specific claim — honest absence over a
 * guess.
 */
export const KNOWN_VARIANTS: Record<string, VariantInfo> = {
  // Genesis 5 patriarchal chronology: LXX reads the patriarchs' ages at
  // begetting 100 years higher than the MT. Corrected to drop the earlier
  // false DSS + Luke claim: the Dead Sea Scrolls preserve no Genesis 5 numbers,
  // and Luke 3:36's extra Cainan belongs to the Genesis 11 genealogy.
  'Gen:5:3': {
    description: 'Adam’s age at begetting Seth: LXX reads 230 years, MT reads 130.',
    witnesses: 'MT 130 · LXX (Codex Alexandrinus) 230 · Samaritan Pentateuch 130; Josephus 230. The Dead Sea Scrolls preserve no Genesis 5 numbers.',
    source: 'Associates for Biblical Research, “From Adam to Abraham”; Codex Alexandrinus is the primary Greek witness for Genesis 5.',
  },
  'Gen:5:6': {
    description: 'Seth’s age at begetting Enos: LXX reads 205 years, MT reads 105.',
    witnesses: 'The +100-year pattern runs through the Genesis 5 line in the LXX (Codex Alexandrinus); the MT and Samaritan Pentateuch read the lower figure.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },
  'Gen:5:9': {
    description: 'Cainan’s age at begetting Mahalaleel: LXX reads 170 years, MT reads 70.',
    witnesses: 'The +100-year pattern runs through the Genesis 5 line in the LXX (Codex Alexandrinus); the MT and Samaritan Pentateuch read the lower figure.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },
  'Gen:5:12': {
    description: 'Mahalaleel’s age at begetting Jared: LXX reads 165 years, MT reads 65.',
    witnesses: 'The +100-year pattern runs through the Genesis 5 line in the LXX (Codex Alexandrinus); the MT and Samaritan Pentateuch read the lower figure.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },
  'Gen:5:15': {
    description: 'Jared’s age at begetting Enoch: LXX reads 162 years, MT reads 62.',
    witnesses: 'The +100-year pattern runs through the Genesis 5 line in the LXX (Codex Alexandrinus); the MT and Samaritan Pentateuch read the lower figure.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },
  'Gen:5:21': {
    description: 'Enoch’s age at begetting Methuselah: LXX reads 165 years, MT reads 65.',
    witnesses: 'The +100-year pattern runs through the Genesis 5 line in the LXX (Codex Alexandrinus); the MT and Samaritan Pentateuch read the lower figure.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },

  // Genesis 11 post-flood chronology
  'Gen:11:12': {
    description: 'Post-flood line: the LXX inserts a second Cainan and reads higher ages than the MT.',
    witnesses: 'The extra Cainan appears in the LXX of Genesis 11; the MT does not have it. Luke 3:36’s Cainan belongs to this Genesis 11 genealogy, and its status in early Luke manuscripts is debated.',
    source: 'Creation.com, “Cainan”; Steinmann, JETS 60/4.',
  },
  'Gen:11:13': {
    description: 'Arphaxad’s remaining years: LXX and MT diverge in the post-flood chronology.',
    source: 'Associates for Biblical Research, “Proposed original numbers in Genesis 5 and 11.”',
  },

  // Deuteronomy 32:8 — the "sons of God" reading
  'Deut:32:8': {
    description: 'How the nations were divided: LXX reads “angels of God,” the MT reads “sons of Israel.”',
    witnesses: 'A Dead Sea Scroll (4QDeutʲ) reads “sons of God”; the ESV follows that reading in its main text.',
    source: 'Heiser, “Deuteronomy 32:8 and the Sons of God,” Bibliotheca Sacra 158 (2001): 52–74.',
  },
  'Deut:32:43': {
    description: 'The LXX of this verse is expanded, including a “sons of God” clause absent from the MT.',
    source: 'Heiser, “Deuteronomy 32:8 and the Sons of God,” Bibliotheca Sacra 158 (2001): 52–74.',
  },

  // 1 Samuel 17:4 — Goliath's height
  '1Sam:17:4': {
    description: 'Goliath’s height: the LXX reads “four cubits and a span” (~6′9″), the MT reads “six cubits and a span” (~9′9″).',
    witnesses: 'The shorter height is read by the LXX, the Dead Sea Scroll 4QSamᵃ, and Josephus (Antiquities 6.171).',
    source: 'Tov, Textual Criticism of the Hebrew Bible, 3rd ed. (Fortress, 2012), 342.',
  },

  // Isaiah 7:14 — almah / parthenos
  'Isa:7:14': {
    description: 'The sign of the child: the LXX reads “parthenos” (virgin); the MT reads “almah” (young woman).',
    witnesses: 'Matthew 1:23 quotes the LXX wording of this verse.',
    source: 'Jobes & Silva, Invitation to the Septuagint, 2nd ed. (Baker Academic, 2015), 189–191.',
  },

  // Job 42:17 — the LXX colophon
  'Job:42:17': {
    description: 'The LXX adds an extended colophon here identifying Job with Jobab; it is absent from the MT.',
    source: 'Brenton, The Septuagint with an English Translation (1851).',
  },
}

export function getVariantKey(book: string, chapter: number, verse: number): string {
  return `${book}:${chapter}:${verse}`
}

/** Check if a verse has a known variant (for external use) */
export function hasVariant(book: string, chapter: number, verse: number): boolean {
  return !!KNOWN_VARIANTS[getVariantKey(book, chapter, verse)]
}
