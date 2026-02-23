// app/admin/kecelakaan/page.tsx
import { PrismaClient } from '@prisma/client'
import { Ambulance, Calendar, MapPin, User, FileWarning, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import MarkDoneButton from './MarkDoneButton'

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
          <div key={item.id} className={`bg-white border-l-4 ${item.status === 'CLOSED' ? 'border-emerald-500 opacity-80' : 'border-red-600'} rounded-r-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition relative group`}>

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

            <div className="flex-1 relative">
              <div className="absolute top-0 right-0 flex items-center gap-1">
                {item.status === 'CLOSED' ? (
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <CheckCircle size={14} /> Selesai
                  </span>
                ) : (
                  <MarkDoneButton id={item.id} />
                )}
                <DeleteButton id={item.id} />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2 pr-24">Kronologi Kejadian</h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm mb-4">
                {item.kronologi}
              </p>

              {/* GAMBAR BUKTI INSIDEN */}
              {item.fotoBukti && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Foto Bukti / Lokasi Kejadian</span>
                  <a href={item.fotoBukti} target="_blank" rel="noreferrer" className="block max-w-[200px] rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group/img relative bg-slate-100 flex items-center justify-center">
                    <img src={item.fotoBukti} alt="Bukti Insiden" className="w-full h-auto object-contain max-h-32 group-hover/img:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Lihat Penuh</span>
                    </div>
                  </a>
                </div>
              )}

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
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 min-h-[400px]">
            <div className="bg-white p-6 rounded-full mb-4 shadow-sm border border-slate-100">
              <FileWarning className="text-slate-300" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada insiden tercatat</h3>
            <p className="text-slate-500 text-sm max-w-sm text-center">
              Semua berjalan dengan aman. Semoga selamanya tetap nol (<span className="font-bold text-slate-700">Zero Accident</span>)!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}