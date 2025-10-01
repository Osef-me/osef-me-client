import type React from 'react'

export interface RatingTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  ratingTypes?: string[]
  label?: string
  className?: string
  disabled?: boolean
}
