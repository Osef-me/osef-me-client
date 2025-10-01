import type React from 'react'
import { useId } from 'react'
import type { SkillsetFilter } from '@/types/beatmap/filters'
import FilterBlock from '../FilterBlock'

export type FilterBlockSkillsetProps = {
  value?: SkillsetFilter
  onChange: (value: SkillsetFilter | undefined) => void
  className?: string
}

const patternOptions = [
  { value: '', label: 'Any' },
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

const FilterBlockSkillset: React.FC<FilterBlockSkillsetProps> = ({
  value,
  onChange,
  className,
}) => {
  const skillsetTypeId = useId()
  const skillsetId = useId()
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${className || ''}`}>
      <FilterBlock
        kind="dropdown"
        id={skillsetTypeId}
        label="Skillset"
        value={value?.pattern_type || ''}
        onChange={(v) => onChange({ ...value, pattern_type: v })}
        options={patternOptions}
        className="col-span-1"
      />
      <FilterBlock
        kind="minmax"
        id={skillsetId}
        label="Skillset"
        tooltip="skillset value"
        minValue={value?.pattern_min ?? undefined}
        maxValue={value?.pattern_max ?? undefined}
        onMinChange={(v) => onChange({ ...value, pattern_min: v ?? undefined })}
        onMaxChange={(v) => onChange({ ...value, pattern_max: v ?? undefined })}
        className="col-span-2"
      />
    </div>
  )
}

export default FilterBlockSkillset
