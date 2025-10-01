import type React from 'react'
import type { RatingValueProps } from './RatingValue.props'

const RatingValue: React.FC<RatingValueProps> = ({
  value,
  label,
  className = '',
  precision = 2,
}) => {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <span className="text-lg font-semibold text-base-content">{value.toFixed(precision)}</span>
      <span className="text-xs text-base-content/70 uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default RatingValue
