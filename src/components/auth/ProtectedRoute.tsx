import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  redirectTo?: string
}

export function ProtectedRoute({ redirectTo = '/login' }: ProtectedRouteProps) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <img src="/icons/logo.png" alt="catat.in" className="w-10 h-10 object-contain animate-pulse" />
          <p className="text-sm text-[var(--text-muted)]">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
