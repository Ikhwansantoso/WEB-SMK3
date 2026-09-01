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
  Activity,
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
      toast.error("Gagal memuat data monitoring");
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

    // Auto calculate status (misal tgl sekarang > 15 dianggap telat jika upload bulan lalu)
    const currentMonth = new Date().getMonth();
    const isLate =
      year < new Date().getFullYear() ||
      (year === new Date().getFullYear() && selectedCell.monthIndex < currentMonth);
    formData.append("status", isLate ? "2" : "1");

    const res = await uploadLaporan(formData);
    if (res.success) {
      toast.success("Laporan berhasil diunggah!");
      setModalOpen(false);
      fetchData(); // Refresh UI
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
    <div className="space-y-6 font-sans">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-2 rounded-xl">
              <Activity size={32} />
            </span>
            Monitoring Jam Kerja
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1 ml-16">
            Monitoring laporan bulanan jam kerja & absensi K3 Witel Telkom Regional 3.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" />
              Sudah Lapor
            </div>
            <div className="flex items-center gap-1.5">
              <Plus size={14} className="text-slate-400 dark:text-slate-500" />
              Tambah Laporan
            </div>
          </div>

          {/* Tahun Selector */}
          <div className="relative group">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 text-slate-700 dark:text-slate-200 font-bold py-2.5 pl-4 pr-10 rounded-xl outline-none text-sm cursor-pointer transition shadow-sm"
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
        {/* Search Bar */}
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
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-50 dark:focus:ring-red-950/40 outline-none text-sm font-bold transition shadow-sm"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col mb-4">
          {/* Header Tabel */}
          <div className="grid grid-cols-[280px_1fr] bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700 text-[11px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-wider relative z-10 shadow-sm">
            <div className="p-4 border-r border-slate-200 dark:border-slate-700 flex items-center bg-slate-50 dark:bg-slate-800/80">
              UNIT / WITEL
            </div>
            <div className="grid grid-cols-12">
              {BULAN.map((bln, i) => (
                <div
                  key={i}
                  className="p-4 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0"
                >
                  {bln}
                </div>
              ))}
            </div>
          </div>

          {/* Body Tabel */}
          <div className="overflow-y-auto custom-scrollbar flex-1 divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {loading ? (
              <div className="p-20 text-center text-slate-400 flex flex-col items-center">
                <Loader2 className="animate-spin mb-3 text-red-500" size={32} />
                <span className="font-bold">Memuat Data Monitoring...</span>
              </div>
            ) : (
              filteredData.map((witel) => (
                <div
                  key={witel.id}
                  className="grid grid-cols-[280px_1fr] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  <div className="p-4 border-r border-slate-100 dark:border-slate-800 flex items-center font-bold text-slate-700 dark:text-slate-200 text-xs bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 transition">
                    {witel.nama}
                  </div>

                  <div className="grid grid-cols-12">
                    {BULAN.map((_, idx) => {
                      const laporan = getLaporanStatus(witel.laporan, idx);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-center p-2 border-r border-slate-50 dark:border-slate-800/50 last:border-r-0"
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
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:scale-105 shadow-sm"
                              : "bg-white dark:bg-slate-800/60 border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                              }`}
                            title={laporan ? "Sudah Lapor" : "Belum Lapor"}
                          >
                            {laporan ? (
                              <div className="flex flex-col items-center gap-1">
                                <CheckCircle
                                  size={22}
                                  className="fill-emerald-100 dark:fill-emerald-950"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                  {selectedCell.witelName}
                </h3>
                <p className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase mt-1 tracking-wider">
                  Laporan Bulan: {BULAN[selectedCell.monthIndex]} {year}
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="relative z-10 p-2 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full transition-colors group">
                <X size={20} className="text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
              </button>
            </div>

            <div className="p-6">
              {!selectedCell.laporan ? (
                <div className="text-center">
                  <div
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-md p-8 mb-4 hover:bg-white dark:hover:bg-slate-800/80 hover:border-red-400 transition cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-md shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-red-500 transition border border-slate-100 dark:border-slate-700">
                      {uploading ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <Upload size={24} />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-200">
                      Upload Dokumen PDF
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
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
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-md mb-4 flex items-center gap-4">
                    <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                        File Tersedia
                      </p>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 truncate mt-0.5">
                        {selectedCell.laporan.fileName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={selectedCell.laporan.fileUrl}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-md text-xs font-bold hover:bg-slate-700 dark:hover:bg-slate-600 transition"
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
                      className="flex items-center justify-center px-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
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
