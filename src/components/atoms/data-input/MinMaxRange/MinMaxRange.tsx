import type React from 'react'
import FilterInput from '../FilterInput/FilterInput'

export interface MinMaxRangeProps {
  idPrefix: string
  label: string
  tooltip: string
  minValue?: number | undefined
  maxValue?: number | undefined
  onMinChange: (value: number | undefined) => void
  onMaxChange: (value: number | undefined) => void
  minPlaceholder?: string
  maxPlaceholder?: string
  className?: string
}

const MinMaxRange: React.FC<MinMaxRangeProps> = ({
  idPrefix,
  label,
  tooltip,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  className = '',
}) => {
  const handleMinChange = (value: string) => {
    onMinChange(value ? Number(value) : undefined)
  }

  const handleMaxChange = (value: string) => {
    onMaxChange(value ? Number(value) : undefined)
  }

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <FilterInput
        id={`${idPrefix}-min`}
        label={`${label} min`}
        tooltip={`Minimum ${tooltip}`}
        value={minValue?.toString() || ''}
        onChange={handleMinChange}
        placeholder={minPlaceholder}
        type="number"
      />
      <FilterInput
        id={`${idPrefix}-max`}
        label={`${label} max`}
        tooltip={`Maximum ${tooltip}`}
        value={maxValue?.toString() || ''}
        onChange={handleMaxChange}
        placeholder={maxPlaceholder}
        type="number"
      />
    </div>
  )
}

export default MinMaxRange
