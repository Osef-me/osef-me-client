import type React from 'react'
import { MdAdd, MdKeyboardArrowDown } from 'react-icons/md'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'

export interface FilterAddDropdownProps {
  isOpen: boolean
  onToggle: () => void
  options: Array<{ value: string; label: string }>
  onSelect: (value: string) => void
  onClose: () => void
  disabled?: boolean
  className?: string
}

const FilterAddDropdown: React.FC<FilterAddDropdownProps> = ({
  isOpen,
  onToggle,
  options,
  onSelect,
  onClose,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`dropdown dropdown-bottom ${className}`}>
      <Tooltip content="Add filter (Ctrl+A)" position="top">
        <button
          type="button"
          aria-label="Add filter"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={`btn btn-ghost btn-xs transition-all duration-200 ${
            isOpen ? 'bg-primary/10 text-primary' : 'hover:bg-base-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onToggle}
          disabled={disabled}
        >
          <MdAdd size={16} />
          <MdKeyboardArrowDown
            size={14}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </Tooltip>

      <ul
        className={`dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-56 max-h-64 overflow-y-auto transition-all duration-200 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
        aria-label="Available filters"
      >
        {options.length === 0 && (
          <li className="text-sm text-base-content/60 px-2 py-1">No more filters available</li>
        )}
        {options.map((option) => (
          <li key={option.value} role="none">
            <button
              type="button"
              role="menuitem"
              className="w-full text-left transition-colors duration-150 hover:bg-base-200 focus:bg-base-200"
              onClick={() => {
                onSelect(option.value)
                onClose()
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FilterAddDropdown
