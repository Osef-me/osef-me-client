import type React from 'react'

export type DifficultyRangeProps = {
  minRating: number
  maxRating: number
  className?: string
}

const DifficultyRange: React.FC<DifficultyRangeProps> = ({ minRating, maxRating, className }) => {
  return (
    <div className={`text-xs text-white bg-black/50 px-2 py-1 rounded ${className || ''}`}>
      {minRating.toFixed(2)} - {maxRating.toFixed(2)}
    </div>
  )
}

export default DifficultyRange
