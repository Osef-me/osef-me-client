import type React from 'react'
import type { SelectProps } from './Select.props'

const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  options,
  label,
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    // Try to convert to number if the original value was a number
    const numValue = Number(newValue)
    onChange(Number.isNaN(numValue) ? newValue : numValue)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-base-content">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`select select-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
