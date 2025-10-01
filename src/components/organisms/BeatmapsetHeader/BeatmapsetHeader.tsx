import type React from 'react'
import { useCallback } from 'react'
import { useDownload } from '@/hooks/useDownload'
import BeatmapStats from '../BeatmapStats/BeatmapStats'
import { DifficultyBadgeList } from './DifficultyBadgeList'
import { BeatmapsetTitle } from './BeatmapsetTitle'
import type { BeatmapsetHeaderProps } from './BeatmapsetHeader.props'

const BeatmapsetHeader: React.FC<BeatmapsetHeaderProps> = ({
  beatmapset,
  selectedBeatmap,
  rates,
  onBeatmapChange,
  ratingType,
  showDownloadButton = true,
  className = '',
}) => {
  const { downloadBeatmap } = useDownload()

  const handleBeatmapChange = useCallback((beatmapOsuId: number) => {
    const beatmap = beatmapset.beatmaps.find((b) => b.beatmap_osu_id === beatmapOsuId)
    if (beatmap) {
      onBeatmapChange?.(beatmap)
    }
  }, [beatmapset.beatmaps, onBeatmapChange])

  const handleDownload = useCallback(async () => {
    await downloadBeatmap(
      beatmapset.osu_id,
      beatmapset.title || 'Unknown',
      beatmapset.creator || 'Unknown'
    )
  }, [beatmapset.osu_id, beatmapset.title, beatmapset.creator, downloadBeatmap])

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      style={{
        backgroundImage: beatmapset.cover_url ? `url(${beatmapset.cover_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '200px',
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

        {/* Right column - stats */}
        <div className="w-64 flex justify-end ml-6">
          <div className="w-full">
            <BeatmapStats
              selectedBeatmap={selectedBeatmap || null}
              rates={rates || null}
              onDownload={handleDownload}
              beatmapsetId={beatmapset.osu_id || 0}
              showDownloadButton={showDownloadButton}
              className="rounded-b-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BeatmapsetHeader
