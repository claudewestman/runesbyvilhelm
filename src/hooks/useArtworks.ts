import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Artwork } from '../data/artworks'

interface UseArtworksResult {
  artworks: Artwork[]
  loading: boolean
  error: string | null
}

export function useArtworks(): UseArtworksResult {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('artworks')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setArtworks((data ?? []) as Artwork[])
        }
        setLoading(false)
      })
  }, [])

  return { artworks, loading, error }
}
