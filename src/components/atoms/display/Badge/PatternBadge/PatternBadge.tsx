import type React from 'react'
import Badge from '@/components/atoms/display/Badge/Badge'
import { getSkillsetColor, getSkillsetShortcut } from '@/types/beatmap/skillset'

export type SkillsetBadgeProps = {
  pattern: string
}

const SkillsetBadge: React.FC<SkillsetBadgeProps> = ({ pattern }) => {
  return (
    <Badge color={getSkillsetColor(pattern)} title={`Pattern: ${pattern}`} outline={true}>
      {getSkillsetShortcut(pattern)}
    </Badge>
  )
}

export default SkillsetBadge
export { SkillsetBadge }
