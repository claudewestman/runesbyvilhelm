import type { Artwork } from '../data/artworks'
import './ArtworkCard.css'

interface Props {
  artwork: Artwork
  onClick: () => void
}

function formatPrice(price: number) {
  return price.toLocaleString('sv-SE') + ' kr'
}

export default function ArtworkCard({ artwork, onClick }: Props) {
  const badge = artwork.sold
    ? <span className="card__badge card__badge--sold">Såld</span>
    : artwork.forSale
      ? <span className="card__badge card__badge--sale">Till salu</span>
      : null

  return (
    <article className="card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="card__img-wrap">
        <img
          className="card__img"
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
        />
        <div className="card__overlay">
          <span className="card__overlay-text">Visa</span>
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
