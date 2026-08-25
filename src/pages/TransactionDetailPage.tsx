import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getTransactionById } from '@/services/transactions.service'
import type { Transaction } from '@/types/transaction'
import { TransactionDetail } from '@/components/transactions/TransactionDetail'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { useI18n } from '@/contexts/I18nContext'

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, language } = useI18n()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const data = await getTransactionById(id)
    if (!data) setNotFound(true)
    else setTransaction(data)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  return (
    <div className="px-4 py-5">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/transactions')}
          className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast"
          aria-label={t('common.back')}
        >
          <ArrowLeft size={20} className="text-[var(--text-primary)]" />
        </button>
        <h1 className="text-lg font-bold text-[var(--text-primary)]">{t('detail.title')}</h1>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
      ) : notFound || !transaction ? (
        <div className="text-center py-8">
          <p className="text-[var(--text-secondary)]">{language === 'en' ? 'Transaction not found.' : 'Transaksi tidak ditemukan.'}</p>
          <Button variant="ghost" onClick={() => navigate('/transactions')} className="mt-2">{t('common.back')}</Button>
        </div>
      ) : (
        <TransactionDetail
          transaction={transaction}
          onDeleted={() => navigate('/transactions', { replace: true })}
          onEdited={() => load()}
        />
      )}
    </div>
  )
}
