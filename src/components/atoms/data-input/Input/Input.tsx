import type React from 'react'
import type { InputProps } from './Input.props'

const Input: React.FC<InputProps> = ({
  id,
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  className = '',
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-base-content">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input input-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none ${className}`}
      />
    </div>
  )
}

export default Input
