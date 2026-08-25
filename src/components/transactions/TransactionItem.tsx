import type { Transaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/currency'
import { formatDateShort, isToday, isYesterday } from '@/utils/date'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: () => void
  showDate?: boolean
}

const typeConfig = {
  income: { sign: '+', colorClass: 'amount-income', bgClass: 'bg-[var(--success-light)]', textClass: 'text-[var(--success-foreground)]' },
  expense: { sign: '-', colorClass: 'amount-expense', bgClass: 'bg-[var(--danger-light)]', textClass: 'text-[var(--danger-foreground)]' },
  transfer: { sign: '↔', colorClass: 'amount-transfer', bgClass: 'bg-[var(--surface-2)]', textClass: 'text-[var(--text-secondary)]' },
}

function getDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return 'Hari Ini'
  if (isYesterday(dateStr)) return 'Kemarin'
  return formatDateShort(dateStr)
}

export function TransactionItem({ transaction: t, onPress, showDate = false }: TransactionItemProps) {
  const config = typeConfig[t.type]

  const title = t.type === 'transfer'
    ? `${t.accounts?.name ?? 'Rekening'} → ${t.destination_accounts?.name ?? 'Rekening Tujuan'}`
    : (t.categories?.name ?? (t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'))

  const subtitle = t.type === 'transfer'
    ? 'Pindah Saldo'
    : t.accounts?.name

  const icon = t.type === 'transfer' ? '↔' : (t.categories?.icon ?? (t.type === 'income' ? '💰' : '💸'))

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-fast text-left min-h-[60px]"
      aria-label={`${title}, ${config.sign}${formatCurrency(t.amount)}`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-full ${config.bgClass} flex items-center justify-center text-lg flex-shrink-0`}>
        {icon}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{title}</p>
        <div className="flex items-center gap-1">
          {subtitle && <p className="text-xs text-[var(--text-muted)] truncate">{subtitle}</p>}
          {t.notes && (
            <>
              {subtitle && <span className="text-[var(--border)] text-xs">·</span>}
              <p className="text-xs text-[var(--text-muted)] truncate italic">{t.notes}</p>
            </>
          )}
        </div>
        {showDate && (
          <p className="text-xs text-[var(--text-muted)]">{getDateLabel(t.transaction_date)}</p>
        )}
      </div>

      {/* Amount */}
      <p className={`text-sm font-semibold tabular-nums flex-shrink-0 ${config.textClass}`}>
        {config.sign}{formatCurrency(t.amount)}
      </p>
    </button>
  )
}
