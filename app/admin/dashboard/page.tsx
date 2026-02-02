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
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* Header Dashboard */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Executive</h1>
        <p className="text-slate-500 mt-2">Monitoring K3 & Repository Dokumen Telkom Regional 3</p>
      </div>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1: Total Temuan Audit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Temuan</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{totalAudit}</h3>
            <div className="mt-2 text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-lg inline-block">
              {totalAuditOpen} Masih Open
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={24} />
          </div>
        </div>

        {/* Card 4: Total SDM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total SDM</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{totalUser}</h3>
            <p className="text-xs text-slate-400 mt-1">User terdaftar</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users size={24} />
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