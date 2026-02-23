"use client"

import { CheckCircle } from "lucide-react"
import { markIncidentAsDone } from "@/app/actions/kecelakaan"
import toast from "react-hot-toast"

export default function MarkDoneButton({ id }: { id: string }) {
    const handleMarkDone = async () => {
        const markPromise = markIncidentAsDone(id)

        toast.promise(markPromise, {
            loading: 'Menyelesaikan insiden...',
            success: 'Insiden selesai ditangani',
            error: 'Gagal menyelesaikan insiden'
        })

        await markPromise
    }

    return (
        <button
            onClick={handleMarkDone}
            title="Tandai Selesai"
            className="p-2 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
        >
            <CheckCircle size={20} />
        </button>
    )
}
