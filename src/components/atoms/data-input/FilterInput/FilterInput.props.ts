export interface FilterInputProps {
  id: string
  label: string
  tooltip?: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  className?: string
}
