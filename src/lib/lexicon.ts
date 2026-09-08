import { hasGeezScript } from './stub'

/**
 * Client-side Ge'ez lexicon lookup.
 *
 * INTEGRITY-FIRST: this module never fabricates a meaning. It only surfaces
 * glosses that come from an explicit, attributed source. When no sourced gloss
 * is available it returns `null`, and the UI is expected to state that absence
 * honestly (rather than render a silent blank).
 *
 * The lexicon data file (`${BASE_URL}data/lexicon.json`) is OPTIONAL. Until it
 * exists, `getGloss` simply returns `null` for every lookup — by design.
 */

export interface GlossEntry {
  gloss: string
  source: string
  /** Language of `gloss`: English (Leslau/TraCES layer) or Dillmann's own Latin. */
  lang?: 'en' | 'la'
  /** Dictionary headword the surface form resolved to (may differ from the word). */
  lemma?: string
  /** Dillmann's Latin gloss, kept alongside an English `gloss` for the 1865 wording. */
  latin?: string
  /** Part of speech as expanded in the TEI (e.g. "Substantivum"). */
  pos?: string
  /** Beta Masaheft entry id; see {@link dillmannEntryUrl}. */
  id?: string
}

/** In-memory shape: { "<geez surface word>": GlossEntry }. */
export type Lexicon = Record<string, GlossEntry>

/**
 * On-disk v2 shape written by `research/tools/build_lexicon_offline.py`.
 * Entries are shared: many surface forms point at one headword record, which
 * keeps the shipped file a fraction of the size of a flat surface→entry map.
 */
interface LexiconFileV2 {
  version: 2
  source: string
  entries: GlossEntry[]
  words: Record<string, number>
}

const DILLMANN_BASE = 'https://betamasaheft.eu/Dillmann'

/**
 * Beta Masaheft hosts the digitized Dillmann *Lexicon Linguae Aethiopicae*.
 * This returns a public search URL that looks the word up in that resource so
 * a reader can always reach a scholarly source even when we have no local gloss.
 */
export function dillmannSearchUrl(geez: string): string {
  return `${DILLMANN_BASE}/search?query=${encodeURIComponent(geez)}`
}

/** Permalink to one Dillmann entry — the exact source a gloss was quoted from. */
export function dillmannEntryUrl(id: string): string {
  return `${DILLMANN_BASE}/lemma/${encodeURIComponent(id)}`
}

/** The most specific link we can offer for a word: its entry, else a search. */
export function glossSourceUrl(geez: string, entry: GlossEntry | null): string {
  return entry?.id ? dillmannEntryUrl(entry.id) : dillmannSearchUrl(geez)
}

/**
 * Module-level cache for the optional lexicon. `null` means "not yet loaded
 * (or no file present)". An empty object means "loaded, but no entries".
 */
let lexiconCache: Lexicon | null = null

/**
 * Directly seed the in-memory lexicon cache. Primarily for tests and for
 * callers that already hold lexicon data; production code normally calls
 * {@link loadLexicon} instead.
 */
export function setLexicon(lexicon: Lexicon | null): void {
  lexiconCache = lexicon
}

function isV2(data: unknown): data is LexiconFileV2 {
  const d = data as Partial<LexiconFileV2> | null
  return !!d && d.version === 2 && Array.isArray(d.entries) && !!d.words && typeof d.words === 'object'
}

/**
 * Expand the compact v2 file into the flat lookup shape. Surface forms that
 * point at a missing or unattributed entry are dropped here, so `getGloss`
 * never has to trust the file.
 */
export function expandLexicon(data: unknown): Lexicon {
  if (isV2(data)) {
    const out: Lexicon = {}
    for (const [word, idx] of Object.entries(data.words)) {
      const entry = data.entries[idx]
      if (entry && entry.gloss && entry.source) out[word] = entry
    }
    return out
  }
  return data && typeof data === 'object' ? (data as Lexicon) : {}
}

/**
 * Attempt to populate the lexicon cache from the optional
 * `${BASE_URL}data/lexicon.json` file. Safe to call when the file is absent:
 * any fetch/parse failure leaves the cache as an empty object so that
 * `getGloss` returns `null` rather than throwing. Returns the loaded lexicon
 * (possibly empty).
 */
export async function loadLexicon(): Promise<Lexicon> {
  if (lexiconCache) return lexiconCache
  try {
    const base = import.meta.env.BASE_URL ?? '/'
    const res = await fetch(`${base}data/lexicon.json`)
    if (!res.ok) {
      lexiconCache = {}
      return lexiconCache
    }
    lexiconCache = expandLexicon(await res.json())
  } catch {
    // File absent or unparseable — that is an expected, non-fatal state.
    lexiconCache = {}
  }
  return lexiconCache
}

/**
 * Look up a sourced gloss for a Ge'ez word.
 *
 * Pure and synchronous: it only consults whatever lexicon has already been
 * loaded into the module cache. Returns `null` when:
 *   - the input is not Ge'ez script (e.g. an English header line),
 *   - no lexicon has been loaded, or
 *   - the lexicon has no attributed entry for this word.
 *
 * A returned entry ALWAYS carries a non-empty `source`; entries lacking a
 * source are treated as unattributed and rejected.
 */
export function getGloss(geez: string): GlossEntry | null {
  if (!geez || !hasGeezScript(geez)) return null
  if (!lexiconCache) return null
  const entry = lexiconCache[geez]
  if (!entry || !entry.gloss || !entry.source) return null
  return entry
}
