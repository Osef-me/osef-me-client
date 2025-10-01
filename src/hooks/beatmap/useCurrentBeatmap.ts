import { useCallback, useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import type { Beatmapset } from '@/types/beatmap/detail'

export const useCurrentBeatmap = () => {
  const [beatmapset, setBeatmapset] = useState<Beatmapset | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCurrentBeatmap = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await invoke<Beatmapset | null>('get_current_beatmap')
      setBeatmapset(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Chargement initial
    fetchCurrentBeatmap()
    
    // Écouter les événements de changement de beatmap depuis Rust
    const unlisten = listen<Beatmapset>('beatmap-changed', (event) => {
      console.log('🎵 Beatmap changed event received:', event.payload)
      setBeatmapset(event.payload)
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [fetchCurrentBeatmap])

  return {
    beatmapset,
    loading,
    error,
    refetch: fetchCurrentBeatmap,
  }
}
