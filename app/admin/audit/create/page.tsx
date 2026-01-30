import { PrismaClient, KategoriTemuan } from '@prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle, AlertTriangle, Calendar, FileText } from 'lucide-react'
import { StatusTemuan } from "@prisma/client"

const prisma = new PrismaClient()

export default function CreateInspectionPage() {

  async function createReport(formData: FormData) {
    'use server'

    const kegiatan = formData.get('kegiatan') as string
    const periode = formData.get('periode') as string
    const lokasi = formData.get('lokasi') as string
    const kondisi = formData.get('kondisi') as string
    const catatan = formData.get('catatan') as string
    
    let kategoriDb: KategoriTemuan = 'MINOR'
    let statusDb = 'OPEN'
    let judulFinal = ''

    if (kondisi === 'AMAN') {
        statusDb = 'CLOSED'
        kategoriDb = 'MINOR'
        judulFinal = `[AMAN] ${kegiatan} - ${periode}`
    } else {
        statusDb = 'OPEN'
        kategoriDb = 'MAYOR'
        judulFinal = `[TEMUAN] ${kegiatan} - ${periode}`
    }

    const deskripsiFinal = catatan ? catatan : `Kondisi ${kegiatan} tercatat ${kondisi}`

    // Ambil user pertama sebagai auditor sementara
    const auditor = await prisma.user.findFirst()
    
    await prisma.temuanAudit.create({
      data: {
        judul: judulFinal,
        lokasi: lokasi,
        kategori: kategoriDb,
        deskripsi: deskripsiFinal,
        deadline: new Date(new Date().setDate(new Date().getDate() + 7)), 
        status: statusDb as StatusTemuan,
        auditorId: auditor!.id
      }
    })

    redirect('/admin/audit')
  }

  return (
    <div className="max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/audit" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Form Laporan Inspeksi</h1>
          <p className="text-slate-500 text-sm">Input data pengecekan rutin (Bulanan/Tahunan)</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form action={createReport} className="space-y-6">
          
          {/* 1. Kegiatan & Periode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText size={16} /> Apa yang dicek?
                </label>
                {/* PERBAIKAN: text-slate-900 (Hitam) & bg-white */}
                <input 
                    name="kegiatan" 
                    type="text" 
                    placeholder="Cth: APAR, Hydrant, Kabel Server" 
                    required 
                    className="w-full p-3 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm" 
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Calendar size={16} /> Periode / Waktu
                </label>
                {/* PERBAIKAN: text-slate-900 (Hitam) & bg-white */}
                <input 
                    name="periode" 
                    type="text" 
                    placeholder="Cth: Januari 2026 / Tahunan" 
                    required 
                    className="w-full p-3 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm" 
                />
            </div>
          </div>

          {/* 2. Lokasi */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Lokasi Pengecekan</label>
            {/* PERBAIKAN: text-slate-900 (Hitam) & bg-white */}
            <input 
                name="lokasi" 
                type="text" 
                placeholder="Cth: Gedung A Lt. 1" 
                required 
                className="w-full p-3 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm" 
            />
          </div>

          {/* 3. Hasil Pengecekan */}
          <div className="space-y-3 pt-2">
            <label className="text-sm font-semibold text-slate-700">Hasil Inspeksi:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Opsi Aman */}
                <label className="cursor-pointer group">
                    <input type="radio" name="kondisi" value="AMAN" className="peer sr-only" required />
                    <div className="p-4 border border-slate-200 rounded-xl peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-slate-50 transition flex items-center justify-center gap-3 text-center h-full group-hover:border-emerald-200">
                        <div className="text-emerald-600"><CheckCircle size={28} /></div>
                        <div className="text-left">
                            <span className="block font-bold text-slate-700 peer-checked:text-emerald-800">AMAN / LENGKAP</span>
                            <span className="text-xs text-slate-500">Tidak ada masalah ditemukan</span>
                        </div>
                    </div>
                </label>

                {/* Opsi Ada Temuan */}
                <label className="cursor-pointer group">
                    <input type="radio" name="kondisi" value="MASALAH" className="peer sr-only" />
                    <div className="p-4 border border-slate-200 rounded-xl peer-checked:border-red-500 peer-checked:bg-red-50 hover:bg-slate-50 transition flex items-center justify-center gap-3 text-center h-full group-hover:border-red-200">
                        <div className="text-red-600"><AlertTriangle size={28} /></div>
                        <div className="text-left">
                            <span className="block font-bold text-slate-700 peer-checked:text-red-800">ADA TEMUAN</span>
                            <span className="text-xs text-slate-500">Butuh perbaikan / penggantian</span>
                        </div>
                    </div>
                </label>

            </div>
          </div>

          {/* 4. Catatan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Catatan / Deskripsi</label>
            {/* PERBAIKAN: text-slate-900 (Hitam) & bg-white */}
            <textarea 
                name="catatan" 
                rows={3} 
                placeholder="Tuliskan detail kondisi di sini (Misal: Pin segel lepas, tekanan turun, dll)..." 
                className="w-full p-3 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition flex items-center gap-2">
                <Save size={18} /> Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}