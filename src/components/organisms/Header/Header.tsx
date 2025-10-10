import type React from 'react'
import { useCallback } from 'react'
import { ManiaRadarChart } from '@/components/atoms'
import BeatmapStats from '../BeatmapStats/BeatmapStats'
import { DifficultyBadgeList } from '../BeatmapsetHeader/DifficultyBadgeList'
import { BeatmapsetTitle } from '../BeatmapsetHeader/BeatmapsetTitle'
import type { BeatmapInfo, Beatmapset, Rates } from '@/types/beatmap/detail'

interface HeaderProps {
  beatmapset: Beatmapset
  selectedBeatmap: BeatmapInfo | null
  rates: Rates | null
  onBeatmapChange?: (beatmap: BeatmapInfo) => void
  ratingType: string
  className?: string
}

const Header: React.FC<HeaderProps> = ({
  beatmapset,
  selectedBeatmap,
  rates,
  onBeatmapChange,
  ratingType,
  className = '',
}) => {
  const handleBeatmapChange = useCallback((beatmapOsuId: number) => {
    const beatmap = beatmapset.beatmaps.find((b) => b.beatmap_osu_id === beatmapOsuId)
    if (beatmap) {
      onBeatmapChange?.(beatmap)
    }
  }, [beatmapset.beatmaps, onBeatmapChange])

  // Extract mania ratings for the radar chart
  const getManiaRatings = () => {
    if (!rates?.rating) return null

    // Find the rating that matches the current ratingType
    const currentRating = rates.rating.find((r) => r.rating_type === ratingType)
    if (
      currentRating?.mode_rating &&
      typeof currentRating.mode_rating === 'object' &&
      'Mania' in currentRating.mode_rating
    ) {
      const maniaData = currentRating.mode_rating.Mania
      // Check if all values are valid numbers
      const values = [
        maniaData.stream,
        maniaData.jumpstream,
        maniaData.handstream,
        maniaData.stamina,
        maniaData.jackspeed,
        maniaData.chordjack,
        maniaData.technical,
      ]

      if (values.every(val => !Number.isNaN(val) && val !== undefined && val !== null)) {
        return maniaData
      }
    }

    // If the current rating type doesn't have Mania details, try to find any rating that has them
    const maniaRating = rates.rating.find(
      (r) => r.mode_rating && typeof r.mode_rating === 'object' && 'Mania' in r.mode_rating
    )
    if (
      maniaRating?.mode_rating &&
      typeof maniaRating.mode_rating === 'object' &&
      'Mania' in maniaRating.mode_rating
    ) {
      const maniaData = maniaRating.mode_rating.Mania
      // Check if all values are valid numbers
      const values = [
        maniaData.stream,
        maniaData.jumpstream,
        maniaData.handstream,
        maniaData.stamina,
        maniaData.jackspeed,
        maniaData.chordjack,
        maniaData.technical,
      ]

      if (values.every(val => !Number.isNaN(val) && val !== undefined && val !== null)) {
        return maniaData
      }
    }
    return null
  }

  const getRatingValue = (ratingType: string): number | null => {
    if (!rates?.rating) return null

    const ratings = rates.rating
    const defaultTypes = ['etterna', 'osu', 'overall']

    // Try exact match first
    const exact = ratings.find((r) => r.rating_type === ratingType)
    if (exact && !Number.isNaN(exact.rating) && exact.rating !== undefined && exact.rating !== null) {
      return exact.rating
    }

    // Try default types
    for (const type of defaultTypes) {
      if (type !== ratingType) {
        const fallback = ratings.find((r) => r.rating_type === type)
        if (fallback && !Number.isNaN(fallback.rating) && fallback.rating !== undefined && fallback.rating !== null) {
          return fallback.rating
        }
      }
    }

    return ratings[0]?.rating && !Number.isNaN(ratings[0].rating) ? ratings[0].rating : null
  }

  const ratingValue = getRatingValue(ratingType)
  const maniaRatings = getManiaRatings()

  // Debug logs
  console.log('Header Debug:', {
    beatmapset: beatmapset.title,
    selectedBeatmap: selectedBeatmap?.name,
    ratingType,
    ratingValue,
    maniaRatings,
    hasRates: !!rates,
    ratesLength: rates?.rating?.length || 0,
  })

  return (
    <div className={`${className}`}>
      {/* Main header with background image - duplicated from BeatmapsetHeader */}
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          backgroundImage: beatmapset.cover_url ? `url(${beatmapset.cover_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '300px',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 p-6 text-white h-full flex">
          {/* Left column - badges and title */}
          <div className="flex-1 flex flex-col">
            <DifficultyBadgeList
              beatmaps={beatmapset.beatmaps}
              selectedBeatmapId={selectedBeatmap?.beatmap_osu_id}
              ratingType={ratingType}
              onBeatmapClick={handleBeatmapChange}
            />

            {selectedBeatmap && (
              <BeatmapsetTitle
                beatmapset={beatmapset}
                selectedBeatmap={selectedBeatmap}
              />
            )}
          </div>

          {/* Center column - eterna rating */}
          {maniaRatings && (
            <div className="flex-1 flex justify-center mx-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-full max-w-xs">
                <h3 className="text-sm font-medium text-white mb-2 text-center">Etterna Rating</h3>
                <div className="h-52">
                  <ManiaRadarChart maniaRating={maniaRatings} overallRating={ratingValue} height={200} />
                </div>
              </div>
            </div>
          )}

          {/* Right column - stats */}
          <div className="w-64 flex justify-end ml-6">
            <div className="w-full">
              <BeatmapStats
                selectedBeatmap={selectedBeatmap || null}
                rates={rates || null}
                onDownload={() => {}} // No download in pack maker
                beatmapsetId={beatmapset.osu_id || 0}
                showDownloadButton={false}
                className="rounded-b-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
