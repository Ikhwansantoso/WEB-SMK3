import { prisma } from "@/lib/prisma"; 
import Link from "next/link";
import { Folder, FileText } from "lucide-react";

export default async function PegawaiIpbrPage() {
  const divisiList = await prisma.divisi.findMany({
    include: { _count: { select: { dokumen: true } } },
    orderBy: { nama: "asc" },
  });

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Repository Dokumen K3</h1>
      <p className="text-slate-500 mb-8">Pilih divisi untuk melihat dokumen PDF.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisiList.map((div) => (
          <Link href={`/pegawai/ipbr/${div.id}`} key={div.id} className="group">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              <Folder className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-blue-50 transition-colors" size={100} />
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Folder size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{div.nama}</h3>
                    <span className="text-xs text-slate-500">{div._count.dokumen} Dokumen</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}