"use client"

import { Trash2 } from "lucide-react"
import { deleteUserAction } from "@/app/actions/user"
import toast from "react-hot-toast"

export default function DeleteUserButton({ id, name }: { id: string, name: string }) {
    const handleDelete = async () => {
        if (!window.confirm(`Yakin ingin menghapus pengguna "${name}" secara permanen?`)) return;

        const deletePromise = deleteUserAction(id)

        toast.promise(deletePromise, {
            loading: 'Menghapus pengguna...',
            success: (data) => data.success ? data.message : 'Ditolak: ' + data.message,
            error: 'Gagal menghapus pengguna'
        })

        const res = await deletePromise;
        if (!res.success) {
            toast.error(res.message, { id: 'delete-error' }); // Override success if it was actually false but resolved
        }
    }

    return (
        <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-full transition-all group relative"
            title="Hapus User"
        >
            <div className="absolute inset-0 rounded-full group-hover:bg-red-100 transition-colors pointer-events-none opacity-50 z-0 scale-50 group-hover:scale-100"></div>
            <Trash2 size={18} className="relative z-10" />
        </button>
    )
}
