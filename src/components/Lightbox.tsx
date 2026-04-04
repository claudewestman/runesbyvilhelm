import { useEffect, useRef, useState } from 'react'
import type { Artwork } from '../data/artworks'
import './Lightbox.css'

interface Props {
  artwork: Artwork
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function formatPrice(price: number) {
  return price.toLocaleString('sv-SE') + ' kr'
}

export default function Lightbox({ artwork, onClose, onPrev, onNext }: Props) {
  const touchStartX = useRef(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  // Reset loaded state when artwork changes
  useEffect(() => { setImgLoaded(false) }, [artwork.id])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.screenX ?? 0
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = (e.changedTouches[0]?.screenX ?? 0) - touchStartX.current
    if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev()
  }

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Artwork: ${artwork.title}`}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="lightbox__inner">
        <div className="lightbox__img-wrap">
          {!imgLoaded && <div className="lightbox__shimmer" aria-hidden="true" />}
          <img
            className={`lightbox__img${imgLoaded ? ' lightbox__img--loaded' : ''}`}
            src={artwork.image}
            alt={artwork.title}
            decoding="async"
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        <div className="lightbox__info">
          <div>
            <h2 className="lb-title">{artwork.title}</h2>
            <p className="lb-subtitle">{artwork.subtitle}</p>
          </div>
          <p className="lb-description">{artwork.description}</p>
          <p className="lb-medium">{artwork.medium}</p>

          <div className="lb-price-row">
            {artwork.sold ? (
              <span className="lb-sold-label">Sold</span>
            ) : artwork.forSale ? (
              <>
                <span className="lb-price">{formatPrice(artwork.price)}</span>
                <a
                  className="lb-buy-btn"
                  href={artwork.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Purchase this piece
                </a>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={onPrev} aria-label="Previous">‹</button>
      <button className="lightbox__nav lightbox__nav--next" onClick={onNext} aria-label="Next">›</button>
    </div>
  )
}
