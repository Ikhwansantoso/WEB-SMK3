'use server'

import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// 1. FUNGSI UPLOAD (Sama seperti sebelumnya)
export async function uploadDokumen(formData: FormData) {
  const file = formData.get('file') as File
  const judul = formData.get('judul') as string
  const nomorDokumen = formData.get('nomorDokumen') as string
  const divisiId = formData.get('divisiId') as string

  if (!file || file.size === 0) {
    throw new Error('File tidak boleh kosong')
  }

  const timestamp = Date.now()
  const cleanName = file.name.replace(/\s+/g, '_')
  const fileName = `${timestamp}_${cleanName}`
  const path = join(process.cwd(), 'public/dokumen', fileName)

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(path, buffer)

  await prisma.dokumen.create({
    data: {
      judul,
      nomorDokumen,
      divisiId,
      fileUrl: `/dokumen/${fileName}`,
    },
  })

  revalidatePath(`/admin/ipbr/${divisiId}`)
}

// 2. FUNGSI HAPUS (BARU)
export async function deleteDokumen(id: string, fileUrl: string | null) {
  // A. Hapus dari Database
  const doc = await prisma.dokumen.delete({
    where: { id },
  })

  // B. Hapus File Fisik di folder public (jika ada)
  if (fileUrl) {
    try {
        // fileUrl contoh: "/dokumen/namafile.pdf" -> kita buang tanda "/" di depan
        const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl
        const absolutePath = join(process.cwd(), 'public', relativePath)
        
        await unlink(absolutePath)
    } catch (error) {
        console.log("File fisik tidak ditemukan atau gagal dihapus, tapi data DB sudah bersih.")
    }
  }

  revalidatePath(`/admin/ipbr/${doc.divisiId}`)
}