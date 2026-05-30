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

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}
