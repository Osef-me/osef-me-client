import { useState, useCallback, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
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

  // Auto-update from backend events when available
  useEffect(() => {
    const unlisten = listen<NpsData>('nps-calculated', (event) => {
      setNpsData(event.payload)
      try {
        // Debug log for NPS payload
        // eslint-disable-next-line no-console
        console.log('[frontend] nps-calculated received:', {
          points: Array.isArray(event.payload?.nps_graph) ? event.payload.nps_graph.length : 0,
          drain_time: event.payload?.drain_time,
        })
      } catch (_) {}
      setError(null)
      setLoading(false)
    })

    return () => {
      unlisten.then(fn => fn())
    }
  }, [])

  return {
    npsData,
    loading,
    error,
    calculateNps
  }
}

