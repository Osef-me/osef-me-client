import type React from 'react'
import { useId } from 'react'
import type { RatingFilter } from '@/types/beatmap/filters'
import FilterBlock from '../FilterBlock'

export type FilterBlockRatingProps = {
  value?: RatingFilter
  onChange: (value: RatingFilter) => void
  className?: string
}

const ratingTypeOptions = [
  { value: '', label: 'Any' },
  { value: 'etterna', label: 'Etterna' },
  { value: 'osu', label: 'Osu' },
  { value: 'sunnyxxy', label: 'Sunnyxxy' },
]

const FilterBlockRating: React.FC<FilterBlockRatingProps> = ({ value, onChange, className }) => {
  const ratingTypeId = useId()
  const ratingId = useId()
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className || ''}`}>
      <FilterBlock
        kind="dropdown"
        id={ratingTypeId}
        label="Rating type"
        value={value?.rating_type || ''}
        onChange={(v) => onChange({ ...value, rating_type: v })}
        options={ratingTypeOptions}
        className="col-span-1"
      />
      <FilterBlock
        kind="minmax"
        id={ratingId}
        label="Rating"
        tooltip="rating"
        minValue={value?.rating_min}
        maxValue={value?.rating_max}
        onMinChange={(v) => onChange({ ...value, rating_min: v })}
        onMaxChange={(v) => onChange({ ...value, rating_max: v })}
        className="col-span-2"
      />
    </div>
  )
}

export default FilterBlockRating
