import type { Transaction } from '@/types/transaction'
import { formatCurrency } from '@/utils/currency'
import { formatDateShort, isToday, isYesterday } from '@/utils/date'
import { useI18n } from '@/contexts/I18nContext'
import { ArrowLeftRight } from 'lucide-react'

interface TransactionItemProps {
  transaction: Transaction
  onPress?: () => void
  showDate?: boolean
}

export function TransactionItem({ transaction: t, onPress, showDate = false }: TransactionItemProps) {
  const { t: translate, language } = useI18n()

  const getDateLabel = (dateStr: string): string => {
    if (isToday(dateStr)) return translate('transaction.today')
    if (isYesterday(dateStr)) return translate('transaction.yesterday')
    return formatDateShort(dateStr, language === 'en' ? 'en-US' : 'id-ID')
  }

  // Determine Title, Subtitle, Icon & styling
  let title = ''
  let subtitle = ''
  let iconContent: React.ReactNode = null
  let bgClass = ''
  let amountSign = ''
  let amountClass = ''

  if (t.type === 'transfer') {
    const fromName = t.accounts?.name ?? translate('form.account')
    const toName = t.destination_accounts?.name ?? translate('detail.dest_account')
    title = `${fromName} ke ${toName}`
    subtitle = language === 'en' ? 'Internal Transfer' : 'Transfer Internal'
    if (t.notes) subtitle += ` • ${t.notes}`
    iconContent = <ArrowLeftRight size={18} />
    bgClass = 'bg-slate-100 text-slate-700 dark:bg-[#242730] dark:text-[#cbd5e1]'
    amountSign = ''
    amountClass = 'text-slate-900 dark:text-white font-bold'
  } else {
    const isIncome = t.type === 'income'
    const defaultTypeName = isIncome ? translate('transaction.income') : translate('transaction.expense')
    
    if (t.notes) {
      title = t.notes
      const parts = [t.accounts?.name, t.categories?.name].filter(Boolean)
      subtitle = parts.join(' • ')
    } else {
      title = t.categories?.name ?? defaultTypeName
      subtitle = t.accounts?.name ?? ''
    }

    iconContent = t.categories?.icon ? (
      <span className="text-xl leading-none">{t.categories.icon}</span>
    ) : isIncome ? (
      <span>💰</span>
    ) : (
      <span>💸</span>
    )

    if (isIncome) {
      bgClass = 'bg-[#d1fae5] text-[#065f46] dark:bg-[#133827] dark:text-[#6ee7b7]'
      amountSign = '+ '
      amountClass = 'text-[#10b981] dark:text-[#4ade80] font-bold'
    } else {
      bgClass = 'bg-[#fee2e2] text-[#991b1b] dark:bg-[#3b181a] dark:text-[#fca5a5]'
      amountSign = '- '
      amountClass = 'text-[#ef4444] dark:text-[#f87171] font-bold'
    }
  }

  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50/80 dark:hover:bg-[#22242c]/60 transition-colors text-left min-h-[64px]"
      aria-label={`${title}, ${amountSign}${formatCurrency(t.amount)}`}
    >
      {/* Icon Circle */}
      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${bgClass} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
        {iconContent}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 pr-2">
        <p className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white truncate">
          {title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
          {subtitle}
        </p>
        {showDate && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {getDateLabel(t.transaction_date)}
          </p>
        )}
      </div>

      {/* Amount */}
      <p className={`text-sm sm:text-[15px] tabular-nums whitespace-nowrap flex-shrink-0 ${amountClass}`}>
        {amountSign}{formatCurrency(t.amount)}
      </p>
    </button>
  )
}
