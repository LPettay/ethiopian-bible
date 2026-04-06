// ---- Scholarly comparison data ----
// Extracted from the static compare.html (1,589 lines) into structured data.
// Every citation [n] links to an entry in BIBLIOGRAPHY.

export const CANON_STATS = [
  { num: 66, label: 'Protestant' },
  { num: 73, label: 'Catholic' },
  { num: 81, label: 'Ethiopian' },
] as const

export interface UniqueBook {
  name: string
  geez?: string
  chapters: string
  description: string
  source: string
  cites?: string[]
}

export const UNIQUE_BOOKS: UniqueBook[] = [
  {
    name: '1 Enoch',
    geez: '\u1204\u1296\u12AD',
    chapters: '108',
    description:
      'The Watchers, heavenly visions, the Son of Man, cosmology. Quoted in Jude 14-15. Complete text only in Ge\u2019ez.',
    source:
      'Nickelsburg, <em>1 Enoch</em> (Hermeneia, 2001); Knibb, <em>Ethiopic Book of Enoch</em> (1978)',
    cites: ['3'],
  },
  {
    name: 'Jubilees',
    geez: '\u1218\u1335\u1210\u1936 \u12C9\u1933\u120C',
    chapters: '50',
    description:
      '\u201CLittle Genesis.\u201D Retells Genesis in jubilee cycles. Angels, Nephilim, solar calendar. Complete text only in Ge\u2019ez.',
    source:
      'VanderKam, <em>The Book of Jubilees</em> (CSCO 510-511, 1989)',
    cites: ['4'],
  },
  {
    name: '1-2-3 Meqabyan',
    geez: '\u1218\u1243\u1262\u12EB\u1295',
    chapters: '36 + 21 + 10',
    description:
      'Ethiopian \u201CMaccabees\u201D \u2014 NOT the same books as the Catholic/Greek Maccabees (see below).',
    source:
      'Habtemichael-Kidane, <em>Enc. Aethiopica</em> 3:767-770 (2007)',
    cites: ['5'],
  },
  {
    name: 'Kebra Nagast',
    geez: '\u12AD\u1265\u1228 \u1290\u1308\u1235\u1275',
    chapters: '119',
    description:
      'The Glory of Kings. Solomon, Queen of Sheba (Makeda), and the Ark of the Covenant\u2019s transfer to Ethiopia.',
    source:
      'Budge, <em>Kebra Nagast</em> (1922, public domain); Ullendorff, <em>Ethiopia and the Bible</em>, 75-76',
    cites: ['6'],
  },
  {
    name: '4 Baruch',
    chapters: '9',
    description:
      'Paralipomena of Jeremiah. Expands on Jeremiah and Baruch during the fall of Jerusalem.',
    source: 'Kraft & Purintun, <em>Paraleipomena Jeremiou</em> (SBL, 1972)',
  },
  {
    name: '4 Ezra (Izra Sutuel)',
    chapters: '13',
    description:
      'Ezra\u2019s apocalyptic visions. Theodicy, messianic age, end times. In the Vulgate appendix but never Western canon.',
    source: 'Stone, <em>Fourth Ezra</em> (Hermeneia, 1990)',
    cites: ['7'],
  },
  {
    name: 'Broader canon: Sinodos, Book of the Covenant, Ethiopic Clement, Ethiopic Didascalia',
    chapters: 'varies',
    description:
      'Church-order texts attributed to apostolic authority. These make up the 8 books that bring the total from 73 to 81.',
    source: 'Cowley, <em>Ostkirchliche Studien</em> 23 (1974): 320-322',
    cites: ['1'],
  },
]

export interface StructuralDiff {
  feature: string
  protestant: string
  ethiopian: string
  cites?: string[]
}

export const STRUCTURAL_DIFFS: StructuralDiff[] = [
  {
    feature: 'Psalms',
    protestant: '150 Psalms',
    ethiopian:
      '151 Psalms. Psalm 151 confirmed by Dead Sea Scrolls (11QPs<sup>a</sup>). Also canonical in Eastern Orthodox churches.',
    cites: ['8'],
  },
  {
    feature: 'Psalm numbering',
    protestant: 'Follows Masoretic numbering',
    ethiopian:
      'Follows LXX numbering. For most of the Psalter, Ethiopian psalm number = Protestant number minus 1.',
    cites: ['9'],
  },
  {
    feature: 'Proverbs',
    protestant: 'One book, 31 chapters',
    ethiopian:
      'Two books: <em>Messale</em> (ch. 1-24) and <em>Tagsas</em> (\u201CReproof,\u201D ch. 25-31). Reflects the compositional boundary at Prov 25:1.',
    cites: ['10'],
  },
  {
    feature: 'Jeremiah',
    protestant: 'Jeremiah, Lamentations, Baruch as separate books',
    ethiopian:
      'One compilation: Jeremiah + Baruch + Lamentations + Letter of Jeremiah + 4 Baruch.',
    cites: ['11'],
  },
  {
    feature: 'Ezra-Nehemiah',
    protestant: 'Two books: Ezra (10 ch.) + Nehemiah (13 ch.)',
    ethiopian:
      'Three texts: 1 Izra (= Ezra+Nehemiah combined), 2 Izra (= Greek Esdras), Izra Sutuel (= 4 Ezra).',
    cites: ['11'],
  },
  {
    feature: 'Daniel',
    protestant: '12 chapters, no additions',
    ethiopian:
      '14 chapters: includes Prayer of Azariah, Susanna, Bel & the Dragon.',
    cites: ['9'],
  },
  {
    feature: 'Esther',
    protestant: '10 chapters, no additions',
    ethiopian:
      'Includes Greek Additions (Mordecai\u2019s dream, prayers, royal edicts).',
    cites: ['9'],
  },
  {
    feature: 'Prayer of Manasseh',
    protestant: 'Omitted or in appendix',
    ethiopian: 'Incorporated into 2 Chronicles.',
    cites: ['11'],
  },
]

