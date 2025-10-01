import type React from 'react'
import { MdClose } from 'react-icons/md'
import type { FilterKind } from '../FilterDropdown/FilterDropdown'

export interface FilterBlock {
  kind: FilterKind
  component: React.ReactNode
}

export interface FilterGridProps {
  blocks: FilterBlock[]
  activeIndex: number
  onRemove: (kind: FilterKind) => void
  onBlockFocus?: (index: number) => void
  onBlockBlur?: () => void
  className?: string
}

const FilterGrid: React.FC<FilterGridProps> = ({
  blocks,
  activeIndex,
  onRemove,
  onBlockFocus,
  onBlockBlur,
  className = '',
}) => {
  if (blocks.length === 0) {
    return (
      <div className="text-sm text-base-content/60 text-center py-4 border-2 border-dashed border-base-300 rounded-lg transition-colors duration-200">
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl opacity-50">🔍</div>
          <div>No filters selected</div>
          <div className="text-xs text-base-content/40">
            Click the + button or press Ctrl+A to add filters
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className}`}
      role="group"
      aria-label="Active filters"
    >
      {blocks.map((block, index) => (
        <div
          key={block.kind}
          className={`relative group transition-all duration-200 ${
            activeIndex === index ? 'ring-2 ring-primary/30 bg-base-100/50' : ''
          }`}
        >
          <button
            type="button"
            className="btn btn-ghost btn-xs absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-error/20 text-error z-10"
            onClick={() => onRemove(block.kind)}
            aria-label={`Remove ${block.kind} filter`}
            onFocus={() => onBlockFocus?.(index)}
            onBlur={onBlockBlur}
          >
            <MdClose size={14} />
          </button>
          <div className="pr-6">{block.component}</div>
          {activeIndex === index && (
            <div className="absolute inset-0 border-2 border-primary/30 rounded-lg pointer-events-none" />
          )}
        </div>
      ))}
    </div>
  )
}

export default FilterGrid
