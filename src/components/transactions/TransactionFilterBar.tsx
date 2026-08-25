import { useState } from 'react'
import type { TransactionFilter, DatePreset } from '@/types/transaction'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { BottomSheet } from '@/components/ui/BottomSheet'
import {
  getTodayString, getYesterdayString,
  getNDaysAgoString, getMonthStartString, getMonthEndString,
} from '@/utils/date'

interface TransactionFilterProps {
  filter: TransactionFilter
  preset: DatePreset
  onApply: (filter: TransactionFilter, preset: DatePreset) => void
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today',     label: 'Hari Ini' },
  { key: 'yesterday', label: 'Kemarin' },
  { key: '7days',     label: '7 Hari' },
  { key: 'thisMonth', label: 'Bulan Ini' },
  { key: 'custom',    label: 'Custom' },
]

function presetToFilter(preset: DatePreset): TransactionFilter | null {
  const today = getTodayString()
  switch (preset) {
    case 'today':     return { startDate: today, endDate: today }
    case 'yesterday': return { startDate: getYesterdayString(), endDate: getYesterdayString() }
    case '7days':     return { startDate: getNDaysAgoString(7), endDate: today }
    case 'thisMonth': return { startDate: getMonthStartString(), endDate: getMonthEndString() }
    default:          return null
  }
}

export function TransactionFilterBar({ filter, preset, onApply }: TransactionFilterProps) {
  const [showCustomSheet, setShowCustomSheet] = useState(false)
  const [customStart, setCustomStart] = useState(filter.startDate)
  const [customEnd, setCustomEnd] = useState(filter.endDate)

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
        {PRESETS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={[
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-fast border',
              preset === key
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
            ].join(' ')}
            aria-pressed={preset === key}
          >
            {label}
          </button>
        ))}
      </div>

      <BottomSheet isOpen={showCustomSheet} onClose={() => setShowCustomSheet(false)} title="Rentang Tanggal">
        <div className="flex flex-col gap-4 pb-2">
          <Input
            label="Tanggal Awal"
            type="date"
            value={customStart}
            max={getTodayString()}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <Input
            label="Tanggal Akhir"
            type="date"
            value={customEnd}
            min={customStart}
            max={getTodayString()}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <Button fullWidth onClick={handleCustomApply} disabled={!customStart || !customEnd}>
            Terapkan
          </Button>
        </div>
      </BottomSheet>
    </>
  )
}
