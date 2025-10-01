import type React from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockTechnicalODProps = {
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  className?: string
}

const FilterBlockTechnicalOD: React.FC<FilterBlockTechnicalODProps> = ({
  min,
  max,
  onChange,
  className,
}) => {
  return (
    <FilterBlock
      kind="minmax"
      idPrefix="od"
      label="OD"
      tooltip="Overall Difficulty"
      minValue={min}
      maxValue={max}
      onMinChange={(v) => onChange(v, max)}
      onMaxChange={(v) => onChange(min, v)}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockTechnicalOD
