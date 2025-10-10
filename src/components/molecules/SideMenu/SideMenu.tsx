import type React from 'react'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  width?: string
  className?: string
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width = '500px',
  className = '',
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-black/50 z-40 cursor-default"
        onClick={onClose}
        aria-label="Close panel overlay"
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full bg-base-200 shadow-2xl z-50 overflow-y-auto ${className}`}
        style={{ width }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-base-content">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

export default SideMenu
