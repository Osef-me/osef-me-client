import type React from 'react'
import MinMaxRange from '@/components/atoms/data-input/MinMaxRange/MinMaxRange'
import SearchInput from '@/components/atoms/data-input/SearchInput'
import Select from '@/components/atoms/data-input/Select/Select'

export type FilterBlockKind = 'minmax' | 'dropdown' | 'search' | 'toggle'

export type FilterBlockProps =
  | {
      kind: 'minmax'
      idPrefix: string
      label: string
      tooltip: string
      minValue?: number | undefined
      maxValue?: number | undefined
      onMinChange: (value: number | undefined) => void
      onMaxChange: (value: number | undefined) => void
      className?: string
    }
  | {
      kind: 'dropdown'
      id: string
      label: string
      value: string
      onChange: (value: string) => void
      options: { value: string; label: string }[]
      className?: string
    }
  | {
      kind: 'search'
      id: string
      label: string
      value: string
      onChange: (value: string) => void
      placeholder?: string
      className?: string
    }
  | {
      kind: 'toggle'
      id: string
      label: string
      tooltip: string
      value: boolean
      onChange: (value: boolean) => void
      className?: string
    }

const FilterBlock: React.FC<FilterBlockProps> = (props) => {
  if (props.kind === 'minmax') {
    const { idPrefix, label, tooltip, minValue, maxValue, onMinChange, onMaxChange, className } =
      props
    return (
      <MinMaxRange
        idPrefix={idPrefix}
        label={label}
        tooltip={tooltip}
        minValue={minValue}
        maxValue={maxValue}
        onMinChange={onMinChange}
        onMaxChange={onMaxChange}
        className={className || ''}
      />
    )
  }
  if (props.kind === 'dropdown') {
    const { id, label, value, onChange, options, className } = props
    return (
      <Select
        id={id}
        label={label}
        value={value}
        onChange={(v) => onChange(String(v))}
        options={options}
        className={className || ''}
      />
    )
  }
  if (props.kind === 'search') {
    const { id, value, onChange, placeholder, className } = props
    return (
      <div className={className}>
        <SearchInput
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder || 'Search…'}
        />
      </div>
    )
  }
  // toggle
  const { id, label, tooltip, value, onChange, className } = props
  return (
    <div className={`form-control ${className || ''}`} title={tooltip}>
      <label className="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          id={id}
          className="toggle toggle-primary"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="label-text">{label}</span>
      </label>
    </div>
  )
}

export default FilterBlock
