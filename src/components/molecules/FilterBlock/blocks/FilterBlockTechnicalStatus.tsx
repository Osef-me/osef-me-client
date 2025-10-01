import type React from 'react'
import { useId } from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockTechnicalStatusProps = {
  value?: string
  onChange: (value: string | undefined) => void
  className?: string
}

const statusOptions = [
  { value: '', label: 'Any' },
  { value: 'ranked', label: 'Ranked' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'loved', label: 'Loved' },
  { value: 'pending', label: 'Pending' },
  { value: 'graveyard', label: 'Graveyard' },
]

const FilterBlockTechnicalStatus: React.FC<FilterBlockTechnicalStatusProps> = ({
  value,
  onChange,
  className,
}) => {
  const id = useId()
  
  return (
    <FilterBlock
      kind="dropdown"
      id={id}
      label="Status"
      value={value || ''}
      onChange={(v) => onChange(v || undefined)}
      options={statusOptions}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockTechnicalStatus
