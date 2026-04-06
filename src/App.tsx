import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ReaderPage } from './pages/ReaderPage'
import { ComparePage } from './pages/ComparePage'
import { BookmarksPage } from './pages/BookmarksPage'
import { WelcomePage } from './pages/WelcomePage'
import { AboutPage } from './pages/AboutPage'
import { DiscoverPage } from './pages/DiscoverPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/read/:book/:chapter" element={<ReaderPage />} />
          <Route path="/read/:book/:chapter/:verse" element={<ReaderPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
