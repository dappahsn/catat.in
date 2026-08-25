import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { getAccountsWithBalances } from '@/services/accounts.service'
import { AccountCard } from '@/components/accounts/AccountCard'
import { AccountForm } from '@/components/accounts/AccountForm'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { AccountCardSkeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/utils/currency'
import type { AccountWithBalance } from '@/types/account'

export function AccountsPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [accounts, setAccounts] = useState<AccountWithBalance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)

  const loadAccounts = useCallback(async () => {
    if (!user) return
    try {
      setError(null)
      const data = await getAccountsWithBalances(user.id)
      setAccounts(data as AccountWithBalance[])
    } catch {
      setError(t('common.failed_load'))
    } finally {
      setLoading(false)
    }
  }, [user, t])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const totalBalance = accounts.reduce((sum, a) => sum + a.current_balance, 0)

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6 pb-24">
      {/* Hero Total Balance Card */}
      <div className="bg-[#f8f9fa] dark:bg-[#17181c] rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 border border-slate-100 dark:border-[#262930] shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none mb-4 flex flex-col items-center justify-center text-center">
        <span className="uppercase tracking-wider text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          {t('account.total')}
        </span>
        {loading ? (
          <div className="h-9 w-48 skeleton rounded-xl my-1" />
        ) : (
          <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#063d35] dark:text-[#5eead4] tracking-tight tabular-nums">
            {formatCurrency(totalBalance)}
          </p>
        )}
      </div>

      {/* Accounts List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <AccountCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-6">
          <p className="text-sm font-medium text-red-500 mb-3">{error}</p>
          <Button variant="ghost" onClick={loadAccounts}>
            {t('common.retry')}
          </Button>
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon="🏦"
          title={t('account.empty')}
          description={t('account.empty_sub')}
          actionLabel={t('account.add')}
          onAction={() => setShowAddSheet(true)}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              currentBalance={acc.current_balance}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#064e3b] dark:bg-[#86efac] text-white dark:text-[#064e3b] hover:bg-[#043a2c] dark:hover:bg-[#6ee7b7] shadow-lg flex items-center justify-center right-4 md:right-8 transition-all active:scale-95"
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 16px)' }}
        aria-label={t('account.add')}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Add Account Bottom Sheet */}
      <BottomSheet
        isOpen={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title={t('account.add')}
      >
        <AccountForm
          onSuccess={() => {
            setShowAddSheet(false)
            loadAccounts()
          }}
          onCancel={() => setShowAddSheet(false)}
        />
      </BottomSheet>
    </div>
  )
}
