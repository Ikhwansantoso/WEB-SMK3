'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteLaporanKecelakaan } from '@/app/actions/kecelakaan'
import toast from 'react-hot-toast'

export default function DeleteButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        const confirm = window.confirm("Apakah Anda yakin ingin menghapus laporan insiden ini? Data tidak bisa dikembalikan.")
        if (!confirm) return

        setLoading(true)

        const deletePromise = deleteLaporanKecelakaan(id)

        toast.promise(deletePromise, {
            loading: "Menghapus laporan...",
            success: "Laporan berhasil dihapus",
            error: "Gagal menghapus data",
        })

        try {
            await deletePromise
            // Router refresh otomatis via revalidatePath di server action
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Hapus Laporan"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    )
}
