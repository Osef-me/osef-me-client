import type React from 'react'
import { useId } from 'react'
import FilterBlock from '../FilterBlock'

export type FilterBlockSearchProps = {
  value?: string
  onChange: (value: string) => void
  className?: string
}

const FilterBlockSearch: React.FC<FilterBlockSearchProps> = ({ value, onChange, className }) => {
  const id = useId()
  
  return (
    <FilterBlock
      kind="search"
      id={id}
      label="Search"
      value={value || ''}
      onChange={onChange}
      className={className || 'col-span-3'}
    />
  )
}

export default FilterBlockSearch
