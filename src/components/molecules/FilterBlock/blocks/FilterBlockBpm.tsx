import type React from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockBpmProps = {
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  className?: string
}

const FilterBlockBpm: React.FC<FilterBlockBpmProps> = ({ min, max, onChange, className }) => {
  return (
    <FilterBlock
      kind="minmax"
      idPrefix="bpm"
      label="BPM"
      tooltip="beats per minute"
      minValue={min}
      maxValue={max}
      onMinChange={(v) => onChange(v, max)}
      onMaxChange={(v) => onChange(min, v)}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockBpm
