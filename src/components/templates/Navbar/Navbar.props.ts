import type React from 'react'

export type NavbarIconComponent = React.ComponentType<{ size?: number; className?: string }>

export type NavbarLinkItem = {
  type: 'link'
  label: string
  path: string
  icon?: NavbarIconComponent
  buttonVariant?: 'outline' | 'solid'
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
}

export type NavbarDropdownItem = {
  type: 'dropdown'
  label: string
  icon?: NavbarIconComponent
  items: Array<Omit<NavbarLinkItem, 'type' | 'buttonVariant' | 'color'>>
  buttonVariant?: 'outline' | 'solid'
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'
}

export type NavbarCustomItem = {
  type: 'custom'
  render: () => React.ReactNode
}

export type NavbarActionItem = NavbarLinkItem | NavbarDropdownItem | NavbarCustomItem

export interface NavbarTemplateProps {
  brandName?: string
  actions?: NavbarActionItem[]
}
