import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--background)] flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
