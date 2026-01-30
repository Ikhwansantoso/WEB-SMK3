import { cookies } from "next/headers";
import SidebarContent from "./SidebarContent"; // Import komponen baru tadi

export default async function PegawaiSidebar() {
  // 1. Ambil Data di Server
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Pegawai";

  // 2. Kirim Data (String) ke Client Component
  // (String aman dikirim dari Server ke Client)
  return <SidebarContent userName={userName} />;
}