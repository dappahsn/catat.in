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
  const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email

  return (
    <header className="sticky top-0 z-50 hidden md:block bg-[var(--nav-bg)] border-b border-[var(--nav-border)]">
      <div className="max-w-6xl mx-auto px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <NavLink to="/transactions" className="flex items-center select-none focus:outline-none" aria-label="catat.in">
          <img
            src="/icons/logo-text.png"
            alt="catat.in"
            className="h-8 w-auto object-contain"
          />
        </NavLink>

        {/* Nav links */}
        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-[var(--surface-2)] transition-fast"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            aria-label="Menu akun"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name ?? 'Avatar'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold text-sm">
                {(name ?? 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm text-[var(--text-primary)] max-w-[120px] truncate hidden lg:block">
              {name}
            </span>
            <ChevronDown size={14} className="text-[var(--text-muted)]" aria-hidden="true" />
          </button>

          {dropdownOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg py-1 z-50"
            >
              <button
                role="menuitem"
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--danger-light)] transition-fast"
              >
                <LogOut size={15} aria-hidden="true" />
                {t('settings.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
