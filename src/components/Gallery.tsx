import { useState } from 'react'
import type { Artwork } from '../data/artworks'
import ArtworkCard from './ArtworkCard'
import './Gallery.css'

type Filter = 'all' | 'for-sale'

interface Props {
  readonly artworks: Artwork[]
  readonly onOpen: (index: number) => void
}

function matchesSearch(artwork: Artwork, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    (artwork.title || '').toLowerCase().includes(q) ||
    (artwork.subtitle || '').toLowerCase().includes(q) ||
    (artwork.description || '').toLowerCase().includes(q) ||
    (artwork.translation || '').toLowerCase().includes(q) ||
    (artwork.medium || '').toLowerCase().includes(q)
  )
}

export default function Gallery({ artworks, onOpen }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const visible = artworks
    .map((artwork, index) => ({ artwork, index }))
    .filter(({ artwork }) => {
      const matchesFilter = filter === 'for-sale' ? artwork.forSale && !artwork.sold : true
      return matchesFilter && matchesSearch(artwork, search)
    })

  return (
    <section className="gallery-section">
      <h2 className="gallery-section__title">Gallery</h2>

      <div className="gallery-controls">
        <div className="gallery-search">
          <svg className="gallery-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="gallery-search__input"
            type="search"
            placeholder="Search artworks…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search artworks"
          />
        </div>

        <fieldset className="gallery-filters" aria-label="Filter artworks">
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
        </fieldset>
      </div>

      {visible.length === 0 ? (
        <p className="gallery-empty">No artworks found.</p>
      ) : (
        <div className="gallery-grid">
          {visible.map(({ artwork, index }) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onClick={() => onOpen(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
