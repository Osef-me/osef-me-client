import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/atoms/feedback/Toast/Toast'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showToast = useCallback((
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
  ) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: Toast = { id, message, type, duration }

    setToasts(prev => [...prev, toast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, duration + 600) // Add buffer for animation

    return id
  }, [removeToast])

  const showSuccess = useCallback((message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const showInfo = useCallback((message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }, [showToast])

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showInfo
  }
}
