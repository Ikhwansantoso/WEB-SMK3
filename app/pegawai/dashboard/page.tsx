import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderOpen, AlertTriangle, Ambulance, LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PegawaiDashboard() {
  const totalDokumen = await prisma.dokumen.count();

  // 1. Ambil Nama User dari Cookies
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value || "Rekan Telkom";

  // 2. Fungsi Logout (Server Action)
  async function logout() {
    "use server";
    const c = await cookies();
    c.delete("user_role");
    c.delete("user_id");
    c.delete("user_name");
    redirect("/login");
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50">
      
      {/* --- TOP BAR: TOMBOL LOGOUT ---
      <div className="flex justify-end mb-6">
        <form action={logout}>
            <button className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-full border border-red-100 shadow-sm hover:bg-red-50 hover:border-red-200 transition-all font-bold text-sm">
                <LogOut size={16} />
                Keluar Aplikasi
            </button>
        </form>
      </div> */}

      {/* --- HEADER WELCOME --- */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 rounded-3xl p-8 text-white shadow-xl shadow-red-100 mb-10 relative overflow-hidden border border-red-600">
         
         {/* Hiasan Background */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

         <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">
                Halo, {userName}! 👋
            </h1>
            <p className="text-red-100 font-medium text-lg opacity-90">
                Selamat bekerja. Jangan lupa K3 adalah prioritas utama.
            </p>
         </div>
      </div>

      {/* --- MENU GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Repository */}
        <Link href="/pegawai/ipbr" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition group relative overflow-hidden">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                <FolderOpen size={28}/>
            </div>
            <h4 className="font-bold text-xl text-slate-800 group-hover:text-blue-700 transition-colors">
                Repository K3
            </h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">{totalDokumen} Dokumen Tersedia</p>
            
            <div className="absolute right-[-20px] bottom-[-20px] opacity-0 group-hover:opacity-10 transition-opacity">
                <FolderOpen size={100} />
            </div>
        </Link>

        {/* Card 2: Lapor Temuan */}
        <Link href="/pegawai/audit" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition group relative overflow-hidden">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors shadow-sm">
                <AlertTriangle size={28}/>
            </div>
            <h4 className="font-bold text-xl text-slate-800 group-hover:text-orange-700 transition-colors">
                Lapor Temuan
            </h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">Laporkan kondisi bahaya</p>

             <div className="absolute right-[-20px] bottom-[-20px] opacity-0 group-hover:opacity-10 transition-opacity">
                <AlertTriangle size={100} />
            </div>
        </Link>
        
        {/* Card 3: Lapor Insiden */}
        <Link href="/pegawai/kecelakaan" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-red-200 transition group relative overflow-hidden">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors shadow-sm">
                <Ambulance size={28}/>
            </div>
            <h4 className="font-bold text-xl text-slate-800 group-hover:text-red-700 transition-colors">
                Lapor Insiden
            </h4>
            <p className="text-sm text-slate-500 mt-2 font-medium">Formulir kecelakaan kerja</p>

             <div className="absolute right-[-20px] bottom-[-20px] opacity-0 group-hover:opacity-10 transition-opacity">
                <Ambulance size={100} />
            </div>
        </Link>
      </div>
    </div>
  );
}