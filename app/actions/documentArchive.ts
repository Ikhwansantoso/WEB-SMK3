'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"

export async function createDocumentArchive(formData: FormData) {
  try {
    const documentNumber = formData.get('documentNumber') as string
    const title = formData.get('title') as string
    const documentType = formData.get('documentType') as string
    const documentDateStr = formData.get('documentDate') as string
    const division = (formData.get('division') as string) || "General Support"
    const digitalStatus = formData.get('digitalStatus') as string
    const file = formData.get('file') as File | null

    if (!title || !documentType || !documentDateStr || !digitalStatus) {
      return { success: false, message: "Judul, jenis, tanggal, dan status digitalisasi wajib diisi!" }
    }

    let filePath = null

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const fileName = `DOC_${Date.now()}_${file.name.replace(/\s/g, '_')}`
      const uploadDir = join(process.cwd(), 'public/uploads/archive')

      // Pastikan direktori ada
      await mkdir(uploadDir, { recursive: true })

      await writeFile(join(uploadDir, fileName), buffer)
      filePath = `/uploads/archive/${fileName}`
    }

    await prisma.documentArchive.create({
      data: {
        documentNumber: documentNumber || null,
        title,
        documentType,
        documentDate: new Date(documentDateStr),
        division,
        digitalStatus,
        filePath,
      }
    })

    revalidatePath('/admin/archive')
    revalidatePath('/pegawai/archive')
    revalidatePath('/admin/dashboard')
    
    return { success: true, message: "Dokumen berhasil disimpan!" }
  } catch (error) {
    console.error("Gagal menyimpan dokumen:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan di server"
    }
  }
}

export async function updateDocumentArchive(id: string, formData: FormData) {
  try {
    const documentNumber = formData.get('documentNumber') as string
    const title = formData.get('title') as string
    const documentType = formData.get('documentType') as string
    const documentDateStr = formData.get('documentDate') as string
    const division = (formData.get('division') as string) || "General Support"
    const digitalStatus = formData.get('digitalStatus') as string
    const file = formData.get('file') as File | null

    if (!title || !documentType || !documentDateStr || !digitalStatus) {
      return { success: false, message: "Judul, jenis, tanggal, dan status digitalisasi wajib diisi!" }
    }

    const existingDoc = await prisma.documentArchive.findUnique({
      where: { id }
    })

    if (!existingDoc) {
      return { success: false, message: "Dokumen tidak ditemukan!" }
    }

    const updateData: any = {
      documentNumber: documentNumber || null,
      title,
      documentType,
      documentDate: new Date(documentDateStr),
      division,
      digitalStatus,
    }

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      const fileName = `DOC_${Date.now()}_${file.name.replace(/\s/g, '_')}`
      const uploadDir = join(process.cwd(), 'public/uploads/archive')

      // Pastikan direktori ada
      await mkdir(uploadDir, { recursive: true })

      await writeFile(join(uploadDir, fileName), buffer)
      updateData.filePath = `/uploads/archive/${fileName}`

      // Hapus file fisik lama jika ada
      if (existingDoc.filePath) {
        try {
          const oldFilePath = join(process.cwd(), 'public', existingDoc.filePath)
          await unlink(oldFilePath)
        } catch (e) {
          console.log("File fisik lama tidak ditemukan/sudah terhapus:", e)
        }
      }
    }

    await prisma.documentArchive.update({
      where: { id },
      data: updateData
    })

    revalidatePath('/admin/archive')
    revalidatePath('/pegawai/archive')
    revalidatePath('/admin/dashboard')

    return { success: true, message: "Dokumen berhasil diperbarui!" }
  } catch (error) {
    console.error("Gagal memperbarui dokumen:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan di server"
    }
  }
}

export async function deleteDocumentArchive(id: string) {
  try {
    const doc = await prisma.documentArchive.findUnique({
      where: { id }
    })

    if (!doc) {
      return { success: false, message: "Dokumen tidak ditemukan!" }
    }

    // Hapus file fisik jika ada
    if (doc.filePath) {
      try {
        const filePath = join(process.cwd(), 'public', doc.filePath)
        await unlink(filePath)
      } catch (e) {
        console.log("File fisik tidak ditemukan/sudah terhapus:", e)
      }
    }

    await prisma.documentArchive.delete({
      where: { id }
    })

    revalidatePath('/admin/archive')
    revalidatePath('/pegawai/archive')
    revalidatePath('/admin/dashboard')

    return { success: true, message: "Dokumen berhasil dihapus!" }
  } catch (error) {
    console.error("Gagal menghapus dokumen:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan di server"
    }
  }
}
