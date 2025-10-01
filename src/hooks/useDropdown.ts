import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseDropdownOptions {
  initialOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const useDropdown = (options: UseDropdownOptions = {}) => {
  const { initialOpen = false, onOpen, onClose } = options
  const [isOpen, setIsOpen] = useState(initialOpen)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, close])

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
  }
}
