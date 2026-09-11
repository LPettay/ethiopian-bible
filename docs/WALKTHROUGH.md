# The Ethiopian Bible — Owner Walkthrough

A guided tour to confirm the finished app matches the vision. Follow the steps
in order; each one tells you exactly what to click and what to look for.

## The vision (one paragraph)

A free, English-accessible home for the oldest and most complete biblical canon
in Christianity — the 81-book Ethiopian Orthodox Tewahedo canon. It should feel
**scholarly** (every factual claim cited to a published source; honest absence
over a confident guess), **clean** (a quiet, reverent reading surface with no
clutter), **intuitive** (a first-time visitor can find a verse, compare
traditions, and follow a curated path without instruction), and
**source-traceable** (Ge'ez from Beta Masaheft, English from Brenton's
Septuagint and the KJV, with edition attribution shown inline and a bibliography
you can verify independently).

## Start here

Open **http://localhost:3300/ethiopian-bible/** in a desktop browser. The header
bar (home cross, "Select a book...", search, paths, compare, bookmarks,
settings, help) is present on every screen below.

---

## The click-through

### 1. Welcome — the hook
**Route:** `/` (the start URL)
**Do:** Read the hero, then the "Open your Bible to Genesis 5:3" comparison card
(Ge'ez line + Septuagint vs. King James, "two hundred and thirty years" vs. "an
hundred and thirty years"). Scroll to the five door cards. Note the footer
source line.
**Notice (source-traceable):** The footer already names the sources — Beta
Masaheft (CC BY-SA 4.0), Brenton 1851, KJV 1611 — and links the About page and
the GitHub repo. The hook teaches the whole thesis in one verse before asking
for anything.

### 2. Discover — five verses that change how you read
**Route:** `/discover` (click "See 4 more verses like this" or the "Discover the
Differences" door)
**Do:** Click **Begin**, then scroll through all five stops (Adam's age,
Goliath's height, "sons of God" vs. "sons of Israel," Jude quoting 1 Enoch, and
the synthesis). Use the progress dots pinned at the bottom to jump between
stops. On stop 4, click **"Read 1 Enoch, Chapter 1."** On the final stop, try
**Start reading** and **See all differences.**
**Notice (scholarly):** Each stop pairs Masoretic vs. Septuagint/Ethiopian
readings and carries a "witness" note grounding the claim in a real manuscript
(e.g. 4QSamᵃ, Josephus, 4QDeutʲ). It argues from evidence, not assertion.

### 3. Bible catalog — the whole canon, organized
**Route:** `/bible` (the "Open the Bible" door)
**Do:** Scan the three sections: **Unique to the Ethiopian Canon**,
**Deuterocanonical Books**, **Shared with Western Bibles.** Read the italic
section blurbs and the colored-dot legend (LXX + KJV / English / Ge'ez only).
Find the four placeholder books in "Unique to Ethiopia" — **Lefafa Sedq,
Testament of Our Lord, Teaching of Mysteries, Sinodos** — each wearing an amber
**"Placeholder — not yet transcribed"** pill instead of a chapter count. Then
click a real book (e.g. **Genesis**) to open its chapter grid, and click a
chapter number.
**Notice (clean + scholarly honesty):** "36 books · 1,076 chapters" up top; each
section blurb has a "Learn more" link into About. The amber pills are
deliberately unmistakable — a placeholder is never dressed up to look like real
scripture. Tapping targets are a comfortable 44px.

### 4. Reader — Study mode (the default)
**Route:** `/read/Gen/1` (from the Genesis chapter grid, or the Welcome "Start
with Genesis" door)
**Do:** Read a few verses. Each verse shows a row of Ge'ez **word cards** above
the translation lines (Septuagint and King James, each with an italic edition
label). Hover a verse to reveal the share and annotate actions; tap the verse
number to bookmark it. Use the Previous/Next chapter nav at the bottom, or the
arrows in the header.
**Notice (source-traceable + clean):** Every translation line is labeled with
its tradition ("Septuagint," "King James") so you always know which textual
witness you're reading. The page is calm — one column, generous spacing, a
loading shimmer instead of a blank flash.

### 5. Reader — Read and Compare modes
**Route:** stay on `/read/Gen/1`; open the **gear (Settings)** in the header
**Do:** Switch **Reading Mode** to **Read** (clean single English text, still
edition-attributed). Then switch to **Compare** (Septuagint and King James
side-by-side). Toggle the **Translation Sources** checkboxes off one at a time —
including turning *both* LXX and KJV off.
**Notice (clean + integrity):** A verse is **never blank.** With all sources
hidden you get a muted hint ("All translations hidden — enable one in
Settings"), and single-source books (like 1 Enoch) fall back to their best
available text rather than rendering an empty line. The AI-draft toggle is shown
disabled ("not yet available") so it never advertises a capability that has no
data.

### 6. The word modal — honest gloss handling
**Route:** in **Study** mode on any real Ge'ez chapter (e.g. `/read/Gen/1`)
**Do:** Tap any Ge'ez **word card.** A modal opens with the large Ge'ez form and
(if enabled) its transliteration.
**Notice (scholarly integrity — the load-bearing one):** Where no sourced
meaning exists, the modal says plainly **"Meaning not yet available"** and offers
a **"Look up in Dillmann ↗"** link to the Beta Masaheft *Lexicon Linguae
Aethiopicae*. When a gloss *is* present it is always shown with an explicit
**"Source:"** line. The app never invents a definition — honest absence with a
path to a real source beats a fabricated guess.

### 7. Reading Paths — curated journeys
**Route:** `/reading-paths` (the paths icon in the header, or the "Guided
Reading Paths" door)
**Do:** Browse the seven curated paths — **The Full Story, Genesis & Jubilees
Side by Side, The Watchers, The Wisdom Journey, 1 Enoch Complete, The Kebra
Nagast, Unique to Ethiopia.** Expand a path's sections; click an entry to jump
straight into the reader; note the italic "margin gloss" parallelism notes that
have no link.
**Notice (intuitive + scholarly):** Each path is a real editorial argument
(e.g. four Genesis verses about the Watchers expanding into a full 1 Enoch
mythology), not a flat book list — and every readable entry is one click from
the text.

### 8. Help — keyboard shortcuts
**Route:** any screen; click the **"?"** icon in the header (or press `?`)
**Do:** Review the shortcut table: `/` or `Ctrl+K` search, `←`/`→` chapter
navigation, `b` bookmark current verse, `?` help, `Esc` close any panel.
**Notice (intuitive):** Power-user navigation is documented in one place, and
the modal notes that shortcuts are ignored while typing in a field.

### 9. Bookmarks
**Route:** `/bookmarks` (the bookmark icon in the header)
**Do:** If you bookmarked a verse in step 4, it appears here with its reference
and date. Click the reference to jump back to that exact verse; hover to reveal
the remove (×) action. If empty, you'll see the "No Bookmarks — tap a verse
number while reading" empty state.
**Notice (clean):** Bookmarks persist locally (no account needed) and round-trip
you back to the precise verse via `/read/:book/:chapter/:verse`.

### 10. Compare — the scholarly comparison
**Route:** `/compare` (the compare icon in the header, or the "Scholarly
Comparison" door)
**Do:** Use the sticky **I / II / III** tabs to move through the three layers:
**The Canon** (66 / 73 / 81 stat boxes, the unique-books table, the "Meqabyan
are NOT the Maccabees" warning, the expandable full-OT table), **The Structure**
(structural differences, expandable Psalm-numbering table), and **The Text**
(documented variant cards plus the Dead Sea Scrolls scorecard). Click any
superscript citation like `[3]` to jump to the **Bibliography & Sources**
section at the bottom; follow an external source link.
**Notice (source-traceable, the centerpiece):** "Every factual claim on this
page is cited to a published scholarly source." Every numbered citation resolves
to a real bibliography entry, several linking out. This is the proof that the
project earns the word "scholarly."

### 11. About — why and how
**Route:** `/about` (footer links on Welcome / Reading Paths, or section
"Learn more" links)
**Do:** Read the four sections: **Why This Exists**, **How We Verify** (primary
and secondary sources, data sources), **The Technology** (open source, GitHub
link), and **Credits** (Beta Masaheft CC BY-SA 4.0; Brenton 1851; KJV; Charles'
1 Enoch & Jubilees).
**Notice (source-traceable + humble):** "You don't have to trust us. Check the
sources yourself." The provenance of every text and the openness of the code are
stated up front.

---

## Known residuals (honest status)

These are intentional, disclosed gaps — not bugs to be papered over:

- **Word-gloss DATA is pending a network-reachable Dillmann run.** The lexicon
  loader expects an optional `public/data/lexicon.json`; until that file exists,
  every word lookup returns no gloss and the modal honestly says **"Meaning not
  yet available"** with a Dillmann link. Generating the data requires reaching
  the Dillmann API host (`betamasaheft.eu`), which is **unreachable from the
  build environment** (connection reset), so `lexicon.json` could not be
  produced here. The **UI is already honest and complete** — when the data is
  generated on a network-reachable machine and dropped in, glosses appear
  automatically with their source attribution. No code change is needed.

- **Four placeholder books** (Lefafa Sedq, Testament of Our Lord, Teaching of
  Mysteries, Sinodos) are not yet transcribed. They are clearly badged as
  placeholders in the catalog and show a "not transcribed yet" notice in the
  reader rather than a blank page.

- **Production deploy / merge to `main` awaits your go.** This walkthrough runs
  against the local dev server. Committing, pushing, and the production deploy
  are deliberately left for you to authorize — nothing has been merged to the
  main branch.
