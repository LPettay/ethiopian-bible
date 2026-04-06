export interface Word {
  g: string    // Ge'ez word
  t: string    // transliteration
  gl: string   // gloss
}

export interface Translations {
  lxx?: string
  kjv?: string
  'geez-source'?: string
}

export interface Verse {
  num: number
  geez: string
  translation: string
  translations?: Translations
  words: Word[]
}

export interface TranslationSource {
  name: string
  year: number
  tradition: string
}

export interface Chapter {
  book: string
  chapter: number
  note?: string
  translationSources?: Record<string, TranslationSource>
  verses: Verse[]
}

export interface Book {
  abbrev: string
  name: string
  geez_name?: string
  geez?: string
  section: string
  chapters: number
  source_id: string
  short?: string
}

export interface Bookmark {
  id: string
  book: string
  chapter: number
  verse: number
  label?: string
  note?: string
  createdAt: string
}

export interface Annotation {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  createdAt: string
  updatedAt: string
}

export type ReadingMode = 'study' | 'read' | 'compare'

export interface ReaderSettings {
  readingMode: ReadingMode
  showTransliteration: boolean
  showLxx: boolean
  showKjv: boolean
  showGeezSource: boolean
  fontSize: number
}

export const DEFAULT_SETTINGS: ReaderSettings = {
  readingMode: 'read',
  showTransliteration: true,
  showLxx: true,
  showKjv: true,
  showGeezSource: true,
  fontSize: 20,
}
