import type React from 'react'
import { MdInfoOutline as Info } from 'react-icons/md'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'

export interface PatternSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  className?: string
}

// Couleurs pour chaque pattern
const PATTERN_COLORS: Record<string, string> = {
  '': 'text-base-content', // All patterns - couleur par défaut
  stream: 'text-blue-500',
  jumpstream: 'text-green-500',
  handstream: 'text-purple-500',
  stamina: 'text-red-500',
  jackspeed: 'text-orange-500',
  chordjack: 'text-pink-500',
  technical: 'text-cyan-500',
  hybrid: 'text-yellow-500',
  ln: 'text-indigo-500',
}

const PATTERN_OPTIONS = [
  { value: '', label: 'All patterns' },
  { value: 'stream', label: 'Stream' },
  { value: 'jumpstream', label: 'Jumpstream' },
  { value: 'handstream', label: 'Handstream' },
  { value: 'stamina', label: 'Stamina' },
  { value: 'jackspeed', label: 'Jackspeed' },
  { value: 'chordjack', label: 'Chordjack' },
  { value: 'technical', label: 'Technical' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'ln', label: 'LN' },
]

// Helper component for labels with tooltips
const LabelWithTooltip: React.FC<{ label: string; tooltip: string }> = ({ label, tooltip }) => (
  <div className="flex items-center gap-1">
    <span className="text-sm font-medium text-base-content">{label}</span>
    <Tooltip content={tooltip} position="top">
      <Info size={14} className="text-base-content/60 hover:text-base-content cursor-help" />
    </Tooltip>
  </div>
)

const PatternSelect: React.FC<PatternSelectProps> = ({
  id = 'pattern-select',
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <LabelWithTooltip
        label="Pattern"
        tooltip="Filter by specific skillset pattern (Stream, Jumpstream, etc.)"
      />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none"
      >
        {PATTERN_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={PATTERN_COLORS[option.value] || 'text-base-content'}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PatternSelect
