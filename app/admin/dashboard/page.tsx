import { prisma } from "@/lib/prisma";
import {
  Users,
  FileText,
  BookOpen, // Ganti icon Activity/Alert jadi BookOpen
  FolderOpen
} from "lucide-react";
import Link from "next/link";


export default async function AdminDashboard() {
  // 1. Ambil Data Statistik Secara Paralel
  const [
    totalUser,
    totalAudit,
    totalAuditOpen,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.temuanAudit.count(),
    prisma.temuanAudit.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* Header Dashboard */}
      <div className="relative mb-8 p-10 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Ornamen Dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-20 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full -ml-10 -mb-20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
            Dashboard Executive <span className="text-red-600">.</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium max-w-xl">
            Pusat Monitoring K3 & Repository Dokumen Telkom Regional 3. Amati ringkasan kinerja terkini dengan cepat.
          </p>
        </div>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

        {/* Card 1: Total Temuan Audit */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Temuan Audit</p>
              <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalAudit}</h3>
            </div>
            <div className="mt-4 text-xs font-bold text-red-600 bg-red-50/80 px-3 py-1.5 rounded-xl border border-red-100 inline-block max-w-fit shadow-sm">
              • {totalAuditOpen} Masih Open
            </div>
          </div>
          <div className="relative z-10 p-4 bg-white/50 backdrop-blur-sm border border-blue-100 text-blue-600 rounded-2xl shadow-sm drop-shadow-sm mt-1">
            <FileText size={24} strokeWidth={2.5} />
          </div>
        </div>

        {/* Card 2: Total SDM */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Total SDM</p>
              <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalUser}</h3>
            </div>
            <div className="mt-4 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 inline-block max-w-fit shadow-sm">
              User terdaftar
            </div>
          </div>
          <div className="relative z-10 p-4 bg-white/50 backdrop-blur-sm border border-emerald-100 text-emerald-600 rounded-2xl shadow-sm drop-shadow-sm mt-1">
            <Users size={24} strokeWidth={2.5} />
          </div>
        </div>

      </div>

      {/* Area Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shortcut removed */}
      </div>

    </div>
  );
}