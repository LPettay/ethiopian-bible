import { useFocusTrap } from '../hooks/useFocusTrap'

interface HelpModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Keyboard shortcuts, mirrored from src/hooks/useKeyboardNav.ts.
 * `keys` is the visual key cap label; `desc` is what it does.
 */
const SHORTCUTS: { keys: string[]; desc: string }[] = [
  { keys: ['/'], desc: 'Open search' },
  { keys: ['Ctrl', 'K'], desc: 'Open search' },
  { keys: ['←'], desc: 'Previous chapter' },
  { keys: ['→'], desc: 'Next chapter' },
  { keys: ['b'], desc: 'Bookmark the current verse' },
  { keys: ['?'], desc: 'Show this help' },
  { keys: ['Esc'], desc: 'Close any open panel' },
]

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5
                    rounded-sm border border-border bg-surface-raised
                    text-xs font-ui text-text-muted">
      {children}
    </kbd>
  )
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  const trapRef = useFocusTrap(open, onClose)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-40"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Centered panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={trapRef}
          className="w-full max-w-sm bg-surface/98 border border-border/40 rounded-sm
                     shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 id="help-modal-title" className="text-base font-body italic text-text-muted">
                Keyboard shortcuts
              </h2>
              <button
                onClick={onClose}
                className="p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-faint hover:text-text-muted transition-colors cursor-pointer"
                aria-label="Close keyboard shortcuts"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Shortcuts table */}
            <table className="w-full border-collapse">
              <tbody>
                {SHORTCUTS.map((s, i) => (
                  <tr
                    key={`${s.desc}-${i}`}
                    className={i < SHORTCUTS.length - 1 ? 'border-b border-border/40' : ''}
                  >
                    <td className="py-2.5 pr-4 align-middle">
                      <span className="flex flex-wrap items-center gap-1">
                        {s.keys.map((k, j) => (
                          <span key={j} className="flex items-center gap-1">
                            {j > 0 && <span className="text-text-faint text-xs">+</span>}
                            <Kbd>{k}</Kbd>
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="py-2.5 text-sm font-body text-text text-right align-middle">
                      {s.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-5 text-xs font-body italic text-text-faint leading-relaxed">
              Chapter navigation and bookmarking work while reading. Shortcuts are
              ignored while typing in a text field.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
