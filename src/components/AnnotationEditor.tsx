import { useState, useEffect, useRef, useCallback } from 'react'
import type { Annotation } from '../types/bible'
import { getAnnotation, saveAnnotation, removeAnnotation } from '../lib/storage'

interface AnnotationEditorProps {
  book: string
  chapter: number
  verse: number
  /** Called when annotation is created/updated/deleted so parent can re-render indicator */
  onAnnotationChange?: () => void
}

export function AnnotationEditor({ book, chapter, verse, onAnnotationChange }: AnnotationEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('')
  const [annotation, setAnnotation] = useState<Annotation | undefined>(undefined)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load existing annotation
  useEffect(() => {
    const existing = getAnnotation(book, chapter, verse)
    setAnnotation(existing)
    setText(existing?.text ?? '')
  }, [book, chapter, verse])

  const hasAnnotation = !!annotation

  // Debounced auto-save
  const debouncedSave = useCallback(
    (newText: string) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        if (newText.trim()) {
          const saved = saveAnnotation({ book, chapter, verse, text: newText })
          setAnnotation(saved)
          onAnnotationChange?.()
        }
      }, 500)
    },
    [book, chapter, verse, onAnnotationChange]
  )

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  function handleTextChange(newText: string) {
    setText(newText)
    debouncedSave(newText)
  }

  function handleToggle() {
    const next = !isOpen
    setIsOpen(next)
    if (next) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  function handleDelete() {
    if (annotation) {
      removeAnnotation(annotation.id)
      setAnnotation(undefined)
      setText('')
      setIsOpen(false)
      onAnnotationChange?.()
    }
  }

  return (
    <div className="relative">
      {/* Note icon button */}
      <button
        onClick={handleToggle}
        className={`p-1 transition-colors cursor-pointer ${
          hasAnnotation
            ? 'text-accent'
            : 'text-text-faint hover:text-accent'
        }`}
        aria-label={hasAnnotation ? 'Edit note' : 'Add note'}
        aria-expanded={isOpen}
      >
        <svg
          className="w-3.5 h-3.5"
          aria-hidden="true"
          fill={hasAnnotation ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {/* Editor panel */}
      {isOpen && (
        <div className="mt-2 ml-0">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            placeholder="Add a note about this verse..."
            rows={3}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-text text-sm
                       leading-relaxed resize-y outline-none focus:border-accent/40 transition-colors
                       placeholder:text-text-faint"
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-text-faint text-xs">
              {text.trim() ? 'Auto-saved' : ''}
            </span>
            {hasAnnotation && (
              <button
                onClick={handleDelete}
                className="text-mt text-xs hover:text-mt/80 transition-colors cursor-pointer"
              >
                Delete note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
