export interface SelectOption {
  value: string | number
  label: string
}

export interface SelectProps {
  id?: string
  value: string | number
  onChange: (value: string | number) => void
  options: SelectOption[]
  label?: string
  className?: string
  disabled?: boolean
}
