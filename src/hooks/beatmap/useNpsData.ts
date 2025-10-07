import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { NpsData } from '@/types/beatmap/detail'

export const useNpsData = () => {
  const [npsData, setNpsData] = useState<NpsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateNps = useCallback(async (beatmapUrl: string) => {
    if (!beatmapUrl) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await invoke<NpsData>('calculate_nps_from_beatmap_url', {
        beatmapUrl
      })
      setNpsData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate NPS'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    npsData,
    loading,
    error,
    calculateNps
  }
}

