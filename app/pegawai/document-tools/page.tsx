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
    <div className="max-w-7xl mx-auto space-y-6">
      <ToolsClient />
    </div>
  )
}
