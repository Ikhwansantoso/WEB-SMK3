'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function createIbpr(formData: FormData) {
    try {
        const lokasi = formData.get('lokasi') as string
        const aktivitas = formData.get('aktivitas') as string
        const bahaya = formData.get('bahaya') as string
        const peluang = formData.get('peluang') as string
        const penanganan = formData.get('penanganan') as string

        const foto = formData.get('foto') as File
        const dokumen = formData.get('dokumen') as File

        let fotoUrl = null
        let dokumenUrl = null
        const uploadDir = join(process.cwd(), 'public/uploads')

        // Ensure upload directory exists - do this once
        await mkdir(uploadDir, { recursive: true })

        if (foto && foto.size > 0) {
            const bytes = await foto.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const fileName = `ibpr-foto-${Date.now()}-${foto.name.replace(/\s/g, '_')}`
            await writeFile(join(uploadDir, fileName), buffer)
            fotoUrl = `/uploads/${fileName}`
        }

        if (dokumen && dokumen.size > 0) {
            const bytes = await dokumen.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const fileName = `ibpr-doc-${Date.now()}-${dokumen.name.replace(/\s/g, '_')}`
            await writeFile(join(uploadDir, fileName), buffer)
            dokumenUrl = `/uploads/${fileName}`
        }

        await prisma.ibpr.create({
            data: {
                lokasi,
                aktivitas,
                bahaya,
                peluang, // Risk/Impact
                penanganan, // Control
                fotoRuangan: fotoUrl,
                dokumenIbpr: dokumenUrl
            }
        })

        revalidatePath('/admin/ibpr')
        return { success: true, message: "Data IBPR berhasil ditambahkan" }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Gagal menambahkan data" }
    }
}

export async function updateIbpr(id: string, formData: FormData) {
    try {
        const lokasi = formData.get('lokasi') as string
        const aktivitas = formData.get('aktivitas') as string
        const bahaya = formData.get('bahaya') as string
        const peluang = formData.get('peluang') as string
        const penanganan = formData.get('penanganan') as string

        const foto = formData.get('foto') as File
        const dokumen = formData.get('dokumen') as File

        const updateData: any = {
            lokasi,
            aktivitas,
            bahaya,
            peluang,
            penanganan
        }

        const uploadDir = join(process.cwd(), 'public/uploads')
        await mkdir(uploadDir, { recursive: true })

        if (foto && foto.size > 0) {
            const bytes = await foto.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const fileName = `ibpr-foto-${Date.now()}-${foto.name.replace(/\s/g, '_')}`
            await writeFile(join(uploadDir, fileName), buffer)
            updateData.fotoRuangan = `/uploads/${fileName}`
        }

        if (dokumen && dokumen.size > 0) {
            const bytes = await dokumen.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const fileName = `ibpr-doc-${Date.now()}-${dokumen.name.replace(/\s/g, '_')}`
            await writeFile(join(uploadDir, fileName), buffer)
            updateData.dokumenIbpr = `/uploads/${fileName}`
        }

        await prisma.ibpr.update({
            where: { id },
            data: updateData
        })

        revalidatePath('/admin/ibpr')
        return { success: true, message: "Data IBPR berhasil diperbarui" }
    } catch (error) {
        console.error(error)
        return { success: false, message: "Gagal memperbarui data" }
    }
}

export async function deleteIbpr(id: string) {
    try {
        await prisma.ibpr.delete({
            where: { id }
        })
        revalidatePath('/admin/ibpr')
        return { success: true, message: "Data IBPR berhasil dihapus" }
    } catch (error) {
        return { success: false, message: "Gagal menghapus data" }
    }
}
