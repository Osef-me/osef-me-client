import type React from 'react'

export type FilterKind =
  | 'rating'
  | 'skillset'
  | 'bpm'
  | 'total_time'
  | 'search_term'
  | 'technical_od'
  | 'technical_status'
  | 'drain'
  | 'random'

export interface FilterOption {
  value: FilterKind
  label: string
}

export interface FilterDropdownProps {
  isOpen: boolean
  options: FilterOption[]
  onSelect: (kind: FilterKind) => void
  onClose: () => void
  className?: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  options,
  onSelect,
  onClose,
  className = '',
}) => {
  if (!isOpen) return null

  return (
    <ul
      className={`dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-56 max-h-64 overflow-y-auto transition-all duration-200 ${
        isOpen
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
      } ${className}`}
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
  )
}

export default FilterDropdown
