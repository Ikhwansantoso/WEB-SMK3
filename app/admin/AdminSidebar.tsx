// app/admin/AdminSidebar.tsx

import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  FileText,
  FolderOpen, // Ganti AlertTriangle jadi FolderOpen
  Users,
  Ambulance,
  Printer,
  Archive,
  Activity,
} from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminSidebar() {
  async function logout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("user_role");
    cookieStore.delete("user_id");
    redirect("/login");
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50 font-sans shadow-xl">
      {/* --- HEADER SIDEBAR (MERAH + LOGO BESAR DI KIRI) --- */}
      <div className="h-20 bg-gradient-to-r from-red-900 to-red-700 flex items-center justify-start px-6 relative shadow-md z-20">
        <img
          src="/Telkom-logo-full.png"
          alt="Telkom Indonesia"
          className="h-14 w-auto object-contain filter drop-shadow-sm"
        />
      </div>

      {/* --- MENU NAVIGASI --- */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-3">
          Main Menu
        </div>

        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <LayoutDashboard
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Dashboard</span>
        </Link>

        {/* --- MENU BARU: DOKUMEN IPBR (MENGGANTIKAN RISIKO) ---
        <Link
          href="/admin/ipbr"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <FolderOpen
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Dokumen IPBR</span>
        </Link> */}

        <Link
          href="/admin/monitoring"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <Activity
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Monitoring Jam Kerja</span>
        </Link>

        <Link
          href="/admin/audit"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <FileText
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Data Audit</span>
        </Link>

        <Link
          href="/admin/kecelakaan"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <Ambulance
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Laporan Insiden</span>
        </Link>

        <div className="my-4 border-t border-slate-100"></div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-3">
          Administrator
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <Users
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Data Pengguna</span>
        </Link>

        {/* ADMINISTRASI SURAT (EDITOR) */}
        <Link
          href="/admin/surat"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all group font-medium"
        >
          <Printer
            size={20}
            className="group-hover:text-red-600 text-slate-400 transition-colors"
          />
          <span>Buat Surat</span>
        </Link>

        {/* ARSIP SURAT (VIEWER) */}
        <Link
          href="/admin/arsip"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group font-medium"
        >
          <Archive
            size={20}
            className="group-hover:text-blue-600 text-slate-400 transition-colors"
          />
          <span>Arsip Surat</span>
        </Link>
      </nav>

      {/* --- FOOTER SIDEBAR --- */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <form action={logout}>
          <button className="w-full bg-white border border-slate-200 text-slate-600 p-3 rounded-xl flex justify-center items-center gap-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm font-bold text-sm group">
            <LogOut
              size={18}
              className="group-hover:text-white text-slate-400 transition"
            />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}