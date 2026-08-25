import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { getAccountBalance, getAccountMonthlyStats, deleteAccount, getAccounts } from '@/services/accounts.service'
import { getAccountTransactions } from '@/services/transactions.service'
import type { Account } from '@/types/account'
import type { Transaction } from '@/types/transaction'
import { ACCOUNT_TYPE_LABELS } from '@/types/account'
import { AccountForm } from '@/components/accounts/AccountForm'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { Skeleton, TransactionSkeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/utils/currency'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [account, setAccount] = useState<Account | null>(null)
  const [balance, setBalance] = useState(0)
  const [monthlyStats, setMonthlyStats] = useState({ monthlyIncome: 0, monthlyExpense: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    if (!id || !user) return
    setLoading(true)
    try {
      const [accounts, bal, stats, { data: txs, hasMore: more }] = await Promise.all([
        getAccounts(user.id),
        getAccountBalance(id),
        getAccountMonthlyStats(id, new Date().getFullYear(), new Date().getMonth() + 1),
        getAccountTransactions(id, 0),
      ])
      const found = accounts.find((a) => a.id === id)
      setAccount(found ?? null)
      setBalance(bal)
      setMonthlyStats(stats)
      setTransactions(txs)
      setHasMore(more)
      setPage(0)
    } catch {
      showToast('Gagal memuat detail rekening.', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, user, showToast])

  useEffect(() => { load() }, [load])

  const loadMore = async () => {
    if (!id) return
    const nextPage = page + 1
    setLoadingMore(true)
    const { data, hasMore: more } = await getAccountTransactions(id, nextPage)
    setTransactions((prev) => [...prev, ...data])
    setHasMore(more)
    setPage(nextPage)
    setLoadingMore(false)
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await deleteAccount(id)
      showToast('Rekening berhasil dihapus.', 'success')
      navigate('/accounts', { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'ACCOUNT_HAS_TRANSACTIONS') {
        showToast('Rekening masih memiliki transaksi. Hapus transaksi terlebih dahulu.', 'error')
      } else {
        showToast('Gagal menghapus rekening.', 'error')
      }
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-28 rounded-2xl mb-4" />
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <TransactionSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-[var(--text-secondary)]">Rekening tidak ditemukan.</p>
        <Button variant="ghost" onClick={() => navigate('/accounts')} className="mt-2">Kembali</Button>
      </div>
    )
  }

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/accounts')}
          className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">{account.name}</h1>
          <p className="text-xs text-[var(--text-muted)]">{ACCOUNT_TYPE_LABELS[account.type]}</p>
        </div>
        <button onClick={() => setShowEditSheet(true)} className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast" aria-label="Edit rekening">
          <Edit2 size={18} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={() => setShowDeleteDialog(true)} className="p-2 rounded-xl hover:bg-[var(--danger-light)] transition-fast" aria-label="Hapus rekening">
          <Trash2 size={18} className="text-[var(--danger)]" />
        </button>
      </div>

      {/* Balance card */}
      <div className="bg-[var(--primary)] rounded-2xl p-5 text-white mb-4">
        <p className="text-sm opacity-80 mb-1">Saldo Saat Ini</p>
        <p className="text-3xl font-bold tabular-nums">{formatCurrency(balance)}</p>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Pemasukan Bulan Ini</p>
          <p className="font-semibold text-sm text-[var(--success-foreground)] tabular-nums">
            +{formatCurrency(monthlyStats.monthlyIncome)}
          </p>
        </div>
        <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] mb-1">Pengeluaran Bulan Ini</p>
          <p className="font-semibold text-sm text-[var(--danger-foreground)] tabular-nums">
            -{formatCurrency(monthlyStats.monthlyExpense)}
          </p>
        </div>
      </div>

      {/* Transaction history */}
      <h2 className="font-semibold text-sm text-[var(--text-primary)] mb-3">Riwayat Transaksi</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] py-4 text-center">Belum ada transaksi.</p>
      ) : (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
          {transactions.map((t, i) => (
            <div key={t.id} className={i < transactions.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}>
              <TransactionItem
                transaction={t}
                onPress={() => navigate(`/transactions/${t.id}`)}
              />
            </div>
          ))}
          {hasMore && (
            <div className="p-3 text-center">
              <Button variant="ghost" size="sm" onClick={loadMore} loading={loadingMore}>
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Sheet */}
      <BottomSheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title="Edit Rekening">
        <AccountForm
          account={account}
          onSuccess={() => { setShowEditSheet(false); load() }}
          onCancel={() => setShowEditSheet(false)}
        />
      </BottomSheet>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus rekening?"
        description="Rekening ini akan dihapus secara permanen. Transaksi yang terhubung harus dihapus terlebih dahulu."
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        loading={deleting}
      />
    </div>
  )
}
