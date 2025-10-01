export interface CentirateInputProps {
  value: number // centirate value (integer)
  onChange: (value: number) => void // centirate value (integer)
  min?: number // centirate min (default: 70 for 0.7)
  max?: number // centirate max (default: 200 for 2.0)
  step?: number // centirate step (default: 10 for 0.1)
  label?: string
  className?: string
  disabled?: boolean
}
