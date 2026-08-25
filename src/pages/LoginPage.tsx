import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle, ExternalLink } from 'lucide-react'

export function LoginPage() {
  const { session, loading, signInWithGoogle } = useAuth()
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
    <div className="w-full max-w-[380px] flex flex-col items-center">
      {/* Main Card */}
      <div className="w-full bg-white dark:bg-[var(--surface)] rounded-[32px] p-8 sm:p-10 text-center border border-slate-100 dark:border-[var(--border)] shadow-[0_2px_18px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col items-center">
        {/* Logo Circle Badge */}
        <div className="w-28 h-28 rounded-full bg-white dark:bg-slate-800/90 border-[7px] border-[#f0f2f5] dark:border-slate-800 flex items-center justify-center mb-6 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          <img
            src="/icons/logo-text.png"
            alt="catat.in"
            className="w-20 object-contain select-none"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#063d35] dark:text-emerald-400 tracking-tight mb-4">
          catat.in
        </h1>

        {/* Tagline */}
        <p className="text-[15px] sm:text-base text-slate-700 dark:text-slate-300 font-normal leading-relaxed mb-8">
          Kelola keuangan dengan lebih mudah.
        </p>

        {/* Supabase Notice if not configured */}
        {!isSupabaseConfigured && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--text-primary)] space-y-1.5">
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  Supabase Belum Terhubung
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  File <code className="px-1 py-0.5 rounded bg-[var(--surface-2)] text-[11px]">.env</code> masih menggunakan konfigurasi dummy.
                </p>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] hover:underline pt-0.5"
                >
                  Buka Supabase Dashboard <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div role="alert" className="w-full mb-4 px-4 py-3 bg-[var(--danger-light)] text-[var(--danger-foreground)] rounded-xl text-xs text-left leading-relaxed">
            {error}
          </div>
        )}

        {/* Google Sign-in Pill Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={signingIn || loading}
          className="w-full h-12 px-6 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow"
        >
          {signingIn || loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-600 dark:text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Memuat...</span>
            </>
          ) : (
            <>
              <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-center gap-3 mt-8 text-xs text-slate-500 dark:text-slate-400">
        <Link
          to="/privacy"
          className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-slate-300 dark:text-slate-600 select-none" aria-hidden="true">·</span>
        <Link
          to="/terms"
          className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
