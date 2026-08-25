import type { TransactionType } from '@/types/transaction'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react'

interface TransactionTypeSheetProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: TransactionType) => void
}

const options: { type: TransactionType; label: string; desc: string; icon: typeof TrendingUp; color: string; bg: string }[] = [
  { type: 'income',   label: 'Pemasukan',    desc: 'Gaji, bonus, atau penerimaan lainnya', icon: TrendingUp,       color: 'text-[var(--success-foreground)]', bg: 'bg-[var(--success-light)]' },
  { type: 'expense',  label: 'Pengeluaran',  desc: 'Belanja, tagihan, atau pengeluaran',   icon: TrendingDown,     color: 'text-[var(--danger-foreground)]',  bg: 'bg-[var(--danger-light)]' },
  { type: 'transfer', label: 'Pindah Saldo', desc: 'Pindahkan antar rekening kamu',        icon: ArrowLeftRight,   color: 'text-[var(--text-secondary)]',     bg: 'bg-[var(--surface-2)]' },
]

export function TransactionTypeSheet({ isOpen, onClose, onSelect }: TransactionTypeSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Tambah Transaksi">
      <div className="flex flex-col gap-2 pb-2">
        {options.map(({ type, label, desc, icon: Icon, color, bg }) => (
          <button
            key={type}
            onClick={() => { onSelect(type); onClose() }}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--surface-2)] transition-fast text-left"
          >
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
              <Icon size={22} className={color} aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{label}</p>
              <p className="text-xs text-[var(--text-muted)]">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
