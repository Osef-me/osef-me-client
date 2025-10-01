import type React from 'react'
import FilterControls from '@/components/atoms/actions/FilterControls/FilterControls'
import FilterCounter from '@/components/atoms/display/FilterCounter/FilterCounter'

import type { FilterOption } from './FilterDropdown/FilterDropdown'

export interface FilterSectionHeaderProps {
  title?: string
  isDropdownOpen: boolean
  onDropdownToggle: () => void
  onDropdownClose: () => void
  onOptionSelect: (value: string) => void
  availableOptions: FilterOption[]
  onRemoveLast: () => void
  onClearAll: () => void
  activeFilterCount: number
  canRemove?: boolean
  canClear?: boolean
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
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-3 mb-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 id="filter-section-title" className="card-title text-base font-medium">
          {title}
        </h2>
        <FilterControls
          isDropdownOpen={isDropdownOpen}
          onDropdownToggle={onDropdownToggle}
          onDropdownClose={onDropdownClose}
          onOptionSelect={onOptionSelect}
          availableOptions={availableOptions}
          onRemoveLast={onRemoveLast}
          onClearAll={onClearAll}
          canRemove={canRemove}
          canClear={canClear}
        />
      </div>

      <FilterCounter count={activeFilterCount} />
    </div>
  )
}

export default FilterSectionHeader
