import type React from 'react'
import { StatusBadge } from '@/components/atoms'
import DifficultyRange from '@/components/atoms/data-input/DifficultyRange/DifficultyRange'
import type { BeatmapStatus } from '@/types/beatmap/status'

export type BeatmapFooterProps = {
  priorityStatus: BeatmapStatus
  minRating: number
  maxRating: number
  className?: string
}

const BeatmapFooter: React.FC<BeatmapFooterProps> = ({
  priorityStatus,
  minRating,
  maxRating,
  className,
}) => {
  return (
    <div className={`absolute bottom-2 right-2 flex gap-2 items-center ${className || ''}`}>
      {/* Status badge */}
      <StatusBadge status={priorityStatus} />

      {/* Range de difficulté */}
      <DifficultyRange minRating={minRating} maxRating={maxRating} />
    </div>
  )
}

export default BeatmapFooter
