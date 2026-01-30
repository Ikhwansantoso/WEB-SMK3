// app/admin/audit/[id]/page.tsx
import { PrismaClient } from '@prisma/client'
import { ArrowLeft, Calendar, MapPin, User, CheckCircle, AlertTriangle, Trash2, CheckSquare } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// --- SERVER ACTION: MARK AS DONE ---
async function markAsDone(id: string) {
  'use server'
  await prisma.temuanAudit.update({
    where: { id },
    data: { status: 'CLOSED' }
  })
  redirect(`/admin/audit/${id}`) // Refresh halaman ini
}

// --- SERVER ACTION: HAPUS DATA ---
async function deleteReport(id: string) {
  'use server'
  await prisma.temuanAudit.delete({
    where: { id }
  })
  redirect('/admin/audit') // Balik ke tabel utama
}

// Ambil ID dari URL (params)
export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const audit = await prisma.temuanAudit.findUnique({
    where: { id },
    include: { auditor: true } // Ikut ambil data user pelapor
  })

  if (!audit) return <div>Data tidak ditemukan</div>

  const isSafe = audit.judul.includes('[AMAN]')
  const cleanTitle = audit.judul.replace('[AMAN]', '').replace('[TEMUAN]', '').trim()

  return (
    <div className="max-w-3xl mx-auto font-sans space-y-6">
      
      {/* Tombol Kembali */}
      <Link href="/admin/audit" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 transition mb-2">
        <ArrowLeft size={18} /> Kembali ke Data Audit
      </Link>

      {/* Header Laporan */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm relative overflow-hidden">
        {/* Banner Status di Pojok */}
        <div className={`absolute top-0 right-0 px-6 py-2 text-xs font-bold rounded-bl-xl ${
            audit.status === 'CLOSED' ? 'bg-slate-200 text-slate-600' : 
            isSafe ? 'bg-emerald-100 text-emerald-700' : 'bg-red-600 text-white'
        }`}>
            {audit.status === 'CLOSED' ? 'STATUS: SELESAI (CLOSED)' : 
             isSafe ? 'STATUS: AMAN (OPEN)' : 'STATUS: PERLU TINDAKAN (OPEN)'}
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">{cleanTitle}</h1>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <Calendar size={16} />
                {new Date(audit.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <MapPin size={16} />
                {audit.lokasi}
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                <User size={16} />
                Pelapor: {audit.auditor?.name || 'Pegawai'} ({audit.auditor?.role || '-'})
            </div>
        </div>

        <hr className="my-6 border-slate-100" />

        {/* Isi Laporan */}
        <div>
            <h3 className="font-bold text-slate-700 mb-2">Deskripsi & Catatan:</h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {audit.deskripsi}
            </p>
        </div>

        {/* Bagian Tindakan / Action Button */}
        <div className="mt-8 flex gap-4 pt-6 border-t border-slate-100">
            
            {/* Tombol MARK DONE (Hanya kalau status OPEN dan ada masalah) */}
            {audit.status === 'OPEN' && !isSafe && (
                <form action={markAsDone.bind(null, id)} className="flex-1">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 transition shadow-lg shadow-green-200">
                        <CheckSquare size={20} /> Tandai Selesai Diperbaiki
                    </button>
                </form>
            )}

             {/* Tombol HAPUS (Danger Zone) */}
             <form action={deleteReport.bind(null, id)}>
                <button className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition">
                    <Trash2 size={20} /> Hapus Laporan
                </button>
            </form>

        </div>
      </div>
    </div>
  )
}