// app/admin/kecelakaan/page.tsx
import { PrismaClient } from '@prisma/client'
import { Ambulance, Calendar, MapPin, User, FileWarning, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import MarkDoneButton from './MarkDoneButton'
import IncidentFilter from './IncidentFilter'
import EvidencePhotoCard from '@/app/components/EvidencePhotoCard'

const prisma = new PrismaClient()

interface SearchParams {
  q?: string;
  status?: string;
}

export default async function KecelakaanPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const unresolvedParams = await searchParams;
  const q = typeof unresolvedParams.q === 'string' ? unresolvedParams.q : '';
  const statusFilter = typeof unresolvedParams.status === 'string' ? unresolvedParams.status : 'ALL';

  // Menyusun kondisi "where" berdarkan pencarian dan filter
  let whereCondition: any = {};

  if (statusFilter !== 'ALL') {
    if (statusFilter === 'OPEN') {
      whereCondition.status = { not: 'CLOSED' }; // Termasuk OPEN & INVESTIGASI
    } else {
      whereCondition.status = statusFilter;
    }
  }

  if (q) {
    whereCondition.OR = [
      { judul: { contains: q, mode: 'insensitive' } },
      { lokasi: { contains: q, mode: 'insensitive' } },
      { kronologi: { contains: q, mode: 'insensitive' } },
      { korban: { contains: q, mode: 'insensitive' } }
    ];
  }

  const incidents = await prisma.laporanKecelakaan.findMany({
    where: whereCondition,
    orderBy: { createdAt: 'desc' },
    include: { pelapor: true }
  })

  return (
    <div className="space-y-8 font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-2 rounded-lg">
              <Ambulance size={32} />
            </span>
            Laporan Insiden
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1 ml-16">Rekapitulasi kecelakaan kerja dan kejadian berbahaya.</p>
        </div>
      </div>

      {/* FILTER & PENCARIAN */}
      <IncidentFilter />

      {/* LIST KEJADIAN */}
      <div className="grid gap-6">
        {incidents.map((item) => (
          <div key={item.id} className={`bg-white dark:bg-slate-900 border-l-4 ${item.status === 'CLOSED' ? 'border-emerald-500 opacity-80' : 'border-red-600'} rounded-r-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition relative group`}>

            {/* Tanggal & Lokasi (Kiri) */}
            <div className="md:w-48 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
                <Calendar size={18} className="text-red-500" />
                {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin size={16} />
                {item.lokasi}
              </div>
              <div className="mt-auto pt-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Korban</span>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{item.korban || "-"}</p>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="absolute top-0 right-0 flex items-center gap-1 z-10">
                {item.status === 'CLOSED' ? (
                  <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1">
                    <CheckCircle size={14} /> Selesai
                  </span>
                ) : (
                  <MarkDoneButton id={item.id} />
                )}
                <DeleteButton id={item.id} />
              </div>

              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 pr-28">Kronologi Kejadian</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/70 p-4 rounded-lg border border-slate-100 dark:border-slate-700/60 text-sm mb-4">
                {item.kronologi}
              </p>

              {/* GAMBAR BUKTI INSIDEN DENGAN PILIHAN DOWNLOAD TIMESTAMP & ASLI */}
              {item.fotoBukti && (
                <div className="mb-4">
                  <EvidencePhotoCard photoData={item.fotoBukti} title="Foto Bukti / Lokasi Kejadian" />
                </div>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
                <User size={14} />
                Dilaporkan oleh: 
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {item.pelapor?.name || 'Pegawai'}
                </span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {item.pelapor?.role || 'PEGAWAI'}
                </span>
                <span className="mx-1">•</span>
                {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </div>
            </div>

          </div>
        ))}

        {incidents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[400px]">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-full mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <FileWarning className="text-slate-300 dark:text-slate-500" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
              {q ? "Hasil pencarian tidak ditemukan" : "Belum ada insiden tercatat"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm text-center">
              {q ? `Coba gunakan kata kunci lain.` : `Semua berjalan dengan aman. Semoga selamanya tetap nol!`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}