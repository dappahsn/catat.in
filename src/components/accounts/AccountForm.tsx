import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useI18n } from '@/contexts/I18nContext'
import { createAccount, updateAccount } from '@/services/accounts.service'
import type { Account, AccountType } from '@/types/account'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { validateAccountName } from '@/utils/validation'
import { parseCurrencyInput, formatNumberDisplay } from '@/utils/currency'

interface AccountFormProps {
  account?: Account | null
  onSuccess: () => void
  onCancel: () => void
}

const ACCOUNT_ICONS = ['🏦', '💳', '💵', '📱', '🏧', '💰', '🔐', '🌟']

export function AccountForm({ account, onSuccess, onCancel }: AccountFormProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t, language } = useI18n()
  const isEdit = !!account

  const typeOptions = [
    { value: 'bank', label: t('account.type.bank') },
    { value: 'cash', label: t('account.type.cash') },
    { value: 'ewallet', label: t('account.type.ewallet') },
    { value: 'other', label: t('account.type.other') },
  ]

  const [form, setForm] = useState({
    name: account?.name ?? '',
    type: account?.type ?? 'bank',
    icon: account?.icon ?? '🏦',
    initial_balance_display: account ? formatNumberDisplay(Number(account.initial_balance)) : '0',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const validate = () => {
    const errs: Record<string, string> = {}
    const nameErr = validateAccountName(form.name)
    if (nameErr) errs.name = nameErr
    const amount = parseCurrencyInput(form.initial_balance_display)
    if (amount < 0) errs.initial_balance = language === 'en' ? 'Balance cannot be negative' : 'Saldo tidak boleh negatif'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !user) return
    setSaving(true)
    try {
      if (isEdit) {
        await updateAccount(account!.id, {
          name: form.name.trim(),
          type: form.type,
          icon: form.icon,
        })
        showToast(language === 'en' ? 'Account updated successfully.' : 'Rekening berhasil diperbarui.', 'success')
      } else {
        await createAccount(user.id, {
          name: form.name.trim(),
          type: form.type,
          icon: form.icon,
          initial_balance: parseCurrencyInput(form.initial_balance_display),
        })
        showToast(language === 'en' ? 'Account added successfully.' : 'Rekening berhasil ditambahkan.', 'success')
      }
      onSuccess()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Icon picker */}
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">{t('account.icon')}</p>
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setForm((f) => ({ ...f, icon }))}
              className={[
                'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-fast',
                form.icon === icon
                  ? 'bg-[var(--primary-light)] ring-2 ring-[var(--primary)]'
                  : 'bg-[var(--surface-2)] hover:bg-[var(--border)]',
              ].join(' ')}
              aria-label={`Icon ${icon}`}
              aria-pressed={form.icon === icon}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <Input
        label={t('account.name')}
        placeholder={t('account.name_placeholder')}
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        error={errors.name}
        autoFocus={!isEdit}
        maxLength={50}
      />

      <Select
        label={t('account.type')}
        options={typeOptions}
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as AccountType }))}
      />

      {!isEdit && (
        <Input
          label={t('account.initial_balance')}
          prefix="Rp"
          inputMode="numeric"
          value={form.initial_balance_display}
          onChange={(e) => {
            const raw = parseCurrencyInput(e.target.value)
            setForm((f) => ({ ...f, initial_balance_display: formatNumberDisplay(raw) }))
          }}
          error={errors.initial_balance}
          hint={language === 'en' ? 'Enter current balance for this account.' : 'Masukkan saldo saat ini di rekening ini.'}
        />
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="secondary" fullWidth onClick={onCancel} disabled={saving}>
          {t('common.cancel')}
        </Button>
        <Button fullWidth onClick={handleSubmit} loading={saving}>
          {saving ? t('common.loading') : isEdit ? t('account.save_changes') : t('account.save')}
        </Button>
      </div>
    </div>
  )
}
