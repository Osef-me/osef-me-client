import type React from 'react'
import { CentirateInput, RatingTypeSelector } from '@/components/atoms'
import type { RatingControlsProps } from './RatingControls.props'

const RatingControls: React.FC<RatingControlsProps> = ({
  centirate,
  onCentirateChange,
  ratingType,
  onRatingTypeChange,
  className = '',
  disabled = false,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1">
        <CentirateInput
          value={centirate}
          onChange={onCentirateChange}
          disabled={disabled}
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <RatingTypeSelector
          value={ratingType}
          onChange={onRatingTypeChange}
          disabled={disabled}
          label=""
          className="w-full"
        />
      </div>
    </div>
  )
}

export default RatingControls
