import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../data/artworks'

interface UseArtworksResult {
  artworks: Product[]
  loading: boolean
  error: string | null
}

export function useArtworks(): UseArtworksResult {
  const [artworks, setArtworks] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message)
        } else {
          setArtworks((data ?? []) as Product[])
        }
        setLoading(false)
      })
  }, [])

  return { artworks, loading, error }
}
