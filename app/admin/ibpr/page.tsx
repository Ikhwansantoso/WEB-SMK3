import { prisma } from "@/lib/prisma"
import { deleteIbpr } from "@/app/actions/ibpr"
import { Plus, Trash2, Edit, AlertOctagon } from "lucide-react"
import IbprClientPage from "./client-page" // Separate client component for interactivity

// Server Component to fetch data
export default async function Page() {
    const data = await prisma.ibpr.findMany({
        orderBy: { lokasi: 'asc' }
    })

    // Group by Lokasi
    const groupedData: Record<string, typeof data> = {}
    data.forEach(item => {
        if (!groupedData[item.lokasi]) {
            groupedData[item.lokasi] = []
        }
        groupedData[item.lokasi].push(item)
    })

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <AlertOctagon className="text-blue-600" size={32} />
                        Identifikasi Bahaya & Risiko (IBPR)
                    </h1>
                    <p className="text-slate-500 mt-1">Manajemen data potensi bahaya dan pengendalian risiko K3.</p>
                </div>
            </div>

            <IbprClientPage groupedData={groupedData} />
        </div>
    )
}
