# The Ethiopian Bible

**The first free, open-source, interlinear Ethiopian Bible reader with dual English translations from the Septuagint and Masoretic traditions.**

The Ethiopian Orthodox Tewahedo Church preserves the oldest and most complete biblical canon in Christianity -- 81 books, including texts that survive nowhere else on earth. This app presents them in the original Ge'ez script with word-by-word transliteration and side-by-side English translations from two ancient traditions.

## What Makes This Different

Most Bible apps give you one English translation from one textual tradition. This one shows you **two traditions side by side** for every verse:

- **LXX (Brenton 1851)** -- English translated from the Greek Septuagint, the same tradition the Ethiopian Bible descends from
- **KJV (1611)** -- English translated from the Masoretic Hebrew, the basis for most Protestant Bibles

Open Genesis 5:3 and see:

> **LXX:** And Adam lived **two hundred and thirty** years, and begot a son...
>
> **KJV:** And Adam lived **an hundred and thirty** years, and begat a son...

Same book. Same verse. Different number. The text speaks for itself.

## Features

- **36 books** in Ge'ez with transliteration, **20 with dual English translations**
- **Three reading modes**: Study (word cards + translations), Read (clean text), Compare (side-by-side)
- **Scholarly comparison page** with 12 documented textual variants, every claim cited to published sources
- **URL routing** -- every verse is shareable (`/read/Gen/5/3`)
- **Bookmarks and annotations** saved in your browser
- **Search** across all texts
- **Variant indicators** marking known divergent verses
- **Keyboard navigation** (arrow keys, Ctrl+K for search)
- **Offline support** via service worker
- **Accessible** (ARIA labels, focus management, screen reader support)
- **Mobile-first** responsive design

## Scholarly Rigor

Every factual claim in the comparison page is cited to a published scholarly source. Key references:

- Cowley, R.W. "The Biblical Canon of the Ethiopian Orthodox Church Today." *Ostkirchliche Studien* 23 (1974): 318-323
- Tov, E. *Textual Criticism of the Hebrew Bible*. 3rd ed. Fortress Press, 2012
- Nickelsburg, G.W.E. *1 Enoch: A Commentary*. Hermeneia. Fortress Press, 2001
- Heiser, M.S. "Deuteronomy 32:8 and the Sons of God." *Bibliotheca Sacra* 158 (2001): 52-74

Full bibliography with 34 entries available at `/compare`.

## Data Sources

- **Ge'ez texts**: [Beta Masaheft](https://betamasaheft.eu/) (Universitat Hamburg), CC BY-SA 4.0
- **LXX English**: Brenton's English Translation of the Septuagint (1851), public domain
- **KJV English**: King James Version (1611/1769), public domain
- **1 Enoch**: R.H. Charles (1917), public domain
- **Jubilees**: R.H. Charles (1902), public domain

## Tech Stack

- React 18 + TypeScript + Vite
- TailwindCSS v4
- React Router (URL-based navigation)
- Vitest (39 unit tests)
- Docker + Caddy (production deployment)
- GitHub Actions CI

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build

# Docker deployment
docker compose up --build
```

The dev server runs at `http://localhost:3300`.

## Project Structure

```
src/
  components/    # React components (VerseView, WordCard, BookPicker, etc.)
  hooks/         # Custom hooks (useSettings, useKeyboardNav)
  lib/           # Data loading, storage, comparison data
  pages/         # Route pages (Reader, Compare, Welcome, Bookmarks)
  types/         # TypeScript type definitions
public/
  data/          # Chapter JSON files (1,076 chapters across 36 books)
tests/           # Unit tests
```

## License

The source code is open source. The Ge'ez texts are licensed CC BY-SA 4.0 by Beta Masaheft. English translations are public domain.

## Contributing

This project exists to make ancient texts accessible to everyone. Contributions welcome -- especially:

- Additional book translations
- Verse alignment improvements
- Accessibility enhancements
- Translations of the UI into other languages
