'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"
import { Kondisi, StatusTemuan } from "@prisma/client"
import { cookies } from "next/headers"

// 1. FUNGSI BUAT LAPORAN (LOGIC BARU)
export async function createLaporanTemuan(formData: FormData) {
  try {
    const judul = formData.get('judul') as string
    const lokasi = formData.get('lokasi') as string
    const deskripsi = formData.get('deskripsi') as string
    const foto = formData.get('foto') as File
    const waktuTemuanString = formData.get('waktuTemuan') as string 
    const kondisiInput = formData.get('kondisi') as string 

    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value

    if (!judul || !lokasi) {
        return { success: false, message: "Judul dan Lokasi wajib diisi!" }
    }

    let fotoUrl = null
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${Date.now()}_${foto.name.replace(/\s/g, '_')}`
      await writeFile(join(process.cwd(), 'public/uploads', fileName), buffer)
      fotoUrl = `/uploads/${fileName}`
    }

    const waktuTemuan = waktuTemuanString ? new Date(waktuTemuanString) : new Date()
    
    // --- LOGIC BARU DI SINI ---
    const kondisiFinal = kondisiInput === "AMAN" ? Kondisi.AMAN : Kondisi.BUTUH_PERBAIKAN
    
    // Kalau AMAN -> Langsung CLOSED (Selesai). Kalau TIDAK -> OPEN (Perlu Tindakan)
    const statusOtomatis = kondisiFinal === Kondisi.AMAN ? StatusTemuan.CLOSED : StatusTemuan.OPEN

    await prisma.temuanAudit.create({
      data: {
        judul,
        lokasi,
        deskripsi,
        buktiFoto: fotoUrl,
        waktuTemuan: waktuTemuan,
        kondisi: kondisiFinal,
        status: statusOtomatis, // Pakai status otomatis tadi
        auditorId: userId,
      }
    })

    revalidatePath('/admin/audit')
    revalidatePath('/pegawai/audit')
    return { success: true, message: "Laporan berhasil disimpan" }

  } catch (error) {
    console.error("Server Error:", error)
    return { success: false, message: "Terjadi kesalahan di server" }
  }
}

// 2. FUNGSI UPDATE STATUS (Tetap sama)
export async function updateStatusAudit(id: string, statusBaru: StatusTemuan) {
    try {
        await prisma.temuanAudit.update({
            where: { id },
            data: { status: statusBaru }
        })
        revalidatePath('/admin/audit')
    } catch (error) {
        console.error("Gagal update status:", error)
    }
}

// 3. FUNGSI HAPUS LAPORAN (BARU) 🗑️
export async function deleteLaporan(id: string) {
    try {
        await prisma.temuanAudit.delete({
            where: { id }
        })
        revalidatePath('/admin/audit') // Refresh halaman admin biar laporan hilang
    } catch (error) {
        console.error("Gagal menghapus:", error)
    }
}