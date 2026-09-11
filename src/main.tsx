import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadLexicon } from './lib/lexicon'

// Warm the optional Ge'ez gloss lexicon once at startup so getGloss() has data
// when a lexicon.json ships. Fire-and-forget: loadLexicon never throws (it falls
// back to an empty lexicon when the file is absent), so this must not block render.
void loadLexicon().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for offline support. The script lives under Vite's
// base (the site deploys to the GitHub Pages subpath `/ethiopian-bible/`), so a
// hard-coded `/sw.js` 404s in production — register relative to BASE_URL and
// scope the worker to that subpath. See src/lib/AGENTS.md on BASE_URL usage.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
