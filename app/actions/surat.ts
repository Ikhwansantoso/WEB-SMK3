"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSurat(data: any) {
    try {
        const { nomor, perihal, type, ...rest } = data;

        // Validasi basic
        if (!nomor || !perihal) {
            return { success: false, error: "Nomor dan Perihal wajib diisi" };
        }

        const newSurat = await prisma.arsipSurat.create({
            data: {
                nomor,
                perihal,
                type: type || "UNDANGAN",
                data: data, // Simpan semua raw data JSON juga untuk kemudahan
            },
        });

        revalidatePath("/admin/arsip");
        return { success: true, data: newSurat };
    } catch (error: any) {
        console.error("Error saving surat:", error);
        return { success: false, error: error.message };
    }
}

export async function getSuratList() {
    try {
        const list = await prisma.arsipSurat.findMany({
            orderBy: { createdAt: "desc" },
        });

        // Format tanggal untuk frontend jika perlu, atau kirim raw
        return { success: true, data: list };
    } catch (error: any) {
        console.error("Error fetching surat:", error);
        return { success: false, data: [] };
    }
}

export async function deleteSurat(id: string) {
    try {
        await prisma.arsipSurat.delete({
            where: { id },
        });
        revalidatePath("/admin/arsip");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getSuratById(id: string) {
    try {
        const surat = await prisma.arsipSurat.findUnique({
            where: { id },
        });
        if (!surat) return { success: false, error: "Surat tidak ditemukan" };
        return { success: true, data: surat };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
