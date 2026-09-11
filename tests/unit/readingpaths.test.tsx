import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReadingPathsPage } from '../../src/pages/ReadingPathsPage'

const mockData = {
  paths: [
    {
      id: 'the-full-story',
      name: 'The Full Story',
      description: 'All texts in narrative chronological order.',
      sections: [
        {
          name: 'I. Origins',
          description: 'Creation through Babel.',
          entries: [
            { book: 'Gen', startChapter: 1, endChapter: 11, label: 'Genesis 1–11: Creation through Babel' },
            { book: 'Jub', startChapter: 1, endChapter: 10, label: 'Jubilees 1–10: The angelic retelling' },
          ],
        },
      ],
    },
    {
      id: 'the-watchers',
      name: 'The Watchers',
      description: 'The complete fallen angels narrative.',
      sections: [
        {
          name: 'The Seed Text',
          entries: [
            { book: 'Gen', startChapter: 6, endChapter: 6, label: 'Genesis 6:1-4: The Nephilim' },
            { book: 'Jub', startChapter: 5, endChapter: 5, note: 'Jubilees expands the four verses into theology.' },
          ],
        },
      ],
    },
  ],
}

function renderPage() {
  return render(
    <MemoryRouter>
      <ReadingPathsPage />
    </MemoryRouter>,
  )
}

describe('ReadingPathsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
        } as Response),
      ),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows a non-blank loading state before data resolves', () => {
    renderPage()
    expect(screen.getByText(/Loading reading paths/i)).toBeInTheDocument()
  })

  it('renders path titles from mocked data', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('The Full Story')).toBeInTheDocument()
    })
    expect(screen.getByText('The Watchers')).toBeInTheDocument()
  })

  it('renders entry labels as links into the reader', async () => {
    renderPage()
    const link = await screen.findByText('Genesis 1–11: Creation through Babel')
    expect(link.closest('a')).toHaveAttribute('href', '/read/Gen/1')
  })

  it('renders note-only entries as text, not links', async () => {
    renderPage()
    const note = await screen.findByText('Jubilees expands the four verses into theology.')
    expect(note.closest('a')).toBeNull()
  })

  it('renders a non-blank error state when the fetch fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false, status: 500 } as Response)),
    )
    renderPage()
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText(/Could not load the reading paths/i)).toBeInTheDocument()
  })
})
