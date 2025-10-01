export type DifficultyRangeProps = {
  minRating: number
  maxRating: number
  onChange: (min: number, max: number) => void
  className?: string
}
