import clsx from 'clsx'
import type React from 'react'
import type { ButtonProps } from './Button.props'

const Button: React.FC<ButtonProps> = ({
  children,
  style = 'outline',
  color = 'primary',
  size = 'sm',
  active = false,
  joinItem = false,
  className = '',
  ...rest
}) => {
  const base = 'btn'
  const variantClass = active ? 'btn-outline' : `btn-${style}`
  const colorClass = active ? `btn-primary` : `btn-${color}`
  const sizeClass = `btn-${size}`
  const join = joinItem ? 'join-item' : ''

  return (
    <button className={clsx(base, variantClass, colorClass, sizeClass, join, className)} {...rest}>
      {children}
    </button>
  )
}

export default Button
