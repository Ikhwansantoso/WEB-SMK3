'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function createLaporanKecelakaan(formData: FormData) {
  try {
    const judul = formData.get('judul') as string
    const lokasi = formData.get('lokasi') as string
    const kronologi = formData.get('kronologi') as string
    const korban = formData.get('korban') as string
    const waktuString = formData.get('waktuKejadian') as string
    const foto = formData.get('foto') as File

    if (!judul || !waktuString) {
      return { success: false, message: "Data wajib diisi!" }
    }

    let fotoUrl = null
    if (foto && foto.size > 0) {
      const bytes = await foto.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `KECELAKAAN_${Date.now()}_${foto.name.replace(/\s/g, '_')}`

      const uploadDir = join(process.cwd(), 'public/uploads')
      await mkdir(uploadDir, { recursive: true })

      await writeFile(join(uploadDir, fileName), buffer)
      fotoUrl = `/uploads/${fileName}`
    }

    await prisma.laporanKecelakaan.create({
      data: {
        judul,
        lokasi,
        kronologi,
        korban,
        fotoBukti: fotoUrl,
        waktuKejadian: new Date(waktuString),
      }
    })

    revalidatePath('/pegawai/kecelakaan')
    return { success: true, message: "Laporan insiden berhasil dikirim" }

  } catch (error) {
    console.error("Gagal lapor insiden:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Gagal di server"
    }
  }
}