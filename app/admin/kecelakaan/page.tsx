// app/admin/kecelakaan/page.tsx
import { PrismaClient } from '@prisma/client'
import { Ambulance, Calendar, MapPin, User, FileWarning } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function KecelakaanPage() {
  const incidents = await prisma.laporanKecelakaan.findMany({
    orderBy: { createdAt: 'desc' },
    include: { pelapor: true } // Ambil data siapa yang lapor
  })

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <span className="bg-red-100 text-red-600 p-2 rounded-lg">
                <Ambulance size={32} />
            </span>
            Laporan Insiden
          </h1>
          <p className="text-slate-600 font-medium mt-1 ml-16">Rekapitulasi kecelakaan kerja dan kejadian berbahaya.</p>
        </div>
      </div>

      {/* LIST KEJADIAN */}
      <div className="grid gap-6">
        {incidents.map((item) => (
            <div key={item.id} className="bg-white border-l-4 border-red-600 rounded-r-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
                
                {/* Tanggal & Lokasi (Kiri) */}
                <div className="md:w-48 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                        <Calendar size={18} className="text-red-500" />
                       {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin size={16} />
                        {item.lokasi}
                    </div>
                    <div className="mt-auto pt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Korban</span>
                        <p className="font-semibold text-slate-800">{item.korban || "-"}</p>
                    </div>
                </div>

                {/* Detail Kejadian (Kanan) */}
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Kronologi Kejadian</h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                        {item.kronologi}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <User size={14} />
                        Dilaporkan oleh: <span className="font-bold text-slate-600">{item.pelapor?.name || 'Pegawai'}</span>
                        <span className="mx-1">•</span>
                        {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </div>
                </div>

            </div>
        ))}

        {incidents.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <FileWarning className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-slate-500 font-bold">Belum ada insiden tercatat</h3>
                <p className="text-slate-400 text-sm">Semoga selamanya tetap nol (Zero Accident)!</p>
            </div>
        )}
      </div>
    </div>
  )
}