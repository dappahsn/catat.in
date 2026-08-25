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
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  getMonthStartString, getMonthEndString, getTodayString,
  getMonthLabel,
} from '@/utils/date'

type TabType = 'realtime' | 'monthly' | 'custom'

export function RecapPage() {
  const { user } = useAuth()
  const { t, language } = useI18n()
  const [tab, setTab] = useState<TabType>('monthly')
  const [chartType, setChartType] = useState<'income' | 'expense'>('expense')

  const now = new Date()
  const [monthOffset, setMonthOffset] = useState(0)
  const [customStart, setCustomStart] = useState(getMonthStartString())
  const [customEnd, setCustomEnd] = useState(getTodayString())
  const [customApplied, setCustomApplied] = useState<TransactionFilter>({
    startDate: getMonthStartString(),
    endDate: getTodayString(),
  })

  const [summary, setSummary] = useState<RecapSummary>({ income: 0, expense: 0, difference: 0 })
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([])
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [breakdownLoading, setBreakdownLoading] = useState(true)

  const getFilter = useCallback((): TransactionFilter => {
    if (tab === 'realtime') {
      const today = getTodayString()
      return { startDate: getMonthStartString(), endDate: today }
    }
    if (tab === 'monthly') {
      const d = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
      return { startDate: getMonthStartString(d), endDate: getMonthEndString(d) }
    }
    return customApplied
  }, [tab, monthOffset, customApplied]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const tabLabels: Record<TabType, string> = {
    realtime: t('recap.realtime'),
    monthly: t('recap.monthly'),
    custom: t('recap.custom'),
  }

  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">{t('recap.title')}</h1>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1 mb-5">
        {(['realtime', 'monthly', 'custom'] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={[
              'flex-1 py-2 rounded-lg text-xs font-medium transition-fast',
              tab === tabKey ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]',
            ].join(' ')}
            aria-pressed={tab === tabKey}
          >
            {tabLabels[tabKey]}
          </button>
        ))}
      </div>

      {/* Month navigation (monthly tab) */}
      {tab === 'monthly' && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMonthOffset((m) => m - 1)}
            className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast"
            aria-label={t('recap.prev_month')}
          >
            <ChevronLeft size={20} className="text-[var(--text-secondary)]" />
          </button>
          <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">{monthLabel}</p>
          <button
            onClick={() => setMonthOffset((m) => Math.min(m + 1, 0))}
            disabled={monthOffset >= 0}
            className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast disabled:opacity-40"
            aria-label={t('recap.next_month')}
          >
            <ChevronRight size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>
      )}

      {/* Custom date range (custom tab) */}
      {tab === 'custom' && (
        <div className="flex gap-2 mb-4 items-end">
          <Input
            label={t('filter.start_date')}
            type="date"
            value={customStart}
            max={getTodayString()}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <Input
            label={t('filter.end_date')}
            type="date"
            value={customEnd}
            min={customStart}
            max={getTodayString()}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <Button
            onClick={() => {
              setCustomApplied({ startDate: customStart, endDate: customEnd })
            }}
            size="sm"
            className="flex-shrink-0 mb-0.5"
          >
            {t('filter.apply')}
          </Button>
        </div>
      )}

      {/* Summary cards */}
      <RecapSummaryCards
        income={summary.income}
        expense={summary.expense}
        difference={summary.difference}
        loading={summaryLoading}
      />

      {/* Donut chart */}
      <DonutChart
        data={breakdown}
        type={chartType}
        onTypeChange={(tp) => setChartType(tp)}
        loading={breakdownLoading}
      />

      {/* Category breakdown */}
      <CategoryBreakdown data={breakdown} loading={breakdownLoading} />
    </div>
  )
}
