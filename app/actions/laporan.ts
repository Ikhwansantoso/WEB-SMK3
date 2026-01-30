'use server'

import { prisma } from '@/lib/prisma' 
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

// 1. AMBIL DATA MONITORING
export async function getMonitoringData(tahun: number) {
  // Ambil semua Witel beserta laporannya di tahun tertentu
  const data = await prisma.witel.findMany({
    include: {
      laporan: {
        where: { tahun: tahun }
      }
    },
    orderBy: { id: 'asc' }
  })
  return data
}

// 2. UPLOAD LAPORAN
export async function uploadLaporan(formData: FormData) {
  const file = formData.get('file') as File
  const witelId = Number(formData.get('witelId'))
  const bulanIndex = Number(formData.get('bulanIndex'))
  const tahun = Number(formData.get('tahun'))

  if (!file) return { success: false, message: 'File tidak ditemukan' }

  // Simpan File ke Folder Public (Server)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  // Buat nama file unik: TAHUN-BULAN-WITELID-NAMAASLI
  const uniqueName = `${tahun}-${bulanIndex}-${witelId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const path = join(process.cwd(), 'public/uploads', uniqueName)
  
  try {
    await writeFile(path, buffer)
    const fileUrl = `/uploads/${uniqueName}`

    // Simpan/Update Data ke PostgreSQL
    await prisma.laporan.upsert({
      where: {
        witelId_bulanIndex_tahun: {
          witelId,
          bulanIndex,
          tahun
        }
      },
      update: {
        fileName: file.name,
        fileUrl: fileUrl,
        status: 1, // Status 1 = Ada Laporan
        uploadedAt: new Date()
      },
      create: {
        witelId,
        bulanIndex,
        tahun,
        status: 1,
        fileName: file.name,
        fileUrl: fileUrl
      }
    })

    revalidatePath('/admin/monitoring') // Refresh otomatis halaman monitoring
    return { success: true }

  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, message: 'Gagal menyimpan ke database' }
  }
}

// 3. HAPUS LAPORAN
export async function deleteLaporan(laporanId: number, fileUrl: string) {
  try {
    // Hapus data di database
    await prisma.laporan.delete({
      where: { id: laporanId }
    })

    // Hapus file fisik di folder uploads (Opsional, biar hemat storage)
    const filePath = join(process.cwd(), 'public', fileUrl)
    try {
        await unlink(filePath) 
    } catch (e) {
        console.log("File fisik tidak ditemukan/sudah terhapus")
    }

    revalidatePath('/admin/monitoring')
    return { success: true }
  } catch (error) {
    return { success: false, message: 'Gagal menghapus' }
  }
}