'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// 1. FUNGSI BUAT FOLDER BARU
export async function createDivisi(formData: FormData) {
  const nama = formData.get('nama') as string

  if (!nama || nama.trim() === "") {
    throw new Error("Nama divisi tidak boleh kosong")
  }

  // Simpan ke database
  await prisma.divisi.create({
    data: {
      nama: nama.toUpperCase(), // Kita paksa huruf besar biar rapi
    }
  })

  // Refresh halaman IPBR supaya folder baru langsung muncul
  revalidatePath('/admin/ipbr')
}

// 2. FUNGSI HAPUS FOLDER (DAN ISINYA)
export async function deleteDivisi(id: string) {
  // PENTING: Hapus dulu semua dokumen di dalam folder ini
  // Kalau tidak dihapus dulu, database akan error (Foreign Key Constraint)
  await prisma.dokumen.deleteMany({
    where: { divisiId: id }
  })

  // Setelah bersih, baru hapus Foldernya
  await prisma.divisi.delete({
    where: { id }
  })

  // Refresh halaman
  revalidatePath('/admin/ipbr')
}