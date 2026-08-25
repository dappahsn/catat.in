import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react'
import { getAccountById, deleteAccount } from '@/services/accounts.service'
import { getTransactions } from '@/services/transactions.service'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useI18n } from '@/contexts/I18nContext'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { AccountForm } from '@/components/accounts/AccountForm'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/utils/currency'
import { getMonthStartString, getMonthEndString } from '@/utils/date'
import type { Account } from '@/types/account'
import type { Transaction } from '@/types/transaction'
import type { TranslationKey } from '@/locales/id'

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t, language } = useI18n()

  const [account, setAccount] = useState<Account | null>(null)
  const [balance, setBalance] = useState(0)
  const [monthlyStats, setMonthlyStats] = useState({ monthlyIncome: 0, monthlyExpense: 0 })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    if (!id || !user) return
    setLoading(true)
    try {
      const data = await getAccountById(id, user.id)
      if (!data) {
        showToast(language === 'en' ? 'Account not found.' : 'Rekening tidak ditemukan.', 'error')
        navigate('/accounts', { replace: true })
        return
      }
      setAccount(data.account)
      setBalance(data.currentBalance)
      setMonthlyStats({ monthlyIncome: data.monthlyIncome, monthlyExpense: data.monthlyExpense })

      const txs = await getTransactions(user.id, {
        accountId: id,
        startDate: getMonthStartString(),
        endDate: getMonthEndString(),
      }, 0)
      setTransactions(txs.data)
      setHasMore(txs.hasMore)
      setPage(0)
    } catch {
      showToast(t('common.failed_load'), 'error')
    } finally {
      setLoading(false)
    }
  }, [id, user, navigate, showToast, t, language])

  useEffect(() => { load() }, [load])

  const loadMore = async () => {
    if (!id || !user) return
    const nextPage = page + 1
    setLoadingMore(true)
    const txs = await getTransactions(user.id, {
      accountId: id,
      startDate: getMonthStartString(),
      endDate: getMonthEndString(),
    }, nextPage)
    setTransactions((prev) => [...prev, ...txs.data])
    setHasMore(txs.hasMore)
    setPage(nextPage)
    setLoadingMore(false)
  }

  const handleDelete = async () => {
    if (!id) return
    setDeleting(true)
    try {
      await deleteAccount(id)
      showToast(language === 'en' ? 'Account deleted successfully.' : 'Rekening berhasil dihapus.', 'success')
      navigate('/accounts', { replace: true })
    } catch {
      showToast(language === 'en' ? 'Failed to delete account.' : 'Gagal menghapus rekening.', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6">
        <div className="h-8 w-48 skeleton rounded-xl mb-4" />
        <div className="h-32 skeleton rounded-2xl mb-4" />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="h-20 skeleton rounded-xl" />
          <div className="h-20 skeleton rounded-xl" />
        </div>
      </div>
    )
  }

  if (!account) return null

  const typeKey = `account.type.${account.type}` as TranslationKey

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/accounts')}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors focus:outline-none"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} className="text-slate-900 dark:text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{account.name}</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium capitalize">{t(typeKey)}</p>
        </div>
        <button
          onClick={() => setShowEditSheet(true)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-600 dark:text-slate-300 transition-colors"
          aria-label={t('account.edit')}
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors"
          aria-label={t('account.delete')}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Balance card (Deep green in light mode, Dark charcoal in dark mode) */}
      <div className="bg-[#064e3b] dark:bg-[#17181c] border border-transparent dark:border-[#262930] rounded-[24px] p-6 text-white mb-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#86efac] mb-1.5">{t('account.current_balance')}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-white dark:text-[#5eead4] tabular-nums tracking-tight">{formatCurrency(balance)}</p>
      </div>

      {/* Monthly stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white dark:bg-[#17181c] rounded-2xl p-4 border border-slate-200/80 dark:border-[#262930] shadow-2xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('account.monthly_income')}</p>
          <p className="font-bold text-sm sm:text-base text-[#10b981] dark:text-[#4ade80] tabular-nums">
            +{formatCurrency(monthlyStats.monthlyIncome)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#17181c] rounded-2xl p-4 border border-slate-200/80 dark:border-[#262930] shadow-2xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t('account.monthly_expense')}</p>
          <p className="font-bold text-sm sm:text-base text-[#ef4444] dark:text-[#f87171] tabular-nums">
            -{formatCurrency(monthlyStats.monthlyExpense)}
          </p>
        </div>
      </div>

      {/* Transaction history */}
      <h2 className="font-bold text-base text-slate-900 dark:text-white mb-3">{t('transaction.history')}</h2>
      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-8 text-center shadow-2xs">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('transaction.empty')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-[#22242a]">
          {transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              showDate
              onPress={() => navigate(`/transactions/${tx.id}`)}
            />
          ))}
          {hasMore && (
            <div className="p-3 text-center">
              <Button variant="ghost" size="sm" onClick={loadMore} loading={loadingMore}>
                {t('transaction.load_more')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Sheet */}
      <BottomSheet isOpen={showEditSheet} onClose={() => setShowEditSheet(false)} title={t('account.edit')}>
        <AccountForm
          account={account}
          onSuccess={() => { setShowEditSheet(false); load() }}
          onCancel={() => setShowEditSheet(false)}
        />
      </BottomSheet>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('account.delete_confirm')}
        description={t('account.delete_desc')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        loading={deleting}
      />
    </div>
  )
}
