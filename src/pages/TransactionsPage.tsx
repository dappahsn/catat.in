import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { getTransactions, getAllTransactionsInRange } from '@/services/transactions.service'
import { getAccountsWithBalances } from '@/services/accounts.service'
import type { Transaction, TransactionFilter, TransactionType, DatePreset } from '@/types/transaction'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionTypeSheet } from '@/components/transactions/TransactionTypeSheet'
import { TransactionFilterBar } from '@/components/transactions/TransactionFilterBar'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/utils/currency'
import { exportTransactionsToCSV } from '@/utils/exportCsv'
import { getMonthStartString, getMonthEndString } from '@/utils/date'

export function TransactionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [filter, setFilter] = useState<TransactionFilter>({
    startDate: getMonthStartString(),
    endDate: getMonthEndString(),
  })
  const [preset, setPreset] = useState<DatePreset>('thisMonth')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalBalance, setTotalBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const [showTypeSheet, setShowTypeSheet] = useState(false)
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
  const [showFormSheet, setShowFormSheet] = useState(false)

  const loadTransactions = useCallback(async (newFilter?: TransactionFilter) => {
    if (!user) return
    const f = newFilter ?? filter
    setLoading(true)
    try {
      const { data, hasMore: more } = await getTransactions(user.id, f, 0)
      setTransactions(data)
      setHasMore(more)
      setPage(0)
    } catch {
      showToast('Gagal memuat transaksi.', 'error')
    } finally {
      setLoading(false)
    }
  }, [user, filter, showToast])

  const loadBalance = useCallback(async () => {
    if (!user) return
    setBalanceLoading(true)
    try {
      const accounts = await getAccountsWithBalances(user.id)
      const total = accounts.reduce((s, a) => s + (a as { current_balance: number }).current_balance, 0)
      setTotalBalance(total)
    } catch {
      // non-critical
    } finally {
      setBalanceLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadTransactions()
    loadBalance()
  }, [loadBalance]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (f: TransactionFilter, p: DatePreset) => {
    setFilter(f)
    setPreset(p)
    loadTransactions(f)
  }

  const handleLoadMore = async () => {
    if (!user) return
    const nextPage = page + 1
    setLoadingMore(true)
    const { data, hasMore: more } = await getTransactions(user.id, filter, nextPage)
    setTransactions((prev) => [...prev, ...data])
    setHasMore(more)
    setPage(nextPage)
    setLoadingMore(false)
  }

  const handleTypeSelect = (type: TransactionType) => {
    setSelectedType(type)
    setShowFormSheet(true)
  }

  const handleExport = async () => {
    if (!user) return
    setExporting(true)
    try {
      const data = await getAllTransactionsInRange(user.id, filter)
      if (data.length === 0) {
        showToast('Tidak ada transaksi untuk diekspor.', 'info')
        return
      }
      exportTransactionsToCSV(data)
      showToast('Ekspor berhasil.', 'success')
    } catch {
      showToast('Gagal mengekspor data.', 'error')
    } finally {
      setExporting(false)
    }
  }

  const handleFormSuccess = () => {
    setShowFormSheet(false)
    loadTransactions()
    loadBalance()
  }

  const TYPE_LABELS: Record<TransactionType, string> = {
    income: 'Pemasukan',
    expense: 'Pengeluaran',
    transfer: 'Pindah Saldo',
  }

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Transaksi</h1>
          <p className="text-sm text-[var(--text-secondary)]">Kelola semua aktivitas keuangan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-fast disabled:opacity-50"
            aria-label="Ekspor CSV"
          >
            <Download size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>
          <Button size="sm" onClick={() => setShowTypeSheet(true)} className="hidden md:flex">
            + Tambah
          </Button>
        </div>
      </div>

      {/* Total balance */}
      <div className="bg-[var(--primary)] text-white rounded-2xl p-5 mb-4">
        <p className="text-sm opacity-80 mb-1">Total Saldo</p>
        {balanceLoading ? (
          <div className="h-8 w-32 skeleton rounded-lg mt-1" />
        ) : (
          <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalBalance)}</p>
        )}
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <TransactionFilterBar filter={filter} preset={preset} onApply={handleFilterChange} />
      </div>

      {/* Transaction list */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        onItemPress={(t) => navigate(`/transactions/${t.id}`)}
        emptySlot={
          <EmptyState
            icon="📋"
            title="Belum ada transaksi"
            description="Mulai catat pemasukan dan pengeluaranmu."
            actionLabel="+ Tambah Transaksi"
            onAction={() => setShowTypeSheet(true)}
          />
        }
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setShowTypeSheet(true)}
        className="fixed z-40 w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] transition-fast flex items-center justify-center md:hidden right-4"
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 16px)' }}
        aria-label="Tambah Transaksi"
      >
        <Plus size={24} />
      </button>

      {/* Type selector sheet */}
      <TransactionTypeSheet
        isOpen={showTypeSheet}
        onClose={() => setShowTypeSheet(false)}
        onSelect={handleTypeSelect}
      />

      {/* Transaction form sheet */}
      {selectedType && (
        <BottomSheet
          isOpen={showFormSheet}
          onClose={() => setShowFormSheet(false)}
          title={TYPE_LABELS[selectedType]}
        >
          <TransactionForm
            type={selectedType}
            onSuccess={handleFormSuccess}
            onCancel={() => setShowFormSheet(false)}
          />
        </BottomSheet>
      )}
    </div>
  )
}
