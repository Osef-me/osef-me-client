import type React from 'react'
import { getRatingColor } from '@/utils/ratingColors'
import Badge from '../Badge'

export type DifficultyBadgeProps = {
  rating: number
  difficulty: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  rating,
  difficulty,
  size = 'xl',
  fontSize = 'md',
}) => {
  console.log('DifficultyBadge Debug:', {
    rating,
    difficulty,
    size,
    ratingColor: getRatingColor(rating),
  })

  return (
    <Badge
      color={getRatingColor(rating)}
      title={difficulty}
      outline={true}
      size={size}
      fontSize={fontSize}
    >
      {rating.toFixed(2)}
    </Badge>
  )
}

export default DifficultyBadge
export { DifficultyBadge }
