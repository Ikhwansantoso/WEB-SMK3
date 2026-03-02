import { prisma } from "@/lib/prisma";
import {
  Users,
  AlertTriangle,
  FileText,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import IncidentChart from "./IncidentChart";
import Link from "next/link";

export default async function AdminDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // 1. Ambil Data Statistik Secara Paralel
  const [
    totalUser,
    totalAudit,
    totalAuditOpen,
    totalInsiden,
    totalInsidenOpen,
    insidenBulanIni,
    totalIbpr,
    insidenTahunan,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.temuanAudit.count(),
    prisma.temuanAudit.count({ where: { status: "OPEN" } }),
    prisma.laporanKecelakaan.count(),
    prisma.laporanKecelakaan.count({ where: { status: { not: "CLOSED" } } }),
    // Insiden bulan ini
    prisma.laporanKecelakaan.count({
      where: {
        waktuKejadian: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    }),
    prisma.ibpr.count(),
    // Data Insiden per bulan tahun ini
    prisma.laporanKecelakaan.findMany({
      where: {
        waktuKejadian: {
          gte: new Date(currentYear, 0, 1),
          lt: new Date(currentYear + 1, 0, 1),
        },
      },
      select: {
        waktuKejadian: true,
      },
    }),
  ]);

  // 2. Olah Data untuk Grafik Bulanan
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
  ];

  const chartData = monthNames.map((name, index) => {
    const total = insidenTahunan.filter(
      (insiden) => insiden.waktuKejadian.getMonth() === index
    ).length;
    return { name, total }; // Format data untuk Recharts
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/50 min-h-screen">

      {/* Header Dashboard */}
      <div className="relative mb-8 p-10 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Ornamen Dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-20 -mt-32 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full -ml-10 -mb-20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight">
              Dashboard Executive <span className="text-red-600">.</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium max-w-xl">
              Pusat Monitoring K3 & Repository Dokumen Telkom Regional 3. Amati ringkasan kinerja terkini dengan cepat.
            </p>
          </div>
        </div>
      </div>

      {/* Grid Statistik Utama (4 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">

        {/* Card 1: Insiden K3 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Insiden K3</p>
                <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalInsiden}</h3>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-2xl shadow-sm drop-shadow-sm">
                <AlertTriangle size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-red-600 bg-red-50/80 px-3 py-1.5 rounded-xl border border-red-100 shadow-sm">
                • {totalInsidenOpen} Belum Selesai
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-1">
                <TrendingUp size={12} className="text-red-500" />
                {insidenBulanIni} Bulan ini
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Temuan Audit */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Temuan Audit</p>
                <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalAudit}</h3>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm border border-blue-100 text-blue-600 rounded-2xl shadow-sm drop-shadow-sm">
                <FileText size={24} strokeWidth={2.5} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-amber-600 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm">
                • {totalAuditOpen} Masih Open
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Dokumen IBPR */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Dokumen IBPR</p>
                <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalIbpr}</h3>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-600 rounded-2xl shadow-sm drop-shadow-sm">
                <ShieldCheck size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                Penilaian Risiko Terdaftar
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Total SDM */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div className="flex justify-between items-start w-full">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100">Total SDM</p>
                <h3 className="text-5xl font-black text-slate-800 mt-4 tracking-tighter">{totalUser}</h3>
              </div>
              <div className="p-3 bg-white/80 backdrop-blur-sm border border-emerald-100 text-emerald-600 rounded-2xl shadow-sm drop-shadow-sm">
                <Users size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                Pengguna Sistem Aktif
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Area Grafik & Analitik Tertaut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Tren Laporan Insiden K3
              </h3>
              <p className="text-slate-500 text-sm mt-1">Akumulasi insiden dilaporkan per bulan sepanjang tahun {currentYear}</p>
            </div>
            <Link
              href="/admin/kecelakaan"
              className="hidden md:inline-flex text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl border border-red-100 transition-colors"
              prefetch={false}
            >
              Lihat Detail Laporan &rarr;
            </Link>
          </div>

          {/* Wrapper untuk Recharts agar responsif */}
          <div className="flex-grow w-full h-[300px] relative z-10 -ml-4">
            <IncidentChart data={chartData} />
          </div>
        </div>

        {/* Side Panel Promosi / Info Tambahan (Opsional, Pemanis UI) */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-lg border border-slate-700 p-8 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 mb-8">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-6">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Pantau Risiko. Cegah Insiden.</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gunakan modul IBPR untuk memetakan potensi bahaya di lingkungan Telkom Regional 3 dan tindaklanjuti laporan Open Audit segera sebelum beresiko menjadi insiden fatal.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-3 mt-auto">
            <Link href="/admin/ibpr" className="w-full bg-white text-slate-900 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors shadow-sm">
              Manajemen IBPR
            </Link>
            <Link href="/admin/audit" className="w-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 font-bold py-3 px-4 rounded-xl text-center text-sm transition-colors">
              Tindaklanjut Temuan
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}