import type React from 'react'
import type { RatingTypeSelectorProps } from './RatingTypeSelector.props'

const DEFAULT_RATING_TYPES = ['etterna', 'sunnyxxy', 'osu']

const RatingTypeSelector: React.FC<RatingTypeSelectorProps> = ({
  value,
  onChange,
  ratingTypes = DEFAULT_RATING_TYPES,
  label = 'Type de rating',
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-base-content">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select select-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none"
      >
        {ratingTypes.map((ratingType) => (
          <option key={ratingType} value={ratingType}>
            {ratingType.charAt(0).toUpperCase() + ratingType.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RatingTypeSelector
