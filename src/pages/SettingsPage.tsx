import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useI18n } from '@/contexts/I18nContext'
import { useToast } from '@/contexts/ToastContext'
import { getUserSettings, updateUserSettings, getReminder, updateReminder } from '@/services/settings.service'
import { getCategories, deleteCategory } from '@/services/categories.service'
import { createBackup, previewBackup, restoreBackup, deleteAllData } from '@/services/backup.service'
import type { UserSettings, ThemeMode, Language } from '@/types/settings'
import type { BackupData, BackupPreview } from '@/types/backup'
import type { Category } from '@/types/category'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { ensureUserProfile } from '@/services/auth.service'
import {
  Bell,
  Palette,
  Globe,
  Tag,
  CloudUpload,
  History,
  Trash2,
  ChevronRight,
  Plus,
  Pencil,
  Check,
  Clock,
  Sun,
  Moon,
} from 'lucide-react'

export function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)

  // Modals
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)

  // Logout
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTab, setCategoryTab] = useState<'expense' | 'income'>('expense')
  const [showCategoryFormModal, setShowCategoryFormModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [deletingCategoryLoading, setDeletingCategoryLoading] = useState(false)

  // Reminder
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('08:00')
  const [tempReminderTime, setTempReminderTime] = useState('08:00')
  const [savingReminder, setSavingReminder] = useState(false)

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

  const loadCategories = useCallback(async () => {
    if (!user) return
    try {
      const data = await getCategories(user.id)
      setCategories(data)
    } catch {
      showToast(t('common.failed_load'), 'error')
    }
  }, [user, showToast, t])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const [s, r, c] = await Promise.all([
          getUserSettings(user.id),
          getReminder(user.id),
          getCategories(user.id),
        ])
        setCategories(c)
        if (s) {
          setTheme(s.theme)
          setLanguage(s.language)
        }
        if (r) {
          setReminderEnabled(r.enabled)
          if (r.time) {
            const parsedTime = r.time.substring(0, 5)
            setReminderTime(parsedTime)
            setTempReminderTime(parsedTime)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const saveSetting = async (updates: Partial<UserSettings>) => {
    if (!user) return
    try {
      await updateUserSettings(user.id, updates)
    } catch {
      showToast(t('common.error'), 'error')
    }
  }

  const handleThemeChange = (tMode: ThemeMode) => {
    setTheme(tMode)
    saveSetting({ theme: tMode })
  }

  const handleLanguageChange = (l: Language) => {
    setLanguage(l)
    saveSetting({ language: l })
    setShowLanguageModal(false)
    showToast(l === 'id' ? 'Bahasa berhasil diubah.' : 'Language updated.', 'success')
  }

  const handleReminderToggle = async (enabled: boolean) => {
    if (!user) return
    if (enabled && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        showToast(t('reminder.permission_denied'), 'error')
        return
      }
    }
    setReminderEnabled(enabled)
    setSavingReminder(true)
    try {
      await updateReminder(user.id, { enabled, time: reminderTime + ':00' })
      showToast(enabled ? (language === 'en' ? 'Daily reminder enabled.' : 'Pengingat harian diaktifkan.') : (language === 'en' ? 'Daily reminder disabled.' : 'Pengingat harian dinonaktifkan.'), 'success')
    } finally {
      setSavingReminder(false)
    }
  }

  const handleReminderTimeSave = async () => {
    if (!user) return
    setSavingReminder(true)
    try {
      setReminderTime(tempReminderTime)
      await updateReminder(user.id, { enabled: reminderEnabled, time: tempReminderTime + ':00' })
      setShowTimeModal(false)
      showToast(language === 'en' ? 'Reminder time saved.' : 'Waktu pengingat disimpan.', 'success')
    } finally {
      setSavingReminder(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return
    setDeletingCategoryLoading(true)
    try {
      await deleteCategory(deletingCategory.id)
      showToast(t('categories.success_delete'), 'success')
      setDeletingCategory(null)
      await loadCategories()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setDeletingCategoryLoading(false)
    }
  }

  const handleBackup = async () => {
    if (!user) return
    setBackingUp(true)
    try {
      await createBackup(user.id)
      showToast(t('backup.success'), 'success')
    } catch {
      showToast(t('common.error'), 'error')
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
          showToast(error ?? t('restore.invalid'), 'error')
          return
        }
        setRestorePreview(preview)
        setRestoreData(json as BackupData)
        setShowRestoreDialog(true)
      } catch {
        showToast(t('restore.invalid'), 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleRestoreConfirm = async () => {
    if (!user || !restoreData) return
    setRestoring(true)
    try {
      await restoreBackup(user.id, restoreData)
      showToast(t('restore.success'), 'success')
      setShowRestoreDialog(false)
      setRestorePreview(null)
      setRestoreData(null)
      await loadCategories()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setRestoring(false)
    }
  }

  const handleDeleteAll = async () => {
    const expectedConfirm = language === 'en' ? 'DELETE' : 'HAPUS'
    if (!user || deleteConfirmText.trim().toUpperCase() !== expectedConfirm) return
    setDeleting(true)
    try {
      await deleteAllData(user.id)
      await ensureUserProfile(user)
      showToast(t('danger.success'), 'success')
      setShowDeleteDialog(false)
      setDeleteConfirmText('')
      await loadCategories()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
    } catch {
      showToast(t('common.error'), 'error')
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-4 md:px-0 py-6 space-y-6">
        <div className="skeleton h-8 w-36 rounded mb-6" />
        <div className="skeleton h-24 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-52 rounded-2xl" />
        </div>
      </div>
    )
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? 'Pengguna'
  const email = user?.email ?? 'user@example.com'

  const themeLabels: Record<ThemeMode, string> = {
    light: 'Terang',
    dark: 'Gelap',
    system: 'Terang',
  }

  const languageLabels: Record<Language, string> = {
    id: 'Bahasa Indonesia',
    en: 'English',
  }

  return (
    <div className="min-h-screen pb-12">
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto px-4 md:px-0 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#063d35] dark:text-emerald-400">
            {t('settings.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* === SECTION 1: ACCOUNT === */}
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2.5">
            {t('settings.account')}
          </h2>
          <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-slate-200/80 dark:border-[var(--border)] p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-13 h-13 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-100 dark:border-slate-700 flex-shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl sm:text-2xl flex-shrink-0 shadow-2xs">
                  {name[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
                  {name}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#b91c1c] hover:bg-red-700 active:bg-red-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex-shrink-0 shadow-2xs"
            >
              {t('settings.logout')}
            </button>
          </div>
        </div>

        {/* === SECTION 2 & 3: GRID ON DESKTOP (Side by side on lg:, stacked on mobile) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* === SECTION 2: PREFERENCES === */}
          <div className="flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2.5">
              {t('settings.preferences')}
            </h2>
            <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-slate-200/80 dark:border-[var(--border)] shadow-xs divide-y divide-slate-100 dark:divide-[var(--border)] overflow-hidden">
              {/* 1. Daily Reminder */}
              <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#a7f3d0]/60 dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Bell size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('reminder.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                      {reminderEnabled ? `${t('reminder.active_at')} ${reminderTime}` : t('reminder.subtitle')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {reminderEnabled && (
                    <button
                      onClick={() => {
                        setTempReminderTime(reminderTime)
                        setShowTimeModal(true)
                      }}
                      className="p-1.5 px-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                      title={t('reminder.adjust_time')}
                    >
                      <Clock size={14} />
                      <span className="font-medium">{reminderTime}</span>
                    </button>
                  )}
                  <button
                    role="switch"
                    aria-checked={reminderEnabled}
                    onClick={() => handleReminderToggle(!reminderEnabled)}
                    disabled={savingReminder}
                    className={[
                      'relative w-12 h-6 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                      reminderEnabled ? 'bg-[#064e3b] dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700',
                      'disabled:opacity-50 flex-shrink-0',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-150',
                        reminderEnabled ? 'translate-x-6' : 'translate-x-0',
                      ].join(' ')}
                    />
                  </button>
                </div>
              </div>

              {/* 2. Theme */}
              <button
                onClick={() => setShowThemeModal(true)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#a7f3d0]/60 dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Palette size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('theme.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 capitalize">
                      {theme === 'dark' ? t('theme.dark') : t('theme.light')}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              </button>

              {/* 3. Language */}
              <button
                onClick={() => setShowLanguageModal(true)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#a7f3d0]/60 dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('language.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {language === 'en' ? 'English' : 'Bahasa Indonesia'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              </button>

              {/* 4. Categories */}
              <button
                onClick={() => setShowCategoriesModal(true)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#a7f3d0]/60 dark:bg-emerald-950/60 text-[#065f46] dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Tag size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('categories.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {categories.length} {t('categories.registered')}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* === SECTION 3: DATA MANAGEMENT === */}
          <div className="flex flex-col">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2.5">
              {t('settings.data_management')}
            </h2>
            <div className="bg-white dark:bg-[var(--surface)] rounded-2xl border border-slate-200/80 dark:border-[var(--border)] shadow-xs divide-y divide-slate-100 dark:divide-[var(--border)] overflow-hidden">
              {/* 1. Backup Data */}
              <button
                onClick={handleBackup}
                disabled={backingUp}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors disabled:opacity-60"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-[#22242a] text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <CloudUpload size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('backup.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {backingUp ? t('backup.preparing') : t('backup.save_desc')}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#22242a] text-slate-700 dark:text-slate-300">
                  {t('backup.button_short')}
                </span>
              </button>

              {/* 2. Restore Data */}
              <label className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  className="sr-only"
                  onChange={handleRestoreFileSelect}
                />
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 dark:bg-[#22242a] text-slate-700 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                    <History size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {t('restore.title')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {t('restore.load_desc')}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#22242a] text-slate-700 dark:text-slate-300">
                  {t('restore.button')}
                </span>
              </label>

              {/* 3. Delete All Data */}
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-full p-4 sm:p-4.5 flex items-center justify-between gap-3 text-left hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-100/70 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                    <Trash2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm sm:text-base text-red-700 dark:text-red-400">
                      {t('danger.delete_all')}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {t('danger.undone_desc')}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-red-400 flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* MODALS & DIALOGS */}
      {/* ========================================================================= */}

      {/* --- Theme Modal --- */}
      <Modal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title={t('theme.choose_theme')}
      >
        <div className="space-y-2.5">
          <button
            onClick={() => {
              handleThemeChange('light')
              setShowThemeModal(false)
            }}
            className={[
              'w-full p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all',
              theme === 'light'
                ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-2xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <Sun size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{t('theme.light_label')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{t('theme.light_desc')}</p>
              </div>
            </div>
            {theme === 'light' && <Check size={18} />}
          </button>

          <button
            onClick={() => {
              handleThemeChange('dark')
              setShowThemeModal(false)
            }}
            className={[
              'w-full p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all',
              theme === 'dark'
                ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] shadow-2xs'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Moon size={18} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{t('theme.dark_label')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{t('theme.dark_desc')}</p>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} />}
          </button>
        </div>
      </Modal>

      {/* --- Language Modal --- */}
      <Modal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t('language.choose_language')}
      >
        <div className="space-y-3">
          {(['id', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={[
                'w-full p-3.5 rounded-xl border flex items-center justify-between text-sm font-semibold transition-all',
                language === lang
                  ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200',
              ].join(' ')}
            >
              <span>{lang === 'id' ? '🇮🇩  Bahasa Indonesia' : '🇬🇧  English'}</span>
              {language === lang && <Check size={18} />}
            </button>
          ))}
        </div>
      </Modal>

      {/* --- Daily Reminder Time Modal --- */}
      <Modal
        isOpen={showTimeModal}
        onClose={() => setShowTimeModal(false)}
        title={t('reminder.adjust_time')}
      >
        <div className="space-y-4">
          <Input
            label={t('reminder.choose_time')}
            type="time"
            value={tempReminderTime}
            onChange={(e) => setTempReminderTime(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setShowTimeModal(false)}>
              {t('common.cancel')}
            </Button>
            <Button fullWidth onClick={handleReminderTimeSave} loading={savingReminder}>
              {t('reminder.save_time')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- Categories Manager Modal --- */}
      <Modal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        title={t('categories.manage_title')}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Tabs & Add Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1 bg-[var(--surface-2)] rounded-xl p-1 flex-1">
              <button
                type="button"
                onClick={() => setCategoryTab('expense')}
                className={[
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
                  categoryTab === 'expense'
                    ? 'bg-white dark:bg-slate-800 text-[var(--danger-foreground)] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                ].join(' ')}
              >
                <span>{t('transaction.expense')}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 font-bold">
                  {categories.filter((c) => c.type === 'expense').length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryTab('income')}
                className={[
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
                  categoryTab === 'income'
                    ? 'bg-white dark:bg-slate-800 text-[var(--success-foreground)] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
                ].join(' ')}
              >
                <span>{t('transaction.income')}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold">
                  {categories.filter((c) => c.type === 'income').length}
                </span>
              </button>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setEditingCategory(null)
                setShowCategoryFormModal(true)
              }}
              className="gap-1 flex-shrink-0"
            >
              <Plus size={15} />
              {t('categories.add_short')}
            </Button>
          </div>

          {/* Categories List */}
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {categories.filter((c) => c.type === categoryTab).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {categoryTab === 'expense' ? t('categories.empty_expense') : t('categories.empty_income')}
              </div>
            ) : (
              categories
                .filter((c) => c.type === categoryTab)
                .map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-base flex-shrink-0 shadow-2xs">
                        {cat.icon ?? '📦'}
                      </span>
                      <div className="truncate flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {cat.name}
                        </p>
                        {cat.is_default && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-normal">
                            {t('categories.default_badge')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategory(cat)
                          setShowCategoryFormModal(true)
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[var(--primary)] hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        title={t('common.edit')}
                        aria-label={`Edit ${cat.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        title={t('common.delete')}
                        aria-label={`Hapus ${cat.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </Modal>

      {/* --- Add / Edit Category Form Modal --- */}
      <Modal
        isOpen={showCategoryFormModal}
        onClose={() => {
          setShowCategoryFormModal(false)
          setEditingCategory(null)
        }}
        title={editingCategory ? t('categories.edit') : t('categories.add')}
      >
        <CategoryForm
          category={editingCategory}
          defaultType={categoryTab}
          onSuccess={() => {
            setShowCategoryFormModal(false)
            setEditingCategory(null)
            loadCategories()
          }}
          onCancel={() => {
            setShowCategoryFormModal(false)
            setEditingCategory(null)
          }}
        />
      </Modal>

      {/* --- Delete Category Confirm Dialog --- */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        title={t('categories.delete_title')}
        description={`"${deletingCategory?.name}" ${t('categories.delete_desc')}`}
        confirmLabel={t('categories.delete_btn')}
        cancelLabel={t('common.cancel')}
        confirmVariant="danger"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeletingCategory(null)}
        loading={deletingCategoryLoading}
      />

      {/* --- Logout Confirm Dialog --- */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title={t('settings.logout_confirm')}
        description={t('settings.logout_desc')}
        confirmLabel={t('settings.logout')}
        cancelLabel={t('common.cancel')}
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        loading={loggingOut}
      />

      {/* --- Restore Preview Dialog --- */}
      <ConfirmDialog
        isOpen={showRestoreDialog}
        title={t('restore.title')}
        confirmLabel={t('restore.confirm')}
        cancelLabel={t('common.cancel')}
        confirmVariant="primary"
        onConfirm={handleRestoreConfirm}
        onCancel={() => {
          setShowRestoreDialog(false)
          setRestorePreview(null)
          setRestoreData(null)
        }}
        loading={restoring}
      >
        {restorePreview && (
          <div className="bg-[var(--surface-2)] rounded-xl p-3 text-sm mb-2">
            <p className="text-[var(--text-primary)] font-medium mb-2">{t('restore.preview')}</p>
            <div className="flex flex-col gap-1 text-[var(--text-secondary)]">
              <div className="flex justify-between">
                <span>{t('restore.accounts')}</span>
                <span className="font-medium">{restorePreview.accountCount}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('restore.transactions')}</span>
                <span className="font-medium">{restorePreview.transactionCount}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('restore.categories')}</span>
                <span className="font-medium">{restorePreview.categoryCount}</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {t('restore.preview_note')}
            </p>
          </div>
        )}
      </ConfirmDialog>

      {/* --- Delete All Data Confirm Dialog --- */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title={t('danger.delete_all_title')}
        description={t('danger.delete_all_desc')}
        confirmLabel={t('danger.delete_button')}
        cancelLabel={t('common.cancel')}
        confirmVariant="danger"
        onConfirm={handleDeleteAll}
        onCancel={() => {
          setShowDeleteDialog(false)
          setDeleteConfirmText('')
        }}
        loading={deleting}
      >
        <Input
          label={t('danger.type_to_confirm')}
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder={t('danger.confirm_word')}
        />
      </ConfirmDialog>
    </div>
  )
}

