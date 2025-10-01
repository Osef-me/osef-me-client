import type React from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockTotalTimeProps = {
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  className?: string
}

const FilterBlockTotalTime: React.FC<FilterBlockTotalTimeProps> = ({
  min,
  max,
  onChange,
  className,
}) => {
  return (
    <FilterBlock
      kind="minmax"
      idPrefix="total-time"
      label="Total time (ms)"
      tooltip="total time in ms"
      minValue={min}
      maxValue={max}
      onMinChange={(v) => onChange(v, max)}
      onMaxChange={(v) => onChange(min, v)}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockTotalTime
