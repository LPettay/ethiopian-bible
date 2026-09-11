import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
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
