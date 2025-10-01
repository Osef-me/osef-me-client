export interface MinMaxRangeProps {
  idPrefix: string
  min: number
  max: number
  step?: number
  onChange: (min: number, max: number) => void
}
