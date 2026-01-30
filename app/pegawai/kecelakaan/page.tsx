'use client'

import { useState } from "react"
import { createLaporanKecelakaan } from "@/app/actions/kecelakaan"
import { Ambulance, Calendar, MapPin, User, FileText, Loader2, CheckCircle } from "lucide-react"

export default function LaporKecelakaanPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    try {
      await createLaporanKecelakaan(formData)
      setSuccess(true)
      event.currentTarget.reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      alert("Gagal mengirim laporan insiden.")
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
            <CheckCircle size={24}/> 
            <div>
                <span className="font-bold block">Laporan Diterima!</span>
                <span className="text-xs">Tim HSE akan segera melakukan investigasi.</span>
            </div>
        </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Waktu & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Waktu Kejadian</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input type="datetime-local" name="waktuKejadian" required className="w-full border border-slate-300 pl-10 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"/>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Lokasi Kejadian</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input name="lokasi" required placeholder="Area Gudang / Lapangan" className="w-full border border-slate-300 pl-10 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"/>
                    </div>
                </div>
            </div>

            {/* Judul & Korban */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Judul Insiden</label>
              <input name="judul" required placeholder="Contoh: Jatuh dari Tangga saat Maintenance" className="w-full border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"/>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Nama Korban (Jika ada)</label>
              <div className="relative">
                 <User className="absolute left-3 top-3 text-slate-400" size={18} />
                 <input name="korban" placeholder="Nama pegawai / mitra" className="w-full border border-slate-300 pl-10 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"/>
              </div>
            </div>
            
            {/* Kronologi */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Kronologi Singkat</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
                <textarea name="kronologi" required rows={4} placeholder="Ceritakan bagaimana kejadian bermula..." className="w-full border border-slate-300 pl-10 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500"></textarea>
              </div>
            </div>
            
            {/* Foto */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Foto Bukti / Kondisi (Opsional)</label>
              <input type="file" name="foto" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-200">
                {loading ? <Loader2 className="animate-spin"/> : "KIRIM LAPORAN INSIDEN"}
            </button>
       </form>
    </div>
  )
}