import { createContext, useContext } from 'react'
import type { Product } from '../data/artworks'
import { useArtworks } from '../hooks/useArtworks'

interface ArtworksContextValue {
  artworks: Product[]
  loading: boolean
  error: string | null
}

const ArtworksContext = createContext<ArtworksContextValue>({
  artworks: [],
  loading: true,
  error: null,
})

export function ArtworksProvider({ children }: { children: React.ReactNode }) {
  const value = useArtworks()
  return <ArtworksContext.Provider value={value}>{children}</ArtworksContext.Provider>
}

export function useArtworksContext() {
  return useContext(ArtworksContext)
}
