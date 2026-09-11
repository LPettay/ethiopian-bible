import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import type { Book } from '../../src/types/bible'

const books: Book[] = [
  { abbrev: 'Gen', name: 'Genesis', section: 'Other', chapters: 50, source_id: 'gen' },
]

// Mock the data layer so Layout's chapter-count lookup is deterministic and
// does not depend on a network fetch or the module-level books cache.
vi.mock('../../src/lib/data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/data')>()
  return {
    ...actual,
    loadBooks: vi.fn(async () => books),
  }
})

import { Layout } from '../../src/components/Layout'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/read/:book/:chapter" element={<div>reader</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('Layout chapter navigation bounds', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('disables the next-chapter button on the last chapter of a book', async () => {
    renderAt('/read/Gen/50')
    const next = await screen.findByRole('button', { name: 'Next chapter' })
    // Genesis has 50 chapters — at chapter 50 the arrow must be disabled so it
    // cannot navigate past the end of the book.
    await waitFor(() => expect(next).toBeDisabled())
  })

  it('keeps the next-chapter button enabled mid-book', async () => {
    renderAt('/read/Gen/3')
    const next = await screen.findByRole('button', { name: 'Next chapter' })
    await waitFor(() => expect(next).not.toBeDisabled())
  })

  it('disables the previous-chapter button on chapter 1', async () => {
    renderAt('/read/Gen/1')
    const prev = await screen.findByRole('button', { name: 'Previous chapter' })
    expect(prev).toBeDisabled()
  })
})
