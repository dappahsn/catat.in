import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { getRecapSummary, getCategoryBreakdown } from '@/services/recap.service'
import type { RecapSummary, CategoryBreakdownItem } from '@/services/recap.service'
import type { TransactionFilter, DatePreset } from '@/types/transaction'
import { TransactionFilterBar } from '@/components/transactions/TransactionFilterBar'
import { RecapSummaryCards } from '@/components/recap/RecapSummaryCards'
import { DonutChart } from '@/components/recap/DonutChart'
import { CategoryBreakdown } from '@/components/recap/CategoryBreakdown'
import {
  getMonthStartString, getMonthEndString,
  getYearStartString, getYearEndString,
  getMonthLabel,
} from '@/utils/date'

export function RecapPage() {
  const { user } = useAuth()
  const { language } = useI18n()
  const [chartType, setChartType] = useState<'income' | 'expense'>('expense')

  const [preset, setPreset] = useState<DatePreset>('thisMonth')
  const [filter, setFilter] = useState<TransactionFilter>({
    startDate: getMonthStartString(),
    endDate: getMonthEndString(),
  })

  const now = new Date()
  const [monthOffset, setMonthOffset] = useState(0)
  const [yearOffset, setYearOffset] = useState(0)

  const [summary, setSummary] = useState<RecapSummary>({ income: 0, expense: 0, difference: 0 })
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([])
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [breakdownLoading, setBreakdownLoading] = useState(true)

  const loadData = useCallback(async (currentFilter: TransactionFilter) => {
    if (!user) return
    setSummaryLoading(true)
    setBreakdownLoading(true)
    try {
      const [s, b] = await Promise.all([
        getRecapSummary(user.id, currentFilter),
        getCategoryBreakdown(user.id, chartType, currentFilter),
      ])
      setSummary(s)
      setBreakdown(b)
    } finally {
      setSummaryLoading(false)
      setBreakdownLoading(false)
    }
  }, [user, chartType])

  useEffect(() => {
    loadData(filter)
  }, [loadData, filter])

  const handleFilterChange = (newFilter: TransactionFilter, newPreset: DatePreset) => {
    setPreset(newPreset)
    setFilter(newFilter)
    if (newPreset === 'thisMonth') {
      setMonthOffset(0)
    } else if (newPreset === 'thisYear') {
      setYearOffset(0)
    }
  }

  const handleMonthStep = (offsetDelta: number) => {
    const nextOffset = monthOffset + offsetDelta
    if (nextOffset > 0) return
    setMonthOffset(nextOffset)
    const d = new Date(now.getFullYear(), now.getMonth() + nextOffset, 1)
    const newFilter: TransactionFilter = {
      startDate: getMonthStartString(d),
      endDate: getMonthEndString(d),
    }
    setFilter(newFilter)
  }

  const handleYearStep = (offsetDelta: number) => {
    const nextOffset = yearOffset + offsetDelta
    if (nextOffset > 0) return
    setYearOffset(nextOffset)
    const d = new Date(now.getFullYear() + nextOffset, 0, 1)
    const newFilter: TransactionFilter = {
      startDate: getYearStartString(d),
      endDate: getYearEndString(d),
    }
    setFilter(newFilter)
  }

  const activeMonthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  const monthLabel = getMonthLabel(
    activeMonthDate.getFullYear(),
    activeMonthDate.getMonth(),
    language === 'en' ? 'en-US' : 'id-ID'
  )

  const activeYear = now.getFullYear() + yearOffset

  return (
    <div className="w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-auto px-4 md:px-0 py-4 sm:py-6 pb-24">
      {/* 1. Date Filter Bar (Hari ini, Kemarin, 7 hari terakhir, Bulan ini, Tahun ini, Custom) */}
      <div className="mb-4">
        <TransactionFilterBar filter={filter} preset={preset} onApply={handleFilterChange} />
      </div>

      {/* 2. Month Navigation Stepper (visible when 'thisMonth' preset is active) */}
      {preset === 'thisMonth' && (
        <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-3 sm:p-4 flex items-center justify-between shadow-2xs mb-4">
          <button
            onClick={() => handleMonthStep(-1)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors focus:outline-none"
            aria-label="Bulan Sebelumnya"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white capitalize select-none">
            {monthLabel}
          </p>

          <button
            onClick={() => handleMonthStep(1)}
            disabled={monthOffset >= 0}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
            aria-label="Bulan Berikutnya"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* 3. Year Navigation Stepper (visible when 'thisYear' preset is active) */}
      {preset === 'thisYear' && (
        <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-3 sm:p-4 flex items-center justify-between shadow-2xs mb-4">
          <button
            onClick={() => handleYearStep(-1)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors focus:outline-none"
            aria-label="Tahun Sebelumnya"
          >
            <ChevronLeft size={20} strokeWidth={2.2} />
          </button>

          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white capitalize select-none">
            {activeYear}
          </p>

          <button
            onClick={() => handleYearStep(1)}
            disabled={yearOffset >= 0}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22242a] text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
            aria-label="Tahun Berikutnya"
          >
            <ChevronRight size={20} strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* 4. Summary Stacked Cards (Pemasukan, Pengeluaran, Selisih) */}
      <RecapSummaryCards
        income={summary.income}
        expense={summary.expense}
        difference={summary.difference}
        loading={summaryLoading}
      />

      {/* 5. Donut Chart (Distribusi Pengeluaran / Pemasukan) */}
      <DonutChart
        data={breakdown}
        type={chartType}
        onTypeChange={(tp) => setChartType(tp)}
        loading={breakdownLoading}
      />

      {/* 6. Category Breakdown (Rincian Kategori) */}
      <CategoryBreakdown data={breakdown} loading={breakdownLoading} />
    </div>
  )
}
