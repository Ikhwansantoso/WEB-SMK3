'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function createLaporanKecelakaan(formData: FormData) {
  const judul = formData.get('judul') as string
  const lokasi = formData.get('lokasi') as string
  const kronologi = formData.get('kronologi') as string
  const korban = formData.get('korban') as string
  const waktuString = formData.get('waktuKejadian') as string
  const foto = formData.get('foto') as File

  if (!judul || !waktuString) throw new Error("Data wajib diisi!")

  let fotoUrl = null
  if (foto && foto.size > 0) {
    const bytes = await foto.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileName = `KECELAKAAN_${Date.now()}_${foto.name.replace(/\s/g, '_')}`
    await writeFile(join(process.cwd(), 'public/uploads', fileName), buffer)
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
}