'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteUserAction(id: string) {
    try {
        // Mencegah penghapusan user terakhir (biar gak kekunci)
        const totalUsers = await prisma.user.count()
        if (totalUsers <= 1) {
            return { success: false, message: "Aksi ditolak. Minimal harus ada 1 pengguna di sistem." }
        }

        await prisma.user.delete({ where: { id } })
        revalidatePath('/admin/users')
        return { success: true, message: "Pengguna berhasil dihapus" }
    } catch (error) {
        console.error("Gagal hapus pengguna:", error)
        return { success: false, message: "Gagal menghapus pengguna" }
    }
}
