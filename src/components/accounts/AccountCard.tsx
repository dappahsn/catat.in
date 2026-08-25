import { useNavigate } from 'react-router-dom'
import type { Account } from '@/types/account'
import { formatCurrency } from '@/utils/currency'
import { Landmark, Wallet, Banknote } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'
import type { TranslationKey } from '@/locales/id'

interface AccountCardProps {
  account: Account
  currentBalance: number
}

function getAccountIcon(type: Account['type'], iconEmoji?: string | null) {
  if (iconEmoji && iconEmoji.length > 0 && !iconEmoji.startsWith('🏦') && !iconEmoji.startsWith('💰')) {
    return <span className="text-xl leading-none">{iconEmoji}</span>
  }

  switch (type) {
    case 'bank':
      return <Landmark size={20} className="stroke-[2.2]" />
    case 'cash':
      return <Banknote size={20} className="stroke-[2.2]" />
    case 'ewallet':
      return <Wallet size={20} className="stroke-[2.2]" />
    case 'other':
    default:
      return <Landmark size={20} className="stroke-[2.2]" />
  }
}

export function AccountCard({ account, currentBalance }: AccountCardProps) {
  const navigate = useNavigate()
  const { t } = useI18n()

  const typeKey = `account.type.${account.type}` as TranslationKey
  const typeLabel = t(typeKey)

  return (
    <button
      onClick={() => navigate(`/accounts/${account.id}`)}
      className="w-full bg-white dark:bg-[#17181c] rounded-2xl p-4 sm:p-4.5 flex items-center justify-between gap-3.5 border border-slate-200/80 dark:border-[#262930] shadow-2xs hover:border-slate-300 dark:hover:border-[#383d47] transition-all text-left group"
      aria-label={`${account.name}, ${formatCurrency(currentBalance)}`}
    >
      {/* Left: Icon & Name */}
      <div className="flex items-center gap-3.5 min-w-0 pr-2">
        {/* Pastel Mint Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-[#a7f3d0]/60 text-[#064e3b] dark:bg-[#133827] dark:text-[#6ee7b7] flex items-center justify-center flex-shrink-0 shadow-2xs">
          {getAccountIcon(account.type, account.icon)}
        </div>

        {/* Info */}
        <div className="min-w-0">
          <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-[#064e3b] dark:group-hover:text-[#5eead4] transition-colors">
            {account.name}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 capitalize">
            {typeLabel}
          </p>
        </div>
      </div>

      {/* Right: Balance */}
      <p
        className={`font-bold text-sm sm:text-base tabular-nums whitespace-nowrap flex-shrink-0 ${
          currentBalance < 0 ? 'text-[#ef4444] dark:text-[#f87171]' : 'text-slate-900 dark:text-white'
        }`}
      >
        {formatCurrency(currentBalance)}
      </p>
    </button>
  )
}
