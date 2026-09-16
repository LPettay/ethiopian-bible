import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ShareVerse } from '../../src/components/ShareVerse'
import type { Verse } from '../../src/types/bible'

const verse: Verse = {
  num: 3,
  geez: 'ወሐይወ',
  translation: '',
  translations: {
    lxx: 'And Adam lived two hundred and thirty years.',
    kjv: 'And Adam lived an hundred and thirty years.',
  },
  words: [],
}

describe('ShareVerse', () => {
  let written: string

  beforeEach(() => {
    written = ''
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText: vi.fn(async (t: string) => { written = t }),
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('builds a share URL that includes the deployment base path', async () => {
    // BASE_URL is "/" in the test env, so the base segment collapses to empty —
    // but the construction must still respect import.meta.env.BASE_URL rather
    // than hard-coding the domain root (which would break on /ethiopian-bible/).
    render(<ShareVerse verse={verse} bookAbbrev="Gen" bookName="Genesis" chapter={5} />)

    fireEvent.click(screen.getByRole('button', { name: 'Share verse' }))

    await waitFor(() => expect(written).not.toBe(''))

    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    const expectedUrl = `${window.location.origin}${base}/read/Gen/5/3`
    expect(written).toContain(expectedUrl)
    // Reference and both translations are included.
    expect(written).toContain('Genesis 5:3')
    expect(written).toContain('LXX: And Adam lived two hundred and thirty years.')
    expect(written).toContain('KJV: And Adam lived an hundred and thirty years.')
  })

  it('uses the abbrev in the URL path even when a display name is shown in the reference', async () => {
    render(<ShareVerse verse={verse} bookAbbrev="Gen" bookName="Genesis" chapter={5} />)
    fireEvent.click(screen.getByRole('button', { name: 'Share verse' }))
    await waitFor(() => expect(written).not.toBe(''))
    // Path segment must be the abbrev (route param), not the human name.
    expect(written).toMatch(/\/read\/Gen\/5\/3$/m)
  })
})
