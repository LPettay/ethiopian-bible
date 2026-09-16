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
}

/** Shape of the optional client lexicon file: { "<geez lemma>": { gloss, source } }. */
export type Lexicon = Record<string, GlossEntry>

/**
 * Beta Masaheft hosts the digitized Dillmann *Lexicon Linguae Aethiopicae*.
 * This returns a public search URL that looks the word up in that resource so
 * a reader can always reach a scholarly source even when we have no local gloss.
 */
export function dillmannSearchUrl(geez: string): string {
  return `https://betamasaheft.eu/Dillmann/search?query=${encodeURIComponent(geez)}`
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
    const data = (await res.json()) as Lexicon
    lexiconCache = data && typeof data === 'object' ? data : {}
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
  return { gloss: entry.gloss, source: entry.source }
}
