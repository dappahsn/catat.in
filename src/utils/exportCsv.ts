import type { Transaction } from '@/types/transaction'

/**
 * Export transactions to CSV with UTF-8 BOM for Excel compatibility.
 */
export function exportTransactionsToCSV(transactions: Transaction[], locale: string = 'id-ID'): void {
  const headers = ['Tanggal', 'Tipe', 'Rekening', 'Rekening Tujuan', 'Kategori', 'Jumlah', 'Catatan']

  const rows = transactions.map((t) => {
    const type =
      t.type === 'income' ? 'Pemasukan'
      : t.type === 'expense' ? 'Pengeluaran'
      : 'Pindah Saldo'

    const account = t.accounts?.name ?? t.account_id
    const destAccount = t.destination_accounts?.name ?? (t.destination_account_id ? t.destination_account_id : '')
    const category = t.categories?.name ?? ''

    const date = new Date(t.transaction_date + 'T00:00:00').toLocaleDateString(locale, {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })

    return [
      date,
      type,
      account,
      destAccount,
      category,
      t.amount.toString(),
      t.notes ?? '',
    ]
  })

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n')

  // UTF-8 BOM + content
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const today = new Date().toISOString().split('T')[0]
  link.href = url
  link.download = `catat-in-export-${today}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
