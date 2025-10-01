import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TooltipProps } from './Tooltip.props'

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const offset = 18 // Distance entre le trigger et le tooltip

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = rect.top - offset - 8 // Plus d'espace au-dessus
          left = rect.left + rect.width / 2
          break
        case 'bottom':
          top = rect.bottom + offset
          left = rect.left + rect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2
          left = rect.left - offset
          break
        case 'right':
          top = rect.top + rect.height / 2
          left = rect.right + offset
          break
      }

      setTooltipPosition({ top, left })
    }
  }, [showTooltip, position])

  const getArrowClass = () => {
    switch (position) {
      case 'top':
        return 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800'
      case 'bottom':
        return 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800'
      case 'left':
        return 'absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800'
      case 'right':
        return 'absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800'
      default:
        return ''
    }
  }

  const getTransformClass = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return 'transform -translate-x-1/2'
      case 'left':
      case 'right':
        return 'transform -translate-y-1/2'
      default:
        return ''
    }
  }

  return (
    <>
      <span
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </span>
      {showTooltip &&
        createPortal(
          <div
            className={`fixed px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap z-[9999] ${getTransformClass()}`}
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            {content}
            <div className={getArrowClass()}></div>
          </div>,
          document.body
        )}
    </>
  )
}

export default Tooltip
