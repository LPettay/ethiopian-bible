import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Types — mirror the shape of public/data/reading-paths.json
// ---------------------------------------------------------------------------

interface PathEntry {
  book: string
  startChapter: number
  endChapter: number
  /** Human-readable label shown as the link text */
  label?: string
  /** Optional parallelism / commentary note (no link) */
  note?: string
}

interface PathSection {
  name: string
  description?: string
  entries: PathEntry[]
}

interface ReadingPath {
  id: string
  name: string
  description: string
  sections: PathSection[]
}

interface ReadingPathsData {
  paths: ReadingPath[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function entryRange(entry: PathEntry): string {
  return entry.startChapter === entry.endChapter
    ? `${entry.startChapter}`
    : `${entry.startChapter}–${entry.endChapter}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** A single entry: a link into the reader, or a parallelism note */
function EntryRow({ entry }: { entry: PathEntry }) {
  // A note-only entry (no readable target) is rendered as a margin gloss.
  if (entry.note) {
    return (
      <li className="pl-4 border-l-2 border-accent/20 py-1">
        <p className="text-xs font-body italic text-text-muted leading-relaxed">
          {entry.note}
        </p>
      </li>
    )
  }

  return (
    <li>
      <Link
        to={`/read/${entry.book}/${entry.startChapter}`}
        className="flex items-baseline gap-3 px-3 py-2 rounded-sm
                   hover:bg-surface-hover/40 transition-colors group"
      >
        <span className="font-body text-xs text-accent/50 tabular-nums flex-shrink-0 mt-0.5">
          {entry.book} {entryRange(entry)}
        </span>
        <span className="text-sm font-body text-text group-hover:text-accent transition-colors leading-relaxed">
          {entry.label || `${entry.book} ${entryRange(entry)}`}
        </span>
      </Link>
    </li>
  )
}

/** One curated path rendered as a card */
function PathCard({ path }: { path: ReadingPath }) {
  return (
    <article
      className="bg-surface/60 rounded-sm p-6 md:p-8"
      style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(200,149,42,0.06)' }}
      aria-labelledby={`path-${path.id}`}
    >
      {/* Title */}
      <h2
        id={`path-${path.id}`}
        className="text-xl md:text-2xl font-body font-semibold text-text leading-tight"
      >
        {path.name}
      </h2>
      <p className="mt-2 text-sm font-body text-text-muted leading-relaxed">
        {path.description}
      </p>

      {/* Sections. Sections/entries carry no stable id, and this data is static
          (loaded once, never reordered/inserted at runtime), so index-based keys
          scoped under the stable path.id are safe and stable here. */}
      <div className="mt-6 space-y-6">
        {path.sections.map((section, i) => (
          <div key={`${path.id}-${i}`}>
            <h3 className="text-xs uppercase tracking-widest text-accent/40 mb-2 font-body">
              {section.name}
            </h3>
            {section.description && (
              <p className="text-xs font-body italic text-text-muted leading-relaxed mb-2">
                {section.description}
              </p>
            )}
            <ol className="space-y-0.5">
              {section.entries.map((entry, j) => (
                <EntryRow key={`${path.id}-${i}-${j}`} entry={entry} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function ReadingPathsPage() {
  const [paths, setPaths] = useState<ReadingPath[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}data/reading-paths.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load reading paths: ${res.status}`)
        return res.json() as Promise<ReadingPathsData>
      })
      .then(data => {
        // Guard against malformed JSON (missing/non-array `paths`) so a bad
        // payload routes to the error state instead of crashing on `.map`.
        if (!Array.isArray(data?.paths)) {
          throw new Error('Reading paths data is malformed')
        }
        if (!cancelled) setPaths(data.paths)
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* ---- Hero ---- */}
      <header className="text-center pt-12 md:pt-20 pb-8">
        <div className="text-accent mb-5" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="w-12 h-12 mx-auto">
            <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor" opacity="0.85" />
            <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-body font-semibold text-text leading-tight">
          Guided Reading Paths
        </h1>
        <p className="mt-3 text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed font-body italic">
          Curated journeys through the canon — narrative arcs, parallel readings,
          and thematic threads to follow.
        </p>
      </header>

      {/* ---- Cross divider ---- */}
      <div className="cross-divider" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
          <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor" opacity="0.85" />
        </svg>
      </div>

      {/* ---- States ---- */}
      {error ? (
        <div
          role="alert"
          className="bg-surface/60 border-l-[3px] border-mt rounded-r-sm px-5 py-4 text-sm font-body text-text-muted"
        >
          <p className="text-text font-medium mb-1">Could not load the reading paths.</p>
          <p>
            Please try again later, or{' '}
            <Link to="/bible" className="text-accent hover:underline">
              browse all books
            </Link>{' '}
            instead.
          </p>
        </div>
      ) : paths === null ? (
        <p className="text-center text-text-muted text-sm font-body italic py-10" aria-live="polite">
          Loading reading paths…
        </p>
      ) : (
        <div className="space-y-8">
          {paths.map(path => (
            <PathCard key={path.id} path={path} />
          ))}
        </div>
      )}

      {/* ---- Footer ---- */}
      <footer className="text-center pt-12 text-text-muted text-xs leading-relaxed font-body">
        <Link to="/" className="text-accent hover:underline">
          &larr; Back to the beginning
        </Link>
      </footer>
    </div>
  )
}
