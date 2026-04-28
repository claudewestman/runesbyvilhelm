import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useArtworksContext } from '../contexts/ArtworksContext'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'
import '../App.css'

export default function GalleryPage() {
  const { t } = useTranslation()
  const { artworks, loading, error } = useArtworksContext()
  const navigate = useNavigate()

  return (
    <>
      <Hero />
      <main>
        {loading && <div className="status-message">{t('gallery.loading')}</div>}
        {error && <div className="status-message status-message--error">{t('gallery.error')}</div>}
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
