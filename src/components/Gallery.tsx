import type { Artwork } from '../data/artworks'
import ArtworkCard from './ArtworkCard'
import './Gallery.css'

interface Props {
  artworks: Artwork[]
  onOpen: (index: number) => void
}

export default function Gallery({ artworks, onOpen }: Props) {
  return (
    <section className="gallery-section">
      <h2 className="gallery-section__title">Gallery</h2>
      <div className="gallery-grid">
        {artworks.map((artwork, index) => (
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
