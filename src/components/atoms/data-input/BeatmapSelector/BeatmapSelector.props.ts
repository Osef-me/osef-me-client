import type { BeatmapInfo } from '@/types/beatmap/detail'

export interface BeatmapSelectorProps {
  beatmaps: BeatmapInfo[]
  selectedBeatmapOsuId?: number
  onBeatmapChange: (beatmapOsuId: number) => void
  label?: string
  className?: string
  disabled?: boolean
}
