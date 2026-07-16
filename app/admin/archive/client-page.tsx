'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { createDocumentArchive, updateDocumentArchive, deleteDocumentArchive } from "@/app/actions/documentArchive"
import {
  Plus, Trash2, Edit, FileText, Image as ImageIcon, Download, Search, Filter,
  X, Eye, Calendar, FolderArchive, ArrowLeft, Loader2, CheckCircle2, AlertCircle, RefreshCcw
} from "lucide-react"
import toast from "react-hot-toast"

type DocumentItem = {
  id: string
  documentNumber: string | null
  title: string
  documentType: string
  documentDate: Date
  division: string
  digitalStatus: string
  filePath: string | null
  createdAt: Date
  updatedAt: Date
}

const DOCUMENT_TYPES = [
  "Nota Dinas",
  "Surat Masuk",
  "Surat Keluar",
  "Berita Acara",
  "BAST",
  "Dokumen SMK3",
  "Dokumen Aset",
  "Memo",
  "Lainnya"
]

export default function ArchiveClientPage({
  initialDocuments,
  userRole
}: {
  initialDocuments: DocumentItem[]
  userRole?: string
}) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const [loading, setLoading] = useState(false)
  const [showFormModal, setShowFormModal] = useState(false)
  const [editDoc, setEditDoc] = useState<DocumentItem | null>(null)
  const [detailDoc, setDetailDoc] = useState<DocumentItem | null>(null)

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const isAdmin = userRole === "ADMIN"
  // Pegawai is now allowed to add/edit archives too!
  const isPegawai = userRole === "PEGAWAI"
  const canModify = isAdmin || isPegawai

  // Filter logic
  const filteredDocuments = documents.filter(doc => {
    const docDate = new Date(doc.documentDate)
    const docYear = docDate.getFullYear().toString()

    const matchesSearch =
      (doc.documentNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase())

    const matchesType = filterType ? doc.documentType === filterType : true
    const matchesStatus = filterStatus ? doc.digitalStatus === filterStatus : true
    const matchesYear = filterYear ? docYear === filterYear : true

    return matchesSearch && matchesType && matchesStatus && matchesYear
  })

  // Extract unique years for filter
  const uniqueYears = Array.from(new Set(documents.map(doc => {
    return new Date(doc.documentDate).getFullYear().toString()
  }))).sort((a, b) => b.localeCompare(a))

  const handleDelete = async (id: string) => {
    // Only Admin can delete documents
    if (!isAdmin) {
      toast.error("Hanya Admin yang dapat menghapus dokumen!")
      return
    }
    if (confirm("Apakah Anda yakin ingin menghapus dokumen ini? File scan fisik juga akan dihapus.")) {
      setLoading(true)
      const res = await deleteDocumentArchive(id)
      if (res.success) {
        toast.success(res.message || "Dokumen berhasil dihapus")
        setDocuments(documents.filter(d => d.id !== id))
        if (detailDoc?.id === id) setDetailDoc(null)
      } else {
        toast.error(res.message || "Gagal menghapus dokumen")
      }
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditDoc(null)
    setSelectedFileName(null)
    setShowFormModal(true)
  }

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditDoc(doc)
    setSelectedFileName(doc.filePath ? doc.filePath.split('/').pop() || null : null)
    setShowFormModal(true)
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    let res
    if (editDoc) {
      res = await updateDocumentArchive(editDoc.id, formData)
    } else {
      res = await createDocumentArchive(formData)
    }

    if (res.success) {
      toast.success(res.message || "Berhasil menyimpan dokumen")
      window.location.reload()
    } else {
      toast.error(res.message || "Gagal menyimpan dokumen")
      setLoading(false)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
    } else {
      setSelectedFileName(null)
    }
  }

  const resetFilters = () => {
    setSearch("")
    setFilterType("")
    setFilterStatus("")
    setFilterYear("")
  }

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FolderArchive className="text-red-600 shrink-0" size={32} />
            Arsip Dokumen K3 & General Support
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Digitalisasi, pencarian, dan monitoring dokumen fisik departemen.</p>
        </div>
        {canModify && (
          <button
            onClick={handleOpenAdd}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95 w-full md:w-auto justify-center shrink-0"
          >
            <Plus size={20} />
            Tambah Dokumen
          </button>
        )}
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Filter size={16} /> Filter & Pencarian
          </h3>
          {(search || filterType || filterStatus || filterYear) && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition"
            >
              <RefreshCcw size={12} /> Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan Nomor, Judul, atau Jenis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500 transition text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500 transition text-sm font-medium text-slate-800"
            >
              <option value="">Semua Jenis Dokumen</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500 transition text-sm font-medium text-slate-800"
            >
              <option value="">Semua Status Digital</option>
              <option value="Sudah Digital">Sudah Digital</option>
              <option value="Belum Digital">Belum Digital</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          <div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-red-500 transition text-sm font-medium text-slate-800"
            >
              <option value="">Semua Tahun Dokumen</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50">
            <FolderArchive className="mx-auto text-slate-300 mb-3" size={48} />
            <p className="text-slate-800 font-bold text-lg">Dokumen Tidak Ditemukan</p>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">Coba sesuaikan kata kunci pencarian atau filter yang Anda terapkan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Nomor Dokumen</th>
                  <th className="px-6 py-4">Judul Dokumen</th>
                  <th className="px-6 py-4">Jenis</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Divisi</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Scan</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDocuments.map((doc) => {
                  const dateStr = new Date(doc.documentDate).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-bold text-slate-800">{doc.documentNumber || "-"}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700 max-w-xs truncate">{doc.title}</td>
                      <td className="px-6 py-4">{doc.documentType}</td>
                      <td className="px-6 py-4 font-medium text-slate-500">{dateStr}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">{doc.division}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${doc.digitalStatus === "Sudah Digital"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.digitalStatus === "Sudah Digital" ? "bg-green-500" : "bg-amber-500"
                            }`}></span>
                          {doc.digitalStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {doc.filePath ? (
                          <span className="text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1 text-xs">
                            <FileText size={14} /> Tersedia
                          </span>
                        ) : (
                          <span className="text-slate-400 inline-flex items-center gap-1 text-xs">
                            Tidak Ada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setDetailDoc(doc)}
                            title="Lihat Detail & Preview"
                            className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-500 hover:border-red-100 transition-colors shadow-sm"
                          >
                            <Eye size={15} />
                          </button>

                          {canModify && (
                            <button
                              onClick={() => handleOpenEdit(doc)}
                              title="Edit Dokumen"
                              className="p-2 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-500 hover:border-blue-100 transition-colors shadow-sm"
                            >
                              <Edit size={15} />
                            </button>
                          )}

                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(doc.id)}
                              title="Hapus Dokumen"
                              className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-500 hover:border-red-100 transition-colors shadow-sm"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM MODAL (ADD & EDIT) */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar border border-slate-100">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4 flex items-center gap-2">
              <FolderArchive className="text-red-600" size={24} />
              {editDoc ? "Edit Dokumen Arsip" : "Tambah Dokumen Baru"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Nomor Dokumen</label>
                <input
                  name="documentNumber"
                  defaultValue={editDoc?.documentNumber || ""}
                  placeholder="Contoh: ND.102/LOG-R3/2026 "
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Judul Dokumen</label>
                <input
                  name="title"
                  defaultValue={editDoc?.title || ""}
                  required
                  placeholder="Contoh: Pengadaan Kursi Kerja Ergonomis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Jenis Dokumen</label>
                  <select
                    name="documentType"
                    defaultValue={editDoc?.documentType || "Nota Dinas"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 transition-all font-semibold"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Tanggal Dokumen</label>
                  <input
                    name="documentDate"
                    type="date"
                    required
                    defaultValue={editDoc ? new Date(editDoc.documentDate).toISOString().split('T')[0] : ""}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Divisi</label>
                  <input
                    name="division"
                    required
                    defaultValue={editDoc?.division || "General Support"}
                    placeholder="General Support"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Status Digitalisasi</label>
                  <select
                    name="digitalStatus"
                    defaultValue={editDoc?.digitalStatus || "Sudah Digital"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-red-500 transition-all font-semibold"
                  >
                    <option value="Sudah Digital">Sudah Digital</option>
                    <option value="Belum Digital">Belum Digital</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block tracking-wider">Upload Scan Dokumen (PDF, JPG, PNG)</label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 text-center hover:bg-slate-100/50 transition cursor-pointer group">
                  <input
                    name="file"
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <ImageIcon className="text-slate-400 group-hover:text-red-500 transition" size={28} />
                    <span className="text-xs font-bold text-slate-600">
                      {selectedFileName ? selectedFileName : "Klik atau seret file ke sini"}
                    </span>
                    <span className="text-[10px] text-slate-400">PDF, JPG, atau PNG (Maks 10MB)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-500 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-100 hover:shadow-lg transition flex items-center gap-2 active:scale-95 disabled:opacity-55"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Menyimpan...
                    </>
                  ) : (
                    "Simpan Dokumen"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL WITH PREVIEW */}
      {detailDoc && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
            <button
              onClick={() => setDetailDoc(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-slate-800 border-b pb-4 flex items-center gap-2 shrink-0">
              <FolderArchive className="text-red-600" size={24} />
              Detail Dokumen Arsip
            </h2>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-4">
              {/* Left Column: Metadata */}
              <div className="w-full lg:w-80 space-y-4 shrink-0 lg:overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-slate-50 p-4 rounded-xl space-y-3.5 border border-slate-200/50">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nomor Dokumen</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{detailDoc.documentNumber || "-"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Judul Dokumen</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5 leading-snug">{detailDoc.title}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Jenis Dokumen</span>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{detailDoc.documentType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tanggal Dokumen</span>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5 flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(detailDoc.documentDate).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Divisi Pemilik</span>
                    <p className="font-semibold text-slate-700 text-sm mt-0.5">{detailDoc.division}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status Digitalisasi</span>
                    <div className="mt-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-sm ${detailDoc.digitalStatus === "Sudah Digital"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${detailDoc.digitalStatus === "Sudah Digital" ? "bg-green-500" : "bg-amber-500"
                          }`}></span>
                        {detailDoc.digitalStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {detailDoc.filePath && (
                  <a
                    href={detailDoc.filePath}
                    download
                    className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold py-3 rounded-xl border border-red-200 transition-colors shadow-sm"
                  >
                    <Download size={16} /> Download File Scan
                  </a>
                )}
              </div>

              {/* Right Column: File Preview */}
              <div className="flex-1 flex flex-col bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 min-h-[300px] lg:min-h-0">
                {detailDoc.filePath ? (
                  detailDoc.filePath.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={`${detailDoc.filePath}#toolbar=0`}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                      <img
                        src={detailDoc.filePath}
                        alt="Scan Preview"
                        className="max-w-full max-h-full object-contain rounded shadow"
                      />
                    </div>
                  )
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-6 bg-slate-50/50">
                    <FileText size={48} className="text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">Belum Ada File Scan</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">Dokumen fisik ini belum melewati proses scanning atau upload file.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
