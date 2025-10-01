import type React from 'react'

export interface FilterCounterProps {
  count: number
  className?: string
}

const FilterCounter: React.FC<FilterCounterProps> = ({ count, className = '' }) => {
  return <div className={`text-xs text-base-content/60 font-mono ${className}`}>{count} active</div>
}

export default FilterCounter
