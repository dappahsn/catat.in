import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useI18n } from '@/contexts/I18nContext'
import { useToast } from '@/contexts/ToastContext'
import { getUserSettings, updateUserSettings, getReminder, updateReminder } from '@/services/settings.service'
import { getCategories, deleteCategory } from '@/services/categories.service'
import { createBackup } from '@/services/backup.service'
import { previewBackup, restoreBackup } from '@/services/backup.service'
import { deleteAllData } from '@/services/backup.service'
import type { UserSettings, Reminder, AccentColor, ThemeMode, Language } from '@/types/settings'
import type { BackupData, BackupPreview } from '@/types/backup'
import type { Category } from '@/types/category'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { ACCENT_COLORS } from '@/lib/constants'
import { ensureUserProfile } from '@/services/auth.service'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const ACCENT_COLOR_INFO: Record<AccentColor, { label: string; hsl: string }> = {
  blue:   { label: 'Biru',   hsl: 'hsl(220 91% 48%)' },
  green:  { label: 'Hijau',  hsl: 'hsl(142 71% 38%)' },
  purple: { label: 'Ungu',   hsl: 'hsl(262 83% 54%)' },
  orange: { label: 'Oranye', hsl: 'hsl(25 95% 45%)' },
  red:    { label: 'Merah',  hsl: 'hsl(0 84% 48%)' },
}


