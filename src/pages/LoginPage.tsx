import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/contexts/I18nContext'
import { Button } from '@/components/ui/Button'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle, ExternalLink } from 'lucide-react'

export function LoginPage() {
  const { session, loading, signInWithGoogle } = useAuth()
  const { t } = useI18n()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && session) {
    return <Navigate to="/transactions" replace />
  }

  const handleGoogleSignIn = async () => {
    if (!isSupabaseConfigured) {
      setError('Koneksi Supabase belum diatur. Harap masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY yang valid pada file .env.')
      return
    }

    try {
      setSigningIn(true)
      setError(null)
      await signInWithGoogle()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk dengan Google. Coba lagi.'
      setError(msg)
      setSigningIn(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-[var(--surface)] rounded-3xl shadow-[var(--card-shadow)] p-8 text-center border border-[var(--border)]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-4xl select-none" aria-hidden="true">💰</span>
          <span className="text-2xl font-bold text-[var(--text-primary)]">Finance</span>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Selamat Datang
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {t('auth.tagline')}
        </p>

        {/* Warning if Supabase is not configured */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--text-primary)] space-y-1.5">
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  Supabase Belum Terhubung
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  File <code className="px-1 py-0.5 rounded bg-[var(--surface-2)] text-[11px]">.env</code> masih menggunakan URL dummy. Masukkan URL project dan Anon Key Supabase asli Anda agar autentikasi Google aktif.
                </p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] hover:underline pt-1"
                >
                  Buka Supabase Dashboard <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="mb-4 px-4 py-3 bg-[var(--danger-light)] text-[var(--danger-foreground)] rounded-xl text-xs text-left leading-relaxed">
            {error}
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          onClick={handleGoogleSignIn}
          loading={signingIn || loading}
          className="gap-3"
        >
          {!(signingIn || loading) && (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {signingIn || loading ? t('auth.loading') : t('auth.google')}
        </Button>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <a
            href="/privacy"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-fast"
          >
            {t('auth.privacy')}
          </a>
          <span className="text-[var(--border)]" aria-hidden="true">·</span>
          <a
            href="/terms"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-fast"
          >
            {t('auth.terms')}
          </a>
        </div>
      </div>
    </div>
  )
}
