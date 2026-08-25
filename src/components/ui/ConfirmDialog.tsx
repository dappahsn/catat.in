import React from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  children?: React.ReactNode
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  children,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
      <div className="absolute inset-0 bg-[var(--modal-overlay)]" onClick={onCancel} aria-hidden="true" />
      <div className="modal-enter relative w-full max-w-sm bg-[var(--surface)] rounded-2xl shadow-xl p-5">
        <h2 className="font-semibold text-base text-[var(--text-primary)] mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mb-4">{description}</p>
        )}
        {children && <div className="mb-4">{children}</div>}
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} fullWidth onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
