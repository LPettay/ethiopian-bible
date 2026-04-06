import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Stop {
  num: number
  question: string
  reference: string
  hook: string
  mt: { label: string; text: string }
  lxx: { label: string; text: string }
  body: string[]
  /** Optional supporting note (DSS, NT witness, etc.) */
  witness?: string
  /** Optional link to read more */
  readLink?: { label: string; to: string }
}

// ---------------------------------------------------------------------------
// Data — the 5 stops
// ---------------------------------------------------------------------------

const STOPS: Stop[] = [
  {
    num: 1,
    question: 'How old was Adam?',
    reference: 'Genesis 5:3',
    hook: 'Your Bible says 130. The oldest witnesses say 230. A difference of 100 years \u2014 and it\u2019s not a typo.',
    mt: {
      label: 'Masoretic / Protestant',
      text: 'Adam fathers Seth at age <strong>130</strong>.<br/>Creation to Abraham: ~2,008 years.',
    },
    lxx: {
      label: 'Septuagint / Ethiopian',
      text: 'Adam fathers Seth at age <strong>230</strong>.<br/>Creation to Abraham: ~3,394 years \u2014 <strong>1,386 years longer</strong>.',
    },
    body: [
      'The entire timeline of biblical history differs by nearly 1,400 years depending on which textual tradition you follow.',
      'This isn\u2019t one verse. It\u2019s a systematic difference across every patriarch in Genesis 5 and 11.',
    ],
    witness: 'Luke 3:36 includes \u201CCainan, the son of Arphaxad\u201D \u2014 a patriarch found in the Septuagint but absent from the Masoretic Text. Luke used the longer timeline.',
  },
  {
    num: 2,
    question: 'How tall was Goliath?',
    reference: '1 Samuel 17:4',
    hook: '9 feet 9 inches \u2014 or 6 feet 9 inches? Three ancient witnesses agree on the shorter reading.',
    mt: {
      label: 'Masoretic / Protestant',
      text: '\u201CSix cubits and a span\u201D<br/><strong>~9 ft 9 in</strong> (2.97 m)',
    },
    lxx: {
      label: 'Septuagint / Ethiopian',
      text: '\u201CFour cubits and a span\u201D<br/><strong>~6 ft 9 in</strong> (2.06 m)',
    },
    body: [
      'The Dead Sea Scrolls, Josephus, and the Septuagint all agree on the shorter reading.',
      'At 6\u20199\u201D, Goliath is still a giant \u2014 taller than almost any human alive today \u2014 but he becomes a plausibly real person, not a mythological figure.',
    ],
    witness: 'Dead Sea Scroll 4QSam\u1D43 reads \u201Cfour cubits and a span.\u201D Josephus (Antiquities 6.171, 1st century CE) agrees. Three ancient witnesses against one.',
  },
  {
    num: 3,
    question: 'Sons of God or Sons of Israel?',
    reference: 'Deuteronomy 32:8',
    hook: 'An older theology that scribes tried to erase. The Dead Sea Scrolls preserved it.',
    mt: {
      label: 'Masoretic / Protestant',
      text: '\u201C...according to the number of the <strong>sons of Israel</strong>\u201D',
    },
    lxx: {
      label: 'Septuagint / Ethiopian',
      text: '\u201C...according to the number of the <strong>angels of God</strong>\u201D',
    },
    body: [
      'The older reading preserves an ancient Israelite cosmology: God presides over a council of divine beings, each assigned to a nation, with Israel as YHWH\u2019s own portion.',
      'This concept appears throughout Scripture \u2014 Psalm 82, Job 1\u20132, 1 Kings 22:19\u201322 \u2014 but was suppressed in this passage by later scribes uncomfortable with its implications.',
    ],
    witness: 'Dead Sea Scroll 4QDeut\u02B2 reads \u201Csons of God\u201D (\u05D1\u05E0\u05D9 \u05D0\u05DC\u05D4\u05D9\u05DD), confirming the LXX preserves the older reading. The ESV Study Bible has adopted the Qumran/LXX reading in its main text.',
  },
  {
    num: 4,
    question: 'The book that Jude quoted',
    reference: 'Jude 14\u201315 / 1 Enoch 1:9',
    hook: 'Your New Testament quotes a book that your Old Testament doesn\u2019t contain. The Ethiopian Bible has it.',
    mt: {
      label: 'Jude 14\u201315',
      text: '\u201CEnoch, the seventh from Adam, <em>prophesied</em> about these: \u2018See, the Lord is coming with thousands upon thousands of his holy ones to judge everyone.\u2019\u201D',
    },
    lxx: {
      label: '1 Enoch 1:9',
      text: '\u201CBehold, he comes with ten thousand of his holy ones, to execute judgment upon all, and to convict all the ungodly of all their ungodly deeds.\u201D',
    },
    body: [
      'Jude doesn\u2019t merely allude to Enoch. He names him, calls him a prophet, and quotes him verbatim.',
      '1 Enoch survived complete only because the Ethiopian church preserved it \u2014 108 chapters, in Ge\u2019ez, for over 1,600 years.',
    ],
    witness: 'The Protestant position treats this as citing a \u201Cpopular text,\u201D not endorsing it as Scripture. But Jude uses the same prophetic formula used for other prophets. The Ethiopian church sees this as evidence that Enoch belongs in the Bible.',
    readLink: { label: 'Read 1 Enoch, Chapter 1', to: '/read/1En/1' },
  },
  {
    num: 5,
    question: 'Which Bible did the Apostles read?',
    reference: 'The synthesis',
    hook: 'The New Testament authors were reading an Old Testament closer to the Ethiopian Bible than to the one on your shelf.',
    mt: {
      label: 'What the NT authors quoted',
      text: '<strong>Matthew 1:23</strong> quotes the LXX Isaiah 7:14 (\u201Cvirgin\u201D).<br/><strong>Luke 3:36</strong> uses the LXX genealogy with the extra patriarch.<br/><strong>Hebrews 1:6</strong> quotes an expanded Deuteronomy 32:43 not found in the Masoretic Text.<br/><strong>Jude 14\u201315</strong> quotes 1 Enoch by name.',
    },
    lxx: {
      label: 'What this means',
      text: 'The Old Testament that shaped the New Testament was not the Masoretic Text that Protestant Bibles are translated from. It was a text closer to the Septuagint \u2014 the tradition preserved by the Ethiopian Orthodox Church.',
    },
    body: [
      'This is not a claim about one verse or one variant. It is a pattern.',
      'The authors of the Gospels, Hebrews, and Jude were reading \u2014 and quoting as authoritative Scripture \u2014 an Old Testament that included longer chronologies, expanded songs, divine council theology, and books like 1 Enoch.',
      'The Ethiopian Bible preserves that tradition.',
    ],
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
      className="min-h-screen flex items-center justify-center px-4 py-16 md:py-20"
      aria-label={`Stop ${stop.num}: ${stop.question}`}
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
            Stop {stop.num} of {STOPS.length}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight mb-2">
          {stop.question}
        </h2>
        <p className="text-text-muted text-sm mb-2">{stop.reference}</p>

        {/* Hook */}
        <p className="text-base md:text-lg text-text/90 leading-relaxed mb-8">
          {stop.hook}
        </p>

        {/* Side-by-side readings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* MT / Protestant / Left column */}
          <div className="p-4 rounded-lg bg-mt-bg border border-mt-border">
            <div className="text-[0.72rem] uppercase tracking-wider font-semibold text-mt mb-2">
              {stop.mt.label}
            </div>
            <div className="text-sm leading-relaxed text-text/90">
              <Html html={stop.mt.text} />
            </div>
          </div>
          {/* LXX / Ethiopian / Right column */}
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

        {/* Witness note */}
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

        {/* CTAs on the final stop */}
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
              See all differences
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
      aria-label="Discovery progress"
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
            Five Verses That Change<br />How You Read the Bible
          </h1>
          <p className="text-text-muted text-base leading-relaxed mb-8">
            A guided journey through the differences that matter most.
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