export interface PsalmRow {
  masoretic: string
  lxx: string
}

export const PSALM_NUMBERING: PsalmRow[] = [
  { masoretic: 'Psalms 1-8', lxx: 'Psalms 1-8' },
  { masoretic: 'Psalms 9-10', lxx: 'Psalm 9 (combined)' },
  { masoretic: 'Psalms 11-113', lxx: 'Psalms 10-112 (each one less)' },
  { masoretic: 'Psalms 114-115', lxx: 'Psalm 113 (combined)' },
  { masoretic: 'Psalm 116', lxx: 'Psalms 114-115 (split)' },
  { masoretic: 'Psalms 117-146', lxx: 'Psalms 116-145 (each one less)' },
  { masoretic: 'Psalm 147', lxx: 'Psalms 146-147 (split)' },
  { masoretic: 'Psalms 148-150', lxx: 'Psalms 148-150' },
  { masoretic: '\u2014', lxx: 'Psalm 151' },
]

export interface TextualVariant {
  id: string
  title: string
  subtitle: string
  mt: string
  lxx: string
  /** Label override for MT column (e.g. "Hebrew (Masoretic)" or "Protestant Position") */
  mtLabel?: string
  /** Label override for LXX column */
  lxxLabel?: string
  dss?: string
  whyItMatters: string
  sourceRef: string
}

