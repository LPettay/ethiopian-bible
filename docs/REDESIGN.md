# Educational Redesign Spec — Ethiopian Bible

Status: proposed. Branch: `feat/educational-redesign` (caller commits).
Scope: MODERATE, reversible. De-hype + add embedded teaching. Preserve the warm
"manuscript" aesthetic and every working feature. When unsure, lighter touch.

---

## North Star

An **educational, self-exploratory** biblical tool that **teaches through use** —
honest, sourced, calm.

Design principle: **embedded + on-demand depth**. The reading layout, consistent
provenance labels, and quiet expandable sourced notes do the teaching.
Understanding emerges from reading and exploring, not from marketing copy.

Rules this spec enforces everywhere:

- **One calm orientation line max** per screen header. No second sell-line.
- **Show, don't sell.** Remove hooks, punchlines, and CTAs phrased as promises
  ("change how you read the Bible", "discover the differences", "verses like
  this", "See 4 more").
- **Every claim traces to a real source.** Honest absence beats a guess. The one
  false claim currently shipping (DSS + Luke agree with Adam = 230) is removed.
- **Reversible.** Changes are copy + small structural edits inside existing
  components. No new runtime deps. No data-model changes required (one optional
  additive field on the variant map, below). Theme tokens unchanged.

---

## What is wrong today (the hype to remove)

Grounded in the current files:

- `WelcomePage.tsx` — "The Hook" hero, "Now read it here:", **"Same book. Same
  verse. One hundred years apart."** punchline, the **false** line "The Dead Sea
  Scrolls and the Gospel of Luke agree with the longer number." (verified FALSE /
  OVERSTATED), and the CTA **"See 4 more verses like this →"**. Door cards sell:
  "Discover the Differences / 5 verses that change how you read your Bible."
- `DiscoverPage.tsx` — titled **"Five Verses That Change How You Read the
  Bible"**, each `Stop` carries a `hook` field of punchy ad copy ("it's not a
  typo", "Three ancient witnesses against one."), and Stop 1's `witness` repeats
  the conflated Luke/Adam claim ("Luke used the longer timeline.").
- `AboutPage.tsx` — "the rest of the world forgot them" (verified OVERSTATED);
  bold sell line "You don't have to trust us."
- `ComparePage.tsx` — generally strong and cited, but inherits "the rest of the
  world forgot them", "The Dead Sea Scrolls changed everything", and the Genesis
  variant card's `dss` field frames Luke 3:36 under a Genesis-5 chronology claim.

These are the only edits. Tables, citations, observer logic, settings, reader
modes, sharing, annotations, bookmarks — all untouched.

---

## Provenance Label Spec (single source of truth)

The reader already has the right hook: `verseView.helpers.ts#readModeSource`
builds a label from `TranslationSource {name, year, tradition}` and falls back to
`DEFAULT_SOURCE_LABELS`. The redesign **standardizes the exact strings** and uses
them **consistently** in every place a text source is named (Reader study/read/
compare blocks, Welcome sample, Discover columns, Compare column headers).

### Canonical labels — format `Tradition — Edition (year)`

| Source key | Canonical label (full) | Short label (tight columns) | Where defined |
|---|---|---|---|
| `lxx` | `Septuagint — Brenton (1851)` | `Septuagint` | `DEFAULT_SOURCE_LABELS.lxx` |
| `kjv` | `Masoretic — King James (1611)` | `King James` | `DEFAULT_SOURCE_LABELS.kjv` |
| `geez` | `Ge'ez — Beta Masaheft` | `Ge'ez` | reader Ge'ez line |
| `ai` | `AI draft — unverified` | `AI draft` | unchanged, keep ConfidenceBadge |

Notes on wording (all verifiable):

- "Septuagint — Brenton (1851)": Brenton's 1851 English translation is from Codex
  Vaticanus (the "Vatican text"); public domain. We label it by tradition
  (Septuagint) + edition (Brenton 1851), never as "the Septuagint" bare.
