import { prisma } from "@/lib/prisma"
import IbprClientPage from "./client-page"

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
        <div className="space-y-8 font-sans">
            <IbprClientPage groupedData={groupedData} />
        </div>
    )
}
