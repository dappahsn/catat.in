import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { getRecapSummary, getCategoryBreakdown } from '@/services/recap.service'
import type { RecapSummary, CategoryBreakdownItem } from '@/services/recap.service'
import type { TransactionFilter } from '@/types/transaction'
import { RecapSummaryCards } from '@/components/recap/RecapSummaryCards'
import { DonutChart } from '@/components/recap/DonutChart'
import { CategoryBreakdown } from '@/components/recap/CategoryBreakdown'
import {
  getMonthStartString, getMonthEndString,
  getMonthLabel,
} from '@/utils/date'

export function RecapPage() {
  const { user } = useAuth()
  const { language } = useI18n()
  const [chartType, setChartType] = useState<'income' | 'expense'>('expense')

  const now = new Date()
  const [monthOffset, setMonthOffset] = useState(0)

  const [summary, setSummary] = useState<RecapSummary>({ income: 0, expense: 0, difference: 0 })
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([])
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [breakdownLoading, setBreakdownLoading] = useState(true)

  const getFilter = useCallback((): TransactionFilter => {
    const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
    return { startDate: getMonthStartString(d), endDate: getMonthEndString(d) }
  }, [monthOffset]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = useCallback(async () => {
    if (!user) return
    const filter = getFilter()
    setSummaryLoading(true)
    setBreakdownLoading(true)
    try {
      const [s, b] = await Promise.all([
        getRecapSummary(user.id, filter),
        getCategoryBreakdown(user.id, chartType, filter),
      ])
      setSummary(s)
      setBreakdown(b)
    } finally {
      setSummaryLoading(false)
      setBreakdownLoading(false)
    }
  }, [user, getFilter, chartType])

  useEffect(() => { loadData() }, [loadData])

  const monthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const monthLabel = getMonthLabel(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    language === 'en' ? 'en-US' : 'id-ID'
  )

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6 pb-24">
      {/* 1. Month Navigation Card */}
      <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-3 sm:p-4 flex items-center justify-between shadow-2xs mb-4">
        <button
          onClick={() => setMonthOffset((m) => m - 1)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors focus:outline-none"
          aria-label="Bulan Sebelumnya"
        >
          <ChevronLeft size={20} strokeWidth={2.2} />
        </button>

        <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white capitalize select-none">
          {monthLabel}
        </p>

        <button
          onClick={() => setMonthOffset((m) => Math.min(m + 1, 0))}
          disabled={monthOffset >= 0}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          aria-label="Bulan Berikutnya"
        >
          <ChevronRight size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* 2. Summary Stacked Cards (Pemasukan, Pengeluaran, Selisih) */}
      <RecapSummaryCards
        income={summary.income}
        expense={summary.expense}
        difference={summary.difference}
        loading={summaryLoading}
      />

      {/* 3. Donut Chart (Distribusi Pengeluaran) */}
      <DonutChart
        data={breakdown}
        type={chartType}
        onTypeChange={(tp) => setChartType(tp)}
        loading={breakdownLoading}
      />

      {/* 4. Category Breakdown (Rincian Kategori) */}
      <CategoryBreakdown data={breakdown} loading={breakdownLoading} />
    </div>
  )
}
