import { formatCurrency } from '@/utils/currency'
import { useI18n } from '@/contexts/I18nContext'

interface RecapSummaryProps {
  income: number
  expense: number
  difference: number
  loading: boolean
}

function StatCard({
  label, amount, colorClass, loading,
}: { label: string; amount: number; colorClass: string; loading: boolean }) {
  const formatted = formatCurrency(amount)

  return (
    <div className="bg-[var(--surface)] rounded-2xl p-3 sm:p-4 border border-[var(--border)] min-w-0 flex flex-col justify-center">
      <p className="text-xs text-[var(--text-muted)] mb-1 truncate font-medium">{label}</p>
      {loading ? (
        <div className="h-6 w-16 sm:w-20 skeleton rounded" />
      ) : (
        <p
          className={`font-bold text-sm sm:text-base md:text-lg tabular-nums whitespace-nowrap truncate leading-tight ${colorClass}`}
          title={formatted}
        >
          {formatted}
        </p>
      )}
    </div>
  )
}

export function RecapSummaryCards({ income, expense, difference, loading }: RecapSummaryProps) {
  const { t } = useI18n()

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
      <StatCard
        label={t('recap.income')}
        amount={income}
        colorClass="text-[var(--success-foreground)]"
        loading={loading}
      />
      <StatCard
        label={t('recap.expense')}
        amount={expense}
        colorClass="text-[var(--danger-foreground)]"
        loading={loading}
      />
      <StatCard
        label={t('recap.difference')}
        amount={difference}
        colorClass={difference >= 0 ? 'text-[var(--success-foreground)]' : 'text-[var(--danger-foreground)]'}
        loading={loading}
      />
    </div>
  )
}
