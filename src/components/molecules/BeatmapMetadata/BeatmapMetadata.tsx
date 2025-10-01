import type React from 'react'
import type { BeatmapMetadataProps } from './BeatmapMetadata.props'

const BeatmapMetadata: React.FC<BeatmapMetadataProps> = ({ beatmapset, className = '' }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
          {beatmapset.artist} - {beatmapset.title} by {beatmapset.creator}
        </h1>
        {beatmapset.is_featured && <span className="badge badge-primary">Featured</span>}
      </div>

      {beatmapset.source && (
        <div className="text-sm text-white/80 drop-shadow">
          <strong>Source:</strong> {beatmapset.source}
        </div>
      )}

      {beatmapset.tags && beatmapset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {beatmapset.tags.map((tag) => (
            <span key={tag} className="badge badge-outline badge-sm text-white border-white">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default BeatmapMetadata
