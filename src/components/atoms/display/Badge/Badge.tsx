import type React from 'react'
import Tooltip from '@/components/atoms/feedback/Tooltip/Tooltip'
import styles from './Badge.module.css'
import type { BadgeProps } from './Badge.props'
import { BADGE_COLOR_MAP } from './Badge.props'

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'blue',
  outline = false,
  title,
  size = 'sm',
}) => {
  const badgeClass = BADGE_COLOR_MAP[color] || 'badge-info'

  const badgeContent = (
    <div
      className={`${styles.badge} badge ${badgeClass} ${outline ? 'badge-outline' : ''} ${size ? `badge-${size}` : ''}`}
    >
      {children}
    </div>
  )

  if (title) {
    return (
      <Tooltip content={title} position="top">
        {badgeContent}
      </Tooltip>
    )
  }

  return badgeContent
}

export default Badge
