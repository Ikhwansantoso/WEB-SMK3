import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ArchiveClientPage from "./client-page"

export default async function Page() {
    const cookieStore = await cookies()
    const userRole = cookieStore.get("user_role")?.value
    const userId = cookieStore.get("user_id")?.value

    if (!userId || (userRole !== "ADMIN" && userRole !== "AUDITOR")) {
        redirect("/login")
    }

    const documents = await prisma.documentArchive.findMany({
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <ArchiveClientPage initialDocuments={documents} userRole={userRole} />
        </div>
    )
}