- "Masoretic — King James (1611)": the KJV OT renders the Masoretic Hebrew. We say
  "Masoretic" (the tradition) rather than "Protestant" as a value-neutral textual
  term. Keep KJV's traditional date 1611.
- "Ge'ez — Beta Masaheft": Ge'ez texts come from Beta Masaheft (Universität
  Hamburg), CC BY-SA 4.0. No year (it is a living digital edition).
- Do NOT relabel `lxx`/`kjv` as "Septuagint / Ethiopian" or "Masoretic /
  Protestant" anywhere in the reader. Those compound church-affiliation labels are
  acceptable only on the Compare page's explanatory comparison tables, where the
  surrounding prose defines them; the reader uses the neutral tradition+edition
  labels above.

### Implementation

1. In `verseView.helpers.ts`, update `DEFAULT_SOURCE_LABELS`:

   ```ts
   const DEFAULT_SOURCE_LABELS: Record<'lxx' | 'kjv', string> = {
     lxx: 'Septuagint — Brenton (1851)',
     kjv: 'Masoretic — King James (1611)',
   }
   ```

   And the composed label string already produces `name year (tradition)`. To match
   the canonical `Tradition — Edition (year)` form when chapter metadata IS present,
   change the composition to:

   ```ts
   const label = src
     ? `${src.tradition} — ${src.name} (${src.year})`
     : DEFAULT_SOURCE_LABELS[key]
   ```

   (Reversible: one-line change; falls back identically when `src` is absent.)

2. In `VerseView.tsx`, the study/compare inline tags currently read bare
   "Septuagint" / "King James". Keep the **short** labels there (space is tight,
   color already disambiguates via `text-lxx` / `text-mt`), but ensure read-mode
   uses the full canonical label via `readModeSource` (already wired). No visual
   change beyond the corrected strings.

3. Add a tiny **provenance legend** at the top of a chapter (one calm line, only
   when dual sources exist) so first-time readers learn the labels by seeing them
   once. Placed in the reader's chapter header (the page that renders `VerseView`),
   not in `VerseView` itself. Copy:

   > `Two textual traditions are shown side by side: Septuagint — Brenton (1851)
   > and Masoretic — King James (1611). Ge'ez is from Beta Masaheft.`

   (If the chapter is single-source, e.g. 1 Enoch, show only the relevant label.)

---

## On-Demand Note Model (quiet marker → short sourced note)

The app already has the right primitive: `VariantIndicator.tsx` renders a small
diamond next to a verse number and, on hover/focus/click, shows a `role="tooltip"`
with `variant.description`. Today that description is a bare one-liner
(`variantIndicator.helpers.ts`). The redesign makes the marker **quiet and
consistent** and lets it expand a **short, sourced** note drawn only from the
verified citations.

### Behavior (unchanged interaction model; richer, sourced content)

- The diamond stays the same size, same `text-accent`, same a11y
  (`aria-label="Textual variant. Show details."`, `aria-expanded`,
  `aria-describedby`). It is **never broadcast** — no auto-open, no animation, no
  count badge, no "NEW". A reader who never hovers reads an unmarked, calm text.
- On expand, the panel shows three calm parts, in this order:
  1. **What differs** — one neutral sentence (the reading on each side).
  2. **Witnesses** — who attests each reading (MT / LXX / DSS siglum / NT echo),
     stated only where verified. No "X against one" scorekeeping.
  3. **Source** — a short citation string + a "More on the Compare page →" link
     to the matching anchor.
- Tone: descriptive, not persuasive. No "Why this matters" framing in the
  on-demand note (that interpretive layer stays on the Compare page, where it is
  cited and contextualized).

### Data shape (additive, optional — reversible)

Extend `VariantInfo` in `variantIndicator.helpers.ts` with optional fields. Old
entries keep working (only `description` is required); the tooltip renders the
richer note when present, otherwise the existing one-liner.

