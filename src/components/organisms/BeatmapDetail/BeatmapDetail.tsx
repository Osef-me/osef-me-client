import type React from 'react'
import { BeatmapsetHeader, RatingSection } from '@/components/organisms'
import type { BeatmapInfo, Beatmapset, Rates } from '@/types/beatmap/detail'

interface BeatmapDetailProps {
  beatmapset: Beatmapset
  selectedBeatmap: BeatmapInfo | null
  rates: Rates | null
  ratesLoading?: boolean
  ratesError?: Error | null
  onBeatmapChange: (beatmap: BeatmapInfo) => void
  centirate: number
  onCentirateChange: (value: number) => void
  ratingType: string
  onRatingTypeChange: (value: string) => void
  showDownloadButton?: boolean
  showEditButton?: boolean
  npsData?: { nps_graph: number[]; drain_time: number } | null
  className?: string
}

const BeatmapDetail: React.FC<BeatmapDetailProps> = ({
  beatmapset,
  selectedBeatmap,
  rates,
  ratesLoading = false,
  ratesError,
  onBeatmapChange,
  centirate,
  onCentirateChange,
  ratingType,
  onRatingTypeChange,
  showDownloadButton = true,
  showEditButton = true,
  npsData,
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      <BeatmapsetHeader
        beatmapset={beatmapset}
        selectedBeatmap={selectedBeatmap}
        rates={rates}
        onBeatmapChange={onBeatmapChange}
        ratingType={ratingType}
        showDownloadButton={showDownloadButton}
      />

      <div className="mt-8">
        <RatingSection
          rates={rates}
          centirate={centirate}
          onCentirateChange={onCentirateChange}
          ratingType={ratingType}
          onRatingTypeChange={onRatingTypeChange}
          showEditButton={showEditButton}
          npsData={npsData}
        />
      </div>
    </div>
  )
}

export default BeatmapDetail
