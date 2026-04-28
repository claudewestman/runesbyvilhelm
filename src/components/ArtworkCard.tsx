import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Artwork } from '../data/artworks'
import { thumbnailSrc } from '../utils/imagePaths'
import { formatPrice } from '../utils/formatPrice'
import './ArtworkCard.css'

interface Props {
  artwork: Artwork
  onClick: () => void
}


export default function ArtworkCard({ artwork, onClick }: Props) {
  const { t } = useTranslation()
  const [loaded, setLoaded] = useState(false)

  const badge = artwork.sold
    ? <span className="card__badge card__badge--sold">{t('artwork.card.sold')}</span>
    : artwork.forSale
      ? <span className="card__badge card__badge--sale">{t('artwork.card.forSale')}</span>
      : null

  return (
    <article className="card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="card__img-wrap">
        {!loaded && <div className="card__shimmer" aria-hidden="true" />}
        <img
          className={`card__img${loaded ? ' card__img--loaded' : ''}`}
          src={thumbnailSrc(artwork.image)}
          alt={artwork.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
        <div className="card__overlay">
          <span className="card__overlay-text">{t('artwork.card.view')}</span>
        </div>
        {badge}
      </div>
      <div className="card__body">
        <h3 className="card__title">{artwork.title}</h3>
        <p className="card__subtitle">{artwork.subtitle}</p>
        {artwork.forSale && !artwork.sold && (
          <p className="card__price">{formatPrice(artwork.price)}</p>
        )}
      </div>
    </article>
  )
}
