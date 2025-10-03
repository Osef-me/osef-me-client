import type React from 'react'
import { DifficultyBadge } from '@/components/atoms/display/Badge/DifficultyBadge'
import { findBestRating } from '@/utils/beatmap/rating'
import type { BeatmapInfo } from '@/types/beatmap/detail'

interface DifficultyBadgeListProps {
  beatmaps: BeatmapInfo[]
  selectedBeatmapId?: number
  ratingType: string
  onBeatmapClick: (beatmapOsuId: number) => void
}

export const DifficultyBadgeList: React.FC<DifficultyBadgeListProps> = ({
  beatmaps,
  selectedBeatmapId,
  ratingType,
  onBeatmapClick,
}) => {
  // Sort beatmaps by etterna rating (ascending), then by other ratings as fallback
  const sortedBeatmaps = [...beatmaps].sort((a, b) => {
    const ratingA = findBestRating(a, ratingType)
    const ratingB = findBestRating(b, ratingType)

    // If no ratings available, maintain original order
    if (!ratingA && !ratingB) return 0
    if (!ratingA) return 1
    if (!ratingB) return -1

    // Sort by rating value (ascending - lowest rating first)
    return ratingA.rating_value - ratingB.rating_value
  })

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {sortedBeatmaps.map((beatmap) => {
        const bestRating = findBestRating(beatmap, ratingType)
        if (!bestRating) return null

        const isSelected = selectedBeatmapId === beatmap.beatmap_osu_id

        return (
          <button
            key={beatmap.beatmap_osu_id}
            type="button"
            onClick={() => onBeatmapClick(beatmap.beatmap_osu_id)}
            className={`cursor-pointer transition-all duration-200 border-none bg-transparent p-0 ${
              isSelected ? 'opacity-80' : 'hover:opacity-90'
            }`}
            title={beatmap.name}
          >
            <DifficultyBadge
              rating={bestRating.rating_value}
              difficulty={beatmap.name}
              size="xl"
              fontSize="xl"
            />
          </button>
        )
      })}
    </div>
  )
}

