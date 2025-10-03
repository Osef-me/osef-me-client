import { useState, useEffect, useCallback } from 'react'
import { getBeatmaps, getRandomBeatmaps } from '@/api/get_short'
import type { BeatmapListParams } from '@/types/beatmap/filters'
import type { BeatmapsetShort } from '@/types/beatmap/short'
import type { PaginatedResponse } from '@/types'

export interface UseBeatmapsOptions {
  enabled?: boolean
  onSuccess?: (data: PaginatedResponse<BeatmapsetShort>) => void
  onError?: (error: string) => void
}

export interface UseBeatmapsResult {
  data: BeatmapsetShort[]
  total: number
  currentPage: number
  totalPages: number
  loading: boolean
  error: string | null
  refetch: () => void
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const useBeatmaps = (
  params: BeatmapListParams,
  options: UseBeatmapsOptions = {}
): UseBeatmapsResult => {
  const { enabled = true, onSuccess, onError } = options

  const [data, setData] = useState<BeatmapsetShort[]>([])
  const [total, setTotal] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted] = useState<boolean>(true)

  const goToPage = useCallback((page: number) => {
    if (!enabled || loading) return
    setCurrentPage(page)
  }, [enabled, loading])

  const nextPage = useCallback(() => {
    const totalPages = Math.ceil(total / 9)
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1)
    }
  }, [currentPage, total, goToPage])

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1)
    }
  }, [currentPage, goToPage])

  const refetch = useCallback(() => {
    // Reload current page
    if (enabled) {
      const doFetch = async () => {
        try {
          setLoading(true)
          setError(null)
          const base = { ...params }

        // Flatten complex objects for API call
        const apiParams: Record<string, string | number | boolean | undefined> = {
            page: currentPage,
            per_page: 9
          }

          // Add rating parameters if rating filter exists
          if (base.rating) {
            apiParams.rating_type = base.rating.rating_type || 'etterna'
            if (base.rating.rating_min !== undefined && base.rating.rating_min !== null) {
              apiParams.rating_min = base.rating.rating_min
            }
            if (base.rating.rating_max !== undefined && base.rating.rating_max !== null) {
              apiParams.rating_max = base.rating.rating_max
            }
          }

          // Add skillset parameters if skillset filter exists
          if (base.skillset) {
            apiParams.pattern_type = base.skillset.pattern_type || ''
            if (base.skillset.pattern_min !== undefined) {
              apiParams.pattern_min = base.skillset.pattern_min
            }
            if (base.skillset.pattern_max !== undefined) {
              apiParams.pattern_max = base.skillset.pattern_max
            }
          }

          // Add beatmap parameters if beatmap filter exists
          if (base.beatmap) {
            if (base.beatmap.search_term) {
              apiParams.search_term = base.beatmap.search_term
            }
            if (base.beatmap.bpm_min !== undefined) {
              apiParams.bpm_min = base.beatmap.bpm_min
            }
            if (base.beatmap.bpm_max !== undefined) {
              apiParams.bpm_max = base.beatmap.bpm_max
            }
            if (base.beatmap.total_time_min !== undefined) {
              apiParams.total_time_min = base.beatmap.total_time_min
            }
            if (base.beatmap.total_time_max !== undefined) {
              apiParams.total_time_max = base.beatmap.total_time_max
            }
          }

          // Add technical parameters if beatmap_technical filter exists
          if (base.beatmap_technical) {
            if (base.beatmap_technical.od_min !== undefined) {
              apiParams.od_min = base.beatmap_technical.od_min
            }
            if (base.beatmap_technical.od_max !== undefined) {
              apiParams.od_max = base.beatmap_technical.od_max
            }
            if (base.beatmap_technical.status) {
              apiParams.status = base.beatmap_technical.status
            }
          }

          // Add rates parameters if rates filter exists
          if (base.rates) {
            if (base.rates.drain_time_min !== undefined) {
              apiParams.drain_time_min = base.rates.drain_time_min
            }
            if (base.rates.drain_time_max !== undefined) {
              apiParams.drain_time_max = base.rates.drain_time_max
            }
          }

          // Use random endpoint if random mode is enabled
          const apiCall = (base.random ?? false) ? getRandomBeatmaps : getBeatmaps
          const res = await apiCall(apiParams)

          if (!mounted) return

          setData(res.data)
          setTotal(res.pagination?.total ?? res.data.length)

          if (onSuccess) {
            onSuccess(res)
          }
        } catch (e: unknown) {
          if (!mounted) return

          const errorMessage = e instanceof Error ? e.message : 'Failed to load beatmaps'
          setError(errorMessage)

          if (onError) {
            onError(errorMessage)
          }
        } finally {
          if (mounted) setLoading(false)
        }
      }

      doFetch()
    }
  }, [enabled, params, currentPage, onSuccess, onError, mounted])

  // Initial load and reload when params or page change
  useEffect(() => {
    if (!enabled) return

    let isCurrent = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const base = { ...params }

        // Flatten complex objects for API call
        const apiParams: Record<string, string | number | boolean | undefined> = {
          page: currentPage,
          per_page: 9
        }

        // Add base parameters (excluding complex objects that we'll flatten)
        Object.keys(base).forEach(key => {
          if (key !== 'rating' && key !== 'skillset' && key !== 'beatmap' && key !== 'beatmap_technical' && key !== 'rates') {
            const value = base[key as keyof typeof base]
            if (value !== undefined) {
              apiParams[key] = value as string | number | boolean | undefined
            }
          }
        })

        // Add rating parameters if rating filter exists
        if (base.rating) {
          apiParams.rating_type = base.rating.rating_type || 'etterna'
          if (base.rating.rating_min !== undefined) {
            apiParams.rating_min = base.rating.rating_min
          }
          if (base.rating.rating_max !== undefined) {
            apiParams.rating_max = base.rating.rating_max
          }
        }

        // Add skillset parameters if skillset filter exists
        if (base.skillset) {
          apiParams.pattern_type = base.skillset.pattern_type || ''
          if (base.skillset.pattern_min !== undefined && base.skillset.pattern_min !== null) {
            apiParams.pattern_min = base.skillset.pattern_min
          }
          if (base.skillset.pattern_max !== undefined && base.skillset.pattern_max !== null) {
            apiParams.pattern_max = base.skillset.pattern_max
          }
        }

        // Add beatmap parameters if beatmap filter exists
        if (base.beatmap) {
          if (base.beatmap.search_term) {
            apiParams.search_term = base.beatmap.search_term
          }
          if (base.beatmap.bpm_min !== undefined) {
            apiParams.bpm_min = base.beatmap.bpm_min
          }
          if (base.beatmap.bpm_max !== undefined) {
            apiParams.bpm_max = base.beatmap.bpm_max
          }
          if (base.beatmap.total_time_min !== undefined) {
            apiParams.total_time_min = base.beatmap.total_time_min
          }
          if (base.beatmap.total_time_max !== undefined) {
            apiParams.total_time_max = base.beatmap.total_time_max
          }
        }

        // Add technical parameters if beatmap_technical filter exists
        if (base.beatmap_technical) {
          if (base.beatmap_technical.od_min !== undefined) {
            apiParams.od_min = base.beatmap_technical.od_min
          }
          if (base.beatmap_technical.od_max !== undefined) {
            apiParams.od_max = base.beatmap_technical.od_max
          }
          if (base.beatmap_technical.status) {
            apiParams.status = base.beatmap_technical.status
          }
        }

        // Add rates parameters if rates filter exists
        if (base.rates) {
          if (base.rates.drain_time_min !== undefined) {
            apiParams.drain_time_min = base.rates.drain_time_min
          }
          if (base.rates.drain_time_max !== undefined) {
            apiParams.drain_time_max = base.rates.drain_time_max
          }
        }

        // Use random endpoint if random mode is enabled
        const apiCall = (base.random ?? false) ? getRandomBeatmaps : getBeatmaps
        const res = await apiCall(apiParams)

        if (!isCurrent) return

        setData(res.data)
        setTotal(res.pagination?.total ?? res.data.length)

        if (onSuccess) {
          onSuccess(res)
        }
      } catch (e: unknown) {
        if (!isCurrent) return

        const errorMessage = e instanceof Error ? e.message : 'Failed to load beatmaps'
        setError(errorMessage)

        if (onError) {
          onError(errorMessage)
        }
      } finally {
        if (isCurrent) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isCurrent = false
    }
  }, [enabled, params, currentPage, onSuccess, onError])

  const isRandomMode = params.random ?? false
  const totalPages = Math.ceil(total / 9)

  return {
    data,
    total,
    currentPage: isRandomMode ? 0 : currentPage,
    totalPages: isRandomMode ? 1 : totalPages,
    loading,
    error,
    refetch,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: !isRandomMode && currentPage < totalPages - 1,
    hasPrevPage: !isRandomMode && currentPage > 0
  }
}
