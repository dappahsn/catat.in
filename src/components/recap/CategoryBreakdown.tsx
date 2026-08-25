import type { CategoryBreakdownItem } from '@/services/recap.service'
import { formatCurrency } from '@/utils/currency'
import { Skeleton } from '@/components/ui/Skeleton'
import { useI18n } from '@/contexts/I18nContext'
import { CHART_COLORS } from './DonutChart'

// Icon background classes for well-known categories or indexed colors
const PASTEL_BG_CLASSES = [
  'bg-[#fee2e2] text-[#991b1b] dark:bg-[#3b181a] dark:text-[#fca5a5]', // red / pink (e.g. food)
  'bg-[#fef3c7] text-[#92400e] dark:bg-[#3b2813] dark:text-[#fde68a]', // amber / yellow (e.g. transport)
  'bg-[#dbeafe] text-[#1e40af] dark:bg-[#172554] dark:text-[#93c5fd]', // blue (e.g. shopping)
  'bg-[#f3e8ff] text-[#6b21a8] dark:bg-[#3b1754] dark:text-[#d8b4fe]', // purple (e.g. entertainment)
  'bg-[#d1fae5] text-[#065f46] dark:bg-[#133827] dark:text-[#6ee7b7]', // green
  'bg-[#fce7f3] text-[#9d174d] dark:bg-[#3b1429] dark:text-[#fbcfe8]', // pink
  'bg-[#cffafe] text-[#155e75] dark:bg-[#112f38] dark:text-[#a5f3fc]', // cyan
  'bg-[#ecfccb] text-[#3f6212] dark:bg-[#203310] dark:text-[#d9f99d]', // lime
  'bg-[#e0e7ff] text-[#3730a3] dark:bg-[#1e1b4b] dark:text-[#c7d2fe]', // indigo
]

interface CategoryBreakdownProps {
  data: CategoryBreakdownItem[]
  loading: boolean
}

export function CategoryBreakdown({ data, loading }: CategoryBreakdownProps) {
  const { t } = useI18n()

  if (loading) {
    return (
      <div className="mt-2">
        <Skeleton className="h-5 w-36 mb-3" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-3.5 sm:p-4 mb-2.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-11 h-11 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1.5" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className="mt-2">
      {/* Section Title */}
      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-3">
        {t('recap.category_breakdown')}
      </h3>

      {/* Stacked Category Cards */}
      <div className="flex flex-col gap-2.5">
        {data.map(({ categoryId, categoryName, categoryIcon, amount, percentage }, i) => {
          const bgClass = PASTEL_BG_CLASSES[i % PASTEL_BG_CLASSES.length]

          return (
            <div
              key={categoryId}
              className="bg-white dark:bg-[#17181c] rounded-2xl border border-slate-200/80 dark:border-[#262930] p-3.5 sm:p-4 flex items-center justify-between shadow-2xs hover:border-slate-300 dark:hover:border-[#383d47] transition-all"
            >
              {/* Left: Icon Badge & Details */}
              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <span className="text-xl leading-none">{categoryIcon ?? '📦'}</span>
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-[15px] text-slate-900 dark:text-white truncate">
                    {categoryName}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    {percentage}%
                  </p>
                </div>
              </div>

              {/* Right: Amount */}
              <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tabular-nums whitespace-nowrap flex-shrink-0">
                {formatCurrency(amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
