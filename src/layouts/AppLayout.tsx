import { Outlet } from 'react-router-dom'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { DesktopNavbar } from '@/components/navigation/DesktopNavbar'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <DesktopNavbar />
      <main
        className="pb-safe md:pb-0 md:max-w-6xl md:mx-auto md:px-6"
        id="main-content"
      >
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  )
}
