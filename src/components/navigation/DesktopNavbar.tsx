import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutList, Wallet, BarChart2, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { useToast } from '@/contexts/ToastContext'

const navItems = [
  { to: '/transactions', icon: LayoutList, labelKey: 'nav.transactions' as const },
  { to: '/accounts',    icon: Wallet,      labelKey: 'nav.accounts' as const },
  { to: '/recap',       icon: BarChart2,   labelKey: 'nav.recap' as const },
  { to: '/settings',   icon: Settings,    labelKey: 'nav.settings' as const },
]

export function DesktopNavbar() {
  const { user, signOut } = useAuth()
  const { t } = useI18n()
  const { showToast } = useToast()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch {
      showToast('Gagal keluar. Coba lagi.', 'error')
    }
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email ?? 'Pengguna'

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <NavLink to="/transactions" className="flex items-center select-none focus:outline-none" aria-label="catat.in">
          <img
            src="/icons/logo-text.png"
            alt="catat.in"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </NavLink>

        {/* Nav links (Desktop only) */}
        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-fast',
                  isActive
                    ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                  {t(labelKey)}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User avatar dropdown (Visible on both mobile & desktop) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 p-1 md:pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="Menu akun"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#064e3b] dark:bg-emerald-700 flex items-center justify-center text-white font-bold text-xs shadow-2xs">
                {name[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-slate-900 dark:text-white max-w-[120px] truncate hidden lg:block">
              {name}
            </span>
            <ChevronDown size={14} className="text-slate-400 dark:text-slate-500 hidden sm:block" aria-hidden="true" />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-2xl shadow-xl py-1.5 z-50 divide-y divide-slate-100 dark:divide-slate-800"
            >
              <div className="px-4 py-2.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <NavLink
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings size={15} />
                  {t('nav.settings')}
                </NavLink>
                <button
                  role="menuitem"
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut size={15} />
                  {t('settings.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
