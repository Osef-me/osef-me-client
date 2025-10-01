import type React from 'react'
import { MdClose, MdRemove } from 'react-icons/md'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'
import FilterAddDropdown from '../FilterAddButton/FilterAddDropdown'

export interface FilterControlsProps {
  isDropdownOpen: boolean
  onDropdownToggle: () => void
  onDropdownClose: () => void
  onOptionSelect: (value: string) => void
  availableOptions: Array<{ value: string; label: string }>
  onRemoveLast: () => void
  onClearAll: () => void
  canRemove?: boolean
  canClear?: boolean
  className?: string
}

const FilterControls: React.FC<FilterControlsProps> = ({
  isDropdownOpen,
  onDropdownToggle,
  onDropdownClose,
  onOptionSelect,
  availableOptions,
  onRemoveLast,
  onClearAll,
  canRemove = true,
  canClear = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Add filter */}
      <FilterAddDropdown
        isOpen={isDropdownOpen}
        onToggle={onDropdownToggle}
        options={availableOptions}
        onSelect={onOptionSelect}
        onClose={onDropdownClose}
      />

      {/* Remove last filter */}
      <Tooltip content="Remove last filter (Delete)" position="top">
        <button
          type="button"
          aria-label="Remove last filter"
          className="btn btn-ghost btn-xs hover:bg-base-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canRemove}
          onClick={onRemoveLast}
        >
          <MdRemove size={16} />
        </button>
      </Tooltip>

      {/* Clear all */}
      <Tooltip content="Clear all filters (Esc)" position="top">
        <button
          type="button"
          aria-label="Clear all filters"
          className="btn btn-ghost btn-xs hover:bg-error/10 text-error transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canClear}
          onClick={onClearAll}
        >
          <MdClose size={16} />
        </button>
      </Tooltip>
    </div>
  )
}

export default FilterControls
