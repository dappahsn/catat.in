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
    <div className="px-4 py-5">
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('account.title')}</h1>
          <p className="text-sm text-[var(--text-secondary)]">{t('account.subtitle')}</p>
        </div>
        <Button
          onClick={() => setShowAddSheet(true)}
          size="sm"
          className="hidden md:flex"
        >
          {t('account.add')}
        </Button>
      </div>

      {/* Total balance card */}
      <div className="bg-[var(--primary)] rounded-2xl p-5 mb-5 text-white">
        <p className="text-sm opacity-80 mb-1">{t('account.total')}</p>
        <p className="text-2xl font-bold tabular-nums">{formatCurrency(totalBalance)}</p>
        <p className="text-xs opacity-60 mt-1">{accounts.length} {t('account.count')}</p>
      </div>

      {/* Accounts list */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <AccountCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--danger)]">{error}</p>
          <Button variant="ghost" onClick={loadAccounts} className="mt-2">{t('common.retry')}</Button>
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

      {/* Mobile FAB */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] transition-fast flex items-center justify-center md:hidden"
        aria-label={t('account.add')}
        style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <Plus size={24} />
      </button>

      {/* Add Account Sheet */}
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
