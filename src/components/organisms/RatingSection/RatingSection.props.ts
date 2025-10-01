import type { Rates } from '@/types/beatmap/detail'

export interface RatingSectionProps {
  rates: Rates | null
  loading?: boolean
  error?: Error | null
  centirate: number
  onCentirateChange: (centirate: number) => void
  ratingType: string
  onRatingTypeChange: (ratingType: string) => void
  className?: string
}
