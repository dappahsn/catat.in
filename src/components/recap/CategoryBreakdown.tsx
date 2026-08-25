import type { CategoryBreakdownItem } from '@/services/recap.service'
import { formatCurrency } from '@/utils/currency'
import { Skeleton } from '@/components/ui/Skeleton'

const COLORS = [
  '#2563EB', '#16A34A', '#9333EA', '#EA580C', '#DC2626',
  '#0891B2', '#65A30D', '#D97706', '#7C3AED', '#DB2777',
]

interface CategoryBreakdownProps {
  data: CategoryBreakdownItem[]
  loading: boolean
}

export function CategoryBreakdown({ data, loading }: CategoryBreakdownProps) {
  if (loading) {
    return (
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4">
        <Skeleton className="h-4 w-32 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 mb-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return null
  }

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4">
      <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4">Rincian Kategori</h3>
      <div className="flex flex-col gap-3">
        {data.map(({ categoryId, categoryName, categoryIcon, amount, percentage }, i) => (
          <div key={categoryId} className="flex items-center gap-3">
            {/* Icon with color dot */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] + '20' }}
              aria-hidden="true"
            >
              {categoryIcon ?? '📦'}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">{categoryName}</p>
                <p className="text-xs text-[var(--text-muted)] ml-2 flex-shrink-0">{percentage}%</p>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-[var(--surface-2)] rounded-full overflow-hidden" role="presentation">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${percentage}%`, backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
            </div>

            <p className="text-xs font-semibold text-[var(--text-primary)] tabular-nums flex-shrink-0 ml-2">
              {formatCurrency(amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
