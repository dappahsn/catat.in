import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function PrivacyPage() {
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
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Kebijakan Privasi</h1>
        </div>

        <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>
            Privasi Anda sangat penting bagi kami. Kebijakan Privasi ini menjelaskan bagaimana aplikasi
            <strong> catat.in</strong> mengumpulkan, menggunakan, dan melindungi data pribadi Anda.
          </p>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">1. Pengumpulan Data</h2>
          <p>
            Kami hanya mengumpulkan data yang diperlukan untuk menjalankan fungsionalitas aplikasi pencatatan keuangan:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Informasi akun Google (nama, alamat email, foto profil) untuk proses autentikasi.</li>
            <li>Data transaksi dan rekening yang Anda masukkan secara sukarela ke dalam aplikasi.</li>
            <li>Pengaturan preferensi aplikasi (tema, bahasa, mata uang).</li>
          </ul>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">2. Keamanan & Kepemilikan Data</h2>
          <p>
            Semua data finansial Anda bersifat pribadi dan dilindungi dengan kebijakan Row Level Security (RLS) di basis data. Pengguna lain tidak memiliki akses terhadap data keuangan Anda. Kami tidak menjual atau membagikan data Anda kepada pihak ketiga.
          </p>

          <h2 className="text-base font-semibold text-[var(--text-primary)] pt-2">3. Kontrol Data</h2>
          <p>
            Anda memiliki kontrol penuh atas data Anda. Anda dapat mengekspor data ke format CSV, membuat cadangan JSON, atau menghapus seluruh data Anda kapan saja melalui menu Pengaturan.
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
