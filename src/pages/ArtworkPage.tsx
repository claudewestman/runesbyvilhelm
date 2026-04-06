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
