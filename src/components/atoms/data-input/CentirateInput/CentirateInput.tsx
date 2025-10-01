import type React from 'react'
import type { CentirateInputProps } from './CentirateInput.props'

const CentirateInput: React.FC<CentirateInputProps> = ({
  value,
  onChange,
  min = 70, // 0.7 * 100
  max = 200, // 2.0 * 100
  step = 10, // 0.1 * 100
  label = 'Centirate',
  className = '',
  disabled = false,
}) => {
  // Convert centirate (integer) to display float (e.g., 100 -> 1.0)
  const displayValue = (value / 100).toFixed(2)
  const displayMin = (min / 100).toFixed(2)
  const displayMax = (max / 100).toFixed(2)
  const displayStep = (step / 100).toFixed(2)

  const handleChange = (newValue: string) => {
    const floatValue = parseFloat(newValue)
    if (!Number.isNaN(floatValue)) {
      // Convert float to centirate (multiply by 100)
      const centirateValue = Math.round(floatValue * 100)
      if (centirateValue >= min && centirateValue <= max) {
        onChange(centirateValue)
      }
    }
  }

  const handleSliderChange = (newValue: string) => {
    const centirateValue = parseInt(newValue, 10)
    if (!Number.isNaN(centirateValue) && centirateValue >= min && centirateValue <= max) {
      onChange(centirateValue)
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
          min={displayMin}
          max={displayMax}
          step={displayStep}
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          className="input input-bordered w-24 bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none text-center"
        />
      </div>
    </div>
  )
}

export default CentirateInput
