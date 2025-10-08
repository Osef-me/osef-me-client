import { useEffect, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { NpsData } from '@/types/beatmap/detail'

export const useCurrentNps = () => {
  const [npsData, setNpsData] = useState<NpsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCurrentNps = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await invoke<NpsData | null>('get_current_nps')
      setNpsData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentNps()
  }, [])

  return {
    npsData,
    loading,
    error,
    refetch: fetchCurrentNps,
  }
}
