import type React from 'react'
import type { BeatmapSelectorProps } from './BeatmapSelector.props'

const BeatmapSelector: React.FC<BeatmapSelectorProps> = ({
  beatmaps,
  selectedBeatmapOsuId,
  onBeatmapChange,
  label = 'Difficulté',
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-base-content">{label}</span>}
      <select
        value={selectedBeatmapOsuId || ''}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10)
          if (!Number.isNaN(value)) {
            onBeatmapChange(value)
          }
        }}
        disabled={disabled}
        className="select select-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none"
      >
        <option value="" disabled>
          Sélectionner une difficulté
        </option>
        {beatmaps.map((beatmap) => (
          <option key={beatmap.beatmap_osu_id} value={beatmap.beatmap_osu_id}>
            {beatmap.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default BeatmapSelector
