import type { ReaderSettings, ReadingMode } from '../types/bible'
import { useFocusTrap } from '../hooks/useFocusTrap'

interface SettingsProps {
  open: boolean
  onClose: () => void
  settings: ReaderSettings
  onUpdate: (patch: Partial<ReaderSettings>) => void
}

const READING_MODES: { value: ReadingMode; label: string; desc: string }[] = [
  { value: 'study', label: 'Study', desc: 'Word cards + translations' },
  { value: 'read', label: 'Read', desc: 'Clean English text' },
  { value: 'compare', label: 'Compare', desc: 'Side-by-side translations' },
]

export function Settings({ open, onClose, settings, onUpdate }: SettingsProps) {
  const trapRef = useFocusTrap(open, onClose)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40" onClick={onClose} role="dialog" aria-modal="true" aria-label="Settings">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel slides in from right — margin note feel */}
      <div
        ref={trapRef}
        className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-surface/98 border-l border-border/40
                   shadow-[−8px_0_32px_rgba(0,0,0,0.3)] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-body italic text-text-muted">Settings</h2>
            <button
              onClick={onClose}
              className="p-1 text-text-faint hover:text-text-muted transition-colors cursor-pointer"
              aria-label="Close settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Reading Mode */}
          <fieldset>
            <legend className="text-[0.65rem] font-body italic tracking-wider text-accent/40 mb-3">
              Reading Mode
            </legend>
            <div className="space-y-1.5">
              {READING_MODES.map(mode => (
                <button
                  key={mode.value}
                  onClick={() => onUpdate({ readingMode: mode.value })}
                  aria-pressed={settings.readingMode === mode.value}
                  className={`w-full text-left px-3 py-2.5 rounded-sm transition-all cursor-pointer ${
                    settings.readingMode === mode.value
                      ? 'bg-accent-dim text-accent'
                      : 'hover:bg-surface-hover/40 text-text'
                  }`}
                >
                  <p className="text-sm font-body font-medium">{mode.label}</p>
                  <p className="text-xs font-body text-text-muted mt-0.5">{mode.desc}</p>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Transliteration toggle */}
          <fieldset>
            <legend className="text-[0.65rem] font-body italic tracking-wider text-accent/40 mb-3">
              Display
            </legend>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTransliteration}
                onChange={e => onUpdate({ showTransliteration: e.target.checked })}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm font-body text-text">Show transliteration</span>
            </label>
          </fieldset>

          {/* Translation sources */}
          <fieldset>
            <legend className="text-[0.65rem] font-body italic tracking-wider text-accent/40 mb-3">
              Translation Sources
            </legend>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showLxx}
                  onChange={e => onUpdate({ showLxx: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-accent"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-lxx flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-body text-text">Septuagint (Brenton)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showKjv}
                  onChange={e => onUpdate({ showKjv: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-accent"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-mt flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-body text-text">King James</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showGeezSource}
                  onChange={e => onUpdate({ showGeezSource: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-accent"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-body text-text">Ge'ez source</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showAiTranslation}
                  onChange={e => onUpdate({ showAiTranslation: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-accent"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-ai flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-body text-text">AI draft translations</span>
              </label>
            </div>
          </fieldset>

          {/* Font size */}
          <div>
            <label htmlFor="font-size-slider" className="text-[0.65rem] font-body italic tracking-wider text-accent/40 mb-3 block">
              Font Size: {settings.fontSize}px
            </label>
            <input
              id="font-size-slider"
              type="range"
              min={14}
              max={32}
              step={1}
              value={settings.fontSize}
              onChange={e => onUpdate({ fontSize: Number(e.target.value) })}
              className="w-full accent-accent"
              aria-valuenow={settings.fontSize}
              aria-valuemin={14}
              aria-valuemax={32}
            />
            <div className="flex justify-between text-xs text-text-faint mt-1 font-body italic">
              <span>Small</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