```ts
export interface VariantInfo {
  description: string            // existing one-liner; used as the "what differs" line
  witnesses?: string             // e.g. "MT: 130 · LXX (Codex Alexandrinus): 230 · Samaritan Pentateuch: 130"
  source?: string                // short citation, e.g. "Brenton LXX 1851; biblearchaeology.org (Smith 2018)"
  compareAnchor?: string         // e.g. "#layer-3" or a future per-variant id
}
```

The tooltip element grows from a single centered line to a small left-aligned
stack: `What differs` line, a muted `Witnesses` line, and a muted `Source` line
with the Compare link. Keep the existing width clamp
(`w-56 max-w-[calc(100vw-2rem)]`) but allow `text-left` and slightly taller; keep
`pointer-events-none` off the link only (so the Compare link is clickable — make
the panel `pointer-events-auto` and keep it open on hover of the panel).

### Verified note content for the existing markers

These replace/extend the bare `KNOWN_VARIANTS` strings. Every line below traces to
the verified research. **The Genesis 5 note is corrected** to remove the false
DSS/Luke claim.

- **`Gen:5:3`** (and the sibling Gen 5 / 11 entries follow the same pattern)
  - description (what differs): `Adam's age at Seth's birth: Masoretic 130, Septuagint 230.`
  - witnesses: `MT: 130 · Septuagint (Codex Alexandrinus): 230 · Samaritan Pentateuch: 130.`
  - source: `Brenton LXX (1851); Genesis 5 & 11 research, biblearchaeology.org.`
  - note body (calm, no hook):
    > These numbers differ across ancient manuscript traditions. The longer
    > Septuagint figures are preserved in Codex Alexandrinus and attested by
    > Josephus. The Dead Sea Scrolls provide no direct evidence for the Genesis 5
    > numbers. (The Luke 3:36 "Cainan" relates to Genesis 11, a separate question.)
  - **Removed:** any claim that "DSS and Luke agree with 230."
- **`1Sam:17:4`**
  - description: `Goliath's height: Masoretic "six cubits and a span" (~9'9"); Septuagint "four cubits and a span" (~6'9").`
  - witnesses: `Shorter reading attested by Septuagint, 4QSamᵃ (Dead Sea Scrolls, ~100 BCE), and Josephus (Antiquities 6.171).`
  - source: `Tov, Textual Criticism of the Hebrew Bible (3rd ed.), 342.`
- **`Deut:32:8`**
  - description: `Masoretic "sons of Israel"; Septuagint "angels of God"; 4QDeutʲ "sons of God."`
  - witnesses: `Dead Sea Scrolls (4QDeutʲ) read "sons of God"; the ESV main text follows this reading.`
  - source: `Heiser, "Deuteronomy 32:8 and the Sons of God," Bibliotheca Sacra 158 (2001).`
- **`Isa:7:14`**
  - description: `Masoretic "almah" (young woman); Septuagint "parthenos" (virgin).`
  - witnesses: `Matthew 1:23 quotes the Septuagint's "parthenos."`
  - source: `Jobes & Silva, Invitation to the Septuagint (2nd ed.), 189–191.`
- The remaining Gen 5/11 entries (`Gen:5:6`, `:5:9`, `:5:12`, `:5:15`, `:5:21`,
  `Gen:11:12`, `Gen:11:13`) keep their existing one-liners; only Gen:5:3 carries
  the full corrected note (others can adopt the richer shape later — additive,
  not required for this pass).

---

## Per-screen changes

### 1. Welcome (`src/pages/WelcomePage.tsx`)

**Goal:** stop selling; let one real sample verse teach the idea (two traditions,
labeled, sourced), then offer plain doors. Keep the cross icon, the manuscript
card styling, the Ge'ez glow, and the footer attribution.

Changes:

- **Hero.** Keep the icon. Replace the italic tagline so it is one calm
  orientation line, factual not superlative.
  - h1 (unchanged): `The Ethiopian Bible`
  - tagline replace
    - from: `The oldest and most complete biblical canon in Christianity.`
    - to: `A reader for the Ethiopian biblical canon, with sources shown.`
