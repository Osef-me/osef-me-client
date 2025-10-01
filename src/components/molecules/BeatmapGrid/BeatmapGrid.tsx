import type React from 'react'
import type { BeatmapsetShort } from '@/types/beatmap/short'
import { BeatmapHorizontalCard } from '../BeatmapHorizontalCard'

export type BeatmapGridProps = {
  beatmapsets: BeatmapsetShort[]
  className?: string
}

const BeatmapGrid: React.FC<BeatmapGridProps> = ({ beatmapsets, className }) => {
  if (!beatmapsets || beatmapsets.length === 0) {
    return null
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className || ''}`}>
      {beatmapsets.map((beatmapset) => (
        <BeatmapHorizontalCard key={beatmapset.osu_id} beatmapset={beatmapset} />
      ))}
    </div>
  )
}

export default BeatmapGrid
