'use client'

import { useState } from "react"
import { createLaporanTemuan } from "@/app/actions/audit"
import { MapPin, AlertTriangle, Loader2, CheckCircle, Clock, ShieldCheck, AlertOctagon } from "lucide-react"

export default function LaporAuditPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [kondisi, setKondisi] = useState("BUTUH_PERBAIKAN") // Default

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    // ✅ 1. AMANKAN DULU FORM-NYA KE VARIABEL
    const form = event.currentTarget 
    
    setLoading(true)
    
    // Gunakan variabel 'form' untuk ambil data
    const formData = new FormData(form)
    
    // --- PROSES MENUNGGU (AWAIT) ---
    // Di sini 'event' aslinya akan hangus/hilang
    const result = await createLaporanTemuan(formData)

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      
      // ✅ 2. GUNAKAN VARIABEL YANG TADI DISIMPAN
      form.reset()   
      
      setKondisi("BUTUH_PERBAIKAN") 
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert(`Gagal mengirim laporan: ${result.message}`)
    }
  }

  return (
    <div className="p-6 md:p-8 min-h-screen max-w-2xl mx-auto pb-24">
       <div className="mb-6">
         <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" /> Lapor Temuan
         </h1>
         <p className="text-slate-500 text-sm">Formulir inspeksi rutin & pelaporan bahaya.</p>
       </div>

       {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <CheckCircle size={20}/> <span className="font-bold">Laporan Berhasil Disimpan!</span>
        </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            
            {/* PILIHAN KONDISI (AMAN / TIDAK) */}
            <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Status Kondisi</label>
                <div className="grid grid-cols-2 gap-4">
                    {/* Input Hidden untuk kirim data ke Server Action */}
                    <input type="hidden" name="kondisi" value={kondisi} />

                    <button 
                        type="button"
                        onClick={() => setKondisi("AMAN")}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            kondisi === "AMAN" 
                            ? "border-green-500 bg-green-50 text-green-700" 
                            : "border-slate-200 text-slate-400 hover:border-green-200"
                        }`}
                    >
                        <ShieldCheck size={32} />
                        <span className="font-bold text-sm">AMAN</span>
                    </button>

                    <button 
                        type="button"
                        onClick={() => setKondisi("BUTUH_PERBAIKAN")}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                            kondisi === "BUTUH_PERBAIKAN" 
                            ? "border-red-500 bg-red-50 text-red-700" 
                            : "border-slate-200 text-slate-400 hover:border-red-200"
                        }`}
                    >
                        <AlertOctagon size={32} />
                        <span className="font-bold text-sm">BUTUH PERBAIKAN</span>
                    </button>
                </div>
            </div>

            {/* Input Waktu */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Waktu Inspeksi</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="datetime-local" 
                    name="waktuTemuan" 
                    required 
                    className="w-full bg-white border border-slate-300 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Input Judul */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Judul Temuan / Area</label>
              <input 
                name="judul" 
                required 
                placeholder={kondisi === 'AMAN' ? "Contoh: Area Panel Listrik Rapi" : "Contoh: Kabel Terkelupas"} 
                className="w-full bg-white border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            {/* Input Lokasi */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Lokasi</label>
              <div className="relative">
                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                    name="lokasi" 
                    required 
                    placeholder="Contoh: Ruang Server Lt.2" 
                    className="w-full bg-white border border-slate-300 pl-10 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder:text-slate-400"
                 />
              </div>
            </div>
            
            {/* Input Deskripsi */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Catatan / Deskripsi</label>
              <textarea 
                name="deskripsi" 
                rows={3} 
                placeholder="Tuliskan detail kondisi..." 
                className="w-full bg-white border border-slate-300 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 placeholder:text-slate-400"
              ></textarea>
            </div>
            
            {/* Input Foto */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Foto Bukti</label>
              <input 
                type="file" 
                name="foto" 
                accept="image/*" 
                // Kalau Aman foto opsional, kalau bahaya wajib
                required={kondisi === "BUTUH_PERBAIKAN"} 
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>

            <button 
                disabled={loading} 
                type="submit" 
                className={`w-full font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-all active:scale-95 shadow-lg ${
                    kondisi === 'AMAN' 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200" 
                    : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
                }`}
            >
                {loading ? <Loader2 className="animate-spin"/> : "KIRIM LAPORAN"}
            </button>
       </form>
    </div>
  )
}