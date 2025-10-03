import type React from 'react'
import { useId } from 'react'
import FilterBlock from '../FilterBlock'
import { MdRefresh } from 'react-icons/md'

export type FilterBlockRandomProps = {
  value?: boolean
  onChange: (value?: boolean) => void
  onReroll?: () => void
  className?: string
}

const FilterBlockRandom: React.FC<FilterBlockRandomProps> = ({
  value,
  onChange,
  onReroll,
  className,
}) => {
  const randomId = useId()

  return (
    <div className={`${className || ''}`}>
      <div>
        <label htmlFor={randomId} className="text-sm font-medium text-base-content">
          Random
        </label>
      </div>
      <div className="flex items-center gap-3">
        <FilterBlock
          kind="toggle"
          id={randomId}
          label=""
          tooltip="Enable random beatmap selection"
          value={value ?? false}
          onChange={(v) => onChange(v ? true : undefined)}
        />
        {onReroll && (
          <button
            type="button"
            className="btn btn-outline btn-sm h-10 px-3"
            onClick={onReroll}
            title="Reroll beatmaps with current filters"
          >
            <MdRefresh size={16} className="mr-2" />
            Refresh
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBlockRandom
