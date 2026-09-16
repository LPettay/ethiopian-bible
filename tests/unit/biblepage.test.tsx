import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BiblePage } from '../../src/pages/BiblePage'
import type { Book } from '../../src/types/bible'

// A real Geʿez-only book and a placeholder (stub) book. The stub must be
// labelled distinctly so users never mistake placeholder text for scripture.
const books: Book[] = [
  { abbrev: '1En', name: '1 Enoch', section: 'Unique to Ethiopia', chapters: 108, source_id: 'enoch' },
  { abbrev: 'FPr', name: 'First Prayer', section: 'Unique to Ethiopia', chapters: 1, source_id: 'fpr', stub: true },
]

function mockFetch() {
  return vi.fn(async (url: string) => {
    if (url.endsWith('books.json')) {
      return { ok: true, json: async () => books } as Response
    }
    // Any chapter request: pretend it's plain Geʿez-only (no LXX/KJV/translation).
    return {
      ok: true,
      json: async () => ({ verses: [{ num: 1, geez: 'ሰላም', translation: '' }] }),
    } as Response
  })
}

function renderPage() {
  return render(
    <MemoryRouter>
      <BiblePage />
    </MemoryRouter>,
  )
}

describe('BiblePage stub labelling', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('labels a stub book with the placeholder status, distinct from Geʿez-only', async () => {
    renderPage()

    // The stub book shows the unmistakable placeholder pill...
    await waitFor(() => {
      expect(screen.getByText('Placeholder — not yet transcribed')).toBeInTheDocument()
    })

    // ...and the real Geʿez-only book is still listed without that pill.
    expect(screen.getByText('1 Enoch')).toBeInTheDocument()
    expect(screen.getByText('First Prayer')).toBeInTheDocument()
    // Only one placeholder pill — the stub does not bleed onto the real book.
    expect(screen.getAllByText('Placeholder — not yet transcribed')).toHaveLength(1)
  })

  it('explains each canon section and links "Learn more" to /about', async () => {
    renderPage()

    await waitFor(() => {
      expect(
        screen.getByText(/Books preserved complete only in Ge.+— 1 Enoch, Jubilees, Meqabyan/),
      ).toBeInTheDocument()
    })

    const learnMore = screen.getAllByRole('link', { name: 'Learn more' })
    expect(learnMore.length).toBeGreaterThan(0)
    expect(learnMore[0]).toHaveAttribute('href', '/about')
  })
})
