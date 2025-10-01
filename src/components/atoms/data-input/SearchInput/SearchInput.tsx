import type React from 'react'
import FilterInput from '../FilterInput/FilterInput'
import type { SearchInputProps } from './SearchInput.props'

const SearchInput: React.FC<SearchInputProps> = ({
  id = 'search-term',
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <FilterInput
      id={id}
      label="Search"
      tooltip="Search in beatmap title, artist, or creator name"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      className={className}
    />
  )
}

export default SearchInput
