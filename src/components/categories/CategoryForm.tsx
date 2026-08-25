import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useI18n } from '@/contexts/I18nContext'
import { createCategory, updateCategory } from '@/services/categories.service'
import type { Category } from '@/types/category'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { validateCategoryName } from '@/utils/validation'

interface CategoryFormProps {
  category?: Category | null
  defaultType?: 'income' | 'expense'
  onSuccess: () => void
  onCancel: () => void
}

const CATEGORY_ICONS = [
  '🍔', '☕', '🍜', '🍕', '🍰', '🚗', '🛵', '⛽', '🚌', '✈️',
  '🛍️', '🛒', '👕', '🎁', '🎀', '📄', '💡', '💧', '🏠', '🔐',
  '🎬', '🎮', '🎵', '⚽', '🏖️', '🏥', '💊', '🦷', '💪', '📚',
  '🎓', '💼', '💰', '💵', '💳', '📈', '💻', '📱', '📦', '🐾',
  '💎', '⭐', '🎯', '🧾', '🔧', '🔨', '🎨', '🌟',
]

export function CategoryForm({ category, defaultType = 'expense', onSuccess, onCancel }: CategoryFormProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { t } = useI18n()
  const isEdit = !!category

  const [type, setType] = useState<'income' | 'expense'>(category?.type ?? defaultType)
  const [name, setName] = useState(category?.name ?? '')
  const [icon, setIcon] = useState(category?.icon ?? (type === 'income' ? '💰' : '🍔'))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const validationErr = validateCategoryName(name)
    if (validationErr) {
      setError(validationErr)
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (isEdit && category) {
        await updateCategory(category.id, {
          name: name.trim(),
          type,
          icon: icon || null,
        })
        showToast(t('categories.success_update'), 'success')
      } else {
        await createCategory(user.id, {
          name: name.trim(),
          type,
          icon: icon || null,
        })
        showToast(t('categories.success_create'), 'success')
      }
      onSuccess()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Type Toggle */}
      <div>
        <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block">
          {t('categories.type')}
        </label>
        <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1">
          <button
            type="button"
            onClick={() => {
              setType('expense')
              if (!isEdit && icon === '💰') setIcon('🍔')
            }}
            className={[
              'flex-1 py-2 rounded-lg text-xs font-medium transition-fast',
              type === 'expense'
                ? 'bg-[var(--surface)] text-[var(--danger-foreground)] shadow-sm font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            {t('transaction.expense')}
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income')
              if (!isEdit && icon === '🍔') setIcon('💰')
            }}
            className={[
              'flex-1 py-2 rounded-lg text-xs font-medium transition-fast',
              type === 'income'
                ? 'bg-[var(--surface)] text-[var(--success-foreground)] shadow-sm font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            {t('transaction.income')}
          </button>
        </div>
      </div>

      {/* Icon Picker */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)]">
            {t('categories.icon_label')}
          </label>
          <span className="text-xs text-[var(--text-muted)]">
            {t('categories.selected')}: <span className="text-base">{icon}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
          {CATEGORY_ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={[
                'w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-fast',
                icon === emoji
                  ? 'bg-[var(--primary-light)] ring-2 ring-[var(--primary)] scale-110 shadow-sm'
                  : 'hover:bg-[var(--surface)] bg-transparent',
              ].join(' ')}
              aria-label={`Select emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name Input */}
      <Input
        label={t('categories.name')}
        placeholder={t('categories.name_placeholder')}
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (error) setError(null)
        }}
        error={error ?? undefined}
        autoFocus={!isEdit}
        maxLength={50}
      />

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={onCancel}
          disabled={saving}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          fullWidth
          loading={saving}
        >
          {saving ? t('common.loading') : isEdit ? t('categories.save_changes') : t('categories.add')}
        </Button>
      </div>
    </form>
  )
}
