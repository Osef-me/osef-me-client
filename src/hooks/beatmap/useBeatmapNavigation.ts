import { useCallback, useMemo } from 'react'
import type { BeatmapInfo, Beatmapset } from '@/types/beatmap/detail'

export interface UseBeatmapNavigationOptions {
  onBeatmapChange?: (beatmap: BeatmapInfo) => void
}

export const useBeatmapNavigation = (
  beatmapset: Beatmapset | null,
  currentBeatmapOsuId?: number,
  options: UseBeatmapNavigationOptions = {}
) => {
  const { onBeatmapChange } = options

  // Get current beatmap
  const currentBeatmap = useMemo((): BeatmapInfo | null => {
    if (!beatmapset || !currentBeatmapOsuId) return null
    return beatmapset.beatmaps.find((b) => b.beatmap_osu_id === currentBeatmapOsuId) || null
  }, [beatmapset, currentBeatmapOsuId])

  // Get next beatmap
  const nextBeatmap = useMemo((): BeatmapInfo | null => {
    if (!beatmapset || !currentBeatmap) return null
    const currentIndex = beatmapset.beatmaps.findIndex(
      (b) => b.beatmap_osu_id === currentBeatmapOsuId
    )
    const nextIndex = (currentIndex + 1) % beatmapset.beatmaps.length
    return beatmapset.beatmaps[nextIndex]
  }, [beatmapset, currentBeatmap, currentBeatmapOsuId])

  // Get previous beatmap
  const previousBeatmap = useMemo((): BeatmapInfo | null => {
    if (!beatmapset || !currentBeatmap) return null
    const currentIndex = beatmapset.beatmaps.findIndex(
      (b) => b.beatmap_osu_id === currentBeatmapOsuId
    )
    const prevIndex = currentIndex === 0 ? beatmapset.beatmaps.length - 1 : currentIndex - 1
    return beatmapset.beatmaps[prevIndex]
  }, [beatmapset, currentBeatmap, currentBeatmapOsuId])

  // Navigate to specific beatmap
  const navigateToBeatmap = useCallback(
    (beatmapOsuId: number) => {
      const beatmap = beatmapset?.beatmaps.find((b) => b.beatmap_osu_id === beatmapOsuId)
      if (beatmap) {
        onBeatmapChange?.(beatmap)
      }
    },
    [beatmapset, onBeatmapChange]
  )

  // Navigate to next beatmap
  const navigateToNext = useCallback(() => {
    if (nextBeatmap) {
      onBeatmapChange?.(nextBeatmap)
    }
  }, [nextBeatmap, onBeatmapChange])

  // Navigate to previous beatmap
  const navigateToPrevious = useCallback(() => {
    if (previousBeatmap) {
      onBeatmapChange?.(previousBeatmap)
    }
  }, [previousBeatmap, onBeatmapChange])

  // Navigate to first beatmap
  const navigateToFirst = useCallback(() => {
    if (beatmapset?.beatmaps?.[0]) {
      onBeatmapChange?.(beatmapset.beatmaps[0])
    }
  }, [beatmapset, onBeatmapChange])

  // Navigate to last beatmap
  const navigateToLast = useCallback(() => {
    if (beatmapset?.beatmaps?.length) {
      const lastBeatmap = beatmapset.beatmaps[beatmapset.beatmaps.length - 1]
      onBeatmapChange?.(lastBeatmap)
    }
  }, [beatmapset, onBeatmapChange])

  // Check if navigation is possible
  const canNavigateNext = !!nextBeatmap
  const canNavigatePrevious = !!previousBeatmap
  const hasMultipleBeatmaps = (beatmapset?.beatmaps?.length || 0) > 1

  return {
    currentBeatmap,
    nextBeatmap,
    previousBeatmap,
    navigateToBeatmap,
    navigateToNext,
    navigateToPrevious,
    navigateToFirst,
    navigateToLast,
    canNavigateNext,
    canNavigatePrevious,
    hasMultipleBeatmaps,
  }
}
