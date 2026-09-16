import type { Book, Verse } from '../types/bible'

/**
 * True if the string contains any Ethiopic-block character (U+1200–U+137F).
 * Used to distinguish genuine Ge'ez text from Latin/English placeholder lines.
 */
export function hasGeezScript(s: string): boolean {
  return /[ሀ-፿]/.test(s)
}

/**
 * True when a book is a placeholder / not-yet-transcribed book.
 */
export function isStubBook(book: Book): boolean {
  return book.stub === true
}

/**
 * True when a verse's geez field has NO Ge'ez script, i.e. it's an English
 * placeholder/header line rather than transcribed Ge'ez text.
 */
export function isPlaceholderVerse(verse: Pick<Verse, 'geez'>): boolean {
  return !hasGeezScript(verse.geez)
}