export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, accentColor, setTheme, setAccentColor } = useTheme()
  const { language, setLanguage } = useI18n()
  const { showToast } = useToast()

  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [reminder, setReminderState] = useState<Reminder | null>(null)
  const [loading, setLoading] = useState(true)

  // Logout
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Backup / Restore
  const [backingUp, setBackingUp] = useState(false)
  const [restorePreview, setRestorePreview] = useState<BackupPreview | null>(null)
  const [restoreData, setRestoreData] = useState<BackupData | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [restoring, setRestoring] = useState(false)

  // Delete all data
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Reminder
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('08:00')
  const [savingReminder, setSavingReminder] = useState(false)

  // Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [deletingCategoryLoading, setDeletingCategoryLoading] = useState(false)

  const loadCategories = useCallback(async () => {
    if (!user) return
    try {
      const data = await getCategories(user.id)
      setCategories(data)
    } catch {
      showToast('Gagal memuat kategori.', 'error')
    }
  }, [user, showToast])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const [s, r, c] = await Promise.all([
          getUserSettings(user.id),
          getReminder(user.id),
          getCategories(user.id),
        ])
        setSettings(s)
        setReminderState(r)
        setCategories(c)
        if (s) {
          setTheme(s.theme)
          setAccentColor(s.accent_color)
          setLanguage(s.language)
        }
        if (r) {
          setReminderEnabled(r.enabled)
          if (r.time) setReminderTime(r.time.substring(0, 5))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    setDeletingCategoryLoading(true)
    try {
      await deleteCategory(deletingCategory.id)
      showToast(`Kategori "${deletingCategory.name}" berhasil dihapus.`, 'success')
      setDeletingCategory(null)
      await loadCategories()
    } catch {
      showToast('Gagal menghapus kategori. Coba lagi.', 'error')
    } finally {
      setDeletingCategoryLoading(false)
    }
  }


  const saveSetting = async (updates: Partial<UserSettings>) => {
    if (!user) return
    try {
      await updateUserSettings(user.id, updates)
    } catch {
      showToast('Gagal menyimpan pengaturan.', 'error')
    }
  }

  const handleThemeChange = (t: ThemeMode) => {
    setTheme(t)
    saveSetting({ theme: t })
  }

  const handleAccentChange = (c: AccentColor) => {
    setAccentColor(c)
    saveSetting({ accent_color: c })
  }

  const handleLanguageChange = (l: Language) => {
    setLanguage(l)
    saveSetting({ language: l })
  }

  const handleReminderToggle = async (enabled: boolean) => {
    if (!user) return
    if (enabled && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        showToast('Izin notifikasi ditolak. Aktifkan di pengaturan browser.', 'error')
        return
      }
    }
    setReminderEnabled(enabled)
    setSavingReminder(true)
    try {
      await updateReminder(user.id, { enabled, time: reminderTime + ':00' })
    } finally {
      setSavingReminder(false)
    }
  }

  const handleReminderTimeSave = async () => {
    if (!user) return
    setSavingReminder(true)
    try {
      await updateReminder(user.id, { enabled: reminderEnabled, time: reminderTime + ':00' })
      showToast('Waktu pengingat disimpan.', 'success')
    } finally {
      setSavingReminder(false)
    }
  }

  const handleBackup = async () => {
    if (!user) return
    setBackingUp(true)
    try {
      await createBackup(user.id)
      showToast('Backup berhasil diunduh.', 'success')
    } catch {
      showToast('Gagal membuat backup.', 'error')
    } finally {
      setBackingUp(false)
    }
  }

  const handleRestoreFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        const { preview, error } = previewBackup(json)
        if (error || !preview) {
          showToast(error ?? 'File backup tidak valid.', 'error')
          return
        }
        setRestorePreview(preview)
        setRestoreData(json as BackupData)
        setShowRestoreDialog(true)
      } catch {
        showToast('File backup tidak valid atau rusak.', 'error')
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleRestoreConfirm = async () => {
    if (!user || !restoreData) return
    setRestoring(true)
    try {
      await restoreBackup(user.id, restoreData)
      showToast('Data berhasil dipulihkan.', 'success')
      setShowRestoreDialog(false)
      setRestorePreview(null)
      setRestoreData(null)
    } catch {
      showToast('Gagal memulihkan data. Coba lagi.', 'error')
    } finally {
      setRestoring(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!user || deleteConfirmText !== 'HAPUS') return
    setDeleting(true)
    try {
      await deleteAllData(user.id)
      // Re-create default categories
      await ensureUserProfile(user)
      showToast('Semua data berhasil dihapus.', 'success')
      setShowDeleteDialog(false)
      setDeleteConfirmText('')
    } catch {
      showToast('Gagal menghapus data.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
    } catch {
      showToast('Gagal keluar.', 'error')
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-5">
        <div className="skeleton h-7 w-32 rounded mb-6" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl mb-4" />)}
      </div>
    )
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Pengguna'
  const email = user?.email ?? ''

  return (
    <div className="px-4 py-5">
      <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">Pengaturan</h1>

      {/* === Account Info === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Akun</h2>
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-xl">
              {name[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--text-primary)] truncate">{name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{email}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Login dengan Google</p>
          </div>
        </div>
      </section>

      {/* === Categories === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Kategori Transaksi</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Kelola kategori untuk pemasukan dan pengeluaran.</p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingCategory(null)
              setShowCategoryModal(true)
            }}
            className="gap-1.5"
          >
            <Plus size={15} />
            Tambah
          </Button>
        </div>

        {/* Category Type Filter Tabs */}
        <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1 mb-3">
          <button
            type="button"
            onClick={() => setCategoryType('expense')}
            className={[
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-fast flex items-center justify-center gap-1.5',
              categoryType === 'expense'
                ? 'bg-[var(--surface)] text-[var(--danger-foreground)] shadow-sm font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <span>Pengeluaran</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--danger-light)] text-[var(--danger-foreground)] font-bold">
              {categories.filter((c) => c.type === 'expense').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCategoryType('income')}
            className={[
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-fast flex items-center justify-center gap-1.5',
              categoryType === 'income'
                ? 'bg-[var(--surface)] text-[var(--success-foreground)] shadow-sm font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <span>Pemasukan</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--success-light)] text-[var(--success-foreground)] font-bold">
              {categories.filter((c) => c.type === 'income').length}
            </span>
          </button>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-0.5">
          {categories.filter((c) => c.type === categoryType).length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--text-muted)]">
              Belum ada kategori {categoryType === 'expense' ? 'pengeluaran' : 'pemasukan'}.
            </div>
          ) : (
            categories
              .filter((c) => c.type === categoryType)
              .map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface-2)]/60 hover:bg-[var(--surface-2)] transition-fast"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-base flex-shrink-0">
                      {cat.icon ?? '📦'}
                    </span>
                    <div className="truncate flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {cat.name}
                      </p>
                      {cat.is_default && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)] font-normal flex-shrink-0">
                          Bawaan
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(cat)
                        setShowCategoryModal(true)
                      }}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] transition-fast"
                      title="Edit kategori"
                      aria-label={`Edit kategori ${cat.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--surface)] transition-fast"
                      title="Hapus kategori"
                      aria-label={`Hapus kategori ${cat.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {/* === Reminder === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Pengingat Harian</h2>
        {'Notification' in window ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-[var(--text-primary)]">Aktifkan Pengingat</p>
              <button
                role="switch"
                aria-checked={reminderEnabled}
                onClick={() => handleReminderToggle(!reminderEnabled)}
                disabled={savingReminder}
                className={[
                  'relative w-11 h-6 rounded-full transition-fast focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                  reminderEnabled ? 'bg-[var(--primary)]' : 'bg-[var(--border)]',
                  'disabled:opacity-50',
                ].join(' ')}
              >
                <span className={[
                  'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
                  reminderEnabled ? 'translate-x-5' : 'translate-x-0',
                ].join(' ')} />
              </button>
            </div>
            {reminderEnabled && (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Waktu Pengingat"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                  />
                </div>
                <Button size="sm" onClick={handleReminderTimeSave} loading={savingReminder}>
                  Simpan
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Notifikasi tidak didukung pada perangkat ini.</p>
        )}
      </section>

      {/* === Appearance === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Tampilan</h2>

        {/* Theme */}
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Tema</p>
        <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1 mb-4">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={[
                'flex-1 py-2 rounded-lg text-xs font-medium transition-fast',
                theme === t ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]',
              ].join(' ')}
              aria-pressed={theme === t}
            >
              {t === 'system' ? 'Sistem' : t === 'light' ? 'Terang' : 'Gelap'}
            </button>
          ))}
        </div>

        {/* Accent color */}
        <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Warna Utama</p>
        <div className="flex gap-2">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => handleAccentChange(c)}
              className={[
                'w-9 h-9 rounded-full transition-fast focus-visible:ring-2 focus-visible:ring-offset-2',
                accentColor === c ? 'scale-110 ring-2 ring-offset-2 ring-[var(--primary)]' : 'opacity-70 hover:opacity-100',
              ].join(' ')}
              style={{ backgroundColor: ACCENT_COLOR_INFO[c as AccentColor].hsl }}
              aria-label={ACCENT_COLOR_INFO[c as AccentColor].label}
              aria-pressed={accentColor === c}
            />
          ))}
        </div>
      </section>

      {/* === Language === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Bahasa</h2>
        <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1">
          {(['id', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={[
                'flex-1 py-2 rounded-lg text-sm font-medium transition-fast',
                language === l ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-muted)]',
              ].join(' ')}
              aria-pressed={language === l}
            >
              {l === 'id' ? 'Bahasa Indonesia' : 'English'}
            </button>
          ))}
        </div>
      </section>

      {/* === Data === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">Data</h2>

        {/* Backup */}
        <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Backup Data</p>
            <p className="text-xs text-[var(--text-muted)]">Unduh semua data sebagai file JSON.</p>
          </div>
          <Button size="sm" variant="secondary" onClick={handleBackup} loading={backingUp}>
            Backup
          </Button>
        </div>

        {/* Restore */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Pulihkan Data</p>
            <p className="text-xs text-[var(--text-muted)]">Pulihkan dari file backup JSON.</p>
          </div>
          <label className="cursor-pointer">
            <input type="file" accept=".json" className="sr-only" onChange={handleRestoreFileSelect} />
            <span className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-fast min-h-9">
              Pilih File
            </span>
          </label>
        </div>
      </section>

      {/* === Danger Zone === */}
      <section className="bg-[var(--surface)] rounded-2xl border border-[var(--danger)] border-opacity-40 p-4 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--danger)] mb-3">Zona Bahaya</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Hapus Semua Data</p>
            <p className="text-xs text-[var(--text-muted)]">Hapus semua transaksi dan rekening secara permanen.</p>
          </div>
          <Button size="sm" variant="danger" onClick={() => setShowDeleteDialog(true)}>
            Hapus
          </Button>
        </div>
      </section>

      {/* Logout */}
      <Button
        fullWidth
        variant="secondary"
        onClick={() => setShowLogoutDialog(true)}
        className="text-[var(--danger)] border-[var(--danger)] hover:bg-[var(--danger-light)]"
      >
        Keluar
      </Button>

      {/* === Dialogs === */}
      {/* Category Modal (Add / Edit) */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <CategoryForm
          category={editingCategory}
          defaultType={categoryType}
          onSuccess={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
            loadCategories()
          }}
          onCancel={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
          }}
        />
      </Modal>

      {/* Delete Category Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        title="Hapus Kategori?"
        description={`Kategori "${deletingCategory?.name}" akan dihapus. Transaksi yang sebelumnya menggunakan kategori ini akan tetap tersimpan.`}
        confirmLabel="Hapus Kategori"
        cancelLabel="Batal"
        confirmVariant="danger"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeletingCategory(null)}
        loading={deletingCategoryLoading}
      />

      {/* Logout confirm */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Keluar dari akun?"
        description="Kamu akan keluar dari aplikasi. Data keuanganmu tetap aman."
        confirmLabel="Keluar"
        cancelLabel="Batal"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        loading={loggingOut}
      />

      {/* Restore preview dialog */}
      <ConfirmDialog
        isOpen={showRestoreDialog}
        title="Pulihkan Data"
        confirmLabel="Pulihkan"
        confirmVariant="primary"
        onConfirm={handleRestoreConfirm}
        onCancel={() => { setShowRestoreDialog(false); setRestorePreview(null); setRestoreData(null) }}
        loading={restoring}
      >
        {restorePreview && (
          <div className="bg-[var(--surface-2)] rounded-xl p-3 text-sm mb-2">
            <p className="text-[var(--text-primary)] font-medium mb-2">Preview Backup</p>
            <div className="flex flex-col gap-1 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>Rekening</span><span className="font-medium">{restorePreview.accountCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaksi</span><span className="font-medium">{restorePreview.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Kategori</span><span className="font-medium">{restorePreview.categoryCount}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Data ini akan ditambahkan ke akun kamu saat ini.
            </p>
          </div>
        )}
      </ConfirmDialog>

      {/* Delete all dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Hapus Semua Data?"
        description="Semua transaksi, rekening, dan data keuangan akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus Semua Data"
        confirmVariant="danger"
        onConfirm={handleDeleteAll}
        onCancel={() => { setShowDeleteDialog(false); setDeleteConfirmText('') }}
        loading={deleting}
      >
        <Input
          label="Ketik HAPUS untuk konfirmasi"
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder="HAPUS"
        />
      </ConfirmDialog>
    </div>
  )
}