export const TEXTUAL_VARIANTS: TextualVariant[] = [
  {
    id: 'gen-chronology',
    title: 'Genesis 5 & 11: The Patriarch Chronologies',
    subtitle: 'How long from Creation to Abraham?',
    mt: '~2,008 years from Creation to Abraham. Adam fathers Seth at age <strong>130</strong>.',
    lxx: '~3,394 years from Creation to Abraham (<strong>+1,386 years</strong>). Adam fathers Seth at age <strong>230</strong>. Includes an extra patriarch, <strong>\u201CSecond Cainan,\u201D</strong> not in the MT.',
    dss: '<strong>New Testament witness:</strong> Luke 3:36 includes \u201CCainan, the son of Arphaxad\u201D \u2014 the patriarch found in the LXX but absent from the MT. Luke used the Septuagint genealogy.<a href="#n15" class="cite">[15]</a>',
    whyItMatters:
      'This is not a minor scribal error. The entire timeline of biblical history \u2014 from Creation to Abraham \u2014 differs by nearly 1,400 years depending on which textual tradition you follow. A Septuagint/Ethiopian chronology places Abraham around 3,300 years after Creation; a Masoretic chronology places him around 2,000 years after Creation. And the author of Luke\u2019s Gospel used the longer Septuagint timeline \u2014 which means the New Testament genealogy of Jesus contradicts the Masoretic numbers.',
    sourceRef:
      'Hughes, <em>Secrets of the Times</em> (Sheffield, 1990), ch. 1-3. Smith, \u201CThe Case for the Septuagint\u2019s Chronology in Genesis 5 and 11,\u201D <em>Proc. 8th ICC</em> (2018), 117-132.',
  },
  {
    id: 'goliath',
    title: '1 Samuel 17:4 \u2014 How Tall Was Goliath?',
    subtitle: 'Three ancient witnesses vs. the Masoretic Text',
    mt: '\u201CSix cubits and a span\u201D<br/>~9 ft 9 in (2.97 m)',
    lxx: '\u201CFour cubits and a span\u201D<br/>~6 ft 9 in (2.06 m)',
    dss: '<strong>Dead Sea Scrolls agree with LXX:</strong> 4QSam<sup>a</sup> reads \u201Cfour cubits and a span.\u201D So does Josephus (<em>Antiquities</em> 6.171, 1st century CE). Three ancient witnesses agree on the shorter reading.<a href="#n16" class="cite">[16]</a>',
    whyItMatters:
      'At 6\u20199\u201D, Goliath is still a giant \u2014 taller than almost any human alive today \u2014 but he becomes a plausibly real person, not a mythological figure. The earlier reading makes the story <em>more</em> historical, not less. And it demonstrates that even the most iconic details of well-known Bible stories can differ depending on which textual tradition you trust.',
    sourceRef:
      'Tov, <em>Textual Criticism of the Hebrew Bible</em>, 3rd ed. (Fortress, 2012), 342.',
  },
  {
    id: 'deut-32-8',
    title: 'Deuteronomy 32:8 \u2014 \u201CSons of God\u201D or \u201CSons of Israel\u201D?',
    subtitle: 'An older theology erased from the Hebrew text',
    mt: '\u201C...according to the number of the <strong>sons of Israel</strong>\u201D',
    lxx: '\u201C...according to the number of the <strong>angels of God</strong>\u201D',
    dss: '<strong>Dead Sea Scrolls (4QDeut<sup>j</sup>) read \u201Csons of God\u201D</strong> (\u05D1\u05E0\u05D9 \u05D0\u05DC\u05D4\u05D9\u05DD) \u2014 confirming the LXX preserves the older reading. The MT\u2019s \u201Csons of Israel\u201D is widely considered a scribal emendation to avoid the implication of a divine council.<a href="#n17" class="cite">[17]</a><br/><br/>The ESV Study Bible has adopted the Qumran/LXX reading (\u201Csons of God\u201D) in its main text, breaking with the MT.',
    whyItMatters:
      'The older reading preserves an ancient Israelite cosmology in which God presides over a council of divine beings, each assigned to a nation, with Israel as YHWH\u2019s own portion. This concept appears throughout the Hebrew Bible (Psalm 82, Job 1-2, 1 Kings 22:19-22) but was suppressed in this passage by later scribes uncomfortable with its implications. The Ethiopian Bible preserves what the scribes tried to erase.',
    sourceRef:
      'Heiser, \u201CDeuteronomy 32:8 and the Sons of God,\u201D <em>Bibliotheca Sacra</em> 158 (2001): 52-74.',
  },
  {
    id: 'isa-7-14',
    title: 'Isaiah 7:14 \u2014 \u201CVirgin\u201D or \u201CYoung Woman\u201D?',
    subtitle:
      'One of the most theologically significant translation differences in Scripture',
    mtLabel: 'Hebrew (Masoretic)',
    lxxLabel: 'Greek (LXX) / Ethiopian',
    mt: '\u05E2\u05DC\u05DE\u05D4 (<em>almah</em>)<br/>\u201Cyoung woman\u201D (of marriageable age)',
    lxx: '\u03C0\u03B1\u03C1\u03B8\u03AD\u03BD\u03BF\u03C2 (<em>parthenos</em>)<br/>\u201Cvirgin\u201D',
    dss: '<strong>New Testament connection:</strong> Matthew 1:23 quotes Isaiah 7:14 using the LXX\u2019s <em>parthenos</em> (\u201Cvirgin\u201D), directly connecting it to the virgin birth of Jesus.<a href="#n18" class="cite">[18]</a>',
    whyItMatters:
      'This is one of the most theologically charged translation differences in all of Scripture. Matthew\u2019s argument for the virgin birth depends on the word <em>parthenos</em> \u2014 the LXX reading. If Matthew had been reading the Hebrew <em>almah</em> (\u201Cyoung woman\u201D), the prophetic connection to a miraculous birth would be far less direct. The Ethiopian Bible, following the LXX, reads \u201Cvirgin\u201D unambiguously. The doctrinal stakes of this single word are enormous.',
    sourceRef:
      'Jobes and Silva, <em>Invitation to the Septuagint</em>, 2nd ed. (Baker Academic, 2015), 189-191.',
  },
  {
    id: 'jeremiah',
    title: 'Jeremiah \u2014 Two Different Editions',
    subtitle: 'The single largest textual divergence in the entire Bible',
    mt: 'Full length. Oracles Against the Nations at the <strong>end</strong> (ch. 46-51). Order: Egypt, Philistia, Moab, Ammon, Edom, Damascus, Kedar, Elam, Babylon.',
    lxx: '<strong>~12.5% shorter.</strong> Oracles in the <strong>middle</strong> (after 25:13). Different order: Elam, Egypt, Babylon, Philistia, Edom, Ammon, Kedar, Damascus, Moab.',
    dss: '<strong>Both editions existed in Hebrew before the Christian era.</strong> Two Dead Sea Scrolls manuscripts \u2014 4QJer<sup>a</sup> (shorter, LXX-type) and 4QJer<sup>b</sup> (longer, MT-type) \u2014 prove neither is a \u201Ccorruption.\u201D They represent two genuine editorial stages of the same prophetic book.<a href="#n19" class="cite">[19]</a>',
    whyItMatters:
      'This is the single largest textual difference in the entire Bible. Imagine preaching a sermon series through Jeremiah 46-51 and then learning that in the Ethiopian tradition, those chapters appear in an entirely different location and in a different order \u2014 and that the Dead Sea Scrolls prove both arrangements are ancient and legitimate. Neither edition is \u201Cwrong.\u201D The book of Jeremiah was alive and growing \u2014 and two snapshots of that growth were preserved in two different traditions.',
    sourceRef:
      'Tov, \u201CThe Literary History of the Book of Jeremiah,\u201D in <em>Empirical Models for Biblical Criticism</em>, ed. Tigay (U. Penn Press, 1985), 211-237.',
  },
  {
    id: 'job',
    title: 'Job \u2014 The Resurrection Epilogue',
    subtitle: 'Does Job affirm bodily resurrection?',
    mt: 'Book ends at Job 42:17.<br/>Resurrection is famously ambiguous (Job 19:25-26 is notoriously difficult to translate).',
    lxx: 'Five additional lines after 42:17. Identifies Job with Jobab (Gen 36:33). Concludes: <em>\u201CIt is written that he will rise again with those whom the Lord raises up.\u201D</em>',
    whyItMatters:
      'The question \u201CDoes Job believe in resurrection?\u201D has been debated for centuries based on the ambiguous Hebrew of Job 19:25-26 (\u201CI know that my redeemer lives...\u201D). In the Ethiopian tradition, the question was never in doubt. The epilogue settles it explicitly. Ethiopian Christians have read Job as a resurrection text for 1,600 years.',
    sourceRef:
      'Brenton, <em>The Septuagint with an English Translation</em> (Bagster, 1851; public domain). Dhont, <em>Style and Context of Old Greek Job</em> (Brill, 2018).<a href="#n20" class="cite">[20]</a>',
  },
  {
    id: 'deut-32-43',
    title: 'Deuteronomy 32:43 \u2014 The Song of Moses, Expanded',
    subtitle:
      'A New Testament author quoting a verse that\u2019s not in your Old Testament',
    mt: '\u201CRejoice, O nations, with his people\u201D<br/><span class="text-text-muted text-xs">(Short version \u2014 no mention of heavenly worship)</span>',
    lxx: '\u201CRejoice, O heavens, with him, and let all the <strong>sons of God</strong> worship him; rejoice, O nations, with his people, and let all the <strong>angels of God</strong> strengthen themselves in him\u201D',
    dss: '<strong>Dead Sea Scrolls (4QDeut<sup>q</sup>) preserve the expanded version.</strong> And here is what makes this extraordinary: <strong>Hebrews 1:6</strong> in the New Testament \u2014 \u201CLet all God\u2019s angels worship him\u201D \u2014 is quoting this expanded Deuteronomy 32:43. The author of Hebrews was reading a text that exists in the Ethiopian/LXX tradition but <em>not</em> in the Masoretic Text that Protestant Bibles are translated from.<a href="#n21" class="cite">[21]</a>',
    whyItMatters:
      'This is one of several cases where a New Testament author quotes an Old Testament passage that does not exist in the Protestant Old Testament. The NT author was reading a text closer to the Ethiopian Bible than to the one on your church\u2019s bookshelf.',
    sourceRef:
      'Attridge, H.W., <em>The Epistle to the Hebrews</em> (Hermeneia, Fortress, 1989), 57-58.',
  },
  {
    id: 'nahash',
    title:
      '1 Samuel 10:27\u201311:1 \u2014 The Missing Paragraph',
    subtitle:
      'An entire scene confirmed by the Dead Sea Scrolls that Protestant Bibles never had',
    mt: '1 Samuel jumps from 10:27 directly into 11:1: \u201CNahash the Ammonite went up and besieged Jabesh-Gilead.\u201D No context for why the siege happens or why the people are so terrified.',
    lxx: 'Between 10:27 and 11:1, a full paragraph explains: Nahash had been gouging out the right eye of every Israelite in the territories of Gad and Reuben. 7,000 men had fled to Jabesh-Gilead. Then Nahash besieges Jabesh \u2014 and the terror makes sense.',
    dss: '<strong>Dead Sea Scrolls (4QSam<sup>a</sup>) confirm this paragraph existed in Hebrew.</strong> Josephus (<em>Antiquities</em> 6.68-71) also knew this material. The paragraph was lost from the Masoretic tradition but preserved in the LXX and at Qumran.<a href="#n22" class="cite">[22]</a>',
    whyItMatters:
      'This isn\u2019t a variant spelling or a different number. It\u2019s an entire narrative scene \u2014 confirmed by a Dead Sea Scroll and an independent 1st-century historian \u2014 that provides crucial context for the story. If you\u2019ve ever read 1 Samuel 11 and wondered why the siege of Jabesh-Gilead was so urgent, the Ethiopian Bible has the answer. Your Bible had the answer too, once.',
    sourceRef:
      'Cross, F.M., \u201CThe Ammonite Oppression of the Tribes of Gad and Reuben,\u201D in <em>History, Historiography and Interpretation</em>, ed. Tadmor and Weinfeld (Magnes Press, 1983), 148-158.',
  },
  {
    id: 'esther',
    title: 'Esther \u2014 The Book That Never Mentions God',
    subtitle: 'Unless you read the Ethiopian version',
    mt: 'The book of Esther famously <strong>never mentions God</strong>. Not once. No prayer, no divine intervention, no theological commentary. It is the only book in the Protestant Old Testament where God is completely absent.',
    lxx: 'Six major additions (labeled A-F) include <strong>Mordecai\u2019s dream</strong> (a prophetic vision from God), the <strong>prayers of Mordecai and Esther</strong> (explicitly invoking \u201CLord, Lord, King of all\u201D), the full text of royal edicts, and a colophon attributing the Greek translation.',
    dss: undefined,
    whyItMatters:
      'The theological character of the book is completely different. In the Protestant Esther, God works invisibly \u2014 or perhaps not at all, depending on your reading. In the Ethiopian Esther, God is explicitly present through prayer, dream, and divine intervention. These are not minor additions; they transform the book\u2019s theology. Esther\u2019s prayer (Addition C) is one of the most powerful prayers in the biblical tradition \u2014 and it doesn\u2019t exist in Protestant Bibles.',
    sourceRef:
      'Jobes and Silva, <em>Invitation to the Septuagint</em>, 2nd ed. (Baker Academic, 2015), 164-169. Moore, C.A., <em>Daniel, Esther, and Jeremiah: The Additions</em>, Anchor Bible 44 (Doubleday, 1977).',
  },
  {
    id: 'susanna',
    title: 'Susanna \u2014 The First Detective Story',
    subtitle: 'An entire chapter of Daniel that Protestant Bibles removed',
    mt: 'Daniel begins with chapter 1: Daniel as a young exile in Babylon. No prior story. 12 chapters total.',
    lxx: '<strong>Daniel 13: Susanna.</strong> A beautiful, devout woman is falsely accused of adultery by two corrupt elders who tried to coerce her. She prays to God. A young Daniel cross-examines the elders separately, catches them in contradictory testimony about which tree they saw her under, and exposes the lie. The elders are executed. Justice prevails.',
    whyItMatters:
      'Susanna is often called the first detective story in Western literature. Daniel\u2019s method \u2014 separate the witnesses, ask them the same question, compare answers \u2014 is still the foundation of cross-examination in modern law. It is also one of Scripture\u2019s most powerful stories about a woman\u2019s faithfulness under false accusation, and about God vindicating the innocent through human wisdom. Protestant Bibles do not contain it.',
    sourceRef:
      'Jobes and Silva, <em>Invitation to the Septuagint</em>, 2nd ed. (Baker Academic, 2015), 159-164. Collins, J.J., <em>Daniel</em>, Hermeneia (Fortress, 1993), 418-438.',
  },
  {
    id: 'psalm-151',
    title: 'Psalm 151 \u2014 David\u2019s Own Song',
    subtitle:
      'Confirmed by a Dead Sea Scroll \u2014 and the Hebrew version is even longer',
    mt: 'The Psalter ends at Psalm 150. There is no Psalm 151.',
    lxx: '<strong>Psalm 151:</strong> David\u2019s own account of being the youngest brother, overlooked by his father, chosen by God, anointed by Samuel, and going out to face Goliath. Inscribed: \u201CThis psalm was written by David himself, outside the number, when he fought in single combat with Goliath.\u201D',
    dss: '<strong>Dead Sea Scrolls (11QPs<sup>a</sup>) contain a Hebrew version of Psalm 151.</strong> Remarkably, the Hebrew version is <em>longer</em> than the Greek \u2014 it is actually two psalms (151A and 151B) that the LXX translator condensed into one. This proves the Hebrew original predates the Greek translation.<a href="#n8" class="cite">[8]</a>',
    whyItMatters:
      'David is the single most important human author in the Psalter. Psalm 151 is his autobiographical account of the most iconic moment in his life \u2014 the anointing and the Goliath encounter. The Dead Sea Scrolls prove it was part of the psalmic tradition in ancient Israel. Its absence from Protestant Bibles is a canonical decision, not a historical one.',
    sourceRef:
      'Sanders, J.A., <em>The Psalms Scroll of Qumran Cave 11 (11QPs<sup>a</sup>)</em>, DJD IV (Clarendon Press, 1965).',
  },
  {
    id: 'jude-enoch',
    title:
      'Jude 14-15 \u2014 The New Testament Quotes a Book Your Bible Doesn\u2019t Have',
    subtitle:
      'The Epistle of Jude directly quotes 1 Enoch 1:9 by name',
    mtLabel: 'Protestant Position',
    lxxLabel: 'Ethiopian Position',
    mt: '1 Enoch is not canonical. Jude\u2019s quotation is treated as the author citing a popular text, not endorsing it as Scripture. Similar to Paul quoting Greek poets (Acts 17:28).',
    lxx: '1 Enoch is canonical Scripture. Jude calls Enoch a <strong>prophet</strong> (\u201CEnoch, the seventh from Adam, <em>prophesied</em>\u201D) and quotes him with the same formula used for other prophets. The Ethiopian church sees this as evidence that Enoch belongs in the Bible.',
    whyItMatters:
      'This is a direct test case for how we think about canon. The New Testament contains an explicit, attributed quotation from 1 Enoch \u2014 a book that survived complete only because the Ethiopian church preserved it. Jude does not merely allude to Enoch; he names him, calls him a prophet, and quotes him verbatim. Whether this makes Enoch \u201Ccanonical\u201D is a question every tradition answers differently \u2014 but the question itself cannot be avoided.',
    sourceRef:
      'Compare Jude 14-15 (any Bible) with 1 Enoch 1:9 (Charles, <em>The Book of Enoch</em>, SPCK, 1917, p. 2 \u2014 <a href="https://archive.org/details/bookofenoch00char" target="_blank" rel="noopener">free on archive.org</a>). See also Nickelsburg, <em>1 Enoch</em> (Hermeneia, 2001), 141-142.',
  },
]

