import type React from 'react'
import type { BeatmapInfo, Beatmapset } from '@/types/beatmap/detail'

interface BeatmapsetTitleProps {
  beatmapset: Beatmapset
  selectedBeatmap: BeatmapInfo
}

export const BeatmapsetTitle: React.FC<BeatmapsetTitleProps> = ({
  beatmapset,
  selectedBeatmap,
}) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-white drop-shadow-lg">
        {beatmapset.artist} - {beatmapset.title}
      </h1>
      <p className="text-lg text-white/90 drop-shadow-md mt-1">
        {selectedBeatmap.name} by {beatmapset.creator}
      </p>
      {beatmapset.is_featured && (
        <span className="badge badge-primary mt-2">Featured</span>
      )}
    </div>
  )
}

