import type React from 'react'
import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade in
    setIsVisible(true)

    // Auto close after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastStyles = () => {
    const baseStyles = `
      fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300
      ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
    `

    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`
      case 'error':
        return `${baseStyles} bg-red-500 text-white`
      case 'info':
      default:
        return `${baseStyles} bg-blue-500 text-white`
    }
  }

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center gap-2">
        <span>{message}</span>
        <button
          type="button"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default Toast
