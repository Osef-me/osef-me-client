import type React from 'react'
import { MdInfoOutline as Info } from 'react-icons/md'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'
import Input from '../Input/Input'

export interface FilterInputProps {
  id: string
  label: string
  tooltip: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'number'
  className?: string
}

// Helper component for labels with tooltips
const LabelWithTooltip: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <div className="flex items-center gap-1">
    <span className="text-sm font-medium text-base-content">{label}</span>
    <Tooltip content={tooltip} position="top">
      <Info size={14} className="text-base-content/60 hover:text-base-content cursor-help" />
    </Tooltip>
  </div>
)

const FilterInput: React.FC<FilterInputProps> = ({
  id,
  label,
  tooltip,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <LabelWithTooltip label={label} tooltip={tooltip} />
      <Input id={id} value={value} onChange={onChange} placeholder={placeholder} type={type} />
    </div>
  )
}

export default FilterInput
