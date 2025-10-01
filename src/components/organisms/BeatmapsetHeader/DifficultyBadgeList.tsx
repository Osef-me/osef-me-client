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
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {beatmaps.map((beatmap) => {
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

