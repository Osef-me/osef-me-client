import { useState, useCallback, useEffect } from 'react'
import type { BeatmapListParams } from '@/types/beatmap/filters'

const FILTERS_STORAGE_KEY = 'osef-beatmap-filters'

export interface UseBeatmapFiltersResult {
  filters: BeatmapListParams
  setFilters: (filters: BeatmapListParams) => void
  updateFilters: (partial: Partial<BeatmapListParams>) => void
  resetFilters: () => void
  hasPersistedFilters: boolean
}

export const useBeatmapFilters = (
  initialFilters: BeatmapListParams = { page: 0, per_page: 9 }
): UseBeatmapFiltersResult => {
  // Load persisted filters from localStorage
  const loadPersistedFilters = useCallback((): BeatmapListParams => {
    try {
      const stored = localStorage.getItem(FILTERS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Ensure page and per_page are set correctly
        return { ...parsed, page: 0, per_page: 9 }
      }
    } catch (error) {
      console.warn('Failed to load persisted filters:', error)
    }
    return initialFilters
  }, [initialFilters])

  const [filters, setFiltersState] = useState<BeatmapListParams>(loadPersistedFilters)

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    try {
      const filtersToStore = { ...filters }
      // Don't store page and per_page as they are UI state
      delete filtersToStore.page
      delete filtersToStore.per_page
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filtersToStore))
    } catch (error) {
      console.warn('Failed to persist filters:', error)
    }
  }, [filters])

  const setFilters = useCallback((newFilters: BeatmapListParams) => {
    setFiltersState({ ...newFilters, page: 0, per_page: 9 })
  }, [])

  const updateFilters = useCallback((partial: Partial<BeatmapListParams>) => {
    setFiltersState(prev => ({
      ...prev,
      ...partial,
      page: 0, // Reset page when filters change
      per_page: 9
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({ page: 0, per_page: 9 })
    try {
      localStorage.removeItem(FILTERS_STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear persisted filters:', error)
    }
  }, [])

  // Check if we have persisted filters (different from initial)
  const hasPersistedFilters = JSON.stringify(filters) !== JSON.stringify(initialFilters)

  return {
    filters,
    setFilters,
    updateFilters,
    resetFilters,
    hasPersistedFilters
  }
}
