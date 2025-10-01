import type { BeatmapInfo, Beatmapset, Rates } from '@/types/beatmap/detail'

export interface BeatmapsetHeaderProps {
  beatmapset: Beatmapset
  selectedBeatmap?: BeatmapInfo | null
  rates?: Rates | null
  onBeatmapChange?: (beatmap: BeatmapInfo) => void
  ratingType: string
  showDownloadButton?: boolean
  className?: string
}
