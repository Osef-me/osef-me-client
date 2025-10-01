import type { BeatmapInfo, Rates } from '@/types/beatmap/detail'

export interface BeatmapInfoProps {
  beatmap: BeatmapInfo | null
  rates: Rates | null
  className?: string
}
