import { NavLink } from 'react-router-dom'
import { LayoutList, Wallet, BarChart2, Settings } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const navItems = [
  { to: '/transactions', icon: LayoutList, labelKey: 'nav.transactions' as const },
  { to: '/accounts',    icon: Wallet,      labelKey: 'nav.accounts' as const },
  { to: '/recap',       icon: BarChart2,   labelKey: 'nav.recap' as const },
  { to: '/settings',   icon: Settings,    labelKey: 'nav.settings' as const },
]

export function MobileBottomNav() {
  const { t } = useI18n()

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bg-[var(--nav-bg)] border-t border-[var(--nav-border)] px-2">
        <ul className="flex justify-around">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center gap-0.5 px-4 py-2 min-h-[56px] transition-fast rounded-lg',
                    isActive
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                  ].join(' ')
                }
                aria-label={t(labelKey)}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} aria-hidden="true" />
                    <span className={`text-[10px] font-medium ${isActive ? 'text-[var(--primary)]' : ''}`}>
                      {t(labelKey)}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
