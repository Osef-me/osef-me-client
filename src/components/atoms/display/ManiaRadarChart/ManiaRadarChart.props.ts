import type { ManiaRating } from '@/types/beatmap/detail'

export interface ManiaRadarChartProps {
  maniaRating: ManiaRating | null
  overallRating: number | null
  className?: string
}
