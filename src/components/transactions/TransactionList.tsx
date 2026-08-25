import type { Transaction } from '@/types/transaction'
import { TransactionItem } from './TransactionItem'
import { TransactionSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { formatDateDisplay, isToday, isYesterday } from '@/utils/date'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  loadingMore: boolean
  onItemPress: (transaction: Transaction) => void
  emptySlot?: React.ReactNode
}

function getGroupLabel(dateStr: string): string {
  if (isToday(dateStr)) return 'Hari Ini'
  if (isYesterday(dateStr)) return 'Kemarin'
  return formatDateDisplay(dateStr)
}

function groupByDate(transactions: Transaction[]): Array<{ date: string; items: Transaction[] }> {
  const groups = new Map<string, Transaction[]>()
  for (const t of transactions) {
    const existing = groups.get(t.transaction_date)
    if (existing) existing.push(t)
    else groups.set(t.transaction_date, [t])
  }
  return Array.from(groups.entries()).map(([date, items]) => ({ date, items }))
}

export function TransactionList({
  transactions,
  loading,
  hasMore,
  onLoadMore,
  loadingMore,
  onItemPress,
  emptySlot,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => <TransactionSkeleton key={i} />)}
      </div>
    )
  }

  if (transactions.length === 0) {
    return <>{emptySlot}</>
  }

  const groups = groupByDate(transactions)

  return (
    <div className="flex flex-col gap-4">
      {groups.map(({ date, items }) => (
        <div key={date}>
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2 px-1">
            {getGroupLabel(date)}
          </p>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {items.map((t, i) => (
              <div key={t.id} className={i < items.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''}>
                <TransactionItem transaction={t} onPress={() => onItemPress(t)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center">
          <Button variant="ghost" onClick={onLoadMore} loading={loadingMore} size="sm">
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  )
}
