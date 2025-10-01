import type React from 'react'
import Badge from '@/components/atoms/display/Badge/Badge'
import type { StatusBadgeProps } from './StatusBadge.props'

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge color={status.color} title={`Status: ${status.status}`}>
      {status.icon}
    </Badge>
  )
}

export default StatusBadge
export { StatusBadge }
