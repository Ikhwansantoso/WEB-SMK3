import { prisma } from "@/lib/prisma";
import {
    Clock,
    AlertOctagon,
    ShieldCheck,
    MapPin,
    User,
    ExternalLink,
    Inbox,
    SearchX
} from "lucide-react";
import TombolAksi from "./TombolAksi";
import AuditFilter from "./AuditFilter"; // <--- Import Filter Baru

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(date);
}

interface SearchParams {
    q?: string;
    status?: string;
    kondisi?: string;
}

export default async function AdminAuditPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const unresolvedParams = await searchParams;
    const q = typeof unresolvedParams.q === 'string' ? unresolvedParams.q : '';
    const statusFilter = typeof unresolvedParams.status === 'string' ? unresolvedParams.status : 'ALL';
    const kondisiFilter = typeof unresolvedParams.kondisi === 'string' ? unresolvedParams.kondisi : 'ALL';

    // Menyusun kondisi pencarian berdasar param URL
    let whereCondition: any = {};

    if (statusFilter !== 'ALL') {
        whereCondition.status = statusFilter;
    }

    if (kondisiFilter !== 'ALL') {
        whereCondition.kondisi = kondisiFilter;
    }

    if (q) {
        whereCondition.OR = [
            { judul: { contains: q, mode: 'insensitive' } },
            { deskripsi: { contains: q, mode: 'insensitive' } },
            { lokasi: { contains: q, mode: 'insensitive' } },
            {
                auditor: {
                    name: { contains: q, mode: 'insensitive' }
                }
            }
        ];
    }

    const audits = await prisma.temuanAudit.findMany({
        where: whereCondition,
        orderBy: { createdAt: "desc" },
        include: { auditor: true },
    });

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Laporan Audit Masuk</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitoring temuan K3 dari pegawai lapangan.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm text-sm font-bold text-slate-600 dark:text-slate-300">
                    Total: {audits.length} Laporan
                </div>
            </div>

            {/* FILTER & PENCARIAN AUDIO */}
            <AuditFilter />

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                {audits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center h-full min-h-[400px] animate-in fade-in duration-500">
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-full mb-4 ring-8 ring-slate-50/50 dark:ring-slate-800/50">
                            {q || statusFilter !== 'ALL' || kondisiFilter !== 'ALL' ? (
                                <SearchX size={48} className="text-slate-300 dark:text-slate-600" />
                            ) : (
                                <Inbox size={48} className="text-slate-300 dark:text-slate-600" />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {q || statusFilter !== 'ALL' || kondisiFilter !== 'ALL'
                                ? "Hasil pencarian tidak ditemukan"
                                : "Belum Ada Temuan Audit"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                            {q || statusFilter !== 'ALL' || kondisiFilter !== 'ALL'
                                ? "Coba sesuaikan kata kunci atau ubah pengaturan filter dropdown."
                                : "Laporan temuan inspeksi dari lapangan akan muncul di sini. Saat ini semua area terpantau aman."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                            <thead className="text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                                <tr>
                                    <th className="px-6 py-3 font-extrabold pb-4">Waktu & Pelapor</th>
                                    <th className="px-6 py-3 font-extrabold pb-4">Temuan</th>
                                    <th className="px-6 py-3 font-extrabold pb-4 text-center">Kondisi</th>
                                    <th className="px-6 py-3 font-extrabold pb-4 text-center">Status</th>
                                    <th className="px-6 py-3 font-extrabold pb-4 text-center">Bukti</th>
                                    <th className="px-6 py-3 font-extrabold pb-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {audits.map((item) => (
                                    <tr key={item.id} className="group bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all rounded-xl shadow-sm hover:shadow-md outline outline-1 outline-slate-100 dark:outline-slate-700/60 hover:outline-red-100 dark:hover:outline-red-950">

                                        {/* KOLOM 1: Waktu & Pelapor */}
                                        <td className="px-6 py-4 align-top rounded-l-xl">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                                                    <Clock size={14} className="text-slate-400 dark:text-slate-500" />
                                                    {formatDate(item.waktuTemuan)}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                                                    <MapPin size={14} />
                                                    {item.lokasi}
                                                </div>
                                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded w-fit text-[10px] font-bold mt-1 border border-blue-100 dark:border-blue-900/50">
                                                    <User size={12} />
                                                    {item.auditor ? item.auditor.name : "Tanpa Nama"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <div className="font-bold text-slate-800 dark:text-slate-100 mb-1">{item.judul}</div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{item.deskripsi}</p>
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            {item.kondisi === "AMAN" ? (
                                                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200 dark:border-green-900/50">
                                                    <ShieldCheck size={14} /> AMAN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold border border-red-200 dark:border-red-900/50">
                                                    <AlertOctagon size={14} /> PERBAIKAN
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.status === 'OPEN' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50' :
                                                item.status === 'CLOSED' ? 'bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50' :
                                                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            {item.buktiFoto ? (
                                                <a href={item.buktiFoto} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold inline-flex items-center gap-1">
                                                    Lihat <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 dark:text-slate-600 text-xs">-</span>
                                            )}
                                        </td>

                                        {/* KOLOM 6: Tombol Aksi Baru */}
                                        <td className="px-6 py-4 align-top text-right rounded-r-xl">
                                            <TombolAksi id={item.id} statusSaatIni={item.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}