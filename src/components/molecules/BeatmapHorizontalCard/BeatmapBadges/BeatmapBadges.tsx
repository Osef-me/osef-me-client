import type React from 'react'
import { Badge, DifficultyBadge, SkillsetBadge as PatternBadge } from '@/components/atoms'

export type BeatmapBadgeMap = { rating: number; difficulty: string }

export type BeatmapBadgesProps = {
  displayedMaps: BeatmapBadgeMap[]
  remainingCount: number
  uniquePatterns: string[]
  className?: string
}

const BeatmapBadges: React.FC<BeatmapBadgesProps> = ({
  displayedMaps,
  remainingCount,
  uniquePatterns,
  className,
}) => {
  return (
    <div className={`flex justify-between items-start ${className || ''}`}>
      {/* Bubbles pour chaque beatmap - à gauche */}
      <div className="flex gap-2">
        {displayedMaps.map((m, i) => (
          <DifficultyBadge
            key={`${m.difficulty}-${i}`}
            rating={Number(m.rating ?? 0)}
            difficulty={m.difficulty}
            size="md"
            fontSize="md"
          />
        ))}
        {remainingCount > 0 && (
          <Badge color="gray" title={`${remainingCount} difficultés supplémentaires`}>
            +{remainingCount}
          </Badge>
        )}
      </div>

      {/* Patterns badges - à droite */}
      {uniquePatterns.length > 0 && (
        <div className="flex gap-1">
          {uniquePatterns.map((pattern) => (
            <PatternBadge key={pattern} pattern={pattern} />
          ))}
        </div>
      )}
    </div>
  )
}

export default BeatmapBadges
