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
  initialFilters: BeatmapListParams = {}
): UseBeatmapFiltersResult => {
  // Load persisted filters from localStorage
  const loadPersistedFilters = useCallback((): BeatmapListParams => {
    try {
      const stored = localStorage.getItem(FILTERS_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Remove page and per_page from stored filters
        const { page: _, per_page: __, ...filterParams } = parsed
        return filterParams
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
    // Remove page and per_page from filters as they are managed by useBeatmaps
    const { page: _, per_page: __, ...filterParams } = newFilters
    setFiltersState(filterParams)
  }, [])

  const updateFilters = useCallback((partial: Partial<BeatmapListParams>) => {
    // Remove page and per_page from partial as they are managed by useBeatmaps
    const { page: _, per_page: __, ...filterParams } = partial
    setFiltersState(prev => ({
      ...prev,
      ...filterParams
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState({})
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
