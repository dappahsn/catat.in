import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Transaction } from '@/types/transaction'
import { deleteTransaction } from '@/services/transactions.service'
import { TransactionForm } from './TransactionForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/currency'
import { formatDateDisplay } from '@/utils/date'
import { useToast } from '@/contexts/ToastContext'
import { Edit2, Trash2 } from 'lucide-react'

interface TransactionDetailProps {
  transaction: Transaction
  onDeleted: () => void
  onEdited: () => void
}

const TYPE_LABELS: Record<string, string> = {
  income: 'Pemasukan',
  expense: 'Pengeluaran',
  transfer: 'Pindah Saldo',
}

const TYPE_COLORS: Record<string, string> = {
  income: 'text-[var(--success-foreground)]',
  expense: 'text-[var(--danger-foreground)]',
  transfer: 'text-[var(--text-secondary)]',
}

export function TransactionDetail({ transaction: t, onDeleted, onEdited }: TransactionDetailProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteTransaction(t.id)
      showToast('Transaksi berhasil dihapus.', 'success')
      setShowDeleteDialog(false)
      onDeleted()
      navigate('/transactions', { replace: true })
    } catch {
      showToast('Gagal menghapus transaksi.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const rows: { label: string; value: string; className?: string }[] = [
    { label: 'Tipe', value: TYPE_LABELS[t.type] ?? t.type },
    {
      label: 'Jumlah',
      value: `${t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}${formatCurrency(t.amount)}`,
      className: TYPE_COLORS[t.type] + ' font-semibold tabular-nums',
    },
    { label: 'Rekening', value: t.accounts?.name ?? t.account_id },
    ...(t.destination_accounts ? [{ label: 'Rekening Tujuan', value: t.destination_accounts.name }] : []),
    ...(t.categories ? [{ label: 'Kategori', value: `${t.categories.icon ?? ''} ${t.categories.name}`.trim() }] : []),
    { label: 'Tanggal', value: formatDateDisplay(t.transaction_date) },
    ...(t.notes ? [{ label: 'Catatan', value: t.notes }] : []),
  ]

  return (
    <>
      {/* Detail rows */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
        {rows.map(({ label, value, className }) => (
          <div key={label} className="flex items-start justify-between px-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
            <span className="text-sm text-[var(--text-muted)] flex-shrink-0 mr-4">{label}</span>
            <span className={`text-sm text-right text-[var(--text-primary)] ${className ?? ''}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowEditSheet(true)}
          className="gap-2"
        >
          <Edit2 size={16} aria-hidden="true" /> Edit
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={() => setShowDeleteDialog(true)}
          className="gap-2"
        >
          <Trash2 size={16} aria-hidden="true" /> Hapus
        </Button>
      </div>

      {/* Edit Sheet */}
      <BottomSheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title="Edit Transaksi">
        <TransactionForm
          type={t.type}
          transaction={t}
          onSuccess={() => { setShowEditSheet(false); onEdited() }}
          onCancel={() => setShowEditSheet(false)}
        />
      </BottomSheet>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus transaksi?"
        description="Transaksi ini akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        loading={deleting}
      />
    </>
  )
}
