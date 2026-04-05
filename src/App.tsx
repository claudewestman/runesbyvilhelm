import { useState, useCallback } from 'react'
import { useArtworks } from './hooks/useArtworks'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import About from './components/About'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const { artworks, loading, error } = useArtworks()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const open = useCallback((index: number) => setActiveIndex(index), [])
  const close = useCallback(() => setActiveIndex(null), [])
  const navigate = useCallback((dir: -1 | 1) => {
    setActiveIndex(i => i === null ? null : (i + dir + artworks.length) % artworks.length)
  }, [artworks.length])

  return (
    <>
      <Hero />
      <main>
        {loading && (
          <div className="status-message">Loading gallery…</div>
        )}
        {error && (
          <div className="status-message status-message--error">
            Failed to load artworks.
          </div>
        )}
        {!loading && !error && (
          <Gallery artworks={artworks} onOpen={open} />
        )}
        <About />
        <ContactForm />
      </main>
      <Footer />
      {activeIndex !== null && artworks[activeIndex] && (
        <Lightbox
          artwork={artworks[activeIndex]}
          onClose={close}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
        />
      )}
    </>
  )
}
