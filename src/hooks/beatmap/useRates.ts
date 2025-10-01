import { useCallback, useEffect, useState } from 'react'
import { getRates } from '@/api/beatmap-detail'
import type { Rates } from '@/types/beatmap/detail'

export interface UseRatesOptions {
  onError?: (error: Error) => void
  onSuccess?: (rates: Rates) => void
}

export const useRates = (
  beatmapOsuId: number | undefined,
  centirate: number = 100,
  options: UseRatesOptions = {}
) => {
  const { onError, onSuccess } = options

  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchRates = useCallback(async () => {
    if (!beatmapOsuId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getRates(beatmapOsuId, centirate)
      setRates(data)
      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch rates')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [beatmapOsuId, centirate, onError, onSuccess])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  const refetch = useCallback(() => {
    fetchRates()
  }, [fetchRates])

  // Helper function to get rating by type
  const getRatingByType = useCallback(
    (ratingType: string): number | null => {
      return rates?.rating?.find((r) => r.rating_type === ratingType)?.rating || null
    },
    [rates]
  )

  // Helper function to get mania rating values
  const getManiaRating = useCallback(() => {
    const maniaRating = rates?.rating?.find(
      (r) => r.mode_rating && typeof r.mode_rating === 'object' && 'Mania' in r.mode_rating
    )
    return maniaRating?.mode_rating?.Mania || null
  }, [rates])

  return {
    rates,
    loading,
    error,
    refetch,
    getRatingByType,
    getManiaRating,
  }
}
