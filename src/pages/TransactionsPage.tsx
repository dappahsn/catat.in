import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useI18n } from '@/contexts/I18nContext'
import { getTransactions } from '@/services/transactions.service'
import { getAccountsWithBalances } from '@/services/accounts.service'
import { getRecapSummary } from '@/services/recap.service'
import type { Transaction, TransactionFilter, TransactionType, DatePreset } from '@/types/transaction'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionTypeSheet } from '@/components/transactions/TransactionTypeSheet'
import { TransactionFilterBar } from '@/components/transactions/TransactionFilterBar'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/utils/currency'
import { getMonthStartString, getMonthEndString, getMonthLabel } from '@/utils/date'

export function TransactionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t, language } = useI18n()

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
  const [periodStats, setPeriodStats] = useState({ income: 0, expense: 0 })

  const [showTypeSheet, setShowTypeSheet] = useState(false)
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null)
  const [showFormSheet, setShowFormSheet] = useState(false)

  const loadTransactions = useCallback(async (newFilter?: TransactionFilter) => {
    if (!user) return
    const f = newFilter ?? filter
    setLoading(true)
    try {
      const [{ data, hasMore: more }, summary] = await Promise.all([
        getTransactions(user.id, f, 0),
        getRecapSummary(user.id, f),
      ])
      setTransactions(data)
      setHasMore(more)
      setPage(0)
      setPeriodStats({ income: summary.income, expense: summary.expense })
    } catch {
      showToast(t('common.failed_load'), 'error')
    } finally {
      setLoading(false)
    }
  }, [user, filter, showToast, t])

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

  const handleFormSuccess = () => {
    setShowFormSheet(false)
    loadTransactions()
    loadBalance()
  }

  const typeLabels: Record<TransactionType, string> = {
    income: t('transaction.income'),
    expense: t('transaction.expense'),
    transfer: t('transaction.transfer'),
  }

  // Month badge label (e.g. "Agustus 2026")
  const currentDate = new Date()
  const monthBadgeLabel = getMonthLabel(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    language === 'en' ? 'en-US' : 'id-ID'
  )

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6">
      {/* === TOP HERO BALANCE CARD (as in design) === */}
      <div className="bg-white dark:bg-[#17181c] rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-[#262930] shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none mb-5">
        {/* Top Row: Title + Month badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            {t('transaction.total_balance')}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#22242a] text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{monthBadgeLabel}</span>
            <Calendar size={13} className="text-slate-500 dark:text-slate-400" />
          </div>
        </div>

        {/* Main Big Balance */}
        <div className="my-3 sm:my-4">
          {balanceLoading ? (
            <div className="h-9 w-48 skeleton rounded-xl" />
          ) : (
            <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063d35] dark:text-[#5eead4] tracking-tight tabular-nums">
              {formatCurrency(totalBalance)}
            </p>
          )}
        </div>

        {/* Bottom Row: In & Out stats */}
        <div className="flex items-center gap-8 pt-1">
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              {t('transaction.in')}
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#10b981] dark:text-[#4ade80] tabular-nums">
              +{formatCurrency(periodStats.income)}
            </p>
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-0.5 font-medium">
              {t('transaction.out')}
            </p>
            <p className="text-xs sm:text-sm font-bold text-[#ef4444] dark:text-[#f87171] tabular-nums">
              -{formatCurrency(periodStats.expense)}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-5">
        <TransactionFilterBar filter={filter} preset={preset} onApply={handleFilterChange} />
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
        onItemPress={(tItem) => navigate(`/transactions/${tItem.id}`)}
        emptySlot={
          <EmptyState
            icon="📋"
            title={t('transaction.empty')}
            description={t('transaction.empty_sub')}
            actionLabel={t('transaction.add')}
            onAction={() => setShowTypeSheet(true)}
          />
        }
      />

      {/* Floating Action Button (Dark teal in light mode, bright mint in dark mode) */}
      <button
        onClick={() => setShowTypeSheet(true)}
        className="fixed z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#064e3b] dark:bg-[#86efac] hover:bg-[#043a2c] dark:hover:bg-[#6ee7b7] text-white dark:text-[#064e3b] shadow-lg flex items-center justify-center right-4 md:right-8 transition-all active:scale-95"
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 16px)' }}
        aria-label={t('transaction.add')}
      >
        <Plus size={26} strokeWidth={2.5} />
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
          title={typeLabels[selectedType]}
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
