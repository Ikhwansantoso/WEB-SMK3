import { prisma } from "@/lib/prisma";
import {
    Clock,
    AlertOctagon,
    ShieldCheck,
    MapPin,
    User,
    ExternalLink,
    Inbox
} from "lucide-react";
import TombolAksi from "./TombolAksi"; // <--- Import Tombol Baru

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(date);
}

export default async function AdminAuditPage() {
    const audits = await prisma.temuanAudit.findMany({
        orderBy: { createdAt: "desc" },
        include: { auditor: true }, // Pastikan ini ada
    });

    return (
        <div className="p-6 md:p-10 min-h-screen bg-slate-50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Laporan Audit Masuk</h1>
                    <p className="text-slate-500 text-sm">Monitoring temuan K3 dari pegawai lapangan.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-bold text-slate-600">
                    Total: {audits.length} Laporan
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                {audits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center h-full min-h-[400px] animate-in fade-in duration-500">
                        <div className="bg-slate-50 p-6 rounded-full mb-4 ring-8 ring-slate-50/50">
                            <Inbox size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Temuan Audit</h3>
                        <p className="text-slate-500 text-sm max-w-sm">
                            Laporan temuan inspeksi dari lapangan akan muncul di sini. Saat ini semua area terpantau aman.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                            <thead className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                                <tr>
                                    {/* HAPUS KOMENTAR DI SINI */}
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
                                    <tr key={item.id} className="group bg-white hover:bg-slate-50 transition-all rounded-xl shadow-sm hover:shadow-md outline outline-1 outline-slate-100 hover:outline-red-100">

                                        {/* KOLOM 1: Waktu & Pelapor */}
                                        <td className="px-6 py-4 align-top rounded-l-xl">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {formatDate(item.waktuTemuan)}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                    <MapPin size={14} />
                                                    {item.lokasi}
                                                </div>
                                                {/* PERBAIKAN TAMPILAN NAMA PELAPOR */}
                                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit text-[10px] font-bold mt-1 border border-blue-100">
                                                    <User size={12} />
                                                    {item.auditor ? item.auditor.name : "Tanpa Nama"}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 align-top max-w-xs">
                                            <div className="font-bold text-slate-800 mb-1">{item.judul}</div>
                                            <p className="text-slate-500 text-xs line-clamp-2">{item.deskripsi}</p>
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            {item.kondisi === "AMAN" ? (
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-200">
                                                    <ShieldCheck size={14} /> AMAN
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold border border-red-200">
                                                    <AlertOctagon size={14} /> PERBAIKAN
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.status === 'OPEN' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                item.status === 'CLOSED' ? 'bg-green-50 text-green-600 border-green-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 align-top text-center">
                                            {item.buktiFoto ? (
                                                <a href={item.buktiFoto} target="_blank" className="text-blue-600 hover:underline text-xs font-bold inline-flex items-center gap-1">
                                                    Lihat <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300 text-xs">-</span>
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