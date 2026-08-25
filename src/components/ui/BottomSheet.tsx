import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end md:items-center md:justify-center md:p-4" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[var(--modal-overlay)]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet — full-width bottom on mobile, modal on desktop */}
      <div className="sheet-enter relative w-full md:max-w-md bg-[var(--surface)] rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {title && (
          <div className="px-5 pt-2 pb-3 border-b border-[var(--border)]">
            <h2 className="font-semibold text-base text-[var(--text-primary)] text-center">
              {title}
            </h2>
          </div>
        )}

        <div className="px-4 py-3 overflow-y-auto max-h-[85vh] safe-bottom">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
