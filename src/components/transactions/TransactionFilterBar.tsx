import { useState } from 'react'
import type { TransactionFilter, DatePreset } from '@/types/transaction'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useI18n } from '@/contexts/I18nContext'
import {
  getTodayString, getYesterdayString,
  getNDaysAgoString, getMonthStartString, getMonthEndString,
  getYearStartString, getYearEndString,
} from '@/utils/date'

interface TransactionFilterProps {
  filter: TransactionFilter
  preset: DatePreset
  onApply: (filter: TransactionFilter, preset: DatePreset) => void
}

function presetToFilter(preset: DatePreset): TransactionFilter | null {
  const today = getTodayString()
  switch (preset) {
    case 'today':     return { startDate: today, endDate: today }
    case 'yesterday': return { startDate: getYesterdayString(), endDate: getYesterdayString() }
    case '7days':     return { startDate: getNDaysAgoString(7), endDate: today }
    case 'thisMonth': return { startDate: getMonthStartString(), endDate: getMonthEndString() }
    case 'thisYear':  return { startDate: getYearStartString(), endDate: getYearEndString() }
    default:          return null
  }
}

export function TransactionFilterBar({ filter, preset, onApply }: TransactionFilterProps) {
  const { t, language } = useI18n()
  const [showCustomSheet, setShowCustomSheet] = useState(false)
  const [customStart, setCustomStart] = useState(filter.startDate)
  const [customEnd, setCustomEnd] = useState(filter.endDate)

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'today',     label: t('filter.today') },
    { key: 'yesterday', label: t('filter.yesterday') },
    { key: '7days',     label: t('filter.7days') },
    { key: 'thisMonth', label: t('filter.this_month') },
    { key: 'thisYear',  label: t('filter.this_year') },
    { key: 'custom',    label: t('filter.custom') },
  ]

  const handlePreset = (key: DatePreset) => {
    if (key === 'custom') {
      setShowCustomSheet(true)
      return
    }
    const f = presetToFilter(key)
    if (f) onApply(f, key)
  }

  const handleCustomApply = () => {
    if (!customStart || !customEnd) return
    const start = customStart < customEnd ? customStart : customEnd
    const end = customStart < customEnd ? customEnd : customStart
    onApply({ startDate: start, endDate: end }, 'custom')
    setShowCustomSheet(false)
  }

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="Filter tanggal">
        {presets.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={[
              'flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border shadow-2xs',
              preset === key
                ? 'bg-[#064e3b] dark:bg-[#064e3b] text-white dark:text-[#86efac] border-[#064e3b]'
                : 'bg-white dark:bg-[#17181c] text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-[#262930] hover:border-slate-300 dark:hover:border-[#383d47] hover:text-slate-900 dark:hover:text-white',
            ].join(' ')}
            aria-pressed={preset === key}
          >
            {label}
          </button>
        ))}
      </div>

      <BottomSheet
        isOpen={showCustomSheet}
        onClose={() => setShowCustomSheet(false)}
        title={language === 'en' ? 'Date Range' : 'Rentang Tanggal'}
      >
        <div className="flex flex-col gap-4 pb-2">
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
          <Button fullWidth onClick={handleCustomApply} disabled={!customStart || !customEnd}>
            {t('filter.apply')}
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
