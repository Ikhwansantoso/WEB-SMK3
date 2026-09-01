import { Suspense } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ToolsClient from "@/app/admin/document-tools/ToolsClient"

export default async function PegawaiDocumentToolsPage() {
  const cookieStore = await cookies()
  const userRole = cookieStore.get("user_role")?.value
  const userId = cookieStore.get("user_id")?.value

  if (!userId || userRole !== "PEGAWAI") {
    redirect("/login")
  }

  return (
    <div className="space-y-8 font-sans">
      <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-400">Memuat Document Tools...</div>}>
        <ToolsClient />
      </Suspense>
    </div>
  )
}
