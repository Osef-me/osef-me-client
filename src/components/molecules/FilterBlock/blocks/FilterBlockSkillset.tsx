import type React from 'react'
import { useId } from 'react'
import type { SkillsetFilter, SkillsetType } from '@/types/beatmap/filters'
import FilterBlock from '../FilterBlock'

export type FilterBlockSkillsetProps = {
  value?: SkillsetFilter
  onChange: (value: SkillsetFilter | undefined) => void
  className?: string
}

const skillsetOptions: Array<{ value: SkillsetType | '', label: string }> = [
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
}) => {
  const skillsetTypeId = useId()
  
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <FilterBlock
          kind="dropdown"
          id={skillsetTypeId}
          label="Skillset"
          value={value?.pattern_type as SkillsetType || ''}
          onChange={(v) => onChange({ ...value, pattern_type: v as SkillsetType })}
          options={skillsetOptions}
        />
      </div>
      <div className="flex-[2]">
        <FilterBlock
          kind="minmax"
          idPrefix="skillset"
          label=""
          tooltip="skillset value"
          minValue={value?.pattern_min ?? undefined}
          maxValue={value?.pattern_max ?? undefined}
          onMinChange={(v) => onChange({ ...value, pattern_min: v ?? undefined })}
          onMaxChange={(v) => onChange({ ...value, pattern_max: v ?? undefined })}
        />
      </div>
    </div>
  )
}

export default FilterBlockSkillset
