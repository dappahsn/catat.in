import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4 flex justify-center">
      <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-[var(--card-shadow)]">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-[var(--surface-2)] transition-fast"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} className="text-[var(--text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Syarat & Ketentuan</h1>
        </div>

        <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>
            Dengan menggunakan aplikasi <strong>Finance</strong>, Anda menyetujui syarat dan ketentuan penggunaan berikut ini.
          </p>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">1. Penggunaan Layanan</h2>
          <p>
            Aplikasi ini disediakan sebagai alat bantu pencatatan dan pengelolaan keuangan pribadi. Anda bertanggung jawab atas keakuratan data yang Anda masukkan dan keamanan kredensial akun Google Anda.
          </p>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">2. Batasan Tanggung Jawab</h2>
          <p>
            Aplikasi Finance tidak menyediakan layanan perbankan, penasihat keuangan berlisensi, atau jaminan atas keputusan finansial yang Anda buat berdasarkan rekap atau kalkulasi pada aplikasi ini.
          </p>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">3. Perubahan Layanan</h2>
          <p>
            Kami dapat memperbarui fitur atau ketentuan layanan secara berkala untuk meningkatkan kinerja, keamanan, dan keandalan sistem.
          </p>

          <div className="pt-6">
            <Button variant="secondary" onClick={() => navigate(-1)} fullWidth>
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
