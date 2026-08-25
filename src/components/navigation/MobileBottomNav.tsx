import { NavLink } from 'react-router-dom'
import { LayoutList, Landmark, BarChart2, Settings } from 'lucide-react'
import { useI18n } from '@/contexts/I18nContext'

const navItems = [
  { to: '/transactions', icon: LayoutList, labelKey: 'nav.transactions' as const },
  { to: '/accounts',    icon: Landmark,   labelKey: 'nav.accounts' as const },
  { to: '/recap',       icon: BarChart2,  labelKey: 'nav.recap' as const },
  { to: '/settings',   icon: Settings,   labelKey: 'nav.settings' as const },
]

export function MobileBottomNav() {
  const { t } = useI18n()

  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/80 dark:border-slate-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="px-3 py-1.5">
        <ul className="flex items-center justify-around">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <li key={to} className="flex-1 flex justify-center">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center justify-center transition-all duration-150',
                    isActive
                      ? 'bg-[#a7f3d0] dark:bg-emerald-950/80 text-[#064e3b] dark:text-emerald-300 font-semibold px-4 py-1 rounded-full'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1',
                  ].join(' ')
                }
                aria-label={t(labelKey)}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
                    <span className="text-[10px] tracking-tight mt-0.5">
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

