import type React from 'react'
import { useId } from 'react'
import FilterControls from '@/components/atoms/actions/FilterControls/FilterControls'
import FilterCounter from '@/components/atoms/display/FilterCounter/FilterCounter'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'
import { MdContentCopy, MdContentPaste, MdRefresh } from 'react-icons/md'

import type { FilterOption } from '../FilterDropdown/FilterDropdown'

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

export interface FilterSectionHeaderProps {
  title?: string
  isDropdownOpen: boolean
  onDropdownToggle: () => void
  onDropdownClose: () => void
  onOptionSelect: (value: FilterKind) => void
  availableOptions: FilterOption[]
  onRemoveLast: () => void
  onClearAll: () => void
  activeFilterCount: number
  canRemove?: boolean
  canClear?: boolean
  onCopyFilters?: () => void
  onPasteFilters?: () => void
  onReroll?: () => void
  filterSectionId?: string
  className?: string
}

const FilterSectionHeader: React.FC<FilterSectionHeaderProps> = ({
  title = 'Filters',
  isDropdownOpen,
  onDropdownToggle,
  onDropdownClose,
  onOptionSelect,
  availableOptions,
  onRemoveLast,
  onClearAll,
  activeFilterCount,
  canRemove = true,
  canClear = true,
  onCopyFilters,
  onPasteFilters,
  onReroll,
  filterSectionId: providedFilterSectionId,
  className = '',
}) => {
  const generatedId = useId()
  const filterSectionId = providedFilterSectionId || generatedId
  const onOptionSelectString = (value: string) => onOptionSelect(value as FilterKind)
  return (
    <div className={`flex items-center justify-between gap-3 mb-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 id={`${filterSectionId}-title`} className="card-title text-base font-medium">
          {title}
        </h2>
        <FilterControls
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={onDropdownToggle}
          onDropdownClose={onDropdownClose}
          onOptionSelect={onOptionSelectString}
          availableOptions={availableOptions}
          onRemoveLast={onRemoveLast}
          onClearAll={onClearAll}
          canRemove={canRemove}
          canClear={canClear}
        />
      </div>

      <div className="flex items-center gap-2">
        <FilterCounter count={activeFilterCount} />

        {onPasteFilters && (
          <Tooltip content="Paste filters from clipboard" position="top">
            <button
              type="button"
              aria-label="Paste filters"
              className="btn btn-ghost btn-xs hover:bg-base-300 transition-all duration-200"
              onClick={onPasteFilters}
            >
              <MdContentPaste size={16} />
            </button>
          </Tooltip>
        )}

        {onReroll && (
          <Tooltip content="Reroll beatmaps with current filters" position="top">
            <button
              type="button"
              aria-label="Reroll beatmaps"
              className="btn btn-ghost btn-xs hover:bg-base-300 transition-all duration-200"
              onClick={onReroll}
            >
              <MdRefresh size={16} />
            </button>
          </Tooltip>
        )}

        {onCopyFilters && (
          <Tooltip content="Copy filters to clipboard" position="top">
            <button
              type="button"
              aria-label="Copy filters"
              className="btn btn-ghost btn-xs hover:bg-base-300 transition-all duration-200"
              onClick={onCopyFilters}
            >
              <MdContentCopy size={16} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default FilterSectionHeader
