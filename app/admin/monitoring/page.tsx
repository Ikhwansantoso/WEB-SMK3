"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  CheckCircle,
  X,
  Loader2,
  Upload,
  Eye,
  Trash2,
  ChevronDown,
  FileText,
  Plus,
} from "lucide-react";
import {
  getMonitoringData,
  uploadLaporan,
  deleteLaporan,
} from "@/app/actions/laporan";
import toast from "react-hot-toast";

const BULAN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

export default function MonitoringPage() {
  const [dataWitel, setDataWitel] = useState<any[]>([]);
  const [year, setYear] = useState(2025);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // STATE MODAL
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, [year]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getMonitoringData(year);
      setDataWitel(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCell) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("witelId", selectedCell.witelId.toString());
    formData.append("bulanIndex", selectedCell.monthIndex.toString());
    formData.append("tahun", year.toString());
    const res = await uploadLaporan(formData);
    if (res.success) {
      toast.success("Laporan berhasil diunggah");
      setModalOpen(false);
      fetchData();
    } else {
      toast.error("Gagal mengunggah laporan: " + res.message);
    }
    setUploading(false);
  };

  const handleDelete = async (laporanId: number, fileUrl: string) => {
    if (!window.confirm("Hapus laporan ini permanen?")) return;

    // We can use a toast promise here for better UX
    const deletePromise = deleteLaporan(laporanId, fileUrl);

    toast.promise(deletePromise, {
      loading: 'Menghapus laporan...',
      success: 'Laporan berhasil dihapus',
      error: 'Gagal menghapus laporan'
    });

    const res = await deletePromise;
    if (res.success) {
      setModalOpen(false);
      fetchData();
    }
  };

  const getLaporanStatus = (laporanList: any[], monthIndex: number) => {
    return laporanList.find((l: any) => l.bulanIndex === monthIndex) || null;
  };

  const filteredData = dataWitel.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCellClick = (
    witelId: number,
    witelName: string,
    monthIndex: number,
    laporan: any,
  ) => {
    setSelectedCell({ witelId, witelName, monthIndex, laporan });
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans overflow-hidden">
      {/* 1. HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-30 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-red-600 tracking-tight uppercase">
            Monitoring Jam Kerja
          </h1>
          <p className="text-xs text-slate-500 font-bold">Telkom Regional 3</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
              Sudah Lapor
            </div>
            <div className="flex items-center gap-1.5">
              <Plus size={14} className="text-slate-400" />
              Tambah Laporan
            </div>
          </div>

          {/* Tahun Selector */}
          <div className="relative group">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 hover:border-red-500 text-slate-700 font-bold py-2 pl-4 pr-10 rounded-lg outline-none text-sm cursor-pointer transition shadow-sm"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-red-500"
              size={14}
            />
          </div>
        </div>
      </div>

      {/* 2. TABLE AREA */}
      <div className="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
        {/* Search Bar (DIPERBAIKI: Tidak transparan lagi) */}
        <div className="mb-4 shrink-0 max-w-md relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari Unit / Witel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // bg-white: Background putih solid
            // border-slate-300: Garis lebih tegas
            // rounded-lg: Sudut tidak terlalu bulat (lebih kotak)
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-50 outline-none text-sm font-bold transition shadow-sm"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col mb-4">
          {/* Header Tabel */}
          <div className="grid grid-cols-[280px_1fr] bg-slate-50 border-b-2 border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider relative z-10 shadow-sm">
            <div className="p-4 border-r border-slate-200 flex items-center bg-slate-50">
              UNIT / WITEL
            </div>
            <div className="grid grid-cols-12">
              {BULAN.map((bln, i) => (
                <div
                  key={i}
                  className="p-4 text-center border-r border-slate-200 last:border-r-0"
                >
                  {bln}
                </div>
              ))}
            </div>
          </div>

          {/* Body Tabel */}
          <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-slate-100 bg-white">
            {loading ? (
              <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                <Loader2 className="animate-spin mb-3 text-red-500" size={32} />
                <span className="font-bold">Memuat Data Monitoring...</span>
              </div>
            ) : (
              filteredData.map((witel) => (
                <div
                  key={witel.id}
                  className="grid grid-cols-[280px_1fr] hover:bg-slate-50 transition group"
                >
                  <div className="p-4 border-r border-slate-100 flex items-center font-bold text-slate-700 text-xs bg-white group-hover:bg-slate-50 transition">
                    {witel.nama}
                  </div>

                  <div className="grid grid-cols-12">
                    {BULAN.map((_, idx) => {
                      const laporan = getLaporanStatus(witel.laporan, idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-center p-2 border-r border-slate-50 last:border-r-0"
                        >
                          <button
                            onClick={() =>
                              handleCellClick(
                                witel.id,
                                witel.nama,
                                idx,
                                laporan,
                              )
                            }
                            className={`w-full h-14 rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${laporan
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100 hover:scale-105 shadow-sm"
                              : "bg-white border-dashed border-slate-200 text-slate-300 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
                              }`}
                            title={laporan ? "Sudah Lapor" : "Belum Lapor"}
                          >
                            {laporan ? (
                              <div className="flex flex-col items-center gap-1">
                                <CheckCircle
                                  size={22}
                                  className="fill-emerald-100"
                                />
                                <span className="text-[9px] font-bold uppercase">
                                  Ada
                                </span>
                              </div>
                            ) : (
                              <Plus size={24} strokeWidth={3} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL UPLOAD / VIEW */}
      {modalOpen && selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-extrabold text-slate-800 text-base">
                  {selectedCell.witelName}
                </h3>
                <p className="text-[10px] text-red-600 font-bold uppercase mt-1 tracking-wider">
                  Laporan Bulan: {BULAN[selectedCell.monthIndex]} {year}
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="relative z-10 p-2 hover:bg-red-100 rounded-full transition-colors group">
                <X size={20} className="text-slate-400 group-hover:text-red-600 transition-colors" />
              </button>
            </div>

            <div className="p-6">
              {!selectedCell.laporan ? (
                <div className="text-center">
                  {/* KOTAK UPLOAD: rounded-md (KOTAK TEGAS) */}
                  <div
                    className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-md p-8 mb-4 hover:bg-white hover:border-red-400 transition cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-white rounded-md shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-red-500 transition border border-slate-100">
                      {uploading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <Upload size={24} />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-600">
                      Upload Dokumen PDF
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik di sini untuk memilih file
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-md mb-4 flex items-center gap-4">
                    <FileText className="text-emerald-600" size={24} />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        File Tersedia
                      </p>
                      <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">
                        {selectedCell.laporan.fileName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={selectedCell.laporan.fileUrl}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-md text-xs font-bold hover:bg-slate-700 transition"
                    >
                      <Eye size={16} /> BUKA PDF
                    </a>
                    <button
                      onClick={() =>
                        handleDelete(
                          selectedCell.laporan.id,
                          selectedCell.laporan.fileUrl,
                        )
                      }
                      className="flex items-center justify-center px-4 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
