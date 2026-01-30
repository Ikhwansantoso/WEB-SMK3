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
    totalDokumen, // Pengganti itemIBPR
    totalDivisi   // Pengganti levelExtreme
  ] = await Promise.all([
    prisma.user.count(),
    prisma.temuanAudit.count(),
    prisma.temuanAudit.count({ where: { status: "OPEN" } }),
    
    // PERBAIKAN: Hitung Dokumen PDF, bukan itemIBPR
    prisma.dokumen.count(),

    // PERBAIKAN: Hitung Divisi yang terdaftar
    prisma.divisi.count(),
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

        {/* Card 2: Dokumen IPBR (BARU) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dokumen IPBR</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{totalDokumen}</h3>
            <p className="text-xs text-slate-400 mt-1">File PDF Tersimpan</p>
          </div>
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <BookOpen size={24} />
          </div>
        </div>

        {/* Card 3: Total Divisi (BARU) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Divisi / Unit</p>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{totalDivisi}</h3>
            <p className="text-xs text-slate-400 mt-1">Unit Kerja Terdaftar</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FolderOpen size={24} />
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
        
        {/* Shortcut ke Repository IPBR */}
        <Link href="/admin/ipbr" className="group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg shadow-blue-200 hover:shadow-xl transition-all relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Repository Dokumen IPBR</h3>
                    <p className="text-blue-100 mb-6 max-w-sm">Akses cepat ke dokumen Identifikasi Bahaya & Penilaian Risiko (PDF) per divisi.</p>
                    <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold group-hover:bg-white group-hover:text-blue-700 transition-colors">
                        Buka Repository &rarr;
                    </span>
                </div>
                <FolderOpen className="absolute -right-6 -bottom-6 text-white/10 rotate-12" size={180} />
            </div>
        </Link>
      </div>

    </div>
  );
}