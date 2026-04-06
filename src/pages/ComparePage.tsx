import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CANON_STATS,
  UNIQUE_BOOKS,
  STRUCTURAL_DIFFS,
  PSALM_NUMBERING,
  TEXTUAL_VARIANTS,
  DSS_SCORECARD,
  OT_COMPARISON,
  BIBLIOGRAPHY,
  type TextualVariant,
  type DssScorecard,
  type OtCompRow,
} from '../lib/compare-data'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Renders a single inline citation link, e.g. [3] */
function Cite({ n }: { n: string }) {
  return (
    <a href={`#n${n}`} className="text-[0.78rem] text-text-muted align-super cursor-help no-underline px-px hover:text-accent transition-colors">
      [{n}]
    </a>
  )
}

/** Renders an array of citation links */
function Cites({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null
  return <>{ids.map(n => <Cite key={n} n={n} />)}</>
}

/** Dangerously set inner HTML helper for rich text from data */
function Html({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Stat box (66 / 73 / 81) */
function StatBox({ num, label }: { num: number; label: string }) {
  return (
    <div className="bg-surface rounded-lg p-4 text-center border border-border">
      <div className="text-3xl font-bold text-accent leading-none mb-1">{num}</div>
      <div className="text-[0.78rem] text-text-muted uppercase tracking-wide">{label}</div>
    </div>
  )
}

/** Single variant card with side-by-side MT / LXX readings */
function VariantCard({ v }: { v: TextualVariant }) {
  return (
    <div className="bg-surface rounded-lg p-5 my-4 border border-border">
      {/* Title */}
      <div className="text-base text-geez font-semibold mb-1">
        <Html html={v.title} />
      </div>
      <div className="text-[0.82rem] text-text-muted mb-3">
        <Html html={v.subtitle} />
      </div>

      {/* Side-by-side readings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Masoretic / Protestant */}
        <div className="p-3 rounded-md bg-mt-bg border border-mt-border">
          <div className="text-[0.72rem] uppercase tracking-wide font-semibold text-mt mb-1">
            {v.mtLabel || 'Masoretic / Protestant'}
          </div>
          <div className="text-[0.88rem]"><Html html={v.mt} /></div>
        </div>
        {/* LXX / Ethiopian */}
        <div className="p-3 rounded-md bg-lxx-bg border border-lxx-border">
          <div className="text-[0.72rem] uppercase tracking-wide font-semibold text-lxx mb-1">
            {v.lxxLabel || 'Septuagint / Ethiopian'}
          </div>
          <div className="text-[0.88rem]"><Html html={v.lxx} /></div>
        </div>
      </div>

      {/* DSS witness */}
      {v.dss && (
        <div className="text-[0.82rem] text-text-muted p-3 rounded-md bg-accent-dim/30 border border-dashed border-accent-dim">
          <Html html={v.dss} />
        </div>
      )}

      {/* Why it matters callout */}
      <div className="bg-surface border-l-[3px] border-accent pl-4 pr-4 py-3.5 rounded-r-md mt-3 text-[0.9rem]">
        <strong className="text-accent">Why this matters:</strong>{' '}
        <Html html={v.whyItMatters} />
      </div>

      {/* Source reference */}
      <div className="text-[0.82rem] text-text-muted italic mt-2 pl-3 border-l-2 border-border">
        <Html html={v.sourceRef} />
      </div>
    </div>
  )
}

/** Colored canon indicator */
function CanonCell({ text, kind: _kind }: { text: string; kind: OtCompRow['kind'] }) {
  const isYes = text.startsWith('Yes')
  const isNo = text.startsWith('No')
  const color = isNo
    ? 'text-mt opacity-70'
    : isYes
      ? 'text-lxx'
      : 'text-text'
  return <td className={`px-3 py-2 border-b border-white/[0.04] align-top ${color}`}>{text}</td>
}

/** DSS scorecard row */
function ScorecardRow({ row }: { row: DssScorecard }) {
  const color =
    row.verdict === 'lxx'
      ? 'text-lxx'
      : row.verdict === 'both'
        ? 'text-[#6ba3c7]'
        : 'text-text-muted'
  return (
    <tr className="hover:bg-accent/[0.03]">
      <td className="px-3 py-2 border-b border-white/[0.04] align-top">
        <Html html={row.passage} />
      </td>
      <td className={`px-3 py-2 border-b border-white/[0.04] align-top ${color}`}>
        <Html html={row.support} />
        <Cites ids={row.cites} />
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function ComparePage() {
  // Track active section for nav highlighting
  const [activeSection, setActiveSection] = useState('layer-1')
  const [otTableOpen, setOtTableOpen] = useState(false)
  const [psalmTableOpen, setPsalmTableOpen] = useState(false)

  useEffect(() => {
    const sections = ['layer-1', 'layer-2', 'layer-3']
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    )
    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  // Group bibliography by category
  const bibCategories: { cat: string; entries: typeof BIBLIOGRAPHY }[] = []
  for (const entry of BIBLIOGRAPHY) {
    let group = bibCategories.find(g => g.cat === entry.category)
    if (!group) {
      group = { cat: entry.category, entries: [] }
      bibCategories.push(group)
    }
    group.entries.push(entry)
  }

  return (
    <div className="max-w-[860px] mx-auto px-4 pb-12">
      {/* ---- Hero ---- */}
      <section className="text-center pt-12 pb-8 border-b border-border mb-10">
        <div className="text-2xl text-accent mb-3">&#10013;</div>
        <h1 className="text-2xl md:text-[1.6rem] text-geez font-semibold mb-2 leading-snug">
          The Ethiopian Bible & the Western Bible
        </h1>
        <p className="text-[1.05rem] text-text-muted max-w-[560px] mx-auto mb-5">
          A three-layer scholarly comparison of the oldest and largest Christian biblical
          canon with the Protestant and Catholic Bibles.
        </p>
        <div className="text-[0.82rem] text-text-muted border border-border-strong rounded-lg px-4 py-3 max-w-[500px] mx-auto bg-surface">
          Every factual claim on this page is cited to a published scholarly source.
          Superscript numbers link to the bibliography below so you can verify independently.
        </div>
      </section>

      {/* ---- Sticky nav tabs ---- */}
      <nav className="flex mb-10 rounded-lg overflow-hidden border border-border-strong sticky top-[52px] z-20">
        {[
          { id: 'layer-1', num: 'I', label: 'The Canon' },
          { id: 'layer-2', num: 'II', label: 'The Structure' },
          { id: 'layer-3', num: 'III', label: 'The Text' },
        ].map((tab, i, arr) => (
          <a
            key={tab.id}
            href={`#${tab.id}`}
            className={`flex-1 text-center py-3 px-2 bg-surface text-[0.85rem] font-medium transition-colors
              ${i < arr.length - 1 ? 'border-r border-border' : ''}
              ${activeSection === tab.id ? 'bg-surface-raised text-text' : 'text-text-muted hover:bg-surface-raised hover:text-text'}
            `}
          >
            <span className="block text-[1.1rem] text-accent font-bold mb-0.5">{tab.num}</span>
            {tab.label}
          </a>
        ))}
      </nav>

      {/* ================================================================ */}
      {/* LAYER 1: THE CANON                                              */}
      {/* ================================================================ */}
      <section id="layer-1" className="mb-14 scroll-mt-[calc(52px+60px)]">
        <div className="text-[0.8rem] uppercase tracking-widest text-text-muted mb-1">Layer I</div>
        <h2 className="text-xl text-accent font-semibold mb-1 pt-2">The Canon &mdash; Which Books?</h2>

        <p className="mb-3.5 text-[0.95rem]">
          The Ethiopian Orthodox Tewahedo Church preserves the largest biblical canon
          in Christianity. The traditional count is <strong>81 books</strong>,
          compared to the Protestant 66 and the Catholic 73.<Cite n="1" />
        </p>

        {/* Stat boxes */}
        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3 my-5 mb-7">
          {CANON_STATS.map(s => (
            <StatBox key={s.label} num={s.num} label={s.label} />
          ))}
        </div>

        {/* Venn text */}
        <div className="text-center font-mono text-[0.85rem] text-text-muted my-4 mb-6 leading-relaxed">
          <span className="text-accent font-semibold">Protestant (66)</span> &sub;{' '}
          <span className="text-accent font-semibold">Catholic (73)</span> &sub;{' '}
          <span className="text-accent font-semibold">Ethiopian (81)</span>
          <br />
          The Ethiopian canon is a <strong>superset</strong> &mdash; every Western book is included.<Cite n="2" />
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap my-3 mb-5 text-[0.82rem]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#b8b8b8]" /> In all three
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6ba3c7]" /> Catholic + Ethiopian
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-lxx" /> Ethiopian only
          </span>
        </div>

        {/* Unique books heading */}
        <h3 className="text-[1.05rem] text-geez font-semibold mt-7 mb-2.5">
          Books Unique to the Ethiopian Canon
        </h3>

        <p className="mb-3.5 text-[0.95rem]">
          These books appear in the Ethiopian Bible but not in any Western canon.
          Several survive <em>complete only in Ge'ez</em> &mdash; the Ethiopian church
          is the sole custodian of their full text.
        </p>

        {/* Unique books table */}
        <div className="overflow-x-auto my-4 mb-5 rounded-lg border border-border">
          <table className="w-full border-collapse text-[0.88rem] min-w-[500px]">
            <thead>
              <tr>
                {['Book', 'Chapters', 'What It Is', 'Key Scholarly Source'].map(h => (
                  <th
                    key={h}
                    className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide sticky top-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {UNIQUE_BOOKS.map(book => (
                <tr key={book.name} className="hover:bg-accent/[0.03]">
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top border-l-[3px] border-l-lxx">
                    <strong>{book.name}</strong>
                    {book.geez && (
                      <>
                        <br />
                        <span className="font-[var(--font-geez)] text-geez">{book.geez}</span>
                      </>
                    )}
                  </td>
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top">{book.chapters}</td>
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top">{book.description}</td>
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top">
                    <Html html={book.source} />
                    <Cites ids={book.cites} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meqabyan warning */}
        <div className="bg-surface border-l-[3px] border-mt pl-4 pr-4 py-3.5 rounded-r-md my-4 mb-5 text-[0.9rem]">
          <strong className="text-mt">The Meqabyan are NOT the Maccabees.</strong>{' '}
          This is the most common misconception. The Ethiopian books called "Maccabees"
          share <em>only a name</em> with the Western books. Different characters, different
          language of composition (Ge'ez vs. Hebrew/Greek), different era (post-14th c. vs.
          2nd c. BCE), no connection to the Hasmonean revolt whatsoever.<Cite n="5" />
        </div>

        {/* Expandable full OT comparison */}
        <details
          open={otTableOpen}
          onToggle={e => setOtTableOpen((e.target as HTMLDetailsElement).open)}
          className="bg-surface rounded-lg my-3 border border-border"
        >
          <summary className="px-4 py-3 cursor-pointer font-medium text-geez text-[0.92rem] list-none flex items-center gap-2 select-none">
            <span className={`text-accent text-[0.8rem] transition-transform ${otTableOpen ? 'rotate-90' : ''}`}>
              &#9656;
            </span>
            Full Old Testament comparison table
          </summary>
          <div className="px-4 pb-4">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-[0.88rem] min-w-[600px]">
                <thead>
                  <tr>
                    {['Book', 'Protestant', 'Catholic', 'Ethiopian', 'Notes'].map(h => (
                      <th
                        key={h}
                        className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide sticky top-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OT_COMPARISON.map(row => (
                    <tr
                      key={row.book}
                      className={`hover:bg-accent/[0.03] ${row.kind === 'unique' ? '' : ''}`}
                    >
                      <td
                        className={`px-3 py-2 border-b border-white/[0.04] align-top ${
                          row.kind === 'unique'
                            ? 'border-l-[3px] border-l-lxx font-bold'
                            : row.kind === 'deut'
                              ? 'border-l-[3px] border-l-[#6ba3c7]'
                              : ''
                        }`}
                      >
                        {row.book}
                      </td>
                      <CanonCell text={row.protestant} kind={row.kind} />
                      <CanonCell text={row.catholic} kind={row.kind} />
                      <CanonCell text={row.ethiopian} kind={row.kind} />
                      <td className="px-3 py-2 border-b border-white/[0.04] align-top text-text-muted">
                        {row.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        {/* Why it matters callout */}
        <div className="bg-surface border-l-[3px] border-lxx pl-4 pr-4 py-3.5 rounded-r-md my-4 text-[0.9rem]">
          <strong className="text-accent">Why does this matter?</strong>{' '}
          The Ethiopian canon was formed early (4th-7th century CE), before the narrowing
          movements that reduced the Western canon. The complete texts of 1 Enoch and
          Jubilees &mdash; which profoundly shaped Second Temple Judaism and early
          Christianity &mdash; survive only because Ethiopian monks copied them by hand
          for over 1,500 years while the rest of the world forgot them.<Cite n="3" />
        </div>
      </section>

      {/* ================================================================ */}
      {/* LAYER 2: THE STRUCTURE                                          */}
      {/* ================================================================ */}
      <section id="layer-2" className="mb-14 scroll-mt-[calc(52px+60px)]">
        <div className="text-[0.8rem] uppercase tracking-widest text-text-muted mb-1">Layer II</div>
        <h2 className="text-xl text-accent font-semibold mb-1 pt-2">
          The Structure &mdash; How Books Are Organized
        </h2>

        <p className="mb-3.5 text-[0.95rem]">
          Even when the Ethiopian and Western Bibles contain the "same" books,
          those books are sometimes structured, divided, or combined differently.
        </p>

        {/* Structural differences table */}
        <div className="overflow-x-auto my-4 mb-5 rounded-lg border border-border">
          <table className="w-full border-collapse text-[0.88rem] min-w-[500px]">
            <thead>
              <tr>
                {['Feature', 'Protestant', 'Ethiopian'].map(h => (
                  <th
                    key={h}
                    className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide sticky top-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STRUCTURAL_DIFFS.map(d => (
                <tr key={d.feature} className="hover:bg-accent/[0.03]">
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top font-semibold">
                    {d.feature}
                  </td>
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top">{d.protestant}</td>
                  <td className="px-3 py-2 border-b border-white/[0.04] align-top">
                    <Html html={d.ethiopian} />
                    <Cites ids={d.cites} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expandable psalm numbering table */}
        <details
          open={psalmTableOpen}
          onToggle={e => setPsalmTableOpen((e.target as HTMLDetailsElement).open)}
          className="bg-surface rounded-lg my-3 border border-border"
        >
          <summary className="px-4 py-3 cursor-pointer font-medium text-geez text-[0.92rem] list-none flex items-center gap-2 select-none">
            <span className={`text-accent text-[0.8rem] transition-transform ${psalmTableOpen ? 'rotate-90' : ''}`}>
              &#9656;
            </span>
            Psalm numbering comparison
          </summary>
          <div className="px-4 pb-4 text-[0.9rem]">
            <p className="mb-3">
              Because the Septuagint merges and splits several psalms differently, the numbering diverges for most of the Psalter:
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead>
                  <tr>
                    <th className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide">
                      Masoretic / Protestant
                    </th>
                    <th className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide">
                      Septuagint / Ethiopian
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PSALM_NUMBERING.map((row, i) => (
                    <tr key={i} className="hover:bg-accent/[0.03]">
                      <td className="px-3 py-2 border-b border-white/[0.04]">{row.masoretic}</td>
                      <td className={`px-3 py-2 border-b border-white/[0.04] ${row.lxx === 'Psalm 151' ? 'font-bold' : ''}`}>
                        {row.lxx}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[0.82rem] text-text-muted italic mt-2 pl-3 border-l-2 border-border">
              Jobes and Silva, <em>Invitation to the Septuagint</em>, 2nd ed. (Baker Academic, 2015), 149-150.
            </div>
          </div>
        </details>
      </section>

      {/* ================================================================ */}
      {/* LAYER 3: THE TEXT                                                */}
      {/* ================================================================ */}
      <section id="layer-3" className="mb-14 scroll-mt-[calc(52px+60px)]">
        <div className="text-[0.8rem] uppercase tracking-widest text-text-muted mb-1">Layer III</div>
        <h2 className="text-xl text-accent font-semibold mb-1 pt-2">
          The Text &mdash; When the Same Book Says Different Things
        </h2>

        <p className="mb-3.5 text-[0.95rem]">
          This is the deepest and least-discussed layer. The Ethiopian Old Testament
          was translated from the <strong>Septuagint</strong> (the Greek translation,
          3rd c. BCE).<Cite n="12" /> Protestant Bibles are translated from the{' '}
          <strong>Masoretic Text</strong> (the Hebrew text standardized 7th-10th c. CE).<Cite n="13" />{' '}
          These two traditions diverge in hundreds of places.
        </p>

        {/* DSS callout */}
        <div className="bg-surface border-l-[3px] border-accent pl-4 pr-4 py-3.5 rounded-r-md my-4 mb-5 text-[0.9rem]">
          <strong className="text-accent">The Dead Sea Scrolls changed everything.</strong>{' '}
          Discovered 1947-1956, these manuscripts predate both the Masoretic standardization
          and most LXX manuscripts. In many cases where the LXX and MT disagree, the
          Scrolls side with the LXX &mdash; proving that the Septuagint readings were
          genuinely ancient Hebrew readings, not Greek inventions.<Cite n="14" />
        </div>

        {/* Variant cards */}
        {TEXTUAL_VARIANTS.map(v => (
          <VariantCard key={v.id} v={v} />
        ))}

        {/* DSS Scorecard */}
        <h3 className="text-[1.05rem] text-geez font-semibold mt-7 mb-2.5">
          When the Dead Sea Scrolls Adjudicate
        </h3>

        <div className="overflow-x-auto my-4 mb-5 rounded-lg border border-border">
          <table className="w-full border-collapse text-[0.88rem] min-w-[400px]">
            <thead>
              <tr>
                <th className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide sticky top-0">
                  Passage
                </th>
                <th className="bg-surface-raised text-accent font-semibold text-left px-3 py-2.5 border-b border-border-strong text-[0.82rem] uppercase tracking-wide sticky top-0">
                  Dead Sea Scrolls Support
                </th>
              </tr>
            </thead>
            <tbody>
              {DSS_SCORECARD.map(row => (
                <ScorecardRow key={row.passage} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-3.5 text-[0.95rem]">
          In five of seven cases where the Dead Sea Scrolls can adjudicate between
          the Masoretic Text and the Septuagint, they support the LXX/Ethiopian
          reading. This does not mean the LXX is always "right" &mdash; textual
          criticism evaluates each variant on its merits. But it demonstrates that
          the Ethiopian tradition preserves ancient readings that were present in
          pre-Christian Judaism and subsequently lost from the Hebrew tradition
          that Protestant Bibles are based on.<Cite n="14" />
        </p>

        {/* Pattern synthesis callout */}
        <div className="bg-surface border-l-[3px] border-lxx pl-4 pr-4 py-3.5 rounded-r-md my-4 text-[0.9rem]">
          <strong className="text-accent">The pattern that emerges:</strong>{' '}
          The New Testament authors &mdash; Matthew, Luke, the author of Hebrews, Jude &mdash; were
          reading an Old Testament closer to the Ethiopian/LXX tradition than to the Masoretic Text
          that modern Protestant Bibles are translated from. Luke's genealogy uses the LXX's Cainan.
          Matthew's virgin birth argument depends on the LXX's <em>parthenos</em>. Hebrews quotes an
          expanded Deuteronomy 32:43 that exists in the LXX but not the MT. Jude quotes 1 Enoch by name.
          The Ethiopian Bible preserves the Old Testament that the New Testament authors were
          actually reading.
        </div>
      </section>

      {/* ================================================================ */}
      {/* WHAT THIS MEANS                                                  */}
      {/* ================================================================ */}
      <section className="mb-14">
        <h2 className="text-xl text-accent font-semibold mb-1 pt-2">What This Means</h2>

        <h3 className="text-[1.05rem] text-geez font-semibold mt-7 mb-2.5">
          For Pastors and Teachers
        </h3>
        <p className="mb-3.5 text-[0.95rem]">
          If you preach from a Protestant Bible (NIV, ESV, NKJV), here is what your
          Ethiopian Orthodox congregants' Bible looks like by comparison:
        </p>
        <ol className="pl-5 mb-4 text-[0.95rem] list-decimal">
          <li className="mb-2">
            <strong>Their Bible has 15+ more books than yours</strong>, including 1 Enoch
            (quoted in Jude), Jubilees, and three Meqabyan books that are entirely
            different from the Catholic Maccabees.
          </li>
          <li className="mb-2">
            <strong>Books you share are organized differently</strong> &mdash; Proverbs
            is two books, Jeremiah absorbs Baruch and Lamentations, Psalms has 151
            psalms with different numbering throughout.
          </li>
          <li className="mb-2">
            <strong>Even shared books have different text</strong> because the Ethiopian
            OT descends from the Septuagint while yours descends from the Masoretic
            Hebrew. Jeremiah is 12.5% shorter with chapters reordered. Genesis
            chronologies differ by nearly 1,400 years. Goliath is three feet
            shorter. Job's epilogue explicitly affirms resurrection.
          </li>
        </ol>

        <h3 className="text-[1.05rem] text-geez font-semibold mt-7 mb-2.5">
          For the Church Universal
        </h3>
        <p className="mb-3.5 text-[0.95rem]">
          The Ethiopian Bible is not a "corrupted" or "expanded" Protestant Bible.
          It is an independent and extremely ancient textual tradition that made
          different &mdash; and in many cases <em>earlier</em> &mdash; canonical
          and textual choices.
        </p>
        <p className="mb-3.5 text-[0.95rem]">
          The Ge'ez manuscripts in Ethiopian monasteries &mdash; many never digitized,
          some never cataloged &mdash; represent one of the most important untapped
          resources for biblical scholarship in the world.<Cite n="23" />
        </p>
      </section>

      {/* ================================================================ */}
      {/* BIBLIOGRAPHY                                                     */}
      {/* ================================================================ */}
      <section id="bibliography" className="mt-12 pt-6 border-t border-border">
        <h2 className="text-xl text-accent font-semibold mb-4">Bibliography & Sources</h2>
        <p className="text-[0.85rem] text-text-muted mb-5">
          Every numbered citation above refers to one or more of these published works.
          Items marked with a link are freely accessible online.
        </p>

        {bibCategories.map(group => (
          <div key={group.cat}>
            <h4 className="text-[0.85rem] text-text-muted uppercase tracking-wide mt-5 mb-2">
              {group.cat}
            </h4>
            {group.entries.map(entry => (
              <p
                key={entry.id}
                id={entry.id}
                className="text-[0.85rem] text-text mb-2 pl-6 indent-[-24px] scroll-mt-[120px]"
              >
                <Html html={entry.text} />{' '}
                {entry.url && (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent no-underline hover:underline"
                  >
                    {new URL(entry.url).hostname.replace('www.', '')}
                  </a>
                )}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* ---- Footer ---- */}
      <footer className="mt-12 pt-6 pb-8 border-t border-border text-center text-[0.8rem] text-text-muted">
        <p>
          Ge'ez source texts from{' '}
          <a
            href="https://betamasaheft.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent no-underline hover:underline"
          >
            Beta Masaheft
          </a>{' '}
          (Universitat Hamburg), licensed CC BY-SA 4.0.
        </p>
        <p className="mt-2">
          <Link to="/" className="text-accent no-underline hover:underline">
            &larr; Read the Ethiopian Bible
          </Link>
        </p>
      </footer>
    </div>
  )
}
