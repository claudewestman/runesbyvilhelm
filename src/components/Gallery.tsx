import { useState } from 'react'
import type { Artwork } from '../data/artworks'
import ArtworkCard from './ArtworkCard'
import './Gallery.css'

type Filter = 'all' | 'for-sale'

interface Props {
  artworks: Artwork[]
  onOpen: (index: number) => void
}

export default function Gallery({ artworks, onOpen }: Props) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = artworks
    .map((artwork, index) => ({ artwork, index }))
    .filter(({ artwork }) =>
      filter === 'for-sale' ? artwork.forSale && !artwork.sold : true
    )

  return (
    <section className="gallery-section">
      <h2 className="gallery-section__title">Gallery</h2>

      <div className="gallery-filters" role="group" aria-label="Filter artworks">
        <button
          className={`gallery-filter${filter === 'all' ? ' gallery-filter--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`gallery-filter${filter === 'for-sale' ? ' gallery-filter--active' : ''}`}
          onClick={() => setFilter('for-sale')}
        >
          For sale
        </button>
      </div>

      <div className="gallery-grid">
        {visible.map(({ artwork, index }) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onClick={() => onOpen(index)}
          />
        ))}
      </div>
    </section>
  )
}