export interface DssScorecard {
  passage: string
  support: string
  /** 'lxx' | 'both' | 'debated' */
  verdict: 'lxx' | 'both' | 'debated'
  cites?: string[]
}

export const DSS_SCORECARD: DssScorecard[] = [
  {
    passage: '1 Samuel 17:4 (Goliath\u2019s height)',
    support: '<strong>LXX / Ethiopian</strong> (4QSam<sup>a</sup>)',
    verdict: 'lxx',
  },
  {
    passage: 'Deuteronomy 32:8 (sons of God)',
    support: '<strong>LXX / Ethiopian</strong> (4QDeut<sup>j</sup>)',
    verdict: 'lxx',
  },
  {
    passage: 'Deuteronomy 32:43 (Song of Moses)',
    support: '<strong>LXX / Ethiopian</strong> (4QDeut<sup>q</sup>)',
    verdict: 'lxx',
    cites: ['21'],
  },
  {
    passage: '1 Samuel 10-11 (Nahash narrative)',
    support: '<strong>LXX / Ethiopian</strong> (4QSam<sup>a</sup>)',
    verdict: 'lxx',
    cites: ['22'],
  },
  {
    passage: 'Psalm 151',
    support: '<strong>LXX / Ethiopian</strong> (11QPs<sup>a</sup>)',
    verdict: 'lxx',
  },
  {
    passage: 'Jeremiah (two editions)',
    support:
      '<strong>Both</strong> editions attested (4QJer<sup>a,b</sup>)',
    verdict: 'both',
  },
  {
    passage: 'Genesis 5 & 11 chronology',
    support: '<strong>Debated</strong> / Mixed evidence',
    verdict: 'debated',
  },
]

