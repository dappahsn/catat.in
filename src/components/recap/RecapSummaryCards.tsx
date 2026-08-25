import { formatCurrency } from '@/utils/currency'

interface RecapSummaryProps {
  income: number
  expense: number
  difference: number
  loading: boolean
}

function StatCard({
  label, amount, colorClass, loading,
}: { label: string; amount: number; colorClass: string; loading: boolean }) {
  return (
    <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border)]">
      <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
      {loading ? (
        <div className="h-6 w-24 skeleton rounded" />
      ) : (
        <p className={`font-bold text-lg tabular-nums ${colorClass}`}>
          {formatCurrency(amount)}
        </p>
      )}
    </div>
  )
}

export function RecapSummaryCards({ income, expense, difference, loading }: RecapSummaryProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <StatCard label="Pemasukan" amount={income} colorClass="text-[var(--success-foreground)]" loading={loading} />
      <StatCard label="Pengeluaran" amount={expense} colorClass="text-[var(--danger-foreground)]" loading={loading} />
      <StatCard
        label="Selisih"
        amount={difference}
        colorClass={difference >= 0 ? 'text-[var(--success-foreground)]' : 'text-[var(--danger-foreground)]'}
        loading={loading}
      />
    </div>
  )
}
