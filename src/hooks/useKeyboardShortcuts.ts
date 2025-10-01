import { useCallback, useEffect } from 'react'

export interface KeyboardShortcutHandlers {
  onAdd?: () => void
  onRemove?: () => void
  onClear?: () => void
  onEscape?: () => void
  onNavigateLeft?: () => void
  onNavigateRight?: () => void
  onDeleteActive?: () => void
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  excludeFromInputs?: boolean
}

export const useKeyboardShortcuts = (
  handlers: KeyboardShortcutHandlers,
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, excludeFromInputs = true } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Exclude shortcuts when typing in inputs
      if (
        excludeFromInputs &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement)
      ) {
        return
      }

      switch (event.key) {
        case 'a':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            handlers.onAdd?.()
          }
          break
        case 'Escape':
          event.preventDefault()
          handlers.onEscape?.()
          break
        case 'Delete':
        case 'Backspace':
          event.preventDefault()
          handlers.onDeleteActive?.()
          break
        case 'ArrowRight':
          event.preventDefault()
          handlers.onNavigateRight?.()
          break
        case 'ArrowLeft':
          event.preventDefault()
          handlers.onNavigateLeft?.()
          break
      }
    },
    [enabled, excludeFromInputs, handlers]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return {
    handleKeyDown,
  }
}
