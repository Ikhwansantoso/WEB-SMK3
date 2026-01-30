import type { Metadata } from "next";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader"; // <--- Import Header Baru

export const metadata: Metadata = {
  title: "Admin Dashboard - SMK3 Telkom",
  description: "Panel Admin Sistem Manajemen K3",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* SIDEBAR (Tetap di Kiri) */}
      <AdminSidebar />

      {/* KONTEN UTAMA (Di Kanan) */}
      <div className="flex-1 ml-64 flex flex-col">
        
        {/* HEADER (Di Paling Atas) */}
        <AdminHeader />

        {/* ISI HALAMAN (Dashboard, Audit, dll) */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
        
      </div>

    </div>
  );
}