'use client'

import { useState } from "react"
import { createLaporanKecelakaan } from "@/app/actions/kecelakaan"
import { Ambulance, Calendar, MapPin, User, FileText, Loader2, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import TimestampPhotoInput from "@/app/components/TimestampPhotoInput"

export default function LaporKecelakaanPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [stampedFile, setStampedFile] = useState<File | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [waktuKejadian, setWaktuKejadian] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const form = event.currentTarget // ✅ Amankan referensi form
    const formData = new FormData(form)
    if (stampedFile) {
      formData.set('foto', stampedFile)
    }
    if (originalFile) {
      formData.set('fotoOriginal', originalFile)
    }

    // Gunakan toast.promise untuk UX yang lebih baik saat submit
    const submitPromise = createLaporanKecelakaan(formData)

    toast.promise(submitPromise, {
      loading: "Mengirim laporan...",
      success: "Laporan berhasil dikirim!",
      error: "Gagal mengirim laporan",
    })

    try {
      const result = await submitPromise

      if (result.success) {
        setSuccess(true)
        form.reset() // ✅ Gunakan variabel 'form' yang aman
        setStampedFile(null)
        setOriginalFile(null)
        const now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        setWaktuKejadian(now.toISOString().slice(0, 16))
        setTimeout(() => setSuccess(false), 5000)
      } else {
        toast.error(`Gagal mengirim laporan: ${result.message}`)
      }

    } catch (error) {
      console.error(error)
      // Tampilkan pesan error asli untuk debugging
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan sistem (Unknown Error)"
      toast.error(`DEBUG ERROR: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-8 min-h-screen max-w-2xl mx-auto pb-24">

      {/* Header Merah */}
      <div className="mb-8 p-6 bg-red-600 rounded-3xl text-white shadow-xl shadow-red-200 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-black flex items-center gap-3">
            <Ambulance className="text-white" size={32} />
            Lapor Insiden
          </h1>
          <p className="text-red-100 text-sm mt-2 opacity-90">
            Gunakan formulir ini untuk melaporkan kecelakaan kerja, near-miss, atau kejadian berbahaya.
          </p>
        </div>
        <Ambulance className="absolute -right-6 -bottom-6 text-white/10" size={150} />
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={24} />
          <div>
            <span className="font-bold block">Laporan Diterima!</span>
            <span className="text-xs">Tim HSE akan segera melakukan investigasi.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">

        {/* Waktu & Lokasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 block">Waktu Kejadian</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
              <input
                type="datetime-local"
                name="waktuKejadian"
                required
                suppressHydrationWarning
                value={waktuKejadian}
                onChange={(e) => setWaktuKejadian(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 p-3 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 block">Lokasi Kejadian</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
              <input
                name="lokasi"
                required
                placeholder="Area Gudang / Lapangan"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 p-3 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Judul & Korban */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 block">Judul Insiden</label>
          <input
            name="judul"
            required
            placeholder="Contoh: Jatuh dari Tangga saat Maintenance"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 block">Nama Korban (Jika ada)</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
            <input
              name="korban"
              placeholder="Nama pegawai / mitra"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 p-3 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Kronologi */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1 block">Kronologi Singkat</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-500 dark:text-slate-400" size={18} />
            <textarea
              name="kronologi"
              required
              rows={4}
              placeholder="Ceritakan bagaimana kejadian bermula..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 pl-10 p-3 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-red-500 shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
            ></textarea>
          </div>
        </div>

        {/* Foto Bukti dengan Timestamp Otomatis (Mengikuti Waktu Kejadian) */}
        <TimestampPhotoInput
          name="foto"
          required={false}
          label="Foto Bukti / Kondisi Insiden (Opsional)"
          subLabel="Foto otomatis diberi cap GPS & waktu sesuai waktu kejadian di atas."
          customDate={waktuKejadian}
          onChange={(stamped, orig) => {
            setStampedFile(stamped)
            setOriginalFile(orig)
          }}
        />

        <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none">
          {loading ? <Loader2 className="animate-spin" /> : "KIRIM LAPORAN INSIDEN"}
        </button>
      </form>
    </div>
  )
}