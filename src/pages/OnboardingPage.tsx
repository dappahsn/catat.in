import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { createAccount } from '@/services/accounts.service'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { validateAccountName, validateAmount } from '@/utils/validation'
import { parseCurrencyInput, formatNumberDisplay } from '@/utils/currency'

type Step = 'welcome' | 'create-account'

const accountTypeOptions = [
  { value: 'bank', label: 'Bank' },
  { value: 'cash', label: 'Tunai' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'other', label: 'Lainnya' },
]

export function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [step, setStep] = useState<Step>('welcome')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'bank',
    initial_balance_display: '0',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSkip = () => navigate('/transactions', { replace: true })

  const validateForm = () => {
    const errs: Record<string, string> = {}
    const nameErr = validateAccountName(form.name)
    if (nameErr) errs.name = nameErr
    const amount = parseCurrencyInput(form.initial_balance_display)
    if (amount < 0) errs.initial_balance = 'Saldo tidak boleh negatif'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = async () => {
    if (!validateForm() || !user) return
    setSaving(true)
    try {
      await createAccount(user.id, {
        name: form.name.trim(),
        type: form.type,
        initial_balance: parseCurrencyInput(form.initial_balance_display),
      })
      navigate('/transactions', { replace: true })
    } catch {
      showToast('Gagal membuat rekening. Coba lagi.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[var(--surface)] rounded-3xl shadow-[var(--card-shadow)] p-8">
        {step === 'welcome' ? (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4" aria-hidden="true">👋</div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                Selamat Datang!
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Mulai dengan menambahkan rekening pertama kamu untuk mencatat keuangan.
              </p>
            </div>
            <Button fullWidth size="lg" onClick={() => setStep('create-account')}>
              Tambah Rekening Pertama
            </Button>
            <Button
              fullWidth
              variant="ghost"
              onClick={handleSkip}
              className="mt-2 text-[var(--text-muted)]"
            >
              Lewati
            </Button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Tambah Rekening</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Masukkan informasi rekening pertama kamu.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Nama Rekening"
                placeholder="Contoh: BCA, GoPay"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                error={errors.name}
                autoFocus
              />

              <Select
                label="Jenis Rekening"
                options={accountTypeOptions}
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              />

              <Input
                label="Saldo Awal"
                prefix="Rp"
                inputMode="numeric"
                value={form.initial_balance_display}
                onChange={(e) => {
                  const raw = parseCurrencyInput(e.target.value)
                  setForm((f) => ({ ...f, initial_balance_display: formatNumberDisplay(raw) }))
                }}
                error={errors.initial_balance}
              />

              <Button
                fullWidth
                size="lg"
                onClick={handleSave}
                loading={saving}
                className="mt-2"
              >
                {saving ? 'Menyimpan...' : 'Simpan Rekening'}
              </Button>

              <Button
                fullWidth
                variant="ghost"
                onClick={() => setStep('welcome')}
                disabled={saving}
              >
                Kembali
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
