export interface InputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  type?: 'text' | 'number'
  className?: string
  disabled?: boolean
}
