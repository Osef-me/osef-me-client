export interface RatingControlsProps {
  centirate: number
  onCentirateChange: (centirate: number) => void
  ratingType: string
  onRatingTypeChange: (ratingType: string) => void
  className?: string
  disabled?: boolean
}
