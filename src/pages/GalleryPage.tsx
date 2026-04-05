import { useNavigate } from 'react-router-dom'
import { useArtworksContext } from '../contexts/ArtworksContext'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import '../App.css'

export default function GalleryPage() {
  const { artworks, loading, error } = useArtworksContext()
  const navigate = useNavigate()

  return (
    <>
      <Hero />
      <main>
        {loading && <div className="status-message">Loading gallery…</div>}
        {error && <div className="status-message status-message--error">Failed to load artworks.</div>}
        {!loading && !error && (
          <Gallery
            artworks={artworks}
            onOpen={index => navigate(`/artwork/${artworks[index].slug}`)}
          />
        )}
        <About />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
