import { formatCurrency } from '@/utils/currency'
import { useI18n } from '@/contexts/I18nContext'
import { ArrowDown, ArrowUp, Landmark } from 'lucide-react'

interface RecapSummaryProps {
  income: number
  expense: number
  difference: number
  loading: boolean
}

export function RecapSummaryCards({ income, expense, difference, loading }: RecapSummaryProps) {
  const { t } = useI18n()

  const diffSign = difference > 0 ? '+ ' : difference < 0 ? '- ' : ''
  const absDifference = Math.abs(difference)

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* 1. PEMASUKAN CARD */}
      <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <ArrowDown size={18} className="text-[#10b981] dark:text-[#4ade80] stroke-[2.5]" />
          <span className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
            {t('recap.income')}
          </span>
        </div>
        {loading ? (
          <div className="h-8 w-36 skeleton rounded-lg mt-1" />
        ) : (
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(income)}
          </p>
        )}
      </div>

      {/* 2. PENGELUARAN CARD */}
      <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-1.5">
          <ArrowUp size={18} className="text-[#ef4444] dark:text-[#f87171] stroke-[2.5]" />
          <span className="text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
            {t('recap.expense')}
          </span>
        </div>
        {loading ? (
          <div className="h-8 w-36 skeleton rounded-lg mt-1" />
        ) : (
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(expense)}
          </p>
        )}
      </div>

      {/* 3. SELISIH CARD (Prominent dark forest green card) */}
      <div className="bg-[#064e3b] dark:bg-[#064e3b] rounded-2xl p-4 sm:p-5 text-white shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Landmark size={18} className="text-[#86efac]" />
          <span className="text-xs font-bold tracking-wider text-[#86efac] uppercase">
            {t('recap.difference')}
          </span>
        </div>
        {loading ? (
          <div className="h-8 w-36 skeleton bg-emerald-800/60 rounded-lg mt-1" />
        ) : (
          <p className="text-xl sm:text-2xl font-extrabold text-white tabular-nums tracking-tight">
            {diffSign}{formatCurrency(absDifference)}
          </p>
        )}
      </div>
    </div>
  )
}
