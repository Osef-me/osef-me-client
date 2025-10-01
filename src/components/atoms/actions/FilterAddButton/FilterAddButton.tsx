import type React from 'react'
import { MdAdd, MdKeyboardArrowDown } from 'react-icons/md'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'

export interface FilterAddButtonProps {
  isOpen: boolean
  onToggle: () => void
  disabled?: boolean
  className?: string
}

const FilterAddButton: React.FC<FilterAddButtonProps> = ({
  isOpen,
  onToggle,
  disabled = false,
  className = '',
}) => {
  return (
    <Tooltip content="Add filter (Ctrl+A)" position="top">
      <button
        type="button"
        aria-label="Add filter"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`btn btn-ghost btn-xs transition-all duration-200 ${
          isOpen ? 'bg-primary/10 text-primary' : 'hover:bg-base-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
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
  )
}

export default FilterAddButton
