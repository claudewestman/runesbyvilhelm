import { useState, useCallback } from 'react'
import { artworks } from './data/artworks'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import About from './components/About'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const open = useCallback((index: number) => setActiveIndex(index), [])
  const close = useCallback(() => setActiveIndex(null), [])
  const navigate = useCallback((dir: -1 | 1) => {
    setActiveIndex(i => i === null ? null : (i + dir + artworks.length) % artworks.length)
  }, [])

  return (
    <>
      <Hero />
      <main>
        <Gallery artworks={artworks} onOpen={open} />
        <About />
      </main>
      <Footer />
      {activeIndex !== null && (
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