// Full OT comparison table for expandable section
export interface OtCompRow {
  book: string
  protestant: string
  catholic: string
  ethiopian: string
  notes: string
  kind: 'shared' | 'deut' | 'unique'
}

export const OT_COMPARISON: OtCompRow[] = [
  { book: 'Genesis', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Chronology differs (see Layer III)', kind: 'shared' },
  { book: 'Exodus', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Leviticus', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Numbers', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Deuteronomy', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '32:8 differs significantly (see Layer III)', kind: 'shared' },
  { book: 'Joshua', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Judges', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Ruth', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: '1-2 Samuel', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Counted as one book; has extra material (see Layer III)', kind: 'shared' },
  { book: '1-2 Kings', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Counted as one book', kind: 'shared' },
  { book: '1-2 Chronicles', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Includes Prayer of Manasseh', kind: 'shared' },
  { book: 'Ezra', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Combined with Nehemiah as \u201C1 Izra\u201D', kind: 'shared' },
  { book: 'Nehemiah', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Within 1 Izra', kind: 'shared' },
  { book: 'Esther', protestant: 'Yes', catholic: 'Yes (+adds)', ethiopian: 'Yes (+adds)', notes: 'Ethiopian follows LXX with Greek Additions', kind: 'shared' },
  { book: 'Job', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Epilogue differs (see Layer III)', kind: 'shared' },
  { book: 'Psalms', protestant: 'Yes (150)', catholic: 'Yes (150)', ethiopian: 'Yes (151)', notes: 'Psalm 151; numbering differs throughout', kind: 'shared' },
  { book: 'Proverbs', protestant: 'Yes (1 book)', catholic: 'Yes (1 book)', ethiopian: 'Yes (2 books)', notes: 'Split: Messale (1-24) + Tagsas (25-31)', kind: 'shared' },
  { book: 'Ecclesiastes', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Song of Songs', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Isaiah', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '7:14 translation differs (see Layer III)', kind: 'shared' },
  { book: 'Jeremiah', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: 'Shorter, different order, absorbs Baruch/Lamentations', kind: 'shared' },
  { book: 'Lamentations', protestant: 'Yes (separate)', catholic: 'Yes (separate)', ethiopian: 'Within Jeremiah', notes: '', kind: 'shared' },
  { book: 'Ezekiel', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Daniel', protestant: 'Yes (12 ch)', catholic: 'Yes (14 ch)', ethiopian: 'Yes (14 ch)', notes: 'Additions: Susanna, Bel & Dragon, Prayer of Azariah', kind: 'shared' },
  { book: '12 Minor Prophets', protestant: 'Yes', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'shared' },
  { book: 'Tobit', protestant: 'No', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'deut' },
  { book: 'Judith', protestant: 'No', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'deut' },
  { book: '1-2 Maccabees (Greek)', protestant: 'No', catholic: 'Yes', ethiopian: 'Yes', notes: 'Present alongside (not instead of) Meqabyan', kind: 'deut' },
  { book: 'Wisdom of Solomon', protestant: 'No', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'deut' },
  { book: 'Sirach / Ecclesiasticus', protestant: 'No', catholic: 'Yes', ethiopian: 'Yes', notes: '', kind: 'deut' },
  { book: 'Baruch + Letter of Jeremiah', protestant: 'No', catholic: 'Yes (separate)', ethiopian: 'Within Jeremiah', notes: '', kind: 'deut' },
  { book: '1 Enoch', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: 'Quoted in Jude 14-15. Complete only in Ge\u2019ez.', kind: 'unique' },
  { book: 'Jubilees', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: 'Complete only in Ge\u2019ez.', kind: 'unique' },
  { book: '1-2-3 Meqabyan', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: 'NOT the Greek Maccabees.', kind: 'unique' },
  { book: '4 Baruch', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: '', kind: 'unique' },
  { book: '4 Ezra', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: 'In Vulgate appendix but not canon', kind: 'unique' },
  { book: 'Kebra Nagast', protestant: 'No', catholic: 'No', ethiopian: 'Yes', notes: 'Canonical status debated', kind: 'unique' },
]

export interface BibEntry {
  id: string
  category: string
  text: string
  url?: string
}

export const BIBLIOGRAPHY: BibEntry[] = [
  // Primary Sources & Critical Editions
  {
    id: 'n3',
    category: 'Primary Sources & Critical Editions',
    text: '[3] Knibb, M.A. <em>The Ethiopic Book of Enoch: A New Edition in the Light of the Aramaic Dead Sea Fragments</em>. 2 vols. Oxford: Clarendon Press, 1978.',
  },
  {
    id: 'n3b',
    category: 'Primary Sources & Critical Editions',
    text: 'Nickelsburg, G.W.E. <em>1 Enoch: A Commentary on the Book of 1 Enoch, Chapters 1-36; 81-108</em>. Hermeneia. Minneapolis: Fortress Press, 2001.',
  },
  {
    id: 'n7',
    category: 'Primary Sources & Critical Editions',
    text: '[7] Stone, M.E. <em>Fourth Ezra</em>. Hermeneia. Minneapolis: Fortress Press, 1990.',
  },
  {
    id: 'n8',
    category: 'Primary Sources & Critical Editions',
    text: '[8] Sanders, J.A. <em>The Psalms Scroll of Qumran Cave 11 (11QPs<sup>a</sup>)</em>. Discoveries in the Judaean Desert IV. Oxford: Clarendon Press, 1965.',
  },
  {
    id: 'n4',
    category: 'Primary Sources & Critical Editions',
    text: '[4] VanderKam, J.C. <em>The Book of Jubilees: A Critical Text</em>. CSCO 510-511. Leuven: Peeters, 1989.',
  },
  {
    id: 'n14',
    category: 'Primary Sources & Critical Editions',
    text: '[14] Ulrich, E. <em>The Biblical Qumran Scrolls: Transcriptions and Textual Variants</em>. Supplements to Vetus Testamentum 134. Leiden: Brill, 2010.',
  },
  // On the Ethiopian Canon
  {
    id: 'n1',
    category: 'On the Ethiopian Canon',
    text: '[1] Cowley, R.W. \u201CThe Biblical Canon of the Ethiopian Orthodox Church Today.\u201D <em>Ostkirchliche Studien</em> 23 (1974): 318-323.',
  },
  {
    id: 'n2',
    category: 'On the Ethiopian Canon',
    text: '[2] Ullendorff, E. <em>Ethiopia and the Bible</em>. The Schweich Lectures 1967. Oxford: Oxford University Press, 1968.',
  },
  {
    id: 'n2b',
    category: 'On the Ethiopian Canon',
    text: 'Bausi, A. \u201CCanon.\u201D In <em>Encyclopaedia Aethiopica</em>, vol. 1, edited by S. Uhlig, 680-681. Wiesbaden: Harrassowitz, 2003.',
  },
  {
    id: 'n5',
    category: 'On the Ethiopian Canon',
    text: '[5] Habtemichael-Kidane. \u201CMaccabees, Ethiopic.\u201D In <em>Encyclopaedia Aethiopica</em>, vol. 3, edited by S. Uhlig, 767-770. Wiesbaden: Harrassowitz, 2007.',
  },
  {
    id: 'n6',
    category: 'On the Ethiopian Canon',
    text: '[6] Budge, E.A.W. <em>The Queen of Sheba and Her Only Son Menyelek (Kebra Nagast)</em>. London: Medici Society, 1922.',
    url: 'https://archive.org/details/queenofshebahero00budg',
  },
  // Textual Criticism: LXX vs. Masoretic
  {
    id: 'n13',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[13] Tov, E. <em>Textual Criticism of the Hebrew Bible</em>. 3rd ed. Minneapolis: Fortress Press, 2012.',
  },
  {
    id: 'n9',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[9] Jobes, K.H. and Silva, M. <em>Invitation to the Septuagint</em>. 2nd ed. Grand Rapids: Baker Academic, 2015.',
  },
  {
    id: 'n12',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[12] Knibb, M.A. <em>Translating the Bible: The Ethiopic Version of the Old Testament</em>. The Schweich Lectures 1995. Oxford: Oxford University Press, 1999.',
  },
  {
    id: 'n10',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[10] Ullendorff, E. <em>Ethiopia and the Bible</em>, 64.',
  },
  {
    id: 'n11',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[11] Cowley, \u201CThe Biblical Canon,\u201D 319-322.',
  },
  {
    id: 'n19',
    category: 'Textual Criticism: LXX vs. Masoretic',
    text: '[19] Tov, E. \u201CThe Literary History of the Book of Jeremiah in the Light of Its Textual History.\u201D In <em>Empirical Models for Biblical Criticism</em>, edited by J. Tigay, 211-237. Philadelphia: University of Pennsylvania Press, 1985.',
  },
  // Specific Textual Variants
  {
    id: 'n15',
    category: 'Specific Textual Variants',
    text: '[15] Hughes, J. <em>Secrets of the Times: Myth and History in Biblical Chronology</em>. JSOT Supplement Series 66. Sheffield: Sheffield Academic Press, 1990.',
  },
  {
    id: 'n16',
    category: 'Specific Textual Variants',
    text: '[16] Tov, <em>Textual Criticism</em>, 342. See also Josephus, <em>Antiquities</em> 6.171.',
  },
  {
    id: 'n17',
    category: 'Specific Textual Variants',
    text: '[17] Heiser, M.S. \u201CDeuteronomy 32:8 and the Sons of God.\u201D <em>Bibliotheca Sacra</em> 158 (2001): 52-74.',
  },
  {
    id: 'n18',
    category: 'Specific Textual Variants',
    text: '[18] Jobes and Silva, <em>Invitation to the Septuagint</em>, 189-191.',
  },
  {
    id: 'n20',
    category: 'Specific Textual Variants',
    text: '[20] Dhont, M. <em>Style and Context of Old Greek Job</em>. Supplements to the Journal for the Study of Judaism 183. Leiden: Brill, 2018.',
  },
  {
    id: 'n21',
    category: 'Specific Textual Variants',
    text: '[21] Attridge, H.W. <em>The Epistle to the Hebrews</em>. Hermeneia. Philadelphia: Fortress Press, 1989, 57-58. (On Hebrews 1:6 quoting the expanded Deut 32:43.)',
  },
  {
    id: 'n22',
    category: 'Specific Textual Variants',
    text: '[22] Cross, F.M. \u201CThe Ammonite Oppression of the Tribes of Gad and Reuben: Missing Verses from 1 Samuel 11 Found in 4QSamuel<sup>a</sup>.\u201D In <em>History, Historiography and Interpretation</em>, ed. H. Tadmor and M. Weinfeld, 148-158. Jerusalem: Magnes Press, 1983.',
  },
  {
    id: 'n23',
    category: 'Specific Textual Variants',
    text: '[23] Nosnitsin, D. \u201CEthio-SPaRe: Cultural Heritage of Christian Ethiopia.\u201D <em>Aethiopica</em> 15 (2012): 198-201. (The EthioSPaRe project cataloged over 2,000 previously unknown manuscripts in the Tigray region alone.)',
  },
  // Additions to Daniel and Esther
  {
    id: 'n24',
    category: 'Additions to Daniel and Esther',
    text: '[24] Collins, J.J. <em>Daniel</em>. Hermeneia. Minneapolis: Fortress Press, 1993. (Commentary covering Susanna [ch. 13] and Bel and the Dragon [ch. 14], pp. 418-443.)',
  },
  {
    id: 'n25',
    category: 'Additions to Daniel and Esther',
    text: '[25] Moore, C.A. <em>Daniel, Esther, and Jeremiah: The Additions</em>. Anchor Bible 44. Garden City: Doubleday, 1977. (Comprehensive commentary on all additions to Daniel and Esther.)',
  },
  // English Translations (Public Domain)
  {
    id: 'pd-enoch',
    category: 'English Translations (Public Domain)',
    text: 'Charles, R.H. <em>The Book of Enoch</em>. London: SPCK, 1917.',
    url: 'https://archive.org/details/bookofenoch00char',
  },
  {
    id: 'pd-jubilees',
    category: 'English Translations (Public Domain)',
    text: 'Charles, R.H. <em>The Book of Jubilees, or The Little Genesis</em>. London: SPCK, 1902.',
    url: 'https://archive.org/details/bookjubileesorl00charuoft',
  },
  {
    id: 'pd-brenton',
    category: 'English Translations (Public Domain)',
    text: 'Brenton, L.C.L. <em>The Septuagint Version of the Old Testament, with an English Translation</em>. London: Bagster, 1851. (Public domain.)',
  },
  {
    id: 'pd-kraft',
    category: 'English Translations (Public Domain)',
    text: 'Kraft, R.A. and Purintun, A.-E. <em>Paraleipomena Jeremiou</em>. Texts and Translations 1. Missoula: SBL, 1972.',
  },
  // Digital Resources
  {
    id: 'dr-betamasaheft',
    category: 'Digital Resources',
    text: 'Beta Masaheft: Manuscripts of Ethiopia and Eritrea. Hiob-Ludolf-Zentrum fur Athiopistik, Universitat Hamburg.',
    url: 'https://betamasaheft.eu/',
  },
  {
    id: 'dr-dss',
    category: 'Digital Resources',
    text: 'The Leon Levy Dead Sea Scrolls Digital Library. Israel Antiquities Authority.',
    url: 'https://www.deadseascrolls.org.il/',
  },
  {
    id: 'dr-nets',
    category: 'Digital Resources',
    text: 'New English Translation of the Septuagint (NETS). International Organization for Septuagint and Cognate Studies.',
    url: 'https://ccat.sas.upenn.edu/nets/edition/',
  },
]
