import type React from 'react'

type ButtonStyle = 'outline' | 'ghost' | 'link' | 'dash' | 'soft'
type ButtonColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  style?: ButtonStyle
  color?: ButtonColor
  size?: ButtonSize
  active?: boolean
  joinItem?: boolean
}
