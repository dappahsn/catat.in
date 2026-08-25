import { useNavigate } from 'react-router-dom'
import type { Account } from '@/types/account'
import { formatCurrency } from '@/utils/currency'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import type { TranslationKey } from '@/locales/id'

interface AccountCardProps {
  account: Account
  currentBalance: number
}

export function AccountCard({ account, currentBalance }: AccountCardProps) {
  const navigate = useNavigate()
  const { t } = useI18n()

  const typeKey = `account.type.${account.type}` as TranslationKey
  const typeLabel = t(typeKey)

  return (
    <button
      onClick={() => navigate(`/accounts/${account.id}`)}
      className="w-full bg-[var(--surface)] rounded-2xl p-4 flex items-center gap-3 border border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--primary)] transition-fast text-left"
      aria-label={`${account.name}, ${formatCurrency(currentBalance)}`}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-full bg-[var(--primary-light)] flex items-center justify-center text-xl flex-shrink-0">
        {account.icon ?? '💰'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{account.name}</p>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-full mt-0.5 inline-block">
          {typeLabel}
        </span>
      </div>

      {/* Balance */}
      <div className="flex items-center gap-1">
        <p
          className={`font-semibold text-sm tabular-nums ${
            currentBalance < 0 ? 'text-[var(--danger-foreground)]' : 'text-[var(--text-primary)]'
          }`}
        >
          {formatCurrency(currentBalance)}
        </p>
        <ChevronRight size={16} className="text-[var(--text-muted)]" aria-hidden="true" />
      </div>
    </button>
  )
}
