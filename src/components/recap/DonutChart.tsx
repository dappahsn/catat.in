import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategoryBreakdownItem } from '@/services/recap.service'
import { formatCurrency } from '@/utils/currency'
import { useI18n } from '@/contexts/I18nContext'

export const CHART_COLORS = [
  '#ef4444', // Coral Red (e.g. Makanan)
  '#f59e0b', // Amber/Yellow (e.g. Transportasi)
  '#3b82f6', // Bright Blue (e.g. Belanja)
  '#a855f7', // Violet/Purple (e.g. Hiburan)
  '#10b981', // Emerald Green
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#6366f1', // Indigo
]

interface DonutChartProps {
  data: CategoryBreakdownItem[]
  type: 'income' | 'expense'
  onTypeChange: (type: 'income' | 'expense') => void
  loading: boolean
}

export function DonutChart({ data, type, onTypeChange, loading }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { t, language } = useI18n()

  const total = data.reduce((s, d) => s + d.amount, 0)
  const activeItem = activeIndex !== null ? data[activeIndex] : null

  const titleText = type === 'expense'
    ? (language === 'en' ? 'Expense Distribution' : 'Distribusi Pengeluaran')
    : (language === 'en' ? 'Income Distribution' : 'Distribusi Pemasukan')

  const centerLabel = type === 'expense'
    ? (language === 'en' ? 'Total Expense' : 'Total Pengeluaran')
    : (language === 'en' ? 'Total Income' : 'Total Pemasukan')

  return (
    <div className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-5 mb-6 shadow-2xs">
      {/* Title & Type Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base text-slate-900 dark:text-white">
          {titleText}
        </h2>
        <div className="flex gap-1 bg-slate-100 dark:bg-[#22242a] rounded-xl p-1">
          <button
            onClick={() => onTypeChange('expense')}
            className={[
              'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
              type === 'expense'
                ? 'bg-white dark:bg-[#17181c] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
            ].join(' ') }
            aria-pressed={type === 'expense'}
          >
            {t('recap.chart_expense')}
          </button>
          <button
            onClick={() => onTypeChange('income')}
            className={[
              'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
              type === 'income'
                ? 'bg-white dark:bg-[#17181c] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200',
            ].join(' ')}
            aria-pressed={type === 'income'}
          >
            {t('recap.chart_income')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="skeleton w-48 h-48 rounded-full" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <span className="text-3xl mb-2">📊</span>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {t('recap.empty')}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[280px] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={3}
                  stroke="none"
                  onMouseEnter={(_data: unknown, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.45}
                      className="transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => {
                    const num = typeof value === 'number' ? value : Number(value) || 0
                    return [formatCurrency(num), t('detail.amount')]
                  }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: 12,
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label in Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[130px] truncate">
                {activeItem ? activeItem.categoryName : centerLabel}
              </p>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight mt-0.5 max-w-[130px] truncate">
                {formatCurrency(activeItem?.amount ?? total)}
              </p>
              {activeItem && (
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                  {activeItem.percentage}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
