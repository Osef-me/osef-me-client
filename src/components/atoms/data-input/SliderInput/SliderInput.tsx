import type React from 'react'
import type { SliderInputProps } from './SliderInput.props'

const SliderInput: React.FC<SliderInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
  label,
  className = '',
  disabled = false,
}) => {
  const handleSliderChange = (newValue: string) => {
    const numValue = parseFloat(newValue)
    if (!Number.isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue)
    }
  }

  const handleInputChange = (newValue: string) => {
    const numValue = parseFloat(newValue)
    if (!Number.isNaN(numValue)) {
      // Clamp value between min and max
      const clampedValue = Math.max(min, Math.min(max, numValue))
      onChange(clampedValue)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        {label && <span className="text-sm font-medium text-base-content min-w-[60px]">{label}</span>}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleSliderChange(e.target.value)}
          disabled={disabled}
          className="range range-primary flex-1"
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value.toFixed(1)}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          className="input input-bordered w-24 bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none text-center"
        />
      </div>
    </div>
  )
}

export default SliderInput
