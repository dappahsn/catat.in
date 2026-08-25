import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useI18n } from '@/contexts/I18nContext'
import { createTransaction, updateTransaction } from '@/services/transactions.service'
import { getAccountsWithBalances } from '@/services/accounts.service'
import { getCategories } from '@/services/categories.service'
import type { Transaction, TransactionType, CreateTransactionInput } from '@/types/transaction'
import type { Category } from '@/types/category'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { parseCurrencyInput, formatNumberDisplay } from '@/utils/currency'
import { getTodayString, isNotFutureDate } from '@/utils/date'
import { validateAmount, validateTransferAccounts, validateTransferAmount, validateExpenseAmount } from '@/utils/validation'

interface TransactionFormProps {
  type: TransactionType
  transaction?: Transaction | null
  onSuccess: () => void
  onCancel: () => void
}

interface AccountOption { value: string; label: string; balance: number }

export function TransactionForm({ type, transaction, onSuccess, onCancel }: TransactionFormProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t, language } = useI18n()
  const isEdit = !!transaction

  const [accounts, setAccounts] = useState<AccountOption[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    amount_display: transaction ? formatNumberDisplay(Number(transaction.amount)) : '',
    account_id: transaction?.account_id ?? '',
    destination_account_id: transaction?.destination_account_id ?? '',
    category_id: transaction?.category_id ?? '',
    transaction_date: transaction?.transaction_date ?? getTodayString(),
    notes: transaction?.notes ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    const loadData = async () => {
      try {
        const [accs, cats] = await Promise.all([
          getAccountsWithBalances(user.id),
          getCategories(user.id, type === 'transfer' ? undefined : type),
        ])
        setAccounts(accs.map((a) => ({
          value: a.id,
          label: `${a.icon ?? ''} ${a.name}`.trim(),
          balance: (a as { current_balance: number }).current_balance,
        })))
        setCategories(cats)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user, type])

  const getSourceBalance = () => {
    const acc = accounts.find((a) => a.value === form.account_id)
    return acc?.balance ?? 0
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    const amount = parseCurrencyInput(form.amount_display)

    if (type === 'transfer') {
      const transferErr = validateTransferAccounts(form.account_id, form.destination_account_id)
      if (transferErr) errs.account = transferErr
      const amountErr = validateTransferAmount(amount, getSourceBalance())
      if (amountErr) errs.amount = amountErr
    } else if (type === 'expense') {
      if (!form.account_id) errs.account = language === 'en' ? 'Account is required' : 'Rekening wajib dipilih'
      const amountErr = validateExpenseAmount(amount, getSourceBalance())
      if (amountErr) errs.amount = amountErr
    } else {
      if (!form.account_id) errs.account = language === 'en' ? 'Account is required' : 'Rekening wajib dipilih'
      const amountErr = validateAmount(amount)
      if (amountErr) errs.amount = amountErr
    }

    if (!form.transaction_date) {
      errs.date = language === 'en' ? 'Date is required' : 'Tanggal wajib diisi'
    } else if (!isNotFutureDate(form.transaction_date)) {
      errs.date = language === 'en' ? 'Transaction date cannot be in the future' : 'Tanggal transaksi tidak boleh melebihi hari ini'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !user) return
    setSaving(true)
    const amount = parseCurrencyInput(form.amount_display)

    const input: CreateTransactionInput = {
      type,
      account_id: form.account_id,
      destination_account_id: type === 'transfer' ? form.destination_account_id : null,
      category_id: form.category_id || null,
      amount,
      transaction_date: form.transaction_date,
      notes: form.notes.trim() || null,
    }

    try {
      if (isEdit) {
        await updateTransaction(transaction!.id, input)
        showToast(language === 'en' ? 'Transaction updated successfully.' : 'Transaksi berhasil diperbarui.', 'success')
      } else {
        await createTransaction(user.id, input)
        showToast(language === 'en' ? 'Transaction added successfully.' : 'Transaksi berhasil ditambahkan.', 'success')
      }
      onSuccess()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-4 text-center text-sm text-[var(--text-muted)]">{t('common.loading')}</div>
  }

  const accountOptions = accounts.map((a) => ({ value: a.value, label: a.label }))
  const categoryOptions = categories.map((c) => ({ value: c.id, label: `${c.icon ?? ''} ${c.name}`.trim() }))

  const saveLabel = {
    income: t('form.save_income'),
    expense: t('form.save_expense'),
    transfer: t('form.save_transfer'),
  }

  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Amount (always first, prominent) */}
      <Input
        label={t('form.amount')}
        prefix="Rp"
        inputMode="numeric"
        placeholder="0"
        value={form.amount_display}
        onChange={(e) => {
          const raw = parseCurrencyInput(e.target.value)
          setForm((f) => ({ ...f, amount_display: raw ? formatNumberDisplay(raw) : '' }))
        }}
        error={errors.amount}
        autoFocus
      />

      {/* Account(s) */}
      {type === 'transfer' ? (
        <>
          <Select
            label={t('form.account_from')}
            options={accountOptions}
            value={form.account_id}
            placeholder={t('form.select_account')}
            onChange={(e) => setForm((f) => ({ ...f, account_id: e.target.value }))}
            error={errors.account}
          />
          <Select
            label={t('form.account_to')}
            options={accountOptions.filter((a) => a.value !== form.account_id)}
            value={form.destination_account_id}
            placeholder={language === 'en' ? 'Select destination account' : 'Pilih rekening tujuan'}
            onChange={(e) => setForm((f) => ({ ...f, destination_account_id: e.target.value }))}
          />
        </>
      ) : (
        <Select
          label={t('form.account')}
          options={accountOptions}
          value={form.account_id}
          placeholder={t('form.select_account')}
          onChange={(e) => setForm((f) => ({ ...f, account_id: e.target.value }))}
          error={errors.account}
        />
      )}

      {/* Category (not for transfer) */}
      {type !== 'transfer' && categoryOptions.length > 0 && (
        <Select
          label={t('form.category')}
          options={categoryOptions}
          value={form.category_id}
          placeholder={language === 'en' ? 'Select category (optional)' : 'Pilih kategori (opsional)'}
          onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
        />
      )}

      {/* Date */}
      <Input
        label={t('form.date')}
        type="date"
        value={form.transaction_date}
        max={getTodayString()}
        onChange={(e) => setForm((f) => ({ ...f, transaction_date: e.target.value }))}
        error={errors.date}
      />

      {/* Notes */}
      <Input
        label={t('form.notes')}
        placeholder={t('form.notes_placeholder')}
        value={form.notes}
        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
        maxLength={200}
      />

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="secondary" fullWidth onClick={onCancel} disabled={saving}>
          {t('common.cancel')}
        </Button>
        <Button fullWidth onClick={handleSubmit} loading={saving}>
          {saving ? t('form.saving') : saveLabel[type]}
        </Button>
      </div>
    </div>
  )
}
