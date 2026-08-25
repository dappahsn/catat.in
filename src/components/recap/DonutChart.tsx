import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CategoryBreakdownItem } from '@/services/recap.service'
import { formatCurrency } from '@/utils/currency'

const COLORS = [
  '#2563EB', '#16A34A', '#9333EA', '#EA580C', '#DC2626',
  '#0891B2', '#65A30D', '#D97706', '#7C3AED', '#DB2777',
]

interface DonutChartProps {
  data: CategoryBreakdownItem[]
  type: 'income' | 'expense'
  onTypeChange: (type: 'income' | 'expense') => void
  loading: boolean
}

export function DonutChart({ data, type, onTypeChange, loading }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const total = data.reduce((s, d) => s + d.amount, 0)
  const activeItem = activeIndex !== null ? data[activeIndex] : null

  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
      {/* Toggle */}
      <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1 mb-4 w-fit">
        <button
          onClick={() => onTypeChange('expense')}
          className={[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-fast',
            type === 'expense' ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]',
          ].join(' ')}
          aria-pressed={type === 'expense'}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => onTypeChange('income')}
          className={[
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-fast',
            type === 'income' ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]',
          ].join(' ')}
          aria-pressed={type === 'income'}
        >
          Pemasukan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-52">
          <div className="skeleton w-36 h-36 rounded-full" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-44 text-center">
          <p className="text-sm text-[var(--text-muted)]">Belum ada data untuk periode ini.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[240px] h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={2}
                  onMouseEnter={(_data: unknown, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.5}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: unknown) => {
                    const num = typeof value === 'number' ? value : Number(value) || 0
                    return [formatCurrency(num), 'Jumlah']
                  }}
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-[var(--text-muted)]">Total</p>
              <p className="text-sm font-bold text-[var(--text-primary)] tabular-nums text-center max-w-[90px] truncate">
                {formatCurrency(activeItem?.amount ?? total)}
              </p>
              {activeItem && (
                <p className="text-[11px] text-[var(--text-muted)] text-center max-w-[80px] truncate">
                  {activeItem.categoryName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