- **Sample card.** Keep the layout (Ge'ez line + two labeled readings) — it is
  the embedded teaching. Re-label and de-hype.
  - intro line replace
    - from: `Open your Bible to Genesis 5:3. Now read it here:`
    - to: `Genesis 5:3, in two textual traditions:`
  - left column label: `Septuagint — Brenton (1851)` (was "Septuagint (3rd c. BCE)")
  - right column label: `Masoretic — King James (1611)` (was "King James (Masoretic)")
  - **Remove the punchline block entirely** (the "Same book. Same verse. One
    hundred years apart." + the FALSE "The Dead Sea Scrolls and the Gospel of Luke
    agree with the longer number." lines). Replace with one neutral, sourced
    caption + a quiet inline note marker mirroring the reader's on-demand model:
    > `The two traditions differ here by one hundred years. Manuscript traditions
    > vary; the longer Septuagint figure is preserved in Codex Alexandrinus.`
    Keep the keyword "two hundred and thirty" / "an hundred and thirty" bolds.
  - **Remove the CTA** `See 4 more verses like this →`. Replace with a plain link:
    `Read Genesis 5 →` (to `/read/Gen/5`). The Explore page is reachable from the
    doors below; we don't tease a count.
- **Doors** (`DoorCard`s). Keep five cards, manuscript styling, the accent door.
  Rewrite titles/descriptions to be plain and descriptive (no "Discover the
  Differences", no "5 verses that change how you read your Bible"):

  | to | title | desc |
  |---|---|---|
  | `/discover` (accent) | `Explore the differences` | `A short, sourced walk through verses where the traditions diverge.` |
  | `/reading-paths` | `Reading paths` | `Curated routes through the canon — narrative arcs and parallels.` |
  | `/bible` | `Open the Bible` | `All 36 books, by section. Tap a book to start reading.` |
  | `/read/Gen/1` | `Start at Genesis` | `Genesis 1, with Septuagint and King James side by side.` |
  | `/compare` | `Comparison & sources` | `Documented variants with full citations you can check.` |

  (Rename the accent route's user-facing word from "Discover" to "Explore"
  throughout copy; the route path `/discover` stays for reversibility — no router
  change needed.)
- **Footer.** Keep as-is; it is already calm and correctly attributed.

### 2. Reader (`src/components/VerseView.tsx` + chapter header)

**Goal:** the reading layout itself teaches. Most edits are the provenance labels
(above) and wiring the on-demand note; the reader is otherwise excellent and stays.

Changes:

- Apply the **Provenance Label Spec**: study/compare inline tags keep short labels
  (`Septuagint`, `King James`), read-mode uses the full canonical label via the
  corrected `readModeSource`. AI line stays `AI draft` with its ConfidenceBadge.
- Wire the **On-Demand Note Model** into `VariantIndicator` (richer sourced tooltip
  from `KNOWN_VARIANTS`). No change to where the marker appears or how it opens.
- Add the one-line **provenance legend** to the chapter header (the component that
  maps verses to `VerseView`), shown once per chapter when dual sources exist.
  Copy is in the Provenance section above. This is the only new copy in the reader
  and it is orientation, not sell.
- The `AllHiddenHint` ("All translations hidden — enable one in Settings") stays —
  it is honest and helpful.

No changes to reading modes, fonts, sizes, bookmarks, share, or annotation.

### 3. Discover → Explore (`src/pages/DiscoverPage.tsx`)

**Goal:** keep the scroll-through structure (it IS self-exploratory), strip the
ad voice, and present each stop as a neutral, sourced observation. Rename the
user-facing concept from "Discover" to "Explore". Keep the intersection observer,
progress dots, deep-link handling, and the divider/cross styling.

Changes:

- **Page hero.**
  - h1 replace
    - from: `Five Verses That Change<br />How You Read the Bible`
    - to: `Where the traditions diverge`
  - subline replace (one calm line)
    - from: `A guided journey through the differences that matter most.`
    - to: `Five places where the Septuagint and Masoretic traditions read differently — each with its sources.`
  - "Begin" button: keep, relabel arrow text to `Start` (optional; "Begin" is
    acceptable and calm — lighter touch: leave it).
- **`Stop` interface + data.** Remove the `hook` field from rendering. Either drop
  `hook` from the type and data, or (lighter touch) keep the field but stop
  rendering it and delete its ad-copy values. The `question` becomes a plain
  descriptive heading; `reference` stays; `body` stays (already mostly neutral but
  trim superlatives); `witness` becomes the sourced note; `mt`/`lxx` labels adopt
  the provenance spec on the comparison columns.
  - Stop heading guidance: turn rhetorical questions into plain topics.
    - `How old was Adam?` → `Adam's age at Seth's birth (Genesis 5:3)`
    - `How tall was Goliath?` → `Goliath's height (1 Samuel 17:4)`
    - `Sons of God or Sons of Israel?` → `"Sons of God" vs. "sons of Israel" (Deuteronomy 32:8)`
    - `The book that Jude quoted` → `Jude's quotation of 1 Enoch (Jude 14–15)`
    - `Which Bible did the Apostles read?` → `The New Testament's Old Testament`
- **Stop 1 (Genesis 5) — correctness fix.** Rewrite `witness` to remove the FALSE
  claim and the conflation. New `witness`:
  > `These numbers differ across manuscript traditions: Masoretic 130, Septuagint
  > 230 (preserved in Codex Alexandrinus), Samaritan Pentateuch 130. Josephus also
  > gives 230. The Dead Sea Scrolls preserve no Genesis 5 numbers. (Luke 3:36's
  > extra "Cainan" concerns Genesis 11, a separate question.)`
  Also trim the `body` line "it's not a typo" / "1,386 years longer" hype to:
  > `The difference is systematic — it runs through every patriarch in Genesis 5
  > and 11 — so the timeline from creation to Abraham differs by roughly 1,400
  > years depending on the tradition.`
- **Stop 2 (Goliath).** Drop hook. Keep `witness` but neutralize "Three ancient
  witnesses against one." →
  > `The shorter reading is attested by the Septuagint, the Dead Sea Scroll 4QSamᵃ
  > (~100 BCE), and Josephus (Antiquities 6.171).`
- **Stop 3 (Deut 32:8).** Drop hook ("scribes tried to erase"). Keep `witness`
  factual: 4QDeutʲ reads "sons of God"; ESV main text follows it. Replace the
  "suppressed in this passage by later scribes" body line with a softer, sourced
  framing:
  > `The Septuagint and 4QDeutʲ read "sons of God" / "angels of God"; the Masoretic
  > "sons of Israel" is widely understood by textual critics as a later
  > harmonization.`
- **Stop 4 (Jude / 1 Enoch).** Drop hook. Keep the verbatim Jude/Enoch parallel
  (verified accurate: Jude 14–15 quotes 1 Enoch 1:9). Neutralize the body line
  "108 chapters … for over 1,600 years" claim to align with verified wording:
  > `1 Enoch survives complete only in Ge'ez (Ethiopic); Greek and Aramaic
  > portions survive in fragments.` Keep the `readLink` to `/read/1En/1`.
- **Stop 5 (synthesis).** Keep — it is the legitimate, cited pattern. Trim the
  superlative "closer to the Ethiopian Bible than to the one on your shelf" hook.
  Keep the four cited NT examples (Matthew/parthenos, Luke/Cainan as a Genesis-11
  genealogy point, Hebrews/Deut 32:43, Jude/1 Enoch). State Luke's Cainan as a
  Genesis 11 genealogy difference, not Genesis 5 chronology.
- **Final CTAs.** Keep both buttons; relabel `See all differences` →
  `Comparison & sources`. Keep `Start reading`.
- **Progress dots / observer / deep links.** Unchanged.

### 4. About (`src/pages/AboutPage.tsx`)

**Goal:** keep its honest, sourced spine; remove the two overstatements and the
one sell line. This page is already close to the north star.

Changes:

- **Hero subline** replace (one calm line):
  - from: `An open, free, and verifiable resource for the Ethiopian biblical canon.`
  - to: `An open, sourced reader for the Ethiopian biblical canon.`
- **"Why This Exists" pull-quote** — fix the OVERSTATED "forgot them" framing:
  - from: `… preserved by Ethiopian monks who copied them by hand for over 1,500
    years while the rest of the world forgot them.`
  - to: `The Ethiopian canon was formed early (4th–7th century CE). The complete
    texts of 1 Enoch and Jubilees survive only in Ge'ez, preserved by the Ethiopian
    church through centuries of hand-copying; fragments were also known at Qumran
    and to early church writers.`
- **1 Enoch / Jubilees precision** (the "survive complete only in Ge'ez" line is
  accurate — keep it, but add the category clarification so no reader infers they
  are "Septuagint books"):
  - add a sentence to the second paragraph: `1 Enoch (originally Aramaic) and
    Jubilees (originally Hebrew) are Second Temple Jewish works, not part of the
    Septuagint; the Ethiopian church canonized them.`
- **"How We Verify" callout** — soften the sell:
  - from: `You don't have to trust us. Check the sources yourself.`
  - to: `Every claim links to its source. The full bibliography is on the comparison page.`
- **Data Sources list** — align to provenance labels: `Septuagint — Brenton
  (1851)`, `Masoretic — King James (1611)`, `Ge'ez — Beta Masaheft (CC BY-SA 4.0)`.
- **Credits** — keep; the editions are correct. Optionally note that 1 Enoch /
  Jubilees English is R.H. Charles (public domain), Ge'ez from Beta Masaheft.
- Everything else (sources lists, tech section, GitHub link) stays.

### 5. Compare (`src/pages/ComparePage.tsx`)

**Goal:** this is the rigorous, cited layer — keep it almost entirely. Only fix
the inherited overstatements and tighten the Genesis variant note so the page is
internally consistent with the corrected on-demand note.

Changes:

- **Hero subline** — keep factual; trim "oldest and largest" superlative pairing
  to one neutral line:
  - to: `A three-layer comparison of the Ethiopian canon with the Protestant and Catholic Bibles, with sources cited throughout.`
  - Keep the verify-box ("Every factual claim … cited … verify independently.") —
    it is the page's honest contract.
- **Layer I "Why does this matter?" callout** — fix the OVERSTATED "forgot them":
  - from: `… survive only because Ethiopian monks copied them by hand for over
    1,500 years while the rest of the world forgot them.`
  - to: `… survive complete only in Ge'ez, preserved by the Ethiopian church.
    Fragments were also known at Qumran and to early church writers.` (keep `Cite n="3"`)
- **Layer III DSS intro callout** — soften the hype headline, keep the cited
  substance:
  - from: `The Dead Sea Scrolls changed everything.`
  - to: `What the Dead Sea Scrolls added.` (body unchanged — it is accurate and
    cited at `[14]`.)
- **Genesis variant card `dss` field** (in `compare-data.ts`) — re-frame so Luke
  3:36 is presented as a **Genesis 11 genealogy** point, not evidence for the
  Genesis 5 age numbers, and acknowledge DSS silence:
  - to: `<strong>New Testament witness:</strong> Luke 3:36 includes "Cainan, son
    of Arphaxad," a name in the Septuagint genealogy of Genesis 11 but absent from
    the Masoretic Text — a separate matter from the Genesis 5 ages. The Dead Sea
    Scrolls preserve no Genesis 5 or 11 numbers; the longer figures are attested by
    Josephus and Pseudo-Philo.<a href="#n15" class="cite">[15]</a>`
  - The DSS_SCORECARD already marks Genesis 5 & 11 as "Debated / Mixed evidence" —
    keep that honest row as-is.
- Tables, bibliography, structure, Psalm numbering, Meqabyan warning — unchanged.

---

## Citations (sources backing every claim shown to users)

Only verified sources. Each maps to copy above.

1. Brenton, Sir Lancelot C.L., *The Septuagint with an English Translation* (1851),
   translated from Codex Vaticanus. Public domain. — provenance label for `lxx`.
2. Genesis 5 & 11 chronology: "From Adam to Abraham" and "Proposed original numbers
   in Genesis 5 and 11," Associates for Biblical Research (biblearchaeology.org);
   Smith, *Proc. 8th ICC* (2018). — Adam 130/230, Samaritan = 130, Josephus = 230,
   DSS preserve no Genesis 5 numbers. (Replaces the false "DSS + Luke agree" claim.)
3. Codex Alexandrinus (5th c.) is the primary Greek witness for Genesis 5;
   Vaticanus and Sinaiticus do not preserve that portion. (Wikipedia: Codex
   Vaticanus / Sinaiticus; Daily Dose of Septuagint: Codex Alexandrinus Genesis 5.)
4. Tov, E., *Textual Criticism of the Hebrew Bible*, 3rd ed. (Fortress, 2012), 342.
   — Goliath: LXX / 4QSamᵃ / Josephus *Antiquities* 6.171 read "four cubits and a span."
5. Heiser, M.S., "Deuteronomy 32:8 and the Sons of God," *Bibliotheca Sacra* 158
   (2001): 52–74. — 4QDeutʲ "sons of God"; ESV main text follows it.
6. Jobes, K.H. & Silva, M., *Invitation to the Septuagint*, 2nd ed. (Baker Academic,
   2015), 189–191. — Isaiah 7:14 *almah* / *parthenos*; Matthew 1:23 quotes the LXX.
7. Jude 14–15 quotes 1 Enoch 1:9 — the clearest NT citation of a non-canonical work.
   (intertextual.bible; Nickelsburg, *1 Enoch: A Commentary*, Hermeneia, 2001.)
8. 1 Enoch (originally Aramaic) and Jubilees (originally Hebrew) are Second Temple
   Jewish works that survive complete only in Ge'ez; they are absent from the major
   LXX codices (Vaticanus, Sinaiticus, Alexandrinus). Nickelsburg, *1 Enoch* (2001),
   9–14; VanderKam, *The Book of Jubilees* (2001), 1–21. — About/Compare precision.
9. Ethiopian Ge'ez OT is a daughter version translated from the Greek Septuagint
   (Aksumite period, 4th–6th c. CE). Ullendorff, *Ethiopia and the Bible* (Oxford,
   1968); Knibb, *Translating the Bible: The Ethiopic Version of the OT* (1999).
10. Luke 3:36's extra "Cainan" belongs to the Genesis 11 genealogy, not the Genesis
    5 ages; its status in early Luke manuscripts is debated. (Creation.com Cainan;
    Steinmann, *JETS* 60/4.) — Discover Stop 5 / Compare Genesis card framing.
11. Ge'ez source texts: Beta Masaheft (Universität Hamburg), CC BY-SA 4.0. — `geez`
    provenance label and footer attribution (already present).

---

## Out of scope / preserved

- Router paths (`/discover` etc.), reading modes, settings, bookmarks, share,
  annotations, word cards, lexicon, AI-draft pipeline and ConfidenceBadge.
- Theme tokens (`--color-accent`, `-lxx`, `-mt`, `-geez`, surfaces) — unchanged.
- Tables, bibliography, observer logic, progress dots, deep-link handling.

## Reversibility & tests

- All changes are copy + small additive code (one helper-string update, one
  optional `VariantInfo` field, one tooltip render expansion, one chapter-header
  line). Reverting copy restores the prior app exactly.
- No new runtime deps. React 19 + TS strict preserved.
- Keep vitest green (`npm test` → `vitest run`). Existing suites live in
  `/home/lance/Bible/tests/unit/`. If `KNOWN_VARIANTS` gains fields, add/extend a
  small data test asserting Gen:5:3 has `description` + `witnesses` + `source` and
  that no shown variant string contains the removed "Dead Sea Scrolls and the
  Gospel of Luke agree" phrasing. Honest absence beats a guess: if a witness is not
  verified, omit it rather than invent it.
