import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WelcomePage } from '../../src/pages/WelcomePage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <WelcomePage />
    </MemoryRouter>,
  )
}

describe('WelcomePage — calm, sourced orientation', () => {
  it('shows the de-hyped tagline', () => {
    renderPage()
    expect(
      screen.getByText('A reader for the Ethiopian biblical canon, with sources shown.'),
    ).toBeInTheDocument()
  })

  it('introduces the Genesis 5:3 sample as two textual traditions', () => {
    renderPage()
    expect(screen.getByText('Genesis 5:3, in two textual traditions:')).toBeInTheDocument()
  })

  it('labels the sample columns with full provenance (Tradition — Edition (year))', () => {
    renderPage()
    expect(screen.getByText('Septuagint — Brenton (1851)')).toBeInTheDocument()
    expect(screen.getByText('Masoretic — King James (1611)')).toBeInTheDocument()
  })

  it('uses a sourced caption naming Codex Alexandrinus, not the false DSS/Luke claim', () => {
    renderPage()
    expect(
      screen.getByText(/the longer Septuagint figure is preserved in Codex Alexandrinus/i),
    ).toBeInTheDocument()
  })

  it('does NOT reproduce the removed marketing punchline or the false witness claim', () => {
    renderPage()
    expect(screen.queryByText(/Same book\. Same verse\. One hundred years apart\./i)).toBeNull()
    expect(screen.queryByText(/Dead Sea Scrolls and the Gospel of Luke agree/i)).toBeNull()
    expect(screen.queryByText(/oldest and most complete biblical canon/i)).toBeNull()
  })

  it('replaces the hype CTA with a plain "Read Genesis 5" link to /read/Gen/5', () => {
    renderPage()
    expect(screen.queryByText(/See 4 more verses like this/i)).toBeNull()
    const cta = screen.getByRole('link', { name: /Read Genesis 5/i })
    expect(cta).toHaveAttribute('href', '/read/Gen/5')
  })

  it('renders plain, tool-like door affordances pointing to the right routes', () => {
    renderPage()
    const expectations: Array<[RegExp, string]> = [
      [/Explore the differences/i, '/discover'],
      [/Reading paths/i, '/reading-paths'],
      [/Open the Bible/i, '/bible'],
      [/Start at Genesis/i, '/read/Gen/1'],
      [/Comparison & sources/i, '/compare'],
    ]
    for (const [name, href] of expectations) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
    }
  })

  it('keeps the Beta Masaheft footer attribution intact', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Beta Masaheft' })).toHaveAttribute(
      'href',
      'https://betamasaheft.eu/',
    )
  })
})
