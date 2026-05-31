import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { DiscoverPage } from '../../src/pages/DiscoverPage'

// happy-dom does not implement scrollIntoView or IntersectionObserver.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn()
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <DiscoverPage />
    </MemoryRouter>,
  )
}

describe('DiscoverPage deep-link anchors', () => {
  it('gives each stop a stable anchor id (stop-1 … stop-5)', () => {
    const { container } = renderAt('/discover')
    for (let n = 1; n <= 5; n++) {
      expect(container.querySelector(`#stop-${n}`)).not.toBeNull()
    }
  })

  it('reveals and scrolls to the requested stop when linked via #stop-N', async () => {
    renderAt('/discover#stop-2')
    // The targeted stop is revealed (fade-in transition resolved to visible).
    const section = document.getElementById('stop-2')
    expect(section).not.toBeNull()
    const inner = section!.firstElementChild as HTMLElement
    await waitFor(() => expect(inner.className).toContain('opacity-100'))
    // And the page attempts to scroll it into view.
    await waitFor(() => expect(Element.prototype.scrollIntoView).toHaveBeenCalled())
  })

  it('ignores an out-of-range or malformed hash without throwing', () => {
    expect(() => renderAt('/discover#stop-99')).not.toThrow()
    expect(() => renderAt('/discover#not-a-stop')).not.toThrow()
  })
})

describe('DiscoverPage neutral, sourced framing', () => {
  it('uses the value-neutral exploration headline and subline', () => {
    renderAt('/discover')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Where the traditions diverge',
    )
    expect(
      screen.getByText(/Five places where the Septuagint and Masoretic traditions read differently/i),
    ).toBeInTheDocument()
  })

  it('drops the old marketing hook copy', () => {
    renderAt('/discover')
    // Former ad-copy that the redesign removed.
    expect(screen.queryByText(/Five Verses That Change/i)).toBeNull()
    expect(screen.queryByText(/not a typo/i)).toBeNull()
    expect(screen.queryByText(/Three ancient witnesses against one/i)).toBeNull()
    expect(screen.queryByText(/scribes tried to erase/i)).toBeNull()
    expect(screen.queryByText(/closer than the one on your shelf/i)).toBeNull()
  })

  it('renders stop topics as plain question + reference, not hype headlines', () => {
    renderAt('/discover')
    expect(
      screen.getByRole('heading', { name: /Adam’s age at Seth’s birth \(Genesis 5:3\)/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Goliath’s height \(1 Samuel 17:4\)/ }),
    ).toBeInTheDocument()
  })

  it('states the corrected Genesis 5 witnesses and the honest DSS omission', () => {
    renderAt('/discover')
    const note = screen.getByText(/These numbers differ across manuscript traditions/i)
    expect(note).toHaveTextContent(/Codex Alexandrinus/)
    expect(note).toHaveTextContent(/Samaritan Pentateuch 130/)
    expect(note).toHaveTextContent(/Dead Sea Scrolls preserve no Genesis 5 numbers/)
    expect(note).toHaveTextContent(/Luke 3:36’s extra Cainan concerns Genesis 11/)
  })

  it('labels the two columns with the canonical provenance format', () => {
    renderAt('/discover')
    expect(screen.getAllByText('Masoretic — King James (1611)').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Septuagint — Brenton (1851)').length).toBeGreaterThan(0)
  })

  it('renames the final comparison link to "Comparison & sources"', () => {
    renderAt('/discover')
    const link = screen.getByRole('link', { name: /Comparison & sources/i })
    expect(link).toHaveAttribute('href', '/compare')
    expect(screen.queryByText(/See all differences/i)).toBeNull()
  })
})
