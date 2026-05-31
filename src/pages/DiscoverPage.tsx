import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Provenance labels — single source of truth for this page.
//
// Format: 'Tradition — Edition (year)'. These mirror the canonical labels used
// in the reader so a passage's textual source reads the same everywhere. The
// values are deliberately value-neutral (tradition + edition), not church
// affiliations.
// ---------------------------------------------------------------------------

const SOURCE_LABELS = {
  /** KJV OT renders the Masoretic Hebrew. 'Masoretic' is a value-neutral term. */
  masoretic: 'Masoretic — King James (1611)',
  /** Brenton's 1851 English Septuagint, translated from Codex Vaticanus. */
  septuagint: 'Septuagint — Brenton (1851)',
} as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Stop {
  num: number
  /** Plain topic + reference, e.g. "Adam's age at Seth's birth (Genesis 5:3)". */
  topic: string
  mt: { label: string; text: string }
  lxx: { label: string; text: string }
  body: string[]
  /** Optional supporting note, drawn only from verified citations. */
  witness?: string
  /** Optional link to read the passage in context. */
  readLink?: { label: string; to: string }
}

// ---------------------------------------------------------------------------
// Data — the 5 places where the traditions diverge
// ---------------------------------------------------------------------------

const STOPS: Stop[] = [
  {
    num: 1,
    topic: 'Adam’s age at Seth’s birth (Genesis 5:3)',
    mt: {
      label: SOURCE_LABELS.masoretic,
      text: 'Adam fathers Seth at age <strong>130</strong>.<br/>Creation to Abraham: ~2,008 years.',
    },
    lxx: {
      label: SOURCE_LABELS.septuagint,
      text: 'Adam fathers Seth at age <strong>230</strong>.<br/>Creation to Abraham: ~3,394 years.',
    },
    body: [
      'This is not a single verse. The same kind of difference recurs across the patriarchs of Genesis 5 and 11, so the two traditions place creation roughly 1,400 years apart.',
    ],
    witness:
      'These numbers differ across manuscript traditions: Masoretic 130, Septuagint 230 (preserved in Codex Alexandrinus), Samaritan Pentateuch 130. Josephus also gives 230. The Dead Sea Scrolls preserve no Genesis 5 numbers. (Luke 3:36’s extra Cainan concerns Genesis 11, a separate question.)',
  },
  {
    num: 2,
    topic: 'Goliath’s height (1 Samuel 17:4)',
    mt: {
      label: SOURCE_LABELS.masoretic,
      text: '“Six cubits and a span”<br/><strong>~9 ft 9 in</strong> (2.97 m)',
    },
    lxx: {
      label: SOURCE_LABELS.septuagint,
      text: '“Four cubits and a span”<br/><strong>~6 ft 9 in</strong> (2.06 m)',
    },
    body: [
      'The Dead Sea Scrolls, Josephus, and the Septuagint agree on the shorter reading.',
      'At 6’9”, Goliath remains a giant — taller than almost any human alive today — while reading as a plausibly real person rather than a mythological figure.',
    ],
    witness:
      'Dead Sea Scroll 4QSamᵃ reads “four cubits and a span”; Josephus, Antiquities 6.171 (1st century CE) agrees, as does the Septuagint (Tov, Textual Criticism of the Hebrew Bible, 3rd ed., 2012, 342).',
  },
  {
    num: 3,
    topic: 'Sons of God or sons of Israel? (Deuteronomy 32:8)',
    mt: {
      label: SOURCE_LABELS.masoretic,
      text: '“...according to the number of the <strong>sons of Israel</strong>”',
    },
    lxx: {
      label: SOURCE_LABELS.septuagint,
      text: '“...according to the number of the <strong>angels of God</strong>”',
    },
    body: [
      'The Septuagint and Qumran reading reflects an ancient Israelite cosmology: God presides over a divine council, each member assigned to a nation, with Israel as YHWH’s own portion.',
      'The same picture appears elsewhere in Scripture — Psalm 82, Job 1–2, 1 Kings 22:19–22.',
    ],
    witness:
      'Dead Sea Scroll 4QDeutʲ reads “sons of God” (בני אלהים), matching the Septuagint against the Masoretic “sons of Israel.” The ESV adopts the Qumran/LXX reading in its main text (Heiser, “Deuteronomy 32:8 and the Sons of God,” Bibliotheca Sacra 158, 2001, 52–74).',
  },
  {
    num: 4,
    topic: 'The book that Jude quotes (Jude 14–15 / 1 Enoch 1:9)',
    mt: {
      label: 'Jude 14–15',
      text: '“Enoch, the seventh from Adam, <em>prophesied</em> about these: ‘See, the Lord is coming with thousands upon thousands of his holy ones to judge everyone.’”',
    },
    lxx: {
      label: '1 Enoch 1:9',
      text: '“Behold, he comes with ten thousand of his holy ones, to execute judgment upon all, and to convict all the ungodly of all their ungodly deeds.”',
    },
    body: [
      'Jude does not merely allude to Enoch. He names him, calls him a prophet, and quotes him — the clearest New Testament citation of a non-canonical work.',
      '1 Enoch survives complete only in Ge’ez, preserved by the Ethiopian church across more than 1,600 years; it is absent from the major Septuagint codices.',
    ],
    witness:
      'Jude 14–15 quotes 1 Enoch 1:9 (Nickelsburg, 1 Enoch: A Commentary, Hermeneia, 2001, 9–14). The Protestant tradition reads this as citing a popular text rather than endorsing it as Scripture; the Ethiopian Orthodox tradition includes 1 Enoch in its canon.',
    readLink: { label: 'Read 1 Enoch, Chapter 1', to: '/read/1En/1' },
  },
  {
    num: 5,
    topic: 'Which Old Testament did the apostles quote? (a pattern)',
    mt: {
      label: 'What the NT authors quote',
      text: '<strong>Matthew 1:23</strong> quotes the Septuagint Isaiah 7:14 (“virgin”).<br/><strong>Hebrews 1:6</strong> quotes an expanded Deuteronomy 32:43 not in the Masoretic Text.<br/><strong>Jude 14–15</strong> quotes 1 Enoch by name.',
    },
    lxx: {
      label: 'What this shows',
      text: 'Across these passages, the New Testament authors quote an Old Testament closer to the Septuagint than to the Masoretic Text from which Protestant Bibles are translated.',
    },
    body: [
      'This is a pattern rather than a single variant: longer chronologies, an expanded Song of Moses, divine-council language, and the citation of 1 Enoch all point the same direction.',
      'Luke 3:36 adds a patriarch, “Cainan,” matching the Septuagint genealogy — a point about the Genesis 11 line, whose status in the earliest Luke manuscripts is itself debated.',
    ],
    witness:
      'Matthew 1:23 follows the LXX Isaiah 7:14 “parthenos” (Jobes & Silva, Invitation to the Septuagint, 2nd ed., 2015, 189–191). On Luke’s extra Cainan in the Genesis 11 line, see Steinmann, JETS 60/4.',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Html({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

// ---------------------------------------------------------------------------
// Individual Stop Card
// ---------------------------------------------------------------------------

function StopCard({ stop, isVisible }: { stop: Stop; isVisible: boolean }) {
  const isLast = stop.num === STOPS.length

  return (
    <section
      id={`stop-${stop.num}`}
      className="min-h-screen flex items-center justify-center px-4 py-16 md:py-20 scroll-mt-16"
      aria-label={`Stop ${stop.num}: ${stop.topic}`}
    >
      <div
        className={`max-w-2xl w-full transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Stop number */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-accent/50 text-sm font-medium tracking-wider uppercase">
            {stop.num} of {STOPS.length}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Topic */}
        <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight mb-8">
          {stop.topic}
        </h2>

        {/* Side-by-side readings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Masoretic / left column */}
          <div className="p-4 rounded-lg bg-mt-bg border border-mt-border">
            <div className="text-[0.72rem] uppercase tracking-wider font-semibold text-mt mb-2">
              {stop.mt.label}
            </div>
            <div className="text-sm leading-relaxed text-text/90">
              <Html html={stop.mt.text} />
            </div>
          </div>
          {/* Septuagint / right column */}
          <div className="p-4 rounded-lg bg-lxx-bg border border-lxx-border">
            <div className="text-[0.72rem] uppercase tracking-wider font-semibold text-lxx mb-2">
              {stop.lxx.label}
            </div>
            <div className="text-sm leading-relaxed text-text/90">
              <Html html={stop.lxx.text} />
            </div>
          </div>
        </div>

        {/* Body paragraphs */}
        <div className="space-y-3 mb-6">
          {stop.body.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-text/80 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Witness note — sources, stated only where verified */}
        {stop.witness && (
          <div className="bg-surface-raised/60 border border-border rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-text-muted leading-relaxed">{stop.witness}</p>
            </div>
          </div>
        )}

        {/* Read link */}
        {stop.readLink && (
          <Link
            to={stop.readLink.to}
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-bright transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {stop.readLink.label}
          </Link>
        )}

        {/* Navigation on the final stop */}
        {isLast && (
          <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
            <Link
              to="/read/Gen/1"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                         bg-accent text-bg font-semibold text-sm
                         hover:bg-accent-bright transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start reading
            </Link>
            <Link
              to="/compare"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                         bg-surface border border-border text-text text-sm font-medium
                         hover:border-accent hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              Comparison & sources
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Progress dots
// ---------------------------------------------------------------------------

function ProgressDots({
  total,
  current,
  onDotClick,
}: {
  total: number
  current: number
  onDotClick: (index: number) => void
}) {
  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface/90 backdrop-blur-sm border border-border"
      aria-label="Explore progress"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          aria-label={`Go to stop ${i + 1}`}
          aria-current={i === current ? 'step' : undefined}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
            i === current
              ? 'bg-accent scale-125'
              : i < current
              ? 'bg-accent/40'
              : 'bg-text-faint'
          }`}
        />
      ))}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function DiscoverPage() {
  const [currentStop, setCurrentStop] = useState(0)
  const [visibleStops, setVisibleStops] = useState<Set<number>>(new Set([0]))
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const { hash } = useLocation()

  // Intersection observer to track which stop is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.getAttribute('data-stop-index'))
          if (isNaN(index)) continue

          if (entry.isIntersecting) {
            setVisibleStops(prev => {
              const next = new Set(prev)
              next.add(index)
              return next
            })
          }

          // Update current stop based on which is most visible
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            setCurrentStop(index)
          }
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-10% 0px -10% 0px' }
    )

    const refs = sectionRefs.current
    refs.forEach(ref => { if (ref) observer.observe(ref) })

    return () => {
      refs.forEach(ref => { if (ref) observer.unobserve(ref) })
    }
  }, [])

  const scrollToStop = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  // Honor a direct anchor link such as /discover#stop-2 — reveal and scroll to
  // the requested stop so deep links land in the right place. State updates run
  // in the timeout callback (asynchronously) rather than synchronously in the
  // effect body, after the section refs have been populated.
  useEffect(() => {
    const match = /^#stop-(\d+)$/.exec(hash)
    if (!match) return
    const index = Number(match[1]) - 1
    if (index < 0 || index >= STOPS.length) return
    const id = setTimeout(() => {
      setVisibleStops(prev => new Set(prev).add(index))
      setCurrentStop(index)
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    return () => clearTimeout(id)
  }, [hash])

  return (
    <div className="relative">
      {/* Hero / intro */}
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-lg">
          {/* Decorative cross */}
          <div className="text-accent/40 mb-6" aria-hidden="true">
            <svg className="w-10 h-10 mx-auto" viewBox="0 0 48 48" fill="none">
              <rect x="21" y="4" width="6" height="40" rx="1" fill="currentColor" opacity="0.9" />
              <rect x="8" y="14" width="32" height="6" rx="1" fill="currentColor" opacity="0.9" />
              <circle cx="24" cy="17" r="3" fill="currentColor" opacity="0.6" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight mb-4">
            Where the traditions diverge
          </h1>
          <p className="text-text-muted text-base leading-relaxed mb-8">
            Five places where the Septuagint and Masoretic traditions read differently &mdash; each with its sources.
          </p>

          {/* Scroll prompt */}
          <button
            onClick={() => scrollToStop(0)}
            className="inline-flex flex-col items-center gap-2 text-accent/60 hover:text-accent transition-colors cursor-pointer"
          >
            <span className="text-sm">Begin</span>
            <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stops */}
      {STOPS.map((stop, i) => (
        <div
          key={stop.num}
          ref={el => { sectionRefs.current[i] = el }}
          data-stop-index={i}
        >
          <StopCard stop={stop} isVisible={visibleStops.has(i)} />

          {/* Divider between stops (not after last) */}
          {i < STOPS.length - 1 && (
            <div className="flex justify-center py-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-accent/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                <div className="w-px h-8 bg-accent/20" />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Bottom padding for last stop */}
      <div className="h-24" />

      {/* Progress dots */}
      <ProgressDots
        total={STOPS.length}
        current={currentStop}
        onDotClick={scrollToStop}
      />
    </div>
  )
}
