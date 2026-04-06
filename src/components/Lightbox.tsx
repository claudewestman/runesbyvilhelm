import { useEffect, useRef, useState } from 'react'
import type { Artwork } from '../data/artworks'
import { formatPrice } from '../utils/formatPrice'
import './Lightbox.css'

interface Props {
  artwork: Artwork
  onClose: () => void
  onPrev: () => void
  onNext: () => void
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
          {artwork.translation && (
            <blockquote className="lb-translation">"{artwork.translation}"</blockquote>
          )}
          <p className="lb-medium">{artwork.medium}</p>

          {artwork.instagramId && (
            <a
              className="lb-instagram"
              href={`https://www.instagram.com/p/${artwork.instagramId}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="lb-instagram-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          )}

          <div className="lb-price-row">
            {artwork.sold ? (
              <span className="lb-sold-label">Sold</span>
            ) : artwork.forSale ? (
              <>
                <span className="lb-price">{formatPrice(artwork.price)}</span>
                {
                  artwork.stripeLink ? (<a
                  className="lb-buy-btn"
                  href={artwork.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Purchase this piece
                </a>) : (
                    <span className="lb-contact">Contact for purchase</span>
                  )
                }
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
