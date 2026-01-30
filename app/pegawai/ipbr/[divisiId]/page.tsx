import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Eye, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PegawaiDokumenPage({ params }: { params: Promise<{ divisiId: string }> }) {
  const { divisiId } = await params;
  const divisi = await prisma.divisi.findUnique({
    where: { id: divisiId },
    include: { dokumen: { orderBy: { createdAt: "desc" } } },
  });

  if (!divisi) return notFound();

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <Link href="/pegawai/ipbr" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium text-sm">
        <ArrowLeft size={18} /> Kembali
      </Link>

      <div className="mb-6">
        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">DIVISI</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">{divisi.nama}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {divisi.dokumen.length === 0 ? (
          <div className="p-10 text-center text-slate-400">Belum ada dokumen di folder ini.</div>
        ) : (
          <div className="divide-y divide-slate-100">
              {divisi.dokumen.map((doc) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                              <FileText size={20} />
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-700 text-sm">{doc.judul}</h4>
                              <p className="text-xs text-slate-400">{doc.nomorDokumen || "Tanpa Nomor"}</p>
                          </div>
                      </div>
                      <a href={doc.fileUrl || "#"} target="_blank" className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100">
                          Buka PDF
                      </a>
                  </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}