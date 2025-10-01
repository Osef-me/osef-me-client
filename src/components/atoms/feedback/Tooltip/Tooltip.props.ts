import type React from 'react'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export type TooltipProps = {
  children: React.ReactNode
  content: string
  position?: TooltipPosition
  className?: string
}
