import type { Transaction } from '@/types/transaction'
import { TransactionItem } from './TransactionItem'
import { TransactionSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { formatDateDisplay, formatDayAndMonth, isToday, isYesterday } from '@/utils/date'
import { useI18n } from '@/contexts/I18nContext'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  loadingMore: boolean
  onItemPress: (transaction: Transaction) => void
  emptySlot?: React.ReactNode
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
  const { t, language } = useI18n()

  const getGroupTitle = (dateStr: string): string => {
    if (isToday(dateStr)) return t('transaction.today')
    if (isYesterday(dateStr)) return t('transaction.yesterday')
    return formatDateDisplay(dateStr, language === 'en' ? 'en-US' : 'id-ID')
  }

  const getGroupShortDate = (dateStr: string): string => {
    return formatDayAndMonth(dateStr, language === 'en' ? 'en-US' : 'id-ID')
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-slate-200/80 dark:border-[var(--border)] overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => <TransactionSkeleton key={i} />)}
      </div>
    )
  }

  if (transactions.length === 0) {
    return <>{emptySlot}</>
  }

  const groups = groupByDate(transactions)

  return (
    <div className="flex flex-col gap-6">
      {groups.map(({ date, items }) => (
        <div key={date}>
          {/* Group Header with Title on Left & Short Date on Right */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2 mb-3">
            <h2 className="font-bold text-[15px] sm:text-base text-slate-900 dark:text-white">
              {getGroupTitle(date)}
            </h2>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {getGroupShortDate(date)}
            </span>
          </div>

          {/* Group Items Card */}
          <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-slate-200/80 dark:border-[var(--border)] overflow-hidden shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/80">
            {items.map((item) => (
              <TransactionItem
                key={item.id}
                transaction={item}
                onPress={() => onItemPress(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-2">
          <Button variant="ghost" onClick={onLoadMore} loading={loadingMore} size="sm">
            {t('transaction.load_more')}
          </Button>
        </div>
      )}
    </div>
  )
}
