import { useCallback, useEffect, useState } from 'react'
import { getBeatmapset } from '@/api/beatmap-detail'
import type { BeatmapInfo, Beatmapset } from '@/types/beatmap/detail'

export interface UseBeatmapsetOptions {
  onError?: (error: Error) => void
  onSuccess?: (beatmapset: Beatmapset) => void
}

export const useBeatmapset = (
  beatmapsetOsuId: number | undefined,
  options: UseBeatmapsetOptions = {}
) => {
  const { onError, onSuccess } = options

  const [beatmapset, setBeatmapset] = useState<Beatmapset | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchBeatmapset = useCallback(async () => {
    if (!beatmapsetOsuId) return

    setLoading(true)
    setError(null)

    try {
      const data = await getBeatmapset(beatmapsetOsuId)
      setBeatmapset(data)
      onSuccess?.(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch beatmapset')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [beatmapsetOsuId, onError, onSuccess])

  useEffect(() => {
    fetchBeatmapset()
  }, [fetchBeatmapset])

  const refetch = useCallback(() => {
    fetchBeatmapset()
  }, [fetchBeatmapset])

  // Helper function to get first beatmap
  const getFirstBeatmap = useCallback((): BeatmapInfo | null => {
    return beatmapset?.beatmaps?.[0] || null
  }, [beatmapset])

  // Helper function to find beatmap by ID
  const getBeatmapById = useCallback(
    (beatmapOsuId: number): BeatmapInfo | null => {
      return beatmapset?.beatmaps?.find((b) => b.beatmap_osu_id === beatmapOsuId) || null
    },
    [beatmapset]
  )

  return {
    beatmapset,
    loading,
    error,
    refetch,
    getFirstBeatmap,
    getBeatmapById,
  }
}
