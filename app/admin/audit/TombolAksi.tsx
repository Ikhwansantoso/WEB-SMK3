'use client'

import { updateStatusAudit, deleteLaporan } from "@/app/actions/audit"
import { CheckCircle, Loader2, Trash2, ShieldCheck } from "lucide-react"
import { useState } from "react"

export default function TombolAksi({ id, statusSaatIni }: { id: string, statusSaatIni: string }) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fungsi Tindak Lanjut (Mark as Done)
  async function handleMarkDone() {
    if(!confirm("Tandai laporan ini sebagai SELESAI?")) return;
    setLoading(true)
    await updateStatusAudit(id, "CLOSED") 
    setLoading(false)
  }

  // Fungsi Hapus (Delete)
  async function handleDelete() {
    if(!confirm("Yakin ingin MENGHAPUS laporan ini permanen?")) return;
    setDeleting(true)
    await deleteLaporan(id)
    setDeleting(false)
  }

  return (
    <div className="flex items-center justify-end gap-2">
        
        {/* LOGIC TAMPILAN STATUS */}
        {statusSaatIni === "CLOSED" ? (
            <span className="text-green-600 font-bold text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-200">
                <ShieldCheck size={14} /> DONE
            </span>
        ) : (
            <button 
                onClick={handleMarkDone} 
                disabled={loading}
                className="text-xs font-bold bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                title="Tandai Selesai"
            >
                {loading ? <Loader2 size={12} className="animate-spin"/> : "Tindak Lanjut"}
            </button>
        )}

        {/* TOMBOL HAPUS (Selalu Muncul) */}
        <button 
            onClick={handleDelete} 
            disabled={deleting}
            className="text-xs font-bold bg-white text-red-600 border border-red-200 px-2 py-2 rounded-lg hover:bg-red-50 transition flex items-center gap-2"
            title="Hapus Laporan"
        >
            {deleting ? <Loader2 size={14} className="animate-spin text-red-600"/> : <Trash2 size={16}/>}
        </button>

    </div>
  )
}