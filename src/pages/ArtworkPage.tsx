import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useArtworksContext } from '../contexts/ArtworksContext'
import { formatPrice } from '../utils/formatPrice'
import Footer from '../components/Footer'
import './ArtworkPage.css'

export default function ArtworkPage() {
  const { slug } = useParams<{ slug: string }>()
  const { artworks, loading, error } = useArtworksContext()

  const index = artworks.findIndex(a => a.slug === slug)
  const artwork = artworks[index]
  const prev = index > 0 ? artworks[index - 1] : null
  const next = index < artworks.length - 1 ? artworks[index + 1] : null

  // Update page title
  useEffect(() => {
    if (artwork) {
      document.title = `${artwork.title} – Runes by Vilhelm`
    }
    return () => { document.title = 'Runes by Vilhelm – Handcrafted Viking Age Rune Carvings' }
  }, [artwork])

  if (loading) {
    return <div className="artwork-page__status">Loading…</div>
  }

  if (error || !artwork) {
    return (
      <div className="artwork-page__status">
        <p>Artwork not found.</p>
        <Link to="/" className="artwork-page__back">← Back to gallery</Link>
      </div>
    )
  }

  return (
    <>
      <div className="artwork-page">
        <nav className="artwork-page__topbar">
          <Link to="/" className="artwork-page__back">← Gallery</Link>
        </nav>

        <div className="artwork-page__layout">
          <div className="artwork-page__img-wrap">
            <img
              className="artwork-page__img"
              src={artwork.image}
              alt={artwork.title}
            />
          </div>

          <div className="artwork-page__info">
            <h1 className="artwork-page__title">{artwork.title}</h1>
            <p className="artwork-page__subtitle">{artwork.subtitle}</p>
            {artwork.translation && (
              <blockquote className="artwork-page__translation">
                "{artwork.translation}"
              </blockquote>
            )}
            <p className="artwork-page__description">{artwork.description}</p>
            <p className="artwork-page__medium">{artwork.medium}</p>

            {artwork.instagramId && (
              <a
                className="artwork-page__instagram"
                href={`https://www.instagram.com/p/${artwork.instagramId}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="artwork-page__instagram-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                View on Instagram
              </a>
            )}

            <div className="artwork-page__purchase">
              {artwork.sold && (
                <span className="artwork-page__sold">Sold</span>
              )}
              {artwork.forSale && !artwork.sold && (
                <>
                  <span className="artwork-page__price">{formatPrice(artwork.price)}</span>
                  {artwork.stripeLink && (
                    <a
                      className="artwork-page__buy"
                      href={artwork.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Purchase this piece
                    </a>
                  )}
                </>
              )}
            </div>

            <nav className="artwork-page__nav">
              {prev
                ? <Link to={`/artwork/${prev.slug}`} className="artwork-page__nav-btn">‹ {prev.title}</Link>
                : <span />
              }
              {next
                ? <Link to={`/artwork/${next.slug}`} className="artwork-page__nav-btn artwork-page__nav-btn--next">{next.title} ›</Link>
                : <span />
              }
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
