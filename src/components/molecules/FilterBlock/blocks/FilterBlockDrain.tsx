import type React from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockDrainProps = {
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  className?: string
}

const FilterBlockDrain: React.FC<FilterBlockDrainProps> = ({ min, max, onChange, className }) => {
  return (
    <FilterBlock
      kind="minmax"
      idPrefix="drain"
      label="Drain (s)"
      tooltip="drain time seconds"
      minValue={min}
      maxValue={max}
      onMinChange={(v) => onChange(v, max)}
      onMaxChange={(v) => onChange(min, v)}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockDrain
